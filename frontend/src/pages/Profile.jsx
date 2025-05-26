import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Edit3, 
  Save, 
  Shield, 
  UserPlus, 
  X, 
  CheckCircle, 
  AlertCircle,
  Crown,
  Settings,
  BookOpen,
  Plus
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImage: ''
  });
  const [addingBook, setAddingBook] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) {
      navigate("/login");
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}`);
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email, password: "" });
      } catch (err) {
        console.error("Failed to fetch user", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBookChange = (e) => {
    setBookForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);
    setMessage(null);

    try {
      const res = await axiosInstance.put(`/users/${user._id}`, form);
      setUser(res.data);
      setForm({ ...form, password: "" });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/users/admin', {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      });
      setMessage({ type: "success", text: "Admin created successfully!" });
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setShowAdminForm(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create admin" });
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddingBook(true);
    try {
      const res = await axiosInstance.post('/books', bookForm);
      setMessage({ type: "success", text: "Book added successfully!" });
      setBookForm({
        title: '',
        author: '',
        genre: '',
        description: '',
        coverImage: ''
      });
      setShowBookForm(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add book" });
    } finally {
      setAddingBook(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
          {user.isAdmin && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full text-sm font-medium shadow-lg">
              <Crown className="w-4 h-4" />
              Administrator
            </div>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border shadow-sm flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-50 text-green-800 border-green-200" 
              : "bg-red-50 text-red-800 border-red-200"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4 text-blue-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Lock className="w-4 h-4 text-blue-600" />
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Leave blank to keep current password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Only fill this if you want to change your password</p>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Admin Section */}
          <div className="space-y-6">
            {/* Current User Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                {user.isAdmin && (
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    Admin
                  </div>
                )}
              </div>
            </div>

            {/* Admin Controls */}
            {user.isAdmin && (
              <>
                {/* Add Admin Control */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-gray-800">Admin Management</h3>
                  </div>
                  
                  {!showAdminForm ? (
                    <button
                      onClick={() => setShowAdminForm(true)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add New Admin
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">Create New Admin</h4>
                        <button
                          onClick={() => setShowAdminForm(false)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      
                      <form onSubmit={handleCreateAdmin} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Admin Name"
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="email"
                          placeholder="Admin Email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="password"
                          placeholder="Admin Password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                        />
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Create Admin
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Add Book Control */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-800">Book Management</h3>
                  </div>
                  
                  {!showBookForm ? (
                    <button
                      onClick={() => setShowBookForm(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Book
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">Add New Book</h4>
                        <button
                          onClick={() => setShowBookForm(false)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      
                      <form onSubmit={handleAddBook} className="space-y-3">
                        <input
                          type="text"
                          name="title"
                          placeholder="Book Title"
                          value={bookForm.title}
                          onChange={handleBookChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          name="author"
                          placeholder="Author Name"
                          value={bookForm.author}
                          onChange={handleBookChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          name="genre"
                          placeholder="Genre"
                          value={bookForm.genre}
                          onChange={handleBookChange}
                          required
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <textarea
                          name="description"
                          placeholder="Book Description"
                          value={bookForm.description}
                          onChange={handleBookChange}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        />
                        <input
                          type="url"
                          name="coverImage"
                          placeholder="Cover Image URL (optional)"
                          value={bookForm.coverImage}
                          onChange={handleBookChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                          type="submit"
                          disabled={addingBook}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm flex items-center justify-center gap-2"
                        >
                          {addingBook ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Add Book
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}