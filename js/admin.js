/**
 * Admin Dashboard → Supabase (per-brand)
 *
 * ⚠️ WHEN INTEGRATING A REAL BRAND:
 *   - adminUsername / adminPassword / brandId come from js/supabase-config.js
 *   - This page ONLY loads rows where brand_id matches config.brandId
 *   - Never hardcode credentials or brand ids here
 */

(function () {
  const cfg = window.BRAND_CONFIG || {};
  const AUTH_KEY = 'admin_authenticated_' + (cfg.brandId || 'default');

  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const usernameInput = document.getElementById('admin-username');
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

  let supabase = null;
  let bookings = [];
  let selectedId = null;
  let currentFilter = 'all';

  // Apply brand name to UI
  const brandLabel = cfg.brandName || '[Brand Name]';
  document.querySelectorAll('#login-brand-name, #header-brand-name').forEach(el => {
    if (el) el.textContent = brandLabel;
  });
  const noteBrand = document.getElementById('note-brand-id');
  if (noteBrand) noteBrand.textContent = cfg.brandId || 'brand_id';
  const subtitle = document.getElementById('admin-subtitle');
  if (subtitle) subtitle.textContent = brandLabel + ' only · ' + (cfg.brandType || 'Cleaning') + ' · Live from Supabase';

  try {
    if (window.supabase && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY
        && !String(window.SUPABASE_URL).includes('YOUR_')
        && !String(window.SUPABASE_PUBLISHABLE_KEY).includes('YOUR_')) {
      supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
    }
  } catch (err) {
    console.warn('Supabase init failed', err);
  }

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

  function login(username, password) {
    const expectedUser = cfg.adminUsername || '[Brand Name]';
    const expectedPass = cfg.adminPassword || 'change-this-password';
    if (username === expectedUser && password === expectedPass) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      showDashboard();
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    showLogin();
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    loginError.hidden = true;
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
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
    return ({
      new: 'New', contacted: 'Contacted', confirmed: 'Confirmed',
      completed: 'Completed', cancelled: 'Cancelled'
    })[status] || status;
  }

  async function loadBookings() {
    if (!supabase) {
      emptyEl.hidden = false;
      listEl.hidden = true;
      emptyEl.querySelector('h2').textContent = 'Supabase not configured';
      emptyEl.querySelector('p').textContent = 'Check js/supabase-config.js and run supabase-setup.sql.';
      return;
    }

    if (!cfg.brandId) {
      emptyEl.hidden = false;
      listEl.hidden = true;
      emptyEl.querySelector('h2').textContent = 'brandId missing';
      emptyEl.querySelector('p').textContent = 'Set brandId in js/supabase-config.js so this admin only loads its own bookings.';
      return;
    }

    // CRITICAL: filter by this brand only
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('brand_id', cfg.brandId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      alert('Could not load bookings: ' + error.message);
      return;
    }

    bookings = data || [];
    render();
  }

  function getFiltered() {
    if (currentFilter === 'all') return bookings;
    return bookings.filter(b => b.status === currentFilter);
  }

  function render() {
    totalCountEl.textContent = bookings.length;
    newCountEl.textContent = bookings.filter(b => b.status === 'new').length;

    const filtered = getFiltered();

    if (bookings.length === 0) {
      emptyEl.hidden = false;
      listEl.hidden = true;
      emptyEl.querySelector('h2').textContent = 'No bookings yet';
      emptyEl.querySelector('p').textContent = 'When customers submit the booking form, their requests will appear here.';
      listEl.innerHTML = '';
      return;
    }

    if (filtered.length === 0) {
      emptyEl.hidden = false;
      listEl.hidden = true;
      emptyEl.querySelector('h2').textContent = 'No bookings with this status';
      emptyEl.querySelector('p').textContent = 'Try another filter or wait for new requests.';
      listEl.innerHTML = '';
      return;
    }

    emptyEl.hidden = true;
    listEl.hidden = false;

    listEl.innerHTML = filtered.map(b => `
      <article class="booking-card" data-id="${b.id}">
        <div class="booking-main-info">
          <h3>${escapeHtml(b.full_name || 'Unknown')}</h3>
          <div class="booking-meta">
            <span>${escapeHtml(b.phone || '—')}</span>
            <span>${escapeHtml(b.email || '—')}</span>
            <span>${escapeHtml(b.preferred_date || '—')}</span>
          </div>
        </div>
        <div class="booking-side">
          <div class="status-tag status-${b.status || 'new'}">${statusLabel(b.status || 'new')}</div>
          <div class="booking-service">${escapeHtml(b.service || 'Service')}</div>
          <div class="booking-date">${formatDate(b.created_at)}</div>
        </div>
      </article>
    `).join('');

    listEl.querySelectorAll('.booking-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedId = card.dataset.id;
        openModal(bookings.find(b => b.id === selectedId));
      });
    });
  }

  function openModal(b) {
    if (!b) return;
    const rows = [
      ['Name', b.full_name], ['Email', b.email], ['Phone', b.phone],
      ['Service', b.service], ['Property type', b.property_type],
      ['Bedrooms', b.bedrooms], ['Bathrooms', b.bathrooms], ['Extras', b.extras],
      ['Preferred date', b.preferred_date], ['Preferred time', b.preferred_time],
      ['Frequency', b.frequency], ['Address', b.address],
      ['Instructions', b.instructions], ['Submitted', formatDate(b.created_at)]
    ];
    modalBody.innerHTML = rows.map(([label, value]) =>
      `<div class="detail-row"><span class="detail-label">${label}</span><span class="detail-value">${escapeHtml(value || '—')}</span></div>`
    ).join('');
    statusSelect.value = b.status || 'new';
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
    selectedId = null;
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!login(usernameInput.value.trim(), passwordInput.value)) {
      loginError.hidden = false;
      passwordInput.focus();
    }
  });

  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('refresh-btn').addEventListener('click', loadBookings);

  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });

  statusSelect.addEventListener('change', async () => {
    if (!selectedId || !supabase) return;
    const newStatus = statusSelect.value;
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', selectedId);
    if (error) {
      alert('Could not update status: ' + error.message);
      return;
    }
    const item = bookings.find(b => b.id === selectedId);
    if (item) item.status = newStatus;
    render();
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  deleteBtn.addEventListener('click', async () => {
    if (!selectedId || !supabase) return;
    if (!confirm('Delete this booking request?')) return;
    const { error } = await supabase.from('bookings').delete().eq('id', selectedId);
    if (error) {
      alert('Could not delete: ' + error.message);
      return;
    }
    bookings = bookings.filter(b => b.id !== selectedId);
    render();
    closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  if (isAuthenticated()) showDashboard();
  else showLogin();
})();
