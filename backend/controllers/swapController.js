const mongoose = require('mongoose');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

// GET all swappable slots (except my own)
async function getSwappableSlots(req, res, next) {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || null;
    const criteria = { status: 'SWAPPABLE' };
    if (userId) criteria.owner = { $ne: userId };

    const slots = await Event.find(criteria)
      .populate('owner', 'name email')
      .sort({ startTime: 1 });

    res.json(slots);
  } catch (err) {
    next(err);
  }
}

// POST request a swap
async function requestSwap(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { mySlotId, theirSlotId } = req.body;
    const userId = req.user._id || req.user.id;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ message: 'mySlotId and theirSlotId are required' });
    }

    const mySlot = await Event.findOne({ _id: mySlotId, owner: userId }).session(session);
    const theirSlot = await Event.findById(theirSlotId).session(session);

    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (String(theirSlot.owner) === String(userId)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cannot swap with yourself' });
    }

    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Slots are not swappable' });
    }

    const [swap] = await SwapRequest.create([
      {
        requester: userId,
        responder: theirSlot.owner,
        mySlot: mySlotId,
        theirSlot: theirSlotId,
      },
    ], { session });

    await Event.updateMany(
      { _id: { $in: [mySlotId, theirSlotId] } },
      { $set: { status: 'SWAP_PENDING' } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Swap request created', swap });
  } catch (err) {
    try { await session.abortTransaction(); } catch (_) {}
    try { session.endSession(); } catch (_) {}
    next(err);
  }
}

// POST respond to a swap (accept or reject)
async function respondSwap(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { requestId } = req.params;
    const { accept } = req.body;
    const userId = req.user._id || req.user.id;

    const request = await SwapRequest.findById(requestId).session(session);
    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Request not found' });
    }

    if (String(request.responder) !== String(userId)) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'PENDING') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Already handled' });
    }

    const mySlot = await Event.findById(request.mySlot).session(session);
    const theirSlot = await Event.findById(request.theirSlot).session(session);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Slots missing' });
    }

    if (!accept) {
      request.status = 'REJECTED';
      await request.save({ session });
      await Event.updateMany(
        { _id: { $in: [mySlot._id, theirSlot._id] } },
        { $set: { status: 'SWAPPABLE' } },
        { session }
      );
    } else {
      const tempOwner = mySlot.owner;
      mySlot.owner = theirSlot.owner;
      theirSlot.owner = tempOwner;

      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';
      request.status = 'ACCEPTED';

      await mySlot.save({ session });
      await theirSlot.save({ session });
      await request.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Swap processed successfully' });
  } catch (err) {
    try { await session.abortTransaction(); } catch (_) {}
    try { session.endSession(); } catch (_) {}
    next(err);
  }
}

async function getMySwapRequests(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const incoming = await SwapRequest.find({ responder: userId })
      .populate('requester', 'name email')
      .populate('mySlot theirSlot');
    const outgoing = await SwapRequest.find({ requester: userId })
      .populate('responder', 'name email')
      .populate('mySlot theirSlot');
    res.json({ incoming, outgoing });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSwappableSlots, requestSwap, respondSwap, getMySwapRequests };
