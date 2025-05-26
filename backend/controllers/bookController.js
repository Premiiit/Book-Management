const Book = require('../models/Book');

// GET /books - all books with pagination
exports.getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ]
    };

    const books = await Book.find(searchQuery).skip(skip).limit(limit);
    const total = await Book.countDocuments(search ? searchQuery : {});

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      books
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /books/:id - single book
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /books - add book (admin only)
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, coverImage } = req.body;
    const genreArray = genre.split(',').map(g => g.trim());

    const newBook = new Book({
      title,
      author,
      genre: genreArray,
      description,
      coverImage
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route GET /api/books/featured
exports.getFeaturedBooks = async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    const topRatedBooks = await Book.find().sort({ rating: -1 }).limit(5); // Top-rated overall

    const genreBooks = {};
    for (const genre of genres.slice(0, 5)) {
      const books = await Book.find({ genre: genre }).sort({ rating: -1 }).limit(5);
      genreBooks[genre] = books;
    }

    res.json({ topRated: topRatedBooks, genreBooks });
  } catch (err) {
    console.error('error in featuredBooks', err)
    res.status(500).json({ message: 'Failed to load featured books' });
  }
};

