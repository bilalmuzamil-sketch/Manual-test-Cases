## Filing a defect ticket — the organisation's required format (ALL projects, ALL future tickets)

**Standing instruction from the QA lead, 2026-08-04. Every defect ticket we file, on every project,
uses these SEVEN sections IN THIS ORDER.** Do not re-derive this (Rule 27). Canonical worked examples:
`build/report-suite/defect-pack-2026-08-04/TICKET-1…6*.md` (filed as SV-8818…SV-8823).

**🛑 BEFORE YOU EDIT AN EXISTING TICKET'S DESCRIPTION, READ §J DECLARED HAZARD #4.** Rewriting a
description over the REST API **DELETES any pasted image whose `media` node you do not carry into the
new body**, and **Jira logs the addition of such an image but NOT its deletion** — so the loss is
invisible in the changelog and provable only from a pre-write snapshot. One image was destroyed this
way on 2026-08-06 (SV-8818) and it is unrecoverable. The working method, the verbatim node-lifting
code and the read-only auditor are all in §J.

| # | Section | What goes in it |
|---|---|---|
| 1 | **Description** | Simple, layman-understandable. Plain words, **no jargon, no codes, no endpoints**. What is wrong, so anyone in the business understands it — plus why it matters. |
| 2 | **Branch / Environment** | **Stated explicitly, never assumed:** the branch/URL tested (e.g. `https://sv8582.qa.shopview.com`), the API host, the **build marker** (`<meta name="app-version">`, e.g. `v3.4.1-0ed4433`), the org/location ids, and the **date/time observed**. |
| 3 | **Steps to reproduce** | **REAL numbered steps a layman can follow**, using the **exact on-screen labels** (Rule 9). **If data is needed, include the steps that CREATE it.** **NAME THE EXACT TEST DATA — see the hard requirement below; a step that does not name it is non-compliant.** **NO API calls in this section**, and no "requires a large dataset" hand-waving — a person clicking the product must get end to end. If the fault genuinely cannot be reached from any screen, **say exactly that** and point at section 7. |
| 4 | **Expected behaviour** | What should happen, in plain words. Quote the governing requirement if there is one (Rule 25). |
| 5 | **Current behaviour** | What actually happens, in plain words. |
| 6 | **Images** | Attach them **AND embed them inline so they RENDER in the description** — not merely a file list. If no image exists, **say so and say why** (never imply one). |
| 7 | **Technical details for developers** | **LAST.** ALL the codes, endpoints, request/response bodies, request ids, timings, row counts, spec references, extracted file text, repo evidence paths. Everything technical lives here **and nowhere above**. |

### TWO THINGS THAT MUST NEVER APPEAR IN A TICKET

1. **No reference to our test cases** — no "QA test cases affected" section, no internal case IDs
   (`SBR-EXP-10`), no C-ids, no TestRail links. Keep that mapping in OUR records (e.g.
   `build/report-suite/defect-pack-2026-08-04/CASE-IMPACT.md`).
2. **No "this QA branch is not final / this finding is provisional / close it if already fixed"
   disclaimer.** **The QA lead's reasoning, recorded:** *every QA branch is always non-final — they keep
   changing it — so saying so adds nothing, and it is OUR job to keep the test cases accurate, not the
   developer's job to caveat our findings.* **A defect hedged as provisional invites dismissal.**

> ⚠️ **DO NOT OVER-APPLY #2.** This drops the **Jira-facing text only.** The **Standing Rule 49 re-check
> obligation still stands INTERNALLY** — the `RECHECK-QUEUE.md` files stay exactly as they are, and a
> finding taken from a non-final build is still re-checked when the build moves. A future pass must not
> read "no provisional disclaimer" as "no re-check duty".

### HARD REQUIREMENT ON SECTION 3 — NAME THE EXACT TEST DATA (QA lead, 2026-08-04)

**His words, verbatim:** *"This is not reproducible with the canned line I used, either you used a
different canned line (You should always name the canned line you used) unblock yourself by using
different canned lines."*

**THE RULE: a reproduction that does not name the data it used is NOT A REPRODUCTION.** Steps to
reproduce must name **every piece of data the behaviour could depend on, by its exact on-screen
name** — because the reader will pick a *different* one, get a *different* result, and close the
ticket. That is exactly what happened to SV-8821.

**NAME ALL OF THESE (every one that the flow touches; write "any" ONLY where you have PROVEN it does
not matter, and say how you proved it):**

| What | How to name it |
|---|---|
| **the canned line / pre-set job** | its exact name, e.g. *HD CVIP air brake trailer single/tandem* — and its price shape (fixed labour · fixed line total · hourly rate), because the catalogue mixes all three |
| **the customer** | the exact company name, e.g. *Aaborough Works* |
| **the contact person** | the exact name — **and whether one is set at all**, which is itself a behaviour-changing state |
| **the part** | part number **and** whether it is cored / special-order / in stock |
| **the asset** | year + make + model **and** VIN/serial, e.g. *2020 Ford Transit, VIN 86J8FAC1VALJ43SJY* |
| **the work-order state** | Estimate · Approved · Complete · **Invoiced** · Paid — these behave differently |
| **the location / workplace** | e.g. *Staging Heavy Duty - 9919* — writes are workplace-scoped |
| **the role / user** | who you were signed in as, e.g. `admin@shopview.com` (Administrator) |
| **the date range** | the exact from/to used, and the report's own date basis |
| **money** | the resulting totals, so the reader can confirm they built the same thing |

**COMPLIANCE TEST — apply it to your own text before filing:**
- ❌ *"Create a work order with a canned line."* — non-compliant.
- ✅ *"Create a work order and add canned line **HD CVIP air brake trailer single/tandem** (fixed
  labour, $350.00). The total should read **$406.09**."* — compliant.

**AND STATE WHAT YOU RULED OUT.** If several values were tried, list them and their results — a
short table of *"these behave the same"* saves the reader the work you already did, and it is the
proof that the variable is not the cause. If a value could **not** be tried, say which and why.

**RATIONALE — this is exactly how SV-8821 was lost.** Its steps said *"choosing a pre-set (canned)
job so it carries a price"*, naming none. The seeding script behind the evidence had silently
filtered the catalogue to `c.fixed_price && workplace === HD` — **11 of the 79 canned lines** — so the
report rested on a narrow slice nobody could see. The QA lead used a different one, saw it work, and
closed the ticket. **Re-testing then showed the canned line was never the variable at all: the real
condition was that the work order had no CONTACT person, which disables the Finance tab entirely
("Please select a contact for the asset") and makes the failure unreachable from any screen.** Naming
the data in the first place would have surfaced that in the first hour. Full evidence:
`build/report-suite/defect-pack-2026-08-04/repro-sv8821/` and the corrected SV-8821 description.

### INLINE IMAGES — the mechanism that actually works (proven 2026-08-04)

A hand-built ADF `media` node **fails**: `PUT /rest/api/3/issue/{key}` returns **400
`ATTACHMENT_VALIDATION_ERROR`** because the media `id` must be a **media-services UUID**, not the
attachment id. The working route is **wiki markup through API v2**, which makes Jira resolve the
filename server-side:

1. `POST /rest/api/3/issue/{KEY}/attachments` (multipart `-F file=@…`, header
   **`X-Atlassian-Token: no-check`**) → note the returned `id` and **check `size` against the source file**.
2. `PUT /rest/api/2/issue/{KEY}` with `description` as a **wiki-markup STRING** containing
   **`!the-file-name.png|width=900!`** → HTTP 204.
3. **VERIFY it truly renders inline, do not assume:** `GET /rest/api/3/issue/{KEY}?fields=description&expand=renderedFields`
   → the stored ADF must contain a **`mediaSingle` › `media`** node whose `attrs.id` is a **36-char UUID**,
   **and** `renderedFields.description` must contain a real
   **`<img src=".../rest/api/3/attachment/content/<attachmentId>">`**. An attachment with no media node
   is *attached but not inline* — that fails this format.

Wiki-markup quick reference: `h2. Heading` · `*bold*` · `_italic_` · `{{monospace}}` ·
`{noformat}…{noformat}` (code blocks) · `{quote}…{quote}` · `* bullet` · `# numbered` · `----` (rule) ·
`||header||header||` then `|cell|cell|` (tables) · `!image.png|width=900!`.
Reusable converter: `/tmp`-side `md2wiki.py` pattern documented in
`build/ATLASSIAN-JIRA-ACCESS-METHOD.md` §5a; give descriptions to v2 as wiki markup, **not** ADF, when
they contain images.

### THREE HARD GATES BEFORE AND WHILE FILING (QA lead, 2026-08-04 — Standing Rules 51 / 52 / 53)

**These three came in AFTER the six tickets below were filed, and each one corrected something that
pass got wrong. Read them before you file anything.**

**1. API-RELATED TICKETS ARE NEVER FILED WITHOUT ASKING — EVERY TIME (Rule 51).**
His words: *"do not create the tickets which are related to API , if there are any ASK me (ask again if
I have previously given a go ahead for the API tickets with the Non API tickets) and create them ONLY
if I ask you to create them"*. **A BATCH APPROVAL DOES NOT COVER THE API ITEM INSIDE IT** — ask again,
naming it, even if he already approved the batch.
**The reachability test:** if the defect is **invisible to a user and to a manual tester — reachable
only by calling an endpoint directly with a request the product's own screens never send — it is
API-RELATED.** If **the same failure also happens through the product's own screens**, it is a
**user-facing** defect that merely happens to be characterised technically (a 500 in the evidence does
**not** make it API-related).
**Method:** list API-related findings in **their own section of the defect pack BEFORE filing** (canonical
vehicle: a dated `API-SPLIT.md` beside the pack, e.g.
`build/report-suite/defect-pack-2026-08-04/API-SPLIT.md`), ask separately in plain words, file only on a
yes. **Already filed one? Withdraw on his ruling — CLOSE it by workflow transition with a plain-language
comment, set priority first (`Medium` since 2026-08-06), and NEVER DELETE** (deletion is irreversible; a withdrawn ticket with
its reasoning on the record is worth more). **Keep the finding in the pack — we withdraw the ticket, not
the finding.** Read alongside **Rule 24**: FE-blocks + BE-allows is a **PASS**, not a defect at all.

**2. FILE A `Story Defect` PARENTED TO THE OWNING STORY (Rule 52, amended 2026-08-05 — this SUPERSEDES
the Bug-on-an-epic-parent shape below).**
His instruction, verbatim: *"Also, make sure that whenever you create a ticket it should be attached to
the parent ticket as its epic and that ticket should be created as STORY DEFECT"*.
**⚠️ PRIORITY IS `Medium` FROM 2026-08-06 — `Low` was the rule until that date.** QA lead's ruling,
verbatim: *"One thing which I want to correct, please keep the priority of the tickets which you create to
Medium instead of keeping them to LOW."* So **every NEW ticket is `Medium`**; **`High` is still never
used**. The old value is left visible here on purpose — tickets filed **before 2026-08-06 carry `Low` and
are CORRECT for their date**, and a superseded rule that is quietly deleted is how a session ends up not
knowing why an old ticket looks different. **Do NOT retro-change a priority that is already set** (Rule 53's
corollary — the one time a pass "corrected" priorities it had misread the QA lead's own triage and left a
High→Low→High→Low round trip in the changelog).

**THE SHAPE — `issuetype` = `Story Defect` (10007) · `parent` = THE OWNING STORY · `priority` = `Medium` (was `Low` before 2026-08-06) ·
ALSO link the owning story `relates to` · DO NOT send Product Area.**
**Why a story parent still satisfies "attached to the epic":** the owning story is itself a child of the
epic, so the defect **rolls up to the epic** one level further down. **A `Story Defect` cannot be
parented to an Epic at all** — proven live 2026-08-05, a create with an Epic parent returns
**HTTP 400 `{"errorMessages":[],"errors":{"parent":"Please select valid parent issue.","parentId":"Please
select valid parent issue."}}`**, while the **identical body with a STORY parent (SV-8689) returns HTTP
201** and reads back at hierarchy level −1 under a Story. Population check: **of ALL 502 Story Defects in
SV** (exhaustive, fully paged) parents are **Story 294 · Task 149 · Bug 57 · none 2 · EPIC 0** (0 under
SV-8685, 0 under SV-8785, 0 under SV-8582). His own cited example **SV-8883** sits under **SV-8786, a
Story**.
**ISSUE TYPES IN PROJECT SV** (`GET /rest/api/3/issue/createmeta/SV/issuetypes` → HTTP 200, 6 types, read
live 2026-08-05):

| type | id | subtask | hierarchyLevel | use |
|---|---|---|---|---|
| Task | 10005 | false | 0 | — |
| Epic | 10006 | false | 1 | parent of stories/tasks/bugs |
| **Story Defect** | **10007** | **true** | **−1** | **our defect tickets; parent must be level-0** |
| Bug | 10008 | false | 0 | pre-2026-08-05 shape; may take an Epic parent |
| Story | 10245 | false | 0 | the parent we use |
| Story Defect - Archive | 10279 | false | 0 | **LEGACY — NEVER USE** (lookalike name, wrong level) |

**WORKING CREATE SHAPE (Story Defect):**
```
POST /rest/api/3/issue
{"fields":{"project":{"key":"SV"},"issuetype":{"id":"10007"},
           "parent":{"key":"<OWNING-STORY>"},          # level-0 ONLY; an Epic key → 400
           "summary":"<one line>","description":<ADF, 7 sections>,
           "priority":{"name":"Medium"},                # Rule 53 as amended 2026-08-06 (was "Low")
           "customfield_10418":{"value":"<Severity>"}}} # NO customfield_10153 on this type
```
then `POST /rest/api/3/issueLink` `relates to` the same story.
**FIELD DIFFERENCE:** **Product Area (`customfield_10153`) is REQUIRED on `Bug` and ABSENT on
`Story Defect`.** Priority (`Medium` since 2026-08-06), the `relates to` link and the seven-section ADF body behave identically
on both.
**CONVERSION IS UI-ONLY AND SILENTLY WIPES Product Area — AND IS NEVER OURS TO DO.** The REST API refuses
level-0 → subtask (both proven 2026-08-04): `PUT /rest/api/3/issue/{key}` with `issuetype:10007` +
`parent` → **400 `{"pid":"Issues with this Issue Type must be created in the same project as the
parent."}`** (misleading — the parent *was* in the same project); `issuetype` alone → **400
`{"issuetype":"Issue type is a sub-task but parent issue key or id not specified."}`**. **The org's UI
"Change work type" wizard does what the API refuses — it converts the type AND atomically re-parents
Epic→Story in ONE changelog action** (SV-8886 Mudassir Qamar 2026-08-05 09:29:49 →SV-8689 · SV-8849
09:15:03 →SV-8692 · SV-8871 Ahtasham Amjad 04:51:42 →SV-8795 · SV-8846 04:46:32 →SV-8797). **⚠️ The
conversion DESTROYS Product Area and the loss is NOT in the changelog** — proven on our own **SV-8886**
(filed with Product Area = Schedule, byte-verified at filing, now NULL) vs **SV-8848** (never converted,
still Schedule); **all 502 Story Defects in SV have Product Area null**. His ruling: **"Product area loss
is OK"**. **Converting an existing ticket is HIS decision** — Mudassir and Ahtasham convert tickets
themselves and Rule 53's corollary forbids cutting across their triage.
**THE UI CONVERSION LANDS ON THE STORY WE *LINKED*** (SV-8886 linked SV-8689 → landed under SV-8689;
SV-8849 linked SV-8692 → landed there), **so keep adding the `relates to` story link even though it now
duplicates the parent.**
**⚠️ WE CANNOT DELETE JIRA ISSUES** — `DELETE /rest/api/3/issue/{KEY}` → **HTTP 403 *"You do not have
permission to delete issues in this project."*** So a throwaway/probe ticket **cannot be removed**:
transition it to **OBSOLETE** with a comment saying it is a disposable ZZAUTOTEST probe, and expect it to
persist as a closed item (this is why **SV-8902** still exists). Probe once, record the answer here.
**The LINK TYPE list** (`GET /rest/api/3/issueLinkType`, read live 2026-08-04): **Blocks** · **Cause**
(`caused by`/`causes`) · **Cloners** · **Duplicate** · **Fixes** · **Polaris work item link** ·
**Relates** · **Split**. **None is a defect-of / is-defect-for type — and that no longer matters:** the
story-defect relationship is carried by the **issue type + story parent**, so the link we add is
**`relates to`**. If he ever asks for a different one, **change nothing and ask which of the eight.**

**3. PRIORITY IS ALWAYS `Low` — NEVER `High` (Rule 53).**
His words: *"never mark the priority as High for the tickets you create always keep the priority as
LOW"*. Priority is **his to raise, not ours to assert**. Severity belongs in the ticket's words and in
the `Severity` field, **never** in `Priority`.
**⚠️ AND NEVER "RESTORE" A FIELD HE HAS CHANGED.** He works in the Jira UI **under this same account**,
so **his edits are indistinguishable from ours in the changelog** — the author column reads our own
name. A change with no action of ours is **his triage**, to be **asked about, never reversed**. Tells: a
**selective, semantically coherent** change (only the `High` ones moved) or a **transition that sets a
resolution**. On 2026-08-04 a pass read his four `High → Low` downgrades as drift and "restored" them;
he re-applied `Low`, and the changelog now carries **`High → Low → High → Low`** on all four.

### Fields to set on a ShopView `SV` defect ticket (from `createmeta`, 2026-08-04; type amended 2026-08-05)

`project` · `issuetype` (**`Story Defect`, id 10007** — was `Bug` before 2026-08-05) · **`parent` — THE
OWNING STORY, and it is REQUIRED on this type** (level-0 only; an Epic key → HTTP 400) · `summary` ·
`description` · `labels` · **`priority` — ALWAYS `Medium` since 2026-08-06, `Low` before it** (Rule 53; the field offers
Highest/High/Medium/Low, we use `Low`) · `customfield_10418` **Severity** (High/Medium/Low — put the real
severity HERE).
**⚠️ `customfield_10153` "Product Area" is REQUIRED on `Bug` and DOES NOT EXIST on `Story Defect`** — do
not send it on a Story Defect (his ruling: *"Product area loss is OK"*).
**Also attach the owning story as a LINK** (`POST /rest/api/3/issueLink`, `relates to`) even though it
duplicates the parent — see gate 2 for why.
**Withdrawing a ticket:** read `GET /rest/api/3/issue/{KEY}/transitions` and use the closest close
transition — on `SV` that is **`Close` (id 8) → status `OBSOLETE`**, whose post-function sets
**`resolution: Done`** with no resolution screen. Comment first (v2 `POST /rest/api/2/issue/{KEY}/comment`
takes a plain string), then transition, then read back status + resolution + priority + comment.

---

