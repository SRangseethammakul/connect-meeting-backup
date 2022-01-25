const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.verifyWebHook);
router.post('/', messageController.receive);

module.exports = router;
