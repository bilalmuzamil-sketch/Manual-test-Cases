#!/usr/bin/env python3
"""Generate CHANGES-MADE.md and AUTOMATED-CASES-CHANGED.md from the write logs."""
import glob
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(HERE, "..", "logs")
SNAP = os.path.join(HERE, "..", "snapshots")
OUT = os.path.join(HERE, "..")
LINK = "https://shopview.testrail.io/index.php?/cases/view/"
NAME = {"SBC": "Sales By Customer", "SBR": "Sales By Representative",
        "PV": "Parts Velocity", "TU": "Technician Utilization",
        "WIP": "Work In Progress", "IV": "Inventory Value"}


def load_ops():
    ops = []
    for f in sorted(glob.glob(os.path.join(LOG, "write-*.json"))):
        ops.extend(json.load(open(f)))
    ops.sort(key=lambda r: r["cid"])
    return ops


def sect_map():
    secs = {s["id"]: s for s in json.load(open(f"{SNAP}/sections-PRE.json"))}

    def top(sid):
        cur = secs.get(sid)
        while cur:
            if cur.get("parent_id") == 4281:
                return cur["name"]
            cur = secs.get(cur.get("parent_id"))
        return "?"
    return top


def changes(ops):
    pre = {c["id"]: c for c in json.load(open(f"{SNAP}/cases-PRE.json"))}
    top = sect_map()
    by = {}
    for r in ops:
        for m in r["moves"]:
            by.setdefault(m["report"], []).append(r["cid"])

    L = ["# Report Suite — refs version-pin pass, what changed, 2026-08-11", ""]
    L.append(f"**{len(ops)} cases written. {sum(len(r['moves']) for r in ops)} stale version "
             f"citations re-pinned. 1 case also gained an automation marker and a specification "
             f"version. 9 cases had a comma repaired. 1 was condensed to fit the 248-character "
             f"limit.**")
    L.append("")
    L.append("Nothing else moved: **0 `add_case`, 0 `delete_case`, 0 section writes, 0 run writes, "
             "0 results logged, 0 Jira calls**. No expectation, step, precondition or title was "
             "changed — with the single, additive exception of C30288 below.")
    L.append("")
    L.append("## 1 · The re-pins, by report")
    L.append("")
    L.append("| Report | Pinned as | Now pinned as | Citations | Cases |")
    L.append("|---|---|---|---|---|")
    seen = {}
    for r in ops:
        for m in r["moves"]:
            k = (m["report"], m["from_v"], m["from_date"], m["to_v"], m["to_date"])
            seen.setdefault(k, set()).add(r["cid"])
    for k in sorted(seen, key=lambda x: (x[0], x[1])):
        rep, fv, fd, tv, td = k
        L.append(f"| {NAME[rep]} | `{rep} spec v{fv} {fd}` | `{rep} spec v{tv} {td}` | "
                 f"{len(seen[k])} | {len(seen[k])} |")
    L.append(f"| | | | **{sum(len(v) for v in seen.values())}** | |")
    L.append("")
    L.append("**Technician Utilization needed no re-pin** — it was already at its live version 7 "
             "on all 59 of its citations.")
    L.append("")
    L.append("**Every re-pin is length-neutral** (same digit count, same ten-character ISO date), "
             "so no re-pin could push an entry over the 248-character limit. See `OVER-LIMIT.md`.")
    L.append("")
    L.append("## 2 · The one case whose Expected Results were touched")
    L.append("")
    L.append(f"**[C30288]({LINK}30288)** — *The Unassigned row appears in both CSV downloads only "
             "when the toggle is on* (Sales By Representative). Three repairs, one write:")
    L.append("")
    L.append("1. **Added the missing automation marker** `AUTOMATION: READY` — it was the only "
             "case in the suite without one. Placed at the very end of Expected Results, after "
             "the provenance line, blank line before.")
    L.append("2. **Added the specification version to its provenance line**: *\"…the Sales By "
             "Representative report specification **version 18** (S22-R2, S22-R4, S14-R19), read "
             "on 11 August 2026.\"* All three anchors were confirmed present in the live v18 body "
             "before the version was written.")
    L.append("3. **Repaired a comma in `refs`** that TestRail was storing as two separate "
             "references.")
    L.append("")
    L.append("**Its Rule 54 sentence 2 was not touched, because it has none** — C30288 is one of "
             "five cases never checked against any build, and adding a build line would have been "
             "a false claim.")
    L.append("")
    L.append("## 3 · The comma repairs")
    L.append("")
    L.append("TestRail splits `refs` on commas and stores one reference per piece, so a prose "
             "comma silently manufactures a phantom second reference. House style is **one "
             "comma-free entry**. Nine cases carried one:")
    L.append("")
    L.append("| Case | Report | Was stored as | Repair |")
    L.append("|---|---|---|---|")
    for r in ops:
        if not r["comma_repaired"]:
            continue
        c = pre[r["cid"]]
        n = len((c.get("refs") or "").split(","))
        rep = NAME.get(r["moves"][0]["report"]) if r["moves"] else top(c["section_id"])
        how = "space" if r["cid"] in (30216, 30398) else "`;` separator"
        L.append(f"| [C{r['cid']}]({LINK}{r['cid']}) | {rep} | **{n} references** | {how} |")
    L.append("")
    L.append("After this pass **no case of ours carries a comma in `refs`**.")
    L.append("")
    L.append("## 4 · What was deliberately NOT changed")
    L.append("")
    L.append("- **Rule 54 sentence 2** — the `Last checked against build … on …` line — preserved "
             "byte-exact on every case that has one. The writer refuses the write if it moves. No "
             "build was observed in this pass and none is claimed.")
    L.append("- **The provenance line's spec version** — corrected earlier today and correct; "
             "untouched on all 480 cases except C30288, which had none.")
    L.append("- **Version numbers mentioned in prose** — *\"S7-R13 rewritten in v10\"*, *\"the v9 "
             "contradiction\"*, *\"(SBR v16 2026-08-05)\"* — these record **when** something "
             "landed and are not currency pins. Re-pointing them would have made true sentences "
             "false. See `FINDINGS.md` §6.")
    L.append("- **Technician Utilization's pin date**, which is a day out for timezone reasons on "
             "58 cases whose version integer is correct. Reported in `FINDINGS.md` §8, not churned.")
    L.append("- **42 spec citations that carry no version at all** — a different defect from a "
             "stale pin, outside this pass's charter, and several have too little headroom to take "
             "one without editorial condensation. Reported in `FINDINGS.md` §7.")
    L.append("- **The 12 foreign cases** by Vladimir Tomovic (C38919–C38923, C43567–C43573), "
             "proven byte-identical by content including `updated_on`/`updated_by` (Rule 38).")
    L.append("")
    open(os.path.join(OUT, "CHANGES-MADE.md"), "w").write("\n".join(L) + "\n")
    print("wrote CHANGES-MADE.md")


def automated(ops):
    pre = {c["id"]: c for c in json.load(open(f"{SNAP}/cases-PRE.json"))}
    top = sect_map()
    hist = {}
    p = os.path.join(LOG, "atm-history.json")
    if os.path.exists(p):
        hist = {h["cid"]: h for h in json.load(open(p))}
    auto = [r for r in ops if r["atmstatus_at_write"] == 3]

    L = ["# Automated cases changed — for Vlad (Standing Rule 65)", ""]
    L.append("**Plain summary, and it is the whole story: this pass changed only the "
             "*References* field on these cases — the pointer that says which version of the "
             "written specification each case comes from. Not one step, not one expected result, "
             "not one automation marker changed on any of them. Nothing an automated check runs "
             "on has moved, so no automation should need adjusting.**")
    L.append("")
    L.append(f"**{len(auto)} of the {sum(1 for c in pre.values() if c['created_by']==3 and c.get('custom_atmstatus')==3)} "
             "cases TestRail flags as Automated were touched.** The flag reported here is "
             "`custom_atmstatus = 3`, captured **at write time** — Rule 65 requires that, because "
             "the flag moves and reading it afterwards can give a different answer from the truth "
             "at the moment of the write.")
    L.append("")
    L.append("## Does this change what an automated check should conclude?")
    L.append("")
    L.append("**No — for every case in the list below.** The reasoning, stated plainly so it can "
             "be overruled: `refs` is a traceability field. It is not shown to the tester as an "
             "instruction, it is not part of any assertion, and no automated check reads it. A "
             "version pin moving from `v15` to `v18` records that the specification has been "
             "republished; it does not change what the product is expected to do.")
    L.append("")
    L.append("**We have never seen the automation scripts, so this is our judgement, not a "
             "guarantee.** If any check matches on the References field — for instance to group "
             "or filter cases by their source document — these edits would be visible to it. "
             "That is the one way this could matter, and it is worth a glance.")
    L.append("")
    L.append("## The cases")
    L.append("")
    L.append("| Case | Report | What the case covers | What changed |")
    L.append("|---|---|---|---|")
    for r in auto:
        c = pre[r["cid"]]
        mv = ", ".join(f"specification pin moved from version {m['from_v']} to {m['to_v']}"
                       for m in r["moves"]) or "a comma removed from the References field"
        if r["comma_repaired"] and r["moves"]:
            mv += "; a comma removed from the References field"
        L.append(f"| [C{r['cid']}]({LINK}{r['cid']}) | {top(c['section_id'])} | "
                 f"{c['title'][:70]} | {mv} |")
    L.append("")
    L.append("## Who actually set the Automated flag")
    L.append("")
    if hist:
        never = [cid for cid in (r["cid"] for r in auto)
                 if not hist.get(cid, {}).get("atmstatus_change_events")]
        setby = [cid for cid in (r["cid"] for r in auto)
                 if hist.get(cid, {}).get("atmstatus_change_events")]
        L.append("Rule 65 requires this to be checked rather than assumed, because on the Schedule "
                 "project nobody ever set the flag — our own `add_case` tooling hardcoded it — and "
                 "reporting those cases as Vlad's own would pad the list and cost it credibility.")
        L.append("")
        L.append(f"- **{len(setby)} of the {len(auto)}** have a recorded change of "
                 "`custom_atmstatus` in their TestRail history, so a person set the flag "
                 "deliberately.")
        L.append(f"- **{len(never)}** have no recorded change — the flag has read Automated since "
                 "the case was created.")
        if never:
            L.append("")
            L.append("  Cases with no recorded flag change: " +
                     ", ".join(f"[C{c}]({LINK}{c})" for c in never))
        L.append("")
        L.append("Per-case history: `logs/atm-history.json`.")
    else:
        L.append("*(history not yet gathered)*")
    L.append("")
    L.append("## Cases NOT in this list")
    L.append("")
    L.append(f"**[C30288]({LINK}30288) gained an automation marker in this pass** — the kind of "
             "change that genuinely does affect what an automated run should conclude. **It is "
             "not in the list above because TestRail does not flag it as Automated** "
             "(`custom_atmstatus = 1`). It is named here anyway so the omission is visible rather "
             "than silent: it is a Sales By Representative CSV-download case, it now reads "
             "`AUTOMATION: READY`, and it was the last case in the suite without a marker.")
    open(os.path.join(OUT, "AUTOMATED-CASES-CHANGED.md"), "w").write("\n".join(L) + "\n")
    print("wrote AUTOMATED-CASES-CHANGED.md")


if __name__ == "__main__":
    ops = load_ops()
    changes(ops)
    automated(ops)
    print(f"{len(ops)} ops")
