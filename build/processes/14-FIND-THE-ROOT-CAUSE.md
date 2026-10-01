# FIND THE ROOT CAUSE `<complaint>` — turn a vague complaint into something testable

> **Call it:** `FIND THE ROOT CAUSE of "search results are disappointing"`
>
> **This is how the Global Search integrity suite began.** Not from a spec — from UAT and support
> saying results were bad, and one ticket about a highlight showing `786` instead of `123786`.
> A complaint is not a bug report. This turns it into one, or into a suite.

**RUNS AFTER:** nothing — this one can be called cold.

---

## THE GATE — what I ask you for

| What I need | Why |
|---|---|
| **The complaint in the complainer's own words** | Paraphrasing it loses the thing that is actually wrong |
| **Any examples** — tickets, screenshots, a recording | One real example beats ten descriptions |
| **Repository access** | The cause is usually in the code, and usually one grep away |
| **An environment + login** | To reproduce it rather than theorise |

---

## THE STEPS

### 1 — Reproduce it before explaining it
If you cannot make it happen, you cannot diagnose it. Record exactly what you typed and what came
back, with the build marker.

### 2 — Find the line
Follow it into the code until you can point at the thing that does it. On Global Search that was one
function deciding whether to return the typed slice or the whole value — **one line explained a
class of complaints that had been described five different ways.**

### 3 — 🔴 Go and look at the actual screen
The single worst mistake of the Global Search project: I reasoned from the API response and the row
*variants* to a conclusion about what the user sees, and declared that rows "cannot explain
themselves". Five screenshots proved the opposite — the UI labels the match. **32 cases were wrongly
held on my inference.** If the claim is about what a user SEES, open it.

### 4 — Separate the one real cause from the symptoms
A complaint described five ways is usually one cause plus four consequences. Say which is which.

### 5 — Write it so a non-technical reader can follow it
What people are experiencing → what actually happens → the line that does it → what it affects →
what would fix it.

### 6 — Decide what it becomes
One bug → a ticket (process 15). A **class** of problems → a test suite (processes 3 and 4), because
a suite catches the next one too. On Global Search it was both.

### 7 — Strike through what you get wrong, and date it
When the analysis is corrected, the wrong version stays visible with a correction banner. A document
that silently rewrites itself teaches nobody.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| **Reasoning from the data layer to the UI** | A confident claim about the screen, made without opening it | Step 3. Always |
| Explaining before reproducing | A tidy theory that is wrong | Step 1 |
| Treating symptoms as separate bugs | Five tickets for one line | Step 4 |
| Not checking for an existing ticket | A duplicate, and a credibility cost | Search Jira first — on Global Search all six already had one |
| Quietly fixing a wrong analysis | The reader never learns the trap | Strike through, date, keep it visible |

---

## DONE WHEN
The complaint is reproduced with a build marker, the cause is pointed at in the code, the screen has
actually been looked at, symptoms are separated from the cause, and there is a decision: ticket,
suite, or both.

**Worked example:** `build/search-results-integrity/WHY-SEARCH-RESULTS-DISAPPOINT-Root-Cause-Analysis.md`
— including §4 and §5 struck through with a correction banner, which is what being wrong in public
looks like. **Rules:** 110, 12, 57.
