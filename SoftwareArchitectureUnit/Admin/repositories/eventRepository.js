const moment = require('moment');
const {
  EventAuthorizationMode,
} = require('../../utils/constants/eventAuthorizationMode');
const { EventStatus } = require('../../utils/constants/eventStatus');
const Event = require('../models/event');

module.exports = class EventRepository {
  async authorizeEvent(eventId, adminId, url) {
    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        statusInfo: {
          status: EventStatus.APPROVED,
        },
        authorizationMode: EventAuthorizationMode.MANUAL,
        validatedBy: adminId,
        validationDate: Date.now(),
        eventURL: url,
      },
      { new: true },
    );

    return event;
  }

  async rejectEvent(eventId, adminId) {
    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        statusInfo: {
          status: EventStatus.REJECTED,
        },
        authorizationMode: EventAuthorizationMode.MANUAL,
        validatedBy: adminId,
        validationDate: Date.now(),
      },
      { new: true },
    );
    return event;
  }

  async getEvent(eventId) {
    const event = await Event.findById(eventId).populate('supplier').exec();
    return event;
  }

  async getPendingEvents(hoursBeforeStart) {
    const fechaLimite = new Date(moment.now());
    fechaLimite.setHours(fechaLimite.getHours() + hoursBeforeStart);
    fechaLimite.setMinutes(0);
    fechaLimite.setSeconds(0);
    fechaLimite.setMilliseconds(0);
    let events = await Event.find({ autorizado: null });
    events = events.filter((event) => {
      event.eventDatesInfo.startDate.setSeconds(0);
      event.eventDatesInfo.startDate.setMinutes(0);
      event.eventDatesInfo.startDate.setMilliseconds(0);
      return event.eventDatesInfo.startDate.getTime() == fechaLimite.getTime();
    });
    return events;
  }
};
