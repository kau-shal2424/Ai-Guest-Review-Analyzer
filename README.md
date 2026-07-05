# 🤖 AI Guest Review Analyzer – Week 5

A full-stack web application developed as part of the **AI-Assisted Full Stack Web Development Internship – Week 5 Deliverables**.

This project integrates **MongoDB Atlas** with a **FastAPI** backend and a **React + Vite** frontend to provide complete CRUD functionality for guest reviews along with a responsive dashboard and modern user interface.

---

# 📌 Week 5 Deliverables Completed

- ✅ MongoDB Atlas Integration
- ✅ FastAPI Database Connectivity
- ✅ CRUD Operations (Create, Read, Update, Delete)
- ✅ Search Reviews
- ✅ Dashboard Statistics
- ✅ Review Analysis Module
- ✅ Responsive React Frontend
- ✅ Modern SaaS UI
- ✅ Shared Layout Architecture
- ✅ Dark/Light Mode
- ✅ GitHub Repository

---

# 🚀 Features

## Review Management

- Create Reviews
- View All Reviews
- Update Reviews
- Delete Reviews
- Search Reviews
- Review Details Modal
- Edit Review Modal
- Delete Confirmation Modal

---

## Dashboard

- Total Reviews
- Positive Reviews
- Neutral Reviews
- Negative Reviews
- Analytics Charts
- AI Insights Panel

---

## Review Analysis

Analyze reviews and generate:

- Sentiment
- Theme
- Suggested Response

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Lucide React
- Recharts

## Backend

- FastAPI
- Python
- Pydantic
- Uvicorn

## Database

- MongoDB Atlas
- PyMongo

---

# 📂 Project Structure

```text
AI-Guest-Review-Analyzer
│
├── backend
│   ├── models
│   ├── routes
│   ├── services
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── client
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── context
│   │   └── styles
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/kau-shal2424/Ai-Guest-Review-Analyzer.git
cd Ai-Guest-Review-Analyzer
```

## Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

Swagger Docs:

```
http://127.0.0.1:8000/docs
```

## Frontend Setup

```bash
cd client

npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=guest_reviews
COLLECTION_NAME=reviews
```

---

# 📊 Database Schema

```text
Collection: reviews

_id
review
sentiment
theme
response
createdAt
```

---

# 🔗 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/reviews | Get all reviews |
| GET | /api/reviews/{id} | Get review by ID |
| POST | /api/reviews | Create review |
| PUT | /api/reviews/{id} | Update review |
| DELETE | /api/reviews/{id} | Delete review |
| GET | /api/reviews/search?q= | Search reviews |
| GET | /api/dashboard | Dashboard statistics |
| POST | /api/analyze | Analyze review |

---

# 🧪 Week 5 Learning Outcomes

- Integrated MongoDB Atlas with FastAPI
- Implemented complete CRUD operations
- Built RESTful APIs
- Connected React frontend with FastAPI backend
- Managed data using MongoDB
- Designed a responsive dashboard
- Developed reusable React components
- Applied modern UI/UX principles

---

# 👨💻 Author

**Kaushal Thakur**

B.Tech CSE (AI & Data Science)

Graphic Era Hill University

GitHub: https://github.com/kau-shal2424

LinkedIn: https://www.linkedin.com/in/kaushal-thakur2424/

---

# 📄 License

Developed for educational and internship purposes.
