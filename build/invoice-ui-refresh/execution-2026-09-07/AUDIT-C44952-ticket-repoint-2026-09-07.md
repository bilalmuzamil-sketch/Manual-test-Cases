# Audit — C44952 ticket re-point (SV-9803 → SV-9797) · 2026-09-07

**Outcome: WRITE WITHHELD. C44952 was NOT modified.** The instructed edit would have
replaced a live, Open ticket reference with an OBSOLETE one. The gate that stopped it is the
task's own precondition — *"Confirm SV-9797 is genuinely open before pointing at it"* — which
**failed on a live read**.

---

## 1 · Per-case operation log

| # | Operation | C-id | Endpoint / source | HTTP status | Verification result |
|---|---|---|---|---|---|
| 1 | `get_case` (read) | **C44952** | `GET /api/v2/get_case/44952` | **200** | Case fetched; body saved to `/tmp/c44952/before.json`. `custom_expected` = 1,807 bytes, contains `SV-9803` **×1**, `SV-9797` **×0**, `<br>` **×11**, `AUTOMATION:` **×1**. |
| 2 | Precondition — string location | C44952 | same payload | 200 | **PASS.** Outcome (1) reads verbatim as briefed: `(1) Exactly that — mark this case Failed and raise nothing new; it is already recorded on SV-9803.` |
| 3 | Precondition — authorship (Rule 38) | C44952 | same payload | 200 | **PASS.** `created_by = 3` (ours). Not user 1 (Vladimir Tomovic), not user 6 (Mudassir Qamar). |
| 4 | Precondition — Automated flag (Rule 71) | C44952 | same payload | 200 | **PASS.** `custom_atmstatus = 1` ("Not Automated"). Not flagged Automated; no QA-lead go-ahead required on that count. |
| 5 | Precondition — `refs` untouched | C44952 | same payload | 200 | **PASS.** `refs = "SV-9147 (S8-R9; G-R1)"` — correct, left alone. |
| 6 | Precondition — **target ticket is open** | SV-9797 | `GET /rest/api/3/issue/SV-9797` | **200** | **🛑 FAIL.** Status **`OBSOLETE`** (id 10250, statusCategory `done`), `resolution = Done`. **Not open.** |
| 7 | Cross-check — current ticket | SV-9803 | `GET /rest/api/3/issue/SV-9803` | **200** | Status **`Open`** (id 10349, statusCategory `new`), `resolution = null`. **The reference already in the case is the live one.** |
| 8 | **`update_case`** | C44952 | — | **NOT ISSUED** | **Withheld** on the failure at row 6. No TestRail write of any kind was made in this pass. |

**TestRail writes this pass: 0. Jira writes this pass: 0** (Jira read-only, as instructed).

C44952 `updated_on` at read time = `1788802382` = **2026-09-07 17:33:02 UTC**, i.e. the case
predates the ticket churn below and was not touched by it.

---

## 2 · Why the write was withheld

The briefing stated: *"SV-9803 is OBSOLETE. The finding is now carried by SV-9797, which was
re-opened today."* **Live Jira says the opposite.** That was true for about seven minutes today
and was then reversed by a concurrent session.

Timeline reconstructed from the two issues' `changelog` (all 2026-09-07, US Central, all
transitions by the `bilal.muzamil@shopview.com` account that every session in this workspace shares):

| Time | Issue | Event |
|---|---|---|
| 11:39:48 | SV-9797 | Created (Task), parented to epic **SV-8218** |
| 12:29:46 | SV-9803 | Created (Story Defect), parented to story **SV-9147** |
| 12:31:22 | SV-9797 | → **OBSOLETE** / Done — *"Raised with the wrong issue type… Re-filed correctly as SV-9803… Please work SV-9803."* |
| **13:07:23** | SV-9803 | → **OBSOLETE** / Done ← *this is the state the briefing describes* |
| 14:23:00 | SV-9803 | OBSOLETE → **Open**, resolution cleared |
| 14:24:08 | SV-9797 | OBSOLETE → **Board Backlog**, resolution cleared ← *the "re-opened today" the briefing refers to* |
| 14:26–14:27 | SV-9797 | Summary + description rewritten; Product Area → Work Orders |
| 14:27:40 | SV-9797 | Comment: *"Re-opening this… the accepted pattern on this epic is a Task on the epic itself…"* |
| 14:27:41 | SV-9803 | Comment: *"Superseded by SV-9797, which is open again and carries this finding. Nothing to do here."* |
| **14:30:21** | SV-9797 | Board Backlog → **OBSOLETE**, resolution **Done** ← **latest status transition on either issue** |
| 14:30:37 | SV-9797 | Re-parented to SV-8218 |

Read performed at **14:32 CDT**, ~2 minutes after the last event.

**Final state, latest-wins (Rule 32):**

| Issue | Type / parent | Status | Resolution | Title |
|---|---|---|---|---|
| **SV-9797** | Task · epic SV-8218 | **OBSOLETE** | Done | Spec gap — the paid banner's "Remaining Balance" row has never existed in production |
| **SV-9803** | Story Defect · story SV-9147 | **Open** | none | Paid banner omits the "Remaining Balance" row required by S8-R9 |

So **C44952 as it stands today is already correct**: it names the only one of the two that is
open. Making the instructed change would have pointed a manual tester at a ticket closed as
OBSOLETE — precisely the harm Rule 61 guards against (*"Ticket status is never evidence about
the build"*; an `EXPECT FAIL`-style pointer needs a **live** ticket).

The briefing's stated fallback — strip the key and reword outcome (1) in plain words per Rule
62(b) — was **also not taken**, because its precondition did not arise: it is scoped to *"if you
cannot reach Jira"*. Jira was reachable and answered clearly. Removing a correct, live reference
would degrade the case for no benefit.

**Independent corroboration (Rule 86 — from committed evidence, not a self-report):** commit
`fbe40170`, landed on this branch at 19:31:59 UTC — one minute before this read — reached the
same conclusion from its own live check and deliberately left the same SV-9803 pointer in the
tester brief unchanged, recording *"SV-9803 is Open and SV-9797 was transitioned to OBSOLETE at
14:30:21 today by a concurrent session."*

---

## 3 · The execution trap, assessed but not exercised

Recorded because the analysis stands for whoever performs this edit once the ticket question
is settled.

`custom_expected` on C44952 carries **11 `<br>` tags**. Per `build/APP-ACTIONS-PLAYBOOK.md` §J,
`<br>` renders when a field was last saved from the **UI** but prints **literally** when written
via the **API**, and an API `update_case` additionally leaves the field in the escaping
`<div class="markdown">` container rather than `<div class="markdown fr-view">`.

**Chosen route had the write proceeded: (a), the UI/Froala path** —
`build/inline-add-edit-parts/render-repair-2026-08-31/repair.mjs` /
`build/build-verify-session-2026-08-21/repair-2026-08-25/ui_repair_my5.mjs` (Playwright →
Froala `html.set`, with the deadlock-retry), reusing the committed harness per Rule 97.
Reasoning: it is a **one-token** substitution inside a field whose other 1,790 bytes must not
move. Route (b) — an API write converting the whole field from `<br>` to `<p>`/`<ul><li>` blocks
plus a UI re-save — rewrites every line of a field that renders correctly today, to change one
token. That is a large blast radius for no gain, and it would have to be followed by the
mandatory served-page container scan anyway.

**No route was executed.** No Playwright session was opened against TestRail; no served-page
scan was run, because there was no write to verify.

---

## 4 · OUTSTANDING — what I need from you

**The two tickets contradict each other and the test case cannot be settled until you rule.**

- **What it is.** One finding — the paid banner's "Remaining Balance" row, spec requirement
  S8-R9 — currently exists as two Jira issues, and their statuses and their comment trails now
  disagree with each other.
- **How it came up.** Both were filed by our own sessions today and transitioned back and forth
  five times between 12:31 and 14:30. The net result: **SV-9803 is Open but carries a comment
  saying "Superseded by SV-9797… Nothing to do here"**, while **SV-9797 is OBSOLETE but carries
  a comment saying "Re-opening this… the accepted pattern on this epic is a Task on the epic
  itself."** Each ticket's text points at the other.
- **The question.** Which of the two is the live home for this finding?
- **The options.**
  - **A — SV-9803 (Story Defect under story SV-9147) is the home.** It is Open now, so
    **nothing needs doing to C44952** — the case already names it. Someone should delete or
    correct the stale "Superseded by SV-9797" comment on it so it stops contradicting itself.
  - **B — SV-9797 (Task on epic SV-8218) is the home.** Then SV-9797 must be **transitioned
    back out of OBSOLETE first**, and only then do we re-point C44952 at it — via the UI/Froala
    route in §3. We will not point a case at a closed key.
  - **C — neither; drop the ticket name.** Reword outcome (1) in plain words with no key, per
    Rule 62(b). Available if you would rather the case not depend on the ticket at all.
- **The cost of silence.** Low and bounded. C44952 stays exactly as it is and remains
  **correct** — it names the one open ticket of the two. The case is runnable today. The only
  live risk is that a third session "fixes" it in the direction of the original briefing and
  lands the tester on a dead key.
- **What it does not block (Rule 68).** It does not block any other case in section 6749, the
  rest of the Invoice UI Refresh suite, the tester brief (already corrected by `fbe40170`), or
  execution of C44952 itself — the case carries
  `AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA
  branch`, so it is a staging-only case regardless of which ticket it names.

---

## 5 · Closing re-verification (fresh reads, after the halt instruction)

Re-read from the systems of record a second time, deliberately not from the earlier fetch
(Rule 100 — an earlier copy is not evidence about the current file).

**C44952 — `GET /api/v2/get_case/44952` → HTTP 200:**

- `updated_on = 1788802382` = **2026-09-07 17:33:02 UTC** — **unchanged**, and earlier than any
  action in this session. Nothing this session did reached the case.
- `custom_expected` is **byte-identical** to the pre-task read: 1,807 bytes,
  sha256 `f6c9d22115d1ad979ab0ecf0171f946e6fc9d1c73ff879d6d3f2c7f78b393426` **before and after**.
- `SV-9803` ×1 · `SV-9797` ×0 · `AUTOMATION:` ×1 · `created_by = 3` · `custom_atmstatus = 1`.
- **Outcome (1), quoted verbatim from the fresh fetch:**

  > (1) Exactly that — mark this case Failed and raise nothing new; it is already recorded on SV-9803.

**Jira, same moment (read-only, `key in (SV-9797, SV-9803)`) → HTTP 200:**

| Key | Type | Status | Resolution | Labels | Last updated |
|---|---|---|---|---|---|
| **SV-9797** | Task | **OBSOLETE** (10250, category `done`) | **Done** | *(none — stripped 14:30:17)* | 2026-09-07 14:30:37 −0500 |
| **SV-9803** | Story Defect | **Open** (10349, category `new`) | **none** | `fs_invoice_refresh` | 2026-09-07 14:27:41 −0500 |

No further churn since 14:30:37; both match the earlier read. **Verdict: no write landed, the
case is untouched and currently correct, and the served-page `fr-view` scan was not applicable
because there was no write to verify.**

---

**Case:** C44952 — https://shopview.testrail.io/index.php?/cases/view/44952
**Section:** 6749 "Paid Banner, Payments and Balance" · Invoice Refresh (Aug 2026)
**SV-9797:** https://shopview.atlassian.net/browse/SV-9797 (OBSOLETE)
**SV-9803:** https://shopview.atlassian.net/browse/SV-9803 (Open)
