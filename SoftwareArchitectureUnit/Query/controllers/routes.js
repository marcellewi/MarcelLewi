const express = require('express');
const supplierAuth = require('../middlewares/supplierAuth');
const adminAuth = require('../middlewares/adminAuth');
const clientAuth = require('../middlewares/clientAuth');

const QueryController = require('./controller');

const query = new QueryController();

const router = express.Router();

router.get('/supplier/events', supplierAuth, (req, res) => query.getSupplierEvents(req, res));
router.get('/supplier/events/:eventId', [supplierAuth, supplierAuth], (req, res) => query.getEvent(req, res));
router.get('/admin/active-events', adminAuth, (req, res) => query.getActiveEvents(req, res));
router.get('/admin/events', adminAuth, (req, res) => query.getAdminEvents(req, res));
router.get('/client/events', clientAuth, (req, res) => query.getClientEvents(req, res));

module.exports = router;
