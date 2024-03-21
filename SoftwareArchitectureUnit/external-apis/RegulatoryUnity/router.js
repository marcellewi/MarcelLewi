const express = require('express');
const RegulatoryUnityAdapter = require('./RegulatoryUnityAdapter');

const router = express.Router();
const regulatoryService = new RegulatoryUnityAdapter();

router.get('/regulatory-unity/authorized-user/:uderId', (req, res) => regulatoryService.getAuthorizedUser(req, res));

module.exports = router;
