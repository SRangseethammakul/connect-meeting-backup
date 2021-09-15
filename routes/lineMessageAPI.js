const express = require('express');
const router = express.Router();
const lineMesaageController = require('../controllers/lineMesaageController');

router.get('/', lineMesaageController.index);
router.post('/', lineMesaageController.responeAPI);

module.exports = router;
