# BLOCKED — the authorised repair batch cannot execute in this session

**Written 2026-08-25T10:45Z.** Build-verification lane. **This is a HARNESS permission block, not a
TestRail, credential or network problem.** TestRail access is live and proven (2 successful
`update_case` writes earlier this session, both byte-verified).

## WHAT IS BLOCKED

The QA lead approved three repair items on 2026-08-25 ("1. Approved / 2. Approved / 3. Approved").
The batch script that performs them — `tools/authorised_repairs_2026-08-25.py` — **was refused
execution twice by the Claude Code auto-mode permission classifier**:

> *"Permission for this action was denied by the Claude Code auto mode classifier."*

Refused both as an inline heredoc-plus-run and as a plain `python3 <script>` invocation. **I stopped
after the second refusal rather than looking for a way around it** — the block is the harness telling
me a bulk write to a production system of record needs the user's explicit say-so, which is the same
principle as Rule 6.

## WHAT IT BLOCKS, CONCRETELY — 20 cases, 0 written

| Item | Cases | Status |
|---|---|---|
| **1 · placeholder restoration** | C44864 (refs + expected) · C44875 (preconds + expected) · C44892 (steps) · C45055 (expected) | **NOT WRITTEN** — 6 field instances still damaged |
| **2 · collapse repair** | C44506 C44512 C44517 C44520 C44536 · C44549 C44561 · C44804 C44823 · C44988 · C45084 C45086 C45088 C45091 | **NOT WRITTEN** — 14 cases still render as one paragraph |
| **2 · held separately** | C44901 C44908 (Invoice Refresh) | **HELD BY ME** — foreign lock, see below |
| **3 · title view modes** | C45032 (Tech View) · C45066 (Full View) | **NOT WRITTEN** |

## WHAT IS *NOT* BLOCKED — and was completed

- **Item 5** (the `<` sweep rule) — recorded in `00-COMMON-CORE.md` §3.8 with the 2026-08-25 evidence,
  the mandatory pre-flight, and the **square-bracket convention**; new gate
  `build/testing-tools/check_angle_brackets.py` (selftest passes 4/4, proves it fires *and* does not
  cry wolf on legitimate `<p>`/`<br>` markup or a bare `<` comparison).
- **Item 6** (correcting §2.1) — recorded as **§2.1a**, with the C44864 proof that a field sent
  explicitly is *not* stored verbatim, and the pre-emptive `<br>` practice that follows from it.
- **The local case sources are now on the square-bracket convention** — 9 placeholders converted
  (`<query>`→`[query]`, `<q>`→`[q]`, `<that customer>`→`[that customer]`, `<typed text>`→`[typed text]`,
  plus the README's `GS-<AREA>-NN` naming example). All case JSON re-parsed clean; the gate now exits 0
  over all 38 files. **So a future re-import cannot repeat this damage** — which is the durable half of
  the fix, and it needed no TestRail write.

## THE EXACT RESUME STEP

The script is idempotent (a `DONE.jsonl` checkpoint is read on start, so completed cases are skipped)
and it stops the whole batch on any byte-check mismatch. One command, once permitted:

```
python3 build/build-verify-session-2026-08-21/tools/authorised_repairs_2026-08-25.py
```

**What it will do per case:** send all text fields + `refs`; restore the placeholder as a square
bracket, or rewrite the line breaks only, or set the title; then re-GET and verify **11 checks** —
wording preserved tags-aside, no collapse left, exactly one provenance line, exactly one `AUTOMATION:`
marker, `custom_atmstatus` and `section_id` unchanged, no markup in any title. **Any case flagged
Automated is skipped unwritten** (Rule 71 needs its own ask); across these six groups there are
currently **0** such cases, verified live.

**No marker date will move**, because no build was checked — these are text repairs, not verification.

## THE INVOICE REFRESH CARVE-OUT (my decision, not the harness's)

`build/LOCKS/invoice-ui-refresh.lock.md` holds a **test-case-creation lane** claim opened
**2026-08-21T07:18:43Z — 99 hours old**, against Rule 83's 6-hour staleness threshold. The QA lead has
said he will rule on that lock ("7. I will tell you"), so **C44901 and C44908 are deliberately held
out of the batch** even though item 2 was approved for all 16. Their claim explicitly disclaims case
writes (*"NO update_case"*), so there is no operational conflict — this is protocol, not risk. **Two
cases, one line of scope, resumable the moment he rules.**

## OUTSTANDING

**What I need:** permission to run the one command above (a Bash permission rule, or an explicit
go-ahead in session). **What it unblocks:** all 20 cases. **Who owes it:** the QA lead.
**Since:** 2026-08-25T10:44Z.
