import json
IMG="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9627-mobile-logout-2026-09-02/evidence/EX1-localstorage-purge-logout.png"
def t(s,m=None):
    n={"type":"text","text":s}
    if m:n["marks"]=m
    return n
def p(*c):return {"type":"paragraph","content":list(c)}
def strong(s):return t(s,[{"type":"strong"}])
def code(s):return t(s,[{"type":"code"}])
def h(s,l=3):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def panel(k,*c):return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def bullet(*items):return {"type":"bulletList","content":[{"type":"listItem","content":[p(*(it if isinstance(it,list) else [it]))]} for it in items]}
def cell(*c,head=False):return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs):return {"type":"tableRow","content":cs}
def media(url,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]}, p(t(cap,[{"type":"em"}]))]

tbl=lambda rows: {"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":rows}

doc={"type":"doc","version":1,"content":[
 panel("note",
   p(strong("Root cause found and reproduced on production."),t(" Short version: the STOP button is not what logs the technician out. STOP only sends a clock-out request. If the technician's session has already expired during the job, the server rejects that request and the app has a single global rule that logs the user out and sends them to the Login screen — with no silent re-login. STOP is just the first request after a long idle/backgrounded job, so it is the action that discovers the dead session.")),
 ),
 h("The STOP button specifically"),
 p(t("I traced the STOP button in the production build (the My Timesheets component). The red \"Stop\" button ("),code("data-test-id-suffix=\"stop_timesheet\""),t(") renders on any timesheet row that is not yet clocked out, and its click handler only fires the clock-out request. "),strong("That handler contains no logout, no user-clearing and no session code at all"),t(" — I searched the whole chunk. So STOP cannot log anyone out by itself.")),
 p(strong("The chain is:"),t(" tap STOP → clock-out request → if the session already died, the server returns "),code("409 Session has expired"),t(" → the app's global error handler runs logout + redirect to Login (no refresh attempt) → the technician re-logs-in and taps STOP again, which works. Any action taken at that moment would trigger the same thing; STOP is simply the one they always take at the end of a job.")),
 h("What actually kills the session (verified live on production, 02 Sep 2026)"),
 p(t("I logged in on production and tested the session mechanics directly. No production data was created or deleted.")),
 tbl([
   row([cell(p(strong("Check")),head=True),cell(p(strong("Result")),head=True)]),
   row([cell(p(t("Auth cookie set"))),cell(p(t("The only auth cookie is "),code("PHPSESSID"),t(", expiring exactly 24h after login, HttpOnly/Secure/SameSite=None. There is no long-lived SSO cookie and no remember-me/refresh token, so once it dies there is nothing to silently re-auth with.")))]),
   row([cell(p(strong("localStorage purge (cookie kept)"))),cell(p(t("Cleared only localStorage with a valid cookie still present → the app force-redirected to the Login screen. The user identity is read only from localStorage, with no re-fetch from the server. "),strong("This is the strongest fit for a mobile-only intermittent logout — iOS Safari wipes app storage after ~7 days / under storage pressure.")))]),
   row([cell(p(t("Cookie is sliding"))),cell(p(t("Every response re-issues PHPSESSID with a fresh 24h expiry, so the session dies after 24h of "),strong("inactivity"),t(" (phone asleep overnight/weekend), not 24h since login.")))]),
   row([cell(p(t("Cookie deleted (localStorage kept)"))),cell(p(t("Every API call returns 409 but the app stays on the page (identity still in localStorage) — the technician sees a half-broken screen where clock-out fails, rather than a clean re-login.")))]),
   row([cell(p(t("Session-id rotation"))),cell(p(t("The rotated-away id still works (grace) → no parallel-request race. Ruled out.")))]),
 ]),
 *media(IMG,"Reproduced on production (iPhone-sized viewport). Left: technician logged in on the Work Orders screen, session cookie valid. Right: after clearing only localStorage (cookie untouched), a reload forces the Login screen — exactly what iOS Safari does to stored data after about 7 days."),
 h("Why it is intermittent and mobile-only"),
 bullet(
   [strong("iOS Safari storage eviction "),t("(~7 days of not opening the app, or under storage pressure) wipes localStorage → instant logout even though the cookie is valid. Proven above.")],
   [strong("24h of app inactivity "),t("expires the sliding session cookie (overnight/weekend, phone asleep).")],
   [strong("SameSite=None cookie "),t("can be dropped or partitioned by iOS in cross-site contexts.")],
   [strong("A production deploy "),t("mid-shift invalidates active sessions.")],
   [t("In every case there is "),strong("no silent re-login"),t(", so the next request (usually STOP) drops the technician on the Login screen.")],
 ),
 h("Recommended fixes (the gaps to close)"),
 bullet(
   [strong("Re-hydrate the user from the API on load "),t("when localStorage is missing but the session cookie is still valid — this makes an iOS storage wipe self-healing instead of a logout. Biggest single win.")],
   [strong("Silent re-auth before forcing Login "),t("on a 409 session-expiry (and/or a refresh token), so a recoverable session does not dump the user to a login screen.")],
   [strong("Never lose the clock-out "),t("— queue it locally with its original timestamp and replay after re-auth, so the punch is not lost and admins stop hand-editing timesheets.")],
   [strong("Longer/sliding idle window "),t("tuned for a technician on a job, and graceful handling of deploys.")],
 ),
 p(t("The fix is in session lifetime + the global 409 handler + the localStorage dependency — "),strong("not in the STOP button."),t(" Full technical write-up with the exact cookie attributes, the 409 body and the code references is available on request.")),
]}
open("comment.adf.json","w").write(json.dumps(doc))
print("built; length", len(json.dumps(doc)))
