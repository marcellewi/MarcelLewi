const express = require('express');
const ClientController = require('./controller');
const clientAuth = require('../middlewares/clientAuth');
const verifyPayment = require('../middlewares/verifyPayment');

const router = new express.Router();
const client = new ClientController();

router.post('/client', (req, res) => client.register(req, res));
router.post('/client/confirmPayment', (req, res) => client.confirmPayment(req, res));
router.post('/client/event', clientAuth, (req, res) => client.buyEvent(req, res));
router.get('/client/events', clientAuth, (req, res) => client.lookUpEvents(req, res));
router.get('/client/events/:eventId', clientAuth, verifyPayment, (req, res) => {
    const startRequestTimeStamp = Date.now();
    client.consumeEvent(req, res, startRequestTimeStamp)
});

module.exports = router;
