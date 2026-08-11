# FOR VLAD — Report Suite cases TestRail flags as Automated that we changed today

**Standing Rule 65.** Every case below carries TestRail's own `custom_atmstatus = 3` ("Automated"),
captured **at the moment of the write** rather than from a snapshot, so the flag is the value that
was actually live when we touched the case.

**40 of the 476** Report Suite cases we changed today are flagged Automated.

---

## What changed on them, in one line

**Nothing that an automated check executes.** Two edits were made, both inside the provenance
sentence at the very end of Expected Results:

1. **A read-date was added after each cited source** — `read on 11 August 2026`.
2. **A stale specification version number was corrected** on 27 of the 40 — the pin naming which
   revision of the specification the expectation was taken from.

## Does this change what an automated check should conclude?

**No.** In every one of the 40 cases:

* the **steps** are byte-identical,
* the **preconditions** are byte-identical,
* the **expected behaviour itself** is byte-identical — not one assertion was reworded, relaxed or
  tightened,
* the **`AUTOMATION:` marker** is byte-identical, including its ticket reference where it carries
  one,
* the **build line** (*"Last checked against build … on …"*) is byte-identical,
* **`refs` was not written at all.**

The only text that moved is the sentence that records **where the expectation came from and when we
read it**. An automated assertion derived from these cases does not need to change, and a test that
passed yesterday should pass today for the same reason it did before.

**If any of these 40 starts behaving differently after today, this pass is not the cause** — and
that is worth saying plainly, because the `updated_on` timestamp on all 40 now reads 11 August and
will look like a substantive edit to anyone who checks the date rather than the diff.

---

## The 40 cases

| Case | Report | What changed | Version pin |
|---|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Sales By Customer | read-dates | 16 → 17 |
| [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | Sales By Customer | read-dates | 16 → 17 |
| [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | Sales By Customer | read-dates | 16 → 17 |
| [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | Sales By Customer | read-dates | 16 → 17 |
| [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | Sales By Customer | read-dates | 16 → 17 |
| [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | Sales By Representative | read-dates | already current |
| [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | Sales By Representative | read-dates | already current |
| [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | Sales By Representative | read-dates | 17 → 18 |
| [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | Sales By Representative | read-dates | 17 → 18 |
| [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | Parts Velocity | read-dates | 5 → 6 |
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Parts Velocity | read-dates | 5 → 6 |
| [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | Parts Velocity | read-dates | 5 → 6 |
| [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | Parts Velocity | read-dates | 5 → 6 |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Parts Velocity | read-dates | 5 → 6 |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | Parts Velocity | read-dates | 5 → 6 |
| [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | Parts Velocity | read-dates | 5 → 6 |
| [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | Parts Velocity | read-dates | 5 → 6 |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Technician Utilization | read-dates | already current |
| [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | Technician Utilization | read-dates | already current |
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | Technician Utilization | read-dates | already current |
| [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | Technician Utilization | read-dates | already current |
| [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | Technician Utilization | read-dates | already current |
| [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | Technician Utilization | read-dates | already current |
| [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | Technician Utilization | read-dates | already current |
| [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | Technician Utilization | read-dates | already current |
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | Work In Progress | read-date on the epic only — its other two were added earlier today | already current |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | Work In Progress | read-dates | 10 → 11 |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Work In Progress | read-dates | 10 → 11 |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Work In Progress | read-dates | 10 → 11 |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | Work In Progress | read-dates | 10 → 11 |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | Work In Progress | read-dates | 10 → 11 |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Work In Progress | read-dates | 10 → 11 |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | Work In Progress | read-dates | 10 → 11 |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Work In Progress | read-dates | 10 → 11 |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | Work In Progress | read-dates | 10 → 11 |
| [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | Inventory Value | read-dates | 4 → 5 |
| [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | Inventory Value | read-dates | 4 → 5 |
| [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | Inventory Value | read-dates | 4 → 5 |
| [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | Inventory Value | read-dates | 4 → 5 |
| [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | Inventory Value | read-dates | 4 → 5 |

---

## Two of them are worth a second look, and not because of anything we changed

**[C30518](https://shopview.testrail.io/index.php?/cases/view/30518)** now pins Work In Progress
version **11**, while its own text still cautions that *"version **10** of that specification uses
the number S9-R11 for two different requirements"*. The caution is still **true** — S9-R11 does occur
twice in v11, checked — but the sentence names a version the case no longer pins. It needs a
one-word wording review, which was out of this pass's charter.

**[C30352](https://shopview.testrail.io/index.php?/cases/view/30352)** is one of the cases whose
underlying requirement, Parts Velocity **S4-R1**, had its **own text rewritten** between v5 and v6 —
the Location-column rule. Re-pinning it to v6 is correct, but whether the case's assertion still
matches what S4-R1 now says is a **coverage question**, and it is recorded for a Rule-43
re-derivation in `STALE-ANCHORS.md`. **Nothing about its assertion was changed here.**

---

## Also worth knowing: 12 more Automated cases under this group are not ours

Twelve cases under group 4281 carry `created_by = 1` — **C38919–C38923** and **C43567–C43573**.
They were **not touched**, and were proven byte-identical before and after, `updated_on` and
`updated_by` included (Rule 38). The live group holds **488** cases; **476** are ours.
