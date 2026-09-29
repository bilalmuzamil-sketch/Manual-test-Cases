#!/usr/bin/env python3
"""Generates the Search Results Integrity case files from ONE hand-authored table.

WHY A GENERATOR. The suite is a grid: nine tabs x four questions x every matchable field. Hand-
writing it means ~120 near-identical bodies, and near-identical bodies drift - the QA lead has been
bitten by exactly that (Rule 21, and the 10/11/12 router split). Here the DATA is authored and
checked by hand and the PROSE is mechanical, so a PRD change is one edit in ENTITIES and a rerun.

🔴 RULE 113. Every Expected Result below is a VERBATIM quote from SOURCES.md, reproduced exactly.
Nothing in this file paraphrases a source sentence, tidies it, or merges two of them. Where the
source is SILENT - which is most of Class C - the case says so, quotes the GOVERNING sentence
(SV-9170) instead, and carries a PO question id. It never invents an expectation, and it never
resolves the silence by looking at the build (Rule 58).

🔴 RULE 62. This writes FILES. It does not create TestRail cases. Ids are local (SRI-*) until the
QA lead lifts the creation hold and says to push them.
"""
import os, textwrap

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'cases')

PRD = 'Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945'
STORY = 'SV-9170 (story, parent of SV-10619 and SV-10551)'

# The governing sentence. Quoted verbatim from the SV-9170 description.
Q_STORY = ("Each result row carries enough context to pick the right record without opening it — "
           "its identifier, who it belongs to, its status, and for work orders the unit number and "
           "vehicle, which is what tells two of the same customer's work orders apart.")

# PRD §5.3, verbatim.
Q_HIGHLIGHT = ("Every row has a left-side entity icon, a primary line (bold), a secondary line "
               "(subdued), and an optional right-side cluster (status badges, counts, and "
               "quick-action buttons on hover). The matched substring of the query is highlighted "
               "in the primary and secondary text — searching `Fib` highlights \"Fib\" in "
               "\"S1-644 Fibridge Commercial\".")

# PRD §7, verbatim.
Q_FUZZY = ("When a match is fuzzy rather than exact, the matched token in the row is still "
           "highlighted, and a subtle `≈` or italicized treatment indicates the soft match.")

Q_NORMALIZE = ("Lowercase; strip diacritics; collapse whitespace; for identifier fields (WO number, "
               "part number, VIN, phone) also strip non-alphanumerics so `S2-15276` and `s215276` "
               "match, and `(264) 328-6723` and `2643286723` match. For names, keep spaces but "
               "treat hyphens and apostrophes as optional.")

# key, tab label, slug, PRD "Displayed" sentence (verbatim), what the BUILD renders (fact, from
# code - never an expectation), matchable-but-not-rendered fields, and a worked example per field.
ENTITIES = [
 dict(key='work_orders', tab='Work Orders', slug='WO',
   prd_displayed="Displayed: WO number + customer name (primary), status badge, **unit number + "
                 "year/make/model**. When the asset has no unit number, the year/make/model stands "
                 "alone.",
   build_renders="bold line = WO number + customer name; second line = unit number, then "
                 "year/make/model; a status badge on the right",
   shared_fragment_field='WO number',
   invisible=[
     ('VIN / serial number', 'a service advisor reads the VIN off the windscreen or the customer '
      'reads it down the phone', 'type the last 8 characters of a VIN'),
     ('lead technician name', 'a foreman looks for "the job Danny is on"', "type a technician's surname"),
     ('service advisor name', 'a manager looks for the jobs one advisor wrote up', "type an advisor's surname"),
     ('line item descriptions (parts and labor on the WO)', 'a parts person asks "which job did that '
      'alternator go on?"', 'type a part description that appears on a work order line'),
     ('part numbers on the work order\'s lines (`item_part_numbers`)', 'the same question asked with '
      'the number instead of the name', 'type a part number that appears on a work order line'),
   ]),
 dict(key='customers', tab='Customers', slug='CUST',
   prd_displayed="Displayed: customer name (primary), address line, open WO count badge (e.g. `12`), "
                 "telephone on hover.",
   build_renders="bold line = customer name; second line = address line; a count badge reading "
                 "\"N open\" when the customer has open work orders. NO TELEPHONE IS RENDERED "
                 "ANYWHERE - see the root-cause analysis §5",
   shared_fragment_field='telephone',
   invisible=[
     ('the customer\'s own telephone', 'the single most common way a service advisor finds a caller '
      '— and the PRD asks for it on hover, which the build does not do at all',
      'type the last four digits of the customer\'s telephone'),
     ('a contact\'s telephone', 'the person calling is an employee of the company, not the company',
      "type the last four digits of a contact's telephone"),
     ('a contact\'s email address', 'the enquiry arrived by email', "type part of a contact's email address"),
     ('a contact\'s name', 'the caller gives their own name, not the company name', "type a contact's surname"),
     ('address line 2', 'a suite or unit number distinguishes two customers at one street address',
      'type a suite number that appears only in address line 2'),
     ('city', 'two customers share a name and differ only by town', 'type a city name'),
     ('state / province', 'the same, one level up', 'type a province name'),
     ('postal code', 'measured on the build and NOT listed in PRD §4 — see PO-QUESTIONS Q6',
      'type a postal code, with and without its space'),
   ]),
 dict(key='assets', tab='Assets', slug='ASSET',
   prd_displayed="Displayed: year + make + model (primary), customer name (secondary, smaller).",
   build_renders="a bold unit number leading the row, then year + make + model; second line = the "
                 "owning customer's name. The unit number is NOT in the PRD's displayed list — see "
                 "PO-QUESTIONS Q4",
   shared_fragment_field='unit number',
   invisible=[
     ('VIN / serial number', 'the VIN is how a vehicle is identified on every legal document the '
      'shop touches, and it is indexed but never shown', 'type the last 8 characters of a VIN'),
     ('licence plate', 'measured on the build and NOT listed in PRD §4 — see PO-QUESTIONS Q5',
      'type a licence plate'),
   ]),
 dict(key='parts', tab='Parts', slug='PART',
   prd_displayed="Displayed: description (primary), part number (secondary), total quantity with a "
                 "stock-status badge (see §5.3).",
   build_renders="bold line = description; second line = part number; a stock badge built from "
                 "quantity on hand against the min/max thresholds",
   shared_fragment_field='part number',
   invisible=[
     ('bin location', 'the whole point of the search is often "where is it?" — the PRD names bin '
      'location as indexed and the row never shows it', 'type a bin location'),
     ('manufacturer', 'a parts person searches by who makes it', "type a manufacturer's name"),
     ('vendor name', 'a parts person searches by who sells it', "type a vendor's name"),
     ('category', 'a broad hunt for "brakes"', 'type a category name'),
     ('tags', 'shop-specific labelling', 'type a tag'),
   ]),
 dict(key='vendors', tab='Vendors', slug='VEND',
   prd_displayed="Displayed: vendor name (primary), telephone + address line (secondary).",
   build_renders="bold line = vendor name; second line = telephone, then address line",
   shared_fragment_field='telephone',
   invisible=[
     ('email address', 'the vendor contact arrived by email', "type part of the vendor's email address"),
     ('address line 2', 'measured on the build; two vendors at one street address differ only here',
      'type a suite number that appears only in address line 2'),
     ('a contact\'s telephone', 'the person to call is a named rep, not the switchboard',
      "type the last four digits of a vendor contact's telephone"),
     ('a contact\'s name', 'the rep gives their own name', "type a vendor contact's surname"),
     ('a contact\'s email address', 'the backorder chase is by email', "type part of a vendor contact's email"),
   ]),
 dict(key='part_sales', tab='Part Sales', slug='PS',
   prd_displayed="Displayed: P-number + customer (primary), status badge, total price + created date.",
   build_renders="bold line = P-number + customer; second line = total price, the name of the user "
                 "who created it, then the created date; a status badge on the right",
   shared_fragment_field='P-number',
   invisible=[
     ('the asset on the sale', 'a counter sale is remembered by the truck it was for',
      'type a year/make/model that appears on a part sale'),
     ('VIN / serial number', 'the same, by VIN', 'type the last 8 characters of a VIN on a part sale'),
   ]),
 dict(key='purchase_orders', tab='Purchase Orders', slug='PO',
   prd_displayed="Displayed: PO number + vendor (primary), status badge (Ordered / Received), total "
                 "+ created date.",
   build_renders="bold line = PO number + vendor; second line = total, then created date; a status "
                 "badge on the right",
   shared_fragment_field='PO number',
   invisible=[
     ('part numbers on the PO', 'the buyer asks "which order did I put that part on?"',
      'type a part number that appears on a purchase order line'),
     ('part descriptions on the PO', 'the same question by name',
      'type a part description that appears on a purchase order line'),
     ('created-by user', 'the buyer looks for their own orders', 'type the name of the user who raised a PO'),
     ('spliced number variants (`number_variants`)', 'measured on the build and NOT listed in PRD §4 '
      '— see PO-QUESTIONS Q7; it is what makes a PO match a number that appears in no displayed text',
      'type a PO number in a form other than the one displayed'),
   ]),
 dict(key='vendor_invoices', tab='Vendor Invoices', slug='VINV',
   prd_displayed="Displayed: invoice number + vendor (primary), status badge (Paid / Unpaid), total "
                 "+ invoice date.",
   build_renders="bold line = invoice number + vendor; second line = total, then a date taken from "
                 "the RECEIVED date; a payment status badge on the right. The PRD says \"invoice "
                 "date\" — see PO-QUESTIONS Q8",
   shared_fragment_field='invoice number',
   invisible=[
     ('the PO number the invoice belongs to', 'accounts payable reconciles an invoice against the '
      'order it came from, and the PO number is indexed but never shown',
      'type the PO number an invoice was raised against'),
   ]),
]

def case(cid, title, tab, why, pre, steps, quote, source, restate, prov,
         automation='AUTOMATION: READY', held=None):
    out = [f"### {cid} — {title}", "", f"**Tab:** {tab}", "", f"**Why an end user cares:** {why}", ""]
    out.append("**Preconditions**"); out.append("")
    out += [f"{i}. {p}" for i, p in enumerate(pre, 1)]; out.append("")
    out.append("**Steps**"); out.append("")
    out += [f"{i}. {s}" for i, s in enumerate(steps, 1)]; out.append("")
    out.append("**Expected result — the source's own words, quoted (Rule 113)**"); out.append("")
    out += ['> ' + l for l in textwrap.wrap(quote, 96)]; out.append("")
    out.append(f"*Quoted from: {source}*"); out.append("")
    if held:
        out.append(f"**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** {held}")
        out.append("")
        out.append("The sentence above is the GOVERNING expectation and is what the tester judges "
                   "against. It does not state what the row should show when the matched field is "
                   "not one of the displayed fields, so this case is held for the PO's answer "
                   "rather than resolved from the build (Rules 58, 64, 113).")
        out.append("")
    out.append(f"**In plain words (our restatement — NOT the source):** {restate}"); out.append("")
    out.append(f"**Provenance.** {prov}"); out.append("")
    out.append(automation); out.append(""); out.append("---"); out.append("")
    return "\n".join(out)

def build():
    os.makedirs(OUT, exist_ok=True)
    index, total = [], 0
    for e in ENTITIES:
        s, tab = e['slug'], e['tab']
        body = [f"# Search Results Integrity — {tab} tab", "",
                f"Local ids `SRI-{s}-*`. **These are files, not TestRail cases** — the Jira/TestRail "
                f"creation hold (Rule 62) is in force and nothing here has been pushed.", "",
                f"**What the PRD says this row displays**, quoted verbatim:", "",
                f"> {e['prd_displayed']}", "",
                f"*Quoted from: {PRD}, §4 — {tab}*", "",
                f"**What the build actually renders** (fact, read from "
                f"`app/src/components/ts/navigation/search/searchRowVariants.ts` — a FACT, never an "
                f"expectation, Rule 57): {e['build_renders']}.", "", "---", ""]

        # ── Class A · show the whole thing you matched ─────────────────────────────────────────
        body.append("## Class A — show me the whole value you matched on\n")
        body.append(case(
            f"SRI-{s}-A1", f"The matched value is shown in full, not just the characters typed", tab,
            "If the row shows only what I typed, I am reading my own query back. It tells me nothing "
            "about which record this is.",
            [f"A {tab.rstrip('s').lower()} record exists whose {e['shared_fragment_field']} contains a "
             f"distinctive run of characters somewhere after its first character.",
             "You are signed in with a role that can see this tab."],
            [f"Open global search and type a fragment that appears in the middle of that "
             f"{e['shared_fragment_field']} — not the whole value.",
             f"Open the **{tab}** tab.",
             "Look at the row for that record, without opening it."],
            Q_HIGHLIGHT, f"{PRD}, §5.3 Result row anatomy",
            f"The row shows the COMPLETE {e['shared_fragment_field']}, with the part you typed "
            f"emphasised inside it. Seeing only the typed characters, or the value cut short with "
            f"\"…\", is a fail — that is SV-10619 and SV-10551.",
            f"Expected behaviour from {PRD} §5.3. Defect family: SV-10619, SV-10551 (both on {STORY})."))
        body.append(case(
            f"SRI-{s}-A2", "A long value is not clipped through the part that matched", tab,
            "A row that clips to \"9…\" has hidden the one thing I was looking for.",
            [f"A {tab.rstrip('s').lower()} record exists whose displayed text is long enough to "
             f"overflow the search modal (the modal is a fixed 640px wide).",
             "The matched characters sit near the END of that long value."],
            ["Open global search and type the fragment that matches near the end of that value.",
             f"Open the **{tab}** tab.",
             "Read the row. If any text is cut off with an ellipsis, note exactly what is hidden."],
            Q_STORY, STORY,
            "The row still lets you identify the record. If the ellipsis has eaten the matched "
            "characters, or eaten the part that tells this record from its neighbours, that is a "
            "fail — record what was hidden and what you typed.",
            f"Expected behaviour from {STORY}. Related mechanism: the row's text is clipped by CSS "
            f"and the clip does not know which characters matched (root-cause analysis §6)."))
        body.append(case(
            f"SRI-{s}-A3", "The emphasis marks the matched part inside the text, not instead of it", tab,
            "Emphasis is meant to point at something. If it replaces the text, it points at nothing.",
            [f"Any {tab.rstrip('s').lower()} record that can be found by typing part of a displayed field."],
            ["Open global search and type a fragment of that field.",
             f"Open the **{tab}** tab.",
             "Look at how the match is drawn on the row."],
            Q_HIGHLIGHT, f"{PRD}, §5.3 Result row anatomy",
            "The full text is on the row and the matched part is highlighted within it — exactly as "
            "the quoted example does, where typing `Fib` shows the whole of \"S1-644 Fibridge "
            "Commercial\" with `Fib` marked.",
            f"Expected behaviour from {PRD} §5.3."))

        # ── Class B · tell two lookalikes apart ────────────────────────────────────────────────
        body.append("## Class B — let me tell two similar records apart\n")
        body.append(case(
            f"SRI-{s}-B1", "Two records sharing the typed fragment are distinguishable from the rows alone", tab,
            "This is the QA lead's own example: type `123786`, and if two records both draw as `786` "
            "I cannot tell `123786` from `185786` without opening both.",
            [f"TWO {tab.lower()} records exist whose {e['shared_fragment_field']} values are "
             f"DIFFERENT but share a common run of characters (for example `123786` and `185786`).",
             "Both are visible to the signed-in role."],
            ["Open global search and type the shared run of characters.",
             f"Open the **{tab}** tab.",
             "Without opening either record, write down which row is which."],
            Q_STORY, STORY,
            "You can say which row is which from the rows alone. If both rows read the same, the case "
            "fails — and note that a correct row count does not rescue it: two indistinguishable "
            "rows are worse than one, because the user cannot even tell they are different records.",
            f"Expected behaviour from {STORY}."))
        body.append(case(
            f"SRI-{s}-B2", "Two records with the same primary line differ somewhere visible", tab,
            "Real shops have two vehicles of the same year/make/model, two customers with the same "
            "name, two parts with the same description. If the rows are identical the list is useless.",
            [f"TWO {tab.lower()} records exist whose primary (bold) line is identical.",
             "They differ in at least one other field."],
            ["Open global search and type a term that returns both.",
             f"Open the **{tab}** tab.",
             "Compare the two rows."],
            Q_STORY, STORY,
            "Something visible on the row differs — the second line, a badge, a number. If the two "
            "rows are indistinguishable, record both records' identifiers and what differs between "
            "them in the data.",
            f"Expected behaviour from {STORY}."))

        # ── Class C · why did this come back ──────────────────────────────────────────────────
        body.append("## Class C — tell me why this row came back\n")
        body.append(f"Each case below is one field that the query is matched against but that the row "
                    f"does not display. **The PRD does not say what should happen in this situation**, "
                    f"so every case in this class is HELD against a PO question and quotes the "
                    f"governing sentence from {STORY}. They are written now, and held, because an "
                    f"unwritten case is how these reach customers.\n")
        for n, (field, why, how) in enumerate(e['invisible'], 1):
            body.append(case(
                f"SRI-{s}-C{n}", f"A match on **{field}** explains itself on the row", tab,
                why,
                [f"A {tab.rstrip('s').lower()} record exists carrying a distinctive value in "
                 f"**{field}** — a value that appears in NO other field of that record.",
                 "Confirm the value is unique to that field: blank nothing, but search the value and "
                 "check it does not also sit in the name or the number. If it does, the case proves "
                 "nothing (this is the attribution trap of Rule 110)."],
                [f"Open global search and {how}.",
                 f"Open the **{tab}** tab.",
                 "Find the record. Without opening it, answer: does anything on this row tell you "
                 "why it came back?"],
                Q_STORY, STORY,
                f"You can tell from the row that the match came from **{field}**, and you can see "
                f"that value. If the row shows no trace of what you typed, record it: the row came "
                f"back and cannot say why.",
                f"Governing expectation from {STORY}. The field **{field}** is matchable per "
                f"{PRD} §4 (or measured on the build where §4 omits it), and is not in that section's "
                f"list of displayed fields for {tab}.",
                automation='AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered',
                held=f"PRD §4 lists the field **{field}** among what is matched, and does not list it "
                     f"among what the row displays. §5.3 says the match is highlighted \"in the primary and "
                     f"secondary text\" — which cannot happen when the matched value is in neither."))
            total += 1

        # ── Class D · row completeness ────────────────────────────────────────────────────────
        body.append("## Class D — show me everything the specification promised\n")
        body.append(case(
            f"SRI-{s}-D1", f"The {tab} row displays every field §4 says it displays", tab,
            "Each of these fields is there because somebody decided you need it to choose. A missing "
            "one is a choice you now have to make by opening records.",
            [f"At least one {tab.rstrip('s').lower()} record is returned by some query.",
             "The record has a non-empty value for each field named in the quote below."],
            ["Open global search and type a term that returns the record.",
             f"Open the **{tab}** tab.",
             "Check the row against the quoted list, field by field."],
            e['prd_displayed'], f"{PRD}, §4 — {tab}",
            "Every field named in the quote is on the row. Mark any that is missing — do not judge "
            "whether it matters, just record it.",
            f"Expected behaviour from {PRD} §4."))

        # ── Class I · a soft match must admit it is soft ──────────────────────────────────────
        body.append("## Class I — a corrected typo must say it corrected something\n")
        body.append(case(
            f"SRI-{s}-I1", "A fuzzy match carries its soft-match marker", tab,
            "If the system quietly corrects my typo without saying so, I will believe I found an "
            "exact match and act on the wrong record.",
            [f"A {tab.rstrip('s').lower()} record exists whose name or description is reachable by a "
             f"near-miss spelling (one or two characters wrong).",
             "NOTE: identifier fields are excluded by the PRD — see the quote in Class F of the "
             "cross-tab file."],
            ["Open global search and type the near-miss spelling.",
             f"Open the **{tab}** tab.",
             "Look at how the matched token is drawn."],
            Q_FUZZY, f"{PRD}, §7 Fuzzy Matching — Highlighting",
            "The matched token is highlighted AND carries the `≈` or italic treatment that says it is "
            "a soft match. A fuzzy hit drawn identically to an exact hit is a fail.",
            f"Expected behaviour from {PRD} §7."))

        total += 7
        path = os.path.join(OUT, f"{s}-{e['key']}.md")
        open(path, 'w').write("\n".join(body))
        index.append((tab, f"cases/{s}-{e['key']}.md", 7 + len(e['invisible'])))
    return index, total

if __name__ == '__main__':
    idx, total = build()
    print(f"{total} cases across {len(idx)} tab files")
    for tab, path, n in idx:
        print(f"  {tab:18} {n:3} cases  {path}")
