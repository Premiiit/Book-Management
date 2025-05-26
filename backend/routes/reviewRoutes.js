const express = require('express');
const router = express.Router();
const { getReviewsByBook, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getReviewsByBook);       // Public
router.post('/', protect, createReview); // Only logged-in users

module.exports = router;
