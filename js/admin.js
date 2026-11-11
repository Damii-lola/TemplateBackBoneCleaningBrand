/**
 * Admin Dashboard
 * - Password protection (client-side demo)
 * - Status tags: new | contacted | confirmed | completed | cancelled
 * - Filter by status
 * - Update status from modal
 *
 * IMPORTANT: Change ADMIN_PASSWORD below before going live.
 * This is NOT real security — anyone can view the source.
 * For production use a real backend with proper auth.
 */

(function () {
  // ========== CONFIG ==========
  const ADMIN_PASSWORD = 'admin123'; // ← Change this
  const STORAGE_KEY = 'booking_requests';
  const AUTH_KEY = 'admin_authenticated';

  // ========== DOM ==========
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const passwordInput = document.getElementById('admin-password');

  const listEl = document.getElementById('bookings-list');
  const emptyEl = document.getElementById('empty-state');
  const totalCountEl = document.getElementById('total-count');
  const newCountEl = document.getElementById('new-count');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const statusSelect = document.getElementById('status-select');
  const deleteBtn = document.getElementById('delete-booking-btn');
  const filtersEl = document.getElementById('status-filters');

  let bookings = [];
  let selectedIndex = null; // index in the full bookings array
  let currentFilter = 'all';

  // ---------- Auth ----------
  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function showLogin() {
    loginScreen.hidden = false;
    dashboard.hidden = true;
  }

  function showDashboard() {
    loginScreen.hidden = true;
    dashboard.hidden = false;
    loadBookings();
  }

  function login(password) {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      showDashboard();
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    showLogin();
    passwordInput.value = '';
    loginError.hidden = true;
  }

  // ---------- Data ----------
  function loadBookings() {
    try {
      bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // Ensure every booking has a status
      bookings.forEach(b => {
        if (!b.status) b.status = 'new';
      });
      bookings.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } catch {
      bookings = [];
    }
    render();
  }

  function saveBookings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return iso;
    }
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  function statusLabel(status) {
    const map = {
      new: 'New',
      contacted: 'Contacted',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return map[status] || status;
  }

  // ---------- Render ----------
  function getFiltered() {
    if (currentFilter === 'all') return bookings.map((b, i) => ({ booking: b, index: i }));
    return bookings
      .map((b, i) => ({ booking: b, index: i }))
      .filter(item => item.booking.status === currentFilter);
  }

  function render() {
    totalCountEl.textContent = bookings.length;
    newCountEl.textContent = bookings.filter(b => b.status === 'new').length;

    const filtered = getFiltered();

    if (bookings.length === 0) {
      emptyEl.hidden = false;
      listEl.hidden = true;
      listEl.innerHTML = '';
      return;
    }

    if (filtered.length === 0) {
      emptyEl.hidden = false;
      emptyEl.querySelector('h2').textContent = 'No bookings with this status';
      emptyEl.querySelector('p').textContent = 'Try another filter or wait for new requests.';
      listEl.hidden = true;
      listEl.innerHTML = '';
      return;
    }

    emptyEl.hidden = true;
    // restore default empty text
    emptyEl.querySelector('h2').textContent = 'No bookings yet';
    emptyEl.querySelector('p').textContent = 'When customers submit the booking form, their requests will appear here.';
    listEl.hidden = false;

    listEl.innerHTML = filtered
      .map(({ booking: b, index }) => `
        <article class="booking-card" data-index="${index}">
          <div class="booking-main-info">
            <h3>${escapeHtml(b.fullName || 'Unknown')}</h3>
            <div class="booking-meta">
              <span>${escapeHtml(b.phone || '—')}</span>
              <span>${escapeHtml(b.email || '—')}</span>
              <span>${escapeHtml(b.preferredDate || '—')}</span>
            </div>
          </div>
          <div class="booking-side">
            <div class="status-tag status-${b.status || 'new'}">${statusLabel(b.status || 'new')}</div>
            <div class="booking-service">${escapeHtml(b.service || 'Service')}</div>
            <div class="booking-date">${formatDate(b.submittedAt)}</div>
          </div>
        </article>
      `)
      .join('');

    listEl.querySelectorAll('.booking-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedIndex = parseInt(card.dataset.index, 10);
        openModal(bookings[selectedIndex]);
      });
    });
  }

  function openModal(b) {
    if (!b) return;

    const rows = [
      ['Name', b.fullName],
      ['Email', b.email],
      ['Phone', b.phone],
      ['Service', b.service],
      ['Property type', b.propertyType],
      ['Bedrooms', b.bedrooms],
      ['Bathrooms', b.bathrooms],
      ['Extras', b.extras],
      ['Preferred date', b.preferredDate],
      ['Preferred time', b.preferredTime],
      ['Frequency', b.frequency],
      ['Address', b.address],
      ['Instructions', b.instructions],
      ['Submitted', formatDate(b.submittedAt)]
    ];

    modalBody.innerHTML = rows
      .map(([label, value]) =>
        `<div class="detail-row">
          <span class="detail-label">${label}</span>
          <span class="detail-value">${escapeHtml(value || '—')}</span>
        </div>`
      )
      .join('');

    statusSelect.value = b.status || 'new';
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
    selectedIndex = null;
  }

  // ---------- Events ----------
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = login(passwordInput.value);
    if (!ok) {
      loginError.hidden = false;
      passwordInput.focus();
    }
  });

  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('refresh-btn').addEventListener('click', loadBookings);

  document.getElementById('clear-btn').addEventListener('click', () => {
    if (bookings.length === 0) return;
    if (confirm('Delete all booking requests from this browser?')) {
      bookings = [];
      saveBookings();
      render();
      closeModal();
    }
  });

  // Status filter
  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });

  // Status change in modal
  statusSelect.addEventListener('change', () => {
    if (selectedIndex === null) return;
    bookings[selectedIndex].status = statusSelect.value;
    saveBookings();
    render();
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  deleteBtn.addEventListener('click', () => {
    if (selectedIndex === null) return;
    if (confirm('Delete this booking request?')) {
      bookings.splice(selectedIndex, 1);
      saveBookings();
      render();
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  // ---------- Init ----------
  if (isAuthenticated()) {
    showDashboard();
  } else {
    showLogin();
  }
})();