#!/usr/bin/env python3
"""Founder Mode Part Sales — bring cases current with the specification as edited 5 October 2026.
Edits the LIVE case body (which carries the 1 Oct build check and the 'Part sales' glossary fix), never
regenerates from the v2_* builders. Every quote is checked as a verbatim substring of the saved
5 Oct source copy before anything is sent.
  python3 stale_fix_2026_10_05.py            # dry run, both batches
  python3 stale_fix_2026_10_05.py --apply now        # non-Automated cases + new folder/cases
  python3 stale_fix_2026_10_05.py --apply automated  # Automated (atmstatus 3) cases - QA lead go-ahead only (Rule 71)
"""
import sys, json, re, os, time, html
sys.path.insert(0, "build/founder-mode/part-sales")
from ps_lib import api, esc, ol, ul_raw
HERE = "build/founder-mode/part-sales"
SRC_TXT = open(f"{HERE}/sources/CONFLUENCE-867434569-PartSales-Update-v1-2026-10-05.md").read().replace("**", "")
APPLY = "--apply" in sys.argv
BATCH = sys.argv[sys.argv.index("--apply") + 1] if APPLY else None

def Q(anchor, text):
    assert text in SRC_TXT, f"NOT VERBATIM {anchor}: {text[:80]}"
    return (anchor, text)

def quotes_html(qs):
    return ul_raw(f"<strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;" for a, q in qs)

OLD_SRC_DATE = "read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified."
NEW_SRC_DATE = "read 5 Oct 2026 (specification edited that day). Source-verified 5 October 2026."
STAMP = "<p>Last checked against build v26.39.2-210868d on 10/1/2026.</p>"
RECHECK = "<p>Updated to the 5 October 2026 specification; not yet re-checked against a build.</p>"
HOLD_RECHECK = "<p>AUTOMATION: HOLD - updated to the 5 October 2026 specification; not yet re-checked on a Part Sales build</p>"
READY = "<p>AUTOMATION: READY</p>"

def rebuild(exp, results=None, qs=None, behaviour_changed=True, marker=None, standing=None):
    head, rest = exp.split("<p></p><p><strong>Source", 1)
    src, rest = rest.split("<p></p><p><strong>Exact quotes", 1)
    quotes_part = rest.split("(for reproducibility)</strong></p>", 1)[1]
    old_quotes = quotes_part.split("</ul>", 1)[0] + "</ul>"
    if results is not None:
        head = "<p><strong>Expected results</strong></p>" + ul_raw(esc(r) for r in results)
    assert OLD_SRC_DATE in src or NEW_SRC_DATE in src, "source date pattern missing"
    src = src.replace(OLD_SRC_DATE, NEW_SRC_DATE)
    qhtml = quotes_html(qs) if qs is not None else old_quotes
    if behaviour_changed:
        tail = "<p></p>" + RECHECK + (marker or HOLD_RECHECK)
    else:
        assert STAMP in exp and READY in exp
        tail = "<p></p>" + STAMP + READY
    if standing:
        tail += (f"<p>&mdash; &mdash; &mdash;</p><p><strong>Where this stands for testing:</strong> {esc(standing[0])} "
                 f"<strong>What we are waiting on:</strong> {esc(standing[1])}</p>")
    return (head + "<p></p><p><strong>Source" + src + "<p></p><p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
            + qhtml + tail)

def pre_add(pre, items):  # append items to an <ol>
    return pre[:-5] + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ol>"

def keep_quote(exp, anchor):
    m = re.search(rf"<li><strong>{re.escape(anchor)}:</strong> &ldquo;(.*?)&rdquo;</li>", exp)
    return (anchor, html.unescape(m.group(1)))

# ---------------------------------------------------------------- edits
S1_N2 = "A user who holds none of the permissions above sees the core row and its charge, but is offered neither Return Core nor Cancel Return, on a part sale or a work order. If that user sends either action by any other route, the system refuses it"
EDITS = {}

def e154591(c):
    return dict(
        custom_preconds=pre_add(c["custom_preconds"], [
            'A service work order for the same customer with a received part carrying a core: Work Orders -> New Work Order; add a part with a Core Charge (e.g. $79.99) and Receive it.']),
        custom_steps=ol([
            "Sign in as User X, open the part sale, and on the received core row look for Return Core and Cancel Return.",
            "Confirm User X can still see the core row and its charge.",
            "Still as User X, open the service work order and on its received core row look for Return Core and Cancel Return.",
            "Sign in as User Y and try to open the part sale's Parts grid."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "On the part sale, User X sees the core row and its charge but is offered neither Return Core nor Cancel Return.",
            "On the service work order, User X is likewise offered neither Return Core nor Cancel Return.",
            "User Y (no See Financial Data) cannot reach the part sale parts grid at all and never sees a core row; this project does not open part sales to those users.",
            "Not checkable by hand: if User X sends Return Core or Cancel Return by any route other than the screens, the system refuses it. A manual tester has no way to send an action outside the screens, so this part is left to automation."],
            qs=[Q("S1-N2", S1_N2), keep_quote(c["custom_expected"], "S1-N5")]))
EDITS[154591] = ("now", e154591)

def e154595(c):
    return dict(
        title="Move a charged core to a work order (not available today)",
        custom_steps=ol([
            "On the part sale, open the bulk menu and the row menu on the part line and look for a way to move the part onto a service work order.",
            "Only if such a move exists on this build: choose the service work order, complete the move, then open the work order and read the state of the moved core and what the technician is asked."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "Today: the specification says ShopView has no way to move a part from a part sale onto a service work order, so step 2 cannot be run - mark this case Blocked (not Failed) and note what you saw.",
            "If you do find such a move on this build, tell the QA lead, because the specification says it does not exist yet; then run step 2.",
            "When that move exists: the charged core arrives on the work order unanswered, so the technician is asked Ok / Not Ok exactly as on any other work order core."],
            qs=[Q("S1-R25", "ShopView has no such move today"),
                Q("S1-R25", "If ShopView adds a way to move a part from a part sale onto a service work order, a charged core arrives unanswered, so the technician is asked Ok / Not Ok exactly as on any other work order core")],
            marker="<p>AUTOMATION: HOLD - ShopView has no move from a part sale onto a service work order yet (specification, 5 October 2026)</p>",
            standing=("The specification (edited 5 October 2026) describes this only for the day ShopView adds a way to move a part from a part sale onto a service work order; that move does not exist today, so this case is Blocked.",
                      "ShopView adding that move. Nothing is needed from the tester until then.")))
EDITS[154595] = ("now", e154595)

R17 = dict(
    item=Q("S1-R17", "The core charge row and its Core credit row both take the QuickBooks item from the product and service mapped to the core's part category, so a returned core nets to $0 on that one item"),
    neg=Q("S1-R17", "The Core credit row is a negative line, -$79.99 on a $79.99 core, with the same parts tax treatment; it is a negative line on the invoice, not a QuickBooks credit memo, so it reduces the revenue the core charge row adds"),
    unm=Q("S1-R17", "If a line's product and service has no QuickBooks item, the whole invoice is held back and lands in the Unexported report until it is mapped, exactly as a work order invoice with an unmapped part line. No row is ever dropped and none is sent under a substitute item"),
    fee=Q("S1-R17", "Fee and discount rows post on the shop's fee and discount items, as on a work order"))
MAPPED = "In ShopView's QuickBooks settings, the core's part category is mapped to a product and service that has a QuickBooks item (e.g. part category \"Cores\" mapped to an item such as \"Core Charges\")."

def e154596(c):
    return dict(
        title="Core rows sync to QuickBooks on the core's part-category item",
        custom_preconds=pre_add(c["custom_preconds"], [MAPPED,
            "A second part sale, seeded the same way, whose core uses a part category whose product and service has NO QuickBooks item; return its core too."]),
        custom_steps=ol([
            "Create Invoice on the first sale and let it sync to QuickBooks.",
            "Open the resulting invoice in QuickBooks and find the core charge line and the Core credit line.",
            "Read each line's item, amount and tax, and confirm the Core credit is a negative invoice line (not a credit memo).",
            "Add the two core amounts on that item together.",
            "Create Invoice on the second sale (unmapped item), then open the Unexported report."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "The core charge line ($79.99) and the Core credit line (-$79.99) both sit on the QuickBooks item mapped to the core's part category, so the returned core nets to $0.00 on that one item ($79.99 + -$79.99 = $0.00).",
            "The Core credit is a negative invoice line of -$79.99 with the same parts tax treatment - not a QuickBooks credit memo.",
            "For the second sale, the whole invoice is held back and listed in the Unexported report until the item is mapped; no line is dropped and none is sent under a different item.",
            "Any fee or discount rows post on the shop's fee and discount items, as on a work order."],
            qs=[R17["item"], R17["neg"], R17["unm"], R17["fee"]]))
EDITS[154596] = ("now", e154596)

def e154640(c):
    return dict(
        custom_preconds=pre_add(c["custom_preconds"], [MAPPED]),
        custom_steps=ol([
            "In QuickBooks, open the synced invoice and read the core charge line and the Core credit line: item, amount and tax.",
            "Add the two amounts on that item together.",
            "Compare the QuickBooks Core credit amount to the document's -$79.99 Core credit row."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "The Core credit is a negative invoice line of exactly -$79.99 with the same parts tax treatment as the core charge.",
            "The core charge ($79.99) and the Core credit (-$79.99) are on the same QuickBooks item - the one mapped to the core's part category - and add up to exactly $0.00 on it.",
            "It is a negative line, not a credit memo; the QuickBooks amount equals the document's -$79.99 Core credit row to the cent."],
            qs=[R17["neg"], R17["item"]]))
EDITS[154640] = ("now", e154640)

def e154598(c):  # re-cite only: grid text moved from S1-R22 to new S1-R27; behaviour unchanged
    return dict(custom_expected=rebuild(c["custom_expected"], behaviour_changed=False, qs=[
        keep_quote(c["custom_expected"], "S1-R20"),
        Q("S1-R22", "The parent and child rendering is the customer document only. The document is what the customer reads, and that is where the relationship needed drawing"),
        Q("S1-R27", "On the parts grid the core stays its own row alongside the part, as it is today. The Core credit row is not drawn on the grid at all; once the core has been returned, the grid’s core row carries the Returned badge and nothing else changes there")]))
EDITS[154598] = ("now", e154598)

def e154608(c):
    return dict(
        title="Edit tax rate: locked once invoiced, back on reversal, needs permission",
        custom_preconds=ol([
            "You are signed in as a user with the Part sales -> Create & Edit permission, on the build under test.",
            'A customer to sell to exists; if none does, create one first: Customers -> New Customer (e.g. "4 Star Truck Repair").',
            "An invoiced part sale with no payment applied. Seed it:",
            '↳ Part Sales -> New Part Sale, select the customer (e.g. "4 Star Truck Repair"); on the Parts tab click Add Part and set a Sell Price (e.g. $290.91).',
            "↳ Receive its parts so the sale reaches Complete, then click Create Invoice. Do not apply any payment.",
            "A second tax rate exists to switch to (e.g. 6.00%).",
            "Also a test user WITHOUT Part sales -> Create & Edit (set under Settings -> Staff / Roles)."]),
        custom_steps=ol([
            "On the invoiced sale, open the Financial Info card and look for Edit tax rate.",
            "Reverse the invoice (the Reverse invoice action) and read the sale's status.",
            "On the Financial Info card, use Edit tax rate to pick the second tax rate (e.g. 6.00%) and save.",
            "Click Create Invoice again; on the new invoice read the tax rate, then look for Edit tax rate on the card.",
            "Sign in as the user without the permission, open a part sale, and look for the Edit tax rate control."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "On the invoiced sale the Financial Info card is read-only and Edit tax rate is not shown.",
            "After reversing the invoice the sale is back to Complete and Edit tax rate is offered again; the new rate (e.g. 6.00%) saves.",
            "The new invoice carries the rate that was set before it was created (e.g. 6.00%), and the card is read-only again.",
            "A user without Part sales -> Create & Edit does not see Edit tax rate at all."],
            qs=[Q("S3-N1", "Once the part sale is invoiced or paid, the card is read-only and the action is not offered"),
                Q("S3-N1", "Reversing the invoice unlocks it again, as on a work order: the reversal puts the sale back to Complete, and the card can be edited whenever the sale is not invoiced or paid"),
                Q("S3-N1", "The next invoice locks the rate it carries then"),
                keep_quote(c["custom_expected"], "S3-N2")]))
EDITS[154608] = ("now", e154608)

def e154625(c):
    return dict(
        custom_steps=ol([
            "On the Finance tab, find and click Add Deposit.",
            "Read the dialog fields and the pre-filled Memo; compare the number in the Memo with the sale number shown on the part sale (e.g. P4-413).",
            "Confirm Add Deposit is available while the sale is Estimate, Approved or Complete.",
            "Take a deposit (e.g. $50.00), then change the sale's status to Declined; look for Add Deposit again and check the deposit already taken is still listed."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "The Finance tab shows Add Deposit; clicking it opens the same Create Deposit dialog a work order uses (Deposit Date, Payment Method, Deposit Amount, Reference Number, Memo).",
            'The Memo pre-fills "Deposit for Part Sale " followed by the sale number exactly as the sale shows it (e.g. "Deposit for Part Sale P4-413").',
            "Add Deposit is available while the sale is Estimate, Approved or Complete.",
            "While the sale is Declined, Add Deposit is not offered, and the deposit already on the sale stays."],
            qs=[keep_quote(c["custom_expected"], "S8-R1"),
                Q("S8-R2", "The dialog is the one a work order uses, worded for a part sale, and the memo pre-fills with \"Deposit for Part Sale \" followed by the sale number exactly as the sale shows it, for example \"Deposit for Part Sale P4-413\""),
                Q("S8-R3", "A deposit can be added while the sale is Estimate, Approved or Complete"),
                Q("S8-R3", "It is not offered while the sale is Declined; a deposit already on a declined sale stays")]))
EDITS[154625] = ("now", e154625)

def e154635(c):
    return dict(
        title="Collect in Portal waits for portal part-sale deposits; rest is live",
        custom_steps=ol([
            "Open Add Deposit and, in the Create Deposit dialog, read the state of Collect in Portal and any reason it shows.",
            "Confirm every other Add Deposit / Record Deposit behaviour works (e.g. record a $50.00 deposit with Record Deposit)."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "If this build does not yet let the Customer Portal take part sale deposits, Collect in Portal stays disabled and shows the portal's reason.",
            "If the Customer Portal does take part sale deposits on this build, Collect in Portal is live (the portal deposit cases then apply).",
            "Either way, every other deposit behaviour on the part sale works."],
            qs=[Q("S8-N4", "If a release ships without SV-10261, Collect in Portal stays disabled and shows the portal's reason"),
                Q("S8-N4", "S8-R8 and S8-R11 are live when the Customer Portal accepts part sale deposits (SV-10261)"),
                Q("S8-N4", "Every other requirement in this story is live")]))
EDITS[154635] = ("now", e154635)

def e154634(c):  # punctuation-only quote re-sync
    exp = c["custom_expected"].replace("S8-R10's disabled", "S8-R10’s disabled")
    return dict(custom_expected=rebuild(exp, behaviour_changed=False))
EDITS[154634] = ("now", e154634)

# ---- Automated (custom_atmstatus 3) - prepared, applied ONLY with the QA lead's go-ahead (Rule 71)
def punct(anchor, old, new):
    def f(c):
        exp = c["custom_expected"]; assert old in exp, (anchor, old)
        return dict(custom_expected=rebuild(exp.replace(old, new), behaviour_changed=False))
    return f
EDITS[154586] = ("automated", punct("S1-R14", "a part row's size and weight rather than an adjustment row's", "a part row’s size and weight rather than an adjustment row’s"))
EDITS[154589] = ("automated", punct("S1-R5a", "\"This will put that part back onto the part sale.\"", "“This will put that part back onto the part sale.”"))
EDITS[154601] = ("automated", punct("S1-R24", "\"Charged to the customer until the core is returned.\"", "“Charged to the customer until the core is returned.”"))
EDITS[154603] = ("automated", punct("S1-N10", "that core's own price", "that core’s own price"))
# C154602 needs no edit: its S1-R26 quote ends before the changed cross-reference "(S1-R22)" -> "(S1-R27)".
# meaning changes on Automated cases are drafted in stale_fix_automated_2026_10_05.py once the bodies are read


ROLE = "You are signed in as a user with the Part sales -> Create & Edit permission, on the build under test."
CUST = 'A customer to sell to exists; if none does, create one first: Customers -> New Customer (e.g. "4 Star Truck Repair").'
SEED_CORE = ["A part sale created on or after the release, carrying a part with a core charge. Seed it with these standard steps:",
    '↳ Open Part Sales from the main menu and start a New Part Sale; select the customer (e.g. "4 Star Truck Repair").',
    '↳ On the Parts tab, click Add Part; set the Description (e.g. "Water Pump") and the Sell Price to a test amount (e.g. $517.55).',
    "↳ In the Core column of that row, enter a Core Charge greater than 0 (e.g. $79.99), then save the row."]

def e154593(c):
    return dict(
        title="Return Core returns the whole of one received core row",
        custom_preconds=ol([ROLE, CUST, "A part sale with a special-order part carrying a core, part-delivered. Seed it:",
            '↳ Part Sales -> New Part Sale, select the customer; on the Parts tab click Add Part as a special-order part, set the Quantity to 10 (e.g.) and enter a Core Charge (e.g. $79.99).',
            "↳ Order the 10, then Receive only 6 of them (a partial delivery)."]),
        custom_steps=ol([
            "On the Parts grid, read the core rows and the quantity on the received core row.",
            "On that core row, click Return Core and look for any option to return only part of the row (e.g. 3 of the 6).",
            "Complete the return and read what was returned.",
            "Receive the remaining 4, then read the core rows again and look for Return Core on the new row."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "The 6 received arrive as their own received row with their own core row of 6.",
            "Return Core on that row returns all 6; there is no way to return only part of one row.",
            "When the 4 still owed arrive, they get their own core row of 4 with its own Return Core."],
            qs=[Q("S1-R10", "Each delivery of a special-order part arrives as its own received row with its own core row, exactly as on a service work order: 10 ordered and 6 received gives a core row of 6, and Return Core on it returns those 6"),
                Q("S1-R10", "A return covers the whole quantity of one received core row"),
                Q("S1-R10", "Within one row there is no way to return part of it"),
                Q("S1-R10", "The 4 still owed get their own core row, and their own Return Core, when they arrive")]))
EDITS[154593] = ("automated", e154593)

def e154597(c):
    return dict(
        title="Reversing keeps the core rows; an auto-applied deposit blocks it",
        custom_preconds=pre_add(c["custom_preconds"], [
            "A second part sale seeded the same way, with a deposit taken before invoicing (Finance tab -> Add Deposit -> Record Deposit, e.g. $50.00); then Create Invoice, so the deposit is applied automatically."]),
        custom_steps=ol([
            "On the first invoiced sale (no payment), reverse the invoice (the Reverse invoice action).",
            "Confirm the invoice and its customer transaction are deleted and the sale returns to its rows.",
            "Read whether the Core charge and Core credit rows are still present, and whether the Core credit blocked the reversal.",
            "On the second sale (deposit applied at invoicing), try to reverse the invoice and read the result.",
            "In that sale's payment history, reverse the payment that applied the deposit, then read the deposit's status on the sale.",
            "Reverse the invoice now; then click Create Invoice again and read whether the deposit is applied again."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "Reversing the first invoice deletes the invoice and its customer transaction and the sale returns to the rows it was carrying: the Core charge stands and, if the return still stands, so does the Core credit.",
            "The Core credit row does not block the reversal; the Core credit is a row on the document, not a customer credit.",
            "On the second sale the reversal is refused while the automatically applied deposit is applied, as on a work order.",
            "After reversing that payment the deposit shows Held on the sale, and the invoice can then be reversed.",
            "The next invoice applies the deposit again."],
            qs=[keep_quote(c["custom_expected"], "S1-R19"),
                Q("S1-R19", "It is a row on the document, not a customer credit"),
                Q("S1-R19", "A deposit applied automatically at invoicing (S8-R5) is a payment, so the reversal is refused while it is applied, exactly as on a work order"),
                Q("S1-R19", "Staff first reverse the payment that applied it; the deposit returns to Held on the sale, the invoice can then be reversed"),
                Q("S1-R19", "the next invoice applies the deposit again")]))
EDITS[154597] = ("automated", e154597)

def e154611(c):
    return dict(
        title="A Complete part sale with received parts gets the received-parts refusal",
        custom_preconds=ol([CUST, "Two objects. Seed them:",
            "↳ A part sale holding received parts, at Complete: Part Sales -> New Part Sale, select the customer, Add Part, then Order and Receive the part (receiving takes the sale to Complete).",
            "↳ A Complete service work order (Work Orders -> New Work Order, taken to Complete).",
            "Signed in with Part sales -> Create & Edit."]),
        custom_steps=ol([
            "On the Complete part sale holding received parts, open the menu -> Delete Part Sale and read the refusal message.",
            "On the Complete service work order, try to delete it."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            'The part sale is refused with "Part sale cannot be deleted because it has received parts. Please return or reassign all received parts before deleting." - never with the work order\'s "Completed ... cannot be deleted" message.',
            "The Complete service work order still cannot be deleted (unchanged).",
            "Not checkable by hand: a Complete part sale with nothing received can only be produced outside the screens, so the \"a Complete part sale deletes\" half is left to automation."],
            qs=[Q("S4-R5", "A part sale can be deleted while it is Complete"),
                Q("S4-R5", "a part sale skips the work order's \"Completed ... cannot be deleted\" check, so a Complete sale holding received parts is refused with the received-parts message of S4-N3, never with the Completed one"),
                keep_quote(c["custom_expected"], "S4-N3"), keep_quote(c["custom_expected"], "S4-N4"),
                Q("S4-R5", "A Complete sale with nothing received is only reachable through the API, and is verified there")]))
EDITS[154611] = ("automated", e154611)

def e154618(c):
    return dict(
        title="The rep locks once invoiced, unlocks on reversal; non-reps unpickable",
        custom_preconds=ol([ROLE, CUST,
            "Two staff members marked as sales representatives (Settings -> Staff), e.g. \"Dana Lee\" and \"Sam Ortiz\".",
            "An invoiced part sale with no payment applied, Sales Representative set to the first rep. Seed it:",
            '↳ Part Sales -> New Part Sale, select the customer; set Sales Representative to "Dana Lee" (e.g.); Add Part with a Sell Price (e.g. $290.91).',
            "↳ Receive its parts so the sale reaches Complete, then click Create Invoice. Do not apply any payment.",
            "A staff member who is NOT marked as a sales representative exists (Settings -> Staff)."]),
        custom_steps=ol([
            "On the invoiced sale, try to change the Sales Representative field and read the captured attribution.",
            "Reverse the invoice (the Reverse invoice action) and try the Sales Representative field again; change it to the second rep (e.g. \"Sam Ortiz\").",
            "Click Create Invoice again and read the Sales Representative the new invoice captured.",
            "On an open sale, open the Sales Representative picker and look for the non-rep staff member."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "On the invoiced sale the Sales Representative field is read-only and the attribution captured at invoicing does not change.",
            "After reversing the invoice the field can be edited again (e.g. changed to \"Sam Ortiz\").",
            "The next invoice captures the representative afresh (e.g. \"Sam Ortiz\", not \"Dana Lee\").",
            "A staff member not marked as a sales representative does not appear in the picker and cannot be selected."],
            qs=[keep_quote(c["custom_expected"], "S5-N3"),
                Q("S5-N3", "Reversing the invoice unlocks the field again, as on a work order"),
                Q("S5-N3", "the next invoice captures the representative afresh"),
                keep_quote(c["custom_expected"], "S5-N4")]))
EDITS[154618] = ("automated", e154618)

def e154624(c):
    return dict(
        title="A split leaves the deposit, may move every line, carries the core",
        custom_preconds=ol([ROLE, CUST, "Three part sales. Seed them:",
            "↳ Sale A: New Part Sale + two parts, one with a Core Charge (e.g. $79.99); Finance tab -> Add Deposit -> Record Deposit (e.g. $50.00).",
            "↳ Sale B: seeded the same way as Sale A, with its own deposit (e.g. $50.00).",
            "↳ Sale C: a separate sale already invoiced (Create Invoice) to test the split refusal."]),
        custom_steps=ol([
            "On Sale A, select the line with the core and use the bulk menu -> Split Part Sale; read where the deposit ends up.",
            "Confirm the selected line moves with its parts, returns and core to the new sale.",
            "On Sale B, select every line and use Split Part Sale; read what the original Sale B keeps.",
            "On the original Sale B, reverse its held deposit, then on the new sale use Add Deposit for the same amount (e.g. $50.00).",
            "On Sale C (invoiced), try to split it."]),
        custom_expected=rebuild(c["custom_expected"], results=[
            "The deposit stays with the original sale (a split does not move a deposit), as when a work order is split.",
            "The split moves each selected line with its parts and returns, so a core and its charge travel with the line and are returned, if at all, on whichever sale the line lands on.",
            "Moving every line is allowed; the original Sale B then keeps the deposit and no lines.",
            "The held deposit on the original can be reversed, and the deposit can then be added on the new sale.",
            "An already-invoiced sale cannot be split."],
            qs=[keep_quote(c["custom_expected"], "S7-N3"),
                Q("S7-N3", "A split may move every line, as a work order split may; the original then keeps the deposit and no lines"),
                Q("S7-N3", "To carry the deposit across, staff reverse it on the original, which a held deposit allows, and add it on the new sale"),
                keep_quote(c["custom_expected"], "S7-N4")]))
EDITS[154624] = ("automated", e154624)

# ---------------------------------------------------------------- run
def main():
    snap_dir = f"{HERE}/snapshots-2026-10-05"; os.makedirs(snap_dir, exist_ok=True)
    log = []
    for cid, (batch, fn) in EDITS.items():
        if APPLY and batch != BATCH: continue
        c = api(f"get_case/{cid}")
        atm = c.get("custom_atmstatus")
        if atm == 3 and batch != "automated":
            print(f"[STOP] C{cid} is Automated now - moved out of the 'now' batch"); continue
        payload = fn(c)
        if not APPLY:
            print(f"[DRY] {batch:9} C{cid} atm={atm} fields={list(payload)} title={payload.get('title', c['title'])[:70]}"); continue
        json.dump(c, open(f"{snap_dir}/C{cid}-before.json", "w"), indent=1)
        api(f"update_case/{cid}", payload)
        after = api(f"get_case/{cid}")
        ok = all((after.get(k) or "") == v for k, v in payload.items())
        json.dump(after, open(f"{snap_dir}/C{cid}-after.json", "w"), indent=1)
        log.append({"case": f"C{cid}", "op": "update_case", "http": 200, "verified": ok, "atmstatus": atm, "fields": list(payload)})
        print(f"[OK] C{cid} verified={ok} atm={atm}")
    if APPLY:
        p = f"{HERE}/stale-fix-log-2026-10-05.json"
        old = json.load(open(p)) if os.path.exists(p) else []
        json.dump(old + log, open(p, "w"), indent=1)

if __name__ == "__main__":
    main()
