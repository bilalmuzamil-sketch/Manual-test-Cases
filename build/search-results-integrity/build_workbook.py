#!/usr/bin/env python3
"""Builds the manual-QA workbook from the SAME table the case files come from, plus the verified
search terms discovered on the live environment.

One source of truth: `build_cases.py` holds the entity/field data and the quoted sentences, and
`discovered-terms.json` holds terms that were PROVEN to match the intended field. Nothing is typed
twice, so the workbook and the markdown cases cannot drift apart.

Written for a manual tester who has never read the spec: every row says what to type, what to do,
and what should happen, in plain words. The quoted requirement is there too, in its own column, so
a tester who wants to check the wording never has to leave the sheet.
"""
import json, os, importlib.util
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

# 🔴 ONE TERMS FILE PER ENVIRONMENT. A work-order number, a part-sale number and a staff name are
# all BRANCH-ASSIGNED or environment data (Rule 111), so a term proven on staging is not a term on
# production - P2-2276 there is P2-75 here. A single shared discovered-terms.json meant whichever
# environment ran last silently decided what 111 cases tell a tester to type. Keyed by the profile,
# exactly as the seeder keys its ids and state.
def _terms_file(here):
    import os
    prof = os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')
    env = 'qa' if prof == '/tmp/qa/cookies.json' else os.path.basename(os.path.dirname(prof))
    return os.path.join(here, f'discovered-terms-{env}.json')



HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('bc', os.path.join(HERE, 'build_cases.py'))
bc = importlib.util.module_from_spec(spec); spec.loader.exec_module(bc)
D = json.load(open(_terms_file(HERE)))
FOUND, PAIRS = D['found'], D['pairs']

ENV = "https://app.staging.shopview.com   ·   workplace: Staging Heavy Duty - 9919"
FONT = 'Arial'

# Which discovered term proves each Class C field. Keyed (entity key, the field label used in
# build_cases.ENTITIES). A None means nothing on this environment matched that field - the row
# then says so plainly rather than inventing a term.
TERMS = {
 ('work_orders', 'VIN / serial number'): 'assets.vin',
 ('work_orders', 'line item descriptions (parts and labor on the WO)'): ('pair', 'work_orders.item_part_names'),
 ('work_orders', "part numbers on the work order's lines (`item_part_numbers`)"): ('pair', 'work_orders.item_part_numbers'),
 ('customers', "the customer's own telephone"): 'customers.phone',
 ('customers', "a contact's telephone"): 'customers.contact_phones',
 ('customers', "a contact's email address"): 'customers.contact_emails',
 ('customers', "a contact's name"): 'customers.contact_names',
 ('customers', 'address line 2'): 'customers.address_line_2',
 ('customers', 'city'): 'customers.city',
 ('customers', 'postal code'): 'customers.postal_code',
 ('assets', 'VIN / serial number'): 'assets.vin',
 ('assets', 'licence plate'): 'assets.licence_plate',
 ('parts', 'bin location'): 'parts.bin_location',
 ('parts', 'manufacturer'): 'parts.manufacturer',
 ('parts', 'category'): 'parts.category',
 ('parts', 'tags'): ('pair', 'parts.tags'),
 ('vendors', "a contact's telephone"): ('pair', 'vendors.contact_phones'),
 ('purchase_orders', 'part numbers on the PO'): ('pair', 'purchase_orders.item_part_numbers'),
 ('purchase_orders', 'part descriptions on the PO'): ('pair', 'purchase_orders.item_part_names'),
 ('parts', 'vendor name'): 'parts.vendor_name',
 ('vendor_invoices', 'the PO number the invoice belongs to'): 'vendor_invoices.po_number',
 # unlocked by the result-integrity seed universe, 2026-09-29
 ('vendors', 'email address'): 'vendors.email',
 ('vendors', 'address line 2'): 'vendors.address_line_2',
 ('customers', 'state / province'): 'customers.state',
 ('part_sales', 'the asset on the sale'): 'part_sales.asset',
 ('part_sales', 'VIN / serial number'): 'part_sales.vin',
 ('vendors', "a contact's name"): 'vendors.contact_names',
 ('vendors', "a contact's email address"): 'vendors.contact_emails',
 ('purchase_orders', 'created-by user'): 'purchase_orders.created_by',
 ('purchase_orders', 'spliced number variants (`number_variants`)'): 'purchase_orders.number_variants',
 # unlocked 2026-09-29 by assigning a staff member whose surname matched NOTHING beforehand,
 # so any hit is attributable to the assignment (Rule 110). The surname is in neither the
 # primary nor the secondary text, which is exactly the condition these two cases test.
 ('work_orders', 'lead technician name'): 'work_orders.lead_technician_name',
 ('work_orders', 'service advisor name'): 'work_orders.service_advisor_name',
}
# A near-miss spelling PROVEN to come back drawn as a soft match, for each tab's Class I row.
# The four identifier-led tabs are deliberately left blank: their only fuzzy-able fields are the
# customer's or vendor's name, and no run has PROVEN a soft-matched row appears in those groups.
# Writing an unproven term in would be guessing, which is what this pass exists to stop.
FUZZY_FOR_TAB = {'parts': 'fuzzy.parts', 'vendors': 'fuzzy.vendors',
                 'assets': 'fuzzy.assets', 'customers': 'fuzzy.customers',
                 # The four identifier-led tabs were blank because no soft-matched row had
                 # been PROVEN to appear in their groups. The ZZSOFTHIT / ZZSOFTHIY pair
                 # seeded on 2026-09-29 proves it: each of these groups returns a row with
                 # kind=fuzzy, matched on the customer's or vendor's name.
                 'work_orders': 'soft.work_orders', 'part_sales': 'soft.part_sales',
                 'purchase_orders': 'soft.purchase_orders',
                 'vendor_invoices': 'soft.vendor_invoices'}

# The shared-fragment example for each tab's Class A and Class B cases.
# 🔴 THE TWIN PAIR IS NOW THE EXAMPLE FOR EVERY TAB. It was seeded for this suite on 2026-09-29:
# two records per entity carrying a LONG name whose only difference is the trailing six digits
# (…123786 / …185786), which is the QA lead's own statement of the defect. If the row truncates,
# the two are indistinguishable and the case proves itself. Part Sales had NO usable data at all
# before this - nine of its rows could not be run.
PAIR_FOR_TAB = {
 'work_orders': 'twin.work_orders', 'customers': 'twin.customers',
 'assets': 'twin.assets', 'parts': 'twin.parts',
 'vendors': 'twin.vendors', 'purchase_orders': 'same.purchase_orders',
 'vendor_invoices': 'same.vendor_invoices', 'part_sales': 'twin.part_sales',
}
# The "two rows with an IDENTICAL bold line" example, per tab. Customers is deliberately absent:
# the product refuses to create two customers with the same name (400 "Company with provided name
# already exists."), so that case cannot exist there and the row says so instead of asking a tester
# to find data that cannot be made.
SAME_FOR_TAB = {
 # Customers earns an entry again: the same-name CONTACT pair (ZZSAMEREP) gives this tab a real
 # identical-line case, which the product's ban on duplicate customer NAMES had seemed to rule out.
 'customers': 'same.customers',
 'vendors': 'same.vendors', 'parts': 'same.parts', 'assets': 'same.assets',
 'part_sales': 'twin.part_sales', 'purchase_orders': 'same.purchase_orders',
 'vendor_invoices': 'same.vendor_invoices', 'work_orders': 'twin.work_orders',
}
# 🔴 CORRECTED 2026-09-29 by the QA lead. The product refuses a second CUSTOMER with the same name,
# so this looked impossible on the Customers tab — but CONTACTS have no such rule, and a contact
# match returns the COMPANY row. Two different customers can each hold a contact with the SAME name,
# and the two rows then carry an IDENTICAL explanatory line: "Contact match: ZZSAMEREP". A sharper
# case than the original, because what is identical is the very line the row added to explain
# itself. Seeded and proved on staging.
CUST_B2_NA = None

def term_for(ekey, field):
    ref = TERMS.get((ekey, field))
    if ref is None: return None, None
    if isinstance(ref, tuple):
        p = PAIRS.get(ref[1])
        if p:
            return p['term'], f"{p['count']} rows come back sharing this"
        # 🔴 FALL BACK TO THE SINGLE PROVEN RECORD. A 'pair' entry says "several rows share this
        # fragment", which is true on an estate that happens to hold several. On production nothing
        # filled these fields at all until they were seeded deliberately, and what exists is ONE
        # record per field. The case asks whether the row shows the FULL value — one record answers
        # that perfectly. Without this fallback the row reverted to "find the data first" even
        # though a proven term was sitting in the terms file.
        f = (D.get('found') or {}).get(ref[1])
        if f and f.get('term'):
            return f['term'], f"proven to match on {f['field']} ({f['kind']})"
        return None, None
    f = FOUND.get(ref)
    return (f['term'], f"proven to match on {f['field']} ({f['kind']})") if f else (None, None)

FIND_FIRST = 'FIND THE DATA FIRST — see "Before you start"'

# 🔴 THE CROSS-TAB ROWS USED TO CARRY STAGING LITERALS, one of which even said so in its own
# "Before you start" text ("A real VIN. This one exists on staging."). A VIN, a phone number and a
# work-order number are environment data (Rule 111), so on production those rows told the tester to
# type things that return nothing - six dead rows out of the box. They are resolved from the same
# proven terms file as everything else now, with the old literal kept only as the last resort so a
# missing term degrades to "find the data first" rather than to a confident wrong value.
def env_term(key, fallback):
    f = (D.get('found') or {}).get(key)
    return f['term'] if f and f.get('term') else fallback


ENV_TERMS = {
    'record_number': env_term('work_orders.number_typed', FIND_FIRST),
    'phone':         env_term('customers.phone', FIND_FIRST),
    'vin':           env_term('assets.vin_full', env_term('assets.vin_hidden', FIND_FIRST)),
    'statuses':      env_term('status_spread', FIND_FIRST),
}

HDR = ['ID', 'TestRail', 'What you are checking', 'Why it matters to a real user',
       'Before you start', 'TYPE THIS', 'What to do', 'What you should see',
       'Where that comes from', 'The exact wording of the requirement', 'Result',
       'What you actually saw', 'Ticket']
W = [11, 12, 40, 42, 40, 30, 46, 46, 26, 60, 12, 34, 12]

# Rule 8: never a bare local id — every deliverable pairs it with its C-id and a link.
TR_MAP = {}
_map = os.path.join(HERE, 'testrail-id-map.csv')
if os.path.exists(_map):
    import csv as _csv
    with open(_map) as f:
        for row in _csv.DictReader(f):
            if row.get('case_id'): TR_MAP[row['local_id']] = row['case_id']
TR_RUN = 415

H_FILL = PatternFill('solid', fgColor='1F3864')
HELD_FILL = PatternFill('solid', fgColor='FFF2CC')
TYPE_FILL = PatternFill('solid', fgColor='E2EFDA')
NODATA_FILL = PatternFill('solid', fgColor='FCE4D6')
THIN = Border(*[Side(style='thin', color='BFBFBF')] * 4)

def style_sheet(ws, nrows):
    for c, (h, w) in enumerate(zip(HDR, W), 1):
        cell = ws.cell(1, c, h)
        cell.font = Font(name=FONT, bold=True, color='FFFFFF', size=11)
        cell.fill = H_FILL
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws.column_dimensions[get_column_letter(c)].width = w
    ws.row_dimensions[1].height = 34
    ws.freeze_panes = 'D2'
    dv = DataValidation(type='list', formula1='"Pass,Fail,Blocked,Not run,HELD - do not run"',
                        allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(f'K2:K{max(nrows + 1, 2)}')
    ws.auto_filter.ref = f'A1:M{max(nrows + 1, 2)}'

def write_rows(ws, rows):
    for r, row in enumerate(rows, 2):
        cid = TR_MAP.get(str(row.get('ID')))
        row['TestRail'] = f'C{cid}' if cid else ''
        held = row.pop('_held', False)
        nodata = row.pop('_nodata', False)
        for c, key in enumerate(HDR, 1):
            cell = ws.cell(r, c, row.get(key, ''))
            cell.font = Font(name=FONT, size=10, bold=(c == 6))
            cell.alignment = Alignment(vertical='top', wrap_text=True)
            cell.border = THIN
            if c == 2 and cid:
                cell.hyperlink = f'https://shopview.testrail.io/index.php?/cases/view/{cid}'
                cell.font = Font(name=FONT, size=10, color='0563C1', underline='single')
            if c == 6 and row.get('TYPE THIS'):
                cell.fill = NODATA_FILL if nodata else TYPE_FILL
            elif held:
                cell.fill = HELD_FILL
        if held:
            ws.cell(r, 11).value = 'HELD - do not run'
    style_sheet(ws, len(rows))

def steps(*ss):
    return "\n".join(f"{i}. {s}" for i, s in enumerate(ss, 1))

def build():
    wb = Workbook(); wb.remove(wb.active)

    # ── How to run ────────────────────────────────────────────────────────────────────────────
    ws = wb.create_sheet('How to run this')
    intro = [
     ('Search Results Integrity — manual test pack', 16, True),
     ('', 10, False),
     (f'Where to run it:  {ENV}', 11, True),
     ('Sign in with any account that can see all of: Work Orders, Customers, Assets, Parts, '
      'Vendors, Part Sales, Purchase Orders and Vendor Invoices.', 10, False),
     ('Open search with the magnifying glass in the header, or press Ctrl+K (Cmd+K on a Mac).', 10, False),
     ('', 10, False),
     ('What this pack is for', 13, True),
     ('These tests do NOT check whether search finds the right record. They check whether the row '
      'you are looking at TELLS YOU WHAT YOU NEED TO KNOW — so you can pick the right record '
      'without opening it, and tell two similar records apart.', 10, False),
     ('It came out of SV-10619 and SV-10551. Both are the same problem: you type 123786 and a row '
      'shows you only 786 — which is also what a row for 185786 would show.', 10, False),
     ('', 10, False),
     ('Where these live in TestRail', 13, True),
     ('All 110 cases are in TestRail under  Global Search > Global Search - Enhancement (Aug 2026) '
      '> Search Results Integrity — result row display (SV-10619 / SV-10551),  in nine folders, '
      'one per tab.', 10, False),
     ('They are all in test run 415, "Global Search V2 — Full Suite":  '
      'https://shopview.testrail.io/index.php?/runs/view/415', 10, False),
     ('The TestRail column in each sheet links straight to that case. Record your result in '
      'TestRail; this sheet is for working through them.', 10, False),
     ('', 10, False),
     ('How to read a row', 13, True),
     ('TYPE THIS (green)   — copy this exactly into the search box. It has been checked on this '
      'environment and it does match the field the test is about.', 10, False),
     ('TYPE THIS (orange)  — no record on this environment matched that field, so you need to find '
      'or create the data first. The cell tells you what to look for.', 10, False),
     ('Yellow row          — HELD. The specification does not yet say what should happen. Do not '
      'pass or fail it. Write down what you saw in "What you actually saw" and move on.', 10, False),
     ('Result              — pick from the dropdown: Pass, Fail, Blocked, Not run, HELD.', 10, False),
     ('', 10, False),
     ('Three rules that stop a wrong verdict', 13, True),
     ('1. Never judge from the number of results. "Something came back" is not a pass — check that '
      'YOUR record is in the list, by name.', 10, False),
     ('2. If a test says a value should NOT be found, search something else on the same record '
      'first. If that comes back, the search is alive and the absence is real.', 10, False),
     ('3. Before you explain any odd behaviour, check the build has not changed underneath you. '
      'The version is in the page source as "app-version".', 10, False),
     ('', 10, False),
     ('If something fails', 13, True),
     ('Write exactly what you typed and exactly what the row showed, and take a screenshot of the '
      'whole row. "It was wrong" cannot be fixed by a developer; "I typed 965 and the row showed '
      '9..." can.', 10, False),
    ]
    for r, (text, size, bold) in enumerate(intro, 1):
        c = ws.cell(r, 1, text)
        c.font = Font(name=FONT, size=size, bold=bold,
                      color='1F3864' if bold and size >= 13 else '000000')
        c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.column_dimensions['A'].width = 130

    counts = []
    # ── one tab per entity ────────────────────────────────────────────────────────────────────
    for e in bc.ENTITIES:
        ekey, tab, s = e['key'], e['tab'], e['slug']
        one = tab.rstrip('s').lower()
        rows = []
        pair = PAIRS.get(PAIR_FOR_TAB.get(ekey) or '')
        pterm = pair['term'] if pair else None
        pnote = (f"{pair['count']} rows come back sharing this fragment — perfect for this test"
                 if pair else None)

        def A_common(idx, title, why, before, todo, expect, quote, srcname, held=False, term=None,
                     note=None):
            rows.append({
             'ID': f'SRI-{s}-{idx}', 'What you are checking': title,
             'Why it matters to a real user': why, 'Before you start': before,
             'TYPE THIS': term or 'FIND THE DATA FIRST — see "Before you start"',
             'What to do': todo, 'What you should see': expect,
             'Where that comes from': srcname, 'The exact wording of the requirement': quote,
             'Result': '', 'What you actually saw': '', 'Ticket': '',
             '_held': held, '_nodata': term is None})
            if note: rows[-1]['Before you start'] += f"\n\nNOTE: {note}"

        A_common('A1', 'The whole matched value is shown, not just what you typed',
          'If the row shows only the characters I typed, I am reading my own query back. It tells '
          'me nothing about which record this is.',
          f'A {one} exists whose {e["shared_fragment_field"]} contains this fragment somewhere '
          f'other than the very start.' if pterm else
          f'You need a {one} whose {e["shared_fragment_field"]} contains a distinctive run of '
          f'characters part-way through it.',
          steps('Open search and type the term in the green cell.', f'Open the {tab} tab.',
                'Look at each row WITHOUT opening it.',
                f'Write down the {e["shared_fragment_field"]} exactly as the row shows it.'),
          f'Each row shows the COMPLETE {e["shared_fragment_field"]}, with the bit you typed '
          f'highlighted inside it. Seeing only what you typed, or a value cut short with "...", '
          f'is a FAIL — that is SV-10619 and SV-10551.',
          bc.Q_HIGHLIGHT, 'PRD v1.5, section 5.3', term=pterm, note=pnote)

        A_common('A2', 'A long value is not cut off through the part that matched',
          'A row that cuts off at "9..." has hidden the one thing I was looking for.',
          f'A {one} whose text is long enough to overflow the search box (the box is a fixed '
          f'width), with the matched characters near the END of the value.',
          steps('Open search and type the term.', f'Open the {tab} tab.',
                'Look for any text ending in "...".',
                'If you see one, write down what is hidden and what you typed.'),
          'You can still identify the record. If the "..." has eaten the characters you typed, or '
          'eaten the part that tells this record from its neighbours, that is a FAIL.',
          bc.Q_STORY, 'Story SV-9170', term=pterm)

        A_common('A3', 'The highlight marks the match inside the text, not instead of it',
          'A highlight is meant to point at something. If it replaces the text, it points at nothing.',
          f'Any {one} you can find by typing part of what the row displays.',
          steps('Open search and type the term.', f'Open the {tab} tab.',
                'Look at how the match is drawn on the row.'),
          'The full text is on the row and the matched part is highlighted within it — exactly like '
          'the example in the requirement, where typing "Fib" shows the whole of '
          '"S1-644 Fibridge Commercial" with "Fib" marked.',
          bc.Q_HIGHLIGHT, 'PRD v1.5, section 5.3', term=pterm)

        A_common('B1', 'Two records sharing what you typed can be told apart',
          'This is the whole point. Type 123786 and if two rows both draw as "786", you cannot '
          'tell 123786 from 185786 without opening both.',
          f'Two {tab.lower()} exist whose {e["shared_fragment_field"]} are DIFFERENT but share a '
          f'run of characters.',
          steps('Open search and type the term.', f'Open the {tab} tab.',
                'WITHOUT opening anything, write down which row is which.',
                'If you cannot tell them apart, that is the failure — say so.'),
          'You can say which row is which from the rows alone. Two rows that read the same is a '
          'FAIL — and note that the right number of rows does not rescue it.',
          bc.Q_STORY, 'Story SV-9170', term=pterm, note=pnote)

        same = PAIRS.get(SAME_FOR_TAB.get(ekey) or '')
        na = False
        A_common('B2', 'Two records with the same bold line differ somewhere you can see',
          'Real shops have two trucks of the same year/make/model and two vendors with the same '
          'name. If the rows are identical the list is useless.',
          (f'Two DIFFERENT customers, each holding a contact with the SAME name. Searching that '
           f'name returns both customer rows, and both carry the identical line '
           f'"Contact match: ZZSAMEREP". The product will not allow two customers with the same '
           f'name, so this is the real shape of the risk on this tab.'
           if ekey == 'customers' else
           f'Two {tab.lower()} whose bold first line is identical but which are different records. '
           f'These were seeded for this suite.'),
          steps('Open search and type the term.', f'Open the {tab} tab.',
                'Compare the two rows line by line.',
                'Write down what, if anything, separates them.'),
          ('THIS ROW DOES NOT APPLY — see "Before you start". Mark it Not run.' if na else
           'Something visible differs — the second line, a badge, a number. Two identical rows is a '
           'FAIL; write down both records and what actually differs between them in the data.'),
          bc.Q_STORY, 'Story SV-9170',
          term=None if na else (same or {}).get('term'),
          note=None if na or not same else
               f"{same['count']} rows come back; at least two carry the same bold line")

        # 🔴 CORRECTED 2026-09-29 AFTER THE QA LEAD TESTED THESE ON STAGING.
        # These cases were HELD on the belief that a row matching on a field it does not display
        # cannot say why it came back. That was WRONG, and the screenshots proved it: the product
        # appends a labelled note to the second line — "Contact match: 609-461-6502",
        # "Matched: KVQ-2870", "Number: I-1522" — so the row DOES explain itself.
        # SearchResultRow.vue: if the hit is a contact field it prepends "Contact match: <fragment>";
        # otherwise, when the fragment appears nowhere else on the row, it appends
        # "<Field label>: <fragment>" using the map in searchRowVariants.ts.
        # The error was mine: I read the API payload and the row VARIANTS, concluded the UI could
        # not render what the payload did not carry, and never opened the UI to look.
        # So the question is no longer "does the row explain itself" — it does. It is "does it show
        # the WHOLE value", which is the one real defect (SV-10619 / SV-10551). These are now
        # assertions, not held cases.
        for n, (field, why, how) in enumerate(e['invisible'], 1):
            t, note = term_for(ekey, field)
            A_common(f'C{n}', f'A match on {field} shows the FULL value on the row', why,
              f'A {one} carrying a distinctive value in {field} — a value that appears in NO other '
              f'field of that record.' + ('' if t else
              f'\n\nNothing on this environment matched that field when we looked, so you need to '
              f'find or create one. To do it: {how}.'),
              steps('Open search and type the term.', f'Open the {tab} tab.',
                    'Find the record. Without opening it, read the SECOND line of the row.',
                    'It should carry a labelled note naming the field that matched.',
                    'Now check the value in that note against the record itself.'),
              f'The second line carries a labelled note — such as "Contact match: ...", '
              f'"Matched: ...", "Unit: ...", "VIN: ..." — naming what matched, with the part you '
              f'typed highlighted inside it.\n\n'
              f'THE THING TO CHECK IS WHETHER THE VALUE IS COMPLETE. The note must show the WHOLE '
              f'{field} value, not just the characters you typed. Open the record and compare. If '
              f'you typed part of a longer value and the note shows only that part, this is a FAIL '
              f'— it is SV-10619 and SV-10551, and it means two different records can draw '
              f'identically.',
              bc.Q_HIGHLIGHT, 'PRD v1.5, section 5.3',
              held=False, term=t, note=note)

        if ekey == 'customers':
            A_common('C9', 'Two people with the same name at one customer — which one matched?',
              'A shop rings and asks for "Chris". If two people called Chris work at that customer, '
              'the row that comes back names the company and nothing else — I still do not know '
              'which of them the system found.',
              'ONE customer holding TWO contacts with the same first name. Seeded for this suite: '
              'Rowcheck Dualrep Transport holds two people named ZZDUALREP.',
              steps('Open search and type the term.', 'Open the Customers tab.',
                    'Note how many rows come back and what the second line says.',
                    'Now open that customer and look at its Contacts tab.',
                    'Write down how many people carry that name.'),
              'ONE customer row comes back, reading "Contact match: ZZDUALREP" — but the customer '
              'holds TWO people with that name. Record whether anything on the row tells you which '
              'person matched.\n\n'
              'One row is correct: the specification says contacts are not a result group of their '
              'own. The open question is whether the row can identify the PERSON. Record what you '
              'see; do not judge it.',
              bc.Q_STORY, 'Story SV-9170',
              term=(FOUND.get('customers.dual_contact') or {}).get('term'),
              note='this customer holds TWO people with this name — verified on staging')

        A_common('D1', f'The {tab} row shows everything the specification promised',
          'Each field is there because somebody decided you need it to choose. A missing one is a '
          'choice you now have to make by opening records.',
          f'Any {one} that search returns, which has a value in each field named in the '
          f'requirement column.',
          steps('Open search and type something that returns the record.', f'Open the {tab} tab.',
                'Check the row against the requirement column, field by field.',
                'Tick off each one. Write down any that is missing.'),
          'Every field named in the requirement is on the row. Do not judge whether a missing one '
          'matters — just record it.',
          e['prd_displayed'], 'PRD v1.5, section 4', term=pterm)

        A_common('I1', 'A corrected typo says that it corrected something',
          'If the system quietly fixes my typo without saying so, I will think I found an exact '
          'match and act on the wrong record.',
          f'A {one} whose name or description can be found by spelling it slightly wrong (one or '
          f'two letters out). Do NOT use a number or a code — those are excluded on purpose.',
          steps('Open search and type the near-miss spelling.', f'Open the {tab} tab.',
                'Look closely at the matched word.'),
          'The matched word is highlighted AND carries the "≈" mark or italics that says it is a '
          'close match. A corrected typo that looks exactly like an exact match is a FAIL.',
          bc.Q_FUZZY, 'PRD v1.5, section 7',
          term=(FOUND.get(FUZZY_FOR_TAB[ekey]) or {}).get('term')
               if ekey in FUZZY_FOR_TAB else None,
          note=(f"checked on this environment: typing this brings back "
                f"{(FOUND.get(FUZZY_FOR_TAB[ekey]) or {}).get('primary')!r}, whose name is a "
                f"near-miss of what you typed, and it should be drawn as a SOFT match. That soft "
                f"row is the one this test is about — not the exact matches above it.")
               if ekey in FUZZY_FOR_TAB else None)

        ws = wb.create_sheet(tab[:31])
        write_rows(ws, rows)
        counts.append((tab, len(rows)))

    return wb, counts

# ── the cross-tab cases (All tab, counts, typing, awkward data, no results, access) ───────────
Q_COUNTS20 = ("**Counts are capped at 20.** No count in the modal reads higher than `20` — not a "
 "tab, not a group header, not the `Show all N` link. A query matching 34 work orders shows "
 "`Work Orders (20)` and `Show all 20`. Twenty is both what search returns per entity type and "
 "what it reports.")
Q_GROUP5 = ("Each group shows up to **5** results (raised from today's 3). When a group has more, a "
 "`Show all N` link appears to the right of the group header.")
Q_SCOPED = ("The scoped tab shows **up to 20 rows**, scrolled within the modal — there is no "
 "pagination and no further loading, and no `Show all` link inside the tab.")
Q_SHOWALL = ("Clicking it switches the modal to that entity's scope tab. The user never leaves the "
 "modal: there is no separate search results page and no handoff of the query to the entity's "
 "list page.")
Q_TABS = ("A horizontal tab strip immediately under the input: `All · Work Orders · Customers · "
 "Assets · Parts · Vendors · Part Sales · Purchase Orders · Vendor Invoices`. Each tab carries "
 "its result count, e.g. `All (12)`, `Work Orders (8)`.")
Q_ORDER = ("Group display order in \"All\" is: Work Orders → Customers → Assets → Parts → Vendors → "
 "Part Sales → Purchase Orders → Vendor Invoices.")
Q_PIN = ("When the top result across all groups has a score > 0.95 (effectively an ID match), it is "
 "pinned as a separate single row at the very top, above the groups, labeled by its entity icon "
 "— the \"if you typed `S2-15276`, jump straight to that WO\" experience.")
Q_NOTFUZZY = ("Exact identifier fields — VIN, WO number, P-number, part number, PO number, invoice "
 "number — bypass fuzzy logic and require exact match after normalization. A typo in a VIN is "
 "almost always a wrong VIN, not a typo, and fuzzy matching here would surface confusing results.")
Q_STATUS = ("Some fields — notably **status** — are stored on the search document for ranking (§6.1) "
 "and for the row badge, but are deliberately **not matchable**: typing a status name does not "
 "return records carrying that status.")
Q_NORES = ("\"No results for '<query>'\" — plus \" in <Tab>\" when a scope tab other than All is "
 "active. Nothing else.")
Q_UNIT_ALONE = "When the asset has no unit number, the year/make/model stands alone."
Q_RANKREACH = ("Because search returns at most 20 records per entity type (§5.2), ranking quality is "
 "what decides whether the record the user wanted is reachable at all.")
Q_EMPTYTYPE = ("Search must work for a single-tenant dataset where any entity type is empty (e.g. a "
 "shop with no part sales yet).")
Q_ACCESS = ("All result fields must respect existing tenant-isolation and role-based-access checks — "
 "a technician without Parts access does not see Parts results, and the same applies to Purchase "
 "Orders and Vendor Invoices, which are finance-adjacent and more likely to be restricted.")
Q_INDEXED = "The indexed fields are what a typed query is matched against…"
Q_DEBOUNCE = "…debounce input at 150ms…"

CROSS = [
 ('E1', 'A tab\'s count equals the number of rows inside it',
  'If the tab says 8 and shows 5, I stop looking and miss the record.',
  'A search that returns more than 5 but fewer than 20 of one kind.', '965',
  ('Type the term.', 'Read the number on each tab.', 'Open a tab and count the rows.',
   'Compare the two.'),
  'The number on the tab and the number of rows inside it agree, up to a maximum of 20.',
  'PRD v1.5, section 5.2', Q_SCOPED, False),
 ('E2', 'No count anywhere reads higher than 20',
  'A count I cannot reach is a promise the product does not keep.',
  'A search matching more than 20 of one kind. ZZBROAD matches 22 parts.', 'ZZBROAD',
  ('Type the term.', 'Read the Parts tab count.', 'Read the group heading count on the All tab.',
   'Read the "Show all N" link.'),
  'All three read 20 — never the true total.', 'PRD v1.5, section 5.2', Q_COUNTS20, False),
 ('E3', 'A group on the All tab shows 5 and offers the rest',
  'Five is a sample. I need to know a sample is what I am looking at.',
  'A search returning more than 5 of one kind.', 'ZZBROAD',
  ('Type the term.', 'Stay on the All tab.', 'Count the rows under the Parts heading.',
   'Look to the right of that heading.'),
  'Exactly 5 rows, and a "Show all N" link beside the heading.',
  'PRD v1.5, section 5.2', Q_GROUP5, False),
 ('E4', '"Show all" opens that tab and keeps you in the search box',
  'Losing the search box loses my query and my place.',
  'A search returning more than 5 of one kind.', 'ZZBROAD',
  ('Type the term.', 'Click "Show all N" beside a group heading.',
   'Check where you have landed and whether your text is still in the box.'),
  'You land on that entity\'s tab, still inside the search box, with your text intact. Being sent '
  'to a separate page is a FAIL.', 'PRD v1.5, section 5.2', Q_SHOWALL, False),
 ('E5', 'All nine tabs are there, named and counted',
  'A missing tab is a kind of record I will never think to look for.',
  'Anything that returns at least one result.', '965',
  ('Type the term.', 'Read the tab strip left to right, scrolling it sideways.',
   'Check each tab carries a count.'),
  'All nine, in this order: All, Work Orders, Customers, Assets, Parts, Vendors, Part Sales, '
  'Purchase Orders, Vendor Invoices.', 'PRD v1.5, section 5.2', Q_TABS, False),
 ('E6', 'Groups on the All tab are always in the same order',
  'A stable order is what lets me scan without reading.',
  'A search returning results in four or more kinds.', '965',
  ('Type the term.', 'Stay on the All tab.', 'Read the group headings top to bottom.'),
  'Work Orders, then Customers, Assets, Parts, Vendors, Part Sales, Purchase Orders, Vendor '
  'Invoices. Kinds with no results are simply skipped.',
  'PRD v1.5, section 6.2', Q_ORDER, False),
 ('E7', 'Typing a full record number puts that record at the very top',
  'If I typed a work order number I want that work order, not a list.',
  'A record whose number you can type in full. Take one from any list page.', ENV_TERMS['record_number'],
  ('Type the number in full.', 'Look ABOVE the first group heading.'),
  'That one record sits alone at the top, above all the groups, with its icon.',
  'PRD v1.5, section 6.2', Q_PIN, False),
 ('F1', 'A number is found with and without its dashes',
  'I type what is printed on the paper in front of me, dashes and all.',
  'Any work order number, e.g. from the Work Orders list.', ENV_TERMS['record_number'],
  ('Type the number exactly as printed, dashes and all.', 'Note what comes back.',
   'Type it again with every dash and space removed.', 'Compare the two lists.'),
  'Both find the same record.', 'PRD v1.5, section 7', bc.Q_NORMALIZE, False),
 ('F2', 'A phone number is found however it is punctuated',
  'The number on my screen has brackets. The number in my head does not.',
  'A customer with a punctuated phone number.', ENV_TERMS['phone'],
  ('Type the number with its dashes.', 'Type the same digits with nothing between them.',
   'Compare the two lists.', 'Now type only the last four digits and see what comes back.'),
  'The first two find the same customer. The last-four search is a different test — write down '
  'whether you can tell the results apart (that is test B1 on the Customers tab).',
  'PRD v1.5, section 7', bc.Q_NORMALIZE, False),
 ('F3', 'An accented name is found typed either way',
  'Nobody types the accent.',
  'A customer whose name has an accent. The seeded ZZACC records have one.', 'ZZACC',
  ('Type the name with its accents.', 'Type it without.', 'Compare.'),
  'Both spellings return the same single customer.',
  'PRD v1.5, section 7', bc.Q_NORMALIZE, False),
 ('F4', 'An apostrophe or hyphen in a name is optional',
  '"O\'Brien" and "OBrien" are the same person to everyone but a computer.',
  'The seeded ZZPUNC records — one has an apostrophe, one a hyphen.', 'ZZPUNC',
  ('Type each name with its punctuation.', 'Type each name without it.', 'Compare.'),
  'Both spellings find the record.', 'PRD v1.5, section 7', bc.Q_NORMALIZE, False),
 ('F5', 'A typo in a NUMBER is not silently corrected',
  'A wrong VIN is a wrong truck. I would rather see nothing than the wrong vehicle presented as a '
  'match. This is the most dangerous result search can give.',
  'A real VIN, proven on this environment.', ENV_TERMS['vin'],
  ('Type the VIN exactly — confirm the vehicle comes back.',
   'Now change ONE character and search again.', 'Read the result list carefully.'),
  'The near-miss VIN does NOT return the vehicle. If it does, that is a FAIL — record it '
  'immediately, this one matters more than the rest.',
  'PRD v1.5, section 7', Q_NOTFUZZY, False),
 ('F6', 'Typing a status word returns nothing because of status',
  'Status words are ordinary English. If they match, searching a part called "Complete Kit" drags '
  'in every complete work order.',
  'Records in several different statuses.', ENV_TERMS['statuses'],
  ('Type a status word: Approved, then Invoiced, then Unpaid, then Ordered.',
   'For each hit, check WHY it came back.',
   'Separate the ones whose name really contains the word from the ones that only have that status.'),
  'Nothing comes back BECAUSE of its status. Records whose name genuinely contains the word are '
  'fine — say which is which.', 'PRD v1.5, section 4', Q_STATUS, False),
 ('G1', 'A work order whose truck has no unit number still reads properly',
  'Real data has holes. A row that collapses when a field is blank hides a real record.',
  'A work order whose vehicle has no unit number.', 'ZZNOUNIT',
  ('Find such a work order and search for it.', 'Read the row.',
   'Look for blank gaps, stray dashes or the word "undefined".'),
  'The year/make/model stands on its own, with no blank gap and no leftover separator.',
  'PRD v1.5, section 4', Q_UNIT_ALONE, False),
 ('G2', 'A very long value does not push the rest of the row out of sight',
  'One customer with a 90-character name must not make every other row unreadable.',
  'A record with an unusually long name or description.', 'ZZLONGROW',
  ('Search for it.', 'Read the whole row — badge, status, second line.',
   'Write down anything that is pushed off the row.'),
  'The badge and the second line are still readable.', 'Story SV-9170', bc.Q_STORY, False),
 ('G3', 'A very common word still gives a usable list',
  'Parts are called "Kit", "Filter", "Seal". If a common word gives 20 near-identical rows the tab '
  'is dead weight.',
  'A word that appears in many part descriptions.', 'Filter',
  ('Type the word.', 'Open the Parts tab.',
   'Pick one specific part you know exists and try to find it in the list.'),
  'The part you wanted is inside the 20, and the rows differ enough to choose from. If you cannot '
  'reach it, say which part and what you typed.', 'PRD v1.5, section 6.1', Q_RANKREACH, False),
 ('G4', 'One or two characters behaves sensibly',
  'Everybody types one character on the way to typing six.',
  'Nothing.', '9',
  ('Type a single character and wait.', 'Add a second character and wait.',
   'Write down what happened at each step.'),
  'THIS ROW IS HELD — the specification sets a typing delay but no minimum length, so we cannot '
  'say what one character should do. Do not pass or fail it. It must not error, must not hang, and '
  'must not leave the previous keystroke\'s results on screen.',
  'PRD v1.5, section 8 (the spec is silent — see question Q10)', Q_DEBOUNCE, True),
 ('G5', 'A kind of record that does not exist yet does not break search',
  'A new shop has no part sales. Search must still work.',
  'A workplace where at least one kind has no records at all.', '965',
  ('Search something that returns results in other kinds.', 'Read the tab strip.',
   'Read the group list.'),
  'Search works normally and the empty kind simply does not appear.',
  'PRD v1.5, section 9', Q_EMPTYTYPE, False),
 ('H1', 'No results shows your query back, and nothing else',
  'Seeing my own typo is how I realise it was a typo.',
  'Nothing.', 'Zqwxpol',
  ('Type the term.', 'Read the message.'),
  'It reads: No results for \'Zqwxpol\' — and nothing else. No suggestions, no buttons, no tips.',
  'PRD v1.5, section 5.2', Q_NORES, False),
 ('H2', 'No results inside a tab names the tab',
  '"No results" when there ARE results on another tab would send me away for nothing.',
  'A search returning results in one kind only.', 'ZZVORTAC',
  ('Type the term.', 'Open a tab that has no results for it.', 'Read the message.'),
  'The message names the tab you are on, so you know the search is narrowed and not empty '
  'everywhere.', 'PRD v1.5, section 5.2', Q_NORES, False),
 ('H3', 'A record you can open from its own list is never "not found"',
  'The worst possible outcome — the record exists, I can open it from its list page, and search '
  'says it does not exist.',
  'Pick any record from its own list page and note one of its values.', 'ZZLONGROW',
  ('Search that value.', 'If nothing comes back, confirm the record still opens from its list page.',
   'Then search a DIFFERENT value from the SAME record as a control.',
   'Record both outcomes together — the control is what makes this trustworthy.'),
  'The value finds its record. The control in step 3 is NOT optional: without it you cannot tell '
  '"this field is not searchable" from "the search is down".',
  'PRD v1.5, section 4', Q_INDEXED, False),
 ('K1', 'Someone without access sees no rows AND no count',
  'A technician seeing finance rows is a data leak, not a search bug.',
  'A role without Parts access, and one without Purchase Order / Vendor Invoice access. The seven '
  'seeded "ZZAUTOTEST No ..." roles cover this.', '965',
  ('Sign in as a user with full access, search, and note the rows and the counts.',
   'Sign in as the restricted role and run the IDENTICAL search.',
   'Compare rows AND counts.'),
  'The restricted user sees none of those rows, no tab for them, and no count. Check the COUNT as '
  'well — a count still showing the full total leaks how much exists.',
  'PRD v1.5, section 9', Q_ACCESS, False),
]

def build_cross(wb):
    rows = []
    for cid, title, why, before, term, todo, expect, src, quote, held in CROSS:
        rows.append({
         'ID': f'SRI-ALL-{cid}', 'What you are checking': title,
         'Why it matters to a real user': why,
         'Before you start': before if term else
             before + '\n\nYou need to find this record yourself — see the steps.',
         'TYPE THIS': term or 'FIND THE DATA FIRST — see "Before you start"',
         'What to do': steps(*todo), 'What you should see': expect,
         'Where that comes from': src, 'The exact wording of the requirement': quote,
         'Result': '', 'What you actually saw': '', 'Ticket': '',
         '_held': held, '_nodata': term is None})
    ws = wb.create_sheet('All tab and cross-tab')
    write_rows(ws, rows)
    return len(rows)

PO_Q = [
 ('Q1', '🟢 ANSWERED ON THE BUILD 2026-09-29 — WITHDRAWN. The row DOES say why it came back.',
  'We asked what a row should do when it matches on a field it does not display. The QA lead tested '
  'it and the answer was already in the product: the row appends a labelled note to its second line '
  '— "Contact match: 609-461-6502", "Matched: KVQ-2870", "Number: I-1522", "Unit: ...", "VIN: ...".',
  'Nothing is blocked by this any more. The 32 test cases that were held on it are now ordinary '
  'assertions and have been rewritten; they check that the note shows the FULL value.',
  'Section 5.3 does not describe this labelled note, so the specification is behind the build. That '
  'is a documentation gap, not a behaviour decision.',
  'Only this: should section 5.3 be updated to describe the labelled match note, so the spec and the '
  'product agree? No product change is being proposed.',
  'None — all 32 released'),
 ('Q2', '🟢 ANSWERED — WITHDRAWN. A customer found by phone DOES show the phone.',
  'We reported that a customer matched on a telephone number showed no telephone. That was wrong: '
  'the row shows "Contact match: <the number>" on its second line.',
  'The claim came from reading the API payload and the row variants rather than opening the screen. '
  'It is withdrawn.',
  'Section 4 says "telephone on hover" for Customers, which is a different thing again and is not '
  'what the build does.',
  'Nothing. Folded into Q1 as a documentation point.',
  'None'),
 ('Q3', '🔴 THE ONE REAL DEFECT — show the whole value, highlight the part that matched.',
  'When you type part of a longer value, the row shows only the part you typed. Type 965 and a row '
  'reads "Contact match: 965" — the phone number it came from, 857-496-5067, is never shown. But '
  'type 3286 against (264) 328-6723 and the row shows the whole number. Same field, same kind of '
  'match, two behaviours.',
  'THIS IS THE BUG BEHIND SV-10619 AND SV-10551. Two records whose numbers both contain 965 draw '
  'identically, so the user cannot tell them apart — 123786 and 185786 both showing as 786. The QA '
  'lead: "we need to show the full word/number and highlight the matching part."',
  'Section 5.3: "The matched substring of the query is highlighted in the primary and secondary '
  'text" — highlighting a substring requires the whole text to be there.',
  'Confirm the fix: the API should send the WHOLE field value, and the screen should highlight the '
  'typed part inside it. The front end already does exactly that wherever it has the full text — '
  'the change is in MatchDescriptorFactory::fragmentOf() on the API side. NEEDS A DEVELOPER.',
  'Every "A" and "C" case — 56'),
 ('Q4', '🟢 ANSWERED — the Assets row shows the unit number, and that is wanted.',
  'The build shows the unit number leading the Assets row; section 4 does not list it.',
  'The QA lead confirmed this is fine and useful.',
  'Section 4 does not list the unit number for Assets.',
  'Add the unit number to section 4 for Assets so the spec matches the build. Documentation only.',
  'None'),
 ('Q5', '🟢 ANSWERED — licence plate appears on the second line.',
  'Typing a licence plate returns the vehicle and the row reads "Matched: KVQ-2870".',
  'Confirmed by the QA lead on staging.',
  'Licence plate is not in section 4 searchable list.',
  'Add licence plate to section 4 as a searchable field. Documentation only.', 'None'),
 ('Q6', '🟢 ANSWERED — postal code appears on the second line.',
  'Typing a postal code returns the customer and the row reads "Matched: H8A3X9".',
  'Confirmed by the QA lead on staging.',
  'Postal code is not in section 4 searchable list.',
  'Add postal code to section 4 as a searchable field. Documentation only.', 'None'),
 ('Q7', '🟢 ANSWERED — the number you typed appears on the second line.',
  'A purchase order displaying I2-1522 is found by typing I-1522, and the row reads '
  '"Number: I-1522" so you can see why it came back.',
  'Confirmed by the QA lead on staging.',
  'Number variants are not in section 4.',
  'Add the alternate number form to section 4 as searchable. Documentation only.', 'None'),
 ('Q8', '🟢 ANSWERED — the received date is the right date.',
  'Section 4 says "invoice date"; the row shows the received date.',
  'The QA lead confirmed the received date is correct for this row.',
  'Section 4 says invoice date.',
  'Correct section 4 to say received date. Documentation only.', 'None'),
 ('Q9', '🟢 ANSWERED — the unit number shows when the vehicle has one.',
  'A work order row shows the unit number first on the second line when the vehicle carries one, '
  'and the year/make/model alone when it does not.',
  'Confirmed by the QA lead on staging.',
  'Section 4 covers the fallback and the build matches it.',
  'Nothing.', 'None'),
 ('Q10', '🟢 ANSWERED — a one-character search behaves sensibly.',
  'Typing a single character searches and behaves as expected.',
  'Confirmed by the QA lead on staging.',
  'The specification sets a typing delay but no minimum length.',
  'Optional: record in section 8 that there is no minimum query length, so the behaviour is '
  'documented rather than incidental. Documentation only.', 'None'),
]

# Something the PO can type and see for himself. Every one of these was run on staging by the QA
# lead on 2026-09-29, and the "what you will see" text is what the screen actually showed.
PO_DEMO = {
 'Q1': ("609-461-6502", "The customer comes back and the second line reads "
        "\"Contact match: 609-461-6502\" with the number highlighted. The row says why it is here. "
        "This is what we got wrong."),
 'Q2': ("609-461-6502", "Same search. The phone number IS on the row, as a Contact match note. "
        "Our earlier claim that it was missing is withdrawn."),
 'Q3': ("965", "Look at the Contact match notes. Some read \"Contact match: 965\" — only the three "
        "characters typed. The phone number they came from is never shown. Now search 3286 and you "
        "get \"Contact match: (264) 328-6723\", the whole number. THIS is the bug: two records "
        "whose numbers both contain 965 draw identically."),
 'Q4': ("ZZLONGROW", "On the Assets tab the unit number leads the row. Useful — the spec just does "
        "not mention it."),
 'Q5': ("KVQ-2870", "The vehicle comes back and the second line reads \"Matched: KVQ-2870\"."),
 'Q6': ("H8A3X9", "The customer comes back and the second line reads \"Matched: H8A3X9\"."),
 'Q7': ("I-1522", "The purchase order comes back reading I2-1522, and the second line reads "
        "\"Number: I-1522\" so you can see why."),
 'Q8': ("Fibridge", "On Vendor Invoices the date shown is the received date, which is the one you "
        "want."),
 'Q9': ("ZZNOUNIT", "A work order comes back and the unit number leads the second line when the "
        "vehicle has one."),
 'Q10': ("9", "Type a single 9. The search runs and behaves normally."),
}

def build_questions(wb):
    ws = wb.create_sheet('Questions for the PO')
    hdr = ['#', 'The question', 'What is happening now', 'Why it matters',
           'What the specification says today', 'What we need decided',
           'TRY IT YOURSELF — type this', 'What you will see', 'Tests waiting on it']
    widths = [7, 46, 56, 50, 44, 56, 26, 62, 24]
    for c, (h, w) in enumerate(zip(hdr, widths), 1):
        cell = ws.cell(1, c, h)
        cell.font = Font(name=FONT, bold=True, color='FFFFFF', size=11)
        cell.fill = PatternFill('solid', fgColor='7030A0')
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws.column_dimensions[get_column_letter(c)].width = w
    ws.row_dimensions[1].height = 34
    ws.freeze_panes = 'B2'
    note = ws.cell(2, 1, 'THESE ARE NOT TESTS. They cannot be run in the application — they are '
                   'decisions we need before 32 of the tests can say pass or fail. The test rows '
                   'they block are named in the last column. EVERY ROW CARRIES SOMETHING YOU CAN '
                   'TYPE INTO THE SEARCH YOURSELF (green cell) AND WHAT IT ACTUALLY RETURNED WHEN '
                   'WE CHECKED IT ON STAGING ON 2026-09-29.')
    note.font = Font(name=FONT, size=10, italic=True, color='7030A0')
    note.alignment = Alignment(wrap_text=True, vertical='top')
    for r, row in enumerate(PO_Q, 3):
        demo = PO_DEMO.get(row[0], ('', ''))
        row = row[:6] + (demo[0], demo[1]) + row[6:]
        for c, val in enumerate(row, 1):
            cell = ws.cell(r, c, val)
            cell.font = Font(name=FONT, size=10, bold=(c == 1))
            cell.alignment = Alignment(vertical='top', wrap_text=True)
            cell.border = THIN
            if c == 7 and val:
                cell.fill = TYPE_FILL
                cell.font = Font(name=FONT, size=11, bold=True)
            elif r == 3:
                cell.fill = PatternFill('solid', fgColor='FFF2CC')
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=9)
    return len(PO_Q)

# Everything the session filing this ticket needs, so nothing has to be re-derived. Shape is
# Rule 52/53: Story Defect, parented to the OWNING STORY, priority Medium, never High, no Product
# Area on this type, and the owning story also linked "relates to".
TICKET = [
 ('Summary (the ticket title)',
  'Global Search: a result row shows only the characters typed, not the full value that matched'),
 ('Issue type', 'Story Defect   (NOT "Story Defect - Archive")'),
 ('Parent', 'SV-9170 — FE — Entity result rows: shared base row, nine variants, badges and match '
  'highlighting.  The parent must be the OWNING STORY; an Epic parent is rejected with HTTP 400.'),
 ('Priority', 'Medium.  High is barred by our standing rules — do not raise it.'),
 ('Links', 'Also link SV-9170 as "relates to".  Link SV-10619 and SV-10551 as "relates to" — this '
  'ticket is the root cause of both.'),
 ('Product Area', 'Leave empty. This issue type does not carry the field.'),
 ('Environment', 'Reproduced on staging, app.staging.shopview.com, workplace '
  '"Staging Heavy Duty - 9919", build v26.39.1-97cad2c, on 2026-09-29.'),
 ('What happens',
  'When a search matches part of a longer value, the result row displays ONLY the characters that '
  'were typed instead of the whole value they came from.\n\n'
  'Type 965 and a customer row reads "Contact match: 965". The telephone number it actually '
  'matched — 857-496-5067 — is never shown.\n\n'
  'Type 3286 and a customer row reads "Contact match: (264) 328-6723" — the WHOLE number. Same '
  'field, same kind of match, two different behaviours.'),
 ('Steps to reproduce',
  '1. Open global search on staging (Ctrl+K).\n'
  '2. Type 965.\n'
  '3. Open the Customers tab and read the second line of each row.\n'
  '4. Some rows read "Contact match: 965" — only what you typed.\n'
  '5. Now type 3286 and read the second lines again.\n'
  '6. Rows now read "Contact match: (264) 328-6723" — the full number.\n\n'
  'The difference: in step 2 the typed string appears literally inside the stored value; in step 5 '
  'it does not, because of the brackets and dash.'),
 ('Expected',
  'The row shows the COMPLETE value that matched, with the part that was typed highlighted inside '
  'it — e.g. "Contact match: 857-496-5067" with 965 marked.\n\n'
  'Quoted from Global Search - Product Requirements v1.5 (2026-09-08), section 5.3:\n'
  '"The matched substring of the query is highlighted in the primary and secondary text — '
  'searching `Fib` highlights \"Fib\" in \"S1-644 Fibridge Commercial\"."\n\n'
  'The example in the specification is decisive: the query was three characters and what the row '
  'shows is the whole of "S1-644 Fibridge Commercial".'),
 ('Actual', 'The row shows only the typed characters, so two different records can draw '
  'identically and cannot be told apart.'),
 ('Why it matters',
  'This is the whole purpose of a result row. Story SV-9170: "Each result row carries enough '
  'context to pick the right record without opening it ... which is what tells two of the same '
  'customer\'s work orders apart."\n\n'
  'Concretely: search 123786 and 185786 both draw as "786". The user cannot tell which record is '
  'which without opening both, and cannot even tell that they are different records.'),
 ('Root cause (verified in the code)',
  'api/src/Search/Application/Assembler/MatchDescriptorFactory.php, method fragmentOf(), line 513.'
  '\n\n'
  'It walks the query, its normalised form and its tokens, and returns mb_substr(value, position, '
  'length-of-needle) — the typed slice — as soon as one of them is found literally inside the '
  'stored value. It only returns the WHOLE value as a fallback, when none of them is found.\n\n'
  'So whether the user sees the full value or just their own query depends on whether what they '
  'typed happens to appear literally in the stored text. Punctuation is what usually decides it.'),
 ('Suggested fix',
  'Return the WHOLE field value as the match fragment, and let the screen highlight the typed part '
  'inside it.\n\n'
  'The front end is ALREADY built for this and needs no change: splitHighlight() in '
  'app/src/components/ts/navigation/search/searchRowVariants.ts marks a substring inside a longer '
  'string, and labelled() in SearchResultRow.vue marks the fragment inside the text it is given. '
  'Both already do the right thing wherever they are handed the full text.\n\n'
  'If the descriptor needs to keep the typed portion as well, add it as a separate field rather '
  'than narrowing the value.'),
 ('Evidence',
  'Measured on staging 2026-09-29. Same query (965), same field (contact_phones), same match kind '
  '(word), two rows — one returning the full 696-541-0475 and one returning just 965.\n\n'
  'Full analysis, with the measurement table and the code trace: '
  'build/search-results-integrity/WHY-SEARCH-RESULTS-DISAPPOINT-Root-Cause-Analysis.md, '
  'sections 3 and 8.'),
 ('Test cases covering it',
  '56 cases in TestRail under Global Search > Global Search - Enhancement (Aug 2026) > Search '
  'Results Integrity — result row display, all in run 415.\n\n'
  'The 24 "A" cases (show the whole matched value) and the 32 "C" cases (a match on a hidden field '
  'shows the full value) all fail on this. Start with C146197 (SRI-WO-A1) and C146214 '
  '(SRI-CUST-C1).'),
 ('Already-raised tickets this explains',
  'SV-10619 — "Some search results show \"....\" for the match instead of the full match."\n'
  'SV-10551 — "Not providing the complete Unit number it is matching with."\n\n'
  'Both are symptoms of this one cause. Consider closing them against this ticket rather than '
  'fixing them separately.'),
]

def build_ticket(wb):
    ws = wb.create_sheet('Ticket to create')
    ws['A1'] = 'Ticket to be created for the one real defect'
    ws['A1'].font = Font(name=FONT, size=15, bold=True, color='C00000')
    ws['A2'] = ('Everything below is ready to paste. Nothing needs to be worked out again. '
                'Raise it as written — the shape follows our standing rules for a defect ticket.')
    ws['A2'].font = Font(name=FONT, size=10, italic=True)
    ws.merge_cells('A2:B2')
    ws.column_dimensions['A'].width = 30
    ws.column_dimensions['B'].width = 120
    for r, (k, v) in enumerate(TICKET, 4):
        a = ws.cell(r, 1, k); b = ws.cell(r, 2, v)
        a.font = Font(name=FONT, size=10, bold=True)
        b.font = Font(name=FONT, size=10)
        for c in (a, b):
            c.alignment = Alignment(vertical='top', wrap_text=True); c.border = THIN
        if k in ('Summary (the ticket title)', 'Priority', 'Parent'):
            b.fill = PatternFill('solid', fgColor='FFF2CC')
    return len(TICKET)

def build_summary(wb, tabs):
    ws = wb.create_sheet('Summary', 1)
    ws['A1'] = 'Search Results Integrity — progress'
    ws['A1'].font = Font(name=FONT, size=15, bold=True, color='1F3864')
    ws['A3'] = f'Environment: {ENV}'
    ws['A3'].font = Font(name=FONT, size=10, italic=True)
    hdr = ['Tab', 'Tests', 'Pass', 'Fail', 'Blocked', 'Not run', 'Held', 'Recorded']
    for c, h in enumerate(hdr, 1):
        cell = ws.cell(5, c, h)
        cell.font = Font(name=FONT, bold=True, color='FFFFFF', size=11)
        cell.fill = H_FILL
        cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    ws.column_dimensions['A'].width = 26
    for c in range(2, 9): ws.column_dimensions[get_column_letter(c)].width = 12
    r = 6
    for name, n in tabs:
        q = f"'{name}'!$K$2:$K${n + 1}"
        ws.cell(r, 1, name).font = Font(name=FONT, size=10)
        ws.cell(r, 2, n).font = Font(name=FONT, size=10)
        for c, status in enumerate(['Pass', 'Fail', 'Blocked', 'Not run', 'HELD - do not run'], 3):
            ws.cell(r, c, f'=COUNTIF({q},"{status}")').font = Font(name=FONT, size=10)
        ws.cell(r, 8, f'=SUM(C{r}:G{r})').font = Font(name=FONT, size=10)
        for c in range(1, 9): ws.cell(r, c).border = THIN
        r += 1
    last = r - 1
    ws.cell(r, 1, 'TOTAL').font = Font(name=FONT, size=11, bold=True)
    for c in range(2, 9):
        ws.cell(r, c, f'=SUM({get_column_letter(c)}6:{get_column_letter(c)}{last})')
        ws.cell(r, c).font = Font(name=FONT, size=11, bold=True)
    for c in range(1, 9):
        ws.cell(r, c).fill = PatternFill('solid', fgColor='D9E1F2'); ws.cell(r, c).border = THIN
    ws.cell(r + 2, 1, 'The "Held" column counts tests the specification cannot yet answer. They are '
            'question Q1 on the "Questions for the PO" tab — they are not failures and must not be '
            'reported as any result until that question is answered.')
    ws.cell(r + 2, 1).font = Font(name=FONT, size=10, italic=True, color='BF8F00')
    ws.merge_cells(start_row=r + 2, start_column=1, end_row=r + 2, end_column=8)
    ws.cell(r + 2, 1).alignment = Alignment(wrap_text=True, vertical='top')
    ws.row_dimensions[r + 2].height = 42

if __name__ == '__main__':
    wb, counts = build()
    n_cross = build_cross(wb)
    counts.append(('All tab and cross-tab', n_cross))
    n_q = build_questions(wb)
    build_ticket(wb)
    build_summary(wb, counts)
    wb._sheets.insert(1, wb._sheets.pop(wb._sheets.index(wb['Summary'])))
    out = os.path.join(HERE, 'ShopView-Global-Search-Result-Row-Tests-for-Manual-QA.xlsx')
    wb.save(out)
    print(f"{sum(n for _, n in counts)} test rows + {n_q} PO questions -> {os.path.basename(out)}")
    for t, n in counts: print(f"  {t:26} {n}")
