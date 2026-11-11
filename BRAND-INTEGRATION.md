# ⚠️ BRAND INTEGRATION CHECKLIST

**Read this every time you copy this template for a real client.**

All brand-specific values live mainly in **`js/supabase-config.js`**.

---

## 1. `js/supabase-config.js` (required)

| Field | What to set |
|-------|-------------|
| `brandId` | Unique slug, e.g. `sparkle-homes-la` (no spaces) |
| `brandName` | Display name, e.g. `Sparkle Homes` |
| `brandType` | For now always `Cleaning` |
| `brandEmail` | Where new booking alerts go |
| `adminUsername` | Usually same as brand name |
| `adminPassword` | Strong password for this client’s admin |
| `supabaseUrl` | Same project URL if sharing one Supabase |
| `supabasePublishableKey` | Publishable key |
| `emailFunctionUrl` | Your deployed Edge Function URL |

---

## 2. Visible placeholders on pages

Search the repo for these and replace:

- `[Brand Name]`
- `[Phone Number]`
- `[Email Address]`
- `[Service Area]` / `[City / Region]`
- `[Hero Lifestyle Photo]` and other image placeholders
- Service names / descriptions / reviews

Files: `index.html`, `cta.html`, `booking.html`, `admin.html`

---

## 3. Supabase (once per project, not per brand)

1. Run `supabase-setup.sql` (includes `brand_id`, `brand_name`, `brand_type`)
2. Deploy Edge Function `supabase/functions/send-booking-emails`
3. Set Edge Function secrets (see below) — **never** put these in GitHub

---

## 4. Gmail for emails

**Where credentials go:** Supabase Dashboard → Edge Functions → Secrets

| Secret name | Value |
|-------------|--------|
| `GMAIL_USER` | your Gmail address |
| `GMAIL_APP_PASSWORD` | 16-character app password |

How to get an app password:
1. Google Account → Security → 2-Step Verification (on)
2. App passwords → create one for “Mail”

**Do not** put Gmail password or app password in any frontend file or this repo.

Emails sent:
- To **brand** (`brandEmail` in config) — new booking alert
- To **client** (form email) — confirmation

---

## 5. Multi-brand rule

One Supabase project can hold many brands.

Each website’s `brandId` must be unique.
Admin and booking form always filter/insert with that `brandId`.
Brand A’s admin never sees Brand B’s rows.

---

## 6. Admin login

- Username = `adminUsername` in config (default placeholder `[Brand Name]`)
- Password = `adminPassword` in config

This is a client-side gate only. For higher security later, use Supabase Auth.

---

## Quick test after integration

1. Submit a booking on the live form
2. Check Supabase Table Editor → row has correct `brand_id`
3. Check brand inbox + client inbox for emails
4. Log into admin with that brand’s username/password → only that brand’s bookings
