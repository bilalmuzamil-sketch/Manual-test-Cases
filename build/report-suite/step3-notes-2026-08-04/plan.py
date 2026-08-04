"""STEP 3 remainder — the different-reason tester notes.
Idempotent: replaces an existing block, never appends a second.
Inserted immediately after the '---' separator, so any DO NOT AUTOMATE block stays
immediately before the provenance line and the provenance line stays LAST (Rule 54).
NO ASSERTION TEXT IS ALTERED.
"""
import json, os, sys

D = os.path.dirname(os.path.abspath(__file__))
LIVE = json.load(open(f"{D}/../count-recon-2026-08-04/data/live-cases-4281.json"))
BY = {c["id"]: c for c in LIVE}

# ---- the note blocks ----
NOTE_NIGHTLY = (
 "Note for the tester: you cannot check this one from any screen. These figures are written each "
 "night by a background process, and nothing in the report reads them back in this version. If you "
 "cannot see the figures anywhere, mark this test BLOCKED - do not mark it failed, and do not raise "
 "it as a problem."
)
NOTE_HISTORY = (
 "Note for the tester: this one needs records going back more than a year, and this test system only "
 "holds a few days of records so far. If there is nothing old enough to look at, mark this test "
 "BLOCKED - do not mark it failed, and do not raise it as a problem."
)
NOTE_MONEY = (
 "On this build the money in the spreadsheet file comes out as \"$11,176.88\" - with a dollar sign "
 "and a comma - instead of the plain number described in point 2 above.\n"
 "Known and accepted: the product behaves this way on purpose for now. Do not raise this as a new "
 "problem."
)
NOTE_COLUMNS = (
 "Note for the tester: on this build the spreadsheet file ignores the columns you picked and puts "
 "them in a different order from the screen, so point 1 above will not match. That difference is "
 "already written up and a decision on it is pending - record what you see and carry on; you do not "
 "need to raise it again."
)

# first-line fingerprints used to find and REPLACE a previous stamping (idempotency)
FINGERPRINTS = [
 "Note for the tester: you cannot check this one from any screen.",
 "Note for the tester: this one needs records going back more than a year",
 "On this build the money in the spreadsheet file comes out as",
 "Known and accepted: the product behaves this way on purpose for now.",
 "Note for the tester: on this build the spreadsheet file ignores the columns",
]

TARGETS = {
 # WIP nightly snapshot — no screen reads it (S11-R7). The brief said 6; C30529 and
 # C30532 were absorbed by the authorised merges, so the live set is 4.
 30528: NOTE_NIGHTLY, 30530: NOTE_NIGHTLY, 30531: NOTE_NIGHTLY, 30533: NOTE_NIGHTLY,
 # retention / thinning — needs >13 months of history; this org holds ~5 days
 30609: NOTE_HISTORY, 30610: NOTE_HISTORY,
 # the closed SV-8823 behaviour
 30589: NOTE_MONEY,
 30588: NOTE_COLUMNS,
}

PROV = "This is the expected behaviour as per"

def restamp(expected, note):
    lines = expected.split("\n")
    # 1. strip any previous stamping of ours
    out, i = [], 0
    while i < len(lines):
        if any(lines[i].strip().startswith(f) for f in FINGERPRINTS):
            i += 1
            # swallow the continuation lines of a multi-line block and one blank after
            while i < len(lines) and lines[i].strip() and not lines[i].strip().startswith(PROV) \
                  and not lines[i].strip().startswith("DO NOT AUTOMATE"):
                if any(lines[i].strip().startswith(f) for f in FINGERPRINTS):
                    i += 1; continue
                break
            while i < len(lines) and not lines[i].strip():
                i += 1
            continue
        out.append(lines[i]); i += 1
    lines = out
    # 2. locate the separator and the provenance line
    sep = max((k for k, l in enumerate(lines) if l.strip() == "---"), default=None)
    prov = next((k for k, l in enumerate(lines) if l.strip().startswith(PROV)), None)
    if sep is None or prov is None:
        raise RuntimeError("no separator or no provenance line")
    if prov < sep:
        raise RuntimeError("provenance sits before the separator")
    block = note.split("\n")
    return "\n".join(lines[:sep+1] + block + [""] + lines[sep+1:]).rstrip() + "\n" \
        if False else "\n".join(lines[:sep+1] + block + [""] + lines[sep+1:])

if __name__ == "__main__":
    plan = []
    for cid, note in TARGETS.items():
        c = BY[cid]
        before = c["custom_expected"]
        after = restamp(before, note)
        # invariants
        assert after.count(PROV) == 1, f"C{cid}: provenance count {after.count(PROV)}"
        assert [l for l in after.split("\n") if l.strip()][-1].startswith(PROV), \
            f"C{cid}: provenance is not last"
        # no assertion line altered: every numbered line must survive byte-identically
        num_before = [l for l in before.split("\n") if l[:2].strip().rstrip(".").isdigit()]
        num_after = [l for l in after.split("\n") if l[:2].strip().rstrip(".").isdigit()]
        assert num_before == num_after, f"C{cid}: an assertion line changed"
        if "DO NOT AUTOMATE" in before:
            bl = [l for l in after.split("\n") if l.strip()]
            pi = next(i for i, l in enumerate(bl) if l.startswith(PROV))
            assert bl[pi-1].startswith("The open question is in:"), \
                f"C{cid}: DO NOT AUTOMATE block no longer immediately precedes provenance"
        # idempotency: restamping the result must be a no-op
        assert restamp(after, note) == after, f"C{cid}: NOT idempotent"
        plan.append({"cid": cid, "title": c["title"], "refs": c.get("refs"),
                     "before": before, "after": after,
                     "note_kind": ("nightly" if note is NOTE_NIGHTLY else
                                   "history" if note is NOTE_HISTORY else
                                   "money-accepted" if note is NOTE_MONEY else "columns-recorded")})
    json.dump(plan, open(f"{D}/data/plan.json", "w"), indent=1)
    print(f"planned {len(plan)} update_case, all invariants pass (provenance last, no assertion "
          f"altered, DO-NOT-AUTOMATE still immediately before provenance, idempotent)")
    for p in plan:
        print(f"\n{'='*72}\nC{p['cid']} [{p['note_kind']}] {p['title'][:60]}")
        print("  --- tail AFTER ---")
        for l in p["after"].split("\n")[-7:]:
            print("   ", l[:150])
