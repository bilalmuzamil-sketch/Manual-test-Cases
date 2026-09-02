import json
IMG="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9627-mobile-logout-2026-09-02/evidence/EX1-localstorage-purge-logout.png"
def t(s,m=None):
    n={"type":"text","text":s}
    if m: n["marks"]=m
    return n
def p(*c): return {"type":"paragraph","content":list(c)}
def strong(s): return t(s,[{"type":"strong"}])
def code(s): return t(s,[{"type":"code"}])
def link(s,u): return t(s,[{"type":"link","attrs":{"href":u}}])
def h(s,l=3): return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def panel(k,*c): return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def li(*content): return {"type":"listItem","content":[p(*content)]}
def bl(*items): return {"type":"bulletList","content":list(items)}
def cell(*c,head=False): return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs): return {"type":"tableRow","content":cs}
def rule(): return {"type":"rule"}
def media(url,cap): return [{"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]}, p(t(cap,[{"type":"em"}]))]
tbl=lambda rows: {"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":rows}

doc={"type":"doc","version":1,"content":[
 panel("note",
   p(strong("In one line: "),t("the STOP button is not logging anyone out. The technician gets quietly signed out during the job, and tapping STOP is just the first moment the app notices — so it sends them to the login screen before they can clock out. We reproduced the cause on production.")))
 ,
 h("In plain words (for anyone)"),
 p(t("To keep a technician signed in, the app relies on two things: a "),strong("session pass"),t(" the server gives out at login, and a "),strong("copy of “who you are” saved on the phone."),t(" If either is removed while the tech is on a job, the app treats them as signed out. There are two main ways it gets removed:")),

 h("Scenario 1 — the phone wipes the saved login on its own (mainly iPhones)",4),
 p(t("Apple’s Safari automatically deletes a website’s saved data after about "),strong("7 days"),t(" of using Safari without opening that site (opening the site resets the clock). When it wipes ShopView’s saved “who you are,” the app no longer knows who the technician is — even though nothing is wrong on the server. This is an iPhone behaviour; Android phones do not do this on a timer, so this scenario hits iPhone users specifically.")),

 h("Scenario 2 — a “cleaner” app deletes it",4),
 p(t("Lots of phones run “cleaner” / “space saver” apps that clear junk to free up storage — for example "),strong("CCleaner"),t(", or a phone’s built-in optimiser like "),strong("Samsung Device Care"),t(" or "),strong("Xiaomi’s Cleaner / Security app"),t(".")),
 p(strong("How they cause it (their process): "),t("the cleaner scans the phone for “junk” — app cache, browsing history, and "),strong("cookies & site data"),t(" — and deletes it. This runs either when the person taps “Clean/Optimise,” or "),strong("automatically on a schedule"),t(" (e.g. Samsung’s Auto-optimisation runs daily; several cleaners run on a timer or at restart). When the cleaner clears the browser’s "),strong("cookies & site data"),t(" for ShopView, it removes "),strong("both"),t(" the session pass and the saved “who you are,” so the technician is signed out — the same result as Scenario 1, but triggered by the cleaner instead of the 7-day timer, and it happens on "),strong("both iPhone and Android."),t(" A browser set to “clear cookies on exit,” or a privacy browser like Firefox Focus that auto-erases when closed, does exactly the same thing.")),

 p(t("Two smaller causes: the session pass also lapses after about "),strong("24 hours"),t(" of not using the app (left overnight or over a weekend — this is the app’s own setting, the same on every phone), and rarely the phone clears the data when storage is nearly full or after an app update.")),

 p(t("Whichever happens, the tech "),strong("looks signed out to the app"),t(", and the app has "),strong("no “quietly sign me back in” step"),t(" — so the very next tap (which, at the end of a job, is STOP) bounces them to the login screen. They sign in again, tap STOP again, and it works. That is the “intermittent re-login before clock out” the customer is describing.")),

 h("Does the STOP button itself log them out? No."),
 p(t("We opened up the STOP button in the live app. All it does is send the “clock me out” request — it contains "),strong("nothing"),t(" that signs a user out. The sign-out is a separate, app-wide rule that fires whenever the server says “your session is gone,” and STOP is simply the request that happens to hit the dead session first.")),

 *media(IMG,"Reproduced on production, phone-sized screen. Left: the technician is signed in. Right: after the phone’s saved app data is cleared (nothing else touched — the session cookie was left valid), the app immediately shows the login screen. This is what an iPhone does after ~7 days, and what a cleaner app like CCleaner does on any phone."),

 h("What we recommend fixing"),
 bl(
   li(strong("Re-fetch “who you are” from the server when the phone has wiped it "),t("(the session pass is often still valid) — this alone would stop most of these sign-outs. Biggest win.")),
   li(strong("Add a “quietly sign me back in” step "),t("so a lapsed session refreshes on its own instead of throwing the tech to a login screen.")),
   li(strong("Never lose the clock-out. "),t("Hold the tap and finish it after re-login, keeping the original time — so no punch is lost and admins stop hand-editing timesheets.")),
   li(strong("Keep technicians signed in longer "),t("through a normal shift/overnight, and handle app updates without signing people out.")),
 ),

 rule(),
 h("Technical details (for the developers)"),
 p(t("Verified live on production, 02 Sep 2026 (analyst account; no data created or deleted).")),
 tbl([
   row([cell(p(strong("Check")),head=True),cell(p(strong("Result")),head=True)]),
   row([cell(p(t("Auth"))),cell(p(t("Only auth cookie is "),code("PHPSESSID"),t(" — 24h "),strong("sliding"),t(" (refreshed each response), HttpOnly/Secure/SameSite=None. No SSO cookie, no refresh token, so nothing to silently re-auth with once it lapses. The 24h is server-set and browser/OS-agnostic — not an iOS/Android behaviour.")))]),
   row([cell(p(t("localStorage cleared, cookie kept"))),cell(p(t("App force-redirects to Login. "),code("getUser()"),t(" reads identity from localStorage only, with no API re-hydration; "),code("isUserAbleToClock"),t("/"),code("getStaffId"),t(" derive from it.")))]),
   row([cell(p(t("Cookie deleted, localStorage kept"))),cell(p(t("Every API call → "),code("409 “Session has expired”"),t("; app stays on the page in a broken state (identity still cached).")))]),
   row([cell(p(t("Session-id rotation"))),cell(p(t("Pre-rotation id still returns 200 (grace) → no parallel-request race. Ruled out.")))]),
   row([cell(p(t("STOP button"))),cell(p(code("stop_timesheet"),t(" onClick fires the clock-out request only; the chunk has no logout/removeUser/session code. Global interceptor logs out on "),code("[401,403,404,409,422]"),t(": 409 → "),code("logout()+removeUser()+push(Login)"),t(", no refresh.")))]),
 ]),
 p(strong("Platform facts (confirmed): "),t("iOS/WebKit (every browser on iPhone) deletes all script-writable storage — localStorage, sessionStorage, IndexedDB, JS-set cookies — after 7 days of Safari use without interacting with the site; a real interaction resets the timer ("),link("WebKit blog","https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/"),t("). Chrome/Chromium (Android + desktop) has no such time-based purge; storage is removed only by the user, a cleaner app, or storage-pressure eviction. Cleaner apps ("),link("CCleaner","https://www.ccleaner.com/ccleaner-android"),t(", Samsung Device Care, Xiaomi Cleaner, Norton/AVG cleanup) clear “cookies & site data” on demand or on a schedule, which wipes both the cookie and localStorage. So the auto-wipe path is iPhone-specific; Android hits this mainly via cleaner apps / manual clear / the 24h inactivity lapse.")),
 p(strong("Fixes, technically: "),t("(1) on boot, if the localStorage user is absent but the cookie is valid, hydrate from "),code("GET /api/auth/me…"),t("; (2) on 409, attempt silent re-auth / add a refresh token before routing to Login; (3) persist + replay the clock-out mutation across re-auth with the original timestamp; (4) longer/sliding idle window + graceful deploy handling; consider a first-party auth domain to avoid SameSite=None.")),
]}
open("comment.adf.json","w").write(json.dumps(doc))
print("built OK; length", len(json.dumps(doc)))
