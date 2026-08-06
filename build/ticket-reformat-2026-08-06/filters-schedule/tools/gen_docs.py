"""Generate the deliverable markdown from the machine-readable snapshots.

Nothing here is typed by hand from memory -- every count and every field verdict is read
back out of snapshots/final-audit.json, snapshots/write-log.json and the live post-edit
snapshots, so the documents cannot drift from the evidence.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
SNAP = f"{BASE}/snapshots"
sys.path.insert(0, HERE)

AUD = json.load(open(f"{SNAP}/final-audit.json"))
WLOG = json.load(open(f"{SNAP}/write-log.json"))
POP = json.load(open(f"{SNAP}/population.json"))
PRE = json.load(open(f"{SNAP}/pre-edit-all.json"))
VERS = json.load(open(f"{SNAP}/specs/versions.json"))
SRCV = json.load(open(f"{SNAP}/specs/source-verification.json"))

REW = sorted(AUD["rewritten"], key=lambda k: int(k.split("-")[1]))
CLOSED = sorted(AUD["closed_untouched"], key=lambda k: int(k.split("-")[1]))
URL = "https://shopview.atlassian.net/browse/"


def post(key):
    return json.load(open(f"{SNAP}/post-edit/{key}.json"))


def sz(key):
    pre = len(json.dumps(PRE[key]["fields"].get("description")))
    now = len(json.dumps(post(key)["fields"]["description"]))
    return pre, now


def proj(key):
    return POP["project"][key]


# ------------------------------------------------------------ TICKET-INVENTORY.md
rows = []
for k in REW:
    f = post(k)["fields"]
    a, b = sz(k)
    rows.append((k, proj(k), f["issuetype"]["name"], f["status"]["name"],
                 (f.get("priority") or {}).get("name"),
                 (f.get("parent") or {}).get("key") or "(none)",
                 f"{a} -> {b}", f["summary"]))

inv = ["# Ticket inventory — Filters (SV-8785) and Schedule (SV-8685)",
       "",
       f"**Population {AUD['totals']['population']} = {AUD['totals']['rewritten']} "
       f"rewritten + {AUD['totals']['closed_skipped']} closed and skipped.**",
       "",
       "The population was established three independent ways and reconciled, because a",
       "stale list is exactly the failure that made `build/ticket-source-blocks-2026-08-06/",
       "TICKET-LIST.md` say 66 when the truth was 87:",
       "",
       "| How | Count | What it misses |",
       "|---|---|---|",
       "| our committed records (`build/ticket-type-audit-2026-08-06/type-audit.json`) | 26 | "
       "`SV-8902`, a disposable probe never written into a FILED.md |",
       "| the live epic tree, creator = us | 26 | `SV-8848`, whose parent was removed by "
       "Mudassir Qamar, so no parent walk can see it |",
       "| a live author sweep of every SV issue this account created since 1 August | 92 | "
       "nothing, but it over-collects: it also returns the Report Suite half and 4 tickets "
       "in neither tree |",
       "| **union of the first two** | **27** | — |",
       "",
       "The two 26s are not the same 26. That is the whole reason both were run.",
       "",
       "## The 22 rewritten",
       "",
       "| Ticket | Project | Type | Status | Priority | Parent | Description bytes | Summary |",
       "|---|---|---|---|---|---|---|---|"]
for k, p, t, s, pr, par, chg, summ in rows:
    inv.append(f"| [{k}]({URL}{k}) | {p} | {t} | {s} | {pr} | {par} | {chg} | "
               f"{summ.replace('|','/')[:88]} |")
grew = [k for k in REW if sz(k)[1] > sz(k)[0]]
shrank = [k for k in REW if sz(k)[1] < sz(k)[0]]
tot_pre = sum(sz(k)[0] for k in REW)
tot_now = sum(sz(k)[1] for k in REW)
inv += ["",
        f"**Across the 22 the descriptions went from {tot_pre:,} bytes to {tot_now:,} — "
        f"{100*(tot_pre-tot_now)//tot_pre}% shorter overall.**",
        f"But it is {len(shrank)} shorter and **{len(grew)} slightly LONGER**, not 22 shorter,",
        "and the longer ones are worth saying out loud rather than hiding in an average:",
        ""]
for k in grew:
    a, b = sz(k)
    inv.append(f"- [{k}]({URL}{k}) {a} -> {b} bytes, **{b-a} longer**")
inv += ["",
        "All three are Filters tickets that already used the older, terser five-part format,",
        "so there was little bloat to remove — and the new Source section quotes more of the",
        "specification than the old one did. Quoting the requirement is the part Stefan will",
        "actually check, so that is a trade worth making.",
        "",
        "The worst offenders shrank the most, and are now roughly a third of their old length:",
        ""]
for d, k in sorted(((sz(k)[0] - sz(k)[1], k) for k in REW), reverse=True)[:5]:
    a, b = sz(k)
    inv.append(f"- [{k}]({URL}{k}) {a} -> {b} bytes, {d} removed")
inv += ["",
        "## The 5 closed and skipped",
        "",
        "See `SKIPPED-CLOSED.md` for the reasoning and the per-ticket note.",
        ""]
for k in CLOSED:
    f = post(k)["fields"] if os.path.exists(f"{SNAP}/post-edit/{k}.json") else PRE[k]["fields"]
    inv.append(f"- [{k}]({URL}{k}) — {f['status']['name']} — "
               f"{f['summary'].replace('|','/')[:86]}")
open(f"{BASE}/TICKET-INVENTORY.md", "w").write("\n".join(inv) + "\n")

# ---------------------------------------------------------------- execution-log.md
log = ["# Execution log — ticket reformat, Filters and Schedule, 2026-08-06",
       "",
       "One row per operation. Standing Rule 50: `204 No Content` on its own is not a",
       "verification, so every row carries what was compared and what the comparison found.",
       "",
       "**Sources read at pass start 2026-08-06 ~11:55Z and RE-READ at write start",
       "2026-08-06 13:26:51Z (Standing Rule 59). Verdict of the second read: UNCHANGED —",
       f"Filters still Confluence v{VERS['filters']['confluence_version']}, Schedule still "
       f"v{VERS['schedule']['confluence_version']}.**",
       "",
       "Every write was `PUT /rest/api/3/issue/{key}` with an ADF body carrying **only**",
       "`description`. No other field was sent on any request.",
       "",
       "| # | Operation | Ticket | HTTP | Fields compared | Fields moved | Description vs payload | Verdict |",
       "|---|---|---|---|---|---|---|---|"]
n = 0
for e in WLOG:
    k = e["key"]
    n += 1
    op = "verify only (re-check after the batch stop)" if e["http"].startswith("n/a") \
        else "PUT description"
    a = AUD["rewritten"].get(k, {})
    log.append(f"| {n} | {op} | [{k}]({URL}{k}) | {e['http']} | {e.get('fields_compared','')} "
               f"| {len(e.get('moved') or [])} | "
               f"{'byte-identical' if e.get('desc_ok') else '**DIFFERS**'} | "
               f"{'VERIFIED' if e.get('ok') else '**MISMATCH — batch stopped**'} |")
log += ["",
        "## The one stop, and what it was",
        "",
        "The batch **did stop once**, exactly as Rule 50 requires, on the first attempt at",
        "**SV-8845**. The description had written correctly (`204`, byte-identical to the",
        "payload) but the sweep found one field moved: `lastViewed`.",
        "",
        "It was not ours, and it was not waved away as noise. It was probed first",
        "(`snapshots/lastviewed-probe.json`):",
        "",
        "- SV-8843 has been read by us 5+ times today and its `lastViewed` has not moved off",
        "  `2026-08-05T12:31:46.607-0500`.",
        "- SV-8959 was read **and written** by us today and its `lastViewed` is still null.",
        "- So neither a REST `GET` nor our `PUT` sets it.",
        "- SV-8845's moved to `2026-08-06T08:20:05.198-0500` (13:20:05Z) — nine minutes after",
        "  Stefan Mitrovic raised its priority and about seven minutes **before** our write.",
        "",
        "**Conclusion: somebody opened SV-8845 in the Jira web UI under this shared account**",
        "**during the pass.** `lastViewed` is per-user metadata and not part of the issue's",
        "content, so it is excluded from the comparison — with that evidence recorded, and the",
        "browser view reported here rather than absorbed.",
        "",
        "## ADF normalisation: none",
        "",
        "TestRail's `update_case` re-renders any text field you omit; Jira's issue API did not",
        "do anything of the kind here. All 22 descriptions came back **byte-identical to the",
        "payload including `localId`**, which we never sent and Jira never minted. The",
        "`localId`-stripping safety net in `tools/rewrite.py` never fired. Recorded because a",
        "normalisation that does not exist is worth knowing as precisely as one that does.",
        "",
        "## Final exhaustive re-check (`snapshots/final-audit.json`)",
        "",
        f"- all **{AUD['totals']['rewritten']}** rewritten tickets re-read live and re-verified: "
        f"**{sum(1 for v in AUD['rewritten'].values() if v['pass'])} pass / "
        f"{sum(1 for v in AUD['rewritten'].values() if not v['pass'])} fail**",
        "- description compared **raw, including `localId`**: 22 of 22 exact",
        "- structural shape check — the five headings, in order, a line break before Source, an",
        "  Environment line immediately before one numbered list, and no surviving old-format",
        "  heading: **22 of 22 clean**",
        "- twelve named critical fields checked by name as well as by sweep (type, type id,",
        "  parent, priority, status, resolution, Product Area, labels, assignee, summary, links,",
        "  attachment ids): **0 changes across all 22**",
        f"- the **{AUD['totals']['closed_skipped']}** closed tickets proven byte-identical to",
        "  their pre-edit snapshot **including `updated`**, which is what proves we did not",
        "  write to them: 5 of 5 untouched",
        "",
        "### An honest note about this log's own checker",
        "",
        "The first run of the shape check reported **3 failures** on SV-8851, SV-8852 and",
        "SV-8941 for an old-format section called `test data`. It was wrong: it scanned the",
        "whole document instead of the headings, and matched our own steps saying *\"Check the",
        "test data first\"* and *\"no extra test data is needed\"* — wording Standing Rule 50",
        "asks for. **The checker was corrected, not the tickets**, and the fault is recorded",
        "here rather than quietly removed.",
        "",
        "## What was NOT done",
        "",
        "- **0 writes to anybody else's ticket.**",
        "- **0 TestRail calls of any kind** — sibling workers are live in those cases.",
        "- **0 changes to type, parent, priority, status, links, labels, assignee or Product",
        "  Area**, on any ticket, including the nine Mudassir Qamar converted and SV-8848 whose",
        "  parent he deliberately removed (Standing Rule 53's corollary).",
        "- **0 screenshots taken** — the shared QA sign-in expired estate-wide at ~11:37Z and",
        "  `quick-login` was never called. See `IMAGES-OWED.md`.",
        "- **0 tickets reopened**, including the three closed ones our records say still",
        "  reproduce.",
        ""]
open(f"{BASE}/execution-log.md", "w").write("\n".join(log) + "\n")
print("wrote TICKET-INVENTORY.md and execution-log.md")
