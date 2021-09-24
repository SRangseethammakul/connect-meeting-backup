const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.index);
router.delete('/:id', bookingController.destroy);

module.exports = router;
