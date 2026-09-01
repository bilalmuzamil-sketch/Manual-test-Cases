# Invoice UI Refresh — handoff readiness statement

**For:** Bilal Muzamil (QA lead) · **Manual QA tester for this suite:** Mudassir Qamar · **Date:** 1 September 2026 · **Suite:** 119 cases
**Build:** sv8218 `v26.35.5-8c3cc21` · **Spec:** Confluence v45

You asked me to confirm five things before we move to sv9315. Taking them one at a time, with the
qualifications stated rather than buried.

---

## 1. Is it ready to hand to the manual QA tester?

> **Correction, 2026-09-01.** An earlier draft of this statement named Viktoria as this suite's
> tester. That was wrong: **Invoice UI Refresh belongs to Mudassir Qamar**; Viktoria Videnovic owns
> Inline Add and Edit Parts (6597) and Printer Friendly WO (6617).

**Yes, with one thing you should decide first** (item 5 below).

| Check | Result | How it was proven |
|---|---|---|
| Every case has UI-runnable preconditions and steps | **119 / 119** | `check_runnable_cases.py`, reads TestRail live, exit 0 |
| Every route the cases cite actually works | **8 / 8** distinct routes | each one walked on sv8218 |
| Every case is readable on screen (not raw HTML) | **119 / 119** | served-page container scan, 0 escaping |
| Every case carries exactly one AUTOMATION marker | **119 / 119** | 109 READY · 6 not-built · 4 HOLD |
| No title truncates on the case page | **0 over ~80 chars** | was 8; all shortened |

## 2. Is it build-verified?

**110 of 119 were verified against the live build. The other 9 were not, and here is exactly why.**

| Group | Count | Status |
|---|---|---|
| Verified live on `v26.35.5-8c3cc21` | **110** | observed, with evidence captured |
| **Not built yet** — the feature is genuinely absent | **4** | C44937, C44938, C44939 (`Show declined work`), C44942 (`Show %`). Proven with a positive control firing in the same read. Stories SV-9145/SV-9146 still In Progress. |
| **Customer portal — staging only** | **3** | C44951, C44952, C45175. The portal does not exist on a QA branch. |
| **Held on your open PO question** | **2** | C44913, C44916 — the IBS Approval Code question. |

**One case FAILS and is marked as such:** C45185 — every pre-existing document snapshot returns
HTTP 500 while one created today returns 200. Defect candidate written, **not filed** per your hold.

## 3. Have I assumed or invented anything?

**No route, no state and no verdict in this suite was invented.** Specifically:

- **Every route was observed** on sv8218 before being written into a case, and then re-walked at the
  end. Where a route existed only in the design and contradicted what I saw live, **the observed one
  replaced it** — that happened on three cases (C45185, C45190, C45191) where another session had
  written design-derived routes that were wrong.
- **Where I could not observe something, the case says so rather than pretending.** The customer
  portal is the honest example: I have never seen it, so C45175 says the portal is a separate
  customer-facing sign-in that exists only on staging, and that the portal-side clicks must be
  recorded by whoever first runs it there. I did not write clicks I had not seen.
- **Two preconditions describe paths I inferred rather than walked**, and both are worded to say so
  rather than to assert: the shop's payment-method settings screen (C44947) and the History entry
  that holds a saved document copy (C45185). I drove both through the API and know the capability
  exists; I have not clicked the screens.
- **The CSV contract for the imported-work-order seed came from the product's own shipped template**,
  not from guesswork.

**Where I was wrong, I corrected it in writing rather than quietly.** Three claims I made earlier in
this work were false and are recorded as false: "101/101 UI-followable" (bad checker), a "missing"
Payments tab (label carries a row count), and a "broken" Work Orders → Contacts route (my regex
spanned two sentences). Three "not built" verdicts from the previous day were also wrong — the
imported import, the batch PDF and document snapshots are all built — and those cases were reopened
and re-verified.

## 4. Are the cases authentic?

**Yes.** Expected Results were **never edited** in any of this work — every change was to
preconditions, steps or titles. Requirement text and provenance sentence 1 are byte-for-byte as
authored from the spec (Rule 57/54), verified after every write. Every case traces to its epic,
story and spec section, and all 119 carry a provenance line.

## 5. ✅ RESOLVED — the marker that was factually wrong is corrected

**C44913 and C44916 read `AUTOMATION: Not available on Build to test Yet`, which was false.** The
feature IS on the build: the work order carries an integrated-billing number and four IBS endpoints
exist. What is unresolved is the PO question about how a tester **obtains** an Approval Code.

The QA lead delegated the call (*"Take the decision which is correct"*). Both now read:

> `AUTOMATION: HOLD - held pending the PO answer on how a tester obtains an Approval Code`

and the tester-facing *"could not be build-verified because the feature was not found"* line was
removed from each, because it was not true. Requirement text and provenance are untouched.

**Why HOLD and not the Rule 69 not-built marker:** Rule 69 is for a feature that is absent from the
build. This feature is present; only the test data route is unresolved. Telling Mudassir the feature
is missing would have been a lie, and it would have sent her looking for something that is there.
Being a HOLD, both are excluded from the ready-to-automate arithmetic, which is also correct — they
are not ready to automate until the PO answers.

**Suite markers now:** 109 READY · 6 HOLD · 4 not-built-yet = 119.

---

## 5b. THE ORIGINAL DECISION TEXT (superseded, kept for the record)

**C44913 and C44916 carry a marker that is factually wrong.** They read
`AUTOMATION: Not available on Build to test Yet`, but the feature **is** on the build — the work
order carries an integrated-billing number and four IBS endpoints exist. What is unresolved is your
open PO question: how a tester obtains an Approval Code on a QA branch.

Left as-is, Mudassir reads "not built" for something that is built. **My recommendation:** change
both to `AUTOMATION: HOLD - held pending the PO answer on how a tester obtains an Approval Code`.
I have not made that change because it is a classification tied to your own open question.

## 6. Are the learnings recorded?

Yes, in four places:

- **`build/skills/18-LAYMAN-UI-STEPS.md`** — runnability is the primary job of a build-verification
  session; the gate; and the calibration lesson (why "every step must name a place" over-fires).
- **`build/skills/03-RUN-CHECK.md` §8.0-b** — the six times my own instrument was the defect in this
  pass, and the six cheap rules that prevent it.
- **`build/skills/00-COMMON-CORE.md` §6.4** — TestRail write mechanics: the two credential file
  shapes, the duplicate `#title`, deadlock-vs-token failures, the latent `Title is too long`.
- **`CLAUDE.md`** and **`build/skills/11-BUILD-VERIFICATION.md`** — runnability as a deliverable of
  equal standing with the verdicts.

---

## OUTSTANDING

1. **Nothing blocking. The suite is ready to hand to Mudassir Qamar.**
2. **Reminder deferred at your instruction** — to be raised only after Inline Add and Edit Parts
   (6597) and Printer Friendly WO (6617) are done: the snapshot-500 defect is prepared and **not filed**
   (`build-verify-2026-08-31/DEFECT-CANDIDATE-snapshot-500.md`), and three PO questions are parked —
   IBS Approval Code, the Credit Balance terminology line, and the imported-work-order Authorizer conflict.
3. sv9315 (groups 6597/6617) is untouched. **Confirm which session owns those two suites** — the
   session you stopped had been writing to them, and that ownership question is what caused the
   collision here.
