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

## 2b. LIVE VERIFICATION — logged into production 2026-09-02 (bilal.muzamil@shopview.com)

Four live tests on `app.shopview.com` / `api.shopview.com`. No production data was created or deleted.

| Test | What I did | Result |
|------|-----------|--------|
| **Auth cookie set** | Logged in, read all cookies | The **only** auth cookie is `PHPSESSID` — `expires` exactly **24 h** after login, `HttpOnly; Secure; SameSite=None`. `_ga*` are analytics. **There is NO long-lived SSO cookie and NO "remember me"/refresh token.** So once `PHPSESSID` dies there is *nothing* to silently re-auth with. |
| **T1 — localStorage purge, cookie kept** | Cleared **only** localStorage (confirmed `PHPSESSID` still present), reloaded | **Forced to `/login?redirect=/workorders`.** A storage purge logs the tech out even though the session cookie is alive. **This is the iOS Safari mechanism, proven.** |
| **T2 — sliding vs absolute** | Made an authed request, read `Set-Cookie` | Cookie is **sliding**: every response re-issues `PHPSESSID` with a fresh `Max-Age=86400` (session id also rotates). So the death is **24 h of *inactivity***, not 24 h since login. |
| **T3 — cookie deleted, localStorage kept** | Deleted `PHPSESSID`, kept `localStorage["user"]`, navigated | Every API call returns **409**, but the app **stays on the page** (because `getUser()` still finds the localStorage user) — the tech sees a half-broken screen where actions fail, rather than a clean re-login. |
| **T4 — session-id rotation race** | Reused the pre-rotation session id after a request rotated it | Old id still returns **200** (grace) → **no parallel-request race.** Ruled out, so devs need not chase it. |

Evidence: `evidence/EX1-localstorage-purge-logout.png` (before = logged in on mobile; after = clearing localStorage forces the Login screen, cookie untouched).

---

## 3. The ways a technician gets logged out (the gaps to fill)

Ranked by likely contribution. Each marked **VERIFIED** (observed in code/headers this session) or **HYPOTHESIS** (grounded, dev to confirm).

### A. Server / session-lifetime
1. **24-hour *sliding* session cookie.** `PHPSESSID` Max-Age is 86 400 s, **refreshed on every request** (T2). So a tech whose app makes no requests for 24 h (overnight/weekend, phone asleep) is logged out on the next action — e.g. at clock-out. **VERIFIED.** *Intermittent because it depends on the gap since the last request.*
2. **Server-side idle expiry during a job.** If PHP's `session.gc_maxlifetime` (or an app idle-TTL) is shorter than a shift, a session with no requests for that window is GC'd server-side even while the cookie is still valid → next request 409. A tech pockets the phone for the whole job, so no requests go out. **HYPOTHESIS — dev to confirm the idle TTL and whether the cookie is *sliding* (renewed per request) or absolute.** *This is the single best fit for "intermittent, right before clock-out."*
3. **No silent re-authentication.** Any 409 immediately dumps the user to the Login screen; the code never attempts to silently re-auth (no refresh token; the 409 path does **not** try the SSO `sso_redirect` flow that the 401 path uses). **VERIFIED.** So even a perfectly recoverable session forces a manual login.
4. **Deploy invalidates sessions mid-shift.** A production deploy that rotates the session store / signing changes kills active sessions; the next request 409s. **HYPOTHESIS (known behavior on these apps).**

### B. Mobile browser / device (Chris's "client-side browser/device")
5. **`localStorage["user"]` purge → logout even with a live cookie. VERIFIED LIVE ON PRODUCTION (T1).** `getUser()` is localStorage-only; iOS Safari's ITP caps *all script-writable storage* (localStorage + JS-set cookies) at **~7 days** and evicts it (and evicts under storage pressure). I cleared only localStorage with a valid cookie and the app force-redirected to Login. Once `user` is gone, `getUser()` is null → routed to Login, and `isUserAbleToClock`/`getStaffId` fail — **the clock-out itself can't proceed.** *This is the strongest single explanation for a mobile-only, intermittent logout, and it matches Chris's "client-side browser/device" hunch.*
5b. **"Cleaner"/privacy apps and "clear browsing data" wipe the saved login** (on BOTH iOS and Android) → same logout as §5. A very common real-world trigger. **Grounded (known behavior).**
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

## 4b. The STOP button specifically — does clicking STOP log the technician out?

**No — STOP does not log anyone out by itself.** Verified from the code (`MyTimesheets` chunk):

- The red **"Stop"** button (`data-test-id-suffix="stop_timesheet"`) renders on any open timesheet row (`row.clock_out ? nothing : Stop`). Its `onClick` calls `be()` → `Re()`, which fires the **clock-out API request**.
- **The STOP handler contains no `logout`, `removeUser`, `clear`, `signOut`, or session code whatsoever** — I searched the entire chunk. It cannot be an active cause of the logout.

**So the chain is:** tap STOP → clock-out request goes out → **if the session already died during the job, the server returns `409 "Session has expired"` → the app's *global* error handler runs `logout()` + `removeUser()` + redirect to Login** (no silent refresh). The technician re-logs-in, taps STOP again, and it works.

**STOP is simply the first authenticated request after the technician's long idle/backgrounded job**, so it is the request that *discovers* the already-dead session and triggers the global logout. Any action taken at that moment would do the same; STOP just happens to be the one they always take at the end of a job. The fix is therefore **not** in the STOP button — it is in session lifetime + the global 409 handler + the localStorage dependency (§6).

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

## 6b. Platform facts (confirmed via WebKit/Chromium sources 2026-09-02)

- **The 24-hour expiry is NOT an OS behavior** — it is ShopView's own `PHPSESSID` cookie (server-set, 24h sliding, verified live). It applies identically on iOS, Android and desktop. Do not attribute it to iPhone/Android.
- **iOS (WebKit — every browser on iPhone) deletes all script-writable storage** (localStorage, sessionStorage, IndexedDB, JS-set cookies) **after 7 days of Safari use without interacting with the site**; any real interaction resets the timer. Home-screen web apps keep their own timer. Source: WebKit blog "Full Third-Party Cookie Blocking and More" (webkit.org/blog/10218). This wipes the on-device identity → logout even with a valid cookie (matches T1).
- **Android / Chrome / Chromium has NO time-based purge** — storage is removed only by the user, a cleaner app, or storage-pressure eviction. So the automatic-wipe logout is **iPhone-specific**; Android is affected mainly via cleaner apps, manual clear, or the 24h inactivity lapse. Source: Chromium groups discussion (localStorage does not expire by default).

**Conclusion: this bug will hit iPhone technicians far more often than Android**, because only iOS auto-wipes storage on a timer.

## 7. Honest limits (not verified this session — for dev confirmation)

- The **exact server-side idle TTL** and whether `PHPSESSID` is **sliding or absolute** — read from PHP/session config (§3.2). This is the highest-value unknown.
- Whether a **longer-lived SSO session cookie** (e.g. `sv_sso_session`) exists on production that could power a silent re-auth (§6.1).
- **Real iOS-device ITP timing** was not reproduced on a physical device this session; §3.5 is grounded in the verified `getUser`-from-localStorage code plus documented iOS Safari behavior.
- No production login was performed, so sliding-cookie behavior and the authenticated cookie set were not directly observed — only the unauthenticated 409 + cookie attributes.
