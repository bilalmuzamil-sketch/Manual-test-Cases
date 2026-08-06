# The 8 closed tickets, now rewritten

**The QA lead said all of them: *"you have to correct all the tickets"*.** Both earlier passes
today had deliberately skipped the closed ones, on the reasoning that nobody is asked to
reproduce a closed ticket. He has overruled that, so they are done.

**8 writes, 8 PASS, every one HTTP 204, and nothing but the description moved on any of them.**
Per-write evidence in [`execution-log.md`](execution-log.md).

| Ticket | Project | Status, unchanged | What it is |
|---|---|---|---|
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Report Suite | Done / Done | a real arithmetic fault that was accepted and fixed — the ticket is the record of what was fixed |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Report Suite | OBSOLETE / Done | was raised the wrong way round; the product already stops you, so nothing is broken on screen |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Report Suite | OBSOLETE / Done | withdrawn as reachable only behind the screens |
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | Filters | OBSOLETE / Done | closed, and half of its own claim was wrong — see below |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Filters | OBSOLETE / Done | closed because the fault it reported has since been fixed |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | Filters | OBSOLETE / Done | closed, and our records say it still happens — see below |
| [SV-8902](https://shopview.atlassian.net/browse/SV-8902) | Schedule | OBSOLETE / Done | not a defect at all — a disposable probe of ours |
| [SV-8923](https://shopview.atlassian.net/browse/SV-8923) | Schedule | OBSOLETE / Done | withdrawn by us as a false defect |

## What was written, and what was not

Only the **description**. No status was changed, nothing was reopened, and no type, parent,
priority, resolution, link, label, assignee or Product Area was touched. Several of these were
closed by other people, and one by the QA lead himself — reversing another person's field change
is never ours to do (Standing Rule 53's corollary). That is proven per ticket in the execution
log by comparing every field against the pre-write read, not asserted.

## The shape

The same five parts as the other 84: **Description** · **Steps to reproduce**, with one
Environment line before them · **Current behaviour** in plain words · **Expected behaviour** in
plain words · a line break, then the **Source** with the requirement quoted.

Because these are closed tickets, each Description says so in a plain sentence, so nobody picks
one up thinking it is waiting for work.

## Two deliberate departures, flagged rather than hidden

**[SV-8902](https://shopview.atlassian.net/browse/SV-8902) is not written in the five-part
shape.** It is a throwaway probe we created to find out whether Jira allows a ticket of this kind
to be given a Story as its parent. Giving it "Steps to reproduce", "Current behaviour" and
"Expected behaviour" would dress a probe up as a defect, which is the one thing the instruction
about it forbids. It gets three short honest paragraphs and a Source line saying plainly that no
requirement stands behind it. **If you would rather it carried the five headings anyway, that is
one write.**

**[SV-8923](https://shopview.atlassian.net/browse/SV-8923) keeps the five parts, but its
Description leads with the withdrawal**, so it cannot be read as a live defect. Its *Current
behaviour* records what we actually observed on the re-check — the switch shades correctly — and
explains that the first check was made against a shop with no working hours set, which is exactly
what the source test case required. Its *Expected behaviour* and *Source* are still the real
requirement, because that is what makes the withdrawal checkable.

## The two that are closed but, by our records, still happen

Stated neutrally on the tickets, and **not reopened** — that is the QA lead's call.

- **[SV-8843](https://shopview.atlassian.net/browse/SV-8843)** — its main claim still holds (the
  filter buttons do share the tab row) but **its own stated reason is wrong**: it says collapsing
  frees no space, and collapsing does free space. The rewritten body says both halves plainly, so
  nobody reopens it and hands a developer a ticket that is half incorrect.
- **[SV-8847](https://shopview.atlassian.net/browse/SV-8847)** — still happens, except that the
  one part about clearing filters clearing the search now behaves correctly.

## Images

**Every existing picture and recording was carried into the new body verbatim** — the original
reference was lifted out of the old description rather than rebuilt, which is the method that
proved safest today. Two tickets needed it, and both came back byte-identical:

| Ticket | Carried forward |
|---|---|
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | 2 pictures, both still shown in the body, references byte-identical |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | 1 picture and 1 screen recording, both still shown, references byte-identical |

The writer **refuses to write a ticket at all** if the new body would not carry every picture the
old one referenced. After each write the attachment list was re-read and compared by id. Full
audit across all 92 tickets: [`../attachment-audit/ATTACHMENT-VERIFICATION.md`](../attachment-audit/ATTACHMENT-VERIFICATION.md).

## Sources

Every requirement quoted was read from the **live** Confluence page, and the versions were
re-checked immediately before the writes began (Standing Rule 59): **Filters version 19**,
**Schedule version 25**, **Parts Velocity version 5** — none had moved since the morning's fetch.
Evidence in [`snapshots/source-currency.json`](snapshots/source-currency.json).

**Two of the eight have no documented source, and their bodies say so plainly** rather than
inventing one — see [`SOURCE-PROBLEMS.md`](SOURCE-PROBLEMS.md).

## How to re-run

```
python3 tools/currency.py                 # re-check the live spec versions first
python3 tools/rewrite.py --dry-run        # prints every body, writes nothing
python3 tools/rewrite.py --write          # 8 writes, byte-verified, stops on any mismatch
```
