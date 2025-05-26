# 📚 BookVerse – Book Review Application

**BookVerse** is a full-stack web application where users can explore, review, and rate books across multiple genres. It offers authentication, user profile management, featured book listings, and powerful review functionality.

---

## 🌐 Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT

---

## 🚀 Features

- User Authentication (Login/Register)
- Book Listing with Pagination
- Featured Books by Top Rating & Genre
- Book Details with Reviews
- Admin-protected routes for managing content (planned)
- Responsive design using Tailwind CSS

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/bookverse.git](https://github.com/Premiiit/Book-Management.git)
cd bookverse
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder using the template below.

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app should now be running at [http://localhost:5173](http://localhost:5173)

---

## 📁 .env Template (Backend)

Create a `.env` file inside the `/backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 🚀 Future Enhancements

-Advanced search by genre
-Integrate multer for photo upload

---

## 🧑‍💻 Author

Made with ❤️ by Prem

---

## 📄 License

This project is licensed under the MIT License.
