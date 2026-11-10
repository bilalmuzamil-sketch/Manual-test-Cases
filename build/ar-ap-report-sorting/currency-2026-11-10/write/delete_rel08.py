#!/usr/bin/env python3
"""10 Nov 2026 (QA lead: "Yes, both"). PROPOSAL: deletes REL-08 C715478 ("A credit dated on the as-of date stays in the same bucket as
before"), which PRD versions 10/11 S1-R5a reversed (SV-11441 moved into scope). Edit lock: refuses if the case changed since the 10 Nov 2026
snapshot. The coordinator decides and runs it. Dry run unless --apply.  python3 delete_rel08.py [--apply]"""
from _common import *
CID = 715478; snap = SNAP[CID]
print(f"REL-08 C{CID} https://shopview.testrail.io/index.php?/cases/view/{CID}: {snap['title']} (created_by {snap['created_by']}, updated_on {snap['updated_on']})")
if not APPLY: print("DRY RUN: nothing deleted."); sys.exit(0)
from trlib import api, LAST
live = api(f"get_case/{CID}")
if live["updated_on"] != snap["updated_on"]: sys.exit("REFUSED: C715478 changed since the 10 Nov 2026 snapshot")
json.dump(live, open(f"{OUT}/C{CID}-before-delete.json", "w"), indent=1, ensure_ascii=False)
api(f"delete_case/{CID}", {}); http = LAST["status"]
import urllib.error
gone = False
try: api(f"get_case/{CID}")
except SystemExit as e: gone = "HTTP 400" in str(e)
log("delete-2026-11-10-log.jsonl").write(json.dumps({"op": "delete_case", "key": "REL-08", "case": f"C{CID}", "http": http, "readback_gone": gone}) + "\n")
print("deleted:", gone)
