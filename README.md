# Bloomora 🌸

> 🌐 **Live Website**: [https://riddhimamathur.github.io/Bloomora/](https://riddhimamathur.github.io/Bloomora/)  
> ⚡ **Live Backend API**: `https://bloomora-api.onrender.com` *(Hosted FastAPI Service)*  
> 📑 **Interactive API Docs (Swagger UI)**: [https://bloomora-api.onrender.com/docs](https://bloomora-api.onrender.com/docs) *(Try live backend endpoints online)*

Bloomora is an aesthetic, visual pinboard web application with seamless Spotify integration. Users can log in, discover and post pins featuring beautiful artwork or photos, attach a Spotify track or playlist to a pin, view pins in a masonry grid, play attached tracks via embedded Spotify players, and write comments.

The app is built with:
- **Backend**: FastAPI, SQLite, SQLAlchemy
- **Frontend**: Single Page Application (SPA) using HTML5, Vanilla CSS (featuring frosted glass glassmorphism, responsive masonry grid, and premium micro-animations), and Vanilla JavaScript.

---

## Folder Structure

```
bloomora-app/ (c:/Users/user/Downloads/Bloomora/)
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── config.py
│   ├── requirements.txt
│   └── routers/
│       ├── __init__.py
│       ├── auth.py
│       ├── pins.py
│       ├── comments.py
│       └── spotify.py
└── frontend/
    ├── index.html
    ├── styles.css
    └── js/
        ├── app.js
        ├── auth.js
        ├── pins.js
        ├── comments.js
        └── spotify.js
```

---

## Setup & Running

### Backend

1. **Navigate to the workspace root** and install requirements. (Using a virtual environment is recommended).
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory (copy `.env.example` as a template):
   ```bash
   cp .env.example .env
   ```
   Provide your Spotify API Client ID and Secret if you want real-time track search. Otherwise, the app falls back to a simulated playlist/track query, which still plays real music via Spotify embeds!

3. **Run the FastAPI server**:
   ```bash
   uvicorn backend.main:app --reload
   ```
   The backend will be hosted at `http://127.0.0.1:8000`. You can access the automatic documentation at `http://127.0.0.1:8000/docs`.

### Frontend

Since the frontend is a pure client-side SPA:
1. Simply run a static web server from the `frontend/` directory (or workspace root), or open the `frontend/index.html` file in your browser using a server.
   For example, using Python's built-in server:
   ```bash
   python -m http.server 3000 --directory frontend
   ```
   Or using node:
   ```bash
   npx http-server frontend -p 3000
   ```
2. Open `http://localhost:3000` in your web browser.

---

## Features

- **User Authentication**: Secure register and login system using SQLite database and JSON Web Tokens (JWT).
- **Aesthetic Masonry Layout**: A dynamic pinboard that scales automatically with user screen size.
- **Glassmorphic UI**: Frosted glass effects, glowing borders, custom cursors, and sleek dark mode.
- **Spotify Catalog Integration**: Attach tracks and playlists directly from Spotify by searching.
- **Embedded Audio Widget**: Listen to the attached Spotify song directly from the pin's details dialog using a styled Spotify Web Playback embed.
- **Social Feed & Comments**: Share thoughts and comments on each pin in a real-time responsive list.
