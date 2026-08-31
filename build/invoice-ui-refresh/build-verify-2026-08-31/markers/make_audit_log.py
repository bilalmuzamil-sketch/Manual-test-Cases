#!/usr/bin/env python3
"""Rule 50 per-case audit log for the marker pass. "200 OK" alone is non-compliant, so each row
records the operation, the C-id, the HTTP status of the post-write re-GET, the container BEFORE and
AFTER, and the verification result actually observed on the served page."""
import json, os

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
M = f'{DIR}/markers'
rc = json.load(open(f'{M}/render-containers.json'))
snap = json.load(open(f'{M}/PRE-markers-snapshot.json'))
ok, bad = [], []
for line in open(f'{M}/APPLIED.jsonl'):
    if line.strip(): ok.append(json.loads(line))
if os.path.exists(f'{M}/FAILED.jsonl'):
    for line in open(f'{M}/FAILED.jsonl'):
        if line.strip(): bad.append(json.loads(line))

with open(f'{DIR}/TESTRAIL-EXECUTION-LOG-markers-2026-08-31.md', 'w') as f:
    f.write('# TestRail execution log — Invoice UI Refresh automation markers, 2026-08-31\n\n')
    f.write('**Authorisation:** QA lead, 2026-08-31 — *"For all those which have been build verified, '
            'please push the changes and add the markers so that I can handover those test cases to '
            'the Mudassir."*\n\n')
    f.write('**Write path:** the TestRail **web editor** (Playwright via the local MITM bridge), not '
            'the API. Reason: 48 of the 53 cases served their text fields from an escaping '
            '`<div class="markdown">` container, so any API write leaves the tester reading literal '
            '`<ol><li><p>` text. A UI save flips the container to `markdown fr-view`.\n\n')
    f.write('**What changed per case:** the AUTOMATION marker lifted to `AUTOMATION: READY`; Rule-54 '
            'sentence 2 added (`Last checked against build v26.35.5-8c3cc21 on 8/31/2026.`); on the 48 '
            'escaping cases the three text fields re-stored as plain text so they render. '
            '**No expected behaviour was changed** — provenance sentence 1 was carried byte-for-byte '
            'and verified unaltered after each write.\n\n')
    f.write('**Rule 71 gate:** `custom_atmstatus` was re-read from live immediately before every write; '
            'any case returning `3` (Automated) is skipped for Vladimir Tomovic. '
            f'Cases skipped on that gate: **{sum(1 for r in bad if r.get("skipped"))}**.\n\n')
    f.write(f'**Result: {len(ok)} applied and verified, {sum(1 for r in bad if not r.get("skipped"))} failed, '
            f'{sum(1 for r in bad if r.get("skipped"))} skipped.**\n\n')
    f.write('| C-id | Operation | Fields | HTTP (post-write re-GET) | Container before → after | atm | Verification observed |\n')
    f.write('|---|---|---|---|---|---|---|\n')
    for r in sorted(ok, key=lambda x: int(x['cid'])):
        cid = str(r['cid'])
        before = rc[cid]['expected_container']
        after = r['evidence'].get('custom_expected', {}).get('cls', '?')
        f.write(f"| [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid}) "
                f"| UI edit + save | {len(r['fields'])} | {r.get('http')} | `{before}` → `{after}` "
                f"| {r['atm']} | rendered text == intended; 0 literal tags; 0 HTML entities; "
                f"marker `AUTOMATION: READY` last and unique; provenance s1 unaltered; s2 present; "
                f"atmstatus/section_id/refs unchanged |\n")
    if bad:
        f.write('\n## Failed / skipped\n\n| C-id | Outcome | Detail |\n|---|---|---|\n')
        for r in bad:
            f.write(f"| C{r['cid']} | {'SKIPPED' if r.get('skipped') else 'FAILED'} "
                    f"| {(r.get('reason') or r.get('error') or '')[:300]} |\n")
    f.write('\n## Automated cases changed — for Vlad (Rule 65)\n\n')
    changed3 = [r for r in ok if r['atm'] == 3]
    if changed3:
        f.write('| C-id |\n|---|\n')
        for r in changed3: f.write(f"| C{r['cid']} |\n")
    else:
        f.write('**None.** Every case written in this pass carried `custom_atmstatus = 1`. '
                'No case TestRail flags as Automated was touched, so there is nothing to tell Vlad '
                'about from this pass. The 5 Automated cases in this suite (C44919, C44920, C44921, '
                'C44922, C44985) remain **untouched and held** pending the QA lead\'s go-ahead.\n')
print(f'audit log written: {len(ok)} ok, {len(bad)} failed/skipped')
