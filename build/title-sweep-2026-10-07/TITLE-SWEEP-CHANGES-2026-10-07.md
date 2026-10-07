# Title sweep — last 3 weeks of our cases, 7 October 2026

QA lead, 2026-10-07: *"Make sure the last 3 weeks work has those titles Understandable by the manual QA tester while
keeping them short and concise."* Scope: every case we created that was created or changed since 16 Sep 2026 (1,297),
less the 209 Maintenance Reminders cases done earlier the same day; 1,088 reviewed, **765 retitled**, 323 already plain.
Title only. Rule: the screen's own words, no specification shorthand, one check, no semicolons, 80 characters or less.
Mudassir's 43 Part Sales cases were not touched (not ours). Two "Obsoleted" and one "RETIRED" marker titles kept.

## Dashboard (Sep 2026) (53)

| Case | Old title | New title |
|---|---|---|
| [C88594](https://shopview.testrail.io/index.php?/cases/view/88594) (Automated) | Dashboard entry, landing and the six tiles | Dashboard entry point, landing page and the six tiles |
| [C88595](https://shopview.testrail.io/index.php?/cases/view/88595) | Access gate and server-side enforcement | The Dashboard needs the Reports permission, also checked when loading |
| [C88596](https://shopview.testrail.io/index.php?/cases/view/88596) | Access negative - missing Reports permission | Without the Reports permission the Dashboard is not available |
| [C88597](https://shopview.testrail.io/index.php?/cases/view/88597) | The shop logo is inert branding, not navigation | The shop logo on the Dashboard is not a link |
| [C88598](https://shopview.testrail.io/index.php?/cases/view/88598) | Workplace edge cases - switching and none selected | Switching location and having no location selected on the Dashboard |
| [C88599](https://shopview.testrail.io/index.php?/cases/view/88599) | The fixed tile set and order | The Dashboard always shows the same tiles in the same order |
| [C88600](https://shopview.testrail.io/index.php?/cases/view/88600) | No customization controls exist | The Dashboard has no settings to customise it |
| [C88601](https://shopview.testrail.io/index.php?/cases/view/88601) | Report parity - every tile figure equals its report | Every tile figure equals the figure in its report |
| [C88602](https://shopview.testrail.io/index.php?/cases/view/88602) | Measure formulas | How each tile's figure is calculated |
| [C88603](https://shopview.testrail.io/index.php?/cases/view/88603) | Void exclusion, negative revenue, and the n/a state | Voided invoices left out, negative revenue, and the n/a figure |
| [C88604](https://shopview.testrail.io/index.php?/cases/view/88604) | KPI tile anatomy; Revenue and Billing Efficiency lines | KPI tile layout, and the Revenue and Billing Efficiency figures |
| [C88605](https://shopview.testrail.io/index.php?/cases/view/88605) | Technician Efficiency and Utilization headlines and lines | Technician Efficiency and Utilization tile figures |
| [C88606](https://shopview.testrail.io/index.php?/cases/view/88606) | The KPI sparkline and how it buckets the range | The KPI tile's small trend line and how it splits the date range |
| [C88607](https://shopview.testrail.io/index.php?/cases/view/88607) | KPI negatives and extreme values | KPI tiles with no data and with extreme values |
| [C88609](https://shopview.testrail.io/index.php?/cases/view/88609) (Automated) | The At Risk Customers tile - headline, line, window control | The At Risk Customers tile: headline, line and time window |
| [C88610](https://shopview.testrail.io/index.php?/cases/view/88610) | At Risk sparkline, remembered window, and the definition | At Risk trend line, remembered window, and what counts as at risk |
| [C88611](https://shopview.testrail.io/index.php?/cases/view/88611) | Count-tile negatives and edge cases | Count tiles with no data and unusual cases |
| [C88630](https://shopview.testrail.io/index.php?/cases/view/88630) | At Risk line revenue aggregates all at-risk customers, not rows | At Risk revenue adds up all at-risk customers, not table rows |
| [C88612](https://shopview.testrail.io/index.php?/cases/view/88612) (Automated) | View details expands each tile to its own detail content | View details expands each tile to its own detail |
| [C88613](https://shopview.testrail.io/index.php?/cases/view/88613) | The At Risk detail table - ordering and the 500-row cap | The At Risk detail table's order and its 500-row limit |
| [C88614](https://shopview.testrail.io/index.php?/cases/view/88614) | One detail open at a time, and controls that do not expand | Only one detail opens at a time, some controls don't expand a tile |
| [C88615](https://shopview.testrail.io/index.php?/cases/view/88615) | Loading, per-tile failure, and browser-stored choices | Loading, one tile failing, and choices remembered by the browser |
| [C88616](https://shopview.testrail.io/index.php?/cases/view/88616) | Expansion negatives and small-screen behaviour | Expanding tiles on a small screen and when it can't expand |
| [C88617](https://shopview.testrail.io/index.php?/cases/view/88617) (Automated) | Per-tile date ranges - options, updates and independence | Each tile's date range: options, updates, independent of other tiles |
| [C88618](https://shopview.testrail.io/index.php?/cases/view/88618) | Default ranges, not remembered, and partial ranges | Default date ranges, not remembered, and part-period ranges |
| [C88621](https://shopview.testrail.io/index.php?/cases/view/88621) | Value-axis scaling and the 200% cap | Chart scale and the 200% limit |
| [C88622](https://shopview.testrail.io/index.php?/cases/view/88622) | Billing Efficiency lines, ELR on hover, and no extra series | Billing Efficiency lines, labor rate on hover, and no extra lines |
| [C88623](https://shopview.testrail.io/index.php?/cases/view/88623) (Automated) | Report drill-in from the tiles | Opening a report from a Dashboard tile |
| [C88624](https://shopview.testrail.io/index.php?/cases/view/88624) | Embedded chart on the report page - toggle, filters, parity | The chart on the report page: show/hide, filters, matches the Dashboard |
| [C88626](https://shopview.testrail.io/index.php?/cases/view/88626) | Visual conformance - layout, themes and small-screen stacking | Dashboard layout, light and dark themes, and stacking on small screens |
| [C88629](https://shopview.testrail.io/index.php?/cases/view/88629) | New Dashboard visual conformance - cards, panel, pill, icon, themes | New Dashboard look: cards, panel, pill, icons and themes |
| [C88631](https://shopview.testrail.io/index.php?/cases/view/88631) | Dashboard performance budget and per-tile circuit breaker | The Dashboard loads fast, and one slow tile does not block the rest |
| [C88632](https://shopview.testrail.io/index.php?/cases/view/88632) | Sales and Advisor Analysis report corrections ship with a note | Sales and Advisor Analysis report fixes come with a note |
| [C88633](https://shopview.testrail.io/index.php?/cases/view/88633) | Revenue - exact value to the cent, and equals the Sales report | Revenue is exact to the cent and equals the Sales report |
| [C88634](https://shopview.testrail.io/index.php?/cases/view/88634) | Revenue - credit memos and a true negative figure | Revenue with credit memos and a true negative figure |
| [C88635](https://shopview.testrail.io/index.php?/cases/view/88635) | Revenue - voided/no-company invoices excluded, matching the report | Revenue leaves out voided and no-company invoices, like the report |
| [C88636](https://shopview.testrail.io/index.php?/cases/view/88636) | Revenue - Parts/Labor whole-number split and no-split fallback | Revenue splits Parts and Labor as whole numbers, with a fallback |
| [C88637](https://shopview.testrail.io/index.php?/cases/view/88637) | Billing Efficiency - exact to 2dp, equals Advisor Analysis report | Billing Efficiency is exact to 2 decimals and equals Advisor Analysis |
| [C88638](https://shopview.testrail.io/index.php?/cases/view/88638) | Billing Efficiency - total-over-total, not average of advisor % | Billing Efficiency is total over total, not an average of advisors |
| [C88639](https://shopview.testrail.io/index.php?/cases/view/88639) | Technician Efficiency - exact to 2dp, equals the report | Technician Efficiency is exact to 2 decimals and equals the report |
| [C88640](https://shopview.testrail.io/index.php?/cases/view/88640) | Technician Efficiency - per-line tech time split by clocked share | Technician Efficiency splits each line's time by clocked share |
| [C88641](https://shopview.testrail.io/index.php?/cases/view/88641) | Technician Utilization - exact to 2dp, equals the report | Technician Utilization is exact to 2 decimals and equals the report |
| [C88642](https://shopview.testrail.io/index.php?/cases/view/88642) | Sales by Customer - distinct count, voids excluded, no-company grouped | Sales by Customer counts each customer once, voids out, no-company grouped |
| [C88643](https://shopview.testrail.io/index.php?/cases/view/88643) | At Risk count - window boundary, OR test, revenue>$0, voids | At Risk count: window edge, either rule, revenue above $0, voids out |
| [C88644](https://shopview.testrail.io/index.php?/cases/view/88644) | At Risk - day boundary in the workplace timezone | At Risk day edge follows the location's time zone |
| [C88645](https://shopview.testrail.io/index.php?/cases/view/88645) | At Risk - twelve sparkline points recomputed from current data | At Risk trend line's twelve points are recalculated from current data |
| [C88646](https://shopview.testrail.io/index.php?/cases/view/88646) | Ratio measures - a zero denominator reads 'n/a', never 0.00% | A ratio with nothing to divide by reads n/a, never 0.00% |
| [C88647](https://shopview.testrail.io/index.php?/cases/view/88647) | Sparkline - one point per bucket, correct size at each boundary | The trend line has one point per period, correct at each edge |
| [C88648](https://shopview.testrail.io/index.php?/cases/view/88648) | Parity holds at every one of the nine date ranges | Each tile matches its report for all nine date ranges |
| [C88649](https://shopview.testrail.io/index.php?/cases/view/88649) | Filtered parity - a filtered chart equals the report filtered same | A filtered chart equals the report with the same filter |
| [C88650](https://shopview.testrail.io/index.php?/cases/view/88650) | Internal consistency - headline, sparkline and table reconcile | Headline, trend line and detail table all add up the same |
| [C88651](https://shopview.testrail.io/index.php?/cases/view/88651) | Workplace scoping - every figure is for the selected workplace only | Every figure is for the selected location only |
| [C88652](https://shopview.testrail.io/index.php?/cases/view/88652) | No stale window - the tile equals the report right after a change | A tile matches its report straight after a change |

## Digital Inspections (94)

| Case | Old title | New title |
|---|---|---|
| [C88507](https://shopview.testrail.io/index.php?/cases/view/88507) | Note-required option on checkbox and per-axle fields, on by default | Note required option on checkbox and per-axle fields, on by default |
| [C88508](https://shopview.testrail.io/index.php?/cases/view/88508) | A required note is enforced on submit and listed as outstanding | A required note must be filled in to submit, and is listed as outstanding |
| [C88509](https://shopview.testrail.io/index.php?/cases/view/88509) | Note-required rule: negatives and edge cases | Note required: what it does not apply to, and unusual cases |
| [C88510](https://shopview.testrail.io/index.php?/cases/view/88510) | Photo-required-if-Not-OK option, off by default, enforced on submit | Photo required if Not OK: off by default, checked on submit |
| [C88511](https://shopview.testrail.io/index.php?/cases/view/88511) | Photo rule vs unconditional Photo required; target and HEIC | Photo required if Not OK vs Photo required, which answers count, HEIC photos |
| [C88512](https://shopview.testrail.io/index.php?/cases/view/88512) | Photo-required rule: negatives and edge cases | Photo required: what it does not apply to, and unusual cases |
| [C88513](https://shopview.testrail.io/index.php?/cases/view/88513) (Automated) | Choose the target work order before drafting; eligibility and new WO | Choose which work order gets the lines, or a new one, before drafting |
| [C88514](https://shopview.testrail.io/index.php?/cases/view/88514) (Automated) | A generated line behaves as an ordinary approved line | A line built from an inspection behaves like any approved line |
| [C88515](https://shopview.testrail.io/index.php?/cases/view/88515) | Landing on Lines tab, actioned state, and a second-build confirm | After building you land on Lines, the finding is marked done, rebuild asks |
| [C88516](https://shopview.testrail.io/index.php?/cases/view/88516) (Automated) | Permissions gate the build; the server enforces withheld actions | Building lines needs permission, also checked when saving |
| [C88517](https://shopview.testrail.io/index.php?/cases/view/88517) | The build is not offered when its preconditions are not met | Build lines is not offered until the inspection is ready for it |
| [C88518](https://shopview.testrail.io/index.php?/cases/view/88518) (Automated) | Edge cases: long notes, many findings, concurrent/deleted WOs | Building lines with long notes, many findings, or a deleted work order |
| [C88519](https://shopview.testrail.io/index.php?/cases/view/88519) | Build lines from the completed inspection screen, incl. on a phone | Build lines from the completed inspection screen, also on a phone |
| [C88520](https://shopview.testrail.io/index.php?/cases/view/88520) | The summary card, per-verdict counts, and the section review | The summary card, counts per verdict, and the section review |
| [C88521](https://shopview.testrail.io/index.php?/cases/view/88521) | Build lines is absent (not disabled) unless preconditions met | Build lines is hidden, not greyed out, until the inspection is ready |
| [C88522](https://shopview.testrail.io/index.php?/cases/view/88522) (Automated) | Edge cases: deleted work order, concurrent build, reopening | Building lines when the work order is deleted, built twice, or reopened |
| [C88523](https://shopview.testrail.io/index.php?/cases/view/88523) (Automated) | Build lines from the report note, incl. phone and ineligible WO | Build lines from the report note, on a phone and on an ineligible work order |
| [C88524](https://shopview.testrail.io/index.php?/cases/view/88524) | Re-build confirmation is judged on the inspection's current state | Building again asks to confirm, based on the inspection as it is now |
| [C88525](https://shopview.testrail.io/index.php?/cases/view/88525) (Automated) | The note's Build lines action is absent unless preconditions met | The note's Build lines is hidden until the inspection is ready |
| [C88526](https://shopview.testrail.io/index.php?/cases/view/88526) (Automated) | The Inspections tab appears on the asset and lists every inspection | The asset has an Inspections tab that lists every inspection |
| [C88527](https://shopview.testrail.io/index.php?/cases/view/88527) (Automated) | Each column behaves as specified: status, findings, WO, report, action | Inspections tab columns: status, findings, work order, report and action |
| [C88528](https://shopview.testrail.io/index.php?/cases/view/88528) (Automated) | Filters, summary line, 'needs action' definition, counts across perms | Inspections tab filters, summary line and needs-action counts |
| [C88529](https://shopview.testrail.io/index.php?/cases/view/88529) (Automated) | Links vs buttons, phone usability, and the asset on the inspection | Inspections tab links and buttons, phone use, and the inspection's asset |
| [C88530](https://shopview.testrail.io/index.php?/cases/view/88530) | How findings are counted: the single definition, per axle | How findings are counted, once per axle |
| [C88531](https://shopview.testrail.io/index.php?/cases/view/88531) (Automated) | The tab and its actions are withheld by permission and configuration | The Inspections tab and its actions are hidden without permission or setup |
| [C88532](https://shopview.testrail.io/index.php?/cases/view/88532) (Automated) | Edge cases: not-started, all-N/A, deletions, moves, archives, ties, volume | Inspections tab with not-started, all N/A, deleted, moved and many inspections |
| [C88533](https://shopview.testrail.io/index.php?/cases/view/88533) (Automated) | Build from a needs-action row: shared target menu and eligibility | Build lines from a needs-action row, with the same work order choice |
| [C88534](https://shopview.testrail.io/index.php?/cases/view/88534) | After building, the row shows its outcome and counts update | After building, the row shows the result and the counts update |
| [C88535](https://shopview.testrail.io/index.php?/cases/view/88535) (Automated) | The build action and targets are withheld by permission/config | The row's build action is hidden without permission or setup |
| [C88536](https://shopview.testrail.io/index.php?/cases/view/88536) (Automated) | Edge cases: deleted WO, per-row build, a row the viewer can't start | Row build with a deleted work order, per row, or a row you can't start |
| [C88537](https://shopview.testrail.io/index.php?/cases/view/88537) (Automated) | A note records the work order was built from an inspection | A work order note says its lines were built from an inspection |
| [C88538](https://shopview.testrail.io/index.php?/cases/view/88538) (Automated) | An Audit Log entry records the build, from any entry point | The Audit Log records each build, wherever it was started |
| [C88539](https://shopview.testrail.io/index.php?/cases/view/88539) (Automated) | The note and Audit Log carry the same facts, incl. line count | The work order note and Audit Log match, including the line count |
| [C88540](https://shopview.testrail.io/index.php?/cases/view/88540) (Automated) | Edge cases: write failure, deletions, and a split work order | Lines are kept if the note or Audit Log fails, deleted records handled |
| [C88541](https://shopview.testrail.io/index.php?/cases/view/88541) | The ShopCoach brief: its content, structure and constraints | What ShopCoach is told about the inspection findings |
| [C88542](https://shopview.testrail.io/index.php?/cases/view/88542) (Automated) | No typing to get lines; the AI treatment; the brief is preserved | ShopCoach drafts lines with no typing, and its instructions are kept |
| [C88543](https://shopview.testrail.io/index.php?/cases/view/88543) (Automated) | Drafting runs alongside navigation; nothing added until Add Lines | You can move around while ShopCoach drafts, nothing is added until Add Lines |
| [C88544](https://shopview.testrail.io/index.php?/cases/view/88544) (Automated) | Proposed lines arrive selected, editable, traceable; phone modal | Proposed lines arrive ticked, editable and traceable, in a window on a phone |
| [C88545](https://shopview.testrail.io/index.php?/cases/view/88545) (Automated) | The proposed-lines panel is shared with the Line Builder | The proposed lines panel is the same one as the Line Builder's |
| [C88546](https://shopview.testrail.io/index.php?/cases/view/88546) | The brief is verifiable before release and the model is recorded | ShopCoach's instructions can be checked before release, model recorded |
| [C88547](https://shopview.testrail.io/index.php?/cases/view/88547) (Automated) | Negatives: no ShopCoach, passing findings, ungiven parts, deselect all | No ShopCoach, passing findings, unlisted parts and Deselect all |
| [C88548](https://shopview.testrail.io/index.php?/cases/view/88548) (Automated) | Edge cases: empty results, failures, navigation, multi-axle, Monitor | ShopCoach with no results, failures, leaving the page and several axles |
| [C88549](https://shopview.testrail.io/index.php?/cases/view/88549) | Authoring: the Per axle field type, default rows, units, placement | Building a template: the Per axle field, default rows, units, placement |
| [C88550](https://shopview.testrail.io/index.php?/cases/view/88550) | Authoring: editing rows, reference file, axle count, Measurement default | Building a template: editing axle rows, reference file and axle count |
| [C88551](https://shopview.testrail.io/index.php?/cases/view/88551) | Filling: setting up each axle and recording values | Filling an inspection: setting up each axle and recording values |
| [C88552](https://shopview.testrail.io/index.php?/cases/view/88552) | Filling: verdict tinting, worst-wins derivation, the truck diagram | Filling: verdict colours, the worst verdict wins, and the truck diagram |
| [C88553](https://shopview.testrail.io/index.php?/cases/view/88553) | Filling: Single/Dual, axle add/delete/expand, per-row units, layouts | Filling: single or dual wheels, adding and removing axles, row units |
| [C88554](https://shopview.testrail.io/index.php?/cases/view/88554) | Output: the read-only view/report, per-axle counting, per-row findings | The finished report shows per-axle results and findings per row |
| [C88555](https://shopview.testrail.io/index.php?/cases/view/88555) | Negatives: unanswered fields, blank brake type, value-without-verdict | Submitting with unanswered fields, no brake type, or a value without verdict |
| [C88556](https://shopview.testrail.io/index.php?/cases/view/88556) | Edge cases: N/A meanings, free text, road trains, version pinning, units | Per axle with N/A, free text, road trains, older templates and units |
| [C88557](https://shopview.testrail.io/index.php?/cases/view/88557) | Attach one file per question: types, panel, size limit, names | Attach one file per question: file types, panel, size limit and names |
| [C88558](https://shopview.testrail.io/index.php?/cases/view/88558) | The technician opens the file; unrenderable types handled honestly | The technician opens the attached file, unsupported types offer download |
| [C88559](https://shopview.testrail.io/index.php?/cases/view/88559) | Attachments are shop-scoped and survive template republishing | Attached files belong to the shop and stay when the template is republished |
| [C88560](https://shopview.testrail.io/index.php?/cases/view/88560) | Negatives: video, other shops, and removed attachments | Attaching is refused for videos, other shops' files, and removed files |
| [C88561](https://shopview.testrail.io/index.php?/cases/view/88561) | Edge cases: failed upload, replacement, long names, missing file | A failed upload, replacing a file, long names and a missing file |
| [C88562](https://shopview.testrail.io/index.php?/cases/view/88562) | A brand-new template offers only the starting-point choice | A brand-new template only offers to choose a starting point |
| [C88563](https://shopview.testrail.io/index.php?/cases/view/88563) | The starter library: slots, the pending equipment starter, sections | The starter templates, including the coming soon equipment starter |
| [C88564](https://shopview.testrail.io/index.php?/cases/view/88564) | Field properties: measurement row cards and response options | Field settings: measurement row cards and answer options |
| [C88565](https://shopview.testrail.io/index.php?/cases/view/88565) | Field properties: validation errors and the report-wording tooltip | Field settings: validation errors and the report wording tooltip |
| [C88566](https://shopview.testrail.io/index.php?/cases/view/88566) | The canvas: field rows, summaries, and empty sections | The template canvas: field rows, summaries and empty sections |
| [C88567](https://shopview.testrail.io/index.php?/cases/view/88567) | One text field replaces short/long text; the per-axle explanation | One text field replaces short and long text, per-axle explained |
| [C88568](https://shopview.testrail.io/index.php?/cases/view/88568) | Preview mode mounts the fill screen, read-only but the axle control | Preview shows the fill screen read-only, except the axle control |
| [C88569](https://shopview.testrail.io/index.php?/cases/view/88569) | Templates list, per-axle starters, the Axles control, requiredness | Templates list, per-axle starters, the Axles control and required fields |
| [C88570](https://shopview.testrail.io/index.php?/cases/view/88570) | Negatives: reapplying a starting point, cleared labels, descriptors | Choosing a starting point again, clearing labels, and descriptions |
| [C88571](https://shopview.testrail.io/index.php?/cases/view/88571) | Edge cases: last section, deleted selected field, long names, live preview | Deleting the last section or the selected field, long names, live preview |
| [C88572](https://shopview.testrail.io/index.php?/cases/view/88572) | What the report says: content and the removals | What the customer report says, and what it no longer shows |
| [C88573](https://shopview.testrail.io/index.php?/cases/view/88573) | The work order number and inspected date are formatted correctly | The report shows the work order number and inspected date correctly |
| [C88574](https://shopview.testrail.io/index.php?/cases/view/88574) | Who the report is addressed to | Who the customer report is addressed to |
| [C88575](https://shopview.testrail.io/index.php?/cases/view/88575) | What the report must survive: regeneration and republishing | The customer report stays correct when regenerated or republished |
| [C88576](https://shopview.testrail.io/index.php?/cases/view/88576) | Negatives/edge: missing company, missing contact, sparse data, volume | Customer report with no company, no contact, little data or lots of data |
| [C88577](https://shopview.testrail.io/index.php?/cases/view/88577) | Per-axle rendering and touch on a phone | Per-axle fields display and respond to touch on a phone |
| [C88578](https://shopview.testrail.io/index.php?/cases/view/88578) | Reference files, outstanding work, and the phone back control | On a phone: reference files, outstanding work and the back button |
| [C88579](https://shopview.testrail.io/index.php?/cases/view/88579) | Negatives/edge on a phone: scrolling, overlap, many axles, long names | On a phone: scrolling, overlapping items, many axles and long names |
| [C88580](https://shopview.testrail.io/index.php?/cases/view/88580) | Mark OK at three levels: what it sets, never invents, untouched axles | Mark all, section or field OK sets only OK and never adds values |
| [C88581](https://shopview.testrail.io/index.php?/cases/view/88581) | After the press: coverage report, nested reporting, Undo, clearing | After Mark OK: what it covered, Undo, and clearing it |
| [C88582](https://shopview.testrail.io/index.php?/cases/view/88582) | Explaining the scope on demand, and the three phone surfaces | Explaining what Mark OK covers, on the three phone screens |
| [C88583](https://shopview.testrail.io/index.php?/cases/view/88583) | Negatives/edge: no-verdict fields, read-only/Preview, answered fields | Mark OK is not offered on no-verdict fields, in Preview or when submitted |
| [C88584](https://shopview.testrail.io/index.php?/cases/view/88584) | Authoring: the follow-up toggle and the response blocks | Building a template: the follow-up switch and the answer blocks |
| [C88585](https://shopview.testrail.io/index.php?/cases/view/88585) | Authoring: the acknowledgement toggle, slot binding, retention rules | Building a template: acknowledgement switch, renamed answers, what is kept |
| [C88586](https://shopview.testrail.io/index.php?/cases/view/88586) | Authoring: the canvas row, on-demand explanations, file labels | Building a template: the canvas row, explanations and file labels |
| [C88588](https://shopview.testrail.io/index.php?/cases/view/88588) | Filling: the acknowledgement's marker, control, and record | Filling: the acknowledgement marker, its control and what is recorded |
| [C88589](https://shopview.testrail.io/index.php?/cases/view/88589) | Filling: the attached file, the text, and the two layouts | Filling: the attached file, the instruction text and the two layouts |
| [C88590](https://shopview.testrail.io/index.php?/cases/view/88590) | Submit and outstanding items: the acknowledgement gate | Submitting needs every required acknowledgement, listed as outstanding |
| [C88591](https://shopview.testrail.io/index.php?/cases/view/88591) | Preview: every follow-up shown, inert acknowledgement, no banner | Preview shows every follow-up, acknowledgement inactive, no banner |
| [C88592](https://shopview.testrail.io/index.php?/cases/view/88592) | Negatives: per-axle, empty follow-ups, report, ShopCoach, counting | Follow-ups: not on per-axle fields, empty ones blocked, kept off the report |
| [C88593](https://shopview.testrail.io/index.php?/cases/view/88593) | Edge cases: changing a response, republish, Mark OK, long text, missing file | Changing an answer, republishing, Mark OK and long text with follow-ups |
| [C154644](https://shopview.testrail.io/index.php?/cases/view/154644) | Feature flag off: every new inspection surface is absent | With the feature switch off, none of the new inspection screens show |
| [C154645](https://shopview.testrail.io/index.php?/cases/view/154645) | Verdict is never colour alone; colour placement; dark theme | Verdicts never rely on colour alone, and colours work in the dark theme |
| [C154646](https://shopview.testrail.io/index.php?/cases/view/154646) | New read paths are scoped to organisation and workplace | Inspection screens show only this organisation's and location's data |
| [C154647](https://shopview.testrail.io/index.php?/cases/view/154647) | 'Not inspected' is absence of a verdict, never a selectable option | Not inspected means no verdict was given, it is never a choice to pick |
| [C195849](https://shopview.testrail.io/index.php?/cases/view/195849) | Delete a Not started inspection on a completed line (WO Lines: Create & Edit) | Delete a not started inspection on a completed line with Create & Edit |
| [C195850](https://shopview.testrail.io/index.php?/cases/view/195850) | No WO Lines: Create & Edit - Not started inspection stays View mode only | Without WO Lines Create & Edit a not started inspection is view only |
| [C195852](https://shopview.testrail.io/index.php?/cases/view/195852) | Incomplete inspection delete gate is independent of the WO line's status | Deleting an unfinished inspection does not depend on the line's status |
| [C195855](https://shopview.testrail.io/index.php?/cases/view/195855) | A wide Excel sheet converts to a readable layout without clipping columns | A wide Excel sheet turns into a readable layout without cut-off columns |

## Fees & Discounts (1)

| Case | Old title | New title |
|---|---|---|
| [C28538](https://shopview.testrail.io/index.php?/cases/view/28538) (Automated) | Same-named line-level fees combine into one Labor row ahead of named whole-WO rows in the bottom block | Same-named line fees combine into one Labor row before work order rows |

## Founder Mode (September 2026) (185)

| Case | Old title | New title |
|---|---|---|
| [C154587](https://shopview.testrail.io/index.php?/cases/view/154587) (Automated) | Return Core credits the core and badges the row Returned | Return Core credits the core and marks the row Returned |
| [C154588](https://shopview.testrail.io/index.php?/cases/view/154588) (Automated) | A returned core's credit equals the charge, and both are logged | A returned core's credit equals its charge, and both are logged |
| [C154589](https://shopview.testrail.io/index.php?/cases/view/154589) (Automated) | Cancel Return restores the charge after a confirmation | Cancel Return asks to confirm, then restores the core charge |
| [C154590](https://shopview.testrail.io/index.php?/cases/view/154590) (Automated) | Return Core appears only after receipt and before invoicing | Return Core shows only after the part is received and before invoicing |
| [C154592](https://shopview.testrail.io/index.php?/cases/view/154592) (Automated) | Returning a core moves no stock and isn't a vendor credit | Returning a core moves no stock and is not a vendor credit |
| [C154594](https://shopview.testrail.io/index.php?/cases/view/154594) | Only post-release sales charge the core from the quote | Only part sales created after release charge the core from the quote |
| [C154595](https://shopview.testrail.io/index.php?/cases/view/154595) | Move a charged core to a work order (not available today) | Moving a charged core to a work order is not available yet |
| [C154596](https://shopview.testrail.io/index.php?/cases/view/154596) | Core rows sync to QuickBooks on the core's part-category item | Core rows sync to QuickBooks under the core part's category item |
| [C154597](https://shopview.testrail.io/index.php?/cases/view/154597) (Automated) | Reversing keeps the core rows; an auto-applied deposit blocks it | Reversing keeps the core rows, but an auto-applied deposit blocks it |
| [C154598](https://shopview.testrail.io/index.php?/cases/view/154598) | The core parent/child prints on every document, never on the grid | Core charge rows print on every document but not on the parts grid |
| [C154599](https://shopview.testrail.io/index.php?/cases/view/154599) (Automated) | A part sale's reported figures include the charged core | A part sale's reported totals include the charged core |
| [C154602](https://shopview.testrail.io/index.php?/cases/view/154602) (Automated) | Returns count ignores Core credit; the label is document-only | The Returns count ignores Core credit, which shows only on documents |
| [C154603](https://shopview.testrail.io/index.php?/cases/view/154603) (Automated) | A zero core is refused; a picked inventory core bills its price | A $0 core is refused, and an inventory core bills its own price |
| [C154604](https://shopview.testrail.io/index.php?/cases/view/154604) (Automated) | Simultaneous returns are refused; a vendorless core still returns | Two returns at once are refused, and a core with no vendor still returns |
| [C154605](https://shopview.testrail.io/index.php?/cases/view/154605) (Automated) | A core return below a deposit becomes a credit at invoicing | A core return smaller than the deposit becomes a credit at invoicing |
| [C154608](https://shopview.testrail.io/index.php?/cases/view/154608) | Edit tax rate: locked once invoiced, back on reversal, needs permission | Edit tax rate locks once invoiced, unlocks on reversal, needs permission |
| [C154610](https://shopview.testrail.io/index.php?/cases/view/154610) (Automated) | The menu is reordered with Delete last and not red | The menu is reordered with Delete last and not shown in red |
| [C154611](https://shopview.testrail.io/index.php?/cases/view/154611) (Automated) | A Complete part sale with received parts gets the received-parts refusal | A Complete part sale with received parts shows the received-parts message |
| [C154612](https://shopview.testrail.io/index.php?/cases/view/154612) (Automated) | Created is the first entry; a split writes a linked pair | Part Sale Log starts with Created, and a split logs a linked pair |
| [C154613](https://shopview.testrail.io/index.php?/cases/view/154613) | The log is refused without permission and shows only this sale | Part Sale Log needs permission and shows only this part sale |
| [C154614](https://shopview.testrail.io/index.php?/cases/view/154614) | Nothing is backfilled and the work order log is unchanged | Old part sales get no log history, and the work order log is unchanged |
| [C154616](https://shopview.testrail.io/index.php?/cases/view/154616) | The rep is captured at invoicing and logged prev to new | Sales Representative is saved at invoicing and its change is logged |
| [C154617](https://shopview.testrail.io/index.php?/cases/view/154617) (Automated) | An unset rep falls back to the customer's rep, else Unassigned | With no rep set, the customer's rep is used, otherwise Unassigned |
| [C154620](https://shopview.testrail.io/index.php?/cases/view/154620) | The work order grid is unchanged; empty actions leave the cell empty | The work order grid is unchanged, and rows with no action stay empty |
| [C154621](https://shopview.testrail.io/index.php?/cases/view/154621) (Automated) | The bulk and row menus are renamed and title-cased | The bulk and row menu items are renamed in title case |
| [C154623](https://shopview.testrail.io/index.php?/cases/view/154623) (Automated) | The work order is untouched; Notes ships with another project | Work orders are unchanged by the Part Sales tab changes |
| [C154624](https://shopview.testrail.io/index.php?/cases/view/154624) (Automated) | A split leaves the deposit, may move every line, carries the core | A split leaves the deposit behind, can move every line and keeps the core |
| [C154626](https://shopview.testrail.io/index.php?/cases/view/154626) | A deposit shows in payment history and auto-applies at invoicing | A deposit shows in payment history and is applied at invoicing |
| [C154627](https://shopview.testrail.io/index.php?/cases/view/154627) | A deposit isn't gated on a core; Record Deposit uses own methods | Add Deposit works without a core, and Record Deposit has its own methods |
| [C154628](https://shopview.testrail.io/index.php?/cases/view/154628) | Collect in Portal is offered only when the portal says yes | Collect in Portal shows only when the customer portal allows it |
| [C154630](https://shopview.testrail.io/index.php?/cases/view/154630) | A held deposit blocks changing the customer and deleting | A held deposit blocks changing the customer and deleting the part sale |
| [C154631](https://shopview.testrail.io/index.php?/cases/view/154631) | A deposit charges the owning location's account | A deposit is charged to the owning location's payment account |
| [C154633](https://shopview.testrail.io/index.php?/cases/view/154633) | Add Deposit needs both permissions; the server also enforces | Add Deposit needs both permissions, also checked when saving |
| [C154635](https://shopview.testrail.io/index.php?/cases/view/154635) | Collect in Portal waits for portal part-sale deposits; rest is live | Collect in Portal is held until the portal takes part sale deposits |
| [C154636](https://shopview.testrail.io/index.php?/cases/view/154636) | Deposits above the total settle to zero and leave a credit | Deposits above the total bring the balance to zero and leave a credit |
| [C154637](https://shopview.testrail.io/index.php?/cases/view/154637) (Automated) | Charged core: document totals to the exact cent | A charged core makes the document totals correct to the cent |
| [C154638](https://shopview.testrail.io/index.php?/cases/view/154638) (Automated) | Returned core: credit is exact and totals fall back | A returned core's credit is exact and the totals go back down |
| [C154639](https://shopview.testrail.io/index.php?/cases/view/154639) (Automated) | Tax change recalculates to the exact cent; card matches document | Changing the tax rate recalculates totals to the cent on card and document |
| [C154641](https://shopview.testrail.io/index.php?/cases/view/154641) | Deposit above total leaves the exact customer credit | A deposit above the total leaves the exact customer credit |
| [C236960](https://shopview.testrail.io/index.php?/cases/view/236960) | Closing New Customer Payment unpaid reverses the invoice | Closing New Customer Payment without paying reverses the invoice |
| [C236961](https://shopview.testrail.io/index.php?/cases/view/236961) | Smallest deposit is $0.01, zero is refused; portal minimum $1.00 | Smallest deposit is $0.01, $0 is refused, portal minimum is $1.00 |
| [C236962](https://shopview.testrail.io/index.php?/cases/view/236962) | From 768px wide, Return Core and Actions stay visible, no scrolling | At 768px and wider, Return Core and Actions stay visible without scrolling |
| [C154654](https://shopview.testrail.io/index.php?/cases/view/154654) | Unread-only filter: on by default, remembered per user not browser | Unread only is on by default and is remembered for the user, any browser |
| [C154655](https://shopview.testrail.io/index.php?/cases/view/154655) | Mark all read clears unread; disabled with a tooltip when nothing is unread | Mark all read clears unread, and is disabled with a tooltip if none |
| [C154656](https://shopview.testrail.io/index.php?/cases/view/154656) | The inbox follows the active location; customer/asset notes show everywhere | The inbox follows the active location, customer and asset notes show in all |
| [C154658](https://shopview.testrail.io/index.php?/cases/view/154658) | A notification shows sender, reference pill, time, and message with @ tags in place | A notification shows sender, record pill, time and message with tags |
| [C154659](https://shopview.testrail.io/index.php?/cases/view/154659) | The reference pill wording per record type (work order, part sale, line) | The record pill wording for a work order, part sale and line |
| [C154660](https://shopview.testrail.io/index.php?/cases/view/154660) | The Tagged: line names recipients (2 inline + N more), never the author or emails | The Tagged line names recipients (2 then N more), not the author or emails |
| [C154661](https://shopview.testrail.io/index.php?/cases/view/154661) | A single notification toggles read/unread and shows attachments | A notification can be marked read or unread and shows its attachments |
| [C154662](https://shopview.testrail.io/index.php?/cases/view/154662) | The edited stamp wording, and a plain @ left in the text | The Edited stamp wording, and a plain @ left in the message text |
| [C154663](https://shopview.testrail.io/index.php?/cases/view/154663) | The New Note dialog: title, subject, message label and character count | The New Note window: title, subject, message label and character count |
| [C154664](https://shopview.testrail.io/index.php?/cases/view/154664) | Typing @ offers team members then tag groups, with a 7-people cap | Typing @ offers team members, then tag groups, up to 7 people |
| [C154665](https://shopview.testrail.io/index.php?/cases/view/154665) | Tag groups offered (own + public), the Tag groups: pill row and hover | Tag groups offered (your own and public), shown as pills with a hover |
| [C154666](https://shopview.testrail.io/index.php?/cases/view/154666) | The Quick notes: pill row inserts body text; hidden when none | Quick notes pills insert their text, and are hidden if you have none |
| [C154668](https://shopview.testrail.io/index.php?/cases/view/154668) | On Save the note reaches all recipients once, de-duplicated | On Save each recipient gets the note once, even if tagged twice |
| [C154669](https://shopview.testrail.io/index.php?/cases/view/154669) | Tagging yourself: the (You) hint, plain name, notified per preferences | Tagging yourself shows (You) and notifies you by your preferences |
| [C154670](https://shopview.testrail.io/index.php?/cases/view/154670) | No recipient dropdown or send-later; Reminder Date unchanged; customer/asset notes compose the same | New Note has no recipient list or send later, and Reminder Date is unchanged |
| [C154671](https://shopview.testrail.io/index.php?/cases/view/154671) | Inserting a quick note fits 2,000 chars and carries its own tags | A quick note can be inserted up to 2,000 characters and keeps its tags |
| [C154672](https://shopview.testrail.io/index.php?/cases/view/154672) | A tag group counts only while its text remains; a note need not tag anyone | A tag group counts only while its text stays, and tags are optional |
| [C154673](https://shopview.testrail.io/index.php?/cases/view/154673) | Deleting a note refreshes every recipient's inbox except the deleter's | Deleting a note updates every recipient's inbox except the deleter's |
| [C154675](https://shopview.testrail.io/index.php?/cases/view/154675) | Confirming deletes the note for everyone, from every inbox, with its attachments | Deleting a note removes it and its attachments from every inbox |
| [C154676](https://shopview.testrail.io/index.php?/cases/view/154676) | Delete and edit are gated: non-authors without Delete get neither | Users who didn't write a note and lack Delete can't edit or delete it |
| [C154677](https://shopview.testrail.io/index.php?/cases/view/154677) | No archive/restore/delete-forever; a recipient cannot dismiss | There is no archive, restore or delete forever, and no dismiss |
| [C154678](https://shopview.testrail.io/index.php?/cases/view/154678) | The bell opens a four-tab Notifications page, defaulting to Inbox | The bell opens a Notifications page with four tabs, starting on Inbox |
| [C154679](https://shopview.testrail.io/index.php?/cases/view/154679) | All four tabs are shown to any user; each tab has its own address | Every user sees all four tabs, and each tab has its own web address |
| [C154680](https://shopview.testrail.io/index.php?/cases/view/154680) | Without work order and part sale View: page opens, record-based list | Without work order and part sale View the page opens, list by record |
| [C154681](https://shopview.testrail.io/index.php?/cases/view/154681) | The Tag groups tab lists own + public groups with Name/Members/Visibility | The Tag groups tab lists your own and public groups with three columns |
| [C154682](https://shopview.testrail.io/index.php?/cases/view/154682) | New tag group dialog: fields, default-off toggle, help text, location, success | New tag group window: fields, toggle off, help text, location, success |
| [C154683](https://shopview.testrail.io/index.php?/cases/view/154683) | Name required (<=40, stops at 40); at least one member or confirm is disabled | Name is required, up to 40 characters, and needs at least one member |
| [C154684](https://shopview.testrail.io/index.php?/cases/view/154684) | The Name field's fixed @ prefix cannot be removed or reached | The Name field's @ prefix cannot be removed or clicked into |
| [C154685](https://shopview.testrail.io/index.php?/cases/view/154685) | The @ prefix is not part of the name and never doubles | The @ prefix is not part of the saved name and never appears twice |
| [C154686](https://shopview.testrail.io/index.php?/cases/view/154686) | The Members picker offers only active-location staff, including yourself | The Members list offers only this location's staff, including you |
| [C154687](https://shopview.testrail.io/index.php?/cases/view/154687) | Edit a tag group: actions, prefilled dialog, hover, success | Editing a tag group: menu actions, filled-in window, hover and success |
| [C154688](https://shopview.testrail.io/index.php?/cases/view/154688) | Delete a tag group: personal vs public confirmation wording | Deleting a tag group: different wording for personal and public groups |
| [C154689](https://shopview.testrail.io/index.php?/cases/view/154689) | Public groups are shared; personal groups are owner-only | Public groups are shared with everyone, personal groups only with the owner |
| [C154690](https://shopview.testrail.io/index.php?/cases/view/154690) | Duplicate-name checks differ for personal and public groups | Duplicate name checks differ for personal and public groups |
| [C154691](https://shopview.testrail.io/index.php?/cases/view/154691) | Only owners/admins manage public groups; admins can't touch personal ones | Only owners and admins manage public groups, admins can't edit personal ones |
| [C154692](https://shopview.testrail.io/index.php?/cases/view/154692) | The dialog never shows a location; two users may reuse a personal name | The window never shows a location, and two users may share a personal name |
| [C154693](https://shopview.testrail.io/index.php?/cases/view/154693) | Visibility switch hides immediately; empty groups blocked; stale member kept | Visibility change applies at once, empty groups are blocked, members kept |
| [C154694](https://shopview.testrail.io/index.php?/cases/view/154694) | Quick notes tab: own notes only, Name/Preview columns, name search | Quick notes tab lists only your notes, with Name, Preview and search |
| [C154695](https://shopview.testrail.io/index.php?/cases/view/154695) | New quick note dialog: name/body fields, caps, @ tagging, group pills | New quick note window: name and text fields, limits, @ tags, group pills |
| [C154696](https://shopview.testrail.io/index.php?/cases/view/154696) | Edit and delete a quick note, with exact confirmation and success wording | Editing and deleting a quick note, with confirmation and success messages |
| [C154698](https://shopview.testrail.io/index.php?/cases/view/154698) | Preferences tab: Notification preferences card, email toggle, help, save | Preferences tab: the Notification preferences card, email switch and Save |
| [C154699](https://shopview.testrail.io/index.php?/cases/view/154699) | Email toggle governs email only; in-app inbox and bell are always on | The email switch affects email only, the inbox and bell are always on |
| [C154700](https://shopview.testrail.io/index.php?/cases/view/154700) | Preferences are per-user only; unset defaults to email on | Preferences are per user, and email is on until changed |
| [C154701](https://shopview.testrail.io/index.php?/cases/view/154701) | A Part Sale has a Notes tab with full note behaviour and a linking pill | A Part Sale has a Notes tab that works like other notes, with a record pill |
| [C154702](https://shopview.testrail.io/index.php?/cases/view/154702) | Part Sale notes: notified like any note, no Customer Visible, Part Sales View | Part sale notes notify like other notes, without Customer Visible |
| [C154703](https://shopview.testrail.io/index.php?/cases/view/154703) | Any user reaches their own inbox and tabs; no notifications permission exists | Every user can open their own inbox and tabs, no permission needed |
| [C154704](https://shopview.testrail.io/index.php?/cases/view/154704) | Adding a note needs View on that kind of record | Adding a note needs View permission on that kind of record |
| [C154705](https://shopview.testrail.io/index.php?/cases/view/154705) | Only the author edits; delete needs authorship or that record's Delete | Only the author edits a note, deleting needs authorship or Delete |
| [C154706](https://shopview.testrail.io/index.php?/cases/view/154706) | Public tag group: admin edits, only the owner switches public/personal | Admins edit a public tag group, only its owner makes it public or personal |
| [C236963](https://shopview.testrail.io/index.php?/cases/view/236963) | Search starts as a button, opens in place, stays open when cleared | Search starts as a button, opens in place and stays open when cleared |
| [C236964](https://shopview.testrail.io/index.php?/cases/view/236964) | Unread only is one toggle button: filled blue on, outlined off | Unread only is one button, filled blue when on and outlined when off |
| [C236970](https://shopview.testrail.io/index.php?/cases/view/236970) | Tags in a note's message show in blue, other text in normal color | Tags in a note show in blue, the rest of the text in normal colour |
| [C236972](https://shopview.testrail.io/index.php?/cases/view/236972) | For Customer on an attachment needs Edit; view-only sees it disabled | For Customer on an attachment needs Edit, view-only users see it disabled |
| [C236973](https://shopview.testrail.io/index.php?/cases/view/236973) | A note with many images keeps its ⋮ menu on screen, no sideways scroll | A note with many images keeps its ⋮ menu on screen without side scrolling |
| [C154707](https://shopview.testrail.io/index.php?/cases/view/154707) | New Line: fields labeled Title/Description with the questions as placeholders | New Line labels its fields Title and Description, with question hints |
| [C154708](https://shopview.testrail.io/index.php?/cases/view/154708) | The Title label stays put; the canned-line picker is labeled Title and focused | The Title label stays put, and the canned line picker is labelled Title |
| [C154709](https://shopview.testrail.io/index.php?/cases/view/154709) | Empty Title blocks the save with "Title is a required field" | An empty Title blocks saving with "Title is a required field" |
| [C154710](https://shopview.testrail.io/index.php?/cases/view/154710) | Nothing else in the dialog changes; existing lines are not altered | Nothing else in the New Line window changes, existing lines stay as they are |
| [C154711](https://shopview.testrail.io/index.php?/cases/view/154711) | ShopCoach line builder: fields labeled Title/Description, same placeholders | The ShopCoach line builder labels its fields Title and Description too |
| [C154712](https://shopview.testrail.io/index.php?/cases/view/154712) | What ShopCoach generates is unchanged; the line behaves like any other | ShopCoach still generates the same text, and the line works like any other |
| [C154713](https://shopview.testrail.io/index.php?/cases/view/154713) | Invoice line text joins the three segments with spaced hyphens, no labels | Invoice line text joins the three parts with spaced hyphens, no labels |
| [C154714](https://shopview.testrail.io/index.php?/cases/view/154714) | A separator appears only between two present segments (title-only, gaps) | A hyphen appears only between two filled-in parts of the line text |
| [C154715](https://shopview.testrail.io/index.php?/cases/view/154715) | Live sync and downloadable report show identical line text | The QuickBooks sync and the downloaded report show the same line text |
| [C154716](https://shopview.testrail.io/index.php?/cases/view/154716) | An absent narrative is dropped, including the "Tech story missing." placeholder | A missing description is left out, including "Tech story missing." |
| [C154717](https://shopview.testrail.io/index.php?/cases/view/154717) | Over-length line text is shortened to 4,000 bytes from the end, title kept | Line text over 4,000 bytes is shortened from the end, title kept |
| [C154718](https://shopview.testrail.io/index.php?/cases/view/154718) | Values are carried as written, including hyphens and semicolons inside them | Values keep their own hyphens and semicolons as written |
| [C154719](https://shopview.testrail.io/index.php?/cases/view/154719) | Report masks money columns for a no-finance user; line text is never masked | The report hides money for users without financial access, not line text |
| [C154720](https://shopview.testrail.io/index.php?/cases/view/154720) | Only these two routes read this line text; imported history is unaffected | Only the QuickBooks sync and report use this text, imported history is not |
| [C154721](https://shopview.testrail.io/index.php?/cases/view/154721) | Existing QuickBooks invoices keep their text; reversal carries the new text | Existing QuickBooks invoices keep their text, a reversal sends the new text |
| [C154722](https://shopview.testrail.io/index.php?/cases/view/154722) | Parts, shop-supplies and fee/discount lines are unaffected | Parts, shop supplies and fee or discount lines are unchanged |
| [C154723](https://shopview.testrail.io/index.php?/cases/view/154723) | Historical invoice import columns renamed to *Line Title / Line Description | Invoice import columns are renamed to Line Title and Line Description |
| [C154724](https://shopview.testrail.io/index.php?/cases/view/154724) | Old column names still import; a file may mix old and new spellings | Old import column names still work, and a file may mix old and new |
| [C154725](https://shopview.testrail.io/index.php?/cases/view/154725) | Other columns and their order are unchanged; unknown columns still rejected | Other import columns and their order are unchanged |
| [C154726](https://shopview.testrail.io/index.php?/cases/view/154726) | Categories opens sorted by Name A-Z with an ascending arrow, whole list | Categories opens sorted by Name A to Z, with an up arrow |
| [C154727](https://shopview.testrail.io/index.php?/cases/view/154727) | Name header toggles A-Z / Z-A; case-insensitive and numeric-aware | Clicking Name switches A to Z and Z to A, ignoring capitals, numbers in order |
| [C154728](https://shopview.testrail.io/index.php?/cases/view/154728) | QuickBooks Products And Services column sorts A-Z then Z-A | QuickBooks Products And Services column sorts A to Z, then Z to A |
| [C154730](https://shopview.testrail.io/index.php?/cases/view/154730) | A Categories sort survives a reload-in-place; a fresh open resets to Name A-Z | Categories keeps its sort after a reload, a fresh open goes back to Name A-Z |
| [C154732](https://shopview.testrail.io/index.php?/cases/view/154732) | QuickBooks column has no empty state: unmapped shows Parts and sorts under P | Unmapped categories show Parts in the QuickBooks column and sort under P |
| [C154733](https://shopview.testrail.io/index.php?/cases/view/154733) | The Default category stays pinned first under every sort, with its badge | The Default category stays first, with its badge, under every sort |
| [C154734](https://shopview.testrail.io/index.php?/cases/view/154734) | No QuickBooks connection hides the column; a failed check shows one message | Without QuickBooks the column is hidden, a failed check shows one message |
| [C154735](https://shopview.testrail.io/index.php?/cases/view/154735) | Empty Categories list still sortable; no permission blocks the page | An empty Categories list can still be sorted, no permission blocks it |
| [C154736](https://shopview.testrail.io/index.php?/cases/view/154736) | Pricing Matrices opens sorted by matrix name A-Z with an ascending arrow | Pricing Matrices opens sorted by matrix name A to Z, with an up arrow |
| [C154737](https://shopview.testrail.io/index.php?/cases/view/154737) | Matrix Category header toggles A-Z / Z-A; case-insensitive, numeric-aware | Clicking Matrix Category switches A to Z and Z to A, numbers in order |
| [C154738](https://shopview.testrail.io/index.php?/cases/view/154738) | A Pricing Matrices sort survives a reload; a fresh open resets to name A-Z | Pricing Matrices keeps its sort after a reload, a fresh open resets it |
| [C154741](https://shopview.testrail.io/index.php?/cases/view/154741) | Empty Pricing Matrices still sortable; no permission blocks the page | An empty Pricing Matrices list can still be sorted, no permission blocks it |
| [C154742](https://shopview.testrail.io/index.php?/cases/view/154742) | Fixed Rules: three columns sort, click toggles asc/desc, one at a time | Fixed Rules sorts by three columns, one at a time, each click flips order |
| [C154743](https://shopview.testrail.io/index.php?/cases/view/154743) | Part number sort is numeric-aware and case-insensitive | Part number sorting puts numbers in order and ignores capitals |
| [C154744](https://shopview.testrail.io/index.php?/cases/view/154744) | Category sort is numeric-aware; the tab lists only categorised rules | Category sorting puts numbers in order, and only rules with a category show |
| [C154745](https://shopview.testrail.io/index.php?/cases/view/154745) | Fixed price sorts by value: lowest first ascending, highest first descending | Fixed price sorts lowest first ascending and highest first descending |
| [C154746](https://shopview.testrail.io/index.php?/cases/view/154746) | Fixed Rules opens on Part number asc; sort survives reload, resets on open | Fixed Rules opens by Part number ascending and keeps its sort after reload |
| [C154747](https://shopview.testrail.io/index.php?/cases/view/154747) | Every listed fixed rule loads on open; the sort covers all of them | All fixed rules load when the page opens, and the sort covers all of them |
| [C154751](https://shopview.testrail.io/index.php?/cases/view/154751) | Empty Fixed Rules still sortable; no permission blocks the page | An empty Fixed Rules list can still be sorted, no permission blocks it |
| [C154752](https://shopview.testrail.io/index.php?/cases/view/154752) | Active/Inactive tabs, Active selected, each lists its own state | Parts has Active and Inactive tabs, Active selected, each with its own parts |
| [C154753](https://shopview.testrail.io/index.php?/cases/view/154753) | All active on release; tab switch clears selection; tabs alike; empty state | All parts are Active at release, and switching tabs clears the selection |
| [C154755](https://shopview.testrail.io/index.php?/cases/view/154755) | Row click opens the part; the mode adds a 44px checkbox column | Clicking a row opens the part, and the bulk mode adds a checkbox column |
| [C154756](https://shopview.testrail.io/index.php?/cases/view/154756) | In the mode a row click ticks it; header checkbox ticks/clears all loaded | In bulk mode a row click ticks it, the header box ticks or clears all |
| [C154757](https://shopview.testrail.io/index.php?/cases/view/154757) | The bulk bar: placement, contents, count badge, and the disabled-button tooltip | The bulk bar: where it sits, its count, and the disabled button tooltip |
| [C154758](https://shopview.testrail.io/index.php?/cases/view/154758) | The X clears selection & exits; search/filter/sort/paging keep working | The X clears the selection and exits, search, filter and sort still work |
| [C154760](https://shopview.testrail.io/index.php?/cases/view/154760) | Bulk result: success clears mode; failure keeps only failed; tab switch exits | After a bulk change, failures stay ticked and success leaves bulk mode |
| [C154762](https://shopview.testrail.io/index.php?/cases/view/154762) | Nothing ticked keeps Deactivate disabled; no checkbox outside the mode | With nothing ticked Deactivate is disabled, no checkboxes outside the mode |
| [C154763](https://shopview.testrail.io/index.php?/cases/view/154763) | Deactivating a part on an open WO still works; Cycle count blocks bulk | A part on an open work order can be deactivated, Cycle count blocks bulk |
| [C154764](https://shopview.testrail.io/index.php?/cases/view/154764) | Reactivation reuses the same mode and bulk bar, worded Activate | Reactivating uses the same bulk mode and bar, worded Activate |
| [C154765](https://shopview.testrail.io/index.php?/cases/view/154765) | Reactivation moves parts to Active live; nothing ticked disables Activate | Reactivating moves parts to Active at once, Activate disabled if none ticked |
| [C154766](https://shopview.testrail.io/index.php?/cases/view/154766) | New part: tracking toggle defaults ON in its own Inventory tracking section | New part: Inventory tracking switch is on by default in its own section |
| [C154767](https://shopview.testrail.io/index.php?/cases/view/154767) | Toggle OFF hides Min/Max and makes the bin optional; ON requires a default bin | Tracking off hides Min/Max and makes the bin optional, on needs a bin |
| [C154769](https://shopview.testrail.io/index.php?/cases/view/154769) | Tracked-part save errors: missing bin, and no default bin | Saving a tracked part without a bin or default bin shows an error |
| [C154770](https://shopview.testrail.io/index.php?/cases/view/154770) | Turning tracking on assigns/repairs a default bin (qty zero) | Turning tracking on gives the part a default bin with quantity zero |
| [C154771](https://shopview.testrail.io/index.php?/cases/view/154771) | Tracking off hides & clears Min/Max; live Total Quantity; bin-removal error | Turning tracking off hides and clears Min/Max, total updates at once |
| [C154773](https://shopview.testrail.io/index.php?/cases/view/154773) | Confirm zeroes bins & saves untracked; cancel reverts; zero-stock skips it | Confirm sets bins to zero and saves untracked, Cancel undoes the change |
| [C154775](https://shopview.testrail.io/index.php?/cases/view/154775) | Total Quantity sort keeps untracked parts below tracked in both directions | Untracked parts sort below tracked ones by Total Quantity, both ways |
| [C154776](https://shopview.testrail.io/index.php?/cases/view/154776) | New part: free-text Part Number and Part Name, no library lookup step | New part: type Part Number and Part Name freely, no library lookup step |
| [C154777](https://shopview.testrail.io/index.php?/cases/view/154777) | On save the library is matched silently (case- and punctuation-insensitive) | On save the part is matched to the library ignoring capitals and symbols |
| [C154778](https://shopview.testrail.io/index.php?/cases/view/154778) | Multiple library matches prompt a choice; pre-existing parts keep their entry | Several library matches ask you to choose, existing parts keep their entry |
| [C154780](https://shopview.testrail.io/index.php?/cases/view/154780) | Status change needs Delete; without it the menu entry & control are hidden | Changing status needs Delete permission, otherwise the option is hidden |
| [C154781](https://shopview.testrail.io/index.php?/cases/view/154781) | Tracking changes need Delete; the toggle shows but is disabled without it | Changing tracking needs Delete, otherwise the switch shows but is disabled |
| [C154782](https://shopview.testrail.io/index.php?/cases/view/154782) | Unchanged permissions; default roles that carry the Delete setting | Default roles that already have Delete can change part status |
| [C154783](https://shopview.testrail.io/index.php?/cases/view/154783) | Server refuses status/tracking/untracked changes without the Delete permission | Status and tracking changes are refused when saved without Delete |
| [C154784](https://shopview.testrail.io/index.php?/cases/view/154784) | An inactive part is not returned by part lookup on any pick surface | An inactive part cannot be picked anywhere parts are added |
| [C154786](https://shopview.testrail.io/index.php?/cases/view/154786) | Seeing inactive parts needs no extra permission; changing status needs Delete | Seeing inactive parts needs no permission, changing status needs Delete |
| [C154787](https://shopview.testrail.io/index.php?/cases/view/154787) | An existing line whose part goes inactive keeps working; no swap onto it | A line whose part became inactive still works, but cannot switch to it |
| [C154788](https://shopview.testrail.io/index.php?/cases/view/154788) | Historical WOs with inactive parts stay usable; reopening doesn't reactivate | Old work orders with inactive parts still work, reopening keeps them inactive |
| [C154789](https://shopview.testrail.io/index.php?/cases/view/154789) | Setting a part inactive shows a standard confirmation stating the effect | Setting a part inactive asks to confirm and explains the effect |
| [C154790](https://shopview.testrail.io/index.php?/cases/view/154790) | Bulk confirmation states count; result reports success, failure & reasons | Bulk confirmation shows the count, and the result lists any failures |
| [C154791](https://shopview.testrail.io/index.php?/cases/view/154791) | A status change records who/when and takes an optional note (<=255 chars) | A status change records who and when, with an optional note of 255 characters |
| [C154792](https://shopview.testrail.io/index.php?/cases/view/154792) | Current status shows as a badge; each change is its own typed history entry | Status shows as a badge, and each change is its own Part History entry |
| [C154793](https://shopview.testrail.io/index.php?/cases/view/154793) | History entry text with/without note; part note is latest; bulk one per part | Part History wording with and without a note, one entry per part in bulk |
| [C154794](https://shopview.testrail.io/index.php?/cases/view/154794) | Confirmation titles & opening lines: selection vs one part's dialog | Confirmation titles and first lines: bulk selection vs a single part |
| [C154795](https://shopview.testrail.io/index.php?/cases/view/154795) | Deactivation message lines and order, from a selection and from a part's dialog | Deactivation message lines and order, from bulk and from one part |
| [C154796](https://shopview.testrail.io/index.php?/cases/view/154796) | Reactivation message wording, from a part's dialog and from a selection | Reactivation message wording, from one part and from bulk |
| [C154797](https://shopview.testrail.io/index.php?/cases/view/154797) | Note field label & cap; single-from-dialog matches a bulk change of one | The note field's label and limit, and one part matches a bulk of one |
| [C154799](https://shopview.testrail.io/index.php?/cases/view/154799) | Confirm button colour and message-line weights/colours | Confirm button colour and the message lines' weight and colour |
| [C154800](https://shopview.testrail.io/index.php?/cases/view/154800) | Cancel changes nothing; all-fail keeps the selection; no-parts is refused | Cancel changes nothing, all-fail keeps the selection, no parts is refused |
| [C154830](https://shopview.testrail.io/index.php?/cases/view/154830) | Library entries only created by find-or-create; toolbar role-independent | Library entries are only created when a part is saved, for every role |
| [C154832](https://shopview.testrail.io/index.php?/cases/view/154832) | Catalog renamed to Part Library in the menu, page title and edit dialog | Catalog is renamed Part Library in the menu, page title and edit window |
| [C154833](https://shopview.testrail.io/index.php?/cases/view/154833) | Save-failure, delete-success and lookup-source text read Part Library | Save errors, delete success and lookup source now say Part Library |
| [C154835](https://shopview.testrail.io/index.php?/cases/view/154835) | The rename is display-only: no permission, URL or stored-data change | The rename changes only words, not permissions, web addresses or data |
| [C154836](https://shopview.testrail.io/index.php?/cases/view/154836) | Edit dialog shows the part number as text with a status pill and edit button | The edit window shows the part number as text, a status pill and an edit button |
| [C154837](https://shopview.testrail.io/index.php?/cases/view/154837) | The edit button opens an inline field with Cancel/Confirm and a hint | The edit button opens a field with Cancel, Confirm and a hint |
| [C154838](https://shopview.testrail.io/index.php?/cases/view/154838) | Saving a new number renames the part and its library entry in place | Saving a new part number renames the part and its library entry |
| [C154839](https://shopview.testrail.io/index.php?/cases/view/154839) | Create unchanged; a rename spans all locations with a hint and history | Creating parts is unchanged, a rename applies to every location with history |
| [C154840](https://shopview.testrail.io/index.php?/cases/view/154840) | Rename errors: duplicate number, empty field, and empty by another route | Part number errors: already used, left empty, or emptied another way |
| [C154740](https://shopview.testrail.io/index.php?/cases/view/154740) | The default pricing matrix is not pinned; it sorts by its name | The default pricing matrix is not pinned first, it sorts by its name |
| [C154600](https://shopview.testrail.io/index.php?/cases/view/154600) | A fee or discount on a returned core nets to $0 | A fee or discount on a returned core comes to $0 |

## Founder Mode / Fixed Rules - list rules with no category - author: NOT IN THIS RELEASE (QA Additions 2026-10-01) (3)

| Case | Old title | New title |
|---|---|---|
| [C195877](https://shopview.testrail.io/index.php?/cases/view/195877) | Empty Category sorts last in the Fixed Rules list, ascending and descending | An empty Category sorts last in Fixed Rules, both ascending and descending |
| [C195878](https://shopview.testrail.io/index.php?/cases/view/195878) | Fixed rules (N) tab-label count includes rules whose part has no category | The Fixed rules (N) count includes rules whose part has no category |
| [C195879](https://shopview.testrail.io/index.php?/cases/view/195879) | Fixed Rules search finds a category-less rule by Part number and by Fixed price | Fixed Rules search finds a rule with no category by part number or price |

## Founder Mode / QuickBooks per-fee income mapping (SV-10398) - QA Additions 2026-10-01 (1)

| Case | Old title | New title |
|---|---|---|
| [C195893](https://shopview.testrail.io/index.php?/cases/view/195893) | Settings QuickBooks: map each fee type to its own income account | Settings > QuickBooks maps each fee type to its own income account |

## Global Search (158)

| Case | Old title | New title |
|---|---|---|
| [C44812](https://shopview.testrail.io/index.php?/cases/view/44812) | Move focus to the scope tab strip with Tab, then cycle tabs with Left and Right arrows | Press Tab to reach the search tabs, then Left and Right arrows switch tabs |
| [C137996](https://shopview.testrail.io/index.php?/cases/view/137996) | The clear control appears only once you type, and empties the box without closing | The clear (x) button appears once you type and empties the search box |
| [C44814](https://shopview.testrail.io/index.php?/cases/view/44814) | The scope tab strip lists All plus the eight entity tabs in the exact order | Search tabs read All, then the eight record types in a fixed order |
| [C44822](https://shopview.testrail.io/index.php?/cases/view/44822) | Selecting a scope tab shows only that entity's results with its count | Clicking a search tab shows only that type of record, with its count |
| [C45129](https://shopview.testrail.io/index.php?/cases/view/45129) | No Contacts tab or group appears; a contact match returns its company | Searching a contact's name finds its company (there is no Contacts tab) |
| [C44826](https://shopview.testrail.io/index.php?/cases/view/44826) | Clicking 'Show all N' switches the modal to that entity's scope tab | Clicking 'Show all N' opens that record type's tab |
| [C44827](https://shopview.testrail.io/index.php?/cases/view/44827) | Groups appear in the fixed order Work Orders, Customers, Assets, Parts, Vendors, Part Sales, Purchase Orders, Vendor Invoices | Result groups always appear in the same fixed order |
| [C44830](https://shopview.testrail.io/index.php?/cases/view/44830) | Group order follows the v2 eight-entity sequence; pinned top hit above groups | An exact number match sits above the result groups, which keep their order |
| [C44831](https://shopview.testrail.io/index.php?/cases/view/44831) | A Work Order result row shows number + customer, status badge, and unit + year/make/model | A Work Order result shows its number, customer, status and unit |
| [C44834](https://shopview.testrail.io/index.php?/cases/view/44834) | A Part result shows description, part number and a quantity chip colored by stock level | A Part result shows its description, number and stock-coloured quantity |
| [C44844](https://shopview.testrail.io/index.php?/cases/view/44844) | A VIN / serial number requires an exact match after normalization | A VIN or serial number must match exactly (capitals and spaces ignored) |
| [C44846](https://shopview.testrail.io/index.php?/cases/view/44846) | A part number requires an exact match after normalization | A part number must match exactly, a wrong digit finds nothing |
| [C44847](https://shopview.testrail.io/index.php?/cases/view/44847) | Typos in identifier fields do NOT return fuzzy matches | A typo in a VIN, part number or work order number finds nothing |
| [C44848](https://shopview.testrail.io/index.php?/cases/view/44848) | A soft (fuzzy) match is visually indicated | A close (misspelled) match is marked as close on its row |
| [C44849](https://shopview.testrail.io/index.php?/cases/view/44849) | A Part Sale P-number requires an exact match (no fuzzy typo tolerance) | A Part Sale P-number must match exactly, a typo finds nothing |
| [C55713](https://shopview.testrail.io/index.php?/cases/view/55713) | A very short query does not produce noisy fuzzy matches | A very short search does not return loosely matching results |
| [C55714](https://shopview.testrail.io/index.php?/cases/view/55714) | A Purchase Order number and a Vendor Invoice number require an exact match (no fuzzy tolerance) | Purchase order and vendor invoice numbers must match exactly |
| [C55725](https://shopview.testrail.io/index.php?/cases/view/55725) | A clearly unrelated query returns no close (fuzzy) match | A clearly unrelated search returns no close matches |
| [C44853](https://shopview.testrail.io/index.php?/cases/view/44853) | On a Customer page, that customer's assets and work orders are boosted | On a Customer page, that customer's assets and work orders come first |
| [C44854](https://shopview.testrail.io/index.php?/cases/view/44854) | On a Work Order page, parts already on that work order are pushed down | On a Work Order page, parts already on that work order appear lower |
| [C45139](https://shopview.testrail.io/index.php?/cases/view/45139) | A contact-field match scores as a secondary-field match on its company | A company found through its contact ranks below one found by its name |
| [C55707](https://shopview.testrail.io/index.php?/cases/view/55707) | A prefix name match ranks above a whole-word match, which ranks above a fuzzy match | Names starting with the search rank above whole-word, then close, matches |
| [C55724](https://shopview.testrail.io/index.php?/cases/view/55724) | Prefix name match ranks above a whole-word match with all other signals held equal | A name starting with the search ranks above a whole-word match |
| [C55729](https://shopview.testrail.io/index.php?/cases/view/55729) | An exact identifier match is pinned at the very top even when a strong name match exists | An exact number match stays at the top even above a strong name match |
| [C44855](https://shopview.testrail.io/index.php?/cases/view/44855) | First-time empty state shows the placeholder and a single helper line (no quick-create buttons) | First open shows the placeholder and one helper line, no create buttons |
| [C44858](https://shopview.testrail.io/index.php?/cases/view/44858) | Recent activity mixes different entity types using the same row template | Recent activity lists different record types in the same row style |
| [C44860](https://shopview.testrail.io/index.php?/cases/view/44860) | Recent-entities API records views and serves a deduped, permission-filtered list | Opened records appear once in recent activity, only if you can access them |
| [C44880](https://shopview.testrail.io/index.php?/cases/view/44880) | Results are limited to the signed-in user's own tenant | Results show only your own organization's records |
| [C44881](https://shopview.testrail.io/index.php?/cases/view/44881) | An entity type with no accessible records shows no group (and its scope tab shows the empty state) | A record type you cannot access shows no group, and its tab is empty |
| [C44882](https://shopview.testrail.io/index.php?/cases/view/44882) | Permission bundles hide whole groups, their counts and tabs; prices masked without financial access | Missing permissions hide groups, counts and tabs, and prices too |
| [C55705](https://shopview.testrail.io/index.php?/cases/view/55705) | A user WITH Vendor & Order Management access sees Vendor, Purchase Order and Vendor Invoice results | Vendor & Order Management access shows vendors, POs and vendor invoices |
| [C55718](https://shopview.testrail.io/index.php?/cases/view/55718) | Typing the exact number of a record you cannot access does not surface it (no pinned top hit) | Typing the exact number of a record you cannot access does not show it |
| [C55731](https://shopview.testrail.io/index.php?/cases/view/55731) | Flipping only Parts access shows then hides the same part in search | Turning Parts access on and off shows, then hides, the same part |
| [C55732](https://shopview.testrail.io/index.php?/cases/view/55732) | Flipping only Work Orders access shows then hides the same work order | Turning Work Orders access on and off shows, then hides, the same work order |
| [C55733](https://shopview.testrail.io/index.php?/cases/view/55733) | Flipping only Customers access shows then hides the same customer and its vehicle | Turning Customers access on and off shows, then hides, the customer and asset |
| [C55734](https://shopview.testrail.io/index.php?/cases/view/55734) | Flipping only Part Sales access shows then hides the same part sale | Turning Part Sales access on and off shows, then hides, the same part sale |
| [C55735](https://shopview.testrail.io/index.php?/cases/view/55735) | Flipping only Vendor & Order Management access hides the same vendor, PO and invoice | Turning off Vendor & Order Management hides the vendor, PO and invoice |
| [C44897](https://shopview.testrail.io/index.php?/cases/view/44897) | Old global-search path is removed on direct rollout (no feature flag) | Only the new global search exists, with no switch to turn it on |
| [C44898](https://shopview.testrail.io/index.php?/cases/view/44898) | Global search works on mobile/tablet viewports per the mobile design | Global search works on phone and tablet screens |
| [C45133](https://shopview.testrail.io/index.php?/cases/view/45133) | On mobile the scope chip row appears only with a query and lists matched types | On a phone, type chips appear only after typing, for types that match |
| [C45135](https://shopview.testrail.io/index.php?/cases/view/45135) | Mobile first-time, recent and no-results states match web (no quick-create buttons) | On a phone, first-open, recent and no-results screens match the desktop |
| [C44899](https://shopview.testrail.io/index.php?/cases/view/44899) | Purchase Orders searchable; real number format; Receive quick action | Purchase orders are found by their real number and offer Receive |
| [C44900](https://shopview.testrail.io/index.php?/cases/view/44900) | Vendor Invoices are searchable with a tri-state payment badge and no quick action | Vendor invoices are searchable and show their payment state, no action |
| [C45148](https://shopview.testrail.io/index.php?/cases/view/45148) | An unrecognised result type is hidden unless explicitly permitted | A kind of result with no permission rule is hidden |
| [C45158](https://shopview.testrail.io/index.php?/cases/view/45158) | Global search is available with no feature-flag toggle | Global search is on for everyone, with no switch to turn it on |
| [C45160](https://shopview.testrail.io/index.php?/cases/view/45160) | Selecting a result records a usage analytics event | Selecting a result is counted in usage analytics |
| [C44873](https://shopview.testrail.io/index.php?/cases/view/44873) | Quick actions on hover are shown for each entity (v1) | Each record type that has a hover action always shows it |
| [C146197](https://shopview.testrail.io/index.php?/cases/view/146197) | SRI-WO-A1 — The whole matched value is shown, not just what you typed | Work Order results show the whole matched value, not just what you typed |
| [C146198](https://shopview.testrail.io/index.php?/cases/view/146198) | SRI-WO-A2 — A long value is not cut off through the part that matched | Work Order results don't cut off a long value through the matched part |
| [C146199](https://shopview.testrail.io/index.php?/cases/view/146199) | SRI-WO-A3 — The highlight marks the match inside the text, not instead of it | Work Order results highlight the match inside the text, not instead of it |
| [C146200](https://shopview.testrail.io/index.php?/cases/view/146200) | SRI-WO-B1 — Two records sharing what you typed can be told apart | Two work order results sharing what you typed can be told apart |
| [C146201](https://shopview.testrail.io/index.php?/cases/view/146201) | SRI-WO-B2 — Two records with the same bold line differ somewhere you can see | Two work order results with the same bold line differ somewhere visible |
| [C146202](https://shopview.testrail.io/index.php?/cases/view/146202) | SRI-WO-C1 — A match on VIN / serial number shows the FULL value on the row | A work order found by VIN or serial number shows that full value on its row |
| [C146204](https://shopview.testrail.io/index.php?/cases/view/146204) | SRI-WO-C3 — A match on service advisor name shows the FULL value on the row | A work order found by service advisor name shows that full value on its row |
| [C146205](https://shopview.testrail.io/index.php?/cases/view/146205) | SRI-WO-C4 — A match on line item descriptions (parts and labor on the WO) shows the FULL value on the row | A work order found by a line description shows that full value on its row |
| [C146206](https://shopview.testrail.io/index.php?/cases/view/146206) | SRI-WO-C5 — A match on part numbers on the work order's lines (`item_part_numbers`) shows the FULL value on the row | A work order found by a part number on its lines shows the full value |
| [C146207](https://shopview.testrail.io/index.php?/cases/view/146207) | SRI-WO-D1 — The Work Orders row shows everything the specification promised | The Work Order result row shows every detail it should |
| [C146208](https://shopview.testrail.io/index.php?/cases/view/146208) | SRI-WO-I1 — A corrected typo says that it corrected something | Work Order results say when a typo was corrected |
| [C195898](https://shopview.testrail.io/index.php?/cases/view/195898) | SRI-WO-C2 — A match on lead technician name shows the FULL value on the row | A work order found by lead technician name shows that full value on its row |
| [C146209](https://shopview.testrail.io/index.php?/cases/view/146209) | SRI-CUST-A1 — The whole matched value is shown, not just what you typed | Customer results show the whole matched value, not just what you typed |
| [C146210](https://shopview.testrail.io/index.php?/cases/view/146210) | SRI-CUST-A2 — A long value is not cut off through the part that matched | Customer results don't cut off a long value through the matched part |
| [C146211](https://shopview.testrail.io/index.php?/cases/view/146211) | SRI-CUST-A3 — The highlight marks the match inside the text, not instead of it | Customer results highlight the match inside the text, not instead of it |
| [C146212](https://shopview.testrail.io/index.php?/cases/view/146212) | SRI-CUST-B1 — Two records sharing what you typed can be told apart | Two customer results sharing what you typed can be told apart |
| [C146213](https://shopview.testrail.io/index.php?/cases/view/146213) | SRI-CUST-B2 — Two records with the same bold line differ somewhere you can see | Two customer results with the same bold line differ somewhere visible |
| [C146214](https://shopview.testrail.io/index.php?/cases/view/146214) | SRI-CUST-C1 — A match on the customer's own telephone shows the FULL value on the row | A customer found by the customer's own telephone shows the full value |
| [C146215](https://shopview.testrail.io/index.php?/cases/view/146215) | SRI-CUST-C2 — A match on a contact's telephone shows the FULL value on the row | A customer found by a contact's telephone shows that full value on its row |
| [C146216](https://shopview.testrail.io/index.php?/cases/view/146216) | SRI-CUST-C3 — A match on a contact's email address shows the FULL value on the row | A customer found by a contact's email address shows that full value on its row |
| [C146217](https://shopview.testrail.io/index.php?/cases/view/146217) | SRI-CUST-C4 — A match on a contact's name shows the FULL value on the row | A customer found by a contact's name shows that full value on its row |
| [C146218](https://shopview.testrail.io/index.php?/cases/view/146218) | SRI-CUST-C5 — A match on address line 2 shows the FULL value on the row | A customer found by address line 2 shows that full value on its row |
| [C146220](https://shopview.testrail.io/index.php?/cases/view/146220) | SRI-CUST-C7 — A match on state / province shows the FULL value on the row | A customer found by state / province shows that full value on its row |
| [C146221](https://shopview.testrail.io/index.php?/cases/view/146221) | SRI-CUST-C8 — A match on postal code shows the FULL value on the row | A customer found by postal code shows that full value on its row |
| [C146222](https://shopview.testrail.io/index.php?/cases/view/146222) | SRI-CUST-D1 — The Customers row shows everything the specification promised | The Customer result row shows every detail it should |
| [C146223](https://shopview.testrail.io/index.php?/cases/view/146223) | SRI-CUST-I1 — A corrected typo says that it corrected something | Customer results say when a typo was corrected |
| [C146390](https://shopview.testrail.io/index.php?/cases/view/146390) | SRI-CUST-C9 — Two people with the same name at one customer — which one matched? | Two contacts with the same name: the row shows which one matched |
| [C195899](https://shopview.testrail.io/index.php?/cases/view/195899) | SRI-CUST-C6 — A match on city shows the FULL value on the row | A customer found by city shows that full value on its row |
| [C146224](https://shopview.testrail.io/index.php?/cases/view/146224) | SRI-ASSET-A1 — The whole matched value is shown, not just what you typed | Asset results show the whole matched value, not just what you typed |
| [C146225](https://shopview.testrail.io/index.php?/cases/view/146225) | SRI-ASSET-A2 — A long value is not cut off through the part that matched | Asset results don't cut off a long value through the matched part |
| [C146226](https://shopview.testrail.io/index.php?/cases/view/146226) | SRI-ASSET-A3 — The highlight marks the match inside the text, not instead of it | Asset results highlight the match inside the text, not instead of it |
| [C146227](https://shopview.testrail.io/index.php?/cases/view/146227) | SRI-ASSET-B1 — Two records sharing what you typed can be told apart | Two asset results sharing what you typed can be told apart |
| [C146228](https://shopview.testrail.io/index.php?/cases/view/146228) | SRI-ASSET-B2 — Two records with the same bold line differ somewhere you can see | Two asset results with the same bold line differ somewhere visible |
| [C146229](https://shopview.testrail.io/index.php?/cases/view/146229) | SRI-ASSET-C1 — A match on VIN / serial number shows the FULL value on the row | An asset found by VIN or serial number shows that full value on its row |
| [C146230](https://shopview.testrail.io/index.php?/cases/view/146230) | SRI-ASSET-C2 — A match on licence plate shows the FULL value on the row | An asset found by licence plate shows that full value on its row |
| [C146231](https://shopview.testrail.io/index.php?/cases/view/146231) | SRI-ASSET-D1 — The Assets row shows everything the specification promised | The Asset result row shows every detail it should |
| [C146232](https://shopview.testrail.io/index.php?/cases/view/146232) | SRI-ASSET-I1 — A corrected typo says that it corrected something | Asset results say when a typo was corrected |
| [C146233](https://shopview.testrail.io/index.php?/cases/view/146233) | SRI-PART-A1 — The whole matched value is shown, not just what you typed | Part results show the whole matched value, not just what you typed |
| [C146234](https://shopview.testrail.io/index.php?/cases/view/146234) | SRI-PART-A2 — A long value is not cut off through the part that matched | Part results don't cut off a long value through the matched part |
| [C146235](https://shopview.testrail.io/index.php?/cases/view/146235) | SRI-PART-A3 — The highlight marks the match inside the text, not instead of it | Part results highlight the match inside the text, not instead of it |
| [C146236](https://shopview.testrail.io/index.php?/cases/view/146236) | SRI-PART-B1 — Two records sharing what you typed can be told apart | Two part results sharing what you typed can be told apart |
| [C146237](https://shopview.testrail.io/index.php?/cases/view/146237) | SRI-PART-B2 — Two records with the same bold line differ somewhere you can see | Two part results with the same bold line differ somewhere visible |
| [C146238](https://shopview.testrail.io/index.php?/cases/view/146238) | SRI-PART-C1 — A match on bin location shows the FULL value on the row | A part found by bin location shows that full value on its row |
| [C146239](https://shopview.testrail.io/index.php?/cases/view/146239) | SRI-PART-C2 — A match on manufacturer shows the FULL value on the row | A part found by manufacturer shows that full value on its row |
| [C146240](https://shopview.testrail.io/index.php?/cases/view/146240) | SRI-PART-C3 — A match on vendor name shows the FULL value on the row | A part found by vendor name shows that full value on its row |
| [C146241](https://shopview.testrail.io/index.php?/cases/view/146241) | SRI-PART-C4 — A match on category shows the FULL value on the row | A part found by category shows that full value on its row |
| [C146242](https://shopview.testrail.io/index.php?/cases/view/146242) | SRI-PART-C5 — A match on tags shows the FULL value on the row | A part found by tags shows that full value on its row |
| [C146243](https://shopview.testrail.io/index.php?/cases/view/146243) | SRI-PART-D1 — The Parts row shows everything the specification promised | The Part result row shows every detail it should |
| [C146244](https://shopview.testrail.io/index.php?/cases/view/146244) | SRI-PART-I1 — A corrected typo says that it corrected something | Part results say when a typo was corrected |
| [C146245](https://shopview.testrail.io/index.php?/cases/view/146245) | SRI-VEND-A1 — The whole matched value is shown, not just what you typed | Vendor results show the whole matched value, not just what you typed |
| [C146246](https://shopview.testrail.io/index.php?/cases/view/146246) | SRI-VEND-A2 — A long value is not cut off through the part that matched | Vendor results don't cut off a long value through the matched part |
| [C146247](https://shopview.testrail.io/index.php?/cases/view/146247) | SRI-VEND-A3 — The highlight marks the match inside the text, not instead of it | Vendor results highlight the match inside the text, not instead of it |
| [C146248](https://shopview.testrail.io/index.php?/cases/view/146248) | SRI-VEND-B1 — Two records sharing what you typed can be told apart | Two vendor results sharing what you typed can be told apart |
| [C146249](https://shopview.testrail.io/index.php?/cases/view/146249) | SRI-VEND-B2 — Two records with the same bold line differ somewhere you can see | Two vendor results with the same bold line differ somewhere visible |
| [C146250](https://shopview.testrail.io/index.php?/cases/view/146250) | SRI-VEND-C1 — A match on email address shows the FULL value on the row | A vendor found by email address shows that full value on its row |
| [C146251](https://shopview.testrail.io/index.php?/cases/view/146251) | SRI-VEND-C2 — A match on address line 2 shows the FULL value on the row | A vendor found by address line 2 shows that full value on its row |
| [C146252](https://shopview.testrail.io/index.php?/cases/view/146252) | SRI-VEND-C3 — A match on a contact's telephone shows the FULL value on the row | A vendor found by a contact's telephone shows that full value on its row |
| [C146255](https://shopview.testrail.io/index.php?/cases/view/146255) | SRI-VEND-D1 — The Vendors row shows everything the specification promised | The Vendor result row shows every detail it should |
| [C146256](https://shopview.testrail.io/index.php?/cases/view/146256) | SRI-VEND-I1 — A corrected typo says that it corrected something | Vendor results say when a typo was corrected |
| [C195900](https://shopview.testrail.io/index.php?/cases/view/195900) | SRI-VEND-C4 — A match on a contact's name shows the FULL value on the row | A vendor found by a contact's name shows that full value on its row |
| [C195901](https://shopview.testrail.io/index.php?/cases/view/195901) | SRI-VEND-C5 — A match on a contact's email address shows the FULL value on the row | A vendor found by a contact's email address shows that full value on its row |
| [C146257](https://shopview.testrail.io/index.php?/cases/view/146257) | SRI-PS-A1 — The whole matched value is shown, not just what you typed | Part Sale results show the whole matched value, not just what you typed |
| [C146258](https://shopview.testrail.io/index.php?/cases/view/146258) | SRI-PS-A2 — A long value is not cut off through the part that matched | Part Sale results don't cut off a long value through the matched part |
| [C146259](https://shopview.testrail.io/index.php?/cases/view/146259) | SRI-PS-A3 — The highlight marks the match inside the text, not instead of it | Part Sale results highlight the match inside the text, not instead of it |
| [C146260](https://shopview.testrail.io/index.php?/cases/view/146260) | SRI-PS-B1 — Two records sharing what you typed can be told apart | Two part sale results sharing what you typed can be told apart |
| [C146261](https://shopview.testrail.io/index.php?/cases/view/146261) | SRI-PS-B2 — Two records with the same bold line differ somewhere you can see | Two part sale results with the same bold line differ somewhere visible |
| [C146262](https://shopview.testrail.io/index.php?/cases/view/146262) | SRI-PS-C1 — A match on the asset on the sale shows the FULL value on the row | A part sale found by its asset shows that full value on its row |
| [C146263](https://shopview.testrail.io/index.php?/cases/view/146263) | SRI-PS-C2 — A match on VIN / serial number shows the FULL value on the row | A part sale found by VIN or serial number shows that full value on its row |
| [C146264](https://shopview.testrail.io/index.php?/cases/view/146264) | SRI-PS-D1 — The Part Sales row shows everything the specification promised | The Part Sale result row shows every detail it should |
| [C146265](https://shopview.testrail.io/index.php?/cases/view/146265) | SRI-PS-I1 — A corrected typo says that it corrected something | Part Sale results say when a typo was corrected |
| [C146266](https://shopview.testrail.io/index.php?/cases/view/146266) | SRI-PO-A1 — The whole matched value is shown, not just what you typed | Purchase Order results show the whole matched value, not just what you typed |
| [C146267](https://shopview.testrail.io/index.php?/cases/view/146267) | SRI-PO-A2 — A long value is not cut off through the part that matched | Purchase Order results don't cut off a long value through the matched part |
| [C146268](https://shopview.testrail.io/index.php?/cases/view/146268) | SRI-PO-A3 — The highlight marks the match inside the text, not instead of it | Purchase Order results highlight the match inside the text, not instead of it |
| [C146269](https://shopview.testrail.io/index.php?/cases/view/146269) | SRI-PO-B1 — Two records sharing what you typed can be told apart | Two purchase order results sharing what you typed can be told apart |
| [C146270](https://shopview.testrail.io/index.php?/cases/view/146270) | SRI-PO-B2 — Two records with the same bold line differ somewhere you can see | Two purchase order results with the same bold line differ somewhere visible |
| [C146271](https://shopview.testrail.io/index.php?/cases/view/146271) | SRI-PO-C1 — A match on part numbers on the PO shows the FULL value on the row | A purchase order found by a part number on it shows that full value on its row |
| [C146272](https://shopview.testrail.io/index.php?/cases/view/146272) | SRI-PO-C2 — A match on part descriptions on the PO shows the FULL value on the row | A purchase order found by a part description on it shows the full value |
| [C146273](https://shopview.testrail.io/index.php?/cases/view/146273) | SRI-PO-C3 — A match on created-by user shows the FULL value on the row | A purchase order found by who created it shows that full value on its row |
| [C146274](https://shopview.testrail.io/index.php?/cases/view/146274) | SRI-PO-C4 — A match on spliced number variants (`number_variants`) shows the FULL value on the row | A purchase order found by a variant of its number shows the full value |
| [C146275](https://shopview.testrail.io/index.php?/cases/view/146275) | SRI-PO-D1 — The Purchase Orders row shows everything the specification promised | The Purchase Order result row shows every detail it should |
| [C146276](https://shopview.testrail.io/index.php?/cases/view/146276) | SRI-PO-I1 — A corrected typo says that it corrected something | Purchase Order results say when a typo was corrected |
| [C146277](https://shopview.testrail.io/index.php?/cases/view/146277) | SRI-VINV-A1 — The whole matched value is shown, not just what you typed | Vendor Invoice results show the whole matched value, not just what you typed |
| [C146278](https://shopview.testrail.io/index.php?/cases/view/146278) | SRI-VINV-A2 — A long value is not cut off through the part that matched | Vendor Invoice results don't cut off a long value through the matched part |
| [C146279](https://shopview.testrail.io/index.php?/cases/view/146279) | SRI-VINV-A3 — The highlight marks the match inside the text, not instead of it | Vendor Invoice results highlight the match inside the text, not instead of it |
| [C146280](https://shopview.testrail.io/index.php?/cases/view/146280) | SRI-VINV-B1 — Two records sharing what you typed can be told apart | Two vendor invoice results sharing what you typed can be told apart |
| [C146281](https://shopview.testrail.io/index.php?/cases/view/146281) | SRI-VINV-B2 — Two records with the same bold line differ somewhere you can see | Two vendor invoice results with the same bold line differ somewhere visible |
| [C146282](https://shopview.testrail.io/index.php?/cases/view/146282) | SRI-VINV-C1 — A match on the PO number the invoice belongs to shows the FULL value on the row | A vendor invoice found by its PO number shows that full value on its row |
| [C146283](https://shopview.testrail.io/index.php?/cases/view/146283) | SRI-VINV-D1 — The Vendor Invoices row shows everything the specification promised | The Vendor Invoice result row shows every detail it should |
| [C146284](https://shopview.testrail.io/index.php?/cases/view/146284) | SRI-VINV-I1 — A corrected typo says that it corrected something | Vendor Invoice results say when a typo was corrected |
| [C146285](https://shopview.testrail.io/index.php?/cases/view/146285) | SRI-ALL-E1 — A tab's count equals the number of rows inside it | A tab's count equals the number of rows inside it |
| [C146286](https://shopview.testrail.io/index.php?/cases/view/146286) | SRI-ALL-E2 — No count anywhere reads higher than 20 | No count anywhere reads higher than 20 |
| [C146287](https://shopview.testrail.io/index.php?/cases/view/146287) | SRI-ALL-E3 — A group on the All tab shows 5 and offers the rest | Each group on the All tab shows 5 results and offers the rest |
| [C146288](https://shopview.testrail.io/index.php?/cases/view/146288) | SRI-ALL-E4 — "Show all" opens that tab and keeps you in the search box | 'Show all' opens that tab and keeps you in the search box |
| [C146289](https://shopview.testrail.io/index.php?/cases/view/146289) | SRI-ALL-E5 — All nine tabs are there, named and counted | All nine search tabs are there, named and counted |
| [C146290](https://shopview.testrail.io/index.php?/cases/view/146290) | SRI-ALL-E6 — Groups on the All tab are always in the same order | Groups on the All tab are always in the same order |
| [C146291](https://shopview.testrail.io/index.php?/cases/view/146291) | SRI-ALL-E7 — Typing a full record number puts that record at the very top | Typing a full record number puts that record at the very top |
| [C146292](https://shopview.testrail.io/index.php?/cases/view/146292) | SRI-ALL-F1 — A number is found with and without its dashes | A number is found with and without its dashes |
| [C146293](https://shopview.testrail.io/index.php?/cases/view/146293) | SRI-ALL-F2 — A phone number is found however it is punctuated | A phone number is found however it is punctuated |
| [C146294](https://shopview.testrail.io/index.php?/cases/view/146294) | SRI-ALL-F3 — An accented name is found typed either way | An accented name is found typed with or without the accent |
| [C146295](https://shopview.testrail.io/index.php?/cases/view/146295) | SRI-ALL-F4 — An apostrophe or hyphen in a name is optional | A name is found with or without its apostrophe or hyphen |
| [C146296](https://shopview.testrail.io/index.php?/cases/view/146296) | SRI-ALL-F5 — A typo in a NUMBER is not silently corrected | A typo in a number is not silently corrected |
| [C146297](https://shopview.testrail.io/index.php?/cases/view/146297) | SRI-ALL-F6 — Typing a status word returns nothing because of status | Typing a status word (e.g. Paid) does not match records by their status |
| [C146298](https://shopview.testrail.io/index.php?/cases/view/146298) | SRI-ALL-G1 — A work order whose truck has no unit number still reads properly | A work order whose truck has no unit number still reads properly |
| [C146299](https://shopview.testrail.io/index.php?/cases/view/146299) | SRI-ALL-G2 — A very long value does not push the rest of the row out of sight | A very long value does not push the rest of the row out of sight |
| [C146300](https://shopview.testrail.io/index.php?/cases/view/146300) | SRI-ALL-G3 — A very common word still gives a usable list | A very common word still gives a usable list |
| [C146302](https://shopview.testrail.io/index.php?/cases/view/146302) | SRI-ALL-G5 — A kind of record that does not exist yet does not break search | A record type that does not exist yet does not break search |
| [C146303](https://shopview.testrail.io/index.php?/cases/view/146303) | SRI-ALL-H1 — No results shows your query back, and nothing else | No results shows your search back, and nothing else |
| [C146304](https://shopview.testrail.io/index.php?/cases/view/146304) | SRI-ALL-H2 — No results inside a tab names the tab | No results inside a tab names the tab |
| [C146305](https://shopview.testrail.io/index.php?/cases/view/146305) | SRI-ALL-H3 — A record you can open from its own list is never "not found" | A record you can open from its own list is always found |
| [C146306](https://shopview.testrail.io/index.php?/cases/view/146306) | SRI-ALL-K1 — Someone without access sees no rows AND no count | Someone without access sees no rows and no count |
| [C195902](https://shopview.testrail.io/index.php?/cases/view/195902) | SRI-ALL-G4 — One or two characters behaves sensibly | Typing only one or two characters behaves sensibly |

## Invoice Refresh (Aug 2026) (20)

| Case | Old title | New title |
|---|---|---|
| [C44902](https://shopview.testrail.io/index.php?/cases/view/44902) (Automated) | Shop logo shows when set; nothing (no placeholder) shows when unset | Shop logo shows when set, and nothing shows when it isn't |
| [C44905](https://shopview.testrail.io/index.php?/cases/view/44905) (Automated) | No money figure in the masthead; headline figure is the boxed total | No money figure in the masthead, the main figure is the boxed total |
| [C44909](https://shopview.testrail.io/index.php?/cases/view/44909) (Automated) | Remit Payment To shows when a payee is configured (both mechanisms) | Remit Payment To shows when a payee is set, either way it is set up |
| [C44912](https://shopview.testrail.io/index.php?/cases/view/44912) (Automated) | Bill To address fields hide when empty; the name line always shows | Bill To address fields hide when empty, the name line always shows |
| [C44913](https://shopview.testrail.io/index.php?/cases/view/44913) (Automated) | Order reference fields show in the fixed order with no label punctuation | Order reference fields show in a fixed order with no label punctuation |
| [C44927](https://shopview.testrail.io/index.php?/cases/view/44927) (Automated) | VIN / Serial hides when the asset has neither; Asset name still shows | VIN / Serial hides when the asset has neither, the asset name still shows |
| [C44928](https://shopview.testrail.io/index.php?/cases/view/44928) (Automated) | Asset section shows whenever the work order has an asset (parts sales too) | The asset section shows whenever there is an asset, part sales too |
| [C44931](https://shopview.testrail.io/index.php?/cases/view/44931) (Automated) | Each work line shows name, and description and scope-of-work note when present | Each work line shows its name, and description and notes when present |
| [C44934](https://shopview.testrail.io/index.php?/cases/view/44934) (Automated) | Line-level fee shows as a plain amount; discount shows in parentheses | A line fee shows as an amount, a discount in brackets |
| [C44936](https://shopview.testrail.io/index.php?/cases/view/44936) (Automated) | Empty work section shows heading; Summary divider still precedes summary | An empty work section still shows its heading and the Summary divider |
| [C44939](https://shopview.testrail.io/index.php?/cases/view/44939) (Automated) | Declined Work section hidden when nothing declined or option off | Declined Work is hidden when nothing is declined or the option is off |
| [C44943](https://shopview.testrail.io/index.php?/cases/view/44943) (Automated) | Adjustments group shows each Labor · / Parts · line-level row, then each work-order-wide row | Adjustments list each Labor and Parts line row, then work order rows |
| [C44947](https://shopview.testrail.io/index.php?/cases/view/44947) (Automated) | Payment method name resolves per rule (SHOPPAY shows 'Online') | Payment method names follow the rule, ShopPay shows as Online |
| [C44948](https://shopview.testrail.io/index.php?/cases/view/44948) (Automated) | Deposit and applied customer-account credit show as labeled payment rows | Deposits and customer credit show as labelled payment rows |
| [C44949](https://shopview.testrail.io/index.php?/cases/view/44949) (Automated) | Excess payment sub-line reads exactly per the credited/ to-be-credited rule | The overpayment line reads exactly as credited or to be credited |
| [C44950](https://shopview.testrail.io/index.php?/cases/view/44950) (Automated) | Balance equals Total minus all applied amounts, floored at $0.00 | Balance is Total minus everything applied, never below $0.00 |
| [C44956](https://shopview.testrail.io/index.php?/cases/view/44956) (Automated) | Signature area has exactly three labeled lines and no acknowledgment sentence | The signature area has three labelled lines and no acknowledgement text |
| [C44972](https://shopview.testrail.io/index.php?/cases/view/44972) (Automated) | Only the closed palette colours appear on any document | Documents use only the approved set of colours |
| [C44977](https://shopview.testrail.io/index.php?/cases/view/44977) (Automated) | Prototype chrome does not appear on any real document | Design preview frames never appear on a real document |
| [C44982](https://shopview.testrail.io/index.php?/cases/view/44982) (Automated) | Parts Sale line-level fees/discounts render as on the Invoice | Part Sale line fees and discounts show the same as on the Invoice |

## Reports Suite (2)

| Case | Old title | New title |
|---|---|---|
| [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) (Automated) | Columns and sort are remembered per browser before the first fetch; filters ride the URL | Columns and sort are remembered per browser, filters are in the address |
| [C30174](https://shopview.testrail.io/index.php?/cases/view/30174) (Automated) | Sort and visible columns are restored on the next visit; filters are not | Sort and visible columns come back on the next visit, filters do not |

## Schedule (1)

| Case | Old title | New title |
|---|---|---|
| [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | Day view opens on the shop's exact business hours (or the working-day start when no hours are saved); manual scrolling stands | Day view opens at the shop's business hours, and your scrolling is kept |

## Simple Flow (3)

| Case | Old title | New title |
|---|---|---|
| [C29300](https://shopview.testrail.io/index.php?/cases/view/29300) (Automated) | Optional receiving completes a line directly without ordering its vendor parts | Optional receiving completes a line without ordering its vendor parts |
| [C29301](https://shopview.testrail.io/index.php?/cases/view/29301) (Automated) | Optional receiving receives only selected-line parts through bulk Receive | Optional receiving receives only the chosen line's parts with bulk Receive |
| [C29328](https://shopview.testrail.io/index.php?/cases/view/29328) | Verify a saved tech story renders inline with the text and an Edit link | A saved tech story shows inline with its text and an Edit link |

## Simple Flow V2 (Aug 2026) (53)

| Case | Old title | New title |
|---|---|---|
| [C44549](https://shopview.testrail.io/index.php?/cases/view/44549) | Work Orders settings page — the four SFV2 settings appear, named and grouped | Work Orders settings page shows the four new settings, named and grouped |
| [C44550](https://shopview.testrail.io/index.php?/cases/view/44550) | Auto-pick renamed to "Require picking inventory parts" — value inverted, behaviour unchanged | Auto-pick is renamed "Require picking inventory parts" and works the same |
| [C44552](https://shopview.testrail.io/index.php?/cases/view/44552) | Require picking and Require receiving — what each controls, on and off | What Require picking and Require receiving control, on and off |
| [C44553](https://shopview.testrail.io/index.php?/cases/view/44553) | Turning Require ordering / picking ON later does not retro-act on existing parts | Turning on Require ordering or picking later leaves existing parts alone |
| [C44554](https://shopview.testrail.io/index.php?/cases/view/44554) | A settings change applies to every open work order — except approval (new lines only) | A settings change applies to open work orders, approval to new lines only |
| [C44555](https://shopview.testrail.io/index.php?/cases/view/44555) | A settings change is written to the audit log, attributed to the admin, with the cause | A settings change is in the audit log, with the admin and the reason |
| [C44556](https://shopview.testrail.io/index.php?/cases/view/44556) | Settings-change sweeps skip invoiced/paid work orders and declined lines | A settings change skips invoiced or paid work orders and declined lines |
| [C44557](https://shopview.testrail.io/index.php?/cases/view/44557) (Automated) | Only ordering and picking ask to confirm; turning picking OFF warns about stock | Only ordering and picking ask to confirm, picking off warns about stock |
| [C44558](https://shopview.testrail.io/index.php?/cases/view/44558) | Cancelling a settings-change confirmation changes nothing; a zero count saves directly | Cancelling the confirmation changes nothing, zero affected saves at once |
| [C44559](https://shopview.testrail.io/index.php?/cases/view/44559) | Applying a large settings change blocks only the acting admin, never the whole shop | A large settings change only blocks the admin making it, not the shop |
| [C44562](https://shopview.testrail.io/index.php?/cases/view/44562) | The other line requirements still apply on completion when their setting is on | Other line requirements still apply on completion when their setting is on |
| [C44563](https://shopview.testrail.io/index.php?/cases/view/44563) | A line reaches Complete only through the defined paths | A line can reach Complete only in the allowed ways |
| [C44565](https://shopview.testrail.io/index.php?/cases/view/44565) | Complete is never disabled for a parts reason; reopening returns the line to Approved | Complete is never disabled because of parts, reopening sets Approved |
| [C44566](https://shopview.testrail.io/index.php?/cases/view/44566) | Line actions offered match the line's status | The line actions offered match the line's status |
| [C44567](https://shopview.testrail.io/index.php?/cases/view/44567) | Decline is disabled while a line holds received or picked parts | Decline is disabled while a line has received or picked parts |
| [C44568](https://shopview.testrail.io/index.php?/cases/view/44568) | Part row action matches the part's state — all seven states | The part row action matches the part's state, for all seven states |
| [C44569](https://shopview.testrail.io/index.php?/cases/view/44569) | Ordering precedes receiving; Receive placement follows the setting | Ordering comes before receiving, and Receive's place follows the setting |
| [C44570](https://shopview.testrail.io/index.php?/cases/view/44570) | Declining or sending back a line returns only the not-yet-arrived parts to Quoted | Declining or sending back a line returns only unarrived parts to Quoted |
| [C44571](https://shopview.testrail.io/index.php?/cases/view/44571) | Bulk bar replaces the column headers and shows each action by one rule | The bulk bar replaces the column headers and shows actions by one rule |
| [C44572](https://shopview.testrail.io/index.php?/cases/view/44572) | Bulk bar groups: line and parts actions never compete for a slot; More holds the rest | Bulk bar line and part actions never share a slot, More holds the rest |
| [C44573](https://shopview.testrail.io/index.php?/cases/view/44573) | Each bulk action confirms or offers undo per its kind, with one toast each | Each bulk action confirms or offers Undo by its kind, with one message |
| [C44575](https://shopview.testrail.io/index.php?/cases/view/44575) (Automated) | Bulk approve/decline judges each line on its own and never sweeps a declined line | Bulk approve or decline checks each line and never changes a declined one |
| [C44576](https://shopview.testrail.io/index.php?/cases/view/44576) | Bulk approve/decline skips ineligible lines and hides an action at a zero count | Bulk approve or decline skips lines it can't change, hides at zero |
| [C44577](https://shopview.testrail.io/index.php?/cases/view/44577) | Bulk complete: label and count follow the selected Approved lines | Bulk complete's label and count follow the selected Approved lines |
| [C44578](https://shopview.testrail.io/index.php?/cases/view/44578) | Bulk delete lines is not in the bar this release; Mark as reviewed is not either | Bulk delete and Mark as reviewed are not in the bulk bar this release |
| [C44580](https://shopview.testrail.io/index.php?/cases/view/44580) | Bulk order raises a PO per vendor and skips already-ordered / non-vendor parts | Bulk order creates a PO per vendor and skips ordered or vendorless parts |
| [C44581](https://shopview.testrail.io/index.php?/cases/view/44581) | Bulk pick runs the existing pick atomically for in-stock unpicked parts | Bulk pick picks all in-stock unpicked parts together or none |
| [C44582](https://shopview.testrail.io/index.php?/cases/view/44582) | Bulk pick action is hidden without the Pick Parts permission | Bulk pick is hidden without the Pick Parts permission |
| [C53486](https://shopview.testrail.io/index.php?/cases/view/53486) | Deselect all keeps the bar; close dismisses it; an empty group shows no divider | Deselect all keeps the bar, close removes it, an empty group has no divider |
| [C44583](https://shopview.testrail.io/index.php?/cases/view/44583) (Automated) | Receive opens a modal (no navigation); its contents depend on the entry point | Receive opens a window on the same page, its contents depend on the start |
| [C44584](https://shopview.testrail.io/index.php?/cases/view/44584) | Receiving requires vendor, invoice number and date; cost and tax prefilled, may be zero | Receiving needs vendor, invoice number and date, cost and tax prefilled |
| [C44585](https://shopview.testrail.io/index.php?/cases/view/44585) | Vendor-missing card requires Assign vendor first; it applies to ticked parts only | A part with no vendor needs Assign vendor first, only for ticked parts |
| [C44587](https://shopview.testrail.io/index.php?/cases/view/44587) (Automated) | A user without See Financial Data can still receive; money fields are removed, not masked | Without See Financial Data you can still receive, money fields are removed |
| [C44589](https://shopview.testrail.io/index.php?/cases/view/44589) | Purchase-order page groups by vendor, missing vendors first, all collapsed | Purchase order page groups by vendor, missing vendors first, all collapsed |
| [C44590](https://shopview.testrail.io/index.php?/cases/view/44590) | A panel expands per purchase order with per-PO vendor-side fields and read-only sell | Each purchase order expands with its vendor fields, sell price read-only |
| [C44591](https://shopview.testrail.io/index.php?/cases/view/44591) | Receive page validity matches the modal; money hidden without permission; sell not shown from Parts | The Receive page checks match the window, money hidden without permission |
| [C53488](https://shopview.testrail.io/index.php?/cases/view/53488) | PO list-page selection raises the shared bulk bar; Select all covers one page only | Selecting purchase orders shows the bulk bar, Select all covers one page |
| [C44593](https://shopview.testrail.io/index.php?/cases/view/44593) | Without the permission or the setting, no Received later option appears | Without the permission or setting, Received later is not offered |
| [C44594](https://shopview.testrail.io/index.php?/cases/view/44594) | The completion wizard opens only from the defined actions, only when something is collectable | The completion wizard opens only from set actions when something is due |
| [C44595](https://shopview.testrail.io/index.php?/cases/view/44595) | The wizard shows only the outstanding steps, in a fixed order, with Missing details last | The wizard shows only the steps still due, in order, Missing details last |
| [C44596](https://shopview.testrail.io/index.php?/cases/view/44596) (Automated) | Each wizard step's own action saves and advances; there is no Continue; receive reuses the modal | Each wizard step's button saves and moves on, receiving uses the same window |
| [C44597](https://shopview.testrail.io/index.php?/cases/view/44597) (Automated) | Where a wizard run ends depends on what opened it | Where the completion wizard ends depends on what opened it |
| [C44599](https://shopview.testrail.io/index.php?/cases/view/44599) | The header shows only the one finish action that is genuinely next | The header shows only the one finish action that comes next |
| [C44600](https://shopview.testrail.io/index.php?/cases/view/44600) | Create invoice runs the wizard if needed, then invoices, completes Approved lines and opens payment | Create invoice runs the wizard if needed, invoices and opens payment |
| [C44601](https://shopview.testrail.io/index.php?/cases/view/44601) (Automated) | Finish-action negatives: needs-approval block, declined-only, invoice lock, payment-close | Finish actions blocked by approval, declined-only lines, invoice lock |
| [C44602](https://shopview.testrail.io/index.php?/cases/view/44602) | The part and line ... menus hold exactly the actions that belong to them | The part and line ... menus hold exactly the actions that belong there |
| [C44603](https://shopview.testrail.io/index.php?/cases/view/44603) | Menu negatives: Request part, Uncomplete and Receive part visibility | When Request part, Uncomplete and Receive part show in the menus |
| [C44604](https://shopview.testrail.io/index.php?/cases/view/44604) (Automated) | Dragging a part reorders it within its line; the line order is the invoice order | Dragging a part reorders it in its line, and that is the invoice order |
| [C44605](https://shopview.testrail.io/index.php?/cases/view/44605) | Reordering negatives: no cross-line moves, refused on an invoiced WO, last write wins | Parts can't be dragged between lines or on an invoiced work order |
| [C44606](https://shopview.testrail.io/index.php?/cases/view/44606) | 'Received later' is the one new permission — a per-role toggle, off by default | Received later is the one new permission, per role, off by default |
| [C44607](https://shopview.testrail.io/index.php?/cases/view/44607) | Every Simple Flow action is gated by its mapped existing atom; bulk uses the same atom as single | Each Simple Flow action uses its existing permission, bulk and single alike |
| [C44608](https://shopview.testrail.io/index.php?/cases/view/44608) | Money follows See Financial Data; work follows View mode; nothing is hidden-and-required | Money follows See Financial Data, work follows the view setting |
| [C44609](https://shopview.testrail.io/index.php?/cases/view/44609) | A user without an atom never sees the action; hidden values are not sent to the screen | Users without permission never see the action or its hidden values |

## WO Board and Tech View (Sep 2026) (118)

| Case | Old title | New title |
|---|---|---|
| [C96911](https://shopview.testrail.io/index.php?/cases/view/96911) | Switching display re-lays out instantly, keeping filters and search | Switching display changes the layout at once, keeping filters and search |
| [C96912](https://shopview.testrail.io/index.php?/cases/view/96912) | Chosen display is remembered across logout/login, devices, and locations | The chosen display is kept after sign-out, on other devices and locations |
| [C96914](https://shopview.testrail.io/index.php?/cases/view/96914) | Search, filter persistence, and result set behave the same in all three displays | Search and filters work the same way in all three displays |
| [C96915](https://shopview.testrail.io/index.php?/cases/view/96915) | Returning to List uses the List sort; manual order never changes it | Going back to List uses List's sort, a manual order never changes it |
| [C96917](https://shopview.testrail.io/index.php?/cases/view/96917) | Direct navigation to a filter tab starts at the top-left | Opening a filter tab directly starts at the top-left |
| [C96919](https://shopview.testrail.io/index.php?/cases/view/96919) | A display preference that cannot load falls back to List | If the saved display can't load, List is shown |
| [C96920](https://shopview.testrail.io/index.php?/cases/view/96920) | A failed preference save keeps the previous one and does not block retry | If saving the display fails, the old one stays and you can retry |
| [C96921](https://shopview.testrail.io/index.php?/cases/view/96921) | Simultaneous tabs: the last display-preference request wins | With two browser tabs open, the last display change wins |
| [C96923](https://shopview.testrail.io/index.php?/cases/view/96923) | Changing location opens that location's default page; Assigned to me resets | Changing location opens that location's default page and resets Assigned to me |
| [C154885](https://shopview.testrail.io/index.php?/cases/view/154885) | Display options follow the 1024px screen-width switch (List below it) | The new displays need a screen at least 1024px wide, otherwise List |
| [C96926](https://shopview.testrail.io/index.php?/cases/view/96926) | Initial technician order: first name, then last name, then account age | Technicians start in order of first name, last name, then account age |
| [C96928](https://shopview.testrail.io/index.php?/cases/view/96928) | Technician groups collapse/expand and the state persists per user | Technician groups collapse and expand, and stay that way for the user |
| [C96929](https://shopview.testrail.io/index.php?/cases/view/96929) | Before a manual order is saved, work orders in a group use List's default sort | Until you reorder them, a group's work orders use List's default sort |
| [C96930](https://shopview.testrail.io/index.php?/cases/view/96930) | Only eligible technicians are shown as groups | Only technicians who can lead work show as groups |
| [C96931](https://shopview.testrail.io/index.php?/cases/view/96931) | Every eligible technician appears even with no work, labelled No work orders | Every technician who can lead work shows, with "No work orders" if empty |
| [C96932](https://shopview.testrail.io/index.php?/cases/view/96932) | Clicking a Tech View row opens the work order; a drag needs a few pixels first | Clicking a Tech View row opens the work order, a drag needs a small move |
| [C96933](https://shopview.testrail.io/index.php?/cases/view/96933) | Empty Unassigned with Assigned to me off stays present as a drop target | An empty Unassigned group stays visible to drop work into |
| [C96934](https://shopview.testrail.io/index.php?/cases/view/96934) | Work led by a deactivated technician stays visible; header inactive | Work led by a deactivated technician stays visible under an inactive header |
| [C96935](https://shopview.testrail.io/index.php?/cases/view/96935) | Technician group header stays visible while scrolling a tall group | A technician's group header stays visible while scrolling a tall group |
| [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) | After a lead change elsewhere, the work order moves to its new group on refresh | After the lead changes elsewhere, the work order moves group on refresh |
| [C96937](https://shopview.testrail.io/index.php?/cases/view/96937) | Assigned to me shows only groups holding my work; the rest are hidden | Assigned to me shows only the groups that hold my work |
| [C96938](https://shopview.testrail.io/index.php?/cases/view/96938) | Hovering a technician header or avatar reveals the name | Hovering a technician header or avatar shows the full name |
| [C96939](https://shopview.testrail.io/index.php?/cases/view/96939) | Tech View allows up to three pinned technician groups | Tech View lets you pin up to three technician groups |
| [C96940](https://shopview.testrail.io/index.php?/cases/view/96940) | Board View: one column per eligible technician plus Unassigned | Board View has one column per technician plus Unassigned |
| [C96941](https://shopview.testrail.io/index.php?/cases/view/96941) | Unassigned column is first and stays fixed on horizontal scroll | The Unassigned column is first and stays put when scrolling sideways |
| [C96942](https://shopview.testrail.io/index.php?/cases/view/96942) | Column headers stay pinned at the top while scrolling a long column vertically | Column headers stay at the top while scrolling down a long column |
| [C96943](https://shopview.testrail.io/index.php?/cases/view/96943) | Board View cards always include the mandatory fields | Board View cards always show the required fields |
| [C96944](https://shopview.testrail.io/index.php?/cases/view/96944) | A card's status badge stays in a fixed position | A card's status badge always sits in the same place |
| [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) | Card more-actions overlay on hover/focus includes Reassign lead | A card's more-actions menu on hover or focus includes Reassign lead |
| [C96946](https://shopview.testrail.io/index.php?/cases/view/96946) | Clicking a card outside more-actions opens the work order | Clicking a card anywhere but more-actions opens the work order |
| [C96947](https://shopview.testrail.io/index.php?/cases/view/96947) | Pin a technician from the header; pins sit after Unassigned and append in order | Pin a technician from its header, pins go after Unassigned in order pinned |
| [C96948](https://shopview.testrail.io/index.php?/cases/view/96948) | Pins are shared with Tech View and persist per user across sessions and devices | Pins are shared with Tech View and kept for the user on any device |
| [C96949](https://shopview.testrail.io/index.php?/cases/view/96949) | Fourth pin is blocked with the cap message; unpinning frees a slot in both views | A fourth pin is refused with a message, unpinning frees a slot |
| [C96950](https://shopview.testrail.io/index.php?/cases/view/96950) | Empty eligible columns stay as drop targets showing "No work orders" | Empty technician columns stay visible to drop work into |
| [C96951](https://shopview.testrail.io/index.php?/cases/view/96951) | Assigned to me shows only columns holding my work; pinning is disabled | Assigned to me shows only columns with my work, and pinning is disabled |
| [C96952](https://shopview.testrail.io/index.php?/cases/view/96952) | Deactivated technician column keeps work, shows inactive, keeps pin | A deactivated technician's column keeps its work, shows inactive, stays pinned |
| [C96953](https://shopview.testrail.io/index.php?/cases/view/96953) | Every Board column scrolls on its own; the page itself does not scroll | Each Board column scrolls on its own, the page itself doesn't |
| [C96954](https://shopview.testrail.io/index.php?/cases/view/96954) | All selected card content stays reachable by scrolling at any height or density | All card content stays reachable by scrolling at any height or density |
| [C96955](https://shopview.testrail.io/index.php?/cases/view/96955) | Board View provides the shared Density control | Board View has the shared Density setting |
| [C154886](https://shopview.testrail.io/index.php?/cases/view/154886) | Board keeps the Unassigned column visible as a drop target when empty | An empty Unassigned column stays visible on the Board to drop work into |
| [C96956](https://shopview.testrail.io/index.php?/cases/view/96956) | Reassign dialog offers eligible techs plus Unassigned; confirm or cancel | The Reassign window offers technicians plus Unassigned, with confirm or cancel |
| [C96957](https://shopview.testrail.io/index.php?/cases/view/96957) | Success toasts show the right text and auto-dismiss | Success messages show the right text and close on their own |
| [C96958](https://shopview.testrail.io/index.php?/cases/view/96958) | Detail-page notification behaviour is preserved when the lead changes | The work order page's notifications still work when the lead changes |
| [C96959](https://shopview.testrail.io/index.php?/cases/view/96959) | Column/group header counts update immediately after a successful change | Column and group counts update straight after a successful change |
| [C96960](https://shopview.testrail.io/index.php?/cases/view/96960) | Line-movement rules on ASSIGN/REASSIGN — all six line types | Which lines move with the lead on assign or reassign, for all six line types |
| [C96961](https://shopview.testrail.io/index.php?/cases/view/96961) | Removing the lead returns following lines to unassigned and leaves the rest | Removing the lead unassigns the lines that followed it and leaves the rest |
| [C96962](https://shopview.testrail.io/index.php?/cases/view/96962) | One audit entry per lead change; implicit moves add none | Each lead change adds one history entry, lines that move add none |
| [C96963](https://shopview.testrail.io/index.php?/cases/view/96963) | Lead change is blocked in Invoiced/Paid/Imported on every path | The lead can't be changed on Invoiced, Paid or Imported work orders |
| [C96964](https://shopview.testrail.io/index.php?/cases/view/96964) | Disabled reassignment shows the status reason; the WO can still reorder in place | A blocked reassign shows the status reason, reordering still works |
| [C96965](https://shopview.testrail.io/index.php?/cases/view/96965) | Shift-clearing prompt on a Board/Tech lead change; clear vs keep | Changing the lead on Board or Tech View asks whether to clear shifts |
| [C96966](https://shopview.testrail.io/index.php?/cases/view/96966) | Schedule and lead are independent; a lead change leaves time intact | Changing the lead leaves the work order's scheduled time unchanged |
| [C96967](https://shopview.testrail.io/index.php?/cases/view/96967) | Reassign requires create-and-edit permission | Reassigning needs Create and Edit permission |
| [C96968](https://shopview.testrail.io/index.php?/cases/view/96968) | Failed reassignment returns the card to origin and shows a dismissible alert | A failed reassign puts the card back and shows a message you can close |
| [C96969](https://shopview.testrail.io/index.php?/cases/view/96969) | Selecting the current lead again changes nothing and shows no toast | Choosing the current lead again changes nothing and shows no message |
| [C96971](https://shopview.testrail.io/index.php?/cases/view/96971) | Concurrent reassignment: the later change wins after refresh | If two people reassign at once, the later change wins after refresh |
| [C96972](https://shopview.testrail.io/index.php?/cases/view/96972) | A status turning prohibited mid-drag rejects the drop with a reason | A work order that becomes locked during a drag is refused with a reason |
| [C96973](https://shopview.testrail.io/index.php?/cases/view/96973) | Reassign allows out-of-filter destinations; a non-matching WO leaves | Reassign can move work outside the filter, and it then leaves the view |
| [C96974](https://shopview.testrail.io/index.php?/cases/view/96974) | The N open count counts Approved, In Progress, Ready for Review and Complete | The open count includes Approved, In Progress, Ready for Review, Complete |
| [C154887](https://shopview.testrail.io/index.php?/cases/view/154887) | Imported work order: reassign lead is disabled with its own tooltip | An imported work order's Reassign lead is disabled with its own tooltip |
| [C154888](https://shopview.testrail.io/index.php?/cases/view/154888) | Clearing shifts on a lead change trims by shift timing | Clearing shifts on a lead change removes shifts by their timing |
| [C154889](https://shopview.testrail.io/index.php?/cases/view/154889) | Removing the lead prompts to clear shifts, same as changing it | Removing the lead asks to clear shifts, the same as changing it |
| [C154890](https://shopview.testrail.io/index.php?/cases/view/154890) | Lead change and shift clearing succeed or fail together | The lead change and shift clearing both succeed or both fail |
| [C96975](https://shopview.testrail.io/index.php?/cases/view/96975) | Tech View has its own column selection, separate from List, saved per user | Tech View has its own column choice, separate from List, saved per user |
| [C96976](https://shopview.testrail.io/index.php?/cases/view/96976) | Board View has its own Fields to display picker; saved everywhere | Board View has its own Fields to display list, saved for the user |
| [C96977](https://shopview.testrail.io/index.php?/cases/view/96977) | Mandatory fields cannot be turned off | Required fields cannot be turned off |
| [C96978](https://shopview.testrail.io/index.php?/cases/view/96978) | The full set of optional fields is offered with production meaning | Every optional field is offered and shows the same value as elsewhere |
| [C96979](https://shopview.testrail.io/index.php?/cases/view/96979) | Tech View defaults to the List default columns; saved kept | Tech View starts with List's default columns, saved choices are kept |
| [C96980](https://shopview.testrail.io/index.php?/cases/view/96980) | Board View default field set (total price gated by financial perm) | Board View default fields, with total price only for financial access |
| [C96981](https://shopview.testrail.io/index.php?/cases/view/96981) | Field changes apply immediately with no page reload | Field changes apply at once without reloading the page |
| [C96982](https://shopview.testrail.io/index.php?/cases/view/96982) | Turning off every optional field keeps mandatory and unit fallback | Turning off every optional field keeps the required ones and the unit |
| [C96983](https://shopview.testrail.io/index.php?/cases/view/96983) | Field prefs that fail to load fall back to defaults; next is saved | If field choices fail to load, defaults show and the next change saves |
| [C96984](https://shopview.testrail.io/index.php?/cases/view/96984) | Missing unit uses asset fallback; both missing omits; a real zero is a value | No unit number shows the asset instead, a real zero still shows |
| [C96985](https://shopview.testrail.io/index.php?/cases/view/96985) | Optional fields with no value are left out | Optional fields with no value are left off the card |
| [C96986](https://shopview.testrail.io/index.php?/cases/view/96986) | Without see-financial-data, all dollar fields stay hidden | Without See Financial Data no dollar fields are shown |
| [C96987](https://shopview.testrail.io/index.php?/cases/view/96987) | Compact/Regular/Comfortable offered in Tech View and Board View, Regular default | Compact, Regular and Comfortable in Tech and Board View, Regular by default |
| [C96988](https://shopview.testrail.io/index.php?/cases/view/96988) | Density changes spacing/size only, never which fields/columns/values show | Density changes only spacing and size, never what is shown |
| [C96989](https://shopview.testrail.io/index.php?/cases/view/96989) | One density selection is shared between Tech View and Board View, and persists | One density choice is shared by Tech View and Board View and kept |
| [C96990](https://shopview.testrail.io/index.php?/cases/view/96990) | Compact never shrinks text below the minimum body text size | Compact never makes text smaller than normal body text |
| [C96991](https://shopview.testrail.io/index.php?/cases/view/96991) | A saved density that cannot load falls back to Regular | If the saved density can't load, Regular is used |
| [C96992](https://shopview.testrail.io/index.php?/cases/view/96992) | Density applies to Tech View rows and Board cards; List unchanged | Density applies to Tech View rows and Board cards, List is unchanged |
| [C96993](https://shopview.testrail.io/index.php?/cases/view/96993) | Avatar group on cards and the Tech View Assigned Techs column (not List) | Technician avatars show on cards and in Tech View's Assigned Techs column |
| [C96994](https://shopview.testrail.io/index.php?/cases/view/96994) | Lead is first and each technician appears once, even across several lines | The lead comes first and each technician shows once across all lines |
| [C96995](https://shopview.testrail.io/index.php?/cases/view/96995) | Overflow shows +N; every technician discoverable by hover | Extra technicians show as +N, and hovering shows every name |
| [C96996](https://shopview.testrail.io/index.php?/cases/view/96996) | The avatar field/column is blank only with no lead and no line technician | The avatar column is blank only with no lead and no line technician |
| [C96997](https://shopview.testrail.io/index.php?/cases/view/96997) | The tech-story check mark is removed everywhere, incl. Simple Flow | The tech story check mark is removed everywhere, including Simple Flow |
| [C96998](https://shopview.testrail.io/index.php?/cases/view/96998) | Entering, editing and requiring a tech story still work; indicator gone | Tech stories can still be entered, edited and required, the mark is gone |
| [C97000](https://shopview.testrail.io/index.php?/cases/view/97000) | No replacement required-tech-story indicator is introduced | No new required-tech-story marker replaces the old one |
| [C97001](https://shopview.testrail.io/index.php?/cases/view/97001) | Drag work orders within and between technician groups/columns in both views | Drag work orders within and between technicians in both views |
| [C97002](https://shopview.testrail.io/index.php?/cases/view/97002) | Between-tech drag reassigns the lead; to/from Unassigned toggles it | Dragging to another technician changes the lead, Unassigned removes it |
| [C97003](https://shopview.testrail.io/index.php?/cases/view/97003) | View users can reorder tech groups/columns; Unassigned stays fixed | Users can reorder technician groups and columns, Unassigned stays first |
| [C97004](https://shopview.testrail.io/index.php?/cases/view/97004) | Pinned technicians reorder only within the pinned area | Pinned technicians can only be reordered among the pinned ones |
| [C97005](https://shopview.testrail.io/index.php?/cases/view/97005) | After reordering, the saved order is used and shared per location across views | The saved technician order is shared by both views for each location |
| [C97006](https://shopview.testrail.io/index.php?/cases/view/97006) | Dragging does not change List's selected sort | Dragging does not change List's chosen sort |
| [C97007](https://shopview.testrail.io/index.php?/cases/view/97007) | Newly eligible technicians append last; reassignment placement rules | Newly added technicians go last, and where reassigned work lands |
| [C97008](https://shopview.testrail.io/index.php?/cases/view/97008) | Between-tech move uses Story 4 feedback; within-tech shows no toast | Dragging to another technician shows the reassign message, same group none |
| [C97009](https://shopview.testrail.io/index.php?/cases/view/97009) | Permission and status restrictions apply to every work-order drag | Permission and status limits apply to every work order drag |
| [C97010](https://shopview.testrail.io/index.php?/cases/view/97010) | Inactive-destination and failure recovery apply to drag reassignment | Dropping on an inactive technician or a failed drop recovers cleanly |
| [C97012](https://shopview.testrail.io/index.php?/cases/view/97012) | Status/permission re-checked before a drop; unauthorized rejected | Status and permission are checked again before a drop is accepted |
| [C97013](https://shopview.testrail.io/index.php?/cases/view/97013) | Filtered reorder places by a visible anchor and keeps it on clear | Reordering while filtered places work next to a visible card |
| [C97020](https://shopview.testrail.io/index.php?/cases/view/97020) | Keyboard access never bypasses permissions or status restrictions | The keyboard never gets around permission or status limits |
| [C97021](https://shopview.testrail.io/index.php?/cases/view/97021) | Keyboard focus, navigation and actions on cards/rows (design-pending) | Keyboard focus, movement and actions on cards and rows |
| [C97022](https://shopview.testrail.io/index.php?/cases/view/97022) | Keyboard focus recovers when a WO leaves the filter (design-pending) | Keyboard focus recovers when a work order leaves the filter |
| [C97023](https://shopview.testrail.io/index.php?/cases/view/97023) | Display-view event fires after load and on each switch, not on refresh | The display is recorded in analytics after loading and on each switch |
| [C97024](https://shopview.testrail.io/index.php?/cases/view/97024) | Field-exposure snapshot recorded once per display per session | The fields shown are recorded once per display per session |
| [C97025](https://shopview.testrail.io/index.php?/cases/view/97025) | Field-change and density-change events fire only after successful saves | Field and density changes are recorded only after they save |
| [C97026](https://shopview.testrail.io/index.php?/cases/view/97026) | Cohorts are reported separately and defaults are never changed automatically | User groups are reported separately and defaults never change by themselves |
| [C97027](https://shopview.testrail.io/index.php?/cases/view/97027) | Events contain no record values or PII and reuse the existing analytics identity | Analytics carry no customer data and use the existing user identity |
| [C97028](https://shopview.testrail.io/index.php?/cases/view/97028) | Analytics failure or opt-out never blocks the feature | Analytics failing or turned off never blocks the feature |
| [C97029](https://shopview.testrail.io/index.php?/cases/view/97029) | Analytics acceptance scenarios are all verified | Every analytics scenario in the acceptance list is checked |
| [C97030](https://shopview.testrail.io/index.php?/cases/view/97030) | Header counts are exact and consistent across List, Tech View, and Board View | Header counts are exact and the same in List, Tech View and Board View |
| [C97031](https://shopview.testrail.io/index.php?/cases/view/97031) | Header counts stay exact after a reassignment (no double-count, no drift) | Header counts stay exact after a reassign, nothing counted twice |
| [C97032](https://shopview.testrail.io/index.php?/cases/view/97032) | The N open dialog count is exact and counts the four included statuses | The open count in the window is exact and counts the four statuses |
| [C97033](https://shopview.testrail.io/index.php?/cases/view/97033) | Field selection rate is a pooled ratio (distinct selectors / exposed) | Field selection rate is the share of users who chose a field |
| [C97034](https://shopview.testrail.io/index.php?/cases/view/97034) | Density and weekly usage counted by distinct users, no double count | Density and weekly use are counted per user, never twice |
| [C97035](https://shopview.testrail.io/index.php?/cases/view/97035) | Event multiplicity and a sample reporting calculation reconcile end to end | Analytics event counts add up to the reported figures end to end |
| [C154648](https://shopview.testrail.io/index.php?/cases/view/154648) | Imported: board displays off and Imported disabled as a status filter | Imported work orders: board displays off, Imported not a status filter |
| [C154649](https://shopview.testrail.io/index.php?/cases/view/154649) | Below the desktop breakpoint the new displays are withheld | The new displays are not offered below the desktop screen width |
| [C154650](https://shopview.testrail.io/index.php?/cases/view/154650) | New board/tech queries are scoped to organization and workplace | The new board and tech views show only this organization and location |

## Work Orders (73)

| Case | Old title | New title |
|---|---|---|
| [C44990](https://shopview.testrail.io/index.php?/cases/view/44990) | Inline add row content follows the user's view mode | The add row's fields depend on the user's view (Tech View or Full View) |
| [C44991](https://shopview.testrail.io/index.php?/cases/view/44991) | Edit control is revealed on hover and on keyboard focus of a part line | The part line's Edit button appears on hover and on keyboard focus |
| [C44992](https://shopview.testrail.io/index.php?/cases/view/44992) | Edit routing follows the user's view mode | Edit opens a row or a window depending on the user's view |
| [C44997](https://shopview.testrail.io/index.php?/cases/view/44997) | Add Part on another line while a row is open triggers the guard | Add Part on another line while a row is open asks to discard it first |
| [C45250](https://shopview.testrail.io/index.php?/cases/view/45250) | Add Part stays available on a Complete line; system uncompletes it | Add Part works on a Complete line and sets the line back to not complete |
| [C45251](https://shopview.testrail.io/index.php?/cases/view/45251) | Completed line: only the allowed part fields are editable (inventory vs special order) | On a completed line only some part fields can be edited |
| [C44999](https://shopview.testrail.io/index.php?/cases/view/44999) | Part number field is the existing catalog typeahead | The Part number field searches the catalog as you type |
| [C45000](https://shopview.testrail.io/index.php?/cases/view/45000) | Selecting a catalog part populates fields and moves focus to quantity | Picking a catalog part fills the fields and moves to Quantity |
| [C45001](https://shopview.testrail.io/index.php?/cases/view/45001) | Description overwrite: editable for catalog, read-only for inventory | Description can be changed for catalog parts but not inventory parts |
| [C45007](https://shopview.testrail.io/index.php?/cases/view/45007) | Tech View part category: Uncategorized only if none, and not shown | Tech View saves a part with no category as Uncategorized, without showing it |
| [C45011](https://shopview.testrail.io/index.php?/cases/view/45011) | X closes the row without saving; with data it triggers the guard | X closes the row without saving, and asks first if it has data |
| [C45012](https://shopview.testrail.io/index.php?/cases/view/45012) | Clicking outside a populated row keeps it open with data preserved | Clicking outside a filled-in row keeps it open with its data |
| [C45013](https://shopview.testrail.io/index.php?/cases/view/45013) | Free-typed part saves as Requested and is flagged as needing details | A typed-in part saves as Auth to order and is flagged as needing details |
| [C45014](https://shopview.testrail.io/index.php?/cases/view/45014) | Inline row shows the keyboard hint legend | The add row shows a list of keyboard hints |
| [C45015](https://shopview.testrail.io/index.php?/cases/view/45015) | Combined validation message names only the missing required fields | One validation message names only the missing required fields |
| [C45017](https://shopview.testrail.io/index.php?/cases/view/45017) | Invalid field is highlighted and focus moves to the first invalid field | The wrong field is highlighted and the cursor moves to the first one |
| [C45021](https://shopview.testrail.io/index.php?/cases/view/45021) | Save fails cleanly when the work order becomes non-editable mid-entry | Saving fails cleanly if the work order is locked while you type |
| [C45025](https://shopview.testrail.io/index.php?/cases/view/45025) | Edit row reuses Story 2 behaviour with a shortened hint legend | The edit row works like the add row, with a shorter keyboard hint list |
| [C45028](https://shopview.testrail.io/index.php?/cases/view/45028) | Hidden pricing and category are preserved on a Tech View edit | A Tech View edit keeps the hidden price and category unchanged |
| [C45029](https://shopview.testrail.io/index.php?/cases/view/45029) | Closing an edit row with changes triggers the discard guard | Closing an edit row with changes asks to discard them |
| [C45030](https://shopview.testrail.io/index.php?/cases/view/45030) | Linking a different catalog part repopulates the edit row | Picking a different catalog part refills the edit row |
| [C45031](https://shopview.testrail.io/index.php?/cases/view/45031) | Opening an edit row and changing nothing records no update | Opening an edit row and changing nothing saves no change |
| [C45033](https://shopview.testrail.io/index.php?/cases/view/45033) | Clearing the description blocks the edit save with validation | Clearing the description blocks saving the edit |
| [C45034](https://shopview.testrail.io/index.php?/cases/view/45034) | Inline edit saves normally — no concurrent-edit detection | An edit saves normally even if someone else changed the part |
| [C45035](https://shopview.testrail.io/index.php?/cases/view/45035) | Work order becoming non-editable during edit fails the save | Saving an edit fails if the work order is locked meanwhile |
| [C45038](https://shopview.testrail.io/index.php?/cases/view/45038) | Selecting a catalog part populates cost and sell price with a dollar prefix | Picking a catalog part fills Cost and Sell Price with a $ sign |
| [C45039](https://shopview.testrail.io/index.php?/cases/view/45039) | Cost/sell overwrite: cost read-only for inventory and Found parts | Inventory and found parts can't change Cost, Sell Price can change |
| [C45040](https://shopview.testrail.io/index.php?/cases/view/45040) | Category is a select and empty saves as Uncategorized | Category is a dropdown, and leaving it empty saves Uncategorized |
| [C45054](https://shopview.testrail.io/index.php?/cases/view/45054) | Requested flow applies in Full View when no catalog part is selected | In Full View a part typed without picking from the catalog saves as requested |
| [C45055](https://shopview.testrail.io/index.php?/cases/view/45055) | Typeahead offers Create as a new part for Full View users only | The part search offers Create as a new part only in Full View |
| [C45056](https://shopview.testrail.io/index.php?/cases/view/45056) | Combined validation names empty cost and sell price too | The validation message also names an empty Cost and Sell Price |
| [C45057](https://shopview.testrail.io/index.php?/cases/view/45057) | More Options bypasses inline validation | More Options opens even when required fields are empty |
| [C45058](https://shopview.testrail.io/index.php?/cases/view/45058) | Non-numeric or negative cost or sell price is rejected by field | A non-number or negative Cost or Sell Price is refused for that field |
| [C45059](https://shopview.testrail.io/index.php?/cases/view/45059) | Sell price below cost shows a non-blocking note and still saves | A Sell Price below Cost shows a note but still saves |
| [C45060](https://shopview.testrail.io/index.php?/cases/view/45060) | Catalogue part with no price of its own may be saved at 0.00 | A catalog part with no price of its own can be saved at 0.00 |
| [C45061](https://shopview.testrail.io/index.php?/cases/view/45061) | Work order becoming non-editable during Full View add fails the save | Saving in Full View fails if the work order is locked meanwhile |
| [C45062](https://shopview.testrail.io/index.php?/cases/view/45062) | Any other Full View save failure keeps the row open with data | Any other Full View save failure keeps the row open with its data |
| [C53477](https://shopview.testrail.io/index.php?/cases/view/53477) | Full View without See Financial Data gets the three-field row | Full View without See Financial Data gets the three-field add row |
| [C45063](https://shopview.testrail.io/index.php?/cases/view/45063) | Full View Edit opens the part details modal pre-populated | Full View Edit opens the part details window already filled in |
| [C45068](https://shopview.testrail.io/index.php?/cases/view/45068) | Edit while an inline add row is open triggers the guard first | Edit while an add row is open asks to discard that row first |
| [C45069](https://shopview.testrail.io/index.php?/cases/view/45069) | Closing a populated add row shows the discard-part confirmation | Closing a filled-in add row asks to confirm discarding the part |
| [C45070](https://shopview.testrail.io/index.php?/cases/view/45070) | Closing a changed edit row shows the discard-changes confirmation | Closing a changed edit row asks to confirm discarding the changes |
| [C45072](https://shopview.testrail.io/index.php?/cases/view/45072) | Discard Part closes the row and restores saved values on edit | Discard Part closes the row and puts back the saved values on edit |
| [C45073](https://shopview.testrail.io/index.php?/cases/view/45073) | Navigating away with data shows the leave-without-saving confirmation | Leaving the page with a filled-in row asks to confirm leaving |
| [C45074](https://shopview.testrail.io/index.php?/cases/view/45074) | Opening another row with data prompts, then swaps or keeps | Opening another row while one has data asks first, then switches or stays |
| [C45081](https://shopview.testrail.io/index.php?/cases/view/45081) | Untouched follow-on empty row after a save prompts nothing | The empty row that opens after a save never asks to discard |
| [C45082](https://shopview.testrail.io/index.php?/cases/view/45082) | Leave discards the entered part and completes navigation | Leave discards the typed part and goes to the new page |
| [C45083](https://shopview.testrail.io/index.php?/cases/view/45083) | Stay on Work Order cancels navigation and refocuses the row | Stay on Work Order cancels leaving and returns to the row |
| [C45221](https://shopview.testrail.io/index.php?/cases/view/45221) | Catalog part carries named bins with on-hand quantity and one Default | A catalog part has named bins with stock on hand, one marked Default |
| [C45222](https://shopview.testrail.io/index.php?/cases/view/45222) | Typeahead result cards show inventory quantity and bin chips | Part search results show stock quantity and bin chips |
| [C45223](https://shopview.testrail.io/index.php?/cases/view/45223) (Automated) | Selecting a part auto-allocates the full quantity to a single bin | Picking a part takes the full quantity from a single bin |
| [C45224](https://shopview.testrail.io/index.php?/cases/view/45224) (Automated) | Allocation is shown below the row as a Pulled from chip | The bin used shows below the row as a Pulled from chip |
| [C45225](https://shopview.testrail.io/index.php?/cases/view/45225) | Chip label is the bin name for one bin and N bins for a split | The chip shows the bin name, or "N bins" when split |
| [C45226](https://shopview.testrail.io/index.php?/cases/view/45226) | Selecting the chip opens a bin picker listing every bin | Clicking the chip opens a bin list showing every bin |
| [C45227](https://shopview.testrail.io/index.php?/cases/view/45227) (Automated) | Choosing a bin from the picker moves the full quantity into it | Choosing a bin from the list moves the full quantity into it |
| [C45228](https://shopview.testrail.io/index.php?/cases/view/45228) | Allocating more than a bin holds is permitted and only warns | Taking more than a bin holds is allowed, with a warning |
| [C45229](https://shopview.testrail.io/index.php?/cases/view/45229) | A short single-bin allocation shows the takes-negative warning | Taking more than one bin holds shows the going-negative warning |
| [C45230](https://shopview.testrail.io/index.php?/cases/view/45230) | Auto-switching off the Default bin shows an informational note | A note appears when the part is taken from a bin other than Default |
| [C45231](https://shopview.testrail.io/index.php?/cases/view/45231) | Editing the quantity re-runs allocation per manual or automatic state | Changing the quantity updates the bins, keeping a bin you chose yourself |
| [C45232](https://shopview.testrail.io/index.php?/cases/view/45232) | Split across bins opens the right modal for each view mode | Splitting across bins opens the right window in each view |
| [C45233](https://shopview.testrail.io/index.php?/cases/view/45233) | Bin Locations modal lists a row per bin with Auto and Apply | The Bin Locations window lists each bin with Auto and Apply |
| [C45234](https://shopview.testrail.io/index.php?/cases/view/45234) (Automated) | Applying a split writes it back and sets quantity to the sum | Applying a split saves it and sets the quantity to the total |
| [C45235](https://shopview.testrail.io/index.php?/cases/view/45235) | Already-negative bins show in error styling but do not block | Bins already below zero show in red but don't block saving |
| [C45236](https://shopview.testrail.io/index.php?/cases/view/45236) | Tech View edit row carries the same allocation UI and restores stored splits | The Tech View edit row has the same bin choice and keeps saved splits |
| [C45237](https://shopview.testrail.io/index.php?/cases/view/45237) (Automated) | Allocation is stored on save and not shown on the saved part row | The bins chosen are saved but not shown on the saved part row |
| [C45238](https://shopview.testrail.io/index.php?/cases/view/45238) | The Pulled from chip is reachable by Tab | The Pulled from chip can be reached with the Tab key |
| [C45239](https://shopview.testrail.io/index.php?/cases/view/45239) | A part with no bins gets no allocation and no chip | A part with no bins gets no bin chip |
| [C45240](https://shopview.testrail.io/index.php?/cases/view/45240) | A part not linked to the catalog gets no allocation and no chip | A part not linked to the catalog gets no bin chip |
| [C45242](https://shopview.testrail.io/index.php?/cases/view/45242) | No note is shown when the Default bin covers the quantity | No note shows when the Default bin covers the quantity |
| [C45243](https://shopview.testrail.io/index.php?/cases/view/45243) | A split allocation never shows the takes-negative warning | A split across bins never shows the going-negative warning |
| [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) | Add Part button hidden on Complete, Invoiced, Paid; shown on Declined | Add Part is hidden on Complete, Invoiced and Paid, shown on Declined |
| [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) | Edit control hidden on Complete, Invoiced, Paid; shown on Declined | Edit is hidden on Complete, Invoiced and Paid, shown on Declined |
| [C45004](https://shopview.testrail.io/index.php?/cases/view/45004) | Save requires a description and a quantity; part number optional | Save needs a description and quantity, the part number is optional |

