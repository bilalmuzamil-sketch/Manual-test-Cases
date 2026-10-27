#!/usr/bin/env python3
"""Build and check every Parts Lifecycle case. python3 build.py   (exit 1 on any PROBLEM line; ends "PROBLEM lines: N")

Gates (each prints its own counts; every failure is a PROBLEM line):
  per case (pllib.check): title <= 80, no semicolon, "Design: " only in DESIGN; one result group per step; one UI action per step
    (Rule 135); no read-only step (Rule 136 5a); no Blocked line (Rule 117 fifteenth amendment); no {placeholder}, "For example",
    Scenario, setup-file link, ZZAUTOTEST or who-to-ask in tester text (fourteenth amendment); no vague look word (L-16); no case key,
    C-id or requirement code in tester text (Rule 137); no wording of a check a manual tester cannot make (L-14); every quote verbatim
    in its document (PRD v33 / tech plan / Jira / PO answers; Rule 113); design words verbatim in the canvas notes; marker present.
  identity: keys unique and matching their section; every row of ../testrail-id-map.csv in a WRITTEN section has its case (no case is
    lost); no key maps to a deleted case; a split part (part_of) names a mapped case in its own section.
  coverage: every PRD v33 code of a WRITTEN story is quoted by a case, or is NO_MANUAL / OTHER_STORY (requirement_map.py); codes of
    stories not yet written are PENDING (planned keys from the 14 Oct read-backs), never silently dropped.
  messages: every User Feedback Summary message of a WRITTEN story is used word for word in some step or result (or NO_MANUAL_UFS).
  layout: "Preconditions" + bullets only; "Expected Result", "Step N:" + bullets per step, "<p></p>", the note, the quotes starting
    with a "From:" line, one "From:" line per quote group, epic + version 33 + the build line, References from Design after a blank
    paragraph, design links only in that block, one AUTOMATION line, last.
  relevance (Rule 137, L-11): every record a precondition names (part A, work order 1, location B, bin location A, category A ...) is
    used in the steps or results, or its bullet says why with "so …".
  independence (Rule 137): in a case whose steps change something, every record of a changeable kind the steps or results name is
    described in the preconditions as made for this test (or as from before the release).
Writes proposals.json (read by build/testing-tools/tester_readiness_check.py) and ../REQUIREMENT-MAP.json."""
import sys, os, json, re, csv, glob, importlib, html as _html
import signal
signal.signal(signal.SIGPIPE, signal.SIG_DFL)   # piping the output (| head) ends quietly instead of a BrokenPipeError traceback
from collections import Counter, defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pllib as L
import requirement_map as RM
MODS = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6", "cases_s7", "cases_s8", "cases_s9", "cases_s10",
        "cases_s11", "cases_s12", "cases_s13", "cases_iv", "cases_design"]
WRITTEN = set()
for m in MODS:
    if not os.path.exists(f"{L.D}/{m}.py"): continue
    mod = importlib.import_module(m)
    if getattr(mod, "WRITTEN", False): WRITTEN.add(getattr(mod, "SECTION", m.replace("cases_", "").upper()))
PLANT = os.environ.get("PL_PLANT")          # gate_selftest.py plants one known fault; nothing is written while planting
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
    pat = {"DESIGN": r"D-\d\d[b-e]?$", "IV": r"IV-\d\d[b-e]?$"}.get(c["sec"], c["sec"] + r"-\d\d[b-e]?$")
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
for k in keys:
    if k in MAP and BYKEY[k]["part_of"]: P(f"{k}: a mapped case cannot be a split part")
splits = [k for k in new_keys if BYKEY[k]["part_of"]]
print("map rows", len(MAP), "| cases updating a live case", len([k for k in keys if k in MAP]), "| new cases", len(new_keys),
      f"(splits {len(splits)}, new behaviour {len(new_keys) - len(splits)})")
# ---------------------------------------------------------------- coverage of the 311 codes
used = defaultdict(list)
for c in L.CASES:
    for x in L.codes_of(c): used[x].append(c["key"])
# planned keys for not-yet-written stories: the keys whose 14 Oct read-back quoted the code
OLD = {}
for f in glob.glob(f"{L.P}/update-2026-10-14/applied/C*-after.json"):
    a = json.load(open(f)); OLD[str(a["id"])] = a
planned = defaultdict(list)
for k, r in MAP.items():
    a = OLD.get(r["case_id"])
    if a:
        for code in set(re.findall(r"<strong>(S\d+-[RNE]\d+[a-z]?):</strong>", a["custom_expected"])): planned[code].append(k)
written_stories = {int(s[1:]) for s in WRITTEN if re.match(r"S\d+$", s)}
reqmap, pending = {}, []
for code in L.CODE:
    st = L.CODE_STORY[code]
    row = {"story": st, "jira": L.STORY_JIRA[st], "text": L.CODE[code]}
    if code in used: row.update(status="COVERED", keys=sorted(used[code]), case_ids=[MAP[k]["case_id"] if k in MAP else None for k in sorted(used[code])])
    elif code in RM.NO_MANUAL: row.update(status="NO MANUAL CASE", reason=RM.NO_MANUAL[code])
    elif code in RM.OTHER_STORY:
        row.update(status="OTHER STORY", section=RM.OTHER_STORY[code], planned_keys=sorted(k for k in planned.get(code, []) if k.startswith(RM.OTHER_STORY[code] + "-")))
        if RM.OTHER_STORY[code] in WRITTEN: P(f"{code}: OTHER_STORY {RM.OTHER_STORY[code]} is written but no case there quotes it")
    else:
        row.update(status="PENDING", planned_keys=sorted(planned.get(code, [])), phase={1: "A", 2: "A", 3: "A", 4: "A", 5: "A"}.get(st, "B" if st <= 10 else "C"))
        if st in written_stories: P(f"PRD v33 code {code} (Story {st}, written) is covered by no case and is not NO_MANUAL / OTHER_STORY")
        else: pending.append(code)
    if code in used and code in RM.NO_MANUAL: P(f"{code} is NO_MANUAL but quoted by {used[code]}")
    reqmap[code] = row
for code in RM.NO_MANUAL:
    if code not in L.CODE: P(f"NO_MANUAL names {code}, which is not a PRD v33 code")
st_counts = Counter(r["status"] for r in reqmap.values())
print("PRD v33 codes", len(L.CODE), dict(st_counts))
newcodes = ["S1-E1", "S5-E1a", "S6-R1a", "S9-R21", "S9-R22", "S11-R8", "S11-R9", "S13-N1a", "S13-N1b"]
print("v29 -> v33 new codes:", {c: reqmap[c]["status"] for c in newcodes})
# ---------------------------------------------------------------- User Feedback Summary messages of written stories, word for word
tester_all = " ".join(" ".join(c["steps"] + [b for r in c["res"] for b in r]) for c in L.CASES)
def msgs(row):
    cell = row.split(" | ")[1]
    return [m for m in re.findall(r'"([^"]+)"', cell) if "{" not in m] + \
           [max(re.split(r"\{[^}]*\}", m), key=len).strip() for m in re.findall(r'"([^"]+)"', cell) if "{" in m]
ufs_checked = 0
for i, row in enumerate(L.UFS, 1):
    k = f"UFS-{i:02d}"
    if L.UFS_STORY[i] not in written_stories or k in RM.NO_MANUAL_UFS: continue
    for m in msgs(row):
        ufs_checked += 1
        if m and m not in tester_all: P(f"{k}: message not used word for word in any step or result: {m!r}")
print("User Feedback Summary messages checked", ufs_checked, "| no manual case", sorted(RM.NO_MANUAL_UFS))
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
    if f"Epic {L.EPIC}" not in q or L.NOBUILD not in q or "version 33" not in q: P(f"{k}: epic, version 33 or build line missing")
    if "claude.ai/artifact" in ex.split("References from Design")[0]: P(f"{k}: a design reference above References from Design")
    if "<p></p><p><strong>References from Design</strong></p>" not in ex: P(f"{k}: no References from Design block")
    if L.BLOCKED_RX.search(_html.unescape(pre + st + ex)): P(f"{k}: the Blocked line (fifteenth amendment)")
# ---------------------------------------------------------------- relevance (Rule 137, L-11)
KIND = [("bin location", r"bin locations?"), ("work order", r"work orders?"), ("canned job", r"canned jobs?"), ("purchase order", r"purchase orders?"),
        ("part sale", r"part sales?"), ("part", r"parts?"), ("location", r"locations?"), ("category", r"categor(?:y|ies)"), ("user", r"users?"),
        ("role", r"roles?"), ("vendor", r"vendors?"), ("customer", r"customers?"), ("estimate", r"estimates?"), ("return", r"returns?"),
        ("credit", r"credits?"), ("date", r"dates?"), ("line", r"lines?"), ("description", r"descriptions?")]
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
CHG = re.compile(r'\bClick (?:Save|Deactivate|Activate|Delete Part)\b(?! parts)|\bClick "?(?:Deactivate|Activate)"? in the confirmation|Run the import|Upload the file|Click Save in the count toolbar', re.I)
FRESH = re.compile(r"for this test|\bnew\b|before this release|^Create\b", re.I)
ind_c = ind_r = 0
for c in L.CASES:
    if not any(CHG.search(s_) for s_ in c["steps"]): continue
    ind_c += 1
    for n in sorted(x for x in named(" ".join(c["steps"] + [b for r in c["res"] for b in r])) if x.rsplit(" ", 1)[0] in ("part", "work order", "bin location")):
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
                         held=c["marker"] != L.MARKER, pictures=L.design_of(c)["pictures"], fields=f)
if PLANT:
    print("PROBLEM lines:", len(probs)); sys.exit(1 if probs else 0)
json.dump(out, open(f"{L.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
json.dump({"prd": f"Confluence 829227015 version {L.PRD_VERSION}", "built": "by authoring/build.py", "counts": dict(st_counts),
           "deleted_cases": L.DELETED, "no_manual_ufs": RM.NO_MANUAL_UFS, "codes": reqmap},
          open(f"{L.P}/REQUIREMENT-MAP.json", "w"), indent=1, ensure_ascii=False)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
