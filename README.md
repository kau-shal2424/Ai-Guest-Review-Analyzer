# AI Guest Review Analyzer

## Overview

AI Guest Review Analyzer is a full‑stack application that collects hotel guest reviews, runs simple AI‑based sentiment and theme analysis, and provides a modern React frontend for users to browse, search, and analyze reviews.

- **Backend**: FastAPI (Python) exposing REST endpoints for CRUD operations on reviews and an `/api/analyze` endpoint that returns sentiment and theme.
- **Frontend**: React + Vite (with Tailwind CSS) offering a clean UI for listing, searching, creating, updating, and deleting reviews, as well as an analysis page.

## Repository Structure

```
AI-Guest-Review-Analyzer/
├─ backend/        # FastAPI server
├─ client/         # React frontend (Vite)
├─ .gitignore
└─ README.md       # Project overview
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
# Windows activation
venv\\Scripts\\activate
# On macOS/Linux
# source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd client
npm install
npm run dev
```
The development server runs at `http://localhost:5173`.

## License

MIT © Kaushal Thakur
