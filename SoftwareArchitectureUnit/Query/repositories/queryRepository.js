const mongoose = require("mongoose");
const eventQuery = require("../models/eventQuery");
const supplierQuery = require("../models/supplierQuery");
const { EventStatus } = require("../../utils/constants/eventStatus");

class queryRepository {

  async getRegisteredEvents(startDate, endDate) {
    const events = eventQuery.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })

    return events
  }

  async getSupplierEvents(supplierId) {
    const ev = eventQuery
      .find({ supplier: new mongoose.Types.ObjectId(supplierId) })
      .exec();
    return ev;
  }

  async getEvent(event) {
    const ev = await eventQuery.findById(event);
    return ev;
  }

  async getActiveEvents() {
    const currentDate = new Date();
    const events = eventQuery
      .find({
        "statusInfo.status": EventStatus.APPROVED,
        "eventDatesInfo.startDate": { $lte: currentDate },
        "eventDatesInfo.endDate": { $gte: currentDate },
      })
      .exec();

    return events;
  }

  async getApprovedEventsByAuthMode(startDate, endDate) {
    const events = await eventQuery
      .aggregate([
        {
          $match: {
            "statusInfo.status": EventStatus.APPROVED,
            "statusInfo.updatedAt": {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: "$authorizationMode",
            events: { $push: "$$ROOT" },
            amount: { $sum: 1 },
          },
        },
      ])
      .exec();

      

    return events;
  }

  async getRejectedEvents(startDate, endDate) {
    const events = await eventQuery
      .find({
        "statusInfo.status": EventStatus.REJECTED,
        "statusInfo.updatedAt": {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .exec();

    return events;
  }

  async getSuscriptorsAmount(startDate, endDate) {
    const eventBuyers = await eventQuery
      .aggregate([
        {
          $match: {
            "statusInfo.status": EventStatus.APPROVED,
          },
        },
        {
          $unwind: "$buyers",
        },
        {
          $match: {
            "buyers.createdAt": {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: "$buyers.client",
          },
        },
      ])
      .exec();

    return eventBuyers.length;
  }

  async getEventsAmount(startDate, endDate) {
    const events = await eventQuery
      .find({
        "statusInfo.status": EventStatus.APPROVED || EventStatus.REJECTED,
        "statusInfo.updatedAt": {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .exec();

    return events.length;
  }

  async getPendingEventsAmount(endDate) {
    const events = await eventQuery
      .find({
        $or: [
          {
            "statusInfo.status": EventStatus.PENDING,
            "statusInfo.updatedAt": { $lte: new Date(endDate) },
          },
          {
            "statusInfo.status": EventStatus.REJECTED,
            "statusInfo.updatedAt": { $lte: new Date(endDate) },
          },
          {
            "statusInfo.status": EventStatus.APPROVED,
            "statusInfo.updatedAt": { $gte: new Date(endDate) },
          },
        ],
      })
      .exec();

    return events.length;
  }

  async getClientEvents(clientId, now) {
    const events = await eventQuery
      .find({
        $or: [
          {
            "buyers.client": clientId,
          },
          {
            "statusInfo.status": EventStatus.APPROVED,
            "eventDatesInfo.endDate": { $gte: new Date(now) },
          },
        ],
      })
      .exec();

    return events;
  }
}

module.exports = queryRepository;
