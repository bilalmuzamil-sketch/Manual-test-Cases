import json
IMG="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9627-mobile-logout-2026-09-02/evidence/EX1-localstorage-purge-logout.png"
def t(s,m=None):
    n={"type":"text","text":s}
    if m:n["marks"]=m
    return n
def p(*c):return {"type":"paragraph","content":list(c)}
def strong(s):return t(s,[{"type":"strong"}])
def h(s,l=4):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def panel(k,*c):return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def li(*content):return {"type":"listItem","content":[p(*content)]}
def bl(*items):return {"type":"bulletList","content":list(items)}
def media(url,cap):return [{"type":"mediaSingle","attrs":{"layout":"center"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]}, p(t(cap,[{"type":"em"}]))]

doc={"type":"doc","version":1,"content":[
 panel("note",
   p(strong("Clicking Clock Out (Stop) does NOT log anyone out."),t(" The technician’s session is already dead by the time they tap Stop. Stop just sends the clock-out request, the app sees the session is gone, and shows the Login screen — so they log in, tap Stop again, and it works. Reproduced on production."))),

 h("How the session gets killed during the job"),
 bl(
   li(strong("iPhone wipes the saved login on its own"),t(" — after about 7 days of not opening the app (iPhones only).")),
   li(strong("A “cleaner” app clears it"),t(" — see the list below (iPhone or Android).")),
   li(strong("The app isn’t opened for ~24 hours"),t(" — left overnight or over a weekend.")),
   li(strong("Rarely"),t(" — the phone is very low on storage, or right after an app update.")),
 ),

 h("Apps / settings that cause it"),
 bl(
   li(t("CCleaner")),
   li(t("Samsung Device Care (built-in — runs automatically)")),
   li(t("Xiaomi Cleaner / Security app")),
   li(t("Firefox Focus, or a browser set to “clear cookies on exit” (auto-erases on close)")),
   li(strong("How they do it: "),t("they delete the browser’s “cookies & site data,” which removes the saved login — on a tap, or on an automatic schedule.")),
 ),

 *media(IMG,"Reproduced on production: signed in (left) → after the saved data is cleared, the app shows Login (right). The session cookie was left valid — the app still logs you out."),

 h("For the developers (short)"),
 bl(
   li(t("The app reads “who you are” only from the phone’s saved data, so the moment the phone clears it the tech is logged out — even though the login is often still valid on the server.")),
   li(t("There’s no automatic “sign me back in,” so any request on a dead session (Stop included) forces a full re-login.")),
   li(strong("Fix: "),t("on load, restore the session from the server when the saved data is gone; add silent re-login; and don’t lose the clock-out.")),
 ),
]}
open("comment_short.json","w").write(json.dumps(doc))
print("built:", len(json.dumps(doc)))
