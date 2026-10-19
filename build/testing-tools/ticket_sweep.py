#!/usr/bin/env python3
"""Ticket and source sweep (Rule 129, 19 Oct 2026). Finds every ticket under a project's epic and stories, and every PRD version,
that our suite has not yet handled. Exit 1 while anything is unhandled: a report must not call the project current until it is 0.

Why it exists: on 19 Oct 2026 the designer filed SV-11522 and SV-11524 (WO Board) and the PO moved the PRD to v65 and v66 the same
afternoon. Nothing in our process looked at Jira or the PRD unless the QA lead handed a ticket over, so no case was written.

Inputs (all files; the session fetches Jira and Confluence with its own tools and saves the results):
  --config  build/<project>/TICKET-SWEEP.json  {"project", "epic", "stories": [...], "prd_page", "prd_version_handled"}
  --jira    a saved JQL result: the JSON of searchJiraIssuesUsingJql for
            parent in (<epic>, <stories>) ORDER BY created ASC   (fields: summary, status, issuetype, created, updated)
  --prd-version N   the PRD version read today (getConfluenceContent detail=summary, metadata.version.number)
  --ledger  build/<project>/TICKET-LEDGER.json   {"<key>": {"updated": "...", "outcome": "...", "cases": [...], "note": "..."}}
  --cases   optional: a JSON list of the suite's cases (get_cases), to show which cases already name each ticket

Outcomes a ledger row may hold: NEW-CASES (cases written for it), COVERED (existing cases test it; list them), FROM-OUR-CASE (the
ticket was filed from one of our cases, which it names), NO-CASE (say why: obsolete, duplicate, not this feature), ASKED (a question
is open; say where). A row whose ticket was updated after the row was written is unhandled again until it is re-read.

  python3 build/testing-tools/ticket_sweep.py --config C --jira J --prd-version N --ledger L [--cases X]"""
import argparse, json, re, sys
ap = argparse.ArgumentParser()
ap.add_argument("--config", required=True); ap.add_argument("--jira", required=True); ap.add_argument("--prd-version", type=int, required=True)
ap.add_argument("--ledger", required=True); ap.add_argument("--cases")
a = ap.parse_args()
cfg = json.load(open(a.config)); led = json.load(open(a.ledger))
j = json.load(open(a.jira)); j = j.get("data", j); issues = j["issues"]
if not j.get("isLast", True): sys.exit("The Jira result is not the last page: fetch every page first (nextPageToken).")
cited = {}
if a.cases:
    for c in json.load(open(a.cases)):
        body = " ".join(str(c.get(k) or "") for k in ("refs", "title", "custom_preconds", "custom_steps", "custom_expected"))
        for t in set(re.findall(r"SV-\d+", body)): cited.setdefault(t, []).append(f"C{c['id']}")
OK = {"NEW-CASES", "COVERED", "FROM-OUR-CASE", "NO-CASE", "ASKED"}
todo = []
for i in issues:
    k, f = i["key"], i["fields"]; row = led.get(k)
    why = None
    if not row: why = "not in the ledger"
    elif row.get("outcome") not in OK: why = f"outcome '{row.get('outcome')}' is not one of {sorted(OK)}"
    elif f.get("updated") and row.get("updated") and f["updated"] > row["updated"]: why = f"ticket updated {f['updated']} after the ledger row ({row['updated']})"
    if why: todo.append((k, f.get("summary", ""), why, cited.get(k, [])))
prd_todo = a.prd_version > int(cfg["prd_version_handled"])
print(f"{cfg['project']}: {len(issues)} tickets under {cfg['epic']} and its stories; ledger rows {len(led)}")
print(f"PRD {cfg['prd_page']}: read version {a.prd_version}, handled version {cfg['prd_version_handled']}" + ("  <-- NOT HANDLED: diff it, list the cases it changes" if prd_todo else ""))
for k, s, why, cs in todo: print(f"UNHANDLED {k}: {s} | {why}" + (f" | cases naming it: {', '.join(cs)}" if cs else ""))
print(f"unhandled tickets: {len(todo)}; PRD unhandled: {prd_todo}")
sys.exit(1 if todo or prd_todo else 0)
