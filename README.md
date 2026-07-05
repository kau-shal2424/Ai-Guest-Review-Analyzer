# AI Guest Review Analyzer

## Overview

**AI Guest Review Analyzer** is a full‑stack SaaS‑style application that lets you collect hotel guest reviews, run AI‑powered sentiment and theme analysis, and manage reviews through a modern, premium React UI.

### Key Features (Week 5 Deliverables)
- **Premium Review List** with glassmorphic cards, hover animations, and responsive layout.
- **Review Details Modal** – shows full review, sentiment, theme, AI response, copy actions, edit/delete shortcuts.
- **Edit Review Modal** – inline edit of the review text with validation, live update via `PUT /api/reviews/{id}`.
- **Delete Confirmation Modal** – custom UI (warning icon, preview, badges) replaces `window.confirm`, with loading spinner and toast feedback.
- **Search** – debounced live search across reviews.
- **Dark‑mode & responsive design** – Tailwind CSS only, no external UI libraries.
- **Toast notifications** – React Hot Toast for success/error messages.

## Repository Structure
```
AI-Guest-Review-Analyzer/
├─ backend/        # FastAPI server (Python)
├─ client/         # React + Vite frontend (Tailwind CSS)
│   ├─ src/
│   │   ├─ components/
│   │   │   ├─ reviews/
│   │   │   │   ├─ ReviewItemCard.jsx
│   │   │   │   ├─ ReviewModal.jsx
│   │   │   │   ├─ EditReviewModal.jsx
│   │   │   │   └─ DeleteReviewModal.jsx
│   │   │   └─ ui/ (shared UI primitives)
│   │   ├─ pages/
│   │   │   ├─ Reviews.jsx
│   │   │   ├─ Analyze.jsx
│   │   │   ├─ Dashboard.jsx
│   │   │   └─ …
│   │   └─ api/reviews.js (axios wrappers)
├─ .gitignore
└─ README.md
```

## Getting Started
### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\\Scripts\\activate
# macOS/Linux
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
The dev server runs at `http://localhost:5173`.

## Development Notes
- All UI components use **Tailwind CSS** utilities – no Material UI or external component libraries.
- Modals use **glassmorphism**, backdrop blur, fade/scale animations, and are fully keyboard accessible (ESC to close, focus trapping).
- API interactions are defined in `src/api/reviews.js` (GET, POST, PUT, DELETE).
- Toasts are displayed via `react-hot-toast`.

## License
MIT © Kaushal Thakur
