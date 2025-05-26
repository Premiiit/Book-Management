const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: [{ type: String }],
  description: String,
  coverImage: String,
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
