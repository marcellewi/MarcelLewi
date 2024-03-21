const express = require('express');
const adminAuth = require('../middlewares/adminAuth');
const SupplierController = require('./supplierController');
const AdminController = require('./adminController');
const EventController = require('./eventController');

const router = new express.Router(); 
const supplierController = new SupplierController();
const adminController = new AdminController();
const eventController = new EventController();

// REQ 1
router.post('/admin/supplier', adminAuth, (req, res) => supplierController.create(req, res));

router.post('/admin', adminAuth, (req, res) => adminController.create(req, res));

router.put('/admin/events/:eventId/authorize', adminAuth, (req, res) => eventController.authorizeEvent(req, res));

router.put('/admin/events/:eventId/reject', adminAuth, (req, res) => eventController.rejectEvent(req, res));

router.put('/admin/events/authMode', adminAuth, (req, res) => eventController.changeAuthMode(req, res));

router.get('/admin/logs', adminAuth, (req, res) => adminController.logs(req, res));

router.put('/admin/notification-config', adminAuth, (req, res) => eventController.updateNotificationConfig(req, res));

router.get('/admin/notification-config', adminAuth, (req, res) => eventController.getNotificationConfig(req, res));

router.post('/admin/events/notification', adminAuth, (req, res) => eventController.notifyPendingEvents(req, res));

module.exports = router;
