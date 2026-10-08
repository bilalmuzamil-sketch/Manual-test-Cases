#!/usr/bin/env python3
"""Apply the Part Lifecycle full update (QA lead 2026-10-08: "Full update, write when ready"; Rule 122 full pass).
Layout = Rule 117 with the 8 Oct 2026 amendments: Preconditions field holds a "Preconditions" block (Needs line first) and a
"Setup" block; Steps = behaviour only; every expected result starts "Step n:".
  python3 apply_pl_update.py            check only (prints every problem; exit 1 if any)
  python3 apply_pl_update.py --apply    write: snapshot before/after, update, read back, add sections/cases, log
Only OUR cases (created_by 3) are touched, and only if unchanged since the snapshot (optimistic lock, L17)."""
import sys, json, re, os, glob
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
H = "build/founder-mode/part-lifecycle/update-2026-10-08"
S = "build/founder-mode/part-lifecycle/sources"
APPLY = "--apply" in sys.argv
def ws(s): return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "")).strip()
PRD = ws(open(f"{S}/CONFLUENCE-829227015-PartLifecycle-v26-2026-10-08.md").read())
TP = ws(open(f"{S}/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md").read())
JIRA = ws(open(f"{S}/jira-2026-10-08/STORIES-2026-10-08.md").read())
ANCH = json.load(open(f"{H}/anchor-quotes-v26.json"))
MARKER = "AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified"
def esc(t): return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
def lst(x, tag):
    items = []
    for i in x:
        i = i.strip()
        if i.startswith("↳") and items: items[-1][1].append(i.lstrip("↳ ").strip())
        else: items.append([re.sub(r"^\d+\.\s+", "", i), []])
    return f"<{tag}>" + "".join(f"<li>{esc(t)}" + ("<ul>" + "".join(f"<li>{esc(s)}</li>" for s in subs) + "</ul>" if subs else "") + "</li>" for t, subs in items) + f"</{tag}>"
def preconds(p):
    return ("<p><strong>Preconditions</strong></p>" + lst(p["preconditions"], "ul") +
            "<p><strong>Setup</strong></p>" + lst(p["setup"], "ol"))
def expected(p):
    out = "<p><strong>Expected results</strong></p>" + lst(p["results"], "ul")
    out += f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{esc(p['source'])}</p>"
    out += "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>" + "<ul>" + "".join(
        f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q.replace('**', ''))}&rdquo;</li>" for a, q in p["quotes"]) + "</ul>"
    return out + f"<p>{esc(p['marker'])}</p>"
SHORT = re.compile(r"\b(S\d+-[RNE]\d+[a-z]?|parity|normali[sz]ed|endpoint|payload|atom|route|Rule \d+|delta)\b|;", re.I)
BAD = ("ask the qa lead", "ask your qa lead", "devtools", "curl ", "postman", "database", "the api ", " via api", "conditions in s")
problems, plans, news, retires, sections_needed = [], [], [], [], set()
covered = {}
for f in sorted(glob.glob(os.environ.get("PROPOSALS", f"{H}/proposals-*.json"))):
    d = json.load(open(f))
    for a, ks in d.get("anchors_covered", {}).items(): covered.setdefault(a, set()).update(map(str, ks))
    retires += d.get("retire", [])
    for kind, items in (("upd", d.get("updates", [])), ("new", d.get("new", []))):
        for p in items:
            k = str(p.get("case_id") or p.get("key"))
            t = p["title"]
            if len(t) > 80: problems.append(f"{k}: title {len(t)} chars")
            if SHORT.search(t): problems.append(f"{k}: title shorthand/semicolon: {t}")
            for part in ("preconditions", "setup", "steps", "results", "quotes"):
                if not p.get(part): problems.append(f"{k}: empty {part}")
            if p.get("preconditions") and not p["preconditions"][0].startswith("Needs:"): problems.append(f"{k}: no Needs line")
            if p.get("setup") and not p["setup"][-1].lstrip("0123456789. ").startswith("Check the setup worked"): problems.append(f"{k}: setup lacks final check")
            for r in p.get("results", []):
                if not re.match(r"^Steps? \d", r.lstrip("↳ ")) and not r.startswith("↳"): problems.append(f"{k}: result not tied to a step: {r[:70]}")
            if p.get("marker") != MARKER: problems.append(f"{k}: marker")
            for a, q in p.get("quotes", []):
                src = TP if a.lower().startswith("tech plan") else JIRA if a.startswith("SV-") else PRD
                if a in ANCH and ws(q) != ws(ANCH[a]): problems.append(f"{k}: quote {a} differs from the anchor map")
                if ws(q) not in src: problems.append(f"{k}: quote {a} not verbatim in its source: {q[:80]}")
            tester = " ".join(p.get("preconditions", []) + p.get("setup", []) + p.get("steps", []) + p.get("results", [])).lower()
            for b in BAD:
                if b in tester: problems.append(f"{k}: tester text contains '{b.strip()}'")
            if re.search(r"\bS\d+-[RNE]\d+", tester, re.I): problems.append(f"{k}: requirement code in tester text")
            payload = {"title": t, "custom_preconds": preconds(p), "custom_steps": lst(p["steps"], "ol"), "custom_expected": expected(p)}
            if kind == "upd": plans.append((int(p["case_id"]), payload, p.get("change_summary", "")))
            else:
                news.append((p["key"], p["section_id"], payload, p.get("why", "")))
                if isinstance(p["section_id"], str): sections_needed.add(p["section_id"])
ids = [c for c, _, _ in plans] + [int(r["case_id"]) for r in retires]
if len(ids) != len(set(ids)): problems.append("a case is proposed twice (or both updated and retired)")
keys = [k for k, *_ in news]
if len(keys) != len(set(keys)): problems.append("duplicate new-case key")
live = {c["id"]: c for c in json.load(open("build/founder-mode/part-lifecycle/snapshots-2026-10-08/live-cases.json"))}
for c in ids:
    if c not in live or live[c]["created_by"] != 3: problems.append(f"C{c}: not ours or unknown")
missing = sorted(c for c in live if c not in ids)
if missing: problems.append(f"our cases in no proposal: {missing}")
uncov = sorted(a for a in ANCH if not covered.get(a))
if uncov: problems.append(f"anchors not covered: {uncov}")
print(f"updates {len(plans)} · new {len(news)} · retire {len(retires)} · new sections {sorted(sections_needed)} · anchors covered {len(ANCH)-len(uncov)}/{len(ANCH)}")
for p in problems: print("PROBLEM", p)
if problems:
    sys.exit(1)
if APPLY:
    os.makedirs(f"{H}/applied", exist_ok=True); log = open(f"{H}/applied/apply-log.jsonl", "a")
    def L(**k): log.write(json.dumps(k) + "\n"); log.flush(); print(k)
    secmap = {}
    for name in sorted(sections_needed):
        r = api("add_section/1", {"suite_id": 1, "parent_id": 20439, "name": name.split(":", 1)[1]})
        secmap[name] = r["id"]; L(op="add_section", name=name, id=r["id"])
    for cid, payload, why in plans:
        c = api(f"get_case/{cid}")
        assert c["created_by"] == 3, f"C{cid} not ours"
        assert c["updated_on"] == live[cid]["updated_on"], f"C{cid} was edited after it was read (another session?) — refusing"
        json.dump(c, open(f"{H}/applied/C{cid}-before.json", "w"), indent=1)
        api(f"update_case/{cid}", payload); a = api(f"get_case/{cid}")
        json.dump(a, open(f"{H}/applied/C{cid}-after.json", "w"), indent=1)
        ok = all((a.get(k) or "") == v for k, v in payload.items())
        L(op="update_case", case=f"C{cid}", ok=ok, why=why)
    for key, sec, payload, why in news:
        sid = secmap.get(sec, sec)
        r = api(f"add_case/{sid}", dict(payload, custom_automation_type=2, custom_atmstatus=1))
        a = api(f"get_case/{r['id']}")
        json.dump(a, open(f"{H}/applied/C{r['id']}-new.json", "w"), indent=1)
        ok = all((a.get(k) or "") == v for k, v in payload.items())
        L(op="add_case", key=key, case=f"C{r['id']}", section=sid, ok=ok, why=why)
    for r in retires:
        L(op="retire_proposed_not_applied", case=f"C{r['case_id']}", why=r["why"])
