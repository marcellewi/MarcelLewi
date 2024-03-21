const express = require('express');
const SupplierController = require('./controller');
const supplierAuth = require('../middlewares/supplierAuth');
const eventSupplierAuth = require('../middlewares/eventSupplierAuth');
const upload = require('../middlewares/uploadFile');

const router = express.Router();
const supplierController = new SupplierController();

router.get('/supplier/events', (req, res) => {
  res.send('suppliers/events');
});

router.post('/supplier/events/confirmEmailSent', (req, res) => supplierController.confirmEmailSent(req, res));

router.post('/supplier/events', supplierAuth, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'mainImage', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), (req, res) => {
  supplierController.createEvent(req, res);
});

router.put('/supplier/events/:eventId', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'mainImage', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), [supplierAuth, eventSupplierAuth], (req, res) => {
  supplierController.editEvent(req, res);
});

router.post('/supplier/events/:eventId', [supplierAuth, eventSupplierAuth], (req, res) => {
  supplierController.sendEmailToEventBuyers(req, res);
});

module.exports = router;
