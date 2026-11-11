# TemplateBackBoneCleaningBrand

Reusable **template backbone** for cleaning brand websites.

Built for GitHub Pages. Design will be integrated later. Finished client sites will live in separate folders/repos so this backbone stays clean and reusable.

---

## Pages

| Page | File | Purpose |
|------|------|--------|
| **Homepage** | `index.html` | Introduces the brand |
| **CTA Page** | `cta.html` | Persuades the visitor to book |
| **Booking Page** | `booking.html` | Collects customer details (multi-step form) |

**Flow:**
```
Homepage → CTA Page → Booking Page → Email notification to the brand
```

---

## Booking Page Features

Multi-step form:

1. **Service details** – Cleaning service, property type, bedrooms, bathrooms, extras
2. **Scheduling** – Preferred date & time, frequency, address, instructions
3. **Contact info** – Name, email, phone
4. **Review** → Submit → Success message

After submission (template behaviour):
- Data is saved to `localStorage` (for demo/testing)
- Ready for real email integration (Formspree / EmailJS / backend)
- Brand receives the request and contacts the customer to confirm

---

## Structure

```
TemplateBackBoneCleaningBrand/
├── index.html
├── cta.html
├── booking.html
├── css/
│   ├── styles.css      (shared + homepage)
│   ├── cta.css
│   └── booking.css
├── js/
│   ├── main.js
│   └── booking.js
└── README.md
```

---

## Mobile & Tablet

All three pages are fully responsive:
- Homepage
- CTA page
- Booking multi-step form

---

## Theming

Main colors live in CSS variables at the top of `css/styles.css`:
```css
--color-primary
--color-primary-dark
--color-secondary
--color-accent
```

---

## Next Steps

1. Integrate real design from Open Design
2. Connect real email service for booking notifications
3. Replace all `[placeholders]` with brand content
4. Copy finished version into a new client folder/repo