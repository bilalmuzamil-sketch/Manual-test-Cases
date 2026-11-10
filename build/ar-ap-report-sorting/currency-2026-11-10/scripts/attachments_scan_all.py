"""Read-only: list every live case's attachments (get_attachments_for_case) to prove no case outside the 46 carries one of the 3 re-shot pictures."""
import json, sys
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
from trlib import api
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting/currency-2026-11-10"
live = json.load(open(f"{B}/live-before/live-cases-2026-11-10.json"))["cases"]
pics = {"ar-ap-p4-cleared-no-locations.png", "ar-ap-p5-links-only-where-they-can-open.png", "ar-ap-p7-the-native-vendor-menu.png"}
res = {}
for c in live:
    r = api(f"get_attachments_for_case/{c['id']}"); att = r.get("attachments", r) if isinstance(r, dict) else r
    res[c["id"]] = sorted({(a.get("name") or a.get("filename")) for a in att})
json.dump(res, open(f"{B}/live-before/attachments-all-2026-11-10.json", "w"), indent=1)
hit = {cid: sorted(set(n) & pics) for cid, n in res.items() if set(n) & pics}
print("cases scanned", len(res), "with attachments", sum(1 for v in res.values() if v), "carrying a re-shot picture", len(hit))
print(sorted(hit))
