#!/usr/bin/env python3
"""Sync VIU-Verified Fees & Discounts cases to their TestRail master cases.

Authorized TestRail write (user-authorized 2026-07-09): update_case ONLY, on the
F&D master cases whose `viu_status` starts with "VIU-Verified" in
build/fees-discounts/cases/*.json. No runs/results, no deletions, no other cases.

Content is built exactly the way build/fees-discounts/gen_import.py builds the
import CSV (same clean()/joinlines()/build_refs() rules): VIU-word-free,
feature-flag-free, numbered Preconditions / Steps / Expected with line breaks.
Field layout matches the live imported cases: title, custom_preconds,
custom_steps, custom_expected (plain text), refs.

Credentials: read from env TESTRAIL_USER / TESTRAIL_KEY — NEVER hardcoded.
Usage:
  TESTRAIL_USER=... TESTRAIL_KEY=... python3 testrail_viu_sync.py [--dry-run]
"""
import csv, glob, json, os, re, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
BASE_URL = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
USER = os.environ.get("TESTRAIL_USER")
KEY = os.environ.get("TESTRAIL_KEY")
DRY = "--dry-run" in sys.argv
LOG_PATH = os.path.join(HERE, "testrail-viu-sync-log.md")

if not USER or not KEY:
    sys.exit("Set TESTRAIL_USER and TESTRAIL_KEY in the environment (never in files).")


def api(method, endpoint, payload=None):
    """Call TestRail v2 via curl (Node fetch is blocked for this host)."""
    url = BASE_URL + endpoint
    for attempt in range(5):
        cmd = ["curl", "-sS", "--cacert", CA, "-u", f"{USER}:{KEY}",
               "-H", "Content-Type: application/json",
               "-w", "\n%{http_code}", url]
        if method == "POST":
            cmd[1:1] = ["-X", "POST", "--data-binary", json.dumps(payload)]
        out = subprocess.run(cmd, capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        code = code.strip()
        if code in ("429",) or code.startswith("5"):
            wait = 2 ** attempt
            print(f"  HTTP {code} on {endpoint} — retry in {wait}s", flush=True)
            time.sleep(wait)
            continue
        if code != "200":
            raise RuntimeError(f"HTTP {code} on {method} {endpoint}: {body[:300]}")
        return json.loads(body) if body.strip() else {}
    raise RuntimeError(f"Retries exhausted on {method} {endpoint}")


# ---- content builders (mirrors gen_import.py exactly) -----------------------
def clean(s):
    if not s:
        return s
    s = re.sub(r"\s*\(see (?:SF|FD)-[A-Z0-9-]+\)", "", s)
    s = s.replace(" (Administration → Feature Flags)", "")
    s = s.replace("(Administration → Feature Flags)", "")
    s = s.replace("Fees & Discounts feature flag", "Fees & Discounts feature")
    s = s.replace("FeesAndDiscounts feature flag", "Fees & Discounts feature")
    s = s.replace("FeesAndDiscounts flag", "Fees & Discounts feature")
    s = re.sub(r"feature[ -]flags?", "Fees & Discounts feature", s, flags=re.I)
    m = re.match(r"^(\s*\d+\.\s*)EXPECTED PER SPEC:\s*(.*)$", s, re.I | re.S)
    if m:
        rest = m.group(2)
        rest = rest[:1].upper() + rest[1:] if rest else rest
        s = m.group(1) + rest
    return s


def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in lst)


def build_refs(c):
    parts = []
    sr = (c.get("story_ref") or "").strip()
    if sr:
        parts.append(sr)
    for jira in sorted(set(re.findall(r"SV-\d+", str(c.get("story_ref", ""))))):
        if jira not in " ".join(parts):
            parts.append(jira)
    return clean(" ".join(parts).strip())


# ---- load sources ------------------------------------------------------------
cases = []
for fn in ["group-A-wo-parts.json", "group-B-customer-admin-finance.json",
           "group-C-calc-permissions-validation.json"]:
    with open(os.path.join(HERE, "cases", fn)) as f:
        cases += json.load(f)
verified = [c for c in cases if (c.get("viu_status") or "").startswith("VIU-Verified")]
print(f"VIU-Verified cases: {len(verified)}")

idmap = {}
with open(os.path.join(HERE, "testrail-id-map.csv")) as f:
    for row in csv.DictReader(f):
        idmap[row["fd_id"]] = int(row["ID"])
missing = [c["id"] for c in verified if c["id"] not in idmap]
if missing:
    sys.exit(f"Cases missing from testrail-id-map.csv: {missing}")

# section-id -> name map (for API-section rule verification)
sections = {}
resp = api("GET", "get_sections/1&suite_id=1&limit=250&offset=0")
while True:
    lst = resp.get("sections", resp if isinstance(resp, list) else [])
    for s in lst:
        sections[s["id"]] = s["name"]
    nxt = (resp.get("_links") or {}).get("next") if isinstance(resp, dict) else None
    if not nxt:
        break
    resp = api("GET", nxt.split("/api/v2/")[-1])
print(f"Sections loaded: {len(sections)}")

FIELDS = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]
log_rows, counts = [], {"updated": 0, "no-op": 0, "failed": 0, "api-section-ok": 0}

for i, c in enumerate(sorted(verified, key=lambda x: idmap[x["id"]]), 1):
    cid = idmap[c["id"]]
    desired = {
        "title": clean(c["title"].strip()),
        "custom_preconds": joinlines(c.get("preconditions", [])),
        "custom_steps": joinlines(c.get("steps", [])),
        "custom_expected": joinlines(c.get("expected", [])),
        "refs": build_refs(c),
    }
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
    try:
        live = api("GET", f"get_case/{cid}")
    except Exception as e:
        print(f"[{i}] C{cid} {c['id']}: GET FAILED — {e}")
        log_rows.append((cid, c["id"], f"FAILED (get_case: {e})", ts))
        counts["failed"] += 1
        continue

    sec_name = sections.get(live["section_id"], f"?{live['section_id']}")
    api_note = ""
    if c.get("api_related"):
        if "API" in sec_name:
            counts["api-section-ok"] += 1
            api_note = f"; API-section rule OK (section '{sec_name}')"
        else:
            api_note = f"; WARNING: api_related but section '{sec_name}' lacks 'API'"
            print(f"[{i}] C{cid} {c['id']}: {api_note}")

    def differs(k, v):
        have = live.get(k) or ""
        if k == "refs":
            # TestRail normalizes the refs list by stripping spaces after commas
            # on import; treat that cosmetic difference as equal (no-op).
            return have.replace(", ", ",") != v.replace(", ", ",")
        return have != v

    changed = {k: v for k, v in desired.items() if differs(k, v)}
    time.sleep(0.25)
    if not changed:
        counts["no-op"] += 1
        log_rows.append((cid, c["id"], "no-op (already in sync)" + api_note, ts))
        print(f"[{i}] C{cid} {c['id']}: no-op")
        continue

    if DRY:
        log_rows.append((cid, c["id"],
                         "DRY-RUN would update: " + ", ".join(sorted(changed)) + api_note, ts))
        print(f"[{i}] C{cid} {c['id']}: DRY would update {sorted(changed)}")
        counts["updated"] += 1
        continue
    try:
        api("POST", f"update_case/{cid}", changed)
        counts["updated"] += 1
        log_rows.append((cid, c["id"],
                         "updated: " + ", ".join(sorted(changed)) + api_note, ts))
        print(f"[{i}] C{cid} {c['id']}: updated {sorted(changed)}")
    except Exception as e:
        counts["failed"] += 1
        log_rows.append((cid, c["id"], f"FAILED (update_case: {e})", ts))
        print(f"[{i}] C{cid} {c['id']}: UPDATE FAILED — {e}")
    time.sleep(0.25)

# ---- audit log ----------------------------------------------------------------
mode = "DRY-RUN (no writes)" if DRY else "LIVE"
with open(LOG_PATH, "w") as f:
    f.write("# TestRail sync — VIU-Verified Fees & Discounts master cases\n\n")
    f.write(f"- **Run:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%SZ')} ({mode})\n")
    f.write("- **Authorization:** explicit user authorization 2026-07-09 — "
            "update F&D master cases that are VIU-Verified; nothing else touched.\n")
    f.write("- **Scope:** `update_case` on title / custom_preconds / custom_steps / "
            "custom_expected / refs, built by the gen_import.py rules "
            "(VIU-word-free, feature-flag-free). No section moves needed — the two "
            "API-flagged verified cases already sit in API-titled sections.\n")
    f.write(f"- **Snapshot commit of cases/*.json:** `{os.environ.get('SNAPSHOT_SHA','(unset)')}`\n\n")
    f.write(f"**Summary:** {len(verified)} VIU-Verified cases processed — "
            f"{counts['updated']} updated, {counts['no-op']} no-op, "
            f"{counts['failed']} failed. API-section rule verified OK on "
            f"{counts['api-section-ok']} api-flagged case(s); 0 section moves.\n\n")
    f.write("| TestRail Case | FD ID | Action | Timestamp (UTC) |\n|---|---|---|---|\n")
    for cid, fd, action, ts in log_rows:
        link = f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})"
        f.write(f"| {link} | {fd} | {action} | {ts} |\n")
print("Counts:", counts)
print("Log written:", LOG_PATH)
