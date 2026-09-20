# Project Report — Charity Events Website ("Passing the Torch")

**Unit:** PROG2002 Web Development II · **Assessment:** 2 · **Author:** Rocky114514

---

## 1. Case study analysis

The brief asks for a dynamic website that connects a charitable organisation with
potential attendees by managing **charity events** (galas, fun runs, silent auctions,
concerts, etc.). The public needs to:

1. **View** a list of currently available and upcoming events (home page).
2. **Search** active events by date, location and category (search page).
3. **Open** a single event to see its full description, ticket price and
   fundraising *goal vs. progress* (detail page).

Three facts stand out when analysing the data:

- An event always belongs to **one organisation** and **one category**.
- "Past" vs. "upcoming" is a *derived* property — it changes every day as time
  passes, so it should never be hard-coded.
- Some events breach policy and must be hidden **without being deleted**, because
  their history still matters.

These three facts directly drive the database and API design below.

---

## 2. Database design

The database `charityevents_db` contains four tables:

| Table | Purpose | Key relationships |
|-------|---------|-------------------|
| `organisations` | The charity (or charities) hosting events. | one → many `events` |
| `categories` | Enumerated event types (fun run, gala, auction…). | one → many `events` |
| `events` | The core record: name, description, date, venue, price, goal, raised. | many → one `organisations`, many → one `categories` |
| `registrations` | Reserved for Assessment 3 (ticket purchase). | many → one `events` |

**Design decisions**

- **Surrogate primary keys** (`org_id`, `category_id`, `event_id`, `registration_id`)
  are auto-increment integers — simple, stable, and ideal for URL ids such as
  `/api/events/3`.
- **Foreign keys with `InnoDB`** enforce referential integrity: an event cannot
  reference a missing category or organisation.
- **Derived state is not stored.** There is no `status = 'past'` column. Instead,
  the API computes it with `event_date >= NOW()`. This means the site stays
  correct forever with zero maintenance.
- **`is_suspended TINYINT(1)`** implements the policy rule: a suspended event is
  still in the database (auditable) but is filtered out of every public listing.
- **Seed data uses `DATE_ADD/DATE_SUB(CURDATE(), …)`** so the 12 sample events are
  always correctly split into past, upcoming and suspended — no matter when the
  marker imports the script.

---

## 3. RESTful API design

The API is read-only (POST/PUT/DELETE are deliberately deferred to Assessment 3).
Every route is a **noun** (a resource), and query parameters refine the resource:

| Endpoint | Resource | Notes |
|----------|----------|-------|
| `GET /api/events/home` | upcoming events | joined with category + organisation; excludes past & suspended |
| `GET /api/events` | searchable events | optional `category`, `location`, `date` filters |
| `GET /api/events/:id` | one event | full detail incl. `is_past` flag |
| `GET /api/categories` | categories | feeds the search dropdown |
| `GET /api/locations` | distinct venues | feeds the search dropdown |

**RESTful & security considerations**

- URLs are intuitive and reflect resources (`/api/events/5` = event number 5).
- **All SQL is parameterised** (prepared statements via `mysql2`), which prevents
  SQL injection — the `?` placeholders are never concatenated with user input.
- Input is **validated on the server**: a non-numeric category or malformed date
  returns a `400` with a clear JSON message rather than crashing.
- Responses always carry a consistent envelope: `{ success, …data… }` on success
  and `{ success: false, message }` on error, so the client always knows what to
  render.
- A connection **pool** (not a single connection) lets the server handle many
  concurrent browser requests efficiently.

---

## 4. Client-side design

The client uses **only HTML, CSS and vanilla JavaScript** (DOM + Promises +
`fetch`) — no frameworks, as required.

- **`config.js`** keeps the API base URL in one place.
- **`api.js`** centralises the fetch wrapper, formatting helpers, an `escapeHtml`
  function (XSS protection), the shared event-card renderer, and the mobile nav.
- **`home.js`**, **`search.js`** and **`event.js`** each own one page's behaviour.

**Data flow (the same pattern on every page):**

```
user action  →  fetch(`${API_BASE}/api/...`)
             →  parse JSON  →  validate `success`
             →  escape + render into the DOM
             →  show loading / empty / error states as appropriate
```

The event id is passed between pages using a **URL query string**
(`event.html?id=3`), which is bookmarkable, shareable and refresh-safe.

---

## 5. UX & visual design — "Passing the Torch"

The brief's imagery of hope in darkness is translated into a concrete design
language:

- **Colour.** Deep cool blues/near-black (`#04060d → #17233d`) form the shadow;
  a hot orange-gold gradient (`#ff6a00 → #ff9d2e → #ffd166`) is the single flame.
- **Chiaroscuro.** A tight radial "torchlight" is the only bright source, fading
  into a heavy cinematic vignette — strong light *against* strong shadow.
- **Heroic, not tragic.** The copy uses active verbs ("Pass the torch", "Run with
  purpose", "Be the spark") and the imagery is a raised torch, not a sad scene.
- **Motion.** The flame flickers, embers rise, headlines are literally "on fire"
  (gradient-clipped text), and buttons glow — all conveying urgency and energy.
- **Accessibility.** Semantic landmarks, `aria-live` result regions, focus styles,
  keyboard-closable modal, and `prefers-reduced-motion` support.

---

## 6. Validation & compatibility

| Area | Measures taken |
|------|----------------|
| Server validation | category integer check, date format check, event-id integer check; 400/404/500 JSON responses. |
| Client validation | `required` + `type="email"` + min/max on the register form; empty/error states everywhere. |
| Security | Parameterised SQL, HTML-escaping of all API output, `.env` ignored by git. |
| Compatibility | Responsive grid down to mobile, hamburger nav, system-font fallbacks, reduced-motion support. |

---

## 7. GenAI use declaration

*To be completed by the student before submission — see the assessment brief for
the two required statements (used / did not use GenAI).*
