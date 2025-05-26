const Review = require('../models/Review');
const Book = require('../models/Book');

// GET /reviews?bookId=...
exports.getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.query;
    if (!bookId) return res.status(400).json({ message: 'Book ID is required' });

    const reviews = await Review.find({ book: bookId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /reviews
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Prevent duplicate reviews by same user
    const existing = await Review.findOne({ book: bookId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }

    const review = new Review({
      book: bookId,
      user: req.user._id,
      rating,
      comment
    });

    await review.save();

    // Recalculate book rating
    const reviews = await Review.find({ book: bookId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      rating: avgRating,
      numReviews: reviews.length
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
