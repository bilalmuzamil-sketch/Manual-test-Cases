# -*- coding: utf-8 -*-
"""Execute the 46 staged Chris-answer edits, WITH the corrections the research pass found.
Authorised: QA lead 2026-08-05 "We should do what is right to do..."
"""
import json, sys
import tr

STAGED = json.load(open('/home/user/Manual-test-Cases/build/report-suite/chris-answers-2026-08-05/staged-operations.json'))
LINK = ("https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/"
        "edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true")
FOLLOWUP = ("https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/"
            "claude/slack-session-0sxnd9/build/report-suite/rulings-2026-08-05/"
            "Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx")
HOLD = ("DO NOT AUTOMATE YET: part of this behaviour is still waiting on an answer from the product owner. "
        "Automating it now could lock in the wrong behaviour.\n"
        "The open question is in: Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx — " + FOLLOWUP)

# 11 genuinely blocked by Chris's self-contradiction (rulings-2026-08-05/LOCATION-CONTRADICTION.md Group 1)
BLOCKED = {30467, 30554, 30352, 30551, 38912, 38913, 38914, 38915, 38916, 38917, 30437}

# --- CORRECTION 1: the WIP identifier cases. "plate" appears 0 times in WIP spec v6 (verified live). ---
WIP_PROV = (
 "This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per "
 "the Work In Progress report specification version 6 ({anch}) - the build and that specification agree. "
 "Chris Ward confirmed it again on 8/5/2026 in his answers in this file: " + LINK + ". It differs from an "
 "earlier answer he gave us on 29 July 2026, which we now know was given against a question that described "
 "this report incorrectly; we follow his latest word, which agrees with the specification.")

FIX_ITEMS = {
 30470: """1. The Asset cell is a two-line cell: the Unit # on the first line in bold, with the VIN underneath in a smaller, muted style.
2. When the work order has no Unit #, the first line reads "(no unit #)"; when it has no VIN, the second line reads "— no VIN —". Nothing else stands in for a missing value - there is no further fallback.
3. The product owner has confirmed this two-line layout is correct for this report and is already built, so the unit number leading is the expected result - do not raise it.
4. The VIN column (off by default) shows the VIN on its own line as a separate, sortable column.
5. Note for the tester: the field is labelled VIN. For assets that are not vehicles (for example a generator), this is the unit's serial number.""",
 30485: """1. Money and numeric columns sort by their underlying numeric value (so $1,100.00 is treated as more than $900.00, not compared as text).
2. Days Open sorts by its day count.
3. Status sorts by its displayed label.
4. The Asset column sorts by the Unit #.
5. WO #, Customer, Asset, VIN, Location, and Advisor sort as text.""",
 30500: """1. With no asset selected, the filter reads "All assets" and every job is shown.
2. Each option shows both the asset's Unit # and its VIN.
3. Text you type matches against either the Unit # or the VIN - a match on either one brings the asset up.
4. Selecting assets narrows the visible jobs on screen only (no reload); a single "Clear" action appears once at least one asset is selected and returns the filter to "All assets".
5. Note for the tester: the field is labelled VIN. For assets that are not vehicles (for example a generator), this is the unit's serial number.""",
}
FIX_PROV = {
 30470: WIP_PROV.format(anch="S4-R7, S4-R8, S4-R10"),
 30485: WIP_PROV.format(anch="S4-R9, S4-R27"),
 30500: WIP_PROV.format(anch="S7-R4, S7-R5"),
 30516: WIP_PROV.format(anch="S9-E1"),
}

# --- CORRECTION 2: WIP-COL-01 precondition 4 (wrong under BOTH readings) ---
PRECOND_FIX = {
 30466: ("1. You are signed in to the ShopView App on a desktop browser.\n"
         "2. The Work In Progress report is open with rows loaded.\n"
         "3. Every toggleable column is turned on in the column-selection control.\n"
         "4. More than one location is selected, so the Location column is showing. If it is switched off, "
         "turn it back on in the column-selection control."),
}

# --- CORRECTION 3: an EIGHTH live-and-wrong case the manifest misses ---
EXTRA = {
 30352: dict(
  iid='PV-COL-02', item='T1-1', kind='basis-against',
  items="""1. With a single location in scope exactly these 14 columns show, in this left-to-right order: Type, Part #, Description, Category, Vendor, Units Sold, Unit Cost, Sell Price, Revenue, Margin, Margin %, Demand, Last Sale, On Hand.
2. The other 6 columns start hidden: Units Returned, Sold (WO), Sold (Parts Sale), Turns / Yr, Min, Max.
3. When more than one location is selected the Location column shows as well, leftmost before Type — 15 columns. It is already switched on for you; you do not have to turn it on, and you can switch it off again. It is not part of the 14-column default set, so its presence is expected and is not a failure of this test.""",
  prov=("This is the expected behaviour as per the Parts Velocity report specification version 4 (S4-R2, S4-R3, "
        "S3-R10) for the 14 default columns and the 6 hidden ones. The part about the Location column follows "
        "Chris Ward's decision of 8/5/2026, recorded in his answers in this file: " + LINK + "; his decision "
        "differs from what this case said before, which stated the Location column is not in the column "
        "picker, and we have taken his later decision as the one that prevails.")),
}

def build(items, prov, held):
    """Canonical shape: body, then the --- separator, then any hold block, then the provenance line.
    The manifest is inconsistent about the separator (7 of 46 keep it, 39 drop it) while all 469
    live cases carry it, so it is restored here rather than silently lost (Standing Rule 16)."""
    body = items.rstrip()
    if "\n---\n" not in body and not body.endswith("---"):
        body += "\n---"
    joiner = "\n" if body.endswith("---") else "\n\n"
    out = body + joiner
    if held:
        out += HOLD + "\n\n"
    return out + prov.rstrip('\n')

def main():
    log = []
    plan = []
    for o in STAGED:
        cid = o['cid']
        prov = FIX_PROV.get(cid, o['new_prov'])
        if cid in FIX_ITEMS:
            items = FIX_ITEMS[cid]
        else:
            a = o['after_expected']
            i = a.find(o['new_prov'])
            assert i > 0, f"C{cid}: provenance not found in after_expected"
            items = a[:i].rstrip('\n')
        payload = {"custom_expected": build(items, prov, cid in BLOCKED)}
        if o.get('new_title'):
            payload['title'] = o['new_title']
        if cid in PRECOND_FIX:
            payload['custom_preconds'] = PRECOND_FIX[cid]
        plan.append((cid, o['iid'], payload, o['kind'], o['item']))
    for cid, spec in EXTRA.items():
        payload = {"custom_expected": build(spec['items'], spec['prov'], cid in BLOCKED)}
        plan.append((cid, spec['iid'], payload, spec['kind'], spec['item']))

    # sanity gates BEFORE any write
    assert 30525 not in [p[0] for p in plan], "C30525 must never be written"
    for cid, iid, payload, _, _ in plan:
        e = payload['custom_expected']
        if cid != 30134:   # SBC-LBL-01: plate IS ratified spec text there (SBC v13 S8-R9)
            assert 'plate' not in e.lower(), f"C{cid} still mentions a plate"
        assert '\n---\n' in e, f"C{cid} separator missing"
        assert ('DO NOT AUTOMATE' in e) == (cid in BLOCKED), f"C{cid} hold-line state wrong"
        if 'title' in payload:
            assert len(payload['title']) <= 80, f"C{cid} title too long"
    print(f"PLAN OK: {len(plan)} operations, {len(BLOCKED)} of them held. C30525 absent.")

    for n, (cid, iid, payload, kind, item) in enumerate(plan, 1):
        try:
            st, line, before, after = tr.update_case_verified(cid, payload, f"op{n:02d} update_case")
        except Exception as ex:
            print(f"\n*** BATCH STOPPED at op {n} C{cid} ***\n{ex}")
            json.dump(log, open('/tmp/testrail/exec46-log.json','w'), indent=1)
            sys.exit(2)
        log.append({"op": n, "cid": cid, "iid": iid, "kind": kind, "item": item,
                    "http": st, "verify": line, "intended": sorted(payload),
                    "held": cid in BLOCKED,
                    "reverified": "re-verified whole against the live specification fetched 2026-08-05 "
                                  "and Chris Ward's answers of 2026-08-05"})
        print(f"op{n:02d} C{cid} {iid:14} HTTP {st} | {line}")
    json.dump(log, open('/tmp/testrail/exec46-log.json','w'), indent=1)
    print(f"\nDONE: {len(log)} operations, all HTTP 200 + byte-verified.")

if __name__ == '__main__':
    main()
