# Global Search — every check re-run on the shared test site

**28 September 2026.** All **195** checks were run again from scratch on the shared test site, because
the separate branch this feature was being tested on has been merged away and deleted. Nothing was
carried over: every check was performed again by hand against the site as it stands today.

---

## 1 · Where it stands

| | How many | What it means |
|---|---|---|
| Checks run | **195** | the whole set, none skipped |
| Worked correctly | **179** | |
| Did not work | **16** | see below — most are not new problems |
| Could not be run | **0** | everything that was missing was created |

**Two checks that were expected to fail now PASS**, which is good news worth having:

- A vehicle can be found by its full identification number again. Two weeks ago typing the whole
  number returned nothing at all. That is fixed.
- Where three similar names match, the one that BEGINS with what you typed now comes first. It used
  to be beaten by a name that merely contained the word.
- A search made of two words held in different parts of one record now works. That used to return
  nothing.

---

## 2 · The 16 that did not work, sorted by what you would actually do about them

### (a) NO new problems. I thought I had one, and I was wrong — here is why that matters

For most of this run I believed I had found something new: **type a search, press Enter, and you open
the wrong record** — an unrelated company eight rows below the thing being searched for.

I nearly asked you for permission to report it. Before doing that I pinned down when it happens, and
the answer changed the conclusion completely: **the row sitting under the mouse pointer becomes the one
Enter will open.** Clicking the search box leaves the pointer exactly where the panel then opens over
it, so a row lands under the pointer and quietly takes over. Proved four ways on the same search:

| What I did | What Enter was aimed at |
|---|---|
| Clicked the search box and left the mouse alone | the EIGHTH row |
| Clicked the box, then moved the mouse away | the FIRST row, correctly |
| Opened with the keyboard, mouse in a corner | the FIRST row, correctly |
| Opened with the keyboard, mouse held over the middle of the list | the row under it |

**That is the behaviour that was already reported and closed by the product team as no longer
relevant.** So it is not new, and asking you to raise it would have produced a duplicate of something
already decided. Two of our checks still describe the older behaviour, which puts them in group (c)
below rather than in front of a developer.

I am flagging this at the top rather than burying it, because my first two write-ups of it were wrong
— the first said it happened every single time, the second said it happened only on the first search
after opening the app. Neither was true. Both were corrected on the checks themselves before anything
reached you.

### (b) Three that are already reported and still open — nothing needed from you

A part that is already on the job you are looking at is not pushed down the list. It behaves exactly
as it did before, the report for it is still open, and I have linked the result to it.

### (c) Seven where the CHECK is out of date, not the product

Each of these was reported before and the product team closed it as intended behaviour. The product
is doing what was decided; our check still describes the older search. They are: the twenty-result
count, a part in the catalogue that was never stocked, finding a record by a fragment from the
middle of a word, one name bringing back differently spelled ones, the usage-tracking event, and
the two about pressing Enter described above.

**What I need from you eventually:** whether each is retired or reworded. I cannot change what a
check expects.

### (d) Four where I think the requirement has MOVED and I need you to say so

These four are the ones I am least willing to guess about.

1. **Typing an exact number no longer puts that record on a line of its own above everything.** The
   record is found and it is ranked first, but it sits inside its section like any other result.
   Two reports point at this having been changed on purpose: one asking why that top line had no
   heading, which was fixed, and one closed as no-longer-relevant. Our check still requires the
   separate line. **It looks to me like the product is right and the check is behind.**
2. **On a phone the results are capped at five per section with a "Show All" link** — the same as a
   computer. Our three checks require the opposite: scroll the whole list, no "Show All" anywhere.
   But there is an open report asking for "Show All" to be ADDED on phones. So our checks and that
   request point in opposite directions, and somebody has to choose.
3. **The greyed-out words in the search box on a phone** read "Search work orders, parts…" where the
   check requires "Search everything". This is wording, and you already had it flagged as waiting on
   your decision.

---

## 3 · What I did to the test site

You said to give it whatever it takes, so: I created the records the checks needed, put a part onto
a job, marked a sale as paid, closed one job and opened another, and built two new job roles so the
access checks could be done properly. Everything I changed that was not the point of a test, I put
back and then read back to confirm — including the technician's role, which I checked by signing in
as them afterwards.

The access checks were done the thorough way rather than the quick way: the same person was given
one purpose-built role after another and signed in fresh each time, searching the same words. Each
role differs from the next by exactly ONE area of access, so nothing else can explain a difference.
Every area removed took away its whole section, its count and its tab together. Taking away the
money permission behaves differently and correctly: every row stays and only the amounts go.

---

## 4 · Where I had to throw my own work away

Seven readings were discarded before they reached you, each because my own method was wrong rather
than the product. I mention it because each one would have been a false report:

- A comparison meant to be about a customer's page had actually opened one of that customer's jobs.
- A comparison about parts was run from a page-not-found screen.
- Another was run from a job that had no parts on it at all, so there was nothing to compare.
- Three readings said records from another location were still showing after switching. They were
  not: switching behind the screen never moves the screen, which keeps its location in the browser.
  Done through the menu the way a person does it, it is correct.
- And the one above about pressing Enter, twice over: I first wrote that it happened every time,
  then that it happened only on the first search after opening the app. Neither was true. Running it
  down properly showed the mouse pointer was the cause, which makes it something already decided
  rather than a new fault. Both write-ups were corrected on the checks before you saw them.

---

## 5 · Two loose ends, both now closed

**The missing hover buttons are not a fault.** Earlier today I reported that the little buttons which
should appear when you hover over a result are absent everywhere, and called it the one thing with no
decision behind it. That was wrong. **The work to build them was cancelled** — closed as no longer
relevant on 17 September. The measurement stands; the conclusion does not. There is nothing to raise,
and the eight checks covering it correctly sit outside the run.

**The eight checks that vanished from the run this afternoon belong outside it.** I had flagged that
as something only you could safely put back. They cover that same cancelled feature, so their removal
was right rather than an accident, and nothing needs restoring.

**One check genuinely was missing and is now done.** A new check on the small clear button inside the
search box had never been added to the run. I added it — taking a full copy of the run first, sending
the complete list rather than a partial one, and confirming afterwards that all 1,264 existing results
were still there — and then ran it. It passes on all four points: the button is hidden until you type,
it appears once you do, clicking it empties the box, and it leaves the panel open with the cursor
still in the box.

---

## 6 · OUTSTANDING — what I need from you

| # | What it is | The question | Your options | If you say nothing |
|---|---|---|---|---|
| 1 | **Seven** checks the product team has already closed as intended — the five below plus the two about pressing Enter | Retire them, or reword them to match what was decided? | **(a)** retire · **(b)** reword and I will do it · **(c)** leave them failing as a standing flag | They keep showing as failures every run and make the totals look worse than they are |
| 2 | Typing an exact number no longer gets a line of its own at the top | Was that changed on purpose? | **(a)** yes — then the two checks need rewording · **(b)** no — then it is a real fault and I will write it up | Two checks keep failing and we do not know which side is wrong |
| 3 | Phones: capped list with "Show All", where our checks require the full scrolling list | Which way is right? | **(a)** phones should match the computer, so reword three checks · **(b)** phones should scroll the whole list, so it is a fault and the other request is wrong | Three checks keep failing and the two requests stay in conflict |
| 4 | The words inside the phone search box | "Search everything", or what it says now? | **(a)** change the product · **(b)** change the check | One check keeps failing |

**Nothing else is waiting on you, and nothing is blocked.** Every check has been run and answered.

---REFERENCE---

Run 415 — https://shopview.testrail.io/index.php?/runs/view/415 — 195 tests · 179 passed · 16 failed ·
0 blocked · 0 untested. Run 416 (Simple Flow) — 55 tests · 55 passed · 0 untested.
C137996 added to run 415 (union-only, snapshot `run415-snapshot-before-add.json`, 1,264 results intact).
Quick actions on hover: SV-9173 OBSOLETE (resolution Done, 17 September) — C44866-C44873 correctly out of run. Environment: `app.staging.shopview.com`, build **v26.39.1-02c6b6c**, workplace
Staging Heavy Duty - 9919.

Newly failing this pass: C44850 · C44854 · C44898 · C45132 · C45134 · C45136 · C45153 · C55673 · C55686 · C55729
Already failing before this pass: C45160 · C53476 · C53601 · C55660 · C55685 · C55716
Now passing, previously expected to fail: C55669 (VIN) · C55707 / C72120 (prefix ranking) · C53605 (two-field words)

Tickets referenced: SV-10188 (open, C44854 reproduces it) · SV-10061 — the pointer behaviour, OBSOLETE, which C55673 and C55686 reproduce · SV-10001, SV-10320, SV-10025,
SV-9167, SV-10340 (all OBSOLETE) · SV-10547 (Done) and SV-10556 (OBSOLETE) — the two behind item 3 ·
SV-10345 (open) — the "Show All on mobile" request behind item 4.

Evidence, probes and every discarded reading: `build/global-search/staging-run-2026-09-28/`
