const Event = require('../models/event');
const { EventStatus } = require('../../utils/constants/eventStatus');

const queriesQueue = require('../Queue/queriesQueue');
const Action = require('../../utils/constants/QueryActions');

class eventRepository {
  async get(name) {
    const event = await Event.findOne({ name });
    return event;
  }

  async getById(eventId) {
    const event = await Event.findById(eventId);
    return event;
  }

  async getAll() {
    const currentDate = new Date();

    const docs = await Event.find({
      'statusInfo.status': EventStatus.APPROVED,
      'eventDatesInfo.endDate': { $gte: currentDate },
    });

    const events = docs.map((doc) => {
      const obj = doc.toObject();

      delete obj._id;
      delete obj.eventDatesInfo._id;
      delete obj.video;
      delete obj.eventURL;
      delete obj.statusInfo;
      delete obj.authorizationMode;
      delete obj.validetedBy;
      delete obj.validationDate;
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.buyers;
      delete obj.__v;

      return obj;
    });

    return events;
  }

  async addBuyerToEvent(clientId, eventName) {
    const newEvent = await Event.findOneAndUpdate(
      { name: eventName },
      { $push: { buyers: { client: clientId } } },
    );

    return newEvent;
  }
}

module.exports = eventRepository;
