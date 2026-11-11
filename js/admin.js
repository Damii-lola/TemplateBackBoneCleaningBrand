/**
 * Admin Dashboard – reads booking requests from localStorage
 * (Demo only – replace with real backend later)
 */

(function () {
  const STORAGE_KEY = 'booking_requests';

  const listEl = document.getElementById('bookings-list');
  const emptyEl = document.getElementById('empty-state');
  const totalCountEl = document.getElementById('total-count');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const deleteBtn = document.getElementById('delete-booking-btn');

  let bookings = [];
  let selectedIndex = null;

  function loadBookings() {
    try {
      bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // Newest first
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
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return iso;
    }
  }

  function render() {
    totalCountEl.textContent = bookings.length;

    if (bookings.length === 0) {
      emptyEl.hidden = false;
      listEl.hidden = true;
      listEl.innerHTML = '';
      return;
    }

    emptyEl.hidden = true;
    listEl.hidden = false;

    listEl.innerHTML = bookings
      .map((b, i) => `
        <article class="booking-card" data-index="${i}">
          <div class="booking-main-info">
            <h3>${escapeHtml(b.fullName || 'Unknown')}</h3>
            <div class="booking-meta">
              <span>${escapeHtml(b.phone || '—')}</span>
              <span>${escapeHtml(b.email || '—')}</span>
              <span>${escapeHtml(b.preferredDate || '—')}</span>
            </div>
          </div>
          <div class="booking-side">
            <div class="booking-service">${escapeHtml(b.service || 'Service')}</div>
            <div class="booking-date">${formatDate(b.submittedAt)}</div>
          </div>
        </article>
      `)
      .join('');

    // Click to open detail
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

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
    selectedIndex = null;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  // Events
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

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  // Init
  loadBookings();
})();