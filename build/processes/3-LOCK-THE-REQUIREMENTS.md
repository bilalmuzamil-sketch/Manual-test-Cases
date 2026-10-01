# LOCK THE REQUIREMENTS `<feature>` — prove the sources are current, and pull the sentences we will quote

> **Call it:** `READ THE SPECS Invoicing`
>
> Two jobs: make sure we hold the **current** version of every source, and extract the **exact
> sentences** the cases will quote. Both matter more than they sound.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **Confluence / spec access** | To read the page AND its real version number |
| **Jira access** (the epic and its stories) | Intent often lives in a story, not the PRD |
| **Figma / design access**, if designs exist | PRD, design and Figma are expected to agree; disagreement is a finding |
| **Any PO answers, messages or videos** you have | They are a source, and they are usually the newest one |
| *(ask me)* whether to spend the quota on a full source re-read | Standing Rule 81 — I offer, you decide |

---

## THE STEPS

### 1 — Currency check, per source
For each: identifier, version / last-updated, date checked, and a verdict of **CURRENT / STALE /
PARTIAL** — a PARTIAL naming its exact shortfall. **Nothing may claim completeness while a source is
STALE.** If a source cannot be fetched, stop and ask for access rather than proceeding around it.

> Two traps. A Confluence page's in-body "Version 1.8" can sit still while the real version
> advances. A Jira epic's "updated" date moves for admin-only edits.

### 2 — Pull the quotable sentences
For each requirement, copy **the source's own sentence, unaltered**, and record document + version +
section beside it.

🔴 **This is Rule 113 and it is the strongest rule we have about case writing.** The Expected Result
is the source's words, quoted, and it changes **only when the SOURCE changes**. Not when the build
differs — that is a deviation. Not when a reviewer disagrees — that is a PO question.

> **If you find yourself improving the wording of an expected result, stop.** That is the exact
> failure the rule exists to prevent: a paraphrase drifts towards whatever the author is looking at,
> which is the build — and a case rewritten towards the build **can never fail**.

### 3 — Where there is no quotable sentence, HOLD and ask
Do not invent one, and never resolve it by looking at the build (Rules 58, 64). Collect these into
the PO question sheet.

### 4 — Record disagreements, do not resolve them
PRD vs design vs Figma disagreeing is a **finding to raise**, never a side to pick quietly. The case
follows the most recent authoritative source and **discloses the divergence**.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| Quoting a SUMMARY | The case quotes a handoff or a Jira description that restates the PRD | Quote the source itself (Rule 112) |
| Carrying a quote forward without re-checking | The case cites v1.4 of a spec now at v1.9 | Re-check the version at every pass (31/32/59) |
| Tidying grammar in a quote | Invisible drift | Forbidden outright. Plain-language wording is ADDED AFTER the quote, marked as ours |
| Trusting a previous session's report | A handoff said eight cases needed no new records; reading the case bodies found three dead example records and a product defect | **Verify against the real case text, never a summary** (Rule 112) |

---

## DONE WHEN
Every source has a currency verdict with a date; every requirement has either a verbatim quoted
sentence with its citation, or a PO question explaining why it has none.

**Canonical:** `build/skills/02-SOURCE-CHECK.md`. **Rules:** 113, 57, 58, 64, 31, 32, 59, 112, 81.
