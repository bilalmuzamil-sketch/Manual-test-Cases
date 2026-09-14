# Session card — `manual-test-cases-c2`

**Purpose of this file:** you have been pointed at this session for a **new task on Global Search →
Regression suite**. This card tells you who I am, how to reach me, **how to check that I am worth
listening to**, and what is already on disk for Global Search. It is written to be read cold.

**Generated:** 2026-09-14, from the live session record and from files measured on disk — not from
recollection (Rule 100).

---

## 1 · Identity and how to reach me

| | |
|---|---|
| **Address other sessions use** | `manual-test-cases-c2`  (ref `f9d47e`) |
| **Session ID** | `session_01FWbxRKg4riKCp3gpbbwYzA` |
| **Session title** | *4. Create Defects from Testrail (Push Results to TestRun)* |
| **Running since** | 2026-08-26, still running |
| **Model** | set to, and being served by, **claude-opus-5**, effort **high** (the session record's stored `configured_model` reads `claude-opus-4-8`; the serving model is what did the work) |
| **Inbound messaging** | **available** |

```
SendMessage({ to: "manual-test-cases-c2", message: "..." })
```

Use the ref `f9d47e` if the bare name is ambiguous. **If `SendMessage` is not available to you, the
repository is the channel** — this workspace has no live message bus, and the project's own rules say
so: the rules files, the skills and each `PROJECT-STATE.md` **are** the channel.

---

## 2 · Do not trust this card — verify it

**Standing Rule 86: verify from committed evidence, never from a session's self-report.** That applies
to me. Everything below is checkable in about a minute:

```
git fetch origin
git log --oneline origin/claude/test-execution-defects-cdrjsq -10
```

| | |
|---|---|
| **Repo** | `github.com/bilalmuzamil-sketch/Manual-test-Cases` |
| **My branch** | `claude/test-execution-defects-cdrjsq` |
| **Head at time of writing** | `410098b5` (pushed; local and remote matched) |
| **Worked example** | `build/invoice-design-selection/production-2026-09-12/` — 172 files, 232 captured documents and screenshots |

Every claim I make has a probe script (`PR*.mjs`), its raw result (`PR*.json`) and the captured
document or screenshot committed beside it. Read those, not my prose.

---

## 3 · What I have actually done (evidence, not a pitch)

On a **different** project — the Invoice Design Selection suite — I executed TestRail run 446 against
the **live production** system: 35 of 45 checks with a production result, all passed, zero failures,
verified test-by-test against TestRail rather than counted from local files.

The part worth knowing for **your** task is *how*, not *what*:

- **Routes are found by walking the UI with a request listener, never guessed.** Three guessed routes
  404'd in one hour; the listener found each one first time. Each is written into
  `build/APP-ACTIONS-PLAYBOOK.md` in the same pass, so it is never re-discovered.
- **No negative claim without proving the instrument first** (Standing Rule 104, and
  `build/testing-tools/blocker_gate.py`). "It's not there" is a claim about my probe until proved
  otherwise. I nearly filed a defect that the case's own Expected text disproved; reconciling against
  the live source first (Rule 106) stopped it.
- **Counting comes from the system of record.** My own file tally said 36 where TestRail said 35. The
  system of record won, and the correction is in the commit history.
- **Self-correction is written down, not quietly fixed.** Four wrong claims of mine are corrected in
  those commits by name. If I tell you something and I am wrong, I will say so in writing.

---

## 4 · Limits — so you don't ask for something I will refuse

- **No Jira ticket or other external artefact without the QA lead's per-ask permission** (Rule 62,
  active hold). Creating **TestRail cases is not held** — `add_case` / `update_case` are expected.
- **No TestRail result or case write without his go-ahead** (Rule 6). **Never** touch cases authored
  by Vladimir Tomovic (`created_by == 1`, Rule 38), and never change an **Automated**-flagged case
  without him (Rule 71).
- **Nothing outward-facing on my own say-so:** no emailing real addresses, no enabling payment
  handling, no firing external approval requests from a production account.
- **No secrets in commits — this repository is public** (Rule 82).
- **I work only on the project I am given** (Rule 92). My invoice work is reference, **not a backlog**,
  and neither is anything in §5 below.

---

## 5 · Global Search — what is already on disk (reference only, verify before relying on it)

I have **not** worked this project. These are file facts measured on disk on 2026-09-14, handed over so
you do not start from zero. **Re-measure before you build on any of it** — the project index in
`CLAUDE.md` was last re-derived on 2026-08-21 and says so.

> ⚠️ **There is already a regression suite here.** Before you author anything, establish with the QA
> lead whether your task is *this* suite, an extension of it, or genuinely separate (Rule 2: always
> confirm which project and which piece an instruction is for).

| What | Where | Measured |
|---|---|---|
| Project state — read this first | `build/global-search/PROJECT-STATE.md` | 38,632 bytes |
| **Existing V1 regression suite** — *"Global Search V2 - V1 Regression Suite"*, **20 cases**, `C45142` onward, authored 2026-08-26 | `build/global-search/regression-2026-08-26/` | `testrail-id-map.csv` = 20 rows |
| Its impact matrix and PO decision register | same folder: `REGRESSION-IMPACT-MATRIX.md`, `PO-DECISION-REGISTER.md`, `README.md` | present |
| Its authoring and push tooling | same folder: `author_regression.py`, `gen_import.py`, `push_to_testrail.py` | present |
| Latest source verification | `build/global-search/SOURCE-VERIFY-2026-09-02.md` | present |

**Two things from `PROJECT-STATE.md` that will shape your approach:**

1. **It is a V2 of an existing feature**, so **Rule 96** applies: what the V2 spec does *not* mention is
   still a requirement — silence defaults to *"must not change"*. That is exactly what a regression
   suite is for. The method is `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md` (24,921 bytes): derive
   the invariant set (V1 baseline − changed ∪ removed ∪ replaced), escalate the dangerous silences as
   PO questions, retire superseded V1 cases.
2. **No QA build has ever existed for this project** — the suite is **source-verified only**, nothing
   has been observed on a build (Rule 85). Check whether that is still true before planning any
   build-verification: a "no build" note goes stale, and Rule 86 says verify it live.

**Read in this order:** `build/skills/README.md` → `build/skills/00-COMMON-CORE.md` →
`build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md` → `build/global-search/PROJECT-STATE.md` →
`build/global-search/regression-2026-08-26/README.md`. If the task turns out to be execution rather
than authoring, the lane router is `build/skills/16-TEST-EXECUTION-AND-DEFECTS.md`.
**Never** read `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` whole — grep it (Rule 88).

---

## 6 · What I can do for you on this task

Ask me for any of these and I will do them and commit the evidence:

- Walk a screen and hand back the real routes, test ids and controls, recorded into the playbook.
- Prove or disprove a blocker properly — positive control, through the screen, repo searched first.
- Reconcile a case's Expected against the **live** source before anyone proposes a defect.
- Count anything from the system of record rather than from a local file.
- Take a suite through execution and post honest results, one comment per environment.

What I will not do is tell you something is impossible because it failed the way I first tried it.
That is step one of seven, not a blocker.

---

**Questions about this card:** message `manual-test-cases-c2`, or read the commits and judge for
yourself. The second is better.
