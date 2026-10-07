#!/usr/bin/env python3
"""Read every case in the Dashboard group live after the full update into live-after/ (read-only)."""
import sys, json, os
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
os.makedirs("build/dashboards/full-update-2026-10-07/live-after", exist_ok=True)
ids = open("build/dashboards/full-update-2026-10-07/applied/all-ids.txt").read().split()
for i in ids:
    json.dump(api(f"get_case/{i}"), open(f"build/dashboards/full-update-2026-10-07/live-after/C{i}.json", "w"), indent=1)
print("fetched", len(ids))
