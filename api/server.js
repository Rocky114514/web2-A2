/**
 * ============================================================================
 *  server.js — RESTful API for the "Passing the Torch" charity events site
 * ============================================================================
 *  PROG2002 Assessment 2, Part 2.
 *
 *  This Express server exposes the data layer (MySQL) to the client-side
 *  website through a small set of read-only, resource-oriented endpoints.
 *  Only GET methods are implemented — POST/PUT/DELETE arrive in Assessment 3.
 *
 *  Endpoints:
 *    GET /api/events/home   -> active + upcoming events for the home page
 *    GET /api/events        -> searchable events (category, location, date)
 *    GET /api/events/:id    -> full detail for a single event
 *    GET /api/categories    -> the event categories used by the filter form
 *    GET /api/locations     -> distinct cities used by the filter form
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');

// Import the shared database helper (connection pool + query wrapper).
const { query, testConnection } = require('./event_db');

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------------------------------
//  Middleware
// ----------------------------------------------------------------------------

// Enable JSON parsing for any future POST bodies and allow CORS so the
// client-side pages (served on another port or from the file system) can
// call this API from the browser without being blocked.
app.use(cors());
app.use(express.json());

// A tiny logging middleware that prints each request — handy when demoing
// the data flow from browser -> API -> database in the video.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// ----------------------------------------------------------------------------
//  Routes
// ----------------------------------------------------------------------------

// GET /api/events/home
// Returns every ACTIVE event that is happening today or in the future,
// joined with its category and organisation so the home page can render
// rich cards in a single round-trip. Suspended and past events are excluded.
app.get('/api/events/home', async (req, res, next) => {
    try {
        const sql = `
            SELECT
                e.event_id, e.name, e.short_summary,
                e.event_date, e.end_date, e.venue, e.city, e.state,
                e.price, e.currency, e.goal_amount, e.raised_amount,
                e.image_key,
                c.category_id, c.name AS category_name, c.icon, c.theme_color,
                o.name AS org_name
            FROM events e
            JOIN categories c    ON c.category_id = e.category_id
            JOIN organisations o ON o.org_id     = e.org_id
            WHERE e.is_suspended = 0
              AND e.event_date >= NOW()
            ORDER BY e.event_date ASC
        `;
        const rows = await query(sql);
        res.json({ success: true, count: rows.length, events: rows });
    } catch (err) {
        next(err); // forward to the central error handler
    }
});

// GET /api/events
// Search endpoint. Accepts three OPTIONAL query parameters that can be used
// together in any combination:
//    ?category=1            filter by category id
//    ?location=Gold Coast   partial match on city OR venue
//    ?date=2026-10-01       events on or after this date
// The WHERE clause is built dynamically so un-used filters are simply ignored.
app.get('/api/events', async (req, res, next) => {
    try {
        const { category, location, date } = req.query;

        // Start with the base conditions: only active, non-suspended events.
        const conditions = ['e.is_suspended = 0', 'e.event_date >= NOW()'];
        const params = [];

        // --- category filter (validated as a positive integer) ---
        if (category !== undefined && category !== '') {
            const id = Number(category);
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'The "category" filter must be a positive integer.'
                });
            }
            conditions.push('e.category_id = ?');
            params.push(id);
        }

        // --- location filter (partial match on city or venue) ---
        if (location !== undefined && location.trim() !== '') {
            conditions.push('(e.city LIKE ? OR e.venue LIKE ?)');
            const like = `%${location.trim()}%`;
            params.push(like, like);
        }

        // --- date filter (on or after the selected day) ---
        if (date !== undefined && date !== '') {
            // Basic format guard: YYYY-MM-DD. Anything else -> 400 error.
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({
                    success: false,
                    message: 'The "date" filter must use the format YYYY-MM-DD.'
                });
            }
            conditions.push('DATE(e.event_date) >= ?');
            params.push(date);
        }

        const sql = `
            SELECT
                e.event_id, e.name, e.short_summary,
                e.event_date, e.end_date, e.venue, e.city, e.state,
                e.price, e.currency, e.goal_amount, e.raised_amount,
                e.image_key,
                c.category_id, c.name AS category_name, c.icon, c.theme_color
            FROM events e
            JOIN categories c ON c.category_id = e.category_id
            WHERE ${conditions.join(' AND ')}
            ORDER BY e.event_date ASC
        `;

        const rows = await query(sql, params);
        res.json({ success: true, count: rows.length, events: rows });
    } catch (err) {
        next(err);
    }
});

// GET /api/events/:id
// Returns the complete details for one event (plus its organisation and
// category). The route validates the id first and responds 400/404 clearly.
app.get('/api/events/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        // Guard against malformed URLs such as /api/events/abc.
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'The event id must be a positive integer.'
            });
        }

        const sql = `
            SELECT
                e.*,
                c.name AS category_name, c.icon, c.theme_color,
                c.description AS category_description,
                o.name AS org_name, o.tagline, o.mission,
                o.contact_email, o.contact_phone,
                o.street_address, o.city AS org_city, o.state AS org_state,
                o.postcode AS org_postcode, o.website, o.founded_year,
                (e.event_date < NOW()) AS is_past
            FROM events e
            JOIN categories c    ON c.category_id = e.category_id
            JOIN organisations o ON o.org_id     = e.org_id
            WHERE e.event_id = ?
        `;
        const rows = await query(sql, [id]);

        // Nothing found -> standard 404 response.
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No event was found with that id.'
            });
        }

        res.json({ success: true, event: rows[0] });
    } catch (err) {
        next(err);
    }
});

// GET /api/categories
// Supplies the list of categories the search form turns into a dropdown.
app.get('/api/categories', async (req, res, next) => {
    try {
        const rows = await query(
            'SELECT category_id, name, slug, description, icon, theme_color FROM categories ORDER BY name'
        );
        res.json({ success: true, count: rows.length, categories: rows });
    } catch (err) {
        next(err);
    }
});

// GET /api/locations
// Supplies the distinct cities of active events for the location dropdown.
app.get('/api/locations', async (req, res, next) => {
    try {
        const rows = await query(
            'SELECT DISTINCT city FROM events WHERE is_suspended = 0 AND event_date >= NOW() ORDER BY city'
        );
        res.json({ success: true, count: rows.length, locations: rows.map(r => r.city) });
    } catch (err) {
        next(err);
    }
});

// GET /
// Friendly root message so hitting the server in a browser shows it is alive.
app.get('/', (req, res) => {
    res.json({
        name: 'Charity Events API — Passing the Torch',
        status: 'running',
        endpoints: [
            'GET /api/events/home',
            'GET /api/events?category=&location=&date=',
            'GET /api/events/:id',
            'GET /api/categories',
            'GET /api/locations'
        ]
    });
});

// ----------------------------------------------------------------------------
//  Central error handling
// ----------------------------------------------------------------------------

// 404 for any unknown route.
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// Any error thrown inside a route lands here and becomes a clean JSON reply.
app.use((err, req, res, next) => {
    console.error('API error:', err);
    res.status(500).json({
        success: false,
        message: 'The server could not complete the request. Please try again.'
    });
});

// ----------------------------------------------------------------------------
//  Start the server
// ----------------------------------------------------------------------------
(async () => {
    try {
        // Quick connectivity check so the marker sees right away whether the
        // database is configured correctly.
        await testConnection();
        console.log('✅ Connected to MySQL (charityevents_db)');
    } catch (err) {
        console.error('❌ Could not connect to MySQL:', err.message);
        console.error('   Check api/.env and make sure charityevents_db.sql is imported.');
    }

    app.listen(PORT, () => {
        console.log(`🔥 Charity Events API listening on http://localhost:${PORT}`);
    });
})();
