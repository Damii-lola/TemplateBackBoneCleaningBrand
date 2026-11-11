/**
 * Multi-step Booking Form
 * Steps: 1 Service → 2 Scheduling → 3 Contact → 4 Review → Success
 *
 * NOTE: This is a frontend template.
 * For real email notifications you will later connect:
 * - Formspree, EmailJS, or a small backend (Netlify Functions / Cloudflare Workers)
 * The data structure is ready for that integration.
 */

(function () {
  const form = document.getElementById('booking-form');
  const successState = document.getElementById('success-state');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPercent = document.getElementById('progress-percent');
  const reviewBox = document.getElementById('review-box');
  const successDetails = document.getElementById('success-details');

  if (!form) return;

  let currentStep = 1;
  const totalSteps = 3; // visible steps before review

  // ---------- Helpers ----------
  function getFormData() {
    const data = new FormData(form);
    const extras = data.getAll('extras');
    return {
      service: data.get('service') || '',
      propertyType: data.get('propertyType') || '',
      bedrooms: data.get('bedrooms') || '',
      bathrooms: data.get('bathrooms') || '',
      extras: extras.length ? extras.join(', ') : 'None',
      preferredDate: data.get('preferredDate') || '',
      preferredTime: data.get('preferredTime') || '',
      frequency: data.get('frequency') || '',
      address: data.get('address') || '',
      instructions: data.get('instructions') || 'None',
      fullName: data.get('fullName') || '',
      email: data.get('email') || '',
      phone: data.get('phone') || ''
    };
  }

  function updateProgress(step) {
    // step 1 = 33%, 2 = 67%, 3 = 100%, 4 (review) = 100%
    let percent = 33;
    let label = 'Step 1 of 3';

    if (step === 2) {
      percent = 67;
      label = 'Step 2 of 3';
    } else if (step >= 3) {
      percent = 100;
      label = step === 4 ? 'Review' : 'Step 3 of 3';
    }

    progressFill.style.width = percent + '%';
    progressText.textContent = label;
    progressPercent.textContent = percent + '% complete';
  }

  function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
      el.classList.remove('active');
    });
    const target = document.querySelector(`.form-step[data-step="${step}"]`);
    if (target) target.classList.add('active');

    currentStep = step;
    updateProgress(step);

    // scroll to top of form on mobile
    const card = document.getElementById('booking-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepEl) return true;

    let valid = true;

    // Clear previous errors
    stepEl.querySelectorAll('.error-message').forEach(el => el.remove());
    stepEl.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Required radios / inputs inside this step
    const requiredRadios = stepEl.querySelectorAll('input[type="radio"][required]');
    const radioNames = new Set();
    requiredRadios.forEach(r => radioNames.add(r.name));

    radioNames.forEach(name => {
      const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
      if (!checked) {
        valid = false;
        const group = stepEl.querySelector(`input[name="${name}"]`).closest('.form-group');
        if (group) {
          const list = group.querySelector('.radio-list');
          if (list) list.classList.add('error');
          showError(group, 'Please make a selection');
        }
      }
    });

    // Required text/date/select/email/tel
    stepEl.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
      if (input.type === 'radio') return;
      if (!input.value.trim()) {
        valid = false;
        input.classList.add('error');
        showError(input.closest('.form-group'), 'This field is required');
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        valid = false;
        input.classList.add('error');
        showError(input.closest('.form-group'), 'Please enter a valid email');
      }
    });

    return valid;
  }

  function showError(group, message) {
    if (!group) return;
    const existing = group.querySelector('.error-message');
    if (existing) return;
    const msg = document.createElement('div');
    msg.className = 'error-message';
    msg.textContent = message;
    group.appendChild(msg);
  }

  function buildReview() {
    const d = getFormData();
    const rows = [
      ['Service', d.service],
      ['Property', d.propertyType],
      ['Bedrooms', d.bedrooms || '—'],
      ['Bathrooms', d.bathrooms || '—'],
      ['Extras', d.extras],
      ['Date', d.preferredDate],
      ['Time', d.preferredTime],
      ['Frequency', d.frequency],
      ['Address', d.address],
      ['Instructions', d.instructions],
      ['Name', d.fullName],
      ['Email', d.email],
      ['Phone', d.phone]
    ];

    reviewBox.innerHTML = rows
      .map(([label, value]) =>
        `<div class="review-row">
          <span class="review-label">${label}</span>
          <span class="review-value">${value || '—'}</span>
        </div>`
      )
      .join('');
  }

  function showSuccess(data) {
    form.hidden = true;
    document.getElementById('booking-progress').hidden = true;
    successState.hidden = false;

    successDetails.innerHTML = `
      <div class="review-row"><span class="review-label">Service</span><span class="review-value">${data.service}</span></div>
      <div class="review-row"><span class="review-label">Date</span><span class="review-value">${data.preferredDate}</span></div>
      <div class="review-row"><span class="review-label">Name</span><span class="review-value">${data.fullName}</span></div>
      <div class="review-row"><span class="review-label">Phone</span><span class="review-value">${data.phone}</span></div>
    `;

    // Scroll to success
    successState.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Event listeners ----------
  form.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('[data-next]');
    const backBtn = e.target.closest('[data-back]');

    if (nextBtn) {
      const next = parseInt(nextBtn.dataset.next, 10);
      if (validateStep(currentStep)) {
        if (next === 4) buildReview();
        showStep(next);
      }
    }

    if (backBtn) {
      const back = parseInt(backBtn.dataset.back, 10);
      showStep(back);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStep(3) && currentStep === 3) return;
    if (currentStep !== 4) return;

    const data = getFormData();

    // ---- DEMO / TEMPLATE BEHAVIOUR ----
    // In production you would send this data to:
    // 1. Your backend or Formspree / EmailJS
    // 2. Email the cleaning company
    // 3. Email the customer a confirmation

    // For now we:
    // - Save to localStorage (so you can inspect it)
    // - Show the success state
    try {
      const bookings = JSON.parse(localStorage.getItem('booking_requests') || '[]');
      bookings.push({ ...data, submittedAt: new Date().toISOString() });
      localStorage.setItem('booking_requests', JSON.stringify(bookings));
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }

    console.log('Booking request data (ready for email integration):', data);

    showSuccess(data);
  });

  // Init
  updateProgress(1);
})();