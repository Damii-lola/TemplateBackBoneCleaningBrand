# TemplateBackBoneCleaningBrand

Reusable **template backbone** for cleaning brand websites.

GitHub Pages + **Supabase** (multi-brand database) + **Gmail emails** via Edge Function.

> **Before shipping a client site:** read **[BRAND-INTEGRATION.md](./BRAND-INTEGRATION.md)**

---

## Pages

| Page | File | Purpose |
|------|------|--------|
| Homepage | `index.html` | Introduces the brand |
| CTA | `cta.html` | Persuades visitor to book |
| Booking | `booking.html` | Form → Supabase + emails |
| Admin | `admin.html` | This brand’s bookings only |

```
Homepage → CTA → Booking → Supabase (brand_id) → emails → Admin
```

---

## Multi-brand Supabase

One Supabase project can store **many brands**.

Each site sets a unique `brandId` in `js/supabase-config.js`.
Bookings are saved with `brand_id`, `brand_name`, `brand_type`.
Admin **only** loads rows for its own `brand_id`.

`brandType` is `Cleaning` for now (future templates can use other types).

---

## Setup

### 1. SQL
Run `supabase-setup.sql` in Supabase SQL Editor.

### 2. Config
Edit **`js/supabase-config.js`**:

- `brandId`, `brandName`, `brandType`, `brandEmail`
- `adminUsername`, `adminPassword`
- Supabase URL + publishable key
- `emailFunctionUrl`

### 3. Gmail emails (Edge Function)

**Never put Gmail password in GitHub.**

1. Deploy function folder: `supabase/functions/send-booking-emails`
2. In Supabase → **Edge Functions → Secrets**, add:

| Secret | Value |
|--------|--------|
| `GMAIL_USER` | your Gmail |
| `GMAIL_APP_PASSWORD` | Google App Password |

3. Set `emailFunctionUrl` in config to:
   `https://YOUR_PROJECT.supabase.co/functions/v1/send-booking-emails`

On each booking:
- Brand gets an alert at `brandEmail`
- Client gets a confirmation

---

## Admin

- Username / password from `js/supabase-config.js`
- Status tags + filters
- Scoped to this `brandId` only

---

## Structure

```
├── index.html / cta.html / booking.html / admin.html
├── supabase-setup.sql
├── BRAND-INTEGRATION.md
├── supabase/functions/send-booking-emails/index.ts
├── css/
└── js/
    ├── supabase-config.js   ← main place to change per brand
    ├── booking.js
    ├── admin.js
    └── main.js
```
