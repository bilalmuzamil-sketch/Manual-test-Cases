#!/usr/bin/env python3
"""READ-ONLY. Reconstruct the description history of a Jira issue from its
changelog and date a requirement STRING inside it (Standing Rule 31 trap (b) —
`updated` moves for administrative edits, so only the changelog can date text).

For each `description` change it prints a unified diff of fromString -> toString
and reports whether the probe literal was present before and after, so an edit
that LEFT the sentence untouched can be told apart from one that WROTE it.
"""
import difflib
import json
import os
import re
import sys
import datetime as dt

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")

PROBES = {
    "fade sentence": "Non-matching blocks fade; matching blocks highlight",
    "AC fade clause": "matching blocks highlight and non-matching blocks fade",
    "5-field search list": "customer name, WO number, unit number, technician name, and line name",
}


def utc(ts):
    return dt.datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(
        dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")


def norm(s):
    return re.sub(r"[ \t]+", " ", (s or "")).strip()


def main(key):
    cl = json.load(open(os.path.join(EV, f"{key}-changelog.json")))
    cl.sort(key=lambda e: e["created"])
    edits = [(e, it) for e in cl for it in e["items"] if it["field"] == "description"]
    print(f"{key}: {len(edits)} description edits out of {len(cl)} changelog entries\n")
    report = []
    for i, (e, it) in enumerate(edits, 1):
        who = e.get("author", {}).get("displayName")
        before, after = it.get("fromString") or "", it.get("toString") or ""
        rec = {"n": i, "when_raw": e["created"], "when_utc": utc(e["created"]),
               "author": who, "len_before": len(before), "len_after": len(after),
               "probes": {}}
        print("=" * 100)
        print(f"EDIT {i}  {rec['when_utc']}  (raw {e['created']})  by {who}")
        print(f"  length {len(before)} -> {len(after)}")
        for label, lit in PROBES.items():
            b, a = lit.lower() in before.lower(), lit.lower() in after.lower()
            rec["probes"][label] = {"before": b, "after": a}
            verdict = ("UNCHANGED-PRESENT" if b and a else
                       "ADDED" if a and not b else
                       "REMOVED" if b and not a else "ABSENT-BOTH")
            print(f"  {label:<22} before={b!s:<5} after={a!s:<5} -> {verdict}")
        bl = [norm(x) for x in before.splitlines() if norm(x)]
        al = [norm(x) for x in after.splitlines() if norm(x)]
        dl = [d for d in difflib.unified_diff(bl, al, "before", "after", lineterm="", n=0)
              if d.startswith(("+", "-")) and not d.startswith(("+++", "---"))]
        rec["changed_lines"] = len(dl)
        print(f"  --- diff ({len(dl)} changed lines) ---")
        for d in dl:
            print("   ", d[:200])
        report.append(rec)
        # persist each state so the text can be quoted verbatim later
        open(os.path.join(EV, f"{key}-desc-edit{i}-before.txt"), "w").write(before)
        open(os.path.join(EV, f"{key}-desc-edit{i}-after.txt"), "w").write(after)
    json.dump(report, open(os.path.join(EV, f"{key}-desc-history.json"), "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1] if sys.argv[1:] else "SV-8686")
