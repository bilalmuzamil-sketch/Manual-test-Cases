#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render the per-operation audit log markdown from execution-log.json."""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
LOG = json.load(open(os.path.join(HERE, '..', 'execution-log.json')))
TR = 'https://shopview.testrail.io/index.php?/cases/view/'
GROUPS = {
    'A/V-3': 'V-3 (HIGH) — the export case asserts the "Locations:" line but never cited the requirement governing the export surface',
    'B/V-2': 'V-2 (LOW) — slash-shorthand refs hid 5 anchors from every anchor-based tool',
    'C/V-10': 'V-10 (HIGH) — Rule 42: a closed enumeration with no version-pinned anchor',
    'D/V-7': 'V-7 (MEDIUM) — a contrast ratio a non-technical tester cannot measure',
    'E/V-8': 'V-8 (LOW) — Rule 4: devtools/network content in a UI-titled section',
}

out = []
w = out.append
w('# Report Suite — verifier-fix execution log, 2026-08-03')
w('')
w('**Authorisation.** QA lead, 2026-08-03, verbatim: *"Do everything which is right to do, I want '
  'everything right to be done for reports suite, I can not take a single risk of mistake."* Scope = '
  'the six findings of `build/report-suite/VERIFICATION-2026-08-03.md` (commit a956bcd).')
w('')
w('**Operations.** `update_case` ONLY — **0** `add_case`, **0** `delete_case`, **0** `add_section`, '
  '**0** run writes. Run 359 verified unchanged afterwards (475 tests / 539 result records).')
w('')
w('**Guards asserted before the first byte was written** — the executor refuses: the five foreign '
  'cases **C38919–C38923** (Vladimir Tomovic, Rule 38), **C30327 / C30391** (another worker is '
  'rescoping them), and any case whose live `created_by != 3`. Verified after the run: all five '
  'foreign cases and both other-worker cases are byte-identical to the pre-write snapshot, '
  '`updated_on`/`updated_by` included.')
w('')
w('**Verification of every write.** `update_case` → fresh `get_case` → field-by-field compare, plus a '
  'check that every field the op did *not* send is byte-identical. `refs` is compared under '
  "TestRail's own normalisation (see the note below).")
w('')
w('**Source of truth for this pass.** `build/report-suite/spec-current-2026-07-31/*-current.md` — '
  'SBC v12 · SBR v15 · PV v4 · TU v5 · WIP v6 · IV v3, all 2026-07-29. Every anchor added below was '
  'read verbatim in that mirror before it was cited.')
w('')
w('> **SBC caveat (Rule 31, honest).** The live Confluence SBC page (577634305) was modified '
  '**2026-07-31** and the mirror we hold is **2 days behind** — `VERIFICATION-2026-08-03.md` §12. '
  'Each SBC anchor cited below was verified in the mirror we hold, so the pin records exactly what '
  'we verified against; that is precisely what makes the next SBC capture re-surface these cases. '
  'A separate worker is re-capturing SBC in this same session.')
w('')
w('## The TestRail `refs` rule, proved live this pass')
w('')
w('Probed against a live case (then restored byte-identical):')
w('')
w('| Probe | Result |')
w('|---|---|')
w('| one comma-separated entry of **248** chars | HTTP **200** |')
w('| one comma-separated entry of **249** chars | HTTP **400** `Field :refs does not match the required pattern.` |')
w('| 40 short entries totalling **674** chars | HTTP **200** — no total-length limit |')
w('| `"AAA, BBB,   CCC ,DDD"` | stored as `"AAA,BBB,CCC,DDD"` |')
w('')
w('So `refs` is **split on commas, each entry trimmed, re-joined with a bare `,`**, and **any entry '
  'over 248 characters rejects the whole write**. All **475** existing Report Suite `refs` values are '
  '**comma-free single entries** (longest 245), so the house style — one comma-free entry, semicolons '
  'as separators, ≤ 248 chars — is asserted for all 40 values before every run '
  '(`tools/refs_final.json`). Recorded durably in `build/APP-ACTIONS-PLAYBOOK.md` §L (Standing Rule 27).')
w('')
w('## Operations')
w('')
w(f'**{sum(1 for e in LOG if e["result"] == "MATCH")} of {len(LOG)}** ops: HTTP **200** + re-GET '
  '**MATCH**. 0 failures, 0 no-ops.')
w('')

for g, gtitle in GROUPS.items():
    ents = [e for e in LOG if e['group'] == g]
    w(f'### {gtitle}')
    w('')
    w(f'{len(ents)} operation(s).')
    w('')
    for e in ents:
        cid = e['case_id']
        w(f'#### op {e["op"]:02d} — [C{cid}]({TR}{cid}) · HTTP `{e["http"]}` · re-GET **{e["result"]}**')
        w('')
        w(f'- **fields written:** {", ".join(f["field"] for f in e["fields"])}')
        w(f'- **why:** {e["why"]}')
        w(f'- **re-verified whole (Rule 41):** {e["reverified"]}')
        for f in e['fields']:
            w(f'- **{f["field"]} BEFORE:** `{f["before"]}`'.replace('\n', ' ⏎ '))
            w(f'- **{f["field"]} AFTER:** `{f["after"]}`'.replace('\n', ' ⏎ '))
        if e.get('mismatches'):
            w(f'- **MISMATCHES:** {e["mismatches"]}')
        w('')

open(os.path.join(HERE, '..', 'testrail-execution-log.md'), 'w').write('\n'.join(out) + '\n')
print('wrote testrail-execution-log.md', len(out), 'lines')
