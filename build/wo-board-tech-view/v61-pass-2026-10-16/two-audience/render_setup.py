#!/usr/bin/env python3
"""Render the WO Board and Tech View setup file (for Claude sessions) for the 21 two-audience cases → setup-file.html.
Sections 1-10 as ordered by the QA lead on 16 Oct 2026. No environment URL, credentials, cookies or session data."""
import os, re, json, html, importlib.util
D = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("bc", f"{D}/build_check.py")
import sys; sys.argv = ["x"]; bc = importlib.util.module_from_spec(spec); spec.loader.exec_module(bc)
from recipes import PROC, RECIPES, RESET
new = json.load(open(f"{D}/applied/new-ids.json"))
OLD = {int(k): v for k, v in json.load(open(f"{D}/existing-quotes.json")).items()}
e = lambda s: html.escape(str(s), quote=False)
def cid(c): return f"C{c['case_id']}" if c.get("case_id") else f"C{new[c['key']]}"
def link(c): n = cid(c); return f'<a href="https://shopview.testrail.io/index.php?/cases/view/{n[1:]}">{n}</a>'
def ul(xs): return "<ul>" + "".join(f"<li>{x}</li>" for x in xs) + "</ul>"
def table(head, rows): return ("<table border=\"1\" cellpadding=\"4\"><tr>" + "".join(f"<th>{e(h)}</th>" for h in head) + "</tr>"
                               + "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows) + "</table>")
def slots(c): return ["ACCOUNT-A"] + (["ACCOUNT-B"] if "SETUP-VIEWONLY" in c["recipes"] else [])
def item_text(proc, params):
    if proc == "NOTE": return e(params["text"])
    who, how, _ = PROC[proc]
    t = how.format(**{k: v for k, v in params.items() if isinstance(v, str)})
    extra = []
    if "unit" in params: extra.append(f'Unit "{params["unit"]}"')
    if "customer" in params and proc.startswith("P-WO"): extra.append(f'customer "{params["customer"]}"')
    if proc.startswith("P-WO"): extra.append(f'lead "{params["lead"]}"' if params.get("lead") else "no lead")
    if "units" in params: extra.append("units " + ", ".join(f'"{u}"' for u in params["units"]))
    if "techs" in params: extra.append("technicians " + ", ".join(f'"{x}"' for x in params["techs"]))
    if "tech" in params: extra.append(f'technician "{params["tech"]}"')
    if "screen" in params: extra.append(f"starting screen: {params['screen']}")
    if "note" in params: extra.append(params["note"])
    if "as" in params: extra.append(f"signed in as {params['as']}")
    if proc == "P-TECH": extra.insert(0, f'First Name "{params["first"]}", Last Name "{params["last"]}" (shows as "{params["first"]} {params["last"]}")')
    if proc == "P-CUSTOMER": extra.insert(0, f'Name "{params["name"]}"')
    return f"<strong>{proc}</strong> ({e(who if 'as' not in params else params['as'])}): " + (e("; ".join(extra)) + "." if extra else "as described in the procedure table.")

B = bc.built
H = ["<html><body><h1>WO Board and Tech View: setup file for Claude sessions (21 cases, 16 Oct 2026)</h1>",
     "<p>This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. With this file "
     "and the access the user gives at the start of the session, a new session can put the account into every case's starting "
     "state. It holds no environment address, credentials, cookies or session data.</p>"]
H.append("<h2>1. Header</h2>" + ul([
    "Feature: Work Orders, Board View and Tech View display options (epic SV-10043; stories SV-10044 to SV-10054).",
    "Generated: 16 Oct 2026, for the 21 cases rewritten that day in the two-audience layout (a one-time trial ordered by the QA lead).",
    "Sources: PRD \"Work Orders — Board View &amp; Tech View Display Options\", Confluence 845185030, version 61 (16 Oct 2026 15:17 UTC, Chris Ward); "
    "Jira stories SV-10044 to SV-10054 and defects SV-11317 to SV-11326, SV-11338, SV-11416; tech plan (upload of 8 Oct 2026); Claude Design "
    "project \"Work Orders\" (Branko Cicovic), export of 14 Oct 2026; QA handoff test plan (8 Oct 2026); Chris Ward's answers 1 to 31 "
    "(sheet of 14 Oct 2026).",
    "At session start, ask the user for: the site to use (staging or a QA site) and how to sign in as ACCOUNT-A, and ACCOUNT-B where a case needs it."]))
H.append("<h2>2. Accounts and roles</h2>" + table(["Slot", "Role as shown in the UI", "Used for", "How the role is set up", "Cases and recipes"], [
    ["ACCOUNT-A", "Admin", "Creates every record and performs every step except where ACCOUNT-B is named.",
     "System role; your initials &gt; Settings &gt; Roles &amp; Permissions &gt; \"Admin\": Work orders View and Create &amp; Edit on (full access, See financial data included).",
     "All 21 cases; SETUP-ADMIN and every case recipe."],
    ["ACCOUNT-B", "ZZAUTOTEST C97020 View Only", "The second user who may only view work orders.",
     "Custom role: Settings &gt; Roles &amp; Permissions &gt; Create Custom Role &gt; Skip &gt; name \"ZZAUTOTEST C97020 View Only\" &gt; under Work orders tick only View &gt; Create (P-VIEWONLY).",
     "C97020; SETUP-VIEWONLY."]]))
H.append("<h2>3. Flags and settings</h2>" + ul([e(x) for x in [
    "Density (density button left of the display switcher): Regular is the default; cases name the density they start at.",
    "Board View \"Fields to display\" > \"Line technicians\": on for C590128 and the name-bubble case (P-FIELDS-LINETECHS).",
    "Pins (per user, shared by both views): cases name which technicians are pinned, or that none is (P-PIN, P-UNPIN-ALL).",
    "Tech View columns: C590113 needs a user who has never changed Tech View's columns.",
    "Staff \"Time Clock\": on for every technician at the start; the Time Clock case turns it off during the test.",
    "Browser: design cases use a 1440 px window at 100% zoom (1536 px where named); behaviour cases need at least 1024 px.",
    "Technician filter: not on staging yet (SV-11326 open); C590127 stays Blocked until it ships."]]))
H.append("<h2>4. Data recipes</h2><h3>Shared procedures</h3>" + table(["Procedure", "Slot", "How", "Check"],
    [[f"<strong>{k}</strong>", e(v[0]), e(v[1]), e(v[2])] for k, v in PROC.items()]))
H.append("<h3>One recipe per case</h3>")
for c in B:
    r = RECIPES[[x for x in c["recipes"] if x not in ("SETUP-ADMIN", "SETUP-VIEWONLY")][0]]
    rid = [x for x in c["recipes"] if x not in ("SETUP-ADMIN", "SETUP-VIEWONLY")][0]
    H.append(f"<h4>{rid} — {link(c)} {e(c['title'])}</h4><p><strong>Satisfies these precondition lines, exactly as the case states them:</strong></p>"
             + ul([e(p) for p in c["pre"]]) + f"<p><strong>Slots:</strong> {', '.join(slots(c))}. <strong>Run first:</strong> "
             + ", ".join(x for x in c["recipes"] if x != rid) + ".</p><ol>" + "".join(f"<li>{item_text(p, v)}</li>" for p, v in r["items"]) + "</ol>"
             + f"<p><strong>Check:</strong> {e(r['check'])}</p>"
             + ("<p><strong>Placeholder values</strong> (the case names records by placeholder; give the tester the real work order numbers after setup):</p>"
                + ul([f"{e(k)} = {e(v)}" for k, v in c["placeholders"].items()]) if c.get("placeholders") else ""))
H.append("<h2>5. Mapping table (execution order)</h2>" + table(["Test case", "Account slots", "Recipes in order"],
    [[f"{link(c)} {e(c['title'])}", ", ".join(slots(c)), ", ".join(c["recipes"])] for c in B]))
H.append("<h2>6. Dependencies and shared fixtures</h2>" + ul([e(x) for x in [
    "SETUP-ADMIN runs first, once per session. SETUP-VIEWONLY runs before SETUP-C97020.",
    "Every case owns its records (names carry the case number), so no record is shared between cases and the cases can run in any order.",
    "The P- procedures are shared click paths, used with each recipe's own values."]]))
H.append("<h2>7. Reset and cleanup</h2>" + ul([e("Name everything with ZZAUTOTEST at the start; leave ZZAUTOTEST records in place (they are marked as test data).")]
    + [f"<strong>{k}</strong>: {e(v)}" for k, v in RESET.items()]
    + [e("Every other recipe is safe to re-run: reuse a record that already exists with exactly the same name and state.")]))
rows = []
for c in B:
    q = "".join(f"<li>Steps {e(t['steps'])} — <strong>{e(t['label'])}</strong> ({e(t['source'])}): “{e(t['quote'])}”</li>" for t in c["trace_resolved"])
    nav = f"<p>Steps with no source sentence (navigation and on-screen labels, taken from the build): {', '.join(map(str, c['navigation_steps']))}.</p>" if c["navigation_steps"] else ""
    lc = (OLD.get(c.get("case_id") or 0) or {}).get("last_checked")
    lc = re.sub(r", before the expected results changed.*$", "", lc or "").rstrip(".")
    chk = (lc + (", before the expected results changed on 16 Oct 2026; not yet checked against a build since." if c["expected_changed"] else ".")) if lc else "Not yet checked against a build."
    rows.append(f"<h3>{link(c)} {e(c['title'])}</h3><p>{e(c['summary'])}</p><ul>{q}</ul>{nav}<p>Jira: {e(c.get('refs') or 'none')}. {e(chk)}</p>")
H.append("<h2>8. Traceability</h2><p>Every expected result in the cases comes from the sentence quoted against its step. The quotes are word for word; a checker "
         "(build_check.py) refuses any case whose quote is not found verbatim in its source.</p>" + "".join(rows))
H.append("<h2>9. VIU status</h2>" + table(["Item", "Status"],
    [["Every recipe", "UNVERIFIED in this pass: the click paths are the ones used by the staging runs of 14 to 16 Oct 2026, not re-observed today."],
     ["P-CLOCKIN", "UNVERIFIED on screen; an API route is recorded (see the procedure)."],
     ["P-EMPTY-LOCATION", "UNVERIFIED: no recorded way to get a location with no work orders."]]
    + [[f"{link(c)}", e("UNVERIFIED: not yet run in this layout. " + c["marker"])] for c in B]))
H.append("<h2>10. Open questions</h2>" + ul([e(x) for x in [
    "QA lead: C368150 (13 steps), C368152 (12), C97020 (16) and C590117 (11) are over the 10-step limit; they were not split (safeguard). Split them?",
    "QA lead: the \"No work orders yet\" case needs a location with no work orders. Is there one we may use, or may a session create one?",
    "Product owner: S2-R23 gives no-photo initials --sv-grey-600 (#4B5565) and also says header avatars use \"the design's smaller, lighter initials\". Are header initials grey-600 too, or lighter? The cases judge only \"dark grey, a little darker than the design picture\".",
    "Product owner: S11-R1 says Tab lands on \"the first one\" when no work order has been focused. The cases read this as the first card on the board (the Unassigned column's first card) and the first row of the table.",
    "C368214: the old \"write down whether the search text is kept\" note was dropped (it was not a pass/fail check; S1-R8 keeps List's Back behaviour as in production)."]]))
H.append("</body></html>")
open(f"{D}/setup-file.html", "w").write("\n".join(H))
print("setup-file.html", len("\n".join(H)), "chars")
