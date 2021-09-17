const express = require('express');
const router = express.Router();
const lineMesaageController = require('../controllers/lineMesaageController');

router.get('/', lineMesaageController.index);
router.post('/middle', lineMesaageController.responeMiddle);
router.post('/dialog', lineMesaageController.dialogflow);

module.exports = router;
