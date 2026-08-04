"""Verify each of the 9 deletions had its unique content folded into its survivor FIRST."""
import json, re
B="build/report-suite"
pre = json.load(open(f"{B}/rulings-2026-08-04/recovery/merge-backup/PRE-MERGE-19-case-bodies.json"))
if isinstance(pre, dict): pre = pre.get("cases", pre)
prem = {c["id"]: c for c in (pre if isinstance(pre,list) else pre.values())}
live = {c["id"]: c for c in json.load(open(f"{B}/count-recon-2026-08-04/data/live-cases-4281.json"))}
base = {c["id"]: c for c in json.load(open(f"{B}/rulings-2026-08-04/baseline/live-cases-4281-START.json"))}

GROUPS = [("MG-IV-SNAPSHOT-RERUN",30608,30607),("MG-IV-TOTALS-POSITION",30586,30556),
          ("MG-PV-REVERSAL",30350,30364),("MG-SBC-EMPTY-LOADING",30182,30181),
          ("MG-TU-LOC-FALLBACK",30445,30444),("MG-WIP-SNAPSHOT-SHAPE",30529,30528),
          ("MG-WIP-SNAPSHOT-PRECISION",30532,30530),("MG-WIP-TAB-COUNTS",30453,30452),
          ("CUT-IV-SCOPE-05",30544,30540)]

def norm(s): return re.sub(r"\s+"," ",(s or "")).strip().lower()

for g, absorbed, surv in GROUPS:
    a = prem.get(absorbed) or base.get(absorbed)
    sb = base[surv]; sl = live[surv]
    grew = len(sl.get("custom_expected") or "") - len(sb.get("custom_expected") or "")
    print(f"\n### {g}: absorbed C{absorbed} -> survivor C{surv}")
    print(f"  absorbed present in live? {absorbed in live}  (expect False)")
    print(f"  survivor expected length before {len(sb.get('custom_expected') or '')} -> now {len(sl.get('custom_expected') or '')}  (delta {grew:+d})")
    print(f"  survivor refs before: {sb.get('refs')}")
    print(f"  survivor refs now   : {sl.get('refs')}")
    # every non-boilerplate assertion line of the absorbed case: is its substance in the survivor now?
    ab_lines = [l for l in (a.get("custom_expected") or "").split("\n")
                if l.strip() and not l.strip().startswith("---")
                and "expected behaviour as per" not in l]
    surv_now = norm(sl.get("custom_expected"))
    print(f"  absorbed had {len(ab_lines)} assertion line(s):")
    for l in ab_lines:
        # token overlap heuristic + report verbatim so a human can judge
        toks = [t for t in re.findall(r"[a-z]{4,}", norm(l)) if t not in ("that","this","with","from","when","then","also","only","same","shown","appears")]
        hit = sum(1 for t in set(toks) if t in surv_now)
        print(f"    [{hit}/{len(set(toks))} tokens present in survivor] {l.strip()[:150]}")
