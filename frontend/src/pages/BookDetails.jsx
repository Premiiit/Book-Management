import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from '../utils/axiosInstance';
import {jwtDecode} from 'jwt-decode';

export default function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch book details
  useEffect(() => {
    setLoadingBook(true);
    axios.get(`/books/${id}`)
      .then(res => {
        setBook(res.data);
        setLoadingBook(false);
      })
      .catch(() => {
        setError("Failed to load book details.");
        setLoadingBook(false);
      });
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    setLoadingReviews(true);
    axios.get(`/reviews?bookId=${id}`)
      .then(res => {
        setReviews(res.data);
        setLoadingReviews(false);
      })
      .catch(() => {
        setError("Failed to load reviews.");
        setLoadingReviews(false);
      });
  }, [id]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("user");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  };

  // Submit review handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Please log in to submit a review");
        return;
      }

      const response = await axios.post("/reviews", {
        bookId: id,
        userId,
        rating,
        comment
      });
      setComment("");
      setRating(5);

      if(response.status === 201){
        console.log(response.data)
        alert("Review submitted successfully")
      }else if(response.status === 400){
        alert('You have already reviewed the book')
      }else{
        alert("Some problem occured")
        console.log(response.data)
      }

      // Refresh reviews after submit
      const res = await axios.get(`/reviews?bookId=${id}`);
      setReviews(res.data);
    } catch {
      alert("Failed to submit review.");
    }
    setSubmitting(false);
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loadingBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Link 
            to="/books" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Book not found</h3>
          <p className="text-slate-600 mb-6">The book you're looking for doesn't exist.</p>
          <Link 
            to="/books" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Explore Other Books
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">Home</Link>
            <span className="text-slate-400">›</span>
            <Link to="/books" className="text-indigo-600 hover:text-indigo-800 transition-colors">Books</Link>
            <span className="text-slate-400">›</span>
            <span className="text-slate-600 truncate max-w-xs">{book.title}</span>
          </div>
        </nav>

        {/* Book Details Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-12">
          <div className="lg:flex">
            {/* Book Cover */}
            <div className="lg:w-1/3 bg-gradient-to-br from-indigo-50 to-blue-50 p-8 flex items-center justify-center">
              <div className="relative group">
                <img
                  src={book.coverImage || 'https://via.placeholder.com/400x600/6366f1/ffffff?text=No+Cover'}
                  alt={book.title}
                  className="w-80 h-auto rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Book Info */}
            <div className="lg:w-2/3 p-8 lg:p-12">
              <div className="mb-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                  {book.title}
                </h1>
                <p className="text-xl text-slate-600 font-medium mb-6">by {book.author}</p>
                
                {/* Rating Summary */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-2xl ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-slate-200'}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{averageRating}</span>
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">{reviews.length}</span> {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>

                {/* Genre Tags */}
                {book.genre && (
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                      {book.genre}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">About this book</h3>
                <p className="text-slate-700 leading-relaxed">
                  {book.description || "No description available for this book."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center">
                  <span className="mr-3">💬</span>
                  Reader Reviews
                </h2>
                {reviews.length > 0 && (
                  <div className="text-slate-600">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                )}
              </div>

              {/* Rating Distribution */}
              {reviews.length > 0 && (
                <div className="mb-8 p-6 bg-slate-50 rounded-xl">
                  <h4 className="font-semibold text-slate-800 mb-4">Rating Breakdown</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-slate-600 w-6">{star}★</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${reviews.length > 0 ? (ratingDistribution[star] / reviews.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-8">{ratingDistribution[star]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loadingReviews ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h4 className="text-xl font-semibold text-slate-800 mb-2">No reviews yet</h4>
                  <p className="text-slate-600">Be the first to share your thoughts about this book!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div 
                      key={review._id} 
                      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animation: `fadeInUp 0.6s ease-out forwards`
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {review.userId?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">User {review.userId}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-slate-200'}`}
                                >
                                  ⭐
                                </span>
                              ))}
                              <span className="text-sm font-semibold text-slate-700 ml-2">{review.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="mr-3">✍️</span>
                Write a Review
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-colors duration-200 ${
                          star <= rating ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'
                        }`}
                        disabled={submitting}
                      >
                        ⭐
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-slate-600">({rating}/5)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                    rows={6}
                    placeholder="Share your thoughts about this book..."
                    required
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Publishing...</span>
                    </div>
                  ) : (
                    'Publish Review'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}