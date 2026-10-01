# -*- coding: utf-8 -*-
"""Author SV-10398 (per-fee QuickBooks income-account mapping) cases, QA lead 2026-10-01: in scope,
separate folder, runnable by a manual QA tester (Rule 114). New 4-point format via gf_deferred:
top testing-method banner, bottom author note (last). No release banner (not deferred). --apply to write."""
import sys
sys.path.insert(0,"build/gap-fill")
import gf_deferred as G

CITE=("story SV-10398 (Per-fee QBO account mapping); client feature request logged from the Double J "
 "Trailers HubSpot deal, client email thread 22 Sep 2026. No PRD or formal acceptance criteria yet")
NOTE=("This is a client feature request (Double J Trailers; bookkeeper Alix Farnsworth). Today ShopView "
 "maps a single 'Fee item' under Settings > QuickBooks, so every fee posts to that one income account. "
 "The ask is to map each fee type to its own QuickBooks Product/Service (income account), the same way "
 "labor and parts already map separately. Critically, the shipping charge is income-only and must NOT "
 "affect COGS - the carrier's actual cost is expensed separately when the carrier bills. There is no "
 "PRD or formal acceptance criteria yet, so these cases are derived from the request and should be "
 "re-checked when a spec is written.")
MARK="story SV-10398 (status Open; no QA build; QuickBooks-integration feature); not build-verified."
XSYS=("verifying what posts to QuickBooks is a cross-system check - a person finalises the sale in "
 "ShopView, opens the connected QuickBooks test company, and reads the posted invoice/transaction; an "
 "automated harness would need a QuickBooks sandbox and API access to assert it.")
PRE=[
 "A ShopView test organization connected to a QuickBooks Online (QBO) sandbox / test company, with the QuickBooks integration set up and syncing.",
 "In QBO, at least two income Products/Services exist to map to, e.g. 'Shipping Income' and 'CC Fee Income' (examples).",
 "Logged in as a user with access to Settings > QuickBooks and to creating part sales / invoices.",
 "A test customer and a sellable part, e.g. customer 'ZZAUTOTEST Double J' and part 'ZZAUTOTEST Widget' (examples).",
]

def run():
    s=G.add_section("Founder Mode / QuickBooks per-fee income mapping (SV-10398) - QA Additions 2026-10-01")
    G.add(s,"Settings QuickBooks: map each fee type to its own income account",
        None,CITE,("auto",),PRE,
        ["Open Settings.","Open the QuickBooks area.","Find the fee mapping.",
         "Map the 'Shipping' fee to the QBO income account 'Shipping Income' (example).",
         "Map the 'CC Fee' to the QBO income account 'CC Fee Income' (example).","Save."],
        ["Each distinct fee type can be mapped to its own QuickBooks Product/Service (income account) - not just one shared 'Fee item'.",
         "Both mappings save and are shown against their fee types afterwards."],
        CITE+".",
        [("SV-10398 Requested behaviour","Allow each distinct fee type to be mapped to its own QBO Product/Service (income account) - the same way labor and parts already map to different income accounts - instead of every fee collapsing into the single mapped Fee item.")],
        NOTE,MARK)
    G.add(s,"A part sale's two fees post to their own QuickBooks income accounts",
        None,CITE,("manual",XSYS),
        PRE+["The two fee types are already mapped (Shipping -> 'Shipping Income', CC Fee -> 'CC Fee Income')."],
        ["Create a part sale / invoice for the test customer with the test part.",
         "Add a 'Shipping' fee, e.g. $50.00 (example).","Add a 'CC Fee', e.g. $12.00 (example).",
         "Finalise / invoice the sale so it syncs to QuickBooks.",
         "Open the synced invoice / transaction in the QBO test company and read each fee line's income account."],
        ["In QuickBooks, the shipping fee posts to 'Shipping Income' and the CC fee posts to 'CC Fee Income'.",
         "The two fees do NOT collapse into a single shared Fee-item income account."],
        CITE+".",
        [("SV-10398 Use case","Double J wants to charge Shipping as a fee on the customer invoice and have it post to its own income account (e.g., “Shipping Income”), separate from the CC Fee income account, so the P&L stays clean."),
         ("SV-10398 Example","add a “Shipping” fee on a part sale / invoice -> maps to “Shipping Income” in QBO, while the CC fee continues mapping to “CC Fee Income” - each fee to its own account.")],
        NOTE,MARK)
    G.add(s,"A shipping fee posts as income only and does not affect COGS",
        None,CITE,("manual",XSYS),
        PRE+["The 'Shipping' fee is mapped to the income account 'Shipping Income' (example)."],
        ["Create and finalise a part sale with a 'Shipping' fee, e.g. $50.00 (example), so it syncs to QuickBooks.",
         "Open the synced transaction in the QBO test company.",
         "Read the account the shipping fee posted to.",
         "Check whether the shipping charge created any cost-of-goods-sold (COGS) / expense entry."],
        ["The shipping charge posts to the income account ('Shipping Income') only.",
         "The shipping charge creates NO COGS / expense entry - the carrier's actual cost is expensed separately when the carrier bills, so this is purely income mapping."],
        CITE+".",
        [("SV-10398 Use case","Important: the shipping charge must NOT impact COGS - the actual carrier shipping cost is already expensed when the carrier bills them; this is purely an income mapping for the shipping charged to the customer.")],
        NOTE,MARK)
    G.add(s,"Labor and parts keep their own QuickBooks income accounts (unchanged)",
        None,CITE,("manual",XSYS),
        PRE+["Labor and parts already map to their own separate income accounts in the existing QuickBooks setup."],
        ["Create a part sale that has labor, parts AND at least one fee.",
         "Finalise / invoice it so it syncs to QuickBooks.",
         "Open the synced invoice in the QBO test company and read the income accounts for the labor line and the parts line."],
        ["Labor and parts continue to post to their own respective income accounts, exactly as before.",
         "Adding per-fee mapping does not disturb the existing labor / parts income-account mapping."],
        CITE+".",
        [("SV-10398 Requested behaviour","...the same way labor and parts already map to different income accounts..."),
         ("SV-10398 Adjacent","Broader income-account mapping (Parts/Labor/Shop-Supplies) is handled in the QBO connect.")],
        NOTE,MARK)
    G.save("build/gap-fill/qbo-fees-created-log.json")
    print("section:",s)

if __name__=="__main__": run()
