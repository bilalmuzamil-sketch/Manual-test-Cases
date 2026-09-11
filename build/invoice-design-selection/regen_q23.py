#!/usr/bin/env python3
"""Regenerate the Invoice Design Selection bodies for the Q23 'live switch' model (2026-09-10 rewrite).
Baseline = intended-blocks-rev5.json. Emits intended-blocks-q23.json + targets-q23.json for the fr-view
harness, and new-cases-q23.json for the 3 cases to add. QA lead 2026-09-11: rewrite the whole suite;
keep withdrawn cases in place marked 'withdrawn - do not run'."""
import json, os
DIR = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(f'{DIR}/intended-blocks-rev5.json'))
req = {}
for line in open(f'{DIR}/testrail-id-map.csv'):
    p = line.rstrip('\n').split('\t')
    if len(p) >= 3: req[p[1]] = p[2].split(',')

DESIGN = "https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354"
NOTBUILT = "AUTOMATION: Not available on Build to test Yet - Last checked 9/11/2026"
WITHDRAWN_MARK = ("AUTOMATION: HOLD - withdrawn by spec Q23 (live-switch rewrite, 2026-09-10); the behaviour "
                  "this case tested is no longer in the spec - do not run")
RENDER_PREFIXES = ('S2', 'S3', 'S5'); RENDER_FO = {'FO-4','FO-5','FO-6','FO-7','FO-8','FO-9'}
STORY_KEY = {'S1':'SV-9893','S5':'SV-9897'}  # unambiguous story tickets; S2/S3 cite the spec section only

def story_key(cid):
    for r in req.get(cid,[]):
        pre=r.split('-')[0]
        if pre in STORY_KEY: return STORY_KEY[pre]
    if any(r in ('FO-1','FO-2','FO-3','FO-9') for r in req.get(cid,[])): return 'SV-9893'
    if 'FO-7' in req.get(cid,[]) or 'FO-8' in req.get(cid,[]): return 'SV-9897'
    return None

def wants_design(cid):
    ids=req.get(cid,[])
    return any(r.split('-')[0] in RENDER_PREFIXES for r in ids) or any(r in RENDER_FO for r in ids)

def is_portal(cid):
    blk = base.get(cid,{}).get('fields',{}).get('custom_expected',{}).get('blocks',[None,[]])[1] or []
    return any('customer portal' in l for l in blk)

def provenance(cid):
    ids=", ".join(req.get(cid,[]))
    key=story_key(cid)
    who = f"epic SV-9892 and story {key}" if key else "epic SV-9892"
    s1=(f"This is the expected behaviour as per {who} of the Invoice Design Selection specification "
        f"(Confluence page 845447188, the 2026-09-10 'Q23 live-switch' revision — the setting is a live "
        f"organization-wide switch; no document captures or is pinned to a design), section {ids}, read on "
        f"11 September 2026.")
    note=("Note: this feature is not yet available on a QA build (spec Status: Draft; delivery is a v26.36.x "
          "hotfix, QA build underway per the change log) and the setting UI is not yet designed; the route "
          "and on-screen labels here are provisional and to be finalised at build-verification.")
    if is_portal(cid):
        note+=(" This case renders on the customer portal, which exists only on staging (not the QA branch); "
               "it carries the customer-portal staging-only HOLD at build-verification.")
    lines=["---", s1, note]
    if wants_design(cid):
        lines.append(f"Design: Modern = the SV-8218 Design Document ({DESIGN}); Legacy = the v26.35.10 "
                     "templates restored by engineering, with the wrong-figure defects fixed producer-side "
                     "and the layout-fidelity items kept (Q7). Anchors provisional.")
    return lines

# ---- WITHDRAWN (kept in place, marked do-not-run) ----
WITHDRAWN = {'53546','53548','53552','53554','53555','53556','53557','53558','53559','53560','53561','53562'}
WITHDRAWN_REASON = {
 '53546':'Story 4 / FO-8 (a pre-refresh invoice reprints in Legacy) was withdrawn. Under Q23 a document’s creation date has no bearing on its design; a pre-refresh invoice renders in the current setting (see C53553 and Story 2, S2-R3).',
 '53548':'The rule that an invoiced work order’s estimate matches its invoice’s captured design was withdrawn. Under Q23 both the estimate and the invoice render in the current setting (Story 3, S3-R2).',
 '53552':'The rule that reversing an invoice returns its estimate to the setting was withdrawn as a special case. Under Q23 an estimate always renders in the current setting regardless (Story 3).',
 '53554':'Story 4 (back-catalogue pinning by creation date) was withdrawn in full; the migration was reverted. A pre-2026-09-09 invoice now renders in the current setting (Story 2, S2-R3).',
 '53555':'Story 4 withdrawn: the between-releases “Modern cohort” no longer exists; that invoice renders in the current setting.',
 '53556':'Story 4 withdrawn: there are no fixed cohorts; every document follows the current setting.',
 '53557':'Story 4 withdrawn: a pre-refresh invoice does not pin to Legacy; it follows the current setting on every surface.',
 '53558':'Story 4 withdrawn: back-catalogue pinning was reverted, so there is nothing to reprint as Legacy by date.',
 '53559':'Story 4 withdrawn: switching to Legacy DOES re-render the whole back catalogue in Legacy (the opposite of this case). See Story 2, S2-R6.',
 '53560':'Story 4 withdrawn: switching to Modern DOES re-render the whole back catalogue in Modern (the opposite of this case). See Story 2, S2-R6.',
 '53561':'Story 4 withdrawn: there is no pre-refresh cohort to leave; a reversed/recreated invoice renders in the current setting like everything else.',
 '53562':'Story 4 withdrawn: there is no Modern cohort; an invoice created after the setting ships renders in the current setting.',
}

# ---- explicit new behavioural blocks (block[0]) for reword/rewrite cases ----
LEG_DLG=('Every estimate, invoice and credit invoice will use the Legacy design straight away, including '
         'documents your shop has already sent. Reprints and portal copies of older documents change too. '
         'You can switch back at any time.')
MOD_DLG=LEG_DLG.replace('Legacy','Modern')
BLOCK0 = {
 '53520':['1. The explanatory text below the setting reads exactly: "Every estimate, invoice and credit invoice your shop shows, prints or sends uses the selected design, including documents created before you changed it."',
          '2. The text is shown as static helper text (always present, not a toast or a dialog).'],
 '53524':['1. A confirmation dialog is shown before the change is applied.',
          '2. The dialog title reads exactly: "Switch to the Legacy design?"',
          f'3. The dialog body reads exactly: "{LEG_DLG}"',
          '4. The dialog offers exactly two buttons, labeled exactly "Switch to Legacy" and "Cancel".'],
 '53525':['1. A confirmation dialog is shown before the change is applied.',
          '2. The dialog title reads exactly: "Switch to the Modern design?"',
          f'3. The dialog body reads exactly: "{MOD_DLG}"',
          '4. The dialog offers exactly two buttons, labeled exactly "Switch to Modern" and "Cancel".'],
 '53531':['1. Changing the Invoice Design setting does not alter the stored record of any existing document: its content, its line items and its totals are untouched.',
          '2. What changes is the document’s appearance on its next render, which follows the newly selected design (S2-R1).',
          '3. No document is migrated, restamped or re-issued when the setting changes.'],
 '53532':['1. Changing the Invoice Design setting does not change any other setting on the invoice settings page.',
          '2. The other settings keep their values and continue to apply to whichever design is selected.'],
 '53534':['1. A Work Order Invoice renders in the organization’s current Invoice Design selection whenever it is shown, printed or sent — whatever design was in force when it was created.',
          '2. Nothing about a design is stored on the invoice; the current setting is the only input (S2-R1, S2-R3, S2-R4).',
          '3. Switching the setting and re-opening the invoice shows it in the new selection.'],
 '53535':['1. A Parts Sale Invoice renders in the organization’s current Invoice Design selection whenever it is shown, printed or sent, whatever design was in force when it was created.',
          '2. Nothing about a design is stored on it; the current setting is the only input (S2-R1, S2-R2).'],
 '53536':['1. A Credit Invoice renders in the current Invoice Design selection, exactly like every other document.',
          '2. It does not follow the design of an invoice it credits, and it stores no design of its own (S2-R1, S2-R2).'],
 '53537':['1. A Credit Invoice raised against several invoices at once renders in the current setting.',
          '2. There is no single source invoice whose design it could follow; the current setting is the only input.'],
 '53538':['1. A Credit Invoice raised with no originating invoice renders in the current setting.',
          '2. It stores no design of its own (S2-R1).'],
 '53539':['1. An invoice renders in the current Invoice Design selection at every point in its life — unpaid, partially paid, fully paid, reversed or voided.',
          '2. The design is decided on each render from the current setting, not stored on the document (S2-R1).'],
 '53540':['1. A fully paid invoice — the customer’s receipt — renders in the current Invoice Design selection, including its payments and its $0.00 balance.',
          '2. Its design follows the current setting, not anything stored at creation (S2-R1).'],
 '53541':['1. An invoice that is reversed and then recreated renders in the current Invoice Design selection, like every other document.',
          '2. A maintenance re-invoicing behaves the same way. Neither carries a design of its own (S2-E2).'],
 '53542':['1. There is no way to choose a design for one individual document; the only control is the organization-wide Invoice Design setting.',
          '2. There is no per-document override (S2-N2).'],
 '53543':['1. The Invoice Design setting governs all six customer documents: the Estimate, the Work Order Invoice, the Credit Invoice, the Parts Sale Estimate, the Parts Sale Invoice and the Part Sale Credit (of which no new ones can be created).',
          '2. Each of the six renders in the current setting; none carries a design of its own.'],
 '53544':['1. An estimate renders in the current Invoice Design selection whenever it is viewed, printed, sent or downloaded.',
          '2. This holds whether or not its work order has been invoiced — an estimate always follows the current setting (S3-R1).'],
 '53545':['1. An invoice renders in the current Invoice Design selection on the in-app preview, an in-app print or PDF, and an emailed PDF.',
          '2. The design is the current setting at the moment of each render; nothing is stored on the invoice.'],
 '53549':['1. When the Invoice Design setting changes, every estimate renders in the new selection on its next view — including estimates created long before the change.',
          '2. No estimate is limited to newly created ones; the next render follows the current setting (S2-R5).'],
 '53551':['1. An estimate re-sent after the setting changed reaches the customer in the newly selected design.',
          '2. A copy already downloaded, emailed, or pushed to the customer portal is a held copy and keeps the design it was sent in; a switch does not re-push it (S3-E1, Q9).'],
 '53553':['1. An estimate for a work order created before the refresh renders in the current Invoice Design selection.',
          '2. Its creation date has no bearing on its design (S2-R3).'],
 '53563':['1. The in-app document preview renders the current Invoice Design selection.'],
 '53564':['1. An in-app print or a PDF generated from the shop app renders the current Invoice Design selection.'],
 '53565':['1. A PDF emailed to a customer renders the current Invoice Design selection at the moment it is generated.'],
 '53566':['1. The customer portal renders the current Invoice Design selection, both on screen and in any PDF the portal generates.',
          '2. One exception: an approval estimate already pushed to the portal keeps the design it was sent in (S5-R4, Q9).'],
 '53567':['1. The paid banner continues to appear only on portal-generated Invoice PDFs, exactly as it does today.',
          '2. It appears in the current Invoice Design selection (S5-R5).'],
 '53571':['1. An organization’s document list is always in a single design — the current Invoice Design selection.',
          '2. There is no mix of designs in the list, because no document carries a design of its own (S5-E2).'],
}
TITLE = {
 '53544':'Estimate always renders in the current Invoice Design selection',
 '53545':'Invoice renders the current design on preview, print PDF, and emailed PDF',
 '53534':'Work Order Invoice renders the current Invoice Design selection',
 '53535':'Parts Sale Invoice renders the current Invoice Design selection',
 '53536':'Credit Invoice renders the current design, not the credited invoice’s',
 '53539':'Invoice renders the current Invoice Design selection through every lifecycle state',
 '53540':'Fully paid invoice receipt renders the current design with payments and $0.00',
 '53541':'Reversed/recreated invoice and maintenance re-invoicing render the current setting',
 '53542':'There is no per-document design override',
 '53543':'Invoice Design selection governs all six customer documents',
 '53549':'Changing the setting re-renders every estimate on next view',
 '53553':'Pre-refresh estimate renders the current setting (creation date has no bearing)',
 '53563':'In-app preview renders the current Invoice Design selection',
 '53564':'In-app print/PDF renders the current Invoice Design selection',
 '53565':'Emailed PDF renders the current Invoice Design selection',
 '53566':'Customer portal on-screen and PDF render the current setting',
 '53571':'A document list is always one design — no mix',
}

def field(blocks): return {"blocks":blocks,"text":"\n\n".join("\n".join(b) for b in blocks)}
out={}; targets=[]
for cid,c in base.items():
    if cid in WITHDRAWN:
        title="[WITHDRAWN - do not run] "+c['title']
        beh=[f'This case is WITHDRAWN and must NOT be run. {WITHDRAWN_REASON[cid]}',
             'It is kept in place (not deleted) for history; it has been removed from the active test run.']
        exp=[beh,["---",
             ("Withdrawn by the Invoice Design Selection specification (Confluence page 845447188), rule "
              "change Q23 of 2026-09-10 (the setting became a live organization-wide switch; nothing is "
              "captured or pinned). Recorded 11 September 2026."),
             "See build/invoice-design-selection/source-verify-2026-09-11/RECONCILE-Q23-live-switch.md."],
             [WITHDRAWN_MARK]]
        out[cid]={"title":title[:250],"fields":{
            "custom_preconds":c['fields']['custom_preconds'],
            "custom_steps":c['fields']['custom_steps'],
            "custom_expected":field(exp)}}
        targets.append(cid); continue
    beh = BLOCK0.get(cid, c['fields']['custom_expected']['blocks'][0])
    title = TITLE.get(cid, c['title'])
    exp=[beh, provenance(cid), [NOTBUILT]]
    out[cid]={"title":title[:250],"fields":{
        "custom_preconds":c['fields']['custom_preconds'],
        "custom_steps":c['fields']['custom_steps'],
        "custom_expected":field(exp)}}
    targets.append(cid)

json.dump(out, open(f'{DIR}/intended-blocks-q23.json','w'), ensure_ascii=False, indent=1)
json.dump(targets, open(f'{DIR}/targets-q23.json','w'))
print(f"regen {len(out)} cases -> intended-blocks-q23.json  (withdrawn={len(WITHDRAWN)}, reworded/rewritten={len(BLOCK0)}, retitled={len(TITLE)})")
