COMMON_ACCESS = ("<li>Google Analytics: you can open the analytics property the QA build sends to (QA and staging share it) "
  "(Admin &gt; DebugView shows each event within seconds, because the QA build sends in debug mode) and the Story 12 "
  "reports Milos Vasic builds there. If you cannot open DebugView, write \"not checked by hand\" for the event checks "
  "and pass or fail on what you can see on the Work Orders page.</li>")
SIGNIN = ("<li>Sign in on the QA branch (sv10043) with the Admin quick-login button on the sign-in page. Use a desktop "
  "browser window at least 1024 px wide (narrower windows show only the List).</li>"
  "<li>Work in one location for the whole case, shown in the top bar next to the bell (e.g. \"Staging Heavy Duty - 9919\"). "
  "To change it: your initials at the top right &gt; Change Location.</li>")
NEW = {
97026: dict(
 pre="<p><strong>Preconditions</strong></p><ul><li>About 15 minutes today, plus 5 minutes the next day (the reports are not live).</li>"
  + SIGNIN + COMMON_ACCESS +
  "<li>Events to look for in Google Analytics &gt; Admin &gt; DebugView: work_orders_display_view, work_orders_field_load, "
  "work_orders_density_load. Each shows a source: default (never changed) or saved (chosen earlier).</li></ul>"
  "<p><strong>Setup</strong></p><ol>"
  "<li>Settings &gt; Staff: add a brand-new user \"ZZAUTOTEST Newbie\" at this location with a role that has Work Orders View, "
  "and finish the invite so they can sign in. Do not open Work Orders as this user yet. If that name has been used before, "
  "add a new user and read the expected results with the new name.</li>"
  "<li>As Admin (the dispatcher): Work Orders &gt; Board View &gt; Density &gt; pick Comfortable. Then sign out.</li></ol>",
 steps="<ol><li>Sign in as ZZAUTOTEST Newbie, open Work Orders and click Board View. In DebugView, read the source on the display, "
  "field and density events.</li>"
  "<li>Sign out, sign in as Admin, open Work Orders and click Board View. Read the same sources in DebugView.</li>"
  "<li>The next day, open the Story 12 density and field reports for the test date.</li></ol>"),
97033: dict(
 pre="<p><strong>Preconditions</strong></p><ul><li>About 20 minutes, spread over two days of the same week (Monday to Sunday); "
  "the report is read after that week ends.</li>" + SIGNIN + COMMON_ACCESS +
  "<li>Board View starts every new user with VIN/Serial off and Total price on.</li></ul>"
  "<p><strong>Setup</strong></p><ol>"
  "<li>Settings &gt; Roles &amp; Permissions: create a role with Work Orders View but without See financial data "
  "(e.g. \"ZZAUTOTEST No Money\").</li>"
  "<li>Settings &gt; Staff: add four new users at this location and finish each invite so they can sign in "
  "(e.g. \"ZZAUTOTEST F3 Rate U1\" to \"U4\"). U1, U2 and U3 get a role with Work Orders View and See financial data; "
  "U4 gets the role from step 1.</li>"
  "<li>Check: as U4, Board View &gt; Fields to display does not offer Total price.</li></ol>",
 steps="<ol><li>Day 1: sign in as U1, open Work Orders &gt; Board View &gt; Fields to display, and turn VIN/Serial on, off, then on again.</li>"
  "<li>Day 2: sign in as U2, open Board View and turn VIN/Serial on.</li>"
  "<li>Day 2: sign in as U3, open Board View and turn Total price off.</li>"
  "<li>Day 2: sign in as U4 and open Board View. Change nothing.</li>"
  "<li>After the week ends, open the Board View field selection report for that week (filtered to U1 to U4 if the report allows).</li></ol>"),
97034: dict(
 pre="<p><strong>Preconditions</strong></p><ul><li>About 20 minutes, within one week (Monday to Sunday); the reports are read after that week ends.</li>"
  + SIGNIN + COMMON_ACCESS + "</ul>"
  "<p><strong>Setup</strong></p><ol>"
  "<li>Settings &gt; Staff: add four new users at this location with a role that has Work Orders View, and finish each invite so "
  "they can sign in (e.g. \"ZZAUTOTEST F3 Weekly U1\" to \"U4\"). They must be new, so none has used Tech View or Board View "
  "before. Do not open either view as them before the steps.</li></ol>",
 steps="<ol><li>U1: open Work Orders 5 times this week; each time switch to Board View. Set density to Compact.</li>"
  "<li>U2: open Work Orders twice; switch to Tech View. Set density to Comfortable.</li>"
  "<li>U3: open Work Orders once and stay on List.</li>"
  "<li>U4: open Work Orders once and switch to Tech View. Leave density as it is (Regular).</li>"
  "<li>After the week ends, open the weekly display usage report and the density report for these four users.</li></ol>"),
}
