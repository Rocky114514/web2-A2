# 🔥 Passing the Torch — Charity Events Website

A dynamic charity-events website built for **PROG2002 Web Development II, Assessment 2**.

> **Design concept.** *Passing the Torch* — deep, cool, near-black blues form the
> backdrop (the challenge), while a single brilliant orange-gold flame cuts
> through the shadow (hope + strength). Strong chiaroscuro lighting and fiery,
> high-motion typography create an urgent, heroic feel — never mournful.

The site lets the public **view upcoming charity events**, **search** them by
date / location / category, and open a **detail page** with full information,
ticket pricing, and a live goal-vs-progress bar.

---

## ✨ Features

| Page | What it does |
|------|--------------|
| **Home** (`client/index.html`) | Hero with animated torch, mission, impact stats, and a dynamic list of active + upcoming events fetched from the API. |
| **Search** (`client/search.html`) | Filter events by **category**, **location** and **date** (any combination). Includes a *Clear Filters* button and inline error messages. |
| **Details** (`client/event.html`) | Full description, purpose, ticket price, **Goal vs. Progress** bar, registration form, and a *Register* button that opens an "under construction" modal. |

---

## 🧱 Tech stack

- **Client:** HTML5, CSS3 (custom design system), vanilla JavaScript (DOM + Promises + `fetch`) — no frameworks.
- **Server:** Node.js + Express (RESTful API).
- **Database:** MySQL (`charityevents_db`) accessed through a `mysql2/promise` connection pool.

---

## 📁 Project structure

```
web2-A2/
├── database/
│   └── charityevents_db.sql     # schema + 12 seeded events / 6 categories
├── api/
│   ├── server.js                # Express app + REST endpoints
│   ├── event_db.js              # MySQL connection pool + query helper
│   ├── package.json
│   └── .env.example             # copy to .env and fill in your MySQL details
├── client/
│   ├── index.html               # Home
│   ├── search.html              # Search
│   ├── event.html               # Event details
│   ├── css/styles.css           # "Passing the Torch" design system
│   └── js/
│       ├── config.js            # API base URL (single source of truth)
│       ├── api.js               # fetch wrapper + shared helpers + card renderer
│       ├── home.js              # Home page logic
│       ├── search.js            # Search page logic
│       └── event.js             # Detail page + modal logic
├── docs/project-report.md       # analysis, design + development report
└── README.md
```

---

## 🚀 Getting started

### 1. Set up the database

Import the SQL script with MySQL Workbench or the CLI:

```bash
mysql -u root -p < database/charityevents_db.sql
```

This creates `charityevents_db` with 4 tables and **12 sample events** across
**6 categories** (including past events and one suspended event so the
past/upcoming and policy logic can be seen working). Event dates are generated
relative to `CURDATE()`, so upcoming/past always behave correctly.

### 2. Configure + run the API

```bash
cd api
npm install
copy .env.example .env     # Windows   (or: cp .env.example .env on macOS/Linux)
# edit .env with your MySQL username/password
npm start
```

You should see:

```
✅ Connected to MySQL (charityevents_db)
🔥 Charity Events API listening on http://localhost:3000
```

### 3. Open the client

Open `client/index.html` in a browser **while the API is running**, or serve it:

```bash
# optional: a zero-install static server
npx serve client
```

> The client calls `http://localhost:3000` (set in `client/js/config.js`).
> CORS is enabled on the API so the pages work from any origin.

---

## 🔌 API endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/events/home` | Active + upcoming events (joined with category & organisation) for the Home page. |
| `GET` | `/api/events?category=&location=&date=` | Search active events by category id, location (partial match) and/or date (on-or-after). All filters optional. |
| `GET` | `/api/events/:id` | Full detail for one event (with organisation, category and `is_past` flag). |
| `GET` | `/api/categories` | Event categories for the filter dropdown. |
| `GET` | `/api/locations` | Distinct venues of active events for the filter dropdown. |

Example:

```
GET http://localhost:3000/api/events?category=1&location=Broadbeach&date=2026-10-01
```

---

## 🎯 How it maps to the rubric

- **Database (15%)** — normalised schema with primary/foreign keys, a dedicated
  connection module (`event_db.js`) and 12 realistic seed rows.
- **RESTful API (20%)** — resource-oriented URLs, validation, clear error JSON,
  parameterised queries (SQL-injection safe), async/await.
- **Dynamic client (45%)** — Home / Search / Details all render **from the API**
  using `fetch` + Promises + DOM, with loading, empty and error states.
- **Accuracy & compatibility (5%)** — validation on both client and server,
  graceful fallbacks, responsive layout, reduced-motion support.
- **Concept understanding (15%)** — see `docs/project-report.md`, the ~30%
  inline code comments, and the commit history on GitHub.

---

## 📝 Notes

- Emberlight Foundation is a **fictional** charity created for this assessment.
- Ticket purchase (POST endpoints) is intentionally out of scope and will be
  added in **Assessment 3**.
