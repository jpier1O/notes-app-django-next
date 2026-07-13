# Notes Taking App

A notes-taking application built with Django REST Framework and Next.js.

## Tech Stack

- **Backend**: Django 5 + Django REST Framework + SQLite
- **Frontend**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Auth**: Token-based authentication

## Process

The project was built incrementally following the Figma designs as the source of truth. I started by setting up the backend API with Django REST Framework (custom user model, token authentication, notes CRUD, and category endpoints), then moved to the frontend with Next.js. Each page was developed screen by screen and first authentication (signup/login), then the dashboard with category filtering, and finally the note editor with autosave. Throughout the process, I iterated on styling details (typography, colors, spacing) to match the Figma specs as closely as possible, making UX decisions where the design left gaps (logout placement, delete icons, confirmation modals).

## Design and Technical Decisions

- Email-based auth with token stored in localStorage
- Typography: Inria Serif for titles, Inter for body/UI
- Colors from Figma: `#88642A` titles, `#957139` borders/buttons, `#F5E6D3` background
- Category colors: `#EF9C66`, `#FCDC94`, `#C8CFA0`, `#78ABA8`
- Auto-save with 1s debounce for title/body, immediate save for category changes
- Sidebar with overlay/relief effect for visual separation (not in original Figma)
- Logout button placed at the bottom of the sidebar column (not next to "+ New Note") to prevent accidental logouts
- Note editor as a bordered card within beige page, matching Figma layout
- Category dropdown saves immediately so changes persist when closing
- Delete from both dashboard (trash icon on cards) and note editor, both with confirmation dialog
- Used distinct icons: X = close/navigate back, trash = delete. Avoids user confusion between closing and deleting
- Confirmation modal with beige overlay and matching color scheme instead of dark overlay, keeps the aesthetic consistent
- Deployment: Vercel for frontend (native Next.js support, zero config) and Railway for backend (Django/Python hosting with free tier)

## Getting Started

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## AI Tools Used

- **Claude**: Used to speed up backend scaffolding (Django models, serializers, views), frontend component boilerplate (Styles of Tailwind), utility functions (date formatting, text truncation, API client), and debugging Next.js SSR issues with client components.
- **Gemini**: Used to clarify README content structure and review documentation for readability.
