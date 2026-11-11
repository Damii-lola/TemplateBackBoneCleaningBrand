# TemplateBackBoneCleaningBrand

Reusable **template backbone** for cleaning brand websites.

Built for GitHub Pages + **Supabase** (bookings database).

---

## Pages

| Page | File | Purpose |
|------|------|--------|
| Homepage | `index.html` | Introduces the brand |
| CTA | `cta.html` | Persuades visitor to book |
| Booking | `booking.html` | Multi-step form → saves to Supabase |
| Admin | `admin.html` | View / update / delete bookings |

**Flow**
```
Homepage → CTA → Booking form → Supabase → Admin dashboard
```

---

## Supabase setup (required)

### 1. Create a project
Go to [supabase.com](https://supabase.com) → New project.

### 2. Run the SQL
Open **SQL Editor** → New query → paste and run everything in:

`supabase-setup.sql`

This creates the `bookings` table + RLS policies.

### 3. Add your keys
Open `js/supabase-config.js` and replace:

```js
window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key';
```

Find them in: **Project Settings → API**

### 4. Test
1. Open `booking.html` → submit a booking  
2. Open `admin.html` → password `admin123` → you should see the request  

---

## Admin

- Password: `admin123` (change in `js/admin.js`)
- Statuses: New · Contacted · Confirmed · Completed · Cancelled
- Filter by status, update status, delete requests

> Client-side password is only a UI gate. For real production security, switch admin to **Supabase Auth** and tighten the RLS policies (examples are commented in `supabase-setup.sql`).

---

## Structure

```
├── index.html
├── cta.html
├── booking.html
├── admin.html
├── supabase-setup.sql
├── css/
│   ├── styles.css
│   ├── cta.css
│   ├── booking.css
│   └── admin.css
└── js/
    ├── main.js
    ├── booking.js
    ├── admin.js
    └── supabase-config.js
```

---

## Mobile & tablet

All pages are fully responsive.

---

## Next steps for a live client site

1. Put real design / copy / images in place  
2. Fill Supabase keys  
3. Change admin password  
4. (Recommended) Add Supabase Auth for admin + lock RLS  
5. Optional: email alerts via Supabase Edge Functions or a form service  
6. Copy the finished site into a new client repo/folder  
