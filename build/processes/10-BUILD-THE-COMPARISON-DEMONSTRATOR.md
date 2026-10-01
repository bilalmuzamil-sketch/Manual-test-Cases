# BUILD THE COMPARISON DEMONSTRATOR `<feature>` — a working copy of the OLD version anyone can type into

> **Call it:** `BUILD THE COMPARISON DEMONSTRATOR for Invoicing`
>
> 🔴 **THE ONE WE BUILT FOR GLOBAL SEARCH IS THE REFERENCE — GO AND OPEN IT:**
> **https://claude.ai/artifact/9mJMvNCNggwrDsDb4UYQ7E**
> Source, presets and the checker: `build/global-search/old-search-demonstrator/`.
> Do not design a new one from this description. Open that page, see what it does, and build
> the same shape for the feature in hand.
>
> **What it is.** A page that **behaves like the old version**. Someone types into it and gets a
> truthful answer, because the old version's rules have been ported into it line for line from the
> code. Beside each answer it says **what the new version does today**, measured and dated.
>
> **Why it beats a document.** A findings table is read by two people. A page you can type into
> survives the question *"well, what about…?"* in a meeting — somebody types their own example and
> the page answers honestly, in front of the room. That is the difference between being believed
> and being argued with.

---

## THE GATE — what I ask you for

| What I need | Why | If missing |
|---|---|---|
| **The V1 vs V2 Capability Check must be done first** | The demonstrator is its findings made touchable. Without the baseline there is nothing truthful to port | I run that first, or stop |
| **Repository access + the pinned V1 commit** | The rules are ported from the code, not re-imagined | Blocking |
| **The seeded example records** | The page searches the same records the test suite uses, so what it shows is what a tester will see | I use the seeded set from "Seed the Test Data" |
| **Who the audience is** — PO, developers, a release meeting | It changes the order of the walkthrough, not the facts | I default to: what still works, then the losses, then the noise |
| *(before sharing)* **permission to publish it** | It becomes a link anyone with it can open | I keep it private until you say |

---

## WHAT IT PRODUCES

A **single self-contained page**, plus the checker that keeps it honest:

1. **A working search box / interaction** running the OLD version's real rules.
2. **A guided walkthrough** — numbered steps, each with what to do, a **clickable chip that fills in
   the example for you**, and one line on why it matters.
3. **Every example, grouped by the part of the app it comes from**, with the navigation path printed
   under each heading, so anyone can go and set the data up themselves.
4. **A briefing panel per example** — what it is, which field holds it, what should come back, 🔴
   **what to check before judging the result**, and what the new version does today.
5. **A self-check script** that runs every declared expectation against the ported engine and fails
   if any disagrees.

---

## THE STEPS

### 1 — Port the old rules from the code, not from memory
Transcribe the old version's logic into a small engine (we used `v1_search.py`), citing the commit.
Cross-check the page against that engine before publishing — they must agree exactly.

### 2 — Use the SEEDED records, and show them on the page
The page searches the same records the suite is seeded with, and prints them as cards underneath, so
nobody has to take on trust what data exists.

### 3 — Write every example as a declared expectation
Each one states what should come back **before** you look. Then a banner under the box **compares
what actually came back against that stated expectation** and says whether they match. The page
checks itself in front of the room.

### 4 — Machine-check every expectation, every time
```bash
python3 check_presets.py      # 42 checked, 0 mismatches
```
🔴 **Run it before every publish.** An example that claims one thing and does another will be shown
in a meeting and contradicted on the spot.

### 5 — Mark what is MEASURED and what is REPORTED
A "new version today" line is only written where it was actually measured, with the date. Where it
came from someone else's testing, it says **"reported as"**. **A demonstrator that overstates by one
line is worth nothing in a room with a developer in it.**

### 6 — Order the walkthrough as an argument
What still works → what was lost → the noise → the thing that lands. Not alphabetically. The order
is the point.

### 7 — Keep it honest as things change
Print the commit on the page, because if the old code is revisited this needs re-deriving. Date the
"new version today" notes so that when the new version is fixed they go visibly stale rather than
quietly misleading.

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| **Canned screenshots or a recording** | The first "what about…?" kills it | It must actually run. Anyone can type anything |
| **Re-imagining the old rules** | It disagrees with the product and you lose the room | Port line for line from the pinned commit |
| **An unchecked expectation** | Contradicted live | `check_presets.py`, before every publish |
| **Stating a finding you did not measure** | One wrong line discredits the whole page | Say "reported as", with the date |
| **Letting it go stale silently** | It argues for a problem that has since been fixed | Date every claim; print the commit |

---

## DONE WHEN
Every declared expectation passes the checker, the page agrees with the ported engine, every "new
version today" note is dated and marked measured-or-reported, and the records it searches are the
seeded ones.

**Worked example:** `build/global-search/old-search-demonstrator/` — the page, its README, its
`check_presets.py`, and the 42 keyword presets. Engine it was ported from:
`build/global-search/v1-capability-evidence/v1_search.py`, transcribed at commit `55767168`.
**Rules:** 110 (measured vs reported), 109, 12, 9.
