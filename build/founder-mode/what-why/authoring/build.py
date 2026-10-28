#!/usr/bin/env python3
"""Build and check every What/Why case. python3 build.py   (exit 1 on any PROBLEM line; ends "PROBLEM lines: N")
Copied from the Parts Lifecycle build.py of 27 Oct 2026 (every gate kept) and adapted to What/Why.

Gates (each prints its own counts; every failure is a PROBLEM line):
  per case (wwlib.check): title <= 80, no semicolon, "Design: " only in DESIGN; one result group per step; one UI action per step
    (Rule 135); no read-only step (Rule 136 5a); no Blocked line (Rule 117 fifteenth amendment); no {placeholder}, "For example",
    Scenario, setup-file link, ZZAUTOTEST or who-to-ask in tester text (fourteenth amendment); no vague look word (L-16); no case key,
    C-id or requirement code in tester text (Rule 137); no wording of a check a manual tester cannot make (L-14); no technical term;
    every quote verbatim in its document (PRD v15 / PO answers / Jira / tech plan; Rule 113); a PO answer is never quoted alone (the PRD
    v14+ carries it); design words verbatim in a board or canvas note; marker present; an EXPECT FAIL case carries the symptom and the
    three outcomes (Rule 61).
  identity: keys unique and matching their section; every row of ../testrail-id-map.csv in a WRITTEN section has its case (no case is
    lost); a split part (part_of) names a mapped case in its own section.
  coverage: every PRD v15 code of a WRITTEN story is quoted by a case, or is NO_MANUAL / OTHER_STORY (requirement_map.py); codes of
    stories not yet written are PENDING (planned keys from the 13 Oct read-backs), never silently dropped.
  words: every screen word the PRD quotes in a requirement line of a written story is used word for word in some step or result.
  numbers (Rule 116): every joined line text a Story 3 result quotes is recomputed from the case's own inputs by wwlib.joined() — done in
    cases_s3.py itself (the strings are generated, never typed), and each "The cell shows N." is checked against len() here.
  layout: "Preconditions" + bullets only; "Expected Result", "Step N:" + bullets per step, "<p></p>", the note, the quotes starting
    with a "From:" line, one "From:" line per quote group, epic + version 15 + the build line, References from Design after a blank
    paragraph, design links only in that block, one AUTOMATION line, last.
  relevance (Rule 137, L-11): every record a precondition names (work order 1, line 1, invoice A, canned line A, file A, user B ...) is
    used in the steps or results, or its bullet says why with "so …".
  independence (Rule 137): in a case whose steps change something (Save & Close, Create Invoice, Reverse, an import), every work order,
    line, invoice or import file the steps or results name is described in the preconditions as made for this test.
Writes proposals.json (read by build/testing-tools/tester_readiness_check.py) and ../REQUIREMENT-MAP.json."""
import sys, os, json, re, glob, importlib, html as _html
import signal
signal.signal(signal.SIGPIPE, signal.SIG_DFL)
from collections import Counter, defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wwlib as L
import requirement_map as RM
MODS = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_design"]
WRITTEN = set()
for m in MODS:
    if not os.path.exists(f"{L.D}/{m}.py"): continue
    mod = importlib.import_module(m)
    if getattr(mod, "WRITTEN", False): WRITTEN.add(getattr(mod, "SECTION", m.replace("cases_", "").upper()))
PLANT = os.environ.get("WW_PLANT")          # gate_selftest.py plants one known fault; nothing is written while planting
if PLANT:
    import plants; plants.plant(PLANT)
probs = []
P = probs.append
# ---------------------------------------------------------------- per case
for c in L.CASES: probs += L.check(c)
keys = [c["key"] for c in L.CASES]
for k, n in Counter(keys).items():
    if n > 1: P(f"duplicate key {k}")
BYKEY = {c["key"]: c for c in L.CASES}
for c in L.CASES:
    if c["sec"] not in L.SECTIONS: P(f"{c['key']}: section {c['sec']} unknown")
    pat = {"DESIGN": r"D-\d\d[b-e]?$"}.get(c["sec"], c["sec"] + r"-\d\d[b-e]?$")
    if not re.match(pat, c["key"]): P(f"{c['key']}: key does not match section {c['sec']}")
    if c["sec"] not in WRITTEN: P(f"{c['key']}: case in section {c['sec']}, whose module is not marked WRITTEN")
print("cases", len(L.CASES), dict(Counter(c["sec"] for c in L.CASES)), "| written sections", sorted(WRITTEN, key=lambda s: (len(s), s)))
# ---------------------------------------------------------------- identity with the TestRail map
MAP = L.id_map()
if not MAP: P("testrail-id-map.csv missing")
cids = Counter(r["case_id"] for r in MAP.values() if r["case_id"])
for cid, n in cids.items():
    if n > 1: P(f"C{cid} is mapped to {n} keys")
for k, r in MAP.items():
    if "C" + r["case_id"] in L.DELETED: P(f"{k} maps to deleted case C{r['case_id']}")
    sec = k.rsplit("-", 1)[0]
    if sec in WRITTEN and k not in BYKEY: P(f"{k} (C{r['case_id']}) is a live case in written section {sec} but has no case in the library")
new_keys = [k for k in keys if k not in MAP]
for k in new_keys:
    c = BYKEY[k]
    if c["part_of"]:
        if c["part_of"] not in MAP: P(f"{k}: part_of {c['part_of']} is not a mapped case")
        elif c["part_of"].rsplit("-", 1)[0] != c["sec"]: P(f"{k}: a split part must stay in its original's section (Rule 136)")
# split parts the 27 Oct write added (apply-log add_case): mapped now, and still split parts of their originals
ADDED_27 = {json.loads(x)["key"] for x in open(f"{L.P}/applied-2026-10-27/apply-log.jsonl") if json.loads(x).get("op") == "add_case"}
for k in keys:
    if k in MAP and BYKEY[k]["part_of"] and k not in ADDED_27: P(f"{k}: a mapped case cannot be a split part")
splits = [k for k in new_keys if BYKEY[k]["part_of"]]
print("map rows", len(MAP), "| cases updating a live case", len([k for k in keys if k in MAP]), "| new cases", len(new_keys),
      f"(splits {len(splits)}, new behaviour {len(new_keys) - len(splits)})")
# ---------------------------------------------------------------- coverage of the 41 codes
used = defaultdict(list)
for c in L.CASES:
    for x in L.codes_of(c): used[x].append(c["key"])
OLD = {}
for f in glob.glob(f"{L.P}/update-2026-10-13/applied/C*-after.json"):
    a = json.load(open(f)); OLD[str(a["id"])] = a
planned = defaultdict(list)
for k, r in MAP.items():
    a = OLD.get(r["case_id"])
    if a:
        for code in set(re.findall(r"(S\d-[RNE]\d+[a-z]?)", a["custom_expected"])): planned[code].append(k)
written_stories = {int(s[1:]) for s in WRITTEN if re.match(r"S\d+$", s)}
reqmap, pending = {}, []
for code in L.CODE:
    st = L.CODE_STORY[code]
    row = {"story": st, "jira": L.STORY_JIRA[st], "text": L.CODE[code]}
    if code in used: row.update(status="COVERED", keys=sorted(used[code]), case_ids=[MAP[k]["case_id"] if k in MAP else None for k in sorted(used[code])])
    elif code in RM.NO_MANUAL: row.update(status="NO MANUAL CASE", reason=RM.NO_MANUAL[code])
    elif code in RM.OTHER_STORY:
        row.update(status="OTHER STORY", section=RM.OTHER_STORY[code])
        if RM.OTHER_STORY[code] in WRITTEN: P(f"{code}: OTHER_STORY {RM.OTHER_STORY[code]} is written but no case there quotes it")
    else:
        row.update(status="PENDING", planned_keys=sorted(planned.get(code, [])))
        if st in written_stories: P(f"PRD v15 code {code} (Story {st}, written) is covered by no case and is not NO_MANUAL / OTHER_STORY")
        else: pending.append(code)
    if code in RM.PART_MANUAL: row["part_manual"] = RM.PART_MANUAL[code]
    if code in used and code in RM.NO_MANUAL: P(f"{code} is NO_MANUAL but quoted by {used[code]}")
    reqmap[code] = row
for code in list(RM.NO_MANUAL) + [x for x in RM.PART_MANUAL if re.match(r"S\d-", x)]:
    if code not in L.CODE: P(f"requirement_map names {code}, which is not a PRD v15 code")
st_counts = Counter(r["status"] for r in reqmap.values())
print("PRD v15 codes", len(L.CODE), dict(st_counts))
changed = ["S1-R1", "S1-R3", "S1-R6", "S1-R7", "S3-R3", "S3-R4", "S3-R6", "S3-R6a", "S3-R8", "S3-N1", "S3-E4", "S4-R3"]
print("v13 -> v15 changed/new codes:", {c: reqmap[c].get("keys", reqmap[c]["status"]) for c in changed})
# ---------------------------------------------------------------- the PRD's quoted screen words of written stories, word for word
tester_all = " ".join(" ".join(c["pre"] + c["steps"] + [b for r in c["res"] for b in r]) for c in L.CASES)
w_checked = 0
for code, t in L.CODE.items():
    if L.CODE_STORY[code] not in written_stories: continue
    for w in re.findall(r'"([^"]+)"', t):
        if w in RM.NOT_SCREEN_WORDS: continue
        w_checked += 1
        if w not in tester_all: P(f"{code}: the PRD's words not used word for word in any precondition, step or result: {w!r}")
print("PRD quoted words checked", w_checked, "| not screen words", sorted(RM.NOT_SCREEN_WORDS))
# ---------------------------------------------------------------- Rule 116: every stated count equals the length of the text it counts
n_counts = 0
def INS(c): return [] if not c["inputs"] else (c["inputs"] if isinstance(c["inputs"], list) else [c["inputs"]])
for c in L.CASES:
    for r in c["res"]:
        for b in r:
            m = re.match(r'The cell shows ([\d,]+)\b', b)
            if not m: continue
            n_counts += 1
            texts = [x for rr in c["res"] for bb in rr for x in re.findall(r'reads exactly "([^"]*)"', bb)]
            ok = [len(x) for x in texts] + [len(L.joined(*i)) for i in INS(c)]
            if int(m.group(1).replace(",", "")) not in ok:
                P(f"{c['key']}: the count {m.group(1)} is neither the length of a text this case says the cell reads exactly nor of the line its inputs make")
    if c["inputs"]:
        made = [L.joined(*i) for i in INS(c)]
        for x in [x for r in c["res"] for b in r for x in re.findall(r'reads exactly "([^"]*)"', b)]:
            if x not in made:
                P(f"{c['key']}: a quoted line text is not what its inputs make by the PRD's rule: {x[:60]!r} vs {[m[:40] for m in made]!r}")
print("Rule 116 counts checked", n_counts)
# ---------------------------------------------------------------- rendered layout
for c in L.CASES:
    k = c["key"]; f = L.render(c); pre, st, ex = f["custom_preconds"], f["custom_steps"], f["custom_expected"]
    H = "<p><strong>Preconditions</strong></p><ul>"
    if not pre.startswith(H) or not pre.endswith("</ul>") or re.sub(r"<li>.*?</li>", "", pre[len(H):-5], flags=re.S): P(f"{k}: Preconditions are not a heading and one bullet list")
    if ex.count("AUTOMATION: ") != 1 or not ex.endswith(f"<p>{L.e(c['marker'])}</p>"): P(f"{k}: AUTOMATION line not single and last")
    if not ex.startswith("<p><strong>Expected Result</strong></p>"): P(f"{k}: no Expected Result heading")
    rest = ex[len("<p><strong>Expected Result</strong></p>"):]
    for n in range(1, len(c["steps"]) + 1):
        m = re.match(rf"<p>Step {n}:</p><ul>((?:<li>.*?</li>)+)</ul>", rest, re.S)
        if not m: P(f"{k}: no 'Step {n}:' heading followed by bullets"); break
        rest = rest[m.end():]
    else:
        if not rest.startswith("<p></p>"): P(f"{k}: no blank paragraph after the last result")
    if "Source &mdash;" in ex or "where this behaviour comes from" in ex: P(f"{k}: a separate Source paragraph")
    q = ex.split("Exact quotes from the source")[1].split("References from Design")[0]
    if not q.split("</strong></p>", 1)[1].startswith("<p>From: "): P(f"{k}: quotes do not start with a From line")
    if q.count("<p>From: ") != q.count("<ul>"): P(f"{k}: a quote group without its own From line")
    if f"Epic {L.EPIC}" not in q or L.e(L.NOBUILD) not in q or ("version 16" if L.on_v16(c) else "version 15") not in q:
        P(f"{k}: epic, version (16 for the 28 Oct named set and new cases, else 15) or build line missing")
    if "claude.ai/artifact" in ex.split("References from Design")[0]: P(f"{k}: a design reference above References from Design")
    if "<p></p><p><strong>References from Design</strong></p>" not in ex: P(f"{k}: no References from Design block")
    if L.BLOCKED_RX.search(_html.unescape(pre + st + ex)): P(f"{k}: the Blocked line (fifteenth amendment)")
# ---------------------------------------------------------------- relevance (Rule 137, L-11)
KIND = [("canned line", r"canned lines?"), ("work order", r"work orders?"), ("invoice", r"invoices?"), ("line", r"lines?"),
        ("file", r"files?"), ("user", r"users?"), ("role", r"roles?"), ("customer", r"customers?"), ("location", r"locations?"),
        ("tab", r"tabs?")]
REC = re.compile(r"(?<![\w-])(?i:(" + "|".join(p for _, p in KIND) + r")) ([A-Z](?:(?:, | and |, and )[A-Z])*|\d(?:(?:, | and |, and )\d)*)(?![\w-])")
def named(text):
    out = set()
    for m in REC.finditer(text):
        w = m.group(1).lower()
        base = next(k for k, p in KIND if re.fullmatch(p, w))
        for x in re.findall(r"[A-Z]|\d", m.group(2)): out.add(f"{base} {x}")
    return out
rel_n = rel_so = 0
for c in L.CASES:
    later = named(" ".join(c["steps"] + [b for r in c["res"] for b in r] + [c["note"]]))
    for b in c["pre"]:
        for n in sorted(named(b)):
            rel_n += 1
            if n in later: continue
            if re.search(r"\bso\b", b): rel_so += 1; continue
            P(f"{c['key']}: relevance: the precondition names {n!r}, which no step or result uses, and gives no 'so …' reason: {b[:90]!r}")
print("relevance gate: named records", rel_n, "| kept by a 'so …' reason", rel_so)
# ---------------------------------------------------------------- independence (Rule 137)
CHG = re.compile(r"\bClick (?:Save & Close|Save & Add|Create Invoice|Reverse|Import|Upload)\b|\bUpload file\b|\bComplete line\b", re.I)
FRESH = re.compile(r"for this test|\bnew\b|before this release|^Create\b|^Make\b", re.I)
ind_c = ind_r = 0
for c in L.CASES:
    if not any(CHG.search(s_) for s_ in c["steps"]): continue
    ind_c += 1
    for n in sorted(x for x in named(" ".join(c["steps"] + [b for r in c["res"] for b in r])) if x.rsplit(" ", 1)[0] in ("work order", "line", "invoice", "file")):
        ind_r += 1
        bullets = [b for b in c["pre"] if n in named(b)]
        if not bullets: P(f"{c['key']}: independence: {n!r} is used by the steps but no precondition sets it up"); continue
        if not any(FRESH.search(b) for b in bullets): P(f"{c['key']}: independence: the steps change things but {n!r} is not described as made for this test")
print("independence gate: changing cases", ind_c, "| records checked", ind_r)
# ---------------------------------------------------------------- outputs
markers = Counter(c["marker"] for c in L.CASES); print("markers", dict(markers))
for c in L.CASES:
    if len(c["steps"]) > 12: print(f"OVER-TARGET {c['key']}: {len(c['steps'])} steps (kept whole: the steps need each other, Rule 136)")
print("pending (stories not yet written):", len(pending))
for p in probs: print("PROBLEM", p)
out = {}
for c in L.CASES:
    f = L.render(c); r = MAP.get(c["key"])
    out[c["key"]] = dict(sec=c["sec"], section_id=L.SECTIONS.get(c["sec"]), case_id=int(r["case_id"]) if r else None,
                         part_of=c["part_of"], title=c["title"], refs=f["refs"], codes=sorted(L.codes_of(c)), automation=c["marker"],
                         held=c["marker"] != L.MARKER and "EXPECT FAIL" not in c["marker"], pictures=L.design_of(c)["pictures"], fields=f)
if PLANT:
    print("PROBLEM lines:", len(probs)); sys.exit(1 if probs else 0)
json.dump(out, open(f"{L.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
json.dump({"prd": f"Confluence 845348896 version {L.PRD_VERSION}", "built": "by authoring/build.py", "counts": dict(st_counts),
           "deleted_cases": L.DELETED, "part_manual": RM.PART_MANUAL, "codes": reqmap},
          open(f"{L.P}/REQUIREMENT-MAP.json", "w"), indent=1, ensure_ascii=False)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
