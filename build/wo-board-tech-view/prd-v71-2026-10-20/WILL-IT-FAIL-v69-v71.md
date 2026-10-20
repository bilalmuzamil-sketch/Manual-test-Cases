# Work Order Board: which cases PRD v69 to v71 really breaks (20 Oct 2026)

Answer to the QA lead's question "if that change in the specs is really causing those test cases to fail if they are not updated".
Source: PRD Confluence 845185030 v68 → v71 diff (`PRD-DIFF-v68-to-v71.diff`, read in full) and every case's own steps and plain
results (`break-check.json`, by script; quotes excluded). Today's staging build still shows "Fields to display" and the Board View
density button: SV-11580 is Open, planned for Thursday's build (Chris Ward, Slack #fs-board-tech-view, 20 Oct 2026).

| Group | Cases | Fails if not updated? |
|---|---|---|
| A. A step clicks, or a result names, "Fields to display" | C368161, C96943, C96976, C96977, C96978 (Automated), C96980, C96981 (Automated), C96982, C96983, C96984, C96985, C96986, C581894, C96993-C96996 (Automated), C154649 (Automated), C368154, C690648, C96988 (Automated) | Passes today. From the build where SV-11580 ships, the button reads "Column Selection": the tester cannot find "Fields to display" (Blocked), and results naming it fail. |
| A2. Same, in "Not runnable for now" (analytics) | C97025, C97027, C97029, C97033, C97035, C368153; C97028 in Fast-follow | Not run now; same break when they are. |
| B. Tests Density on Board View | moved to Fast-follow 20 Oct: C96954, C96955. Mixed (Tech View density and Board View density in one case): C96987, C96988 (Automated), C96989 (Automated), C96990, C96991, C96992 (Automated), C590110, C590128; analytics C97024, C97034 | Fail from the SV-11580 build: Board View has no density button. The Tech View parts still pass. |
| C. Technician list (S1-R15 v69) | C581915 | Already failing (SV-11575); rewritten 20 Oct. C96911, C96913, C581916, C590127 do not depend on who is listed: no failure. |
| D. Only the quoted PRD text or the setup notes changed | C698883 (rewritten), C96927, C96975, C96979, C97023, C97026, C590115, C96911, C96913, C581916, C590127; setup mentions only: C581895, C682438, C590124, C614717 | No failure. The quote names an older version; the setup notes say "Fields to display", which a Claude session would need to read as "Column Selection" after SV-11580. |
| E. Not ours | C204101 (created by another user) | Hands-off. |
