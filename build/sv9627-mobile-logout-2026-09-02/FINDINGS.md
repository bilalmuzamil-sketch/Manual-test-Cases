# SV-9627 — Why technicians get logged out on mobile before clock-out

**Ticket:** SV-9627 — "Technician clock out intermittently requires re-login/authentication before clock out" (Bug, Medium, Blocked; source Intercom / HubSpot; Chris Ward: *"Suspect: this may have something to do with the client-side browser/device"*).
**Investigated:** 2026-09-02, against **production** (app.shopview.com / api.shopview.com), app-version **v26.35.7-a8739ed**.
**Method:** read-only production probes (auth headers + 409 shape) + static analysis of the production SPA bundle `/js/index.DOUypnfd.js`. No production writes, no login performed.

---

## 1. What the bug actually is (reframing)

It is **not** a customer choosing to log out. The **session silently dies** while the technician is on a job, and the **clock-out is simply the first action that hits the dead session** — at which point the app force-redirects to the Login screen. It is *intermittent* because whether the session is still alive at clock-out time depends on how long the phone sat idle/backgrounded, whether a deploy landed, and mobile-browser storage/cookie eviction timing.

**This is why you can't reproduce it on your own phone:** your session is fresh (< 24 h), your phone kept the cookie and localStorage, and no deploy landed while you tested. The failure only appears once one of the expiry conditions in §3 has actually occurred.

---

## 2. Auth architecture (VERIFIED on production 2026-09-02)

| Fact | Evidence |
|------|----------|
| Session credential is the **`PHPSESSID`** cookie, **`Max-Age=86400` (24-hour absolute)**, `HttpOnly; Secure; SameSite=none` | `Set-Cookie: PHPSESSID=…; Max-Age=86400; path=/; secure; HttpOnly; SameSite=none` on api.shopview.com |
| A dead/absent session → API returns **HTTP 409 `{"errors":[{"error":"Session has expired."}]}`** | live unauth call to `/api/auth/me/fe-permissions` |
| Frontend is an **S3 + CloudFront** static SPA; API is **nginx** | `server: AmazonS3` / `x-amz-cf-*` on app.shopview.com; `server: nginx` on api.shopview.com |
| **On 409, the SPA hard-logs-out**: aborts in-flight requests, `logout()`, `removeUser()`, redirect to `Login`. **No silent refresh exists** | bundle: `if(n===409&&…)(he=!0,ye.abort(),…logout(),removeUser(),…push({name:"Login"}))`; grep for refreshToken/refresh_token/silentRefresh/renewToken = **0 hits** |
| **User identity is read ONLY from `localStorage["user"]`** (`getUser`), with **no API re-hydration fallback**; `isUserAbleToClock` and `getStaffId` both derive from it | bundle: `Tt="user"… k={getUser:()=>se(Tt)||null, isUserAbleToClock:()=>k.getUser()?.data.details.clockable…, getStaffId:()=>k.getUser()?.data.details.staff_id}` |
| Router sends you to **Login when `getUser()` is null** | bundle: `…?r():r(n?{name:"WorkOrders"}:{name:"Login"})` where `n=getUser()` |
| The app registers **`visibilitychange`** handlers that refetch/​reload on foreground | bundle: `document.addEventListener("visibilitychange",Pn)`; `So(){!document.hidden&&…}` → `window.location.reload()` in one path |
| 401 with `sso_required` + `sso_redirect_url` → SSO redirect | bundle: `if(D.error==="sso_required"&&D.sso_redirect_url){…redirect…}` |

---

## 3. The ways a technician gets logged out (the gaps to fill)

Ranked by likely contribution. Each marked **VERIFIED** (observed in code/headers this session) or **HYPOTHESIS** (grounded, dev to confirm).

### A. Server / session-lifetime
1. **24-hour absolute session cookie.** `PHPSESSID` Max-Age is exactly 86 400 s. A tech who logged in yesterday is force-logged-out today the moment they act — e.g. at clock-out. **VERIFIED.** *Intermittent because each tech crosses the 24 h line at a different moment.*
2. **Server-side idle expiry during a job.** If PHP's `session.gc_maxlifetime` (or an app idle-TTL) is shorter than a shift, a session with no requests for that window is GC'd server-side even while the cookie is still valid → next request 409. A tech pockets the phone for the whole job, so no requests go out. **HYPOTHESIS — dev to confirm the idle TTL and whether the cookie is *sliding* (renewed per request) or absolute.** *This is the single best fit for "intermittent, right before clock-out."*
3. **No silent re-authentication.** Any 409 immediately dumps the user to the Login screen; the code never attempts to silently re-auth (no refresh token; the 409 path does **not** try the SSO `sso_redirect` flow that the 401 path uses). **VERIFIED.** So even a perfectly recoverable session forces a manual login.
4. **Deploy invalidates sessions mid-shift.** A production deploy that rotates the session store / signing changes kills active sessions; the next request 409s. **HYPOTHESIS (known behavior on these apps).**

### B. Mobile browser / device (Chris's "client-side browser/device")
5. **`localStorage["user"]` purge → logout even with a live cookie.** `getUser()` is localStorage-only; iOS Safari's ITP caps *all script-writable storage* (localStorage + JS-set cookies) at **~7 days** and evicts it (and evicts under storage pressure). Once `user` is gone, `getUser()` is null → routed to Login, and `isUserAbleToClock`/`getStaffId` fail — **the clock-out itself can't proceed.** **VERIFIED by code + documented iOS behavior.**
6. **`SameSite=none` auth cookie dropped/partitioned on mobile.** iOS treats `SameSite=none` cookies as cross-site and can partition or purge them (especially with an SSO login on a different domain), so the cookie isn't sent → 409. **HYPOTHESIS grounded in the verified `SameSite=none`.**
7. **Backgrounded tab discarded (memory pressure).** iOS/Android reclaim backgrounded web views; `sessionStorage` is lost and the page reloads. On return the `visibilitychange` refetch/reload fires against a missing session/storage → Login. **VERIFIED handler + known behavior.**
8. **Private browsing / "clear on close" / Add-to-Home-Screen vs Safari-tab storage partition.** A tech who logs in inside one context and opens another, or uses private mode, starts unauthenticated. **Known behavior.**
9. **Device clock skew** breaking any time-based validity check. **Possible, low.**

---

## 4. Why it surfaces specifically "before clock out"

1. Tech clocks **in** to a job and pockets the phone — the app is **backgrounded and makes no requests** for the length of the job.
2. During that window the session dies via any mechanism in §3 (24 h line, idle GC, iOS cookie/localStorage eviction, tab discard, or a deploy).
3. Tech reopens the app to clock **out** → a `visibilitychange` refetch fires, or the clock-out POST fires → server returns **409** → the SPA logs them out and shows **Login**.

The clock-out is not special; it is just the **next request after a long idle/background window**, which is precisely when a dead session is discovered.

---

## 5. How to reproduce it deliberately (a fresh session will not show it)

1. **localStorage purge (simulates iOS ITP, quickest):** on the phone/desktop, DevTools → Application → **clear localStorage only** (keep cookies) → reload → **forced to Login** even though the cookie is valid.
2. **Cookie expiry:** delete the `PHPSESSID` cookie, **or** set the device clock forward > 24 h from login, **or** simply wait > 24 h → next action → Login.
3. **Idle-during-job:** clock into a job, leave the app **backgrounded and untouched** for the server idle-TTL (dev to supply the number), return, tap **Clock out** → re-login.
4. **iOS 7-day:** on an iPhone, don't open the app for **7+ days** → Safari purges storage → Login.
5. **Deploy mid-session:** while clocked in, have a production deploy land → next request 409 → Login.
6. **Tab discard:** open many tabs / enable Low Power Mode to force the web view to be reclaimed → return → Login.

---

## 6. Recommended fixes (gaps to fill so it never happens again)

1. **Silent re-auth before forcing login.** On 409 "session expired", first attempt the SSO silent re-auth (the same `sso_redirect` path the 401 branch already uses); only show the Login screen if that round-trip fails. Today the 409 path skips this entirely.
2. **Re-hydrate the user from the API on boot** (`GET /api/auth/me…`) when `localStorage["user"]` is missing but the session cookie is valid — so an iOS storage purge is **self-healing** instead of a logout.
3. **Never lose the clock-out.** Persist/queue the clock-out action locally with its **original timestamp** and replay it after re-auth — so a re-login mid-clock-out doesn't drop the punch and doesn't force admins to hand-edit timesheets.
4. **Sliding session + a longer idle window** tuned for a technician-on-a-job (renew the cookie/session on activity; make the idle-TTL longer than a realistic job).
5. **Reduce reliance on ITP-vulnerable storage:** keep auth in a first-party `HttpOnly` cookie and, if possible, a **first-party auth domain** so `SameSite=Lax` works instead of `SameSite=none`; always API-rehydrate rather than trusting localStorage alone.
6. **Foreground validation:** on `visibilitychange`→visible, silently validate/refresh the session **before** firing data refetches that could 409 the user out.
7. **Graceful deploys:** version-check and soft-reload the SPA without dropping the session.

---

## 7. Honest limits (not verified this session — for dev confirmation)

- The **exact server-side idle TTL** and whether `PHPSESSID` is **sliding or absolute** — read from PHP/session config (§3.2). This is the highest-value unknown.
- Whether a **longer-lived SSO session cookie** (e.g. `sv_sso_session`) exists on production that could power a silent re-auth (§6.1).
- **Real iOS-device ITP timing** was not reproduced on a physical device this session; §3.5 is grounded in the verified `getUser`-from-localStorage code plus documented iOS Safari behavior.
- No production login was performed, so sliding-cookie behavior and the authenticated cookie set were not directly observed — only the unauthenticated 409 + cookie attributes.
