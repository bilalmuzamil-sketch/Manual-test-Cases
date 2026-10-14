# For each case: if its setup-doc content (title, preconditions, both parts) is identical to the 13 Oct version, keep the
# doc it already links to (doc-ids-reuse.jsonl); otherwise list it for a new doc (docs/LIST-NEW.tsv) and record the doc it
# replaces (docs/REPLACED.tsv) for deleting by hand.
import json, glob, re
N = "build/founder-mode/part-lifecycle/update-2026-10-14"
base = {}
for f in glob.glob(f"{N}/base/proposals-*.json"):
    for p in json.load(open(f))["updates"]: base[p["case_id"]] = p
live = {c["id"]: c for c in json.load(open(f"{N}/snapshots-before/live-cases.json"))}
R = re.compile(r"docs\.google\.com/document/d/([\w-]+)")
reuse, new, replaced = [], [], []
lst = {l.split("\t")[0]: l for l in open(f"{N}/docs/LIST.tsv").read().splitlines() if l.strip()}
K = ("title", "preconditions", "doc_part1", "doc_part2")
for f in glob.glob(f"{N}/proposals-*.json"):
    d = json.load(open(f))
    for p in d["updates"]:
        cid = p["case_id"]; old = R.findall(live[cid]["custom_preconds"] or "")
        if cid in base and all(p.get(k) == base[cid].get(k) for k in K) and old:
            reuse.append({"id": f"C{cid}", "doc": old[0]})
        else:
            new.append(lst[f"C{cid}"])
            if old: replaced.append(f"C{cid}\t{old[0]}")
    for p in d["new"]:
        new.append(lst[[k for k in lst if lst[k].split("\t")[1].endswith(p["title"])][0]])
open(f"{N}/doc-ids-reuse.jsonl", "w").write("".join(json.dumps(r) + "\n" for r in reuse))
open(f"{N}/docs/LIST-NEW.tsv", "w").write("\n".join(new) + "\n")
open(f"{N}/docs/REPLACED.tsv", "w").write("\n".join(replaced) + "\n")
print(f"docs kept {len(reuse)} · new docs needed {len(new)} · old docs replaced {len(replaced)}")
