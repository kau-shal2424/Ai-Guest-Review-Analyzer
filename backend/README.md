# Backend README

## Overview

The backend is a FastAPI application that provides REST endpoints for managing guest reviews and performing simple sentiment/theme analysis.

## API Endpoints

- `GET /api/reviews` – Retrieve all reviews
- `GET /api/reviews/{id}` – Retrieve a single review
- `POST /api/reviews` – Create a new review
- `PUT /api/reviews/{id}` – Update an existing review
- `DELETE /api/reviews/{id}` – Delete a review
- `POST /api/analyze` – Analyze a review text and return sentiment and theme

## Getting Started

```bash
cd backend
python -m venv venv
# Windows activation
venv\\Scripts\\activate
# Unix/macOS activation
# source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The server runs at `http://127.0.0.1:8000`.

## License

MIT © Kaushal Thakur
