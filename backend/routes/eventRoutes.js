const express = require('express');
const { getMyEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMyEvents);
router.post('/', protect, createEvent);
router.patch('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
