"""Verify EVERY requirement each ticket cites against the LIVE spec body.

Two of our tickets were once caught citing requirements that do not exist, and the only
reason it was found was a live re-read. So each claim is checked two ways:
  (a) the ANCHOR (e.g. S11-R2, or the section number) is present in the live text;
  (b) a distinctive PHRASE from the quotation is present in the live text.
A claim passes only if BOTH hold. Curly quotes/dashes are normalised before matching.
"""
import json, os, re, sys, unicodedata

ROOT = "/home/user/Manual-test-Cases"
OUT = f"{ROOT}/build/ticket-reformat-2026-08-06/filters-schedule/snapshots/specs"

VERS = json.load(open(f"{OUT}/versions.json"))


def norm(s):
    s = unicodedata.normalize("NFKC", s)
    for a, b in [("“", '"'), ("”", '"'), ("‘", "'"), ("’", "'"),
                 ("–", "-"), ("—", "-"), ("−", "-"), (" ", " "),
                 ("→", "->")]:
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", s).strip().lower()


SPEC = {}
for name, m in VERS.items():
    SPEC[name] = norm(open(f"{OUT}/{name}-v{m['confluence_version']}.txt").read())

# ticket -> list of (anchor, distinctive phrase from the quotation)
CLAIMS = {
    # ---- Filters (Confluence v19) ----
    "SV-8845": ("filters", [
        ("S11-R2", "loads with those filters pre-applied and the table already filtered"),
    ]),
    "SV-8846": ("filters", [
        ("S7-R3", 'a "clear filters" button appears in the filter bar to the right of all chips'),
        ("S12-R2", '"clear filters" appears when active'),
    ]),
    "SV-8871": ("filters", [
        ("S7-R1", "and displays the selected value(s)"),
        ("S10-R1", "restored exactly as they were left"),
    ]),
    "SV-8912": ("filters", [
        ("S13-R16", "tapping the collapsed control expands it in place within the action row"),
        ("S13-R17", "fills the remaining width of the action row"),
        ("S13-R18", "uses its natural hug width instead of stretching to fill the row"),
        ("S13-R9", "never returns results from another table"),
    ]),
    # ---- Schedule (Confluence v25) ----
    "SV-8848": ("schedule", [
        ("4.2", "the technician's configured working hours take precedence"),
        ("4.8", "a vertical indicator showing the current time"),
    ]),
    "SV-8849": ("schedule", [
        ("4.9", "clicking a shift block opens a detail panel"),
    ]),
    "SV-8850": ("schedule", [
        ("4.7", 'collapse into a "+n more" affordance that opens a popover listing the hidden shifts'),
    ]),
    "SV-8851": ("schedule", [
        ("Tech Hours", "displays each technician's working hours next to their name"),
    ]),
    "SV-8852": ("schedule", [
        ("4.9", 'a conflict banner with an "adjust" action when the shift is conflicted'),
    ]),
    "SV-8853": ("schedule", [
        ("Escape closes", "escape closes the topmost open modal or popover"),
        ("Enter confirms", "enter confirms the active confirmable dialog"),
    ]),
    "SV-8854": ("schedule", [
        ("14.2", "the sidebar hides the work order list"),
    ]),
    "SV-8855": ("schedule", [
        ("4.5", "defaults to the earliest working day"),
    ]),
    "SV-8856": ("schedule", [
        ("4.8", "snaps to 15-minute intervals"),
    ]),
    "SV-8857": ("schedule", [
        ("5.1", 'with an active-count badge'),
        ("5.1b", '"clear all" resets in one click'),
    ]),
    "SV-8886": ("schedule", [
        ("4.3", '"select all" shortcut (equivalent to whole order), and cancel'),
    ]),
    "SV-8924": ("schedule", [
        ("3.2", "dragging a shift from this row down onto a technician assigns it"),
        ("4.2", "that technician's hours apply"),
    ]),
    "SV-8933": ("schedule", [
        ("4.2", "set custom hours for this technician"),
        ("4.2b", "one row per day"),
    ]),
    "SV-8941": ("schedule", [
        ("4.4", "month view omits it due to space constraints"),
    ]),
    "SV-8942": ("schedule", [
        ("11", "minimum supported width is 960px"),
        ("11b", "the sidebar collapses on narrow viewports"),
    ]),
    "SV-8957": ("schedule", [
        ("11", "drag-and-drop has a click-to-arm alternative"),
    ]),
    "SV-8958": ("schedule", [
        ("4.6", "labeled once at the start (with the technician)"),
    ]),
    "SV-8959": ("schedule", [
        ("4.13", "customer name (plus the conflict icon if conflicted)"),
    ]),
}

if __name__ == "__main__":
    results, fails = {}, 0
    for key, (spec, claims) in sorted(CLAIMS.items(), key=lambda x: int(x[0].split("-")[1])):
        body = SPEC[spec]
        rows = []
        for anchor, phrase in claims:
            a = norm(re.sub(r"[a-z]$", "", anchor)) if re.match(r"^\d", anchor) else norm(anchor)
            anchor_ok = a in body
            phrase_ok = norm(phrase) in body
            rows.append({"anchor": anchor, "anchor_found": anchor_ok,
                         "phrase": phrase, "phrase_found": phrase_ok,
                         "pass": anchor_ok and phrase_ok})
            if not (anchor_ok and phrase_ok):
                fails += 1
        results[key] = {"spec": spec,
                        "confluence_version": VERS[spec]["confluence_version"],
                        "claims": rows,
                        "all_pass": all(r["pass"] for r in rows)}
        mark = "PASS" if results[key]["all_pass"] else "**FAIL**"
        print(f"{key}  {spec:9} v{VERS[spec]['confluence_version']}  {mark}")
        for r in rows:
            if not r["pass"]:
                print(f"     anchor {r['anchor']!r} found={r['anchor_found']}  "
                      f"phrase found={r['phrase_found']}  {r['phrase'][:70]!r}")
    json.dump(results, open(f"{OUT}/source-verification.json", "w"), indent=1)
    print(f"\n{len(results)} tickets, {fails} failed claim(s)")
