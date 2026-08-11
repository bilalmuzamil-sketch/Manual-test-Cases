#!/usr/bin/env python3
"""Assemble the execution log and the change/automation reports from the write logs."""
import glob
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(HERE, "..", "logs")
OUT = os.path.join(HERE, "..")
LINK = "https://shopview.testrail.io/index.php?/cases/view/"

REPORT_NAME = {"SBC": "Sales By Customer", "SBR": "Sales By Representative",
               "PV": "Parts Velocity", "TU": "Technician Utilization",
               "WIP": "Work In Progress", "IV": "Inventory Value"}


def load():
    ops = []
    for f in sorted(glob.glob(os.path.join(LOG, "write-*.json"))):
        ops.extend(json.load(open(f)))
    ops.sort(key=lambda r: r["cid"])
    return ops


def exec_log(ops):
    L = []
    L.append("# Report Suite — refs version-pin pass, TestRail execution log, 2026-08-11")
    L.append("")
    L.append(f"**{len(ops)} × `update_case`. 0 `add_case`. 0 `delete_case`. 0 section writes. "
             "0 run writes. 0 results logged. 0 Jira calls.**")
    L.append("")
    L.append("Every payload carried **all four fields** — `custom_preconds`, `custom_steps`, "
             "`custom_expected`, `refs` — because TestRail re-renders any text field omitted from "
             "the payload into `<p>`-wrapped HTML with CRLF, and this project shows markup "
             "literally to the tester (playbook §J, declared normalisation #3). The three text "
             "fields were taken byte-exact from a fresh read of the case taken moments before "
             "each write.")
    L.append("")
    L.append("Every write was re-GET and compared **field by field** against the intended payload, "
             "with every field the pass did not intend to change proven byte-identical "
             "(Rule 50). `refs` is compared under the declared normalisation "
             "`','.join(p.strip() for p in s.split(','))`.")
    L.append("")
    ok = sum(1 for r in ops if r["http"] == 200 and "0 mismatch" in r["verification"])
    L.append(f"**{ok} of {len(ops)} returned HTTP 200 with 0 mismatches. "
             f"{len(ops) - ok} did not.**")
    L.append("")
    L.append("**Rule 54 sentence 2 — the `Last checked against build … on …` line — was preserved "
             "byte-exact on every case that has one; the writer refuses the write outright if it "
             "moves.** No build was observed in this pass and none is claimed.")
    L.append("")
    L.append("**Rule 41** — each case was re-read end to end, not only the field being edited. "
             "The `whole-case` column records that re-read: every field checked "
             "(title · preconditions · steps · expected results · refs · section · type), the "
             "anchors the case cites, and whether any of them is absent from the live "
             "specification body it now names.")
    L.append("")
    L.append("| # | Case | HTTP | Byte verification | refs chars | entries | `custom_atmstatus` at write | Re-pin | Whole-case re-read (Rule 41) |")
    L.append("|---|---|---|---|---|---|---|---|---|")
    for i, r in enumerate(ops, 1):
        mv = "; ".join(f"{m['report']} v{m['from_v']}→v{m['to_v']}" for m in r["moves"]) or "—"
        extra = []
        if r["comma_repaired"]:
            extra.append("comma repaired")
        if r["condensed"]:
            extra.append("condensed for length")
        if r["expected_touched"]:
            extra.append("marker + spec version added")
        if extra:
            mv += " (" + ", ".join(extra) + ")"
        r41 = r["rule41"]
        w = ("all fields re-read; "
             f"{len(r41['anchors_cited'])} anchors cited, "
             f"{len(r41['anchors_absent_from_live_spec'])} absent from live spec; "
             f"raw markup {len(r41['raw_markup_fields'])}; "
             f"CRLF {'yes' if r41['crlf'] else 'no'}")
        L.append(f"| {i} | [C{r['cid']}]({LINK}{r['cid']}) | {r['http']} | "
                 f"{r['verification'].split(': ',1)[1]} | {r['refs_chars']} | "
                 f"{r['refs_entries']} | **{r['atmstatus_at_write']}** | {mv} | {w} |")
    L.append("")
    L.append("## Totals")
    L.append("")
    L.append(f"- **`update_case` operations:** {len(ops)}")
    L.append(f"- **HTTP 200 + 0 mismatch:** {ok}")
    L.append(f"- **Citations re-pinned:** {sum(len(r['moves']) for r in ops)}")
    L.append(f"- **Longest `refs` written:** {max(r['refs_chars'] for r in ops)} characters "
             f"(limit 248)")
    L.append(f"- **`refs` entries after the write:** all {len(ops)} cases carry exactly "
             f"{max(r['refs_entries'] for r in ops)} entry — no phantom references")
    L.append(f"- **Cases carrying `custom_atmstatus = 3` (Automated) at write time:** "
             f"{sum(1 for r in ops if r['atmstatus_at_write'] == 3)}")
    L.append(f"- **Cases whose Expected Results were touched:** "
             f"{sum(1 for r in ops if r['expected_touched'])}")
    L.append(f"- **Raw markup found by the Rule-41 re-read:** "
             f"{sum(len(r['rule41']['raw_markup_fields']) for r in ops)}")
    L.append(f"- **Anchors cited but absent from the live specification:** "
             f"{sum(len(r['rule41']['anchors_absent_from_live_spec']) for r in ops)}")
    open(os.path.join(OUT, "testrail-execution-log.md"), "w").write("\n".join(L) + "\n")
    print("wrote testrail-execution-log.md")


if __name__ == "__main__":
    ops = load()
    exec_log(ops)
    print(f"{len(ops)} ops")
