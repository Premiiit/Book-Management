import { useEffect, useState } from "react";
import { 
  Star, 
  TrendingUp, 
  BookOpen, 
  ArrowRight, 
  Heart,
  Eye,
  Users,
  Sparkles
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

export default function Home() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosInstance.get("/books/featured");
        setFeatured(res.data);
      } catch (err) {
        console.error("Failed to load featured books", err);
      }
    };
    fetchFeatured();
  }, []);

  if (!featured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <p className="text-xl text-slate-700 font-semibold mb-2">Curating Your Literary Journey</p>
          <p className="text-slate-500">Discovering extraordinary books just for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100">
      {/* Enhanced Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-violet-200/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-blue-200/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/20 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl mb-6 shadow-2xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
            Your Literary
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600">
              Universe
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            Embark on endless adventures through carefully curated collections of extraordinary stories
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Users className="w-4 h-4 text-violet-600" />
              <span>10K+ Readers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>5K+ Books</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Rated Section */}
        {featured.topRated?.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-4 rounded-2xl mr-6 shadow-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-slate-800 mb-2">Top Rated Gems</h2>
                  <p className="text-lg text-slate-600">Reader favorites with outstanding reviews</p>
                </div>
              </div>
              <Link to={`/books`}>
              <button className="hidden md:flex hover:cursor-pointer items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {featured.topRated.map((book, index) => (
                <BookCard key={book._id} book={book} index={index} isTopRated={true} />
              ))}
            </div>
          </section>
        )}

        {/* Genre Collections */}
        {featured.genreBooks &&
          Object.entries(featured.genreBooks).map(([genre, books], sectionIndex) => (
            books?.length > 0 && (
              <section key={genre} className="mb-20">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-violet-500 to-indigo-600 p-4 rounded-2xl mr-6 shadow-xl">
                      <span className="text-3xl">{getGenreIcon(genre)}</span>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-slate-800 mb-2 capitalize">
                        {genre}
                        <span className="text-violet-600 ml-2">Collection</span>
                      </h2>
                      <p className="text-lg text-slate-600">
                        Handpicked {genre.toLowerCase()} masterpieces
                      </p>
                    </div>
                  </div>
                  <Link to={`/books`}>
                  <button className="hidden md:flex hover:cursor-pointer items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors group">
                    Explore More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {books.map((book, index) => (
                    <BookCard key={book._id} book={book} index={index} />
                  ))}
                </div>
              </section>
            )
          ))}
      </main>
    </div>
  );
}

function BookCard({ book, index, isTopRated = false }) {
  return (
    <div 
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden border border-white/50"
      style={{ 
        animationDelay: `${index * 150}ms`,
        animation: `fadeInUp 0.8s ease-out forwards`
      }}
    >
      {/* Top Rated Badge */}
      {isTopRated && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          TOP RATED
        </div>
      )}

      {/* Book Cover */}
      <div className="relative overflow-hidden">
        <img
          src={book.coverImage || 'https://via.placeholder.com/280x380/6366f1/ffffff?text=No+Cover'}
          alt={book.title}
          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        {/* Rating badge */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-white font-bold text-sm">{book.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex gap-2">
          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
            <Eye className="w-4 h-4" />
          </button>
          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Book Info */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2 group-hover:text-violet-600 transition-colors duration-300">
          {book.title}
        </h3>
        
        <p className="text-slate-600 mb-4 text-base font-medium">by {book.author}</p>
        
        {/* Rating Stars */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < Math.floor(book.rating) 
                    ? 'text-amber-400 fill-current' 
                    : 'text-slate-200'
                }`}
              />
            ))}
            <span className="text-slate-500 text-sm ml-2">({Math.floor(Math.random() * 100) + 50})</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Link to={`/books/${book._id}`}>
        <button className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
          <BookOpen className="w-4 h-4" />
          <span>Explore Book</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        </Link>
      </div>
    </div>
  );
}

function getGenreIcon(genre) {
  const icons = {
    fiction: '📚',
    mystery: '🔍',
    romance: '💕',
    fantasy: '🧙‍♂️',
    'science fiction': '🚀',
    thriller: '⚡',
    horror: '👻',
    biography: '👤',
    history: '🏛️',
    science: '🔬',
    adventure: '🗺️',
    classic: '📜',
    poetry: '🎭',
    drama: '🎪',
    comedy: '😄',
    philosophy: '🤔',
    psychology: '🧠',
    business: '💼',
    health: '🏥',
    technology: '💻'
  };
  return icons[genre.toLowerCase()] || '📖';
}