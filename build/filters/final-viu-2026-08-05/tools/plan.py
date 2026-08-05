#!/usr/bin/env python3
"""Build the Filters repair plan. Every intent is applied to ONE final text per case."""
import json, re, sys
CASES={c['id']:c for c in json.load(open('/tmp/fv/cases-PRE.json'))}
BUILD='v3.4.2-d00239b'; DATE='8/5/2026'
SPECV='18'   # the LIVE Confluence page version (the in-body "1.6" is the Rule-31(a) trap)
SPECNAME='Filters specification'
GH='https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/HEAD/'

def split(exp):
    """-> (assertion_body, provenance_block, marker_line)"""
    m=re.search(r'\n\nAUTOMATION: .*$', exp, re.S)
    marker=m.group(0).strip() if m else None
    rest=exp[:m.start()] if m else exp
    p=rest.rfind('\n---\n')
    if p<0: return rest.rstrip(), None, marker
    return rest[:p].rstrip(), rest[p+5:].strip(), marker

# ---------- the class-A restorations: the waiver paragraph is DELETED ----------
WAIVER=re.compile(r'\n*Known and accepted:.*?(?=\n\n|\n---|\Z)', re.S)

# ---------- per-case repairs, each justified by a live observation this pass ----------
REPAIR={}

# A1 FLT-BAR-01 C29557 - S1-R1. Build puts the bar BESIDE the tabs -> deviation, SV-8843 closed w/o fix.
REPAIR[29557]=dict(
  drop_waiver=True,
  add_note="Note for the tester: on the build this test was run against, the five filter buttons sit to the RIGHT of the tab row instead of on their own row beneath it, so point 1 fails. That has been reported and the report was closed without a fix, so do not expect it to change - record it as a fail against point 1 and move on.",
  marker='AUTOMATION: READY - EXPECT FAIL (SV-8843 - reported, closed without a fix)',
  prov_anchors='S1-R1')

# A2 FLT-COLL-02 C29602 - S1-R6. Live: re-expand restores chips + Clear Filters -> PASSES.
REPAIR[29602]=dict(
  drop_waiver=True,
  marker='AUTOMATION: READY',
  prov_anchors='S1-R6')

# A3 FLT-EMPTY-01 C29606 - S8-R3 requires the message to name filters AND search.
REPAIR[29606]=dict(
  drop_waiver=True,
  expected_replace=[(
   '2. The empty state shows a message indicating no results were found for the current filters.',
   '2. The empty state shows a message saying no results were found for the filters and the search you have on.')],
  add_note="Note for the tester: on the build this test was run against the message reads \"No work orders match your filters\" - it never mentions the search, even when a search is the only thing narrowing the list. So point 2 fails whenever a search is part of what you applied. That has been reported and the report was closed without a fix, so do not expect it to change.",
  marker='AUTOMATION: READY - EXPECT FAIL (SV-8847 - reported, closed without a fix)',
  prov_anchors='S8-R3')

# A4 FLT-EMPTY-02 C29607 - S8-R4/S8-R5. Live: only "Clear Filters" offered; no way to clear the search.
REPAIR[29607]=dict(
  drop_waiver=True,
  expected_replace=[(
   '1. The empty state includes a prompt or link to clear the filters.',
   "1. The empty state includes a link to clear the filters, and - when you also have a search on - a separate way to clear just the search.")],
  add_note="Note for the tester: on the build this test was run against the empty screen offers only a \"Clear Filters\" link. There is no way to clear just the search from that screen, so the second half of point 1 fails. Pressing \"Clear Filters\" does correctly leave your search in place. That has been reported and the report was closed without a fix, so do not expect it to change.",
  marker='AUTOMATION: READY - EXPECT FAIL (SV-8847 - reported, closed without a fix)',
  prov_anchors='S8-R4, S8-R5')

# A5 FLT-PSRCH-09 C38899 - the waiver is about a screen this case does not test. Just delete it.
REPAIR[38899]=dict(
  drop_waiver=True,
  marker='AUTOMATION: READY',
  prov_anchors='S13-R7, S13-R12')

# D FLT-RPTS-23 C38882 - move the build's ten periods OUT of the expectation (Rule 42).
REPAIR[38882]=dict(
  expected_replace=[(
   "1. The panel that opens offers a set of ready-made periods to choose from - on the build tested these are Today, Yesterday, This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year - plus a Custom option and a Clear Selection link. The exact set of ready-made periods may differ per report, so check the ones your report offers rather than expecting this list.",
   "1. The panel that opens offers a set of standard ready-made periods to choose from, plus a Custom option and a Clear Selection link. The written description does not fix which periods are offered, and it can differ per report, so do not check them against a fixed list - write down the ones your report offers."),
   ("Note: dates are typed in month/day/year order, the way the build shows them (for example 07/01/2026).",
    "Note: dates are typed in month/day/year order, the way the screen shows them (for example 07/01/2026). For orientation only, one report was seen offering Today, Yesterday, This week, Last week, This month, Last month, This quarter, Last quarter, This year and Last year - that is an example of what you may find, not a list to check against.")],
  marker='AUTOMATION: HOLD - the report filter bars are not in the product yet beyond the first report tab')

# C29609 / C29610 - stale refs asserting the superseded position + "and the build" in the divergence line
for cid,an in ((29609,'S9-R2, S2-N1'),(29610,'S9-R3, S2-N2')):
    REPAIR[cid]=dict(
      refs_replace=[('behaviour per Branko Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = shown greyed-out/disabled; PRD alignment is Branko\'s open item',
                     'supersedes Branko 2026-07-17 Q4=B (greyed-out/disabled), which the PRD no longer states')],
      prov_replace=[('so this test follows the specification and the build.','so this test follows the specification.')],
      marker='AUTOMATION: READY', prov_anchors=an)

# the 8 not-built Parts/Reports cases: the build is NOT the source of their expectation
NOTBUILT={38904:'FLT-PARTS-01',38905:'FLT-PARTS-09',38906:'FLT-PARTS-11',38907:'FLT-PARTS-12',
          38908:'FLT-PARTS-13',38909:'FLT-RPTS-01',38910:'FLT-RPTS-21',38911:'FLT-RPTS-22'}

# the 10 phone cases -> state-2 provenance + a real marker, from THIS pass's live observation
PHONE={
 29621:('AUTOMATION: READY','S12-R1'),
 29622:('AUTOMATION: READY','S12-R6'),
 29623:('AUTOMATION: READY','S12-R6'),
 29624:('AUTOMATION: READY - EXPECT FAIL (SV-8875)','S12-R2, S12-R6'),
 29625:('AUTOMATION: READY - EXPECT FAIL (SV-8875)','S12-R2, S12-R6, S3-R1'),
 29626:('AUTOMATION: READY','S12-R2, S4-R1, S5-R1'),
 29627:('AUTOMATION: READY','S12-R2, S6-R1'),
 29628:('AUTOMATION: READY - EXPECT FAIL (SV-8846)','S12-R2, S7-R1, S8-R1'),
 29629:('AUTOMATION: READY','S12-R3'),
 29630:('AUTOMATION: READY','S12-N1, S8-R3'),
}
json.dump({'REPAIR':{str(k):v for k,v in REPAIR.items()},
           'NOTBUILT':{str(k):v for k,v in NOTBUILT.items()},
           'PHONE':{str(k):v for k,v in PHONE.items()}}, open('/tmp/fv/plan-inputs.json','w'), indent=1)
print('repair cases:',len(REPAIR),'| notbuilt:',len(NOTBUILT),'| phone:',len(PHONE))
