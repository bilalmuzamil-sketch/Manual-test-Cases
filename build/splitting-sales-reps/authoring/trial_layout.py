"""26 Oct 2026, QA lead: "If you have to restructure the whole test case to make it fit the standards of being the best Runnable test
case according to the world's best standards, please create it that way." Trial layout (one case first): Objective, Scenario, Test
data (each record: what it must be + example), Before you start, then Steps (one action each), Expected results (one per step),
a Pass/Fail line, a blank line, and the unchanged source block (quotes, design reference, AUTOMATION line)."""
LAYOUT_V2 = {
 "S1-01": dict(
   pattern=True,   # 26 Oct 2026: the QA lead's own pattern for this case ("See this pattern and format the test case")
   pre=["Sign in as an Admin at the test location.",
        "Use a customer with no Sales Representative assigned.",
        "Have an open, uninvoiced work order for that customer, with no Sales Representative assigned, one approved labor line and one part.",
        "Use a desktop browser at least 1024 pixels wide."],
   results=[["The fields appear in this order: Lead Technician → Service Advisor → Sales Representative.",
             "Sales Representative appears directly below Service Advisor, with its label on the first line and Unassigned on the second.",
             "Its text style, size, weight and left alignment match the other two fields.",
             "No border, dropdown arrow or button appears around or beside the field."]]),
}
