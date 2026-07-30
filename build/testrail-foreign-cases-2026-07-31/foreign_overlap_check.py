#!/usr/bin/env python3
"""
foreign_overlap_check.py - READ-ONLY TestRail checker.

WHAT IT DOES (plain English)
  1. Pulls every live case under a TestRail section/group you name.
  2. Splits them into OURS vs FOREIGN by the `created_by` user id, resolving user
     ids to real names.
  3. For every FOREIGN case, finds the OURS cases whose ASSERTION TEXT (not just
     the title) looks most like it, and prints a verdict-ready table.
  4. Prints the "tells" that distinguish foreign cases from ours (References
     present?, Automation status, Automation Type, template, title length).

WHAT IT DOES NOT DO
  * It NEVER writes to TestRail. Only get_* calls are made. There is no code path
    in this file that issues a POST.
  * It does NOT decide the verdict. Text similarity SUGGESTS candidates; a human
    reads both cases and decides DUPLICATE / AUTOMATED EQUIVALENT / NEW COVERAGE.

USAGE
  source /tmp/tr-creds.env            # TESTRAIL_USER + TESTRAIL_KEY, never committed
  python3 foreign_overlap_check.py --group 4281                 # Report Suite
  python3 foreign_overlap_check.py --group 4110 --group 4254    # Filters + Schedule
  python3 foreign_overlap_check.py --group 4281 --top 8 --min-score 0.10
  python3 foreign_overlap_check.py --group 4281 --csv out.csv   # machine-readable
  python3 foreign_overlap_check.py --group 4281 --refresh       # ignore the cache

  Optional: --ours-email someone@shopview.com  (default = $TESTRAIL_USER, i.e. us)
            --project 1 --suite 1
            --cache-dir /tmp/trfc

GROUP IDS in this workspace (top-level TestRail sections):
  Report Suite = 4281 | Filters = 4110 | Schedule = 4254
  (Custom Roles = 3527, Fees & Discounts = 3894, Simple Flow = its own sections)

STANDING POLICY THIS SUPPORTS
  Foreign cases (created by someone other than us) are NEVER edited, deleted,
  moved or added to runs by us. We identify them, exclude them from OUR counts
  (always reporting "ours N / live total M"), and raise them with the author.
"""

import argparse
import base64
import collections
import csv
import difflib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

HOST = os.environ.get("TESTRAIL_HOST", "https://shopview.testrail.io")

# ---------------------------------------------------------------- API (read-only)


def _auth_header():
    user = os.environ.get("TESTRAIL_USER")
    key = os.environ.get("TESTRAIL_KEY")
    if not user or not key:
        sys.exit("ERROR: source your TestRail creds first (TESTRAIL_USER / TESTRAIL_KEY). "
                 "Creds live in /tmp only - never commit them.")
    token = base64.b64encode(f"{user}:{key}".encode()).decode()
    return user, {"Authorization": "Basic " + token, "Content-Type": "application/json"}


def api_get(path, headers, retries=5):
    """GET only. This function is the ONLY network call in this file."""
    url = f"{HOST}/index.php?/api/v2/{path}"
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)  # no data= -> GET
            with urllib.request.urlopen(req, timeout=90) as resp:
                return json.load(resp)
        except Exception as exc:  # noqa: BLE001 - transient 5xx/timeouts are common
            last = exc
            if attempt == retries - 1:
                break
            time.sleep(3 * (attempt + 1))
    raise RuntimeError(f"GET {path} failed: {last}")


def api_paged(path, key, headers):
    out, offset = [], 0
    while True:
        data = api_get(f"{path}&limit=250&offset={offset}", headers)
        chunk = data[key] if isinstance(data, dict) else data
        out += chunk
        if len(chunk) < 250:
            return out
        offset += 250


def resolve_user(uid, headers, cache={}):
    """get_users needs admin rights; get_user/{id} works for a Lead account."""
    if uid in cache:
        return cache[uid]
    try:
        data = api_get(f"get_user/{uid}", headers)
        cache[uid] = data.get("name") or f"user {uid}"
    except Exception:
        cache[uid] = f"user {uid} (name unavailable)"
    return cache[uid]


# ---------------------------------------------------------------- text handling

STOP = set("""a an and are as at be been but by can could does do for from had has have he her his
if in into is it its of on or our ours she so that the their them then there these they this those
to was were what when where which while who will with you your not no all any each one two both
same only just also should shall may might must its'""".split())

# Field labels straight from get_case_fields (dropdown option maps).
ATM = {1: "Not Automated", 2: "Cannot be automated", 3: "Automated", 4: "Pending", None: "(unset)"}
AUTOTYPE = {0: "None", 1: "Ranorex", None: "(unset)"}


def case_text(case):
    """Everything a tester would read: the ASSERTION, not just the title."""
    parts = [case.get("title") or ""]
    for field in ("custom_preconds", "custom_steps", "custom_expected",
                  "custom_mission", "custom_goals"):
        if case.get(field):
            parts.append(str(case[field]))
    for step in case.get("custom_steps_separated") or []:
        for field in ("content", "expected", "additional_info"):
            if step.get(field):
                parts.append(str(step[field]))
    return "\n".join(parts)


def normalise(text):
    text = re.sub(r"https?://\S+", " ", text.lower())
    text = re.sub(r"[^a-z0-9%$.\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokens(text):
    return {t for t in normalise(text).split() if t not in STOP and len(t) > 2}


def score(foreign_text, our_text):
    """Blended signal: token overlap (topic) + sequence ratio (phrasing).

    Weighted-Jaccard-ish: we use overlap-over-the-smaller-set so a SHORT foreign
    case fully contained in a LONG case of ours still scores high (that is the
    duplicate shape we care about), then average with a difflib ratio.
    """
    ft, ot = tokens(foreign_text), tokens(our_text)
    if not ft or not ot:
        return 0.0, 0.0, 0.0
    inter = len(ft & ot)
    containment = inter / min(len(ft), len(ot))
    jaccard = inter / len(ft | ot)
    ratio = difflib.SequenceMatcher(
        None, normalise(foreign_text)[:4000], normalise(our_text)[:4000]).ratio()
    return round(0.5 * containment + 0.2 * jaccard + 0.3 * ratio, 4), round(containment, 4), round(ratio, 4)


# ---------------------------------------------------------------- sections

def descendants(section_id, sections):
    ids = {section_id}
    changed = True
    while changed:
        changed = False
        for sec in sections:
            if sec["parent_id"] in ids and sec["id"] not in ids:
                ids.add(sec["id"])
                changed = True
    return ids


def section_path(section_id, by_id):
    parts = []
    while section_id in by_id:
        parts.append(by_id[section_id]["name"])
        section_id = by_id[section_id]["parent_id"]
    return " > ".join(reversed(parts))


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description="READ-ONLY foreign-case + overlap checker for TestRail.")
    ap.add_argument("--group", action="append", type=int, required=True,
                    help="Top-level TestRail section id (repeatable). 4281=Report Suite 4110=Filters 4254=Schedule")
    ap.add_argument("--project", type=int, default=1)
    ap.add_argument("--suite", type=int, default=1)
    ap.add_argument("--ours-email", default=None, help="Account that counts as OURS (default $TESTRAIL_USER)")
    ap.add_argument("--top", type=int, default=5, help="How many of-ours candidates to show per foreign case")
    ap.add_argument("--min-score", type=float, default=0.0)
    ap.add_argument("--csv", default=None, help="Also write the candidate table to this CSV")
    ap.add_argument("--cache-dir", default="/tmp/trfc")
    ap.add_argument("--refresh", action="store_true", help="Ignore the local cache and re-pull")
    args = ap.parse_args()

    creds_user, headers = _auth_header()
    ours_email = args.ours_email or creds_user

    os.makedirs(args.cache_dir, exist_ok=True)
    sec_cache = os.path.join(args.cache_dir, f"sections_p{args.project}_s{args.suite}.json")
    case_cache = os.path.join(args.cache_dir, f"cases_p{args.project}_s{args.suite}.json")

    if args.refresh or not (os.path.exists(sec_cache) and os.path.exists(case_cache)):
        sections = api_paged(f"get_sections/{args.project}&suite_id={args.suite}", "sections", headers)
        cases = api_paged(f"get_cases/{args.project}&suite_id={args.suite}", "cases", headers)
        json.dump(sections, open(sec_cache, "w"))
        json.dump(cases, open(case_cache, "w"))
    else:
        sections = json.load(open(sec_cache))
        cases = json.load(open(case_cache))

    by_id = {s["id"]: s for s in sections}
    me = api_get(f"get_user_by_email&email={ours_email}", headers)
    our_uid = me["id"]

    print(f"TestRail {HOST} | project {args.project} suite {args.suite} | READ-ONLY (get_* only)")
    print(f"OURS = {me['name']} (user id {our_uid}, {ours_email})")
    print(f"Live in suite: {len(cases)} cases / {len(sections)} sections\n")

    csv_rows = []

    for group in args.group:
        if group not in by_id:
            print(f"!! section {group} not found in project {args.project} suite {args.suite}\n")
            continue
        ids = descendants(group, sections)
        group_cases = [c for c in cases if c["section_id"] in ids]
        ours = [c for c in group_cases if c["created_by"] == our_uid]
        foreign = [c for c in group_cases if c["created_by"] != our_uid]

        print("=" * 100)
        print(f"GROUP {group} :: {by_id[group]['name']}")
        print(f"  live total {len(group_cases)}  |  OURS {len(ours)}  |  FOREIGN {len(foreign)}")
        by_creator = collections.Counter(c["created_by"] for c in foreign)
        for uid, n in by_creator.most_common():
            print(f"    foreign creator: {resolve_user(uid, headers)} (id {uid}) -> {n} case(s)")
        if not foreign:
            print("  No foreign cases in this group.\n")
            continue

        # Structural tells: what OURS look like, so deviations stand out.
        print("\n  OUR baseline in this group (the tells):")
        print(f"    References populated: {sum(1 for c in ours if c['refs'])}/{len(ours)}")
        print(f"    template_id: {dict(collections.Counter(c['template_id'] for c in ours))}")
        print(f"    Automation status: {dict(collections.Counter(ATM.get(c['custom_atmstatus'], c['custom_atmstatus']) for c in ours))}")
        print(f"    Automation Type:   {dict(collections.Counter(AUTOTYPE.get(c['custom_automation_type'], c['custom_automation_type']) for c in ours))}")
        print(f"    Titles over 80 chars: {sum(1 for c in ours if len(c['title']) > 80)}/{len(ours)}")

        for fc in sorted(foreign, key=lambda c: c["id"]):
            ftext = case_text(fc)
            print("\n  " + "-" * 96)
            print(f"  FOREIGN C{fc['id']} :: {fc['title']}")
            print(f"    creator {resolve_user(fc['created_by'], headers)} | "
                  f"last updated by {resolve_user(fc['updated_by'], headers)}")
            print(f"    section: {section_path(fc['section_id'], by_id)}")
            print(f"    tells -> refs={fc['refs'] or 'NONE'} | "
                  f"AutomationStatus={ATM.get(fc['custom_atmstatus'], fc['custom_atmstatus'])} | "
                  f"AutomationType={AUTOTYPE.get(fc['custom_automation_type'], fc['custom_automation_type'])} | "
                  f"template={fc['template_id']} | titlelen={len(fc['title'])} | "
                  f"has_expected={'YES' if (fc.get('custom_expected') or any(s.get('expected') for s in fc.get('custom_steps_separated') or [])) else 'NO'}")

            # Prefer same-report/same-area candidates first, but score the whole group.
            scored = []
            for oc in ours:
                total, contain, ratio = score(ftext, case_text(oc))
                if total >= args.min_score:
                    scored.append((total, contain, ratio, oc))
            scored.sort(key=lambda r: -r[0])

            print(f"    best {args.top} OF-OURS candidates (similarity on assertion text, NOT title alone):")
            print(f"      {'score':>6} {'contain':>7} {'seq':>6}  C-id     section / title")
            for total, contain, ratio, oc in scored[:args.top]:
                print(f"      {total:>6.3f} {contain:>7.3f} {ratio:>6.3f}  C{oc['id']:<7} "
                      f"{section_path(oc['section_id'], by_id).split(' > ')[-1]} | {oc['title'][:70]}")
                csv_rows.append({
                    "group": group, "foreign_case": f"C{fc['id']}",
                    "foreign_title": fc["title"],
                    "foreign_creator": resolve_user(fc["created_by"], headers),
                    "our_case": f"C{oc['id']}", "our_title": oc["title"],
                    "our_section": section_path(oc["section_id"], by_id),
                    "score": total, "containment": contain, "seq_ratio": ratio,
                    "verdict_DUPLICATE_or_AUTOMATED_EQUIVALENT_or_NEW_COVERAGE": "",
                })
            print("    VERDICT (human decides): DUPLICATE / AUTOMATED EQUIVALENT / NEW COVERAGE")
        print()

    if args.csv and csv_rows:
        with open(args.csv, "w", newline="") as fh:
            writer = csv.DictWriter(fh, fieldnames=list(csv_rows[0].keys()))
            writer.writeheader()
            writer.writerows(csv_rows)
        print(f"CSV written: {args.csv}")

    print("\nHONEST LIMITS")
    print("  * Similarity is a CANDIDATE FINDER, not a verdict. High score = read both cases.")
    print("    Two cases can share almost all wording and still assert different pass criteria;")
    print("    two cases can share little wording and be exact duplicates.")
    print("  * A foreign case with NO expected results (has_expected=NO) cannot be compared on its")
    print("    pass criterion at all - only on its subject. Say so rather than guessing.")
    print("  * Cases outside the named group are not scanned. Retired/deleted cases never appear.")
    print("  * This tool made ZERO writes. Nothing about a foreign case may be changed by us -")
    print("    identify, exclude from our counts, and raise it with the author.")


if __name__ == "__main__":
    main()
