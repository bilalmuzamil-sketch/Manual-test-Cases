import json
IMG="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9627-mobile-logout-2026-09-02/evidence/EX1-localstorage-purge-logout.png"
GIF="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9627-mobile-logout-2026-09-02/evidence/EX2-stop-clockout-logout-demo.gif"
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
 p(t("To keep a technician signed in, the app relies on two things: a "),strong("session pass"),t(" the server gives out at login, and a "),strong("copy of “who you are” saved on the phone."),t(" If either goes missing while the tech is on a job, the app treats them as signed out.")),
 p(t("Things that quietly remove one of those during a job:")),
 bl(
   li(strong("iPhones wipe a website’s saved data on their own. "),t("Apple deletes a site’s saved data after about 7 days of using Safari without opening that site (any time they open it resets the clock). When the “who you are” copy is wiped, the app no longer knows who the tech is — even though nothing is wrong on the server. This is an iPhone behaviour; Android phones do not do this on a timer.")),
   li(strong("“Cleaner” / privacy apps and “clear browsing data” "),t("wipe the same saved login — on both iPhone and Android — and cause the identical sign-out.")),
   li(strong("The session pass lapses after ~24 hours of not using the app "),t("(left overnight or over a weekend). This is the app’s own setting and is the same on every phone — it is not an iPhone or Android behaviour.")),
   li(strong("Occasionally, the phone reclaiming space "),t("when storage is nearly full, or an app update, can clear it too.")),
 ),
 p(t("Whichever happens, the tech "),strong("looks signed out to the app"),t(", and the app has "),strong("no “quietly sign me back in” step"),t(" — so the very next tap (which, at the end of a job, is STOP) bounces them to the login screen. They sign in again, tap STOP again, and it works. That is the “intermittent re-login before clock out” the customer is describing. Because iPhones auto-wipe and Android does not, this will hit iPhone users far more often.")),

 h("Reproduced on production (recording)"),
 *media(GIF,"Step-by-step recording on a phone-sized screen: signed in and working the job → mid-job the phone clears the saved login → returning to clock out lands on the Login screen → log in again → back to work. Reproduced on production; no data created or deleted."),
 p(t("If the image above does not animate in your view, open the recording here: "),link("session-loss recording (GIF)",GIF),t(".")),
 h("Does the STOP button itself log them out? No."),
 p(t("We opened up the STOP button in the live app. All it does is send the “clock me out” request — it contains "),strong("nothing"),t(" that signs a user out. The sign-out is a separate, app-wide rule that fires whenever the server says “your session is gone,” and STOP is simply the request that happens to hit the dead session first.")),

 *media(IMG,"Reproduced on production, phone-sized screen. Left: the technician is signed in. Right: after the phone’s saved app data is cleared (nothing else touched), the app immediately shows the login screen — exactly what an iPhone does to saved data after about a week, and what a cleaner app does on any phone."),

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
 p(strong("Platform facts (confirmed): "),t("iOS/WebKit (every browser on iPhone) deletes all script-writable storage — localStorage, sessionStorage, IndexedDB, JS-set cookies — after 7 days of Safari use without interacting with the site; a real interaction resets the timer ("),link("WebKit blog","https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/"),t("). Chrome/Chromium (Android + desktop) has no such time-based purge; storage is removed only by the user, a cleaner app, or storage-pressure eviction. So the auto-wipe path is iPhone-specific; Android hits this mainly via cleaner apps / manual clear / the 24h inactivity lapse.")),
 p(strong("Fixes, technically: "),t("(1) on boot, if the localStorage user is absent but the cookie is valid, hydrate from "),code("GET /api/auth/me…"),t("; (2) on 409, attempt silent re-auth / add a refresh token before routing to Login; (3) persist + replay the clock-out mutation across re-auth with the original timestamp; (4) longer/sliding idle window + graceful deploy handling; consider a first-party auth domain to avoid SameSite=None.")),
]}
open("comment.adf.json","w").write(json.dumps(doc))
print("built OK; length", len(json.dumps(doc)))
