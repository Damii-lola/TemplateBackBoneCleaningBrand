# TemplateBackBoneCleaningBrand

Reusable **template backbone** for cleaning brand websites.

Built for GitHub Pages. Design will be integrated later. Finished client sites will live in separate folders/repos so this backbone stays clean and reusable.

---

## Current Structure

```
TemplateBackBoneCleaningBrand/
├── index.html          ← Homepage (fully structured)
├── css/
│   └── styles.css      ← Modern responsive styles + CSS variables
├── js/
│   └── main.js         ← Mobile menu + small utilities
└── README.md
```

**Coming next:**
- `booking.html` (booking page)
- CTA page (if separate)

---

## Homepage Sections

| Section          | Status                          |
|------------------|---------------------------------|
| Header           | Logo, nav, phone, Book Now btn  |
| Hero             | Templated (headline + image)    |
| Trust Bar        | Insured / Experienced / Guarantee |
| About            | Heading only (content later)    |
| Services         | 6 templated cards               |
| Why Choose Us    | 4 reasons                       |
| Gallery          | 6 placeholder slots             |
| Testimonials     | 3 placeholder reviews           |
| Service Areas    | Placeholder tags                |
| FAQ              | 6 common questions              |
| Final CTA        | Strong Book Now section         |
| Footer           | Contact + social + nav (templated) |

All “Book Now” / “Book a Cleaning” buttons currently point to `booking.html` (to be built next).

---

## How to Use

1. Clone or work directly in this repo.
2. When design arrives → replace placeholders, colors, images, and copy.
3. For a new client → copy the finished version into a new folder/repo and customize.

### Easy Theming
All main colors live in CSS variables at the top of `css/styles.css`:
```css
--color-primary
--color-primary-dark
--color-secondary
--color-accent
```

---

## GitHub Pages

Once ready, enable GitHub Pages from the repo settings (branch: `main`, folder: `/root`).

---

## Future Expansion

This same backbone approach will later be adapted for:
- Event planner businesses
- Car rental businesses
- Real estate agencies