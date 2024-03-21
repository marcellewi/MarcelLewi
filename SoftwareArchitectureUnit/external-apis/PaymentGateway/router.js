const express = require('express');
const PaymentGatewayAdapter = require('./PaymentGatewayAdapter');

const router = express.Router();
const paymentService = new PaymentGatewayAdapter();

router.get('/payment-gateway/authorized-user/:userId', (req, res) => paymentService.getAuthorizedUser(req, res));

module.exports = router;
