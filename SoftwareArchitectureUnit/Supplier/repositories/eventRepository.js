const {
  EventAuthorizationMode,
} = require('../../utils/constants/eventAuthorizationMode');
const { EventStatus } = require('../../utils/constants/eventStatus');
const Event = require('../models/event');

const queriesQueue = require('../Queue/queriesQueue');
const Action = require('../../utils/constants/QueryActions');

class EventRepository {
  async createEvent(
    name,
    description,
    price,
    eventDatesInfo,
    thumbnail,
    mainImage,
    category,
    video,
    supplier,
  ) {
    const newEvent = await Event.create({
      name,
      description,
      price,
      eventDatesInfo,
      thumbnail,
      mainImage,
      category,
      video,
      supplier,
    });

    queriesQueue.enqueueTask(newEvent, Action.CREATE_EVENT);
    return newEvent;
  }

  async getEvent(eventId) {
    const event = await Event.findById(eventId).populate('supplier').exec();
    return event;
  }

  async editEvent(
    eventId,
    name,
    description,
    price,
    eventDatesInfo,
    thumbnail,
    mainImage,
    category,
    video,
  ) {
    const editedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        name,
        description,
        price,
        eventDatesInfo,
        thumbnail,
        mainImage,
        category,
        video,
        statusInfo: {
          status: EventStatus.PENDING,
        },
      },
      { new: true },
    );

    queriesQueue.enqueueTask(editedEvent, Action.UPDATE_EVENT);
    return editedEvent;
  }

  async authorizeEvent(eventId, url) {
    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        statusInfo: {
          status: EventStatus.APPROVED,
        },
        authorizationMode: EventAuthorizationMode.AUTO,
        validationDate: Date.now(),
        eventURL: url,
      },
      { new: true },
    );

    queriesQueue.enqueueTask(event, Action.UPDATE_EVENT);
    return event;
  }

  async rejectEvent(eventId) {
    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        statusInfo: {
          status: EventStatus.REJECTED,
        },
        authorizationMode: EventAuthorizationMode.AUTO,
        validationDate: Date.now(),
      },
      { new: true },
    );

    queriesQueue.enqueueTask(event, Action.UPDATE_EVENT);
    return event;
  }

  async confirmEmailSent(eventId) {
    const event = await Event.findByIdAndUpdate(eventId, { $inc: { 'emails.emailsSent': 1 } });
    queriesQueue.enqueueTask(event, Action.UPDATE_EVENT);
  }

  async confirmEmailFailed(eventId) {
    const event = await Event.findByIdAndUpdate(eventId, { $inc: { 'emails.emailsFailed': 1 } });
    queriesQueue.enqueueTask(event, Action.UPDATE_EVENT);
  }
}

module.exports = EventRepository;
