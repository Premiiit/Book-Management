const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  addBook, 
  getFeaturedBooks
} = require('../controllers/bookController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllBooks);
router.get('/featured', getFeaturedBooks);
router.get('/:id', getBookById);
router.post('/', protect, admin,  addBook);


module.exports = router;
