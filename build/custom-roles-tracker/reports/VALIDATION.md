# Track Changes validation — 22/22 checks passed

Throw-away store and a shared clone of the product repo; nothing real was modified.

| | Check |
|---|---|
| ✅ | History v26.35.0→v26.36.0 finds "Move Labor" permission added (SV-8911) |
| ✅ | History v26.35.0→v26.36.0 finds the Move Labor ⇒ Work Order Lines dependency |
| ✅ | History v26.35.0→v26.36.0 reports no permission REMOVED |
| ✅ | Confirming a reviewed scan records the release snapshot |
| ✅ | Scanning the same release again is refused as a duplicate |
| ✅ | History v26.36.0→v26.39.0 finds the accounting permissions added (15 area + HR) |
| ✅ | Comment/whitespace-only commit → "No Custom Roles & Permissions changes detected" |
| ✅ | A no-change release cannot be recorded as a changed-behaviour snapshot |
| ✅ | With --checkpoint it is recorded as a no-change checkpoint |
| ✅ | Added permission is reported, with Technician as a default holder and High risk |
| ✅ | Adding a permission reports no unrelated default change |
| ✅ | Default change is reported: Technician "customersView" ON → OFF, and nothing else |
| ✅ | Dependency added is reported (Pick Parts ⇒ Work Order Lines — Create & Edit), and nothing else |
| ✅ | A removed API guard is reported as backend enforcement change, High risk, naming the endpoint |
| ✅ | A permission that now grants an extra server atom is reported, naming the atom |
| ✅ | A label change is reported as a modified permission, Low risk, and nothing else |
| ✅ | A removed permission is reported, with its former holder, High risk |
| ✅ | Every reported change carries risk + reason, before/after, roles, workflows, scenarios, evidence, status |
| ✅ | Every change (308) has a plain headline, explanation and how-to-check steps |
| ✅ | No technical terms in the plain words of any change |
| ✅ | The written release reports (11) are in plain words above the technical appendix |
| ✅ | Every app-vs-plan verdict (63) is explained in plain words |
