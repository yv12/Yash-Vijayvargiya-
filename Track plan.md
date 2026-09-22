# Click Tracking Implementation Plan

Goal: log when someone clicks "View live" on a project, and capture enough client-side data to know roughly who and how engaged, without a database and without breaking the site if tracking fails.

This plan fits the existing stack: Vite/React/TypeScript client, Fastify on Node 20, single Railway service, no database.

---

## 1. What gets logged

Per click, one record:

| Field | Source | Notes |
|---|---|---|
| `id` | server, random | unique record id |
| `slug` | client | which project (`blinkit`, `myntra`, etc., matched against `content.ts`) |
| `timestamp` | server clock | source of truth |
| `ip` | request header | via Railway's `X-Forwarded-For`, first entry |
| `userAgent` | request header | browser + device |
| `referrer` | client, `document.referrer` | where they came from (LinkedIn, resume PDF, Google, direct) |
| `timeOnPageMs` | client | time between page load and click |
| `scrollDepthPct` | client | how far down the page they scrolled before clicking |
| `viewport` | client | width x height, tells you mobile vs desktop |

Not collected: name, email, anything requiring login, fingerprinting, cookies.

---

## 2. Client side

In the Project section, on the "View live" link:

- Do not `preventDefault()`. The link must keep working exactly as it does now, even if tracking fails entirely. This matches the existing rule that the page works with the chat dead, applied here to tracking.
- On click, fire `navigator.sendBeacon('/api/click', payload)`. This is async and does not delay navigation.
- Fallback if `sendBeacon` is unsupported: `fetch('/api/click', { method: 'POST', keepalive: true, body: payload })` wrapped in `try/catch`, failure ignored silently.
- Debounce: ignore a second click on the same link within 2 seconds, so accidental double-taps don't create duplicate records.
- Track on mount: `pageLoadTime = Date.now()`, and a throttled scroll listener updating `maxScrollPct`. Both live in a small hook, not spread across components.

---

## 3. Server side

New route: `POST /api/click` in a new `server/tracking.ts`, registered in `server/index.ts` alongside the existing chat route.

- Accepts the beacon payload (comes as `text/plain`, so add a content type parser that `JSON.parse`s it).
- Validates `slug` against the known project slugs from `content.ts`. Unknown slug: respond `204`, do not write a record.
- Reject bodies over 2KB.
- Always respond `204`, regardless of whether the write succeeded. The client never needs to know.
- Append one line to a JSONL log file, wrapped in `try/catch`. A disk error is logged to the server console only, never surfaced to the visitor.

### Storage

No database, so: an append-only JSONL file at `CLICK_LOG_PATH` (default `./data/clicks.log`), one JSON object per line.

**Required action on Railway:** attach a volume mounted at `/data`, set `CLICK_LOG_PATH=/data/clicks.log`. Without a volume, the file lives on the container's ephemeral disk and is wiped on every redeploy.

### Retention (no cron needed)

The skill rules out a worker process, so retention runs lazily: on each write, check a sidecar file `data/.last-prune`. If more than 24 hours have passed, filter out lines older than `CLICK_RETENTION_DAYS` (default 90) and rewrite the log file, then update the sidecar timestamp. Runs inline in the request, adds negligible latency.

### Admin view

`GET /admin/clicks?token=...`

- Compares `token` against `ADMIN_TOKEN` env var using `crypto.timingSafeEqual`, not `===`.
- Wrong or missing token: `404`, not `401` (don't confirm the route exists).
- Returns the log as a simple table (project, timestamp, device, referrer, rough location from IP).
- Not linked from anywhere on the site. Add `Disallow: /admin` to `robots.txt`.
- Reuses the existing in-memory rate limiter pattern from the chat route, capped tighter (10 requests/hour).

---

## 4. Privacy compliance

General guidance, not legal advice.

- Add a short **Privacy Notice** in the site footer or a `/privacy` route stating:
  - What's collected: which project was clicked, timestamp, browser/device, referring page, approximate location from IP, on-page engagement signals.
  - Why: to understand which work visitors find interesting.
  - Retention: 90 days, deleted automatically after.
  - No cookies, no third-party trackers, no ad networks, nothing sold or shared.
  - Contact email for a deletion request.
- **Mask the IP before storing it**: keep it only as `203.0.113.xxx` (zero out the last octet). Still gives city-level location, reduces how much personal data is held. This is a design default below, flag if you'd rather keep the full IP for accuracy.
- No cookie consent banner needed, since nothing here uses cookies or cross-site tracking. The notice above covers the transparency requirement under GDPR (legitimate interest) and India's DPDP Act.
- If you later add a third-party IP-geolocation API, that introduces an external data processor and the notice needs to say so. Treat that as a separate decision, not part of this build.

---

## 5. Edge cases

- **sendBeacon blocked by an ad blocker or privacy extension**: silent data loss, link still works. Acceptable.
- **Bots/crawlers generating link previews** (LinkedIn, Twitter unfurling): they fetch the page HTML, they don't fire a click event. Not logged.
- **In-app browsers** (LinkedIn, Instagram) sometimes strip the referrer or alter the user agent: expect some `referrer: none` entries, not a bug.
- **Shared IPs** (office network, mobile carrier NAT, VPN): several people can share one IP. Location/device data is a signal, not proof of one identity.
- **Tampered or garbage payloads**: validated slug allow-list and 2KB body cap handle this; anything invalid is dropped, not stored.
- **Disk write failure or missing volume**: caught, logged server-side, response is still `204`. The link never breaks because logging failed.
- **JavaScript disabled entirely**: the link is a plain `<a href>`, so it still navigates. You just get no tracking data for that visit.

---

## 6. Environment variables to add

```
CLICK_LOG_PATH=/data/clicks.log
CLICK_RETENTION_DAYS=90
ADMIN_TOKEN=
```

Add all three to `.env.example` with empty values, set real values in the Railway dashboard.

---

## 7. Build order

Do this after the site and chat route are already shipped (steps 1-5 in the main build order):

1. Client hook: page load time, scroll depth, debounced click handler with `sendBeacon`.
2. Server route `POST /api/click`, validation, JSONL append, lazy prune.
3. Railway volume attached, env vars set.
4. Admin route with token check.
5. Privacy notice added to the footer/`/privacy`.
6. `robots.txt` updated.

## 8. Before calling it done

- [ ] Clicking a project link logs exactly one record and still opens the live URL
- [ ] Double-click within 2 seconds logs only once
- [ ] Link still opens correctly with JavaScript disabled
- [ ] Killing disk write access (bad path) doesn't block the link or throw a visible error
- [ ] `/admin/clicks` with no or wrong token returns 404
- [ ] `/admin/clicks` with the right token returns the log
- [ ] A backdated test entry older than the retention window is pruned on the next write
- [ ] Privacy notice is reachable and accurate
- [ ] IP is stored masked, not in full (unless you decided otherwise)
