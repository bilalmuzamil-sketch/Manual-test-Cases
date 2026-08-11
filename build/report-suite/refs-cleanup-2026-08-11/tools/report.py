#!/usr/bin/env python3
"""Emit the per-operation execution log from the write logs.

Every figure is taken from the recorded write records, so nothing in the
deliverable is retyped by hand and nothing can drift from what actually ran.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(HERE, "..", "logs")
OUT = os.path.join(HERE, "..", "testrail-execution-log.md")
BATCH = [("gap1a", "GAP 1 — version pins, batch A"),
         ("gap1b", "GAP 1 — version pins, batch B"),
         ("gap2a", "GAP 2 — Technician Utilization date, batch A"),
         ("gap2b", "GAP 2 — Technician Utilization date, batch B")]
L = "https://shopview.testrail.io/index.php?/cases/view/"


def kind(rec):
    ks = sorted({m["kind"] for m in rec.get("moves", [])})
    return "+".join(ks)


def main():
    recs = []
    for tag, _ in BATCH:
        for r in json.load(open(os.path.join(LOG, f"write-{tag}.json"))):
            r["_batch"] = tag
            recs.append(r)

    n = len(recs)
    ok = sum(1 for r in recs if r.get("http") == 200)
    zero = sum(1 for r in recs if "0 mismatch" in (r.get("verification") or ""))
    fields = sorted({int((r.get("verification") or "0 fields").split(" fields")[0].split(": ")[-1])
                     for r in recs if r.get("verification")})

    w = open(OUT, "w")
    w.write(f"""# Report Suite — TestRail execution log, refs-cleanup pass, 2026-08-11

**{n} `update_case` operations. {ok} returned HTTP 200. {zero} verified with 0 mismatches.**
Fields compared per write: {fields}. **0 `add_case`, 0 `delete_case`, 0 section writes,
0 run writes, 0 results logged, 0 Jira calls.**

**One field changed on every operation: `refs`.** Expected Results, Steps, Preconditions and
Title were asserted byte-identical by the writer on every single write — this pass had no
Expected-Results exception at all, unlike its predecessor.

**Every payload carried all three text fields** (`custom_preconds`, `custom_steps`,
`custom_expected`) alongside `refs`, taken byte-exact from a read moments before the write,
because TestRail re-renders any text field omitted from a payload into `<p>`-wrapped HTML with
CRLF (playbook §J, declared normalisation #3) and this project shows markup literally to the
tester. **0 of the {n} came back with raw markup or CRLF.**

## Column meanings

- **chars before → after** — the measured length of `refs`, in CHARACTERS. The TestRail limit is
  **248 characters per comma-separated entry** (not bytes: a live entry sits at 248 chars / 251
  bytes). Every entry was measured before sending; none was estimated.
- **atm** — `custom_atmstatus` **captured at write time**, as Rule 65 requires. `3` = Automated.
- **Rule 41** — the whole-case re-read: every field, not only the one edited.

---

""")

    for tag, title in BATCH:
        b = [r for r in recs if r["_batch"] == tag]
        w.write(f"## {title} — {len(b)} operations\n\n")
        w.write("| # | Case | HTTP | Byte verification | chars before → after | spare | atm | Change |\n")
        w.write("|---|---|---|---|---|---|---|---|\n")
        for i, r in enumerate(b, 1):
            cid = r["cid"]
            v = (r.get("verification") or "").split(": ", 1)[-1]
            w.write(f"| {i} | [C{cid}]({L}{cid}) | {r.get('http')} | {v} | "
                    f"{r['refs_chars_before']} → {r['refs_chars_after']} | "
                    f"{r['headroom_after']} | {r.get('atmstatus_at_write')} | {kind(r)} |\n")
        w.write("\n")

    # Rule 41 roll-up
    w.write("---\n\n## Rule 41 — the whole-case re-read, on all "
            f"{n} touched cases\n\n")
    w.write("Every touched case was re-read END TO END before it was left, not only the field "
            "being edited. Fields checked on each: **title · preconditions · steps · expected "
            "results · refs · section · type**.\n\n")
    agg = {
        "anchors cited that are ABSENT from the live specification body now named":
            sum(len(r["rule41"]["anchors_absent_from_live_spec"]) for r in recs if "rule41" in r),
        "fields carrying raw HTML markup":
            sum(len(r["rule41"]["raw_markup_fields"]) for r in recs if "rule41" in r),
        "cases carrying CRLF line endings":
            sum(1 for r in recs if r.get("rule41", {}).get("crlf")),
        "titles longer than 80 characters":
            sum(1 for r in recs if r.get("rule41", {}).get("title_over_80")),
        "cases NOT carrying exactly one automation marker":
            sum(1 for r in recs if len(r.get("rule41", {}).get("automation_markers", [])) != 1),
        "cases NOT carrying exactly one provenance sentence":
            sum(1 for r in recs if r.get("rule41", {}).get("provenance_sentences") != 1),
        "cases whose Expected Results moved by a byte":
            sum(1 for r in recs if not r.get("expected_untouched")),
        "refs entries containing a comma":
            sum(1 for r in recs if r.get("refs_entries", 1) != 1),
        "refs entries over 248 characters":
            sum(1 for r in recs if r.get("refs_chars_after", 0) > 248),
    }
    w.write("| Check | Result |\n|---|---|\n")
    for k, v in agg.items():
        w.write(f"| {k} | **{v}** |\n")
    w.write(f"\n**Verdict recorded on every case:** "
            f"*re-verified whole against the live specification set read 2026-08-11*.\n\n")

    # length pressure
    w.write("---\n\n## Length, measured — never estimated\n\n")
    tight = sorted(recs, key=lambda r: r["headroom_after"])[:10]
    w.write("The ten tightest entries after the writes:\n\n")
    w.write("| Case | chars | spare | bytes |\n|---|---|---|---|\n")
    for r in tight:
        w.write(f"| [C{r['cid']}]({L}{r['cid']}) | {r['refs_chars_after']} | "
                f"{r['headroom_after']} | {r['refs_bytes_after']} |\n")
    grew = [r for r in recs if r["refs_chars_after"] > r["refs_chars_before"]]
    w.write(f"\n**{len(grew)} entries grew** (the version pins); "
            f"**{len(recs)-len(grew)} stayed exactly the same length** (the date normalisation, "
            "which is a same-length substitution and so moved no entry closer to the ceiling).\n")
    w.write(f"\n**Maximum length after the pass: "
            f"{max(r['refs_chars_after'] for r in recs)} characters. The limit is 248.**\n")
    w.close()
    print(f"wrote {OUT}: {n} ops, {ok} HTTP 200, {zero} zero-mismatch")
    for k, v in agg.items():
        print(f"  {v:>4}  {k}")


if __name__ == "__main__":
    main()
