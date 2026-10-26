"""26 Oct 2026, QA lead: "If you have to restructure the whole test case to make it fit the standards of being the best Runnable test
case according to the world's best standards, please create it that way." Trial layout (one case first): Objective, Scenario, Test
data (each record: what it must be + example), Before you start, then Steps (one action each), Expected results (one per step),
a Pass/Fail line, a blank line, and the unchanged source block (quotes, design reference, AUTOMATION line)."""
LAYOUT_V2 = {
 "S1-01": dict(
   objective='Check that a new work order whose customer has no sales representative shows the Sales Representative field '
             'directly under Service Advisor, reading "Unassigned", as plain text when the mouse is not over it.',
   data=[("{Location-A}", "a location of your shop where you are signed in with the Admin role", "Staging Heavy Duty - 9919"),
         ("{Customer-A}", 'a customer with no sales representative (in Edit Customer, its Sales Representative field reads "Unassigned")',
          "ZZAUTOTEST SSR Fleet"),
         ("{Work-order-1}", "a work order created for {Customer-A} at {Location-A}, not invoiced or paid, on which nobody has picked a sales representative",
          "S2-40001")],
   before=["You are signed in with the Admin role at {Location-A}.",
           "You are on the Work Orders page, on a desktop or laptop computer with a mouse (not a phone or a touch screen)."],
   passfail='Pass: both steps show exactly what is described above. Fail: anything differs (for example the field is missing, sits '
            'elsewhere, reads a name, or shows a box, arrow or button at rest); write down the step number and attach a screenshot of the card.'),
}
