# Source reconciliation — Confluence 576978945, read LIVE 17 September 2026

**Page:** *Global Search - Product Requirements* ·
https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945
**Confluence version integer: 17**, last updated **2026-09-08** (the document's own change log calls
this **v1.5**). Full extracted body saved beside this file as
`spec-576978945-v17-2026-09-17.txt`.

**Why this read happened.** Seven reports were raised today. Five of them quote this page. Two —
SV-10186 and SV-10188 — were filed with a Sources section that cited the product's own screens
instead, because I had convinced myself the read was unauthorised **while already quoting the same
page in five tickets the same morning.** That inconsistency is the error; this file closes it.
See learning L0157.

---

## Rule 106 — four outcomes, per affected case

| Case | Case's Expected | The source, live | Build | Outcome |
|---|---|---|---|---|
| C44854 | parts already on the WO are demoted; same-category parts get a small boost | **agrees, and is more precise** | no contextual weighting at all | ✅ **real defect** — SV-10188 stands |
| C44838 | "status badge colors (same tokens as the WO list)" | ⚠️ **DISAGREES** — the current page pins no colours and says search uses the design system's map | same status differs between search and the WO list | ⚠️ **ticket re-grounded** on what the page actually says; the case's wording is stale |
| C53476 | no count in the search reads higher than 20 | ✅ **agrees, explicitly including tabs** | the All tab reads 44 | ❗ **real defect — and this contradicts the QA lead's 2026-09-17 ruling.** Surfaced under Rule 63, not acted on |
| C45139 | a contact-field match carries no primary-name bonus | ✅ agrees verbatim | bonus applied | ✅ SV-10161 stands |
| C44825 / C44826 | a "Show all N" link appears above five matches and switches to that scope tab | ✅ agrees verbatim | link absent | ✅ SV-10159 stands |
| C44865 | *No results for "<query>"* plus *in <Tab>* on a scope tab | ✅ agrees verbatim | tab name absent | ✅ SV-10181 stands |
| C44833 | Asset row: year + make + model, owning customer secondary | ✅ agrees verbatim | wrong | ✅ SV-10178 stands |
| C44836 | Part Sale row: P-number + customer, status badge, total, date | ✅ agrees verbatim | wrong | ✅ SV-10163 stands |

---

## The passages, quoted verbatim

### §5.3 Result row anatomy — status badges (this is what changes SV-10186)

> Status badges come from the design system. Search uses the shared Badge component and the system's
> status-to-tone map; it does not define a palette of its own. Any change to a status colour is made
> in the design system and propagates here, so no colour values are pinned in this document.
>
> Stock badges on parts use the same component: success when quantity is above the low threshold,
> warning at or below it, danger when zero.

**Our case C44838 says "status badge colors (same tokens as the WO list)".** That wording comes from
the 2026-07-16 Word export held in `build/global-search/requirements.md` line 160, which pinned
colours per status. **The page no longer says that.** The requirement that survives is narrower:
search uses the design system's status-to-tone map and defines no palette of its own. **C44838's
Expected is stale and needs correcting** (Rule 106 — ask, do not edit silently).

The defect still stands on the current wording, because the same status renders a different tone in
search than in the rest of the app, which cannot be true if both are reading one shared map.

### §6.3 Contextual bias (lightweight) — this is what grounds SV-10188

> If the user is currently on a Customer page, all candidate Assets and Work Orders owned by that
> customer get a +0.20 boost; if on a Work Order, parts already on that WO are demoted by −0.10 (the
> user is usually looking for something they don't have yet) while other parts in the same category
> as the WO's existing parts get +0.05. This is implemented as a single signal rather than full
> page-context awareness, to keep the surface area small.

### §5.2 — counts (this contradicts the 2026-09-17 ruling)

> Each group shows up to 5 results (raised from today's 3). When a group has more, a Show all N link
> appears to the right of the group header. **Counts are capped at 20. No count in the modal reads
> higher than 20 — not a tab, not a group header, not the Show all N link.** A query matching 34
> work orders shows Work Orders (20) and Show all 20. Twenty is both what search returns per entity
> type and what it reports.

> The Show all N link behaviour — scoped tab. Clicking it switches the modal to that entity's scope
> tab. The user never leaves the modal: there is no separate search results page and no handoff of
> the query to an entity's list page.

**Observed:** the All tab reads **44** — the sum of the capped per-type counts. The page says *no
count in the modal reads higher than 20, not a tab*. **The QA lead ruled on 2026-09-17 that twenty
is per section and the All tab may therefore total more.** The written source says otherwise.
**Surfaced, not acted on (Rule 63).**

### §4 — contact-field matches (grounds SV-10161)

> For ranking, a match on a contact field scores as a secondary-field match (§6.1) and carries no
> primary-name bonus.

> Bonus for match on the primary display name vs. a secondary indexed field → +0.10. A match on a
> contact field of a customer or vendor is a secondary-field match and does not receive this bonus.

### §5.2 — no-results wording (grounds SV-10181)

> No results. "No results for '<query>'" — plus " in <Tab>" when a scope tab other than All is
> active. Nothing else.

### §4 — Asset and Part Sale rows (ground SV-10178 and SV-10163)

> Assets. … Displayed: year + make + model (primary), customer name (secondary, smaller).

> Part Sales. Indexed: P-number (e.g. P2-58), customer name, asset, VIN/serial #, created-by user.
> Displayed: P-number + customer (primary), status badge, total price + created date.

---

## Still open after this read

* **C45132 / C45136 (mobile).** §5.6 governs them; read the saved extract before judging either.
  Not reconciled in this pass.
* **C44829.** Already resolved without the source, by reading what the component declares itself to
  be (combobox + listbox). Marked Passed; its third step still needs correcting.
