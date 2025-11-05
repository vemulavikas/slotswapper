const Event = require('../models/Event');

// Get all events for the logged-in user
async function getMyEvents(req, res, next) {
  try {
    const events = await Event.find({ owner: req.user._id || req.user.id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// Create a new event
async function createEvent(req, res, next) {
  try {
    const { title, startTime, endTime, status } = req.body;
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const event = await Event.create({
      title,
      startTime,
      endTime,
      status: status || 'BUSY',
      owner: req.user._id || req.user.id,
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

// Update an event
async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const update = req.body;
    const ownerId = req.user._id || req.user.id;
    const event = await Event.findOneAndUpdate({ _id: id, owner: ownerId }, update, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// Delete an event
async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const ownerId = req.user._id || req.user.id;
    const deleted = await Event.findOneAndDelete({ _id: id, owner: ownerId });
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyEvents, createEvent, updateEvent, deleteEvent };
