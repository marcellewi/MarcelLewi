const eventQuery = require("../models/eventQuery");
const supplierQuery = require("../models/supplierQuery");

class queryRepository {
  async createEvent(data) {
    const newEvent = await eventQuery.create(data);
    return newEvent;
  }

  async createSupplier(data) {
    const newSupplier = await supplierQuery.create(data);
    return newSupplier;
  }

  async updateEvent(data) {
    const ev = await eventQuery.findByIdAndUpdate(data._id, data);
    return ev;
  }

  async addBuyerToEvent(data) {
    eventQuery.findOne({name: data.eventName}).then((event) => {
      const buyersAmount = event.buyers.length;
      const newAveragePurchaseTime = (event.averagePurchaseTime * buyersAmount + data.requestTime) / (buyersAmount + 1);
    
      event.buyers.push(
        { client: data.clientId, purchaseTime: data.QueryRequestTimeStamp }
      )
      event.averagePurchaseTime = newAveragePurchaseTime;

      event.save();
    });
  }

  async consumeEvent(data) {
    const { waitingTime, eventId } = data;

    eventQuery.findById(eventId).then((event) => {
      const newVideoConcurrentClients = event.videoConcurrentClients + 1;
      const newAverageVideoTime =
        (event.averageVideoTime * `${event.videoConcurrentClients}` +
          waitingTime) /
        newVideoConcurrentClients;

      event.videoConcurrentClients = newVideoConcurrentClients;
      event.averageVideoTime = newAverageVideoTime;

      event.save();
    });
  }

  async getEvent(event, _supplier) {
    const ev = await eventQuery.findById(event);
    return ev;
  }
}

module.exports = queryRepository;
