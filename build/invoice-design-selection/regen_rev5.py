#!/usr/bin/env python3
"""Regenerate the 54 Invoice Design Selection case bodies for spec Rev 5 (2026-09-10).
Keeps behavioural content (block[0]); replaces provenance (block[1]) with the Rev-5 version
(epic SV-9892 + per-story key); keeps marker (block[2]); applies the case-specific corrections
from CHANGE-ANALYSIS-Rev5.md. Emits intended-blocks-rev5.json + targets-rev5.json for the harness."""
import json, os
DIR = os.path.dirname(os.path.abspath(__file__))
orig = json.load(open(f'{DIR}/intended-blocks.json'))
# cid -> req_ids
req = {}
for line in open(f'{DIR}/testrail-id-map.csv'):
    p = line.rstrip('\n').split('\t')
    if len(p) >= 3:
        req[p[1]] = p[2].split(',')

STORY = {'S1':('SV-9893','Choose the invoice design'),
         'S2':('SV-9894','Invoice-type documents capture their design when created'),
         'S3':('SV-9895','Estimate-type documents use the current setting'),
         'S4':('SV-9896','Documents created before this setting existed'),
         'S5':('SV-9897','Every surface renders the document’s design')}
FO_STORY = {'FO-1':'S1','FO-2':'S1','FO-3':'S1','FO-9':'S1','FO-5':'S2','FO-6':'S3','FO-7':'S5','FO-8':'S4'}
DESIGN_LINK = "https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354"
RENDER_PREFIXES = ('S2','S3','S4','S5'); RENDER_FO = {'FO-4','FO-5','FO-6','FO-7','FO-8','FO-9'}

def story_for(cid):
    ids = req[cid]
    for r in ids:
        pre = r.split('-')[0]
        if pre in STORY: return STORY[pre]
    for r in ids:
        if r in FO_STORY: return STORY[FO_STORY[r]]
    return ('SV-9892','Invoice Design Selection (Feature Overview, Section 2)')  # FO-4 etc.

def wants_design(ids):
    return any(r.split('-')[0] in RENDER_PREFIXES for r in ids) or any(r in RENDER_FO for r in ids)

def is_portal(cid):
    return orig[cid]['fields']['custom_expected']['blocks'][1] and any('customer portal' in l for l in orig[cid]['fields']['custom_expected']['blocks'][1])

# --- case-specific decision notes appended to provenance (Rule 106 / open-question disclosure) ---
# Q6 update 2026-09-10 (2nd re-verify): the spec's Section 8.1 decision cell now records option (a) for
# Q6 (Story 4 ships as written), but the spec HEADER still reads "Q6 to Q12 awaiting a Product decision"
# and the Story-4 ticket SV-9896 still says "do not start before Q6". Divergence disclosed (Rule 56); the
# cases stay NOT-FINAL until the spec formally closes Q6 (Rule 58).
Q6DEC = ("Q6 is RESOLVED and folded into the rules (spec Section 2, Story 4 and Section 8.1; @chris ruling "
         "2026-09-10): the retroactive pin is the INTENT and Story 4 is cleared to build — invoice-type "
         "documents created before 2026-09-09 09:13:36 UTC render Legacy on every surface, documents from "
         "the gap window persist Modern, and documents created after the feature ships follow the setting. "
         "The pre-cutoff back catalogue changing to Legacy on ship day, including for organizations that "
         "never chose Legacy, is EXPECTED behaviour that needs shop communication, not a defect. (The Jira "
         "epic SV-9892 and story SV-9896 text still read \"Q6 open / do not start before Q6\" — that Jira "
         "wording lags the rolled-in spec and is stale; the spec is authoritative.)")
Q17NOTE = ("\"Created\" for the cohort boundary means the actual creation instant the system records (server "
           "insert time), NOT the invoice/credit date printed on the document, which a user can edit (Q17). "
           "Test the boundary by real creation time.")
Q10DIALOG = ("The dialog wording above is the tightened copy ruled under Q10 and folded into S1-R7 and "
             "Section 9 (@chris 2026-09-10): \"Estimates not yet invoiced…\", \"Invoices and credit invoices "
             "that already exist…\", and a parts sale named alongside a work order. The app-wide button "
             "style renders the button title-case (\"Switch To Legacy\"/\"Switch To Modern\") — accepted; "
             "capitalisation alone is not a divergence.")
Q8NOTE = ("The captured design is a design FAMILY (Modern or Legacy), not a frozen template version (Q8): "
          "Legacy is frozen at v26.35.10, but Modern is not — a later fix to a Modern template changes "
          "Modern documents already issued, which is expected and not a breach of \"keeps its design for life\".")
Q7N4NOTE = ("Known Legacy exception (Q7 / SV-9790): a restored v26.35.10 defect means a credit note raised "
            "with no originating invoice ignores the shop's invoice settings and prints no disclaimer while "
            "the organization is on Legacy, so S1-N4 does not hold for that one document on Legacy.")
NOTES = {
 '53554': ['Cohort cutoff: the refresh release is 2026-09-09 at 09:13:36 UTC (spec Terminology / S4-R1, confirmed by engineering Q16).', Q17NOTE, Q6DEC],
 '53555': ['Cohort cutoff: the refresh release is 2026-09-09 at 09:13:36 UTC (Q16). The between-releases cohort is closed and stops growing when this setting ships.', Q17NOTE, Q6DEC],
 '53556': [Q6DEC],
 '53557': ['Cohort cutoff 2026-09-09 09:13:36 UTC (Q16).', Q6DEC],
 '53558': ['Cohort cutoff 2026-09-09 09:13:36 UTC (Q16).', Q17NOTE, Q6DEC],
 '53559': [Q6DEC],
 '53560': [Q6DEC],
 '53561': ['Deliberate exception (Q19, settled): the internal labour-type fix command reverses and recreates an invoice but keeps its original design, so a reversed-and-recreated invoice from that command stays in its old design rather than capturing the current setting.', Q17NOTE, Q6DEC],
 '53562': ['Cohort cutoff 2026-09-09 09:13:36 UTC (Q16).', Q17NOTE, Q6DEC],
 '53546': ['Cohort cutoff 2026-09-09 09:13:36 UTC (Q16).', Q17NOTE, Q6DEC],
 '53541': ['Deliberate exception (Q19, settled): the internal labour-type fix command reverses and recreates invoices but keeps each invoice’s original design — a stated exception to S2-R4/S4-E1, not a defect.'],
 '53524': [Q10DIALOG],
 '53525': [Q10DIALOG],
 '53532': [Q7N4NOTE],
 '53539': [Q8NOTE],
 '53551': ['Exception (Q9, settled): an approval estimate already pushed to the customer portal keeps the design it was sent in — it is a held copy (like a downloaded PDF) and is not re-rendered when the setting changes.'],
 '53566': ['Exception (Q9, settled): an approval estimate already pushed to the portal keeps the design it was sent in; the portal is not re-rendered for that held copy when the setting changes.'],
 '53543': ['A sixth customer document, the Part Sale Credit, is now included (spec header + Q21): new ones cannot be created and existing ones render Legacy (a ship-day change under the now-resolved Q6). The Section 2 body still says “all five documents”, so this case checks the five it names while the sixth is a known addition.'],
 '53552': ['Engineering confirms the same behaviour after a void as after a reversal (Q18): once the work order has no invoice, its estimate returns to following the current setting.'],
}
# behavioural-block overrides (block[0]) and title override
_LEG_BODY = ('Estimates not yet invoiced will use the Legacy design straight away. Invoices and credit '
             'invoices created from now on will use it too. Invoices and credit invoices that already exist '
             'keep the design they were created with, and the estimate for a work order or parts sale that '
             'has been invoiced matches its invoice. You can switch back at any time.')
_MOD_BODY = _LEG_BODY.replace('Legacy', 'Modern')
BLOCK0 = {
 '53570': ['1. "The legacy invoice and parts sale templates print their own Authorizer column, which carries the IBS approval code" - the Authorizer column is present on the legacy-design document and shows the IBS approval code (not the approving contact the Modern design prints).',
           '2. "The approving contact is still selected on the work order and still locked once the work order is invoiced while the organization is on Legacy" - present and locked on the work order.',
           '3. "It prints normally again as the approving contact on documents created after a switch back to Modern" - a Modern document created after switching back prints the approving contact.'],
 '53524': ['1. A confirmation dialog is shown before the change is applied.',
           '2. The dialog title reads exactly: "Switch to the Legacy design?"',
           f'3. The dialog body reads exactly: "{_LEG_BODY}"',
           '4. The dialog offers exactly two buttons, labeled exactly "Switch to Legacy" and "Cancel".'],
 '53525': ['1. A confirmation dialog is shown before the change is applied.',
           '2. The dialog title reads exactly: "Switch to the Modern design?"',
           f'3. The dialog body reads exactly: "{_MOD_BODY}"',
           '4. The dialog offers exactly two buttons, labeled exactly "Switch to Modern" and "Cancel".'],
}
TITLE = {
 '53570': 'Legacy document prints the IBS-approval-code Authorizer column; contact kept on the WO',
}

def provenance(cid):
    ids = req[cid]; key, title = story_for(cid)
    id_s = ", ".join(ids)
    REV = "Confluence page 845447188, the 2026-09-10 revision that folded the Q6 and Q8–Q12 rulings into the rules (post-Revision 5)"
    if key == 'SV-9892':
        s1 = (f"This is the expected behaviour as per epic SV-9892 (Invoice Design Selection) and the Invoice "
              f"Design Selection specification ({REV}), section {id_s}, read on 10 September 2026.")
    else:
        s1 = (f"This is the expected behaviour as per epic SV-9892 and story {key} ({title}) of the Invoice "
              f"Design Selection specification ({REV}), section {id_s}, read on 10 September 2026.")
    note = ("Note: this feature is not yet built for QA (spec Status: Draft; delivery is a hotfix building on the "
            "restored legacy templates, target version not yet created) and the setting UI is not yet designed; "
            "the route and on-screen labels here are provisional and to be finalised at build-verification.")
    if is_portal(cid):
        note += (" This case renders on the customer portal, which exists only on staging (not the QA branch); "
                 "it will carry the customer-portal staging-only HOLD at build-verification.")
    lines = ["---", s1, note]
    if wants_design(ids):
        lines.append(f"Design: Modern = the SV-8218 Design Document ({DESIGN_LINK}); Legacy = the v26.35.10 "
                     "templates restored by engineering. The specific view/frame anchors are provisional.")
    lines += NOTES.get(cid, [])
    return lines

out = {}
targets = []
for cid, c in orig.items():
    blocks = c['fields']['custom_expected']['blocks']
    beh = BLOCK0.get(cid, blocks[0])
    marker = blocks[2] if len(blocks) >= 3 else ['AUTOMATION: Not available on Build to test Yet - Last checked 9/10/2026']
    new_exp = [beh, provenance(cid), marker]
    title = TITLE.get(cid, c['title'])
    def field(bl): return {"blocks": bl, "text": "\n\n".join("\n".join(b) for b in bl)}
    out[cid] = {"title": title[:250], "fields": {
        "custom_preconds": c['fields']['custom_preconds'],
        "custom_steps": c['fields']['custom_steps'],
        "custom_expected": field(new_exp)}}
    targets.append(cid)
json.dump(out, open(f'{DIR}/intended-blocks-rev5.json','w'), ensure_ascii=False, indent=1)
json.dump(targets, open(f'{DIR}/targets-rev5.json','w'))
print(f"regenerated {len(out)} cases -> intended-blocks-rev5.json")
print("title changed:", [c for c in TITLE])
print("block0 changed:", [c for c in BLOCK0])
print("decision-note cases:", sorted(NOTES.keys()))
