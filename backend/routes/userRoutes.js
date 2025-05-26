const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, createAdmin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.post('/admin', protect, createAdmin);

module.exports = router;
