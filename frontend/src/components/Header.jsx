import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) setUser(storedUser)
    }

    syncUser();

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null)
    navigate('/login')
  };

  return (
    <header className='bg-gray-900 text-white p-4 shadow-md flex justify-between items-center'>
      <Link to="/" className="text-xl font-bold">
        📚 BookVerse
      </Link>

      <nav className="space-x-4">
        <Link to="/books" className="hover:underline">
          All Books
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="hover:underline">
              {user.name || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="ml-2 text-red-400 hover:text-red-300">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>

    </header>
  );

}