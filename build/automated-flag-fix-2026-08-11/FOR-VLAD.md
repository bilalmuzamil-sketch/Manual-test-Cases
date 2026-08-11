# For Vlad — the Automation status tick-box on Filters and the Report Suite, 2026-08-11

**For the QA lead to forward if and when he chooses. Nothing here has been sent to anyone.**

---

## ⚠️ The short version — you can stop after this box

**We changed nothing. Not one test case in Filters or the Report Suite was touched today.**

- **No test's Automation status was changed.**
- **No test's wording changed** — no title, no preconditions, no steps, no expected result, no
  references. **Not a single character.**
- **Nothing was deleted, and nothing was created.**

**So there is nothing to adjust in the automation from this piece of work.** The rest of this page
explains why we went looking, and what we found instead — which is that **everything already marked
"Automated" in those two projects is your own marking, and we left all of it exactly as it is.**

---

## 1. Cases that affect what an automated check would conclude

**None.**

---

## 2. Cases whose Automation status we changed

**None — in Filters or the Report Suite.**

| Project | Cases we changed |
|---|---:|
| Filters | **0** |
| Report Suite | **0** |

---

## 3. Why we were looking in the first place — the mistake was ours, and it was real

When we create a test case through TestRail's API, our script fills in every field. One of those
fields is **"Automation status"**, and our script had been filling it in as **"Automated"** on every
case it created, automatically, since the beginning.

**That was wrong.** "Automated" is your tick-box. It should say Automated only when you have actually
automated the test. A case that says Automated when nobody automated it tells you that you did work
you never did — and it also spoils the list we use to decide what to tell you about in the first
place, so the noise would have grown with every round of work rather than staying put.

**The script has now been fixed.** New cases we create will say **"Not Automated"**, which is simply
the truth at the moment we create them. There is also now an automatic check that stops anyone
re-introducing the old value by copying an old script.

---

## 4. What we found when we checked Filters and the Report Suite

**44 test cases in those two projects currently say "Automated".** For each one, we looked at
TestRail's own change history — which records who changed the field and when — to see whether it was
your marking or our script's mistake.

| | Cases |
|---|---:|
| Cases examined | **44** — 4 in Filters, 40 in the Report Suite |
| **Marked by you** | **44 — every single one** |
| Marked by our script's mistake | **0** |
| **Changed by us** | **0** |

**Every "Automated" tick in Filters and the Report Suite is yours, and we left all 44 alone.** They
are not ours to change, and clearing one would break your automation without you knowing.

The full list, with the date and time of each of your changes, is in `CLASSIFICATION.md` §3 alongside
this note.

---

## 5. One case worth a second look — C38877 (Filters)

**[C38877](https://shopview.testrail.io/index.php?/cases/view/38877)** — *"Imported works alone: picking
it greys out the other filters"*

**We have left it exactly as it is.** But there is one thing about it worth mentioning, because you may
want to decide rather than have us decide for you:

- On **5 August** you changed it **from** "Automated" **to** "Not Automated".
- On **6 August** you changed it **back to** "Automated".

The first of those changes is the interesting one: because it moved *away* from "Automated", the case
must already have said "Automated" **before you ever touched it** — which means it was probably one of
the ones our script mis-marked at creation.

**We did not change it, and we do not think we should**, because whatever it started as, the most
recent decision on it is yours and it is only two days old. **If it should be "Not Automated", that is
your call to make.**

---

## 6. What did change today, in a different project — the note you may actually need

**31 Schedule test cases** had their Automation status corrected from **"Automated"** to **"Not
Automated"** earlier today. Those 31 were the genuine mistakes: TestRail's history showed **nobody had
ever set that field on them** — the value came from our script at the moment each case was created.

**None of those 31 was ever automated, so nothing in your automation refers to them.**

That correction has its own note, already written and ready to forward:
`build/automated-flag-and-c30041-2026-08-11/FOR-VLAD.md`. There is also a separate note listing every
test case whose **wording** we changed in the week to 11 August:
`build/automated-cases-changed-2026-08-11/FOR-VLAD.md`.

**This page adds nothing to either of those.** It exists so the record is complete: we checked
Filters and the Report Suite too, and there was nothing to correct there.

---

## 7. If you would like to double-check us

Everything above comes from TestRail's own change history, one case at a time, with no sampling — we
did not read a summary or reuse an earlier list. Each of the 44 cases is named in `CLASSIFICATION.md`
with a direct link, the exact date and time of each change, and who made it.

**One honest limitation, worth stating:** the QA lead works in TestRail under the same account we do,
so if he had ever set one of these ticks by hand it would look identical to ours in the history. None
of the 44 is attributed to that account — all 44 are yours — so it does not affect anything here, but
it is the standing limit on any claim we make about *who* did something in TestRail.
