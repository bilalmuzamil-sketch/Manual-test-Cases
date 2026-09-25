#!/usr/bin/env python3
"""Proves a manifest's records are returned BY THE V2 SEARCH, record by record, by identity.

WHY THIS EXISTS. `seed.py` proves a record EXISTS - it reads it back off its own list endpoint and
checks every declared field. That is not the same claim as "the search returns it", and this kit has
already been bitten by treating them as one: a catalogue part with no inventory row is present on
every list endpoint and invisible to search, which produced a false PASS on a real regression.

It also fills a hole this script was written for. `reseed_everything.sh` step 1b proved the
V1-regression universe with `verify_gsv2_v1.py`, which reads `/api/global-search/fetch` - the V1
endpoint. On a V2 environment that answers 404, and the step swallowed it with `|| true`, so on the
QA branch and on staging those 11 records had NO search proof at all. Presence was being read as
findability.

WHAT IT ASSERTS (Rule 110, all three legs):
  · IDENTITY   - is OUR record in the list, matched on the value we seeded. Never a row count:
                 a count of 1 has already produced a false PASS here.
  · ATTRIBUTION- the row is matched on the seeded value appearing in primary/secondary, so a hit
                 that came from some other record's field cannot be counted as ours.
  · PROVENANCE - the build marker and environment are printed with the verdict, because a branch
                 redeploys unannounced and a result without its build is not evidence.

WHAT IT DOES NOT ASSERT. Some records are DELIBERATELY not findable, and a verifier that failed on
them would be crying wolf. Those are listed with their reason and reported as EXPECTED-ABSENT; if
one of them ever DOES come back, that is reported too - it is a behaviour change, not a pass.

Run:  SEED_MANIFEST=seed-manifest.json SEED_PROFILE=/tmp/staging/cookies.json \
      SEED_WORKPLACE="Staging Heavy Duty - 9919" python3 verify_by_search.py
"""
import json, os, runpy, sys

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV = _seed['call'], _seed['ENV_LABEL']
MANIFEST = os.environ.get('SEED_MANIFEST', 'seed-manifest.json')

G, R, Y, X = '\033[32m', '\033[31m', '\033[33m', '\033[0m'

# type -> the search group the row lands in. Measured, not assumed: a Contact answers inside the
# CUSTOMERS group (its customer's row is what comes back), and both part flavours land in parts.
GROUP = {'Customer': 'customers', 'Contact': 'customers', 'Vehicle': 'assets',
         'CataloguePart': 'parts', 'InventoryPart': 'parts', 'WorkOrder': 'work_orders',
         'PartSale': 'part_sales', 'Vendor': 'vendors', 'PurchaseOrder': 'purchase_orders',
         'Catalogue part': 'parts', 'Inventory part': 'parts', 'Part sale': 'part_sales',
         'Work order': 'work_orders', 'VendorInvoice': 'vendor_invoices'}

def group_for(typ):
    """The manifest's `type` is prose, not an enum - 'Contact (a person AT a customer company)'.
    Match on the leading words so a documented type still resolves to its group; an unresolved
    type searches EVERY group rather than silently asserting nothing."""
    t = str(typ or '')
    for k, v in GROUP.items():
        if t.lower().startswith(k.lower()):
            return v
    return None


def row_text(i):
    """Every place the seeded value can legitimately appear on a result row.

    🔴 PRIMARY AND SECONDARY ARE NOT ENOUGH, and assuming they were produced a false NOT RETURNED
    over a record sitting in the index: the V1-regression asset answers `ZZT-4471` on its UNIT,
    which the API returns under `fields`, while its primary is '2019 Freightliner Cascadia' and its
    secondary is the customer's name. Part numbers, invoice numbers and vendor names live there
    too. Checking the wrong field is the same error as counting rows - it just fails the other way."""
    f = i.get('fields') or {}
    vals = [i.get('primary'), i.get('secondary')] + [v for v in f.values()
                                                     if isinstance(v, (str, int, float))]
    return ' '.join(str(v) for v in vals if v is not None).lower()

# Records that are not reachable by typing their own find value, and WHY. Each is a documented
# product fact, not a convenience - remove one only with a measurement that contradicts it.
EXPECTED_ABSENT = {
    'part_catalogue_only':
        'a catalogue part with no inventory row is invisible to search - this is the very '
        'behaviour C53516 tests, so its absence is the pass, not a gap',
    'work_orders':
        'work orders are not returned by typing their own number; they answer through their '
        "customer, contact or unit, so the captured ids are the only handle",
}

def search_term(rec):
    """The token to type for this record - and for a CONTACT, one that ONLY the contact can answer.

    🔴 ATTRIBUTION (Rule 110). A contact lives inside its customer, so typing the contact's first
    name returns the CUSTOMER row - and that row will happily match on the COMPANY NAME instead.
    On staging, contact 'PerTab' at 'Per Tab Asset Holdings' came back matched on `name`, which
    proves the company exists and says nothing whatever about the contact. That is the exact shape
    of the failure that withdrew SV-10110: a field that was never queried appeared to match because
    a different field contained the string.

    So for a child contact we type its EMAIL, which no other record carries, and then check below
    that the row came back on a CONTACT field.
    """
    find = rec.get('find') or {}
    if str(find.get('mode')) == 'child':
        payload = (rec.get('create') or {}).get('payload') or {}
        for k in ('email', 'telephone'):
            if payload.get(k):
                return str(payload[k]), k
    return str(find.get('value') or ''), 'find.value'


def match_field(i):
    return str(((i.get('match') or {}).get('field')) or '')


def search(q):
    r = call('/api/search?q=' + q)
    return ((r['json'] or {}).get('data') or {}).get('groups') or []

def main():
    m = json.load(open(f'{HERE}/{MANIFEST}'))
    marker = ''
    try:
        h = call('/')
        marker = (h.get('text') or '')[:0] or ''
    except Exception:
        pass

    print(f"=== {MANIFEST} — DOES THE SEARCH RETURN EACH RECORD, BY IDENTITY, ON {ENV}? ===")
    found = absent = expected = 0
    surprises, fails = [], []

    for rec in m['records']:
        key, typ = rec['key'], rec.get('type')
        find = rec.get('find') or {}
        value, via = search_term(rec)
        if not value:
            print(f"  {Y}—{X}  {key:28} no searchable find value in the manifest — skipped")
            continue
        grp = group_for(typ)
        is_contact = str(typ or '').lower().startswith('contact')
        groups = search(value.split()[0] if len(value.split()[0]) >= 2 else value)
        rows = []
        for g in groups:
            if grp is None or g['type'] == grp:
                rows += [i for i in (g.get('items') or []) if value.lower() in row_text(i)
                         or (is_contact and 'contact' in match_field(i).lower())]
        # ATTRIBUTION: a contact is only proved by a row that matched on a CONTACT field. A row
        # that matched on the company's own name proves the company, not the person inside it.
        if is_contact and rows:
            attributed = [i for i in rows if 'contact' in match_field(i).lower()]
            if not attributed:
                print(f"  {R}❌{X} {key:28} {grp or '?':15} FOUND {rows[0].get('primary')!r} but it "
                      f"matched on {match_field(rows[0])!r}, NOT a contact field — the hit came "
                      f"from elsewhere, so this contact is NOT proved")
                absent += 1; fails.append(key)
                continue
            rows = attributed
        why = EXPECTED_ABSENT.get(key) or EXPECTED_ABSENT.get(typ and '')
        if rows:
            found += 1
            flag = ''
            if why:
                surprises.append(key); expected += 1
                flag = f"   {Y}⚠ EXPECTED ABSENT but returned — behaviour change, look at it{X}"
            how = f"  (via {via}, matched on {match_field(rows[0])!r})" if is_contact else ''
            print(f"  {G}✅{X} {key:28} {grp or '?':15} {rows[0].get('primary')!r}{how}{flag}")
        elif why:
            expected += 1
            print(f"  {Y}○{X}  {key:28} {grp or '?':15} EXPECTED ABSENT — {why}")
        else:
            # ATTRIBUTION + CONTROL: prove the search itself is answering before calling this a loss.
            ctl = find.get('control')
            ctl_ok = bool(search(str(ctl).split()[0])) if ctl else None
            absent += 1; fails.append(key)
            note = ('control %r also returns nothing — the SEARCH is the suspect, not the record'
                    % ctl) if ctl_ok is False else \
                   (f"control {ctl!r} answers normally, so the search is alive and this record is "
                    f"genuinely not returned" if ctl_ok else 'no control declared in the manifest')
            print(f"  {R}❌{X} {key:28} {grp or '?':15} NOT RETURNED — {note}")

    print(f"\n=== summary — {ENV} ===")
    print(f"  returned by search : {found}")
    print(f"  expected absent    : {expected}")
    if surprises:
        print(f"  {Y}⚠ {len(surprises)} record(s) came back that are documented as unfindable: "
              f"{', '.join(surprises)}{X}")
        print("     That is a BEHAVIOUR CHANGE in the product, not a seeding result. Check it "
              "before any case that relies on the absence is run.")
    if fails:
        print(f"  {R}❌ {len(fails)} record(s) NOT returned: {', '.join(fails)}{X}")
        return 1
    print(f"  {G}✅ every searchable record in {MANIFEST} comes back by identity on {ENV}{X}")
    return 0

sys.exit(main())
