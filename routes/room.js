const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.index);
router.get('/:id', roomController.show);
router.post('/', roomController.insert);
router.put('/:id', roomController.edit);
router.delete('/:id', roomController.destroy);

module.exports = router;
