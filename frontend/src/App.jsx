import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}
