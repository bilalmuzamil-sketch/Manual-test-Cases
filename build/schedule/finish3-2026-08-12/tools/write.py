"""Schedule finish3 — the TestRail write pass.

update_case ONLY.  Zero add / delete / section / run / result writes.
custom_atmstatus is NEVER sent.

Every write goes through tr.update_case_verified, which re-GETs and compares
EVERY field against the intended payload and proves every field we did not
intend to change is byte-identical.  On any mismatch it raises and the batch
STOPS (Standing Rule 50).

The per-operation log is flushed to disk AFTER EACH WRITE, so a killed run
leaves its exact position on disk.

DRY RUN by default.  Pass --go to execute.
"""
import json
import re
import sys

sys.path.insert(0, "/tmp/testrail")
import tr  # noqa: E402

OUT = "/home/user/Manual-test-Cases/build/schedule/finish3-2026-08-12/evidence"
LOG = f"{OUT}/testrail-oplog.json"
BUILD = "v3.5-65d6500"
STAMP = f"Last checked against build {BUILD} on 12 August 2026."

# ---- cases whose PRECONDITIONS AND STEPS were actually walked this pass -----
# C30057 is NOT here: no series block was reachable on screen, so it was not walked.
# C38863 is NOT here: the 8-week guard was never provoked from the interface.
WALKED = [
    29955, 29956, 29957, 29958, 29959, 29960, 29961, 29963, 29964, 29965,
    29967, 29969, 29970, 29972, 29973, 29974, 29975, 29978, 29979, 29980,
    29981, 29982, 29984, 30016, 30024, 30052, 30062, 30064,
]

# the trailing "Last checked against build X on Y." sentence, with any parenthetical
STAMP_RE = re.compile(r"Last checked against build [^\s]+ on [^.\n]*\.")

UNASSIGNED_NOTE = (
    "What you should see today: there is no Unassigned row in the grid, so this test "
    "cannot be carried out at all. The grid shows only department headings and "
    "technician rows. Mark this test BLOCKED - not failed - and do not raise a new "
    "problem for it; it is being reported separately.\n"
)

SV9005_OLD = re.compile(
    r"Note on point 2:.*?no longer reproduces\.\n?", re.S)
SV9005_NEW = (
    "What you should see today: this now works. Pressing the arrows moves the "
    "finish-by date and the preview follows it. There is an older report saying it "
    "did not respond, https://shopview.atlassian.net/browse/SV-9005, and on this "
    "build that no longer happens.\n"
    "- If it works for you too, this test PASSES.\n"
    "- If the arrows do nothing, that is the old problem coming back - say so rather "
    "than raising a new one.\n")

TOAST_OLD = ("1. Untouched, a toast that has an Undo action persists about 7 seconds; "
             "a toast without Undo persists about 4 seconds, before dismissing.")
TOAST_NEW = ("1. Untouched, the toast stays on screen for between 4 and 7 seconds and "
             "then disappears on its own.")

ALL27_OLD = "The only 'All' control is the 'All 27' chip higher up"
ALL27_NEW = "The only 'All' control is the 'All <number of lines>' chip higher up"


def restamp(exp):
    """Replace the Rule-54 sentence 2, or add one if the case has none."""
    if STAMP_RE.search(exp):
        return STAMP_RE.sub(STAMP, exp, count=1)
    # no sentence 2 yet: append it to the provenance sentence
    m = re.search(r"(read on [^.\n]*\.)(\s*\n)", exp)
    if m:
        return exp[:m.end(1)] + " " + STAMP + exp[m.end(1):]
    return exp


def set_marker(exp, marker):
    return re.sub(r"AUTOMATION: [^\n]*", marker, exp, count=1)


def build_payloads():
    ops = []
    for cid in WALKED:
        st, c = tr.get_case(cid)
        assert st == 200, (cid, st)
        exp = c["custom_expected"] or ""
        new = restamp(exp)
        why = ["re-stamp Rule-54 sentence 2 to the build this case was walked on"]

        if cid in (29973, 29974, 29975):
            # substantive divergence: the route the source describes does not exist
            if "there is no Unassigned row" not in new:
                new = new.replace("\n---\n", "\n" + UNASSIGNED_NOTE + "---\n", 1)
            new = set_marker(new, "AUTOMATION: HOLD - the Unassigned row does not exist in the build, so this cannot be run")
            why.append("add a plain BLOCKED-not-failed note and move the marker to HOLD "
                       "naming the real blocker (spec 3.2 requires an in-grid Unassigned row; there is none)")

        if cid == 29980:
            if SV9005_OLD.search(new):
                new = SV9005_OLD.sub(SV9005_NEW, new, count=1)
                why.append("SV-9005 no longer reproduces on this build - the stale "
                           "conditional note told the tester to fail a passing test")

        title = c["title"]
        if cid == 30064:
            if TOAST_OLD in new:
                new = new.replace(TOAST_OLD, TOAST_NEW)
                # the TITLE asserted the same unsupported split - Standing Rule 41
                # (touch a case, re-verify the whole of it) and Rule 28's
                # title-vs-expected check.
                title = "Toast stays 4 to 7 seconds, stays while hovered, goes when the cursor leaves"
                why.append("the title asserted the same 7s/4s split; retitled to the "
                           "specification's wording (80 characters)")
                why.append("expected 1 asserted a 7s-with-Undo / 4s-without split that NO "
                           "source states; the specification says 'The toast persists for 4 "
                           "to 7 seconds'. Restored to the source (Standing Rules 25/42/57) - "
                           "NOT to the build")

        if cid == 29967:
            if ALL27_OLD in new:
                new = new.replace(ALL27_OLD, ALL27_NEW)
                why.append("the note named 'All 27', which is one work order's line count; "
                           "made scope-conditional (Standing Rule 42)")

        if new != exp or title != c["title"]:
            pay = {"custom_preconds": c["custom_preconds"],
                   "custom_steps": c["custom_steps"],
                   "custom_expected": new}
            if title != c["title"]:
                pay["title"] = title
            ops.append({"cid": cid, "title": c["title"], "why": why, "payload": pay})
        else:
            ops.append({"cid": cid, "title": c["title"], "why": ["no change needed"],
                        "payload": None})
    return ops


def main():
    go = "--go" in sys.argv
    ops = build_payloads()
    todo = [o for o in ops if o["payload"]]

    print(f"cases considered : {len(ops)}")
    print(f"writes planned   : {len(todo)}")
    for o in todo:
        print(f"  C{o['cid']}  {o['title'][:58]}")
        for w in o["why"]:
            print(f"       - {w}")
    for o in ops:
        if not o["payload"]:
            print(f"  C{o['cid']}  NO CHANGE")

    # print the built payload tails and READ them before sending
    print("\n---- payload tails, read before sending ----")
    for o in todo[:40]:
        t = o["payload"]["custom_expected"][-190:]
        print(f"C{o['cid']}: ...{t!r}")

    if not go:
        print("\nDRY RUN — nothing written. Re-run with --go to execute.")
        json.dump(ops, open(f"{OUT}/write-plan.json", "w"), indent=1)
        return

    log = []
    ok = 0
    for i, o in enumerate(todo, 1):
        cid = o["cid"]
        try:
            st, line, before, after = tr.update_case_verified(cid, o["payload"], f"finish3 {i}/{len(todo)}")
            rec = {"n": i, "cid": cid, "http": st, "verify": line, "why": o["why"], "result": "OK"}
            ok += 1
        except Exception as e:
            rec = {"n": i, "cid": cid, "http": None, "result": "FAILED", "error": str(e)[:900], "why": o["why"]}
            log.append(rec)
            json.dump(log, open(LOG, "w"), indent=1)      # flush BEFORE stopping
            print(f"\n!! C{cid} FAILED — batch STOPPED (Standing Rule 50)\n{e}")
            break
        log.append(rec)
        json.dump(log, open(LOG, "w"), indent=1)          # flush after EVERY write
        print(f"  [{i}/{len(todo)}] C{cid} HTTP {st} — {line}")

    print(f"\nwrites attempted {len(log)} / planned {len(todo)} ; verified OK {ok}")
    # reconcile by count AND by case id
    written = sorted(r["cid"] for r in log if r["result"] == "OK")
    planned = sorted(o["cid"] for o in todo)
    print("reconcile by id:", "MATCH" if written == planned else
          f"MISMATCH planned-not-written={sorted(set(planned)-set(written))}")


if __name__ == "__main__":
    main()
