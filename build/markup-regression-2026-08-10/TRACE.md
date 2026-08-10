# WHERE THE RAW MARKUP CAME BACK FROM — the trace, 2026-08-10

**Short answer: it is not our tools, and it is not anybody's edit. It is a TestRail-side
re-render that happens AFTER our write completes, leaves `updated_on` and `updated_by`
untouched, and is therefore invisible to the immediate re-GET byte-check every one of our
passes runs. Every pass since 5 August truthfully reported "0 raw markup" and every one of
them was right at the moment it looked.**

---

## 1 · What was ruled OUT, with the evidence

### (a) Our own writes omitting a text field — RULED OUT

Declared normalisation #3 (playbook §J) says `update_case` re-renders any text field you omit.
The brief asked whether every pass since 5 August actually sent all three. **They did.** Read
from the committed executors:

| Pass | Executor | All three text fields sent? |
|---|---|---|
| Filters provenance re-stamp, 5 Aug 17:17 | `provenance-restamp-2026-08-05/exec.py` | **yes** — `custom_expected` + `custom_preconds` + `custom_steps`, the unchanged two at their exact pre-write bytes |
| Schedule full VIU, 6 Aug 07:22 | `full-viu-2026-08-05/write_exec_2026-08-06.py` | **yes** — `WRITE_FIELDS = ('custom_expected','custom_preconds','custom_steps')` |
| Filters Vlad gap review, 6 Aug 12:26 | `vlad-gap-review-2026-08-06/writeA.py`, `writeB.py` | **yes** |
| Filters + Schedule source accuracy, 10 Aug 22:28 | `source-accuracy-2026-08-10/tools/restamp.py` | **yes** |

**And the signature is wrong for #3 anyway.** Normalisation #3 wraps a field in `<p>…</p>` and
turns `\n` into `\r\n`. What is on these 37 cases is a **full rich-text render**:
`<ol>` / `<li>` built out of numbered lines, `<p>`, `<br />`, `<hr />`, `<a href>` around bare
URLs, `&nbsp;` — with plain `\n`, not `\r\n`. Different mechanism.

**Our local mirror has never carried markup.** All 195 Schedule case bodies under
`build/schedule/cases/*.json` contain zero `<ol>`/`<li>`. Nothing we author or generate emits it.

### (b) Another author editing the case — RULED OUT for 36 of 37

All 37 live cases read `updated_by = 3` (us). Only **C38877** was last written by another
author (Vladimir Tomovic, 6 Aug 11:30) and it is a single case, not the pattern.

### (c) A pass that converted to plain text and reintroduced it in the same write — RULED OUT

The write logs show the opposite: each pass **repaired** the markup it could see and its re-GET
proved the repair. The damage appears in the *next* pass's pre-write snapshot.

---

## 2 · What actually happened — proven by two live reads with a frozen timestamp

Two committed **live** snapshots of the same 110 Filters cases, 2.5 hours apart, with **no write
in between**:

| | taken | source |
|---|---|---|
| A | **5 Aug 17:25** | `provenance-restamp-2026-08-05/snapshots/cases-POST.json` (commit `3e34d4ea`) |
| B | **5 Aug 19:56** | `full-viu-2026-08-05/pre-write/PRE-cases-110.json` (commit `a4f8b870`) |

**Ten cases differ, in exactly three fields each — `custom_preconds`, `custom_steps`,
`custom_expected` — and in nothing else.** Field-by-field diff over all 110 cases:

```
custom_expected     10 cases
custom_preconds     10 cases
custom_steps        10 cases
(no other field differs on any case)
```

C29558, `custom_steps`:

```
A 17:25   '1. Read the filter chips in the filter bar from left to right.\n2. Look at what each chip shows.'
B 19:56   '<ol>\n<li>Read the filter chips in the filter bar from left to right.</li>\n<li>Look at what each
           chip shows.</li>\n</ol>\n'
```

**`updated_on` is byte-identical in both snapshots: `1785950271` (5 Aug 17:17). `updated_by` is 3
in both.** The content changed and the timestamp did not move. **That is not a write.**

The same shape repeats: the 5 Aug 17:17–17:20 re-stamp wrote 110 cases and re-GET-verified every
one clean; ten of them were rendered by 19:56. The 5 Aug 21:35–21:39 pass wrote 110 and verified
every one clean; twelve of them were rendered by the time the next pass looked at 12:14 on 6 Aug.
The 6 Aug 07:22 Schedule pass wrote 168 with a post-write snapshot proving **0 markup**; twenty
were rendered by 10 Aug.

**So the byte-check is not being skipped and is not lying. It is structurally blind:** it re-reads
immediately after the write, when the text is still exactly what we sent.

---

## 3 · What triggers the render

It tracks the cases the **run owners** are working through in the TestRail UI, not our writes.

**Schedule is unambiguous.** Run 357 has been graded exactly once ever — user 5 (Ayesha), **10
August 21:17–21:31 UTC**, 28 results. **19 of the 20 markup cases were graded inside that
14-minute window**, and they are a near-contiguous block, C29927 → C29954.

| | markup | clean |
|---|---:|---:|
| graded | **18** | 8 |
| not graded | **2** | 140 |

Only 26 of 168 Schedule cases have ever been graded. If the render were unrelated we would expect
about 3 of the 20 to be graded; 18 are. Two Schedule cases (C29934, C29935) were already rendered
by 15:59 that day, so the trigger is the tester *working in* the case, not the act of grading
itself — but the association is not in doubt.

Filters shows the same association against Ahtasham's run 352, more weakly because he has graded
most of that suite.

---

## 4 · The consequence that matters more than the 37 repairs

**Our verification method cannot detect this class of damage, and no tightening of the write path
will fix that**, because at write time there is nothing to detect. The defence has to be a
**deferred census**, not a tighter write:

1. **Census raw markup across the whole project at the START of every pass** — before any write —
   and treat a non-zero count as a finding to repair, not as a surprise.
2. **Never report "0 raw markup" as a durable state.** It is true only of the moment it was
   measured. The 5 August audit was correct and still got overtaken within hours.
3. **Expect these 37 to come back** once a tester next works through them in the TestRail UI. The
   repair below is right and necessary — a tester cannot run a case full of `<li>` — but it is not
   permanent, and only a TestRail-side setting change would make it permanent. That is the QA
   lead's call to raise with whoever administers TestRail.

Recorded in `build/APP-ACTIONS-PLAYBOOK.md` §J as declared hazard #5.
