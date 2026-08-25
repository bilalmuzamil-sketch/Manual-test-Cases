#!/usr/bin/env python3
"""THE ONE AUTHORISED TESTRAIL WRITE — C44864 TITLE ONLY.
QA lead approved 2026-08-25 ("2. Approved") the title repair for the <query>
placeholder TestRail swallowed on import.

Discipline applied:
  core 2.1  send ALL text fields + refs, unchanged ones at their exact snapshot value
  core 2.4  DRY-RUN and READ the built payload strings before sending
  core 2.2  re-GET and byte-compare field by field afterwards
  core 2.3  STOP on any mismatch
  core 2.9  log operation / C-id / HTTP / byte-verification result / atm at write time
  Rule 69   marker keys on testable content; the LAST-CHECKED DATE DOES NOT MOVE
            because no build was checked (Global Search has no build)
SCOPE GUARD: title only. refs and custom_expected also carry the same swallow but are
NOT in the approved scope, so they are sent back BYTE-IDENTICAL and reported instead.
"""
import json, base64, urllib.request, urllib.error, sys, datetime

CID=44864
C=json.load(open('/tmp/testrail/creds.json'))
A=base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B=C['host']+'/index.php?/api/v2/'
def call(path,payload=None):
    r=urllib.request.Request(B+path, data=json.dumps(payload).encode() if payload is not None else None)
    r.add_header('Authorization','Basic '+A); r.add_header('Content-Type','application/json')
    try:
        with urllib.request.urlopen(r,timeout=60) as x: return x.status, json.loads(x.read().decode())
    except urllib.error.HTTPError as e: return e.code, e.read().decode()[:400]

snap=json.load(open('build/build-verify-session-2026-08-21/snapshots/PRE-WRITE-C44864.json'))

# --- confirm the snapshot still matches live IMMEDIATELY before writing (Rule 59) ---
s,livepre=call(f'get_case/{CID}')
assert s==200, f"pre-write re-read failed HTTP {s}"
drift=[f for f in ('title','refs','custom_preconds','custom_steps','custom_expected')
       if (livepre.get(f) or '')!=(snap.get(f) or '')]
if drift:
    print("STOP — the case moved between snapshot and write:",drift); sys.exit(1)
print("pre-write re-read: live == snapshot on all 5 fields (no drift)")
if livepre.get('custom_atmstatus')==3:
    print("STOP — case is flagged Automated; Rule 71 needs a separate ask"); sys.exit(1)

CANDIDATES=[
 "No matches shows 'No results for' with the typed query, plus three quick-create buttons",
 "No matches shows 'No results for' plus the typed query and three quick-create buttons",
 "No matches: 'No results for' with the typed query and three quick-create buttons",
 "No matches shows 'No results for' with the query and three quick-create buttons",
]
new_title=next(t for t in CANDIDATES if len(t)<=80 and '<' not in t and '>' not in t)

payload={
 "title": new_title,
 "custom_preconds": snap['custom_preconds'],
 "custom_steps":    snap['custom_steps'],
 "custom_expected": snap['custom_expected'],
 "refs":            snap['refs'],
}

print("\n===== DRY RUN — the ACTUAL payload strings (core 2.4) =====")
for k,v in payload.items():
    print(f"  {k} ({len(v)} chars): {v!r}"[:300])
assert '<' not in payload['title'] and '>' not in payload['title'], "title must carry no angle brackets"
assert len(payload['title'])<=80, "title over 80 chars"
assert payload['custom_expected']==snap['custom_expected']
assert payload['custom_steps']==snap['custom_steps']
assert payload['custom_preconds']==snap['custom_preconds']
assert payload['refs']==snap['refs']
assert 'Last checked 8/21/2026' in payload['custom_expected'], "the build last-checked date must NOT move"
print("\n  dry-run assertions PASSED (title bracket-free, <=80, all other fields byte-identical,")
print("  marker date unchanged at 8/21/2026 because no build was checked)")

ts=datetime.datetime.now(datetime.timezone.utc).isoformat()
print(f"\n===== SENDING update_case/{CID} at {ts} =====")
st,resp=call(f'update_case/{CID}', payload)
print("HTTP",st)
if st!=200:
    print("write failed:",resp); sys.exit(1)

# --- byte-verify (core 2.2 / 2.3) ---
st2,live=call(f'get_case/{CID}')
assert st2==200, f"post-write re-read failed HTTP {st2}"
checks=[]
checks.append(("title == intended",           live['title']==new_title))
checks.append(("preconds byte-identical",     (live.get('custom_preconds') or '')==snap['custom_preconds']))
checks.append(("steps byte-identical",        (live.get('custom_steps') or '')==snap['custom_steps']))
checks.append(("expected byte-identical",     (live.get('custom_expected') or '')==snap['custom_expected']))
checks.append(("refs byte-identical",         (live.get('refs') or '')==snap['refs']))
checks.append(("custom_atmstatus unchanged",  live.get('custom_atmstatus')==snap.get('custom_atmstatus')))
checks.append(("section_id unchanged",        live.get('section_id')==snap.get('section_id')))
exp=live.get('custom_expected') or ''
checks.append(("exactly ONE provenance block",exp.count('This is the expected behaviour as per')==1))
checks.append(("exactly ONE AUTOMATION marker",exp.count('AUTOMATION:')==1))
checks.append(("marker date still 8/21/2026", 'Last checked 8/21/2026' in exp))
checks.append(("no angle bracket introduced", '<' not in live['title']))
print("\n===== BYTE VERIFICATION =====")
ok=True
for name,res in checks:
    print(f"  [{'PASS' if res else 'FAIL'}] {name}")
    ok = ok and res
print("\nRESULT:", "ALL CHECKS PASSED" if ok else "*** MISMATCH — batch stopped, restore from snapshot ***")
json.dump(live,open('build/build-verify-session-2026-08-21/snapshots/POST-WRITE-C44864.json','w'),indent=1)
log=f"""# TESTRAIL EXECUTION LOG — 2026-08-25

| # | Operation | Target | HTTP | Byte-verification | custom_atmstatus at write |
|---|---|---|---|---|---|
| 1 | `update_case` (title only) | [C44864](https://shopview.testrail.io/index.php?/cases/view/44864) | {st} | {'ALL PASSED — ' + str(len(checks)) + ' checks' if ok else 'FAILED'} | {snap.get('custom_atmstatus')} (Not Automated) |

**Sources read at pass start:** 2026-08-25T10:20Z (local `requirements.md` 5.2 State 4).
**Sources re-read at write start:** {ts} — the case itself re-read live and proven byte-identical
to the pre-write snapshot on all five fields before sending (Rule 59 / core 2.5: verified by CONTENT,
not by `updated_on`).
**Confluence PRD 576978945 was NOT re-fetched this turn** — the only version-bearing MCP call returns
the entire page body (documented limitation, `BLOCKED-confluence-version-integers.md`), and this edit
does not alter the expectation, only repairs a placeholder the import destroyed. Stated rather than
implied.

**Title before:** `{snap['title']}`
**Title after :** `{new_title}`

**Source it is quoted back to** (core 2.10 post-write audit, check 1): `build/global-search/requirements.md`
line 139 — **"No results for '<query>'"** plus the same three quick-create chips. The new title states
exactly that, without the angle brackets TestRail cannot store.
**Reachable by the case's own steps** (check 2): yes — the steps type a no-match query and read the
message and buttons.
**Content belongs to this case** (check 3): yes — same screen, same message, same three buttons.
**Note paragraphs diffed** (check 4): none present; `custom_expected` is byte-identical.

**AUTOMATED CASES CHANGED — FOR VLAD: none.** C44864 is `custom_atmstatus = 1` (Not Automated), so
Rule 65 raises no hand-off. Verified live at write time, not inferred.

**NOT DONE, because it is outside the approved scope:** C44864's `refs` and its `custom_expected`
provenance line both still read `(No results for  + quick-create chips)` — the same swallowed
`<query>`. Sent back byte-identical. Listed as an ask.
"""
open('build/build-verify-session-2026-08-21/testrail-execution-log.md','w').write(log)
print("execution log written")
sys.exit(0 if ok else 1)
