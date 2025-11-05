const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getSwappableSlots, requestSwap, respondSwap, getMySwapRequests } = require('../controllers/swapController');

const router = express.Router();

router.get('/swappable-slots', protect, getSwappableSlots);
router.get('/swap-requests', protect, getMySwapRequests);
router.post('/swap-request', protect, requestSwap);
router.post('/swap-response/:requestId', protect, respondSwap);

module.exports = router;
