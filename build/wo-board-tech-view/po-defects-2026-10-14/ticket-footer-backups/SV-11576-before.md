**What's wrong:** The List's Asset column shows make and model but no year. Board View cards show "year make model", and the API already sends the year.

**Expected:** The same format as the Board card: year make model (Chris, Slack, 20 Oct 2026: "yes, in the same format as the Board card… Put it in this release if you can; if not, a fast follow is fine"). Tech View rows share this cell, so they show the year too.

**Where:** `WorkOrderTableRow.vue:134` reads the year from the wrong field (`scope.row.value`).
