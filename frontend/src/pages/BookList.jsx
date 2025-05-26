import { useState, useEffect } from "react";
import axios from '../utils/axiosInstance';
import { Link } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/books?page=${page}&search=${encodeURIComponent(search)}`);
      const data = res.data;
      console.log(data);

      if (Array.isArray(data.books)) {
        setBooks(data.books);
        setTotalPages(data.totalPages || 1);
      } else {
        setBooks([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('failed to fetch books:', error);
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mr-4">
              <span className="text-3xl">📚</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-slate-800">Book Collection</h1>
              <p className="text-slate-600 text-lg">Discover your next favorite read</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl w-full">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-lg">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80"
                />
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-slate-400 hover:text-slate-600 text-lg">✕</span>
                  </button>
                )}
              </div>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-r-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </form>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-indigo-600 font-semibold' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="mr-2">⊞</span>Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-indigo-600 font-semibold' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span className="mr-2">≡</span>List
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading amazing books...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && Array.isArray(books) && books.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No books found</h3>
            <p className="text-slate-600 mb-6">
              {search ? `No results for "${search}". Try adjusting your search terms.` : 'No books available at the moment.'}
            </p>
            {search && (
              <button
                onClick={clearSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Books Grid/List */}
        {!loading && Array.isArray(books) && books.length > 0 && (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12"
              : "space-y-4 mb-12"
          }>
            {books.map((book, index) => (
              viewMode === 'grid' ? (
                <BookCardGrid key={book._id} book={book} index={index} />
              ) : (
                <BookCardList key={book._id} book={book} index={index} />
              )
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-600 font-medium">
                Page {page} of {totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  ««
                </button>
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  ‹ Prev
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          page === pageNum
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  Next ›
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  »»
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Grid View Card Component
function BookCardGrid({ book, index }) {
  return (
    <Link to={`/books/${book._id}`}>
      <div 
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden border border-slate-100/50 backdrop-blur-sm"
        style={{ 
          animationDelay: `${index * 100}ms`,
          animation: `fadeInUp 0.6s ease-out forwards`
        }}
      >
        <div className="relative overflow-hidden">
          <img
            src={book.coverImage || 'https://via.placeholder.com/250x350/6366f1/ffffff?text=No+Cover'}
            alt={book.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {book.rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500 text-sm">⭐</span>
                <span className="text-slate-800 font-semibold text-sm">{book.rating.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-slate-600 mb-4 text-sm font-medium">{book.author}</p>
          
          {book.genre && (
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                {book.genre}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// List View Card Component
function BookCardList({ book, index }) {
  return (
    <Link to={`/books/${book._id}`}>
      <div 
        className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/20 p-6 hover:bg-white"
        style={{ 
          animationDelay: `${index * 50}ms`,
          animation: `fadeInUp 0.6s ease-out forwards`
        }}
      >
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img
              src={book.coverImage || 'https://via.placeholder.com/80x120/6366f1/ffffff?text=No+Cover'}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
              loading="lazy"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors duration-200 truncate">
              {book.title}
            </h3>
            <p className="text-slate-600 font-medium mb-2">{book.author}</p>
            
            <div className="flex items-center space-x-4">
              {book.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-slate-700 font-semibold text-sm">{book.rating.toFixed(1)}</span>
                </div>
              )}
              
              {book.genre && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                  {book.genre}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
              <span className="text-indigo-600 font-bold">›</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}