"""The rewritten body of every OPEN Filters ticket, in the QA lead's five-part shape.

Shape, in order, and nothing else:
  1 Description      concise, does not over-explain
  2 Steps to reproduce, preceded by ONE environment line
  3 Current behaviour  plain layman words
  4 Expected behaviour plain layman words
  5 a line break, then Source

Named test data is folded INTO the steps (Standing Rule 50): SV-8821 was closed as
"cannot reproduce" because our steps named no data. A single plain developer line is
allowed inside Current behaviour where it is genuinely what locates the fault.

`media` entries are the EXISTING attachment media nodes, preserved so a picture that is
already on the ticket is shown at the point it helps instead of dangling.
"""

BRANCH_DESKTOP = ("QA branch sv8785 — https://sv8785.qa.shopview.com/workorders. "
                  "Desktop browser, signed in as an Admin.")
BRANCH_PHONE = ("QA branch sv8785 — https://sv8785.qa.shopview.com/workorders. "
                "Phone-sized browser, 390 x 844 with touch on, signed in as an Admin.")

SPEC = "the Filters specification (Confluence page 572030978), version 19"

TICKETS = {

    # ------------------------------------------------------------------ SV-8845
    "SV-8845": {
        "description": [
            "A Work Orders link that already carries a filter works on a desktop screen "
            "but not on a phone. On a phone the filter buttons light up as though the "
            "filter had been applied, while the list underneath shows a completely "
            "different set of work orders.",
        ],
        "env": BRANCH_PHONE,
        "steps": [
            "On a phone, or in a browser window 390 pixels wide with touch turned on, "
            "sign in as an Admin and pick the location Staging Heavy Duty - 9919.",
            "Open this exact address: "
            "https://sv8785.qa.shopview.com/workorders?status=declined&tab=all",
            "Read the filter buttons above the list.",
            "Read the status and the customer name on the work order cards below them.",
            "For a contrast in the same sitting, open the same address again in a "
            "desktop-sized window.",
        ],
        "current": [
            ("p", "The filter buttons say a filter is on — \"All Filters (1)\" and "
                  "\"Status (1)\" are both highlighted in blue."),
            ("p", "The cards listed are not Declined work orders at all. They are "
                  "Estimate work orders for the customer Aagate Landscaping; the first "
                  "three are S2-15017, S2-14846 and S2-13145."),
            ("p", "The same address in a desktop window lists Declined work orders "
                  "correctly, so this happens only on the phone layout."),
            ("p", "For a developer: the list request the phone sends asks for status "
                  "\"estimate\" instead of the \"declined\" the address asked for. "
                  "Choosing Status and then Paid by hand is sent correctly, so only "
                  "filter state arriving from the address bar is affected."),
            ("p", "The two screenshots below were taken on the phone layout at the "
                  "moment described above."),
            ("media", ["7d8081e6-e8ae-498d-ad5f-a028429046bc",
                       "79cea153-1115-48bd-85a2-550147615ccd"]),
        ],
        "expected": [
            "The page opens with the Declined filter already applied and lists only "
            "Declined work orders, exactly as it does on a desktop screen.",
        ],
        "source": [
            f"Epic SV-8785, story SV-8797 (Mobile Filter Bar), and {SPEC}.",
            "Requirement S11-R2: \"When a user opens a URL that contains filter state, "
            "the Work Orders page loads with those filters pre-applied and the table "
            "already filtered\".",
            "Requirement S12-R2 makes it apply on a phone too: \"The filter chips "
            "behave like desktop with one exception (see S12-R5): tapping a chip opens "
            "its dropdown, selections update the chip appearance, and 'Clear filters' "
            "appears when active\". The one exception it names is about holding "
            "selections behind an Apply button, not about which records are listed.",
        ],
    },

    # ------------------------------------------------------------------ SV-8846
    "SV-8846": {
        "description": [
            "On a phone there is no Clear Filters button, so a user who has switched "
            "several filters on cannot switch them all off in one go. Each filter has "
            "to be opened and cleared one at a time. The button is there on a desktop "
            "screen.",
        ],
        "env": BRANCH_PHONE,
        "steps": [
            "On a phone, or in a browser window 390 pixels wide with touch turned on, "
            "sign in as an Admin and open Work Orders on the All tab.",
            "Tap the Status button, then tap Paid. The list narrows to Paid work orders "
            "and the button now reads \"Status (1)\".",
            "Look for a \"Clear Filters\" button — in the row of filter buttons and "
            "anywhere else on the page.",
            "For a contrast in the same sitting, do the same two taps on the same "
            "account in a desktop-sized window and look again.",
        ],
        "current": [
            ("p", "There is no Clear Filters button anywhere on the phone screen, even "
                  "though the Status button is highlighted and reads \"Status (1)\" and "
                  "the All Filters button reads \"All Filters (1)\"."),
            ("p", "The only way to remove a filter is to open each one in turn and use "
                  "Clear Selection inside it."),
            ("p", "On the same account in a desktop window the Clear Filters button "
                  "does appear, so this is specific to the phone layout."),
            ("p", "The two screenshots below show the phone screen with the filter on "
                  "and no Clear Filters button present."),
            ("media", ["c0e48765-de57-4774-8e7c-b19cdc05c687",
                       "8922699b-f045-4135-9151-daa407db8dfb"]),
        ],
        "expected": [
            "Once at least one filter is on, a \"Clear Filters\" button appears on the "
            "phone just as it does on a desktop screen, so every filter can be removed "
            "in one tap.",
        ],
        "source": [
            f"Epic SV-8785, story SV-8797 (Mobile Filter Bar), and {SPEC}.",
            "Requirement S7-R3: \"When at least one filter is active, a 'Clear filters' "
            "button appears in the filter bar to the right of all chips\".",
            "Requirement S12-R2 applies it to a phone: \"The filter chips behave like "
            "desktop with one exception (see S12-R5): tapping a chip opens its "
            "dropdown, selections update the chip appearance, and 'Clear filters' "
            "appears when active\". Requirement S12-R6 closes with the same point: "
            "\"'Clear selection' and 'Clear filters' behave as on desktop.\"",
        ],
    },

    # ------------------------------------------------------------------ SV-8871
    "SV-8871": {
        "description": [
            "A saved Customer, Lead Technician or Service Advisor filter comes back "
            "switched on but without its value on the button. The button reads only "
            "\"Customer\" instead of \"Customer: Iibay Landscaping\", so the list is "
            "filtered by something the screen no longer names. The Status and Asset on "
            "Site buttons keep their value correctly, so a user sees one button naming "
            "its value beside another that does not.",
        ],
        "env": BRANCH_DESKTOP,
        "steps": [
            "Sign in as an Admin and open Work Orders on the All tab with no filters on.",
            "Click the Customer button and pick the customer Iibay Landscaping. The "
            "button correctly reads \"Customer: Iibay Landscaping\" and the list "
            "narrows.",
            "Leave the page and come back. Any of these four does it: open a work order "
            "and click back; refresh the page; close the browser completely and sign in "
            "again; or open the same link in a new window.",
            "Read the Customer button.",
            "Repeat the whole thing with the Lead Technician button, picking Admin "
            "ShopView, and again with the Service Advisor button, picking Admin "
            "ShopView.",
            "For a contrast, repeat it once more with the Status button, picking Paid.",
        ],
        "current": [
            ("p", "The button comes back blue, so it is clearly switched on, but it "
                  "reads only \"Customer\" — the customer's name is gone."),
            ("p", "The filter itself is still working: the list is still narrowed to "
                  "that customer, and opening the button shows the name with a tick "
                  "beside it."),
            ("p", "The same happens on the Lead Technician and Service Advisor "
                  "buttons. It does not happen on Status or Asset on Site — "
                  "\"Status: Paid\" comes back correctly."),
            ("p", "It happens every time, on all four ways back to the page, on all "
                  "three of those buttons."),
            ("p", "For a developer: the three affected filters are the ones whose "
                  "choices are fetched from the server; the button's label is drawn "
                  "before the name for the saved value has arrived and is not drawn "
                  "again once it does."),
        ],
        "expected": [
            "The button still reads \"Customer: Iibay Landscaping\" after coming back "
            "to the page, so the user can see which customer the list is filtered by "
            "without opening the button.",
        ],
        "source": [
            f"Epic SV-8785, stories SV-8792 (Active Filter Chip Appearance) and "
            f"SV-8795 (Filter Persistence), and {SPEC}.",
            "Requirement S7-R1: \"When a filter has one or more values selected, the "
            "chip changes to an active/highlighted visual state (blue pill) and "
            "displays the selected value(s)\". The last five words are the part that is "
            "missing.",
            "Requirement S10-R1: \"When the user navigates away from the Work Orders "
            "page (e.g., to a Work Order detail, then back), the filter selections and "
            "collapsed/expanded state are restored exactly as they were left\".",
        ],
    },

    # ------------------------------------------------------------------ SV-8912
    "SV-8912": {
        "description": [
            "On a phone there is no page search for the work order list. The magnifier "
            "button in the action row opens the application-wide search instead, and "
            "that does not narrow the list. Page search works normally on a desktop "
            "screen.",
        ],
        "env": BRANCH_PHONE,
        "steps": [
            "On a phone, or in a browser window 390 pixels wide with touch turned on, "
            "sign in as an Admin and open Work Orders. There are 30 work orders in the "
            "list on the All tab.",
            "Look at the action row. The only search control is the magnifier button.",
            "Tap the magnifier button.",
            "Type the customer name Bahampton Holdings, which has 6 work orders, so a "
            "working page search would visibly narrow the list to those 6.",
            "Watch the work order list and the address bar as you type.",
            "For a contrast in the same sitting, type the same name into the page "
            "search on a desktop-sized window.",
        ],
        "current": [
            ("p", "There is no page search on the phone at all. Tapping the magnifier "
                  "opens the application-wide search box, with its own close button "
                  "beside it."),
            ("p", "Typing Bahampton Holdings into it does not narrow the list. The "
                  "list stays at 30 work orders and the address bar stays as it was, "
                  "with no search added to it."),
            ("p", "The same name typed into the page search on a desktop window does "
                  "narrow the list correctly, so the search term is not the problem — "
                  "the control is simply missing on the phone."),
            ("p", "For a developer: the desktop page-search control is not present in "
                  "the page at all on a phone-sized screen, and the Create Work Order "
                  "button keeps a width of 332 pixels on a 390 pixel screen, so there "
                  "is no free space in the action row for a search field to open into."),
        ],
        "expected": [
            "On a phone the page search opens in place inside the action row, about 162 "
            "pixels wide, and narrows the work order list as the user types, exactly as "
            "it does on a desktop screen. The Create Work Order button shrinks to its "
            "natural width to make room. The application-wide search is a separate "
            "control and does not stand in for it.",
        ],
        "source": [
            f"Epic SV-8785, story SV-8798 (Page Search), and {SPEC}.",
            "Requirement S13-R16: \"Mobile uses the same inline expansion as desktop. "
            "There is no modal, no separate search screen, and no mobile-only state in "
            "the component. Tapping the collapsed control expands it in place within "
            "the action row, moves focus into the field and raises the keyboard\".",
            "Requirement S13-R17: \"On mobile the expanded field fills the remaining "
            "width of the action row rather than taking the fixed 180px desktop width. "
            "On Work Orders that resolves to 162px. All other toolbar actions remain "
            "visible and in position throughout; nothing is hidden while searching\".",
            "Requirement S13-R18: \"To create that room, the primary CTA on mobile uses "
            "its natural hug width instead of stretching to fill the row: 'New Work "
            "Order' is 144px, the same width it has on desktop, not 211px.\"",
            "Requirement S13-R9 keeps the two searches apart: \"Search is scoped "
            "strictly to the records in the current table. It never returns results "
            "from another table, another page, another module, or any content outside "
            "that table.\" So the application-wide search cannot stand in for the page "
            "search.",
        ],
    },
}
