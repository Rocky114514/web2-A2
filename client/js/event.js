/**
 * ============================================================================
 *  event.js — Event detail page logic
 * ============================================================================
 *  Reads the event id from the URL query string (e.g. event.html?id=3),
 *  fetches the full record from GET /api/events/:id, and renders every field
 *  (badges, meta, description, goal vs. progress, ticket price and host).
 *  The Register button opens the "under construction" modal.
 * ============================================================================
 */

/**
 * Fetch and render the single event whose id came through the URL.
 */
async function loadEvent() {
    const id = getQueryParam('id');

    // Guard against a missing or malformed id before we hit the network.
    if (!id) {
        renderError('No event selected. Please choose an event from the home or search page.');
        return;
    }

    try {
        const data = await apiGet(`/api/events/${id}`);
        renderEvent(data.event);
    } catch (err) {
        renderError(err.message);
    }
}

/**
 * Fill every placeholder on the page from one event record.
 * @param {object} ev - the event object returned by the API
 */
function renderEvent(ev) {
    // --- Badge: category (and a clear tag for past/suspended events) ---
    const badge = document.getElementById('eventBadge');
    if (ev.is_suspended) {
        badge.textContent = '⛔ Suspended — pending review';
        badge.className = 'badge badge--suspended';
    } else if (ev.is_past) {
        badge.textContent = `${ev.icon} ${ev.category_name} · Past event`;
        badge.className = 'badge badge--past';
    } else {
        badge.textContent = `${ev.icon} ${ev.category_name}`;
        badge.className = 'badge';
    }

    // --- Title + browser tab title ---
    document.getElementById('eventTitle').textContent = ev.name;
    document.title = `${ev.name} — Emberlight Foundation`;

    // --- Meta line: date, time, venue, price ---
    document.getElementById('eventMeta').innerHTML = `
        <span class="meta-item"><span class="ico">📅</span>${escapeHtml(formatDateLong(ev.event_date))}</span>
        <span class="meta-item"><span class="ico">🕐</span>${escapeHtml(formatTime(ev.event_date))} – ${escapeHtml(formatTime(ev.end_date))}</span>
        <span class="meta-item"><span class="ico">📍</span>${escapeHtml(ev.venue)}, ${escapeHtml(ev.city)} ${escapeHtml(ev.state)} ${escapeHtml(ev.postcode)}</span>
        <span class="meta-item"><span class="ico">🎟️</span>${escapeHtml(formatPrice(ev.price, ev.currency))}</span>`;

    // --- Long-form text ---
    document.getElementById('eventDescription').textContent = ev.description;
    document.getElementById('eventPurpose').textContent = ev.purpose;

    // --- Goal vs. Progress panel ---
    const pct = progressPercent(ev.raised_amount, ev.goal_amount);
    document.getElementById('raisedAmount').textContent = formatMoney(ev.raised_amount);
    document.getElementById('goalAmount').textContent = formatMoney(ev.goal_amount);
    document.getElementById('progressLabel').textContent = `${pct}% funded`;

    const remaining = Number(ev.goal_amount) - Number(ev.raised_amount);
    document.getElementById('progressRemaining').textContent =
        pct >= 100 ? '🎉 Goal reached!' : `${formatMoney(remaining)} to go`;

    const fill = document.getElementById('progressFill');
    fill.style.width = `${pct}%`;
    if (pct >= 100) fill.classList.add('progress__fill--full');

    // --- Ticket box ---
    document.getElementById('ticketPrice').textContent = formatPrice(ev.price, ev.currency);

    // --- Host panel ---
    document.getElementById('orgName').textContent = ev.org_name;
    document.getElementById('orgMission').textContent = ev.mission;
}

/**
 * Friendly failure state: replace the hero with a clear message instead of a
 * broken page.
 */
function renderError(message) {
    document.title = 'Event not found — Emberlight Foundation';
    document.getElementById('eventBadge').textContent = '⚠️ Not found';
    document.getElementById('eventBadge').className = 'badge badge--suspended';
    document.getElementById('eventTitle').textContent = 'Event not found';
    document.getElementById('eventMeta').innerHTML = '';
    document.getElementById('eventDescription').textContent = escapeHtml(message);
    document.getElementById('eventPurpose').textContent =
        'Return to the home page or search page to choose an available charity event.';
}

// ---------------------------------------------------------------------------
//  Modal wiring (Register -> "This feature is currently under construction")
// ---------------------------------------------------------------------------
function openModal() {
    document.getElementById('registerModal').classList.add('modal--open');
}
function closeModal() {
    document.getElementById('registerModal').classList.remove('modal--open');
}

// Submitting the form shows the modal — ticket purchase arrives in Assessment 3.
document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    openModal();
});

document.getElementById('modalClose').addEventListener('click', closeModal);

// Clicking the dark backdrop (not the dialog itself) also closes the modal.
document.getElementById('registerModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});

// Escape key closes the modal for keyboard users.
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

loadEvent();
