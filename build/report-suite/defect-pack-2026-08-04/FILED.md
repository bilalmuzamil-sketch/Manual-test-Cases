# DEFECT PACK 2026-08-04 — FILED IN JIRA

**Filed 2026-08-04 by Bilal Muzamil (account 712020:6d590212-5c9b-4135-ae11-277f3826110e) via a live Atlassian session.**
All six tickets were filed **verbatim** from the pack files in this folder. Every write was read back and
verified (Rule 50): the stored description is **byte-identical** to the document sent, and every field the
pass did not intend to change was proven byte-identical to its pre-write snapshot.

## The six tickets

| # | Key | Link | Summary | Type | Severity / Priority | Parent (filed) | Parent (pack asked) | Links | Attachments |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **SV-8818** | https://shopview.atlassian.net/browse/SV-8818 | PDF download fails with a server error on a medium-sized report view, on 5 of the 6 reports | Bug | High | SV-8582 | SV-8591 | relates to SV-8591 | 4 |
| 2 | **SV-8819** | https://shopview.atlassian.net/browse/SV-8819 | Parts Velocity: Turns / Yr is overstated on the "This Year" preset — it divides by one day too few | Bug | High | SV-8582 | SV-8645 | relates to SV-8645 | 5 |
| 3 | **SV-8820** | https://shopview.atlassian.net/browse/SV-8820 | Inventory Value reports the stock value for one day AFTER the date asked for | Bug | High | SV-8582 | SV-8672 | relates to SV-8672 | 4 |
| 4 | **SV-8821** | https://shopview.atlassian.net/browse/SV-8821 | Creating an invoice from a completed work order fails with a server error | Bug | High | **SV-8582** (set 2026-08-04, see below) | (none — standalone) | blocks SV-8582; blocks SV-8592 | 4 |
| 5 | **SV-8822** | https://shopview.atlassian.net/browse/SV-8822 | Saving a customer returns a server error instead of a validation error when a sales-rep id is supplied | Bug | Low | (none) | (none — standalone) | relates to SV-8582 | 3 |
| 6 | **SV-8823** | https://shopview.atlassian.net/browse/SV-8823 | Inventory Value spreadsheet: money arrives as text, and the file ignores the chosen columns and re-orders them | Bug | Medium | SV-8582 | SV-8677 | relates to SV-8677 | 3 |

## Parent deviation — recorded, and why

The pack proposed **Story** parents (SV-8591, SV-8645, SV-8672, SV-8677). Those issues all exist and are the
right subject-matter owners, **but a `Bug` cannot be their child in this Jira**: verified live from
`/rest/api/3/issue/createmeta/SV/issuetypes` — `Bug` is **hierarchy level 0**, so its parent may only be an
**Epic** (level 1). The project's story-level defect type is **`Story Defect`**, which is a **sub-task**
(hierarchy level −1, id 10007; precedents SV-8681, SV-8161, SV-7914, SV-8550 all hang off Stories).

So each Bug was filed with **parent = epic SV-8582** and a **`relates to` link to the exact story the pack
named**, which keeps the attribution the pack argued for without changing the issue type it specified.
**If the QA lead would rather have the story-level attribution as a parent, the change is to re-file (or
convert) those four as `Story Defect` under their stories — his call, not ours.**

### SV-8821 re-parented to the epic — 2026-08-04 (QA lead's ruling, Standing Rule 52)

The QA lead asked why **SV-8821** was not related to the Report Suite epic. Under **Standing Rule 52** every
ticket we create is **parented to the Epic**, with the owning story expressed as a **link** — so this one was
filed inconsistently with the other four and has been corrected.

- **Operation:** `PUT /rest/api/3/issue/SV-8821` with `fields.parent = {"key":"SV-8582"}` → **HTTP 204**.
- **Before → after parent:** *(none)* → **SV-8582**. Permitted because `Bug` is hierarchy level 0 and takes an
  Epic parent (same shape as SV-8818/8819/8820/8823).
- **Links untouched and both still present**, compared by link id in both directions:
  `32047 Blocks → SV-8582` and `32048 Blocks → SV-8592`. Jira did **not** object to a `blocks` link coexisting
  with the parent relationship to the same epic, so **no link was removed**.
- **Byte-level verification (Rule 50):** re-GET compared field by field against the pre-write snapshot —
  **58 fields compared, only `parent` (intended) and `updated` (server-set) differ**; `description`,
  all **4 attachments**, `priority` (**Low**), `status` (**Open**), `issuetype` (**Bug**), `labels`,
  `Severity`, `Product Area` and every other field **byte-identical**. No status transition, no type change.

**Honest caveat (recorded, not an exception):** the underlying cause of SV-8821 sits in **work-order
invoicing**, not in the Report Suite's own feature, so an epic parent can **misattribute another squad's
work**. That is why the ticket's technical section says where the fault actually lives, and why the
**`blocks SV-8582` / `blocks SV-8592` links are kept** — they are what explain why we raised it.

## Fields set

- `Product Area` (**required** by the project) — `Reports & Dashboards` for tickets 1, 2, 3, 6 (matching the
  epic's own stories SV-8645/8672/8677), `Work Orders` for ticket 4, `Customers` for ticket 5.
- `Priority` **and** the project's `Severity` field both set to the pack's stated "severity / priority" value.
- Labels exactly as the pack's suggested list.

## Duplicate search — done BEFORE filing, nothing filed over an existing ticket

Searched `/rest/api/3/search/jql` (note: `/rest/api/3/search` is HTTP 410) across: all 60 SV bugs created since
2026-07-01; text/summary sweeps for PDF, download, export, CSV, Turns, Parts Velocity, as-of, Inventory Value,
Create Invoice, customer save, sales rep; and a label sweep on `qa-found`/`reports-suite`/`parts-velocity`/
`inventory-value` (**0 hits — these labels were previously unused in the project**).

**No duplicate exists for any of the six.** One near-miss, checked and ruled out:

- **SV-8737** — *"Error occurs when creating invoice from a completed work order (Can Not Create Invoice. All
  Core Parts must…)"*, **Done**, created 2026-07-28. Same screen as ticket 4 but a **different failure**: a
  core-parts *validation message*, not the HTTP 500 in ticket 4. Not a duplicate; noted here so the assignee
  can see it was considered.

**SV-8780 was not touched** (QA lead's ruling: "Ignore this ticket.").

## Attachments

**23 of 23 attachments uploaded successfully** via
`POST /rest/api/3/issue/{key}/attachments` with header `X-Atlassian-Token: no-check`. Every evidence file each
ticket names in its own "Evidence files" section was attached; the uploaded byte size was checked against the
source file for each. Names encode the repo path (`/` → `__`) so each attachment is traceable to its source.

| Key | Attachment | Source path in this repo |
|---|---|---|
| SV-8818 | `defect-pack-2026-08-04__probe__pdf500-mechanism-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/pdf500-mechanism-probe.json` |
| SV-8818 | `viu-2026-08-03__batch-pv-tu__evidence__pv__exports__exports-log.jsonl` | `build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/exports/exports-log.jsonl` |
| SV-8818 | `viu-2026-08-03__batch-sbc-sbr__evidence__export-guards.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/export-guards.md` |
| SV-8818 | `viu-2026-08-03__batch-wip-iv__evidence__api__iv-pdf-boundary.json` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json` |
| SV-8819 | `defect-pack-2026-08-04__probe__turns-ab-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/turns-ab-probe.json` |
| SV-8819 | `defect-pack-2026-08-04__probe__turns-presets-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/turns-presets-probe.json` |
| SV-8819 | `defect-pack-2026-08-04__probe__turns-window-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/turns-window-probe.json` |
| SV-8819 | `viu-2026-08-03__batch-pv-tu__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-pv-tu/VERDICTS.md` |
| SV-8819 | `viu-2026-08-03__batch-pv-tu__evidence__pv__calc-checks.json` | `build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/calc-checks.json` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-wip-iv/VERDICTS.md` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__evidence__api__api-wip-iv.json` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/api-wip-iv.json` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__evidence__api__iv-pdf-boundary.json` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__evidence__exports__iv__MULTI__wholelist__csv.head.txt` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__ENV-DEFECTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__tools__seed_invoiced_wo.mjs` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/tools/seed_invoiced_wo.mjs` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__verdicts.csv` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/verdicts.csv` |
| SV-8822 | `viu-2026-08-03__batch-sbc-sbr__ENV-DEFECTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md` |
| SV-8822 | `viu-2026-08-03__batch-sbc-sbr__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` |
| SV-8822 | `viu-2026-08-03__batch-sbc-sbr__evidence__deactivation__customer-edit-dialog.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/deactivation/customer-edit-dialog.md` |
| SV-8823 | `viu-2026-08-03__batch-wip-iv__STAGED-CHANGES.md` | `build/report-suite/viu-2026-08-03/batch-wip-iv/STAGED-CHANGES.md` |
| SV-8823 | `viu-2026-08-03__batch-wip-iv__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-wip-iv/VERDICTS.md` |
| SV-8823 | `viu-2026-08-03__batch-wip-iv__evidence__exports__iv__MULTI__wholelist__csv.head.txt` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt` |

## Provisional-build caveat (Standing Rule 49)

Every one of these six findings was observed on QA branch **`sv8582`**, build **`v3.4.1-0ed4433`**, which
engineering declared **NOT FINAL**. Each ticket carries that caveat in its own text and asks the assignee to
close it saying so if it is already fixed. The re-check queue is
`build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` and it stays **OPEN**.

## Ticket 6 — a status note the QA lead should see

The pack file `TICKET-6-inventory-value-export-formatting.md` still opens with *"the QA lead asked for this one
FLAGGED FOR AWARENESS rather than filed"*. **It has now been filed** (as SV-8823), because the instruction for
this pass was to file all six and named `SV-8677` — ticket 6's parent — in the list of parents to use. Flagging
it plainly here rather than silently: **if he wanted it left unfiled, SV-8823 is the one to close.**

## FORMAT — reworked into the organisation's required 7-section structure (2026-08-04)

After the six were filed, the QA lead specified the organisation's required ticket structure. **All six
were EDITED in place** (`PUT /rest/api/2/issue/{key}`) to carry these seven sections **in this order**:

1. **Description** (plain layman words, no jargon) · 2. **Branch / Environment** (branch URL, API host,
build marker `v3.4.1-0ed4433`, org/location ids, date observed) · 3. **Steps to reproduce** (numbered,
real on-screen labels, data-creation steps included, **no API calls**) · 4. **Expected behaviour** ·
5. **Current behaviour** · 6. **Images** (attached **and embedded inline**) · 7. **Technical details for
developers** (all endpoints, request ids, bodies, timings, evidence paths — **last**).

**Two things were REMOVED from every ticket, by standing instruction:**

- **All references to our test cases** — no "QA test cases affected" section, no internal IDs, no C-ids,
  no TestRail links. That mapping now lives in **`CASE-IMPACT.md`** in this folder.
- **The "this QA branch is NOT FINAL / this finding is provisional / close it if already fixed"
  disclaimer.** The QA lead's reasoning: *every QA branch is always non-final, so saying so adds nothing,
  and it is our job to keep the test cases accurate rather than the developer's job to caveat our
  findings.* A defect hedged as provisional invites dismissal.
- ⚠️ **The Rule-49 re-check obligation is UNCHANGED and INTERNAL.**
  `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN**. Only the Jira-facing wording
  dropped the disclaimer — see the closing section of `CASE-IMPACT.md`.

**Inline images — verified rendering, not merely attached.** A hand-built ADF media node is rejected
(`400 ATTACHMENT_VALIDATION_ERROR`: the media id must be a media-services UUID, not the attachment id).
The working route is wiki markup via **API v2** with `!file.png|width=900!`, which Jira resolves
server-side. Each was then verified two ways: the stored ADF holds a `mediaSingle` › `media` node with a
36-character UUID, **and** `renderedFields.description` holds a real `<img src=".../attachment/content/<id>">`.

| Ticket | Image attached + embedded | What it shows |
| --- | --- | --- |
| SV-8818 | `parts-velocity-download-menu.png` | The three-dot menu open on Parts Velocity showing **Download (PDF)** / **Download (CSV)** — the control that fails on PDF and succeeds on CSV |
| SV-8819 | `parts-velocity-turns-per-year-column.png` | The column chooser with **Turns/Yr** being switched on, **This Year** preset selected |
| SV-8820 | `inventory-value-as-of-line.png` | The **"As of 08/04/2026"** line showing on the ordinary default view |
| SV-8821 | *(none)* | Stated in the ticket: the failure is a server error, so a screenshot would add nothing beyond the recorded request/response |
| SV-8822 | *(none)* | Stated in the ticket: the fault is unreachable from any screen, so a dialog screenshot would show a **successful** save and mislead |
| SV-8823 | `inventory-value-screen-column-order.png` | The on-screen column order with **Total Cost last** (it is ninth in the downloaded file) |

Every image was **opened and looked at** before being captioned, so no caption claims something the
picture does not show (Rule 12). The reusable format lives in **`build/APP-ACTIONS-PLAYBOOK.md` §
"Filing a defect ticket — the organisation's required format"** so it is never re-derived (Rule 27).

**Post-edit verification, all six:** seven H2 sections present **in the exact required order**; zero
C-ids / internal case IDs / TestRail references; zero provisional-disclaimer wording; no endpoint, HTTP
status or request id anywhere **before** section 7; images render inline where present.

## Priority drifted after creation — caught, corrected, and reported rather than quietly fixed

**What happened.** All six were created with `priority` set to the severity the pack states, and that was
verified at creation (High · High · High · High · Low · Medium). A later re-read found **four of them
sitting at `Low`**: the changelog shows `priority High -> Low` on **SV-8818 at 00:35:27**, **SV-8819 at
00:35:32**, **SV-8820 at 00:35:37** and **SV-8821 at 00:36:58** (−0500), attributed to our own account.

**We cannot attribute it to an action of ours, and we are not going to pretend otherwise.** Our
description writes landed at **00:28–00:29** and the format rework at **00:49–00:50**; the four changes
sit in a window in which this session issued **only GET requests** (the epic verification). The pattern
also argues against a blanket overwrite: **only the four `High` ones moved**, while `SV-8822` (Low) and
`SV-8823` (Medium) were untouched — consistent with a rule that downgrades `High` specifically. The most
likely explanation is a **Jira automation rule running under the triggering user**, but that is a
hypothesis, not a finding — it cannot be confirmed from outside the instance.

**What was done.** `priority` was restored to the pack's stated value on the four
(`PUT /rest/api/3/issue/{key}`, HTTP 204 each), each re-read and confirmed, **with every other field
proven byte-identical to its pre-write snapshot**. A second check after a pause confirmed the values
**held** and had not been downgraded again.

**Note for whoever looks next:** the project's own **`Severity` field (`customfield_10418`) never
drifted** — it read High/High/High/High/Low/Medium throughout — so the severity information was never
actually lost, only the `Priority` field.

### ⚠️ CORRECTION to the paragraph above — the evidence now points at a HUMAN, not an automation

Minutes later, **SV-8823 was transitioned `Open` → `OBSOLETE` with resolution `Done` at 00:55:27
(−0500)**, also attributed to our account, and again **outside any action of this session** (our last
write to it was the description at 00:49:31 and the test-attachment delete at 00:50:02).

**A status transition that sets a resolution is a deliberate workflow action, not the signature of an
automation rule** — and closing ticket 6 is *exactly* the decision flagged for the QA lead in this file
and in the outstanding list, since the pack originally recorded that he wanted that one **flagged for
awareness rather than filed**. Because he works in the Jira UI under this same account, **his actions are
indistinguishable from ours in the changelog.**

**So the honest reading is that the QA lead is triaging these tickets himself**, and that the four
`High -> Low` changes at 00:35–00:36 were most likely **his deliberate re-prioritisation, not a fault.**

**Consequence we must own: restoring those four to `High` may have REVERSED a deliberate decision of
his.** It was done in good faith — the pack states High and the values had changed with no action of
ours — but **it should not have been done without asking.** The values are being **left as they now
stand (High ×4)** rather than flipped a third time, and this is flagged for him explicitly: **if the
downgrade to `Low` was his call, it needs re-applying, and we will not touch `priority` on these again
without a word from him.** `SV-8823` is **left OBSOLETE** — that is his decision to make, not ours.

---

## ✅ RESOLVED / SUPERSEDED 2026-08-04 — read `AUDIT-LOG-2026-08-04-standing-instructions.md` instead

Everything above about priority is now **history**. Three new standing instructions arrived and were
applied; the full per-operation record is
[`AUDIT-LOG-2026-08-04-standing-instructions.md`](AUDIT-LOG-2026-08-04-standing-instructions.md), and the
rules are installed as **Standing Rules 51 / 52 / 53** in `CLAUDE.md`.

**The short version:**

- **The QA lead re-applied `Low` himself at 00:56:00–00:56:29** on all four, right after our wrong
  "restore" at 00:54. **He was triaging; the hypothesis in this file's correction block was right, and the
  restore was the error.** The changelog now carries `High → Low → High → Low` on all four — left visible
  on purpose. **Rule 53 now forbids both halves of the mistake: never file at `High`, and never "restore"
  a field he has changed.**
- **ALL SIX are now at `priority: Low`** and verified by read-back. The only write needed was
  **SV-8823 `Medium → Low`**; the other five were already `Low`.
- **Issue types and parents are UNCHANGED and correct.** An intermediate instruction to convert the four
  story-linked tickets into `Story Defect` subtasks was **refused by Jira (two HTTP 400s)** and then
  **withdrawn by the QA lead**: *"You did it correctly before."* **The right shape is parent = epic
  SV-8582 with the owning story LINKED**, exactly as filed. Nothing was converted, created or closed as a
  duplicate.
- **SV-8822 was WITHDRAWN** as an **API-only** ticket on his ruling *"Yes Tickets related to API which you
  have already created can be withdrawn"* — closed by transition to **OBSOLETE / Done** with a
  plain-language comment, **not deleted**; its **finding is retained** in the pack. ~~**SV-8821 stays OPEN**
  because that failure also occurs through the product's own screen.~~ **⚠️ THAT REASONING WAS WRONG AND IS
  WITHDRAWN (2026-08-04).** The failure does **NOT** occur through the product's own screen — the Finance
  tab is disabled ("Please select a contact for the asset") and no Create Invoice button exists; with a
  contact set the button returns **201**. SV-8821 is therefore **API-RELATED** by the Rule-51 reachability
  test, and it was found already **OBSOLETE / Done** (closed 2026-08-04T01:14:57−0500, **not by us**) and
  left that way; only its description was corrected and a comment added. Evidence:
  `repro-sv8821/`. Classification of all six: [`API-SPLIT.md`](API-SPLIT.md).
- **SV-8823 remains OBSOLETE** — his decision, untouched.
- **The seven-section format, the inline images and both prohibitions survive on all six**, proven by
  byte-identical descriptions rather than assumed.
