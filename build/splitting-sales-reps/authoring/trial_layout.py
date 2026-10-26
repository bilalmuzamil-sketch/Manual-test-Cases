"""26 Oct 2026, QA lead: "If you have to restructure the whole test case to make it fit the standards of being the best Runnable test
case according to the world's best standards, please create it that way." Trial layout (one case first): Objective, Scenario, Test
data (each record: what it must be + example), Before you start, then Steps (one action each), Expected results (one per step),
a Pass/Fail line, a blank line, and the unchanged source block (quotes, design reference, AUTOMATION line)."""
LAYOUT_V2 = {
 "S1-01": dict(
   iso=True,
   objective='Prove that a new work order whose customer has no sales representative shows the Sales Representative field '
             'directly under Service Advisor, reading "Unassigned", as plain text when the mouse is not over it.',
   priority="Medium",
   setup=["Sign in to ShopView with a user that has the Admin role, and choose {Location-A} as your location.",
          "Open the Customers page and create a customer, {Customer-A}. In the New Customer window set Sales Representative "
          "to \"Unassigned\" (or leave it if it already reads so) and save. (If you use an existing customer instead, open Edit Customer and check that Sales "
          "Representative reads \"Unassigned\".)",
          "Open the Work Orders page and create a work order for {Customer-A} at {Location-A}. Do not change its Sales "
          "Representative and do not invoice it. Write down its number: this is {Work-order-1}.",
          "Go back to the Work Orders page. Use a desktop or laptop computer with a mouse, not a phone or a touch screen."],
   inputs=[("{Location-A}", "your location, for example Staging Heavy Duty - 9919"), ("{Customer-A}", "the customer you created, for example ZZAUTOTEST SSR Fleet"),
           ("{Work-order-1}", "the work order number you wrote down in precondition 3, for example S2-40001")],
   passfail='Pass: what you see at both steps matches the expected results exactly. Fail: anything differs, for example '
            'the field is missing, sits somewhere else, shows a name, or shows a box, an arrow or a button while the mouse is away; '
            'write down the step number and attach a screenshot of the work order card.'),
}
