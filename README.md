#  SkillBridge

**AI-powered Skill Match & Gap Analyzer**

SkillBridge parses your resume, extracts your skills, and matches you against live remote job listings — showing exactly how well you fit each role and what to learn next to close the gap.

🔗 **Live Demo:** [skillbridge-frontend-psi.vercel.app](https://skillbridge-frontend-psi.vercel.app)

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/dc403bea-6822-4571-aa0c-0ae131e4096f" width="400"/><br/>
      <sub>Dashboard</sub>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/aa3d33c0-938b-4983-86b4-6378bc11325c" width="400"/><br/>
      <sub>Resume Upload</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/6512e71a-f028-408b-9a21-cdb262aa5e23" width="400"/><br/>
      <sub>Job Matches</sub>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/a0a9eea9-5c87-44f2-81d6-2d83b30ad370" width="400"/><br/>
      <sub>Profile</sub>
    </td>
  </tr>
</table>

---

## ✨ Features

- **📄 Resume Parsing** — Upload a PDF resume; text is extracted server-side with `pdf.js` and scanned against a curated skills database.
- **💼 Live Job Aggregation** — Pulls real remote listings from the Jobicy API, with an automatic fallback to Arbeitnow if the primary source is unavailable.
- **📊 Weighted Match Scoring** — Jobs aren't just keyword-matched; each skill is weighted by market relevance (e.g. core languages score higher than peripheral tools), and related skills are auto-expanded (e.g. knowing "React" implies partial credit for "MERN" stack roles).
- **⚠️ Skill Gap Analysis** — Every job card highlights the top missing skills and a plain-language suggestion for what to learn next.
- **🧭 Guided Dashboard Flow** — Users are nudged to upload a resume before browsing jobs, with sensible redirects if no skills are on file.
- **👤 Profile Overview** — At-a-glance summary of account details, resume status, and detected skills.
- **🌙 Dark Mode** — Persisted theme preference with smooth transitions across the app.
- **🔒 Protected Routes** — Dashboard, resume, jobs, and profile pages require an authenticated session.

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite 7
- React Router 7
- Tailwind CSS 3
- Framer Motion (animations)
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Multer (in-memory file uploads)
- `pdfjs-dist` (PDF text extraction)
- Axios (external job API integration)

**External APIs**
- [Jobicy](https://jobicy.com/) — primary remote job source
- [Arbeitnow](https://www.arbeitnow.com/) — fallback job source

---

## 📁 Project Structure

```
skillbridge/
├── skillbridge-backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Login / register handlers
│   │   ├── jobController.js      # Job fetching + match scoring
│   │   └── resumeController.js   # PDF parsing + skill detection
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js             # Multer config
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── resumeRoutes.js
│   ├── utils/
│   │   ├── skillExtractor.js
│   │   ├── resumeSkillExtractor.js
│   │   ├── skillMatcher.js
│   │   └── keepAlive.js          # Prevents free-tier hosting from sleeping
│   └── server.js
│
└── skillbridge-frontend/
    └── skillbridge-frontend/
        ├── src/
        │   ├── components/
        │   │   ├── layout/        # Navbar, Footer, Hero, Layout, JobCard
        │   │   └── ProtectedRoute.jsx
        │   ├── pages/
        │   │   ├── Home.jsx
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── Dashboard.jsx
        │   │   ├── Resume.jsx
        │   │   ├── Jobs.jsx
        │   │   └── Profile.jsx
        │   ├── config.js          # API base URL
        │   └── App.jsx
        └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/FarhanaaTasnim/skillbridge.git
cd skillbridge
```

### 2. Backend setup
```bash
cd skillbridge-backend
npm install
```

Create a `.env` file in `skillbridge-backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd skillbridge-frontend/skillbridge-frontend
npm install
```

Create a `.env` file with your backend URL:
```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Overview

| Method | Endpoint              | Description                                  |
|--------|------------------------|-----------------------------------------------|
| POST   | `/api/auth/register`  | Register a new user                          |
| POST   | `/api/auth/login`     | Authenticate a user                          |
| POST   | `/api/resume/upload`  | Upload a resume PDF and extract skills       |
| POST   | `/api/jobs/remote`    | Fetch remote jobs matched against skills     |
| GET    | `/api/jobs/search`    | Search RemoteOK jobs, ranked by skill match  |

---

## 🧠 How the Matching Works

1. **Extraction** — Resume text is lowercased and checked against a known skills list to build the user's skill profile.
2. **Expansion** — Skills are expanded into related groups (e.g. `react` also implies partial `frontend`/`mern` relevance).
3. **Weighting** — Each job's required tags are weighted (core languages > frameworks > supporting tools).
4. **Scoring** — A percentage match score is calculated from weighted overlap, with a text-based fallback when a job has no structured tags.
5. **Gap Reporting** — Missing high-weight skills are surfaced with a short, actionable suggestion.

---

## 🗺 Roadmap

- Persist real user accounts and hashed credentials (replace demo auth flow)
- Move MongoDB credentials to environment variables in all environments
- Expand the skills taxonomy and support fuzzy/synonym matching
- Add saved jobs and application tracking

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/FarhanaaTasnim/skillbridge/issues).

---

## ⭐ Support

If SkillBridge helped you, consider giving the repo a star — it helps others find the project!
