# DRAFT — held for the QA lead's per-ticket go-ahead (Rule 62 / 113)

**Type** `Story Defect` · **Parent** the owning story · **Priority** `Medium` · also link the owning
story *relates to*.

**Owning story — RESOLVED, and it passes the gate.** `SV-9165` — *BE — Ranking engine: per-entity scoring, cross-entity ordering and contextual bias* — read live
from Jira on 17 September 2026: **Ready for QA**. Rule 112 is satisfied, so a defect may be
raised against it once the go-ahead comes. Set `parent` = `SV-9165` and also link it *relates to*.

**Sources section — BLOCKED ON A SOURCE READ** (Rule 106), same as the other held report.

**Picture:** `C44854-contextual-bias.png` in this folder. Alt text must stay comma-free.

**Re-measured at drafting time (Rule 6e), 17 September 2026, build `v26.36.7-29ca209`:** still
reproduces. The part is visible on the job's own page, and the parts results are in the identical
order from the job page and from an unrelated page.

---

## Title

`Parts Already on a Job Are Not Pushed Down When Searching From That Job`

## Wiki markup body (for `PUT /rest/api/2/issue/<KEY>` via jira.sh)

```
h2. Description

When a person searches for parts while standing on a job, the parts that are *already on that job* should be pushed down the list, because the person is almost always looking for something they have not added yet. The search does not do this - where you are standing makes no difference to the order at all.

For example, on job {{S9160-17671}} the part *ZZAUTOTEST Fibridge Brake Shoe Kit* is already on the job:

* searching for parts *from that job's own page* still returns it *first*, and
* searching from an unrelated page returns *exactly the same order*.

h2. Steps to Reproduce

# Open work order {{S9160-17671}} and look at its *Parts* section.
#* *ZZAUTOTEST Fibridge Brake Shoe Kit* is already on the job.
# Staying on that job's page, press {{Ctrl}} + {{K}}, type {{ZZAUTOTEST Fibridge}} and click the *Parts* tab.
#* The list reads: 1. Brake Shoe Kit, 2. Wheel Seal, 3. Air Dryer Cartridge.
#* The part already on the job is *first*, above the two that are not on it.
# Close the search, go to *Customers*, and run the same search from there.
#* The list reads the same: 1. Brake Shoe Kit, 2. Wheel Seal, 3. Air Dryer Cartridge.

!C44854-contextual-bias.png|width=760!

*Actual Result* - a part already on the job is returned first when searching from that job, and the order does not change no matter which page the search is run from.

*Expected Result* - parts already on the job are pushed below the parts that are not, and parts sharing a category with what is already on the job are lifted slightly above unrelated ones.

h2. Environment

QA branch [sv9160|https://sv9160.qa.shopview.com/workorders], build {{v26.36.7-29ca209}}, observed 17 September 2026.

h2. Sources

TO BE COMPLETED - the specification's own wording, quoted verbatim, with its page id and the date it was read. Not yet authorised.
```

## How the state was built (not for the ticket)

The part was put on the job through the product's own services: a line was created from a canned
line, then the part was requested onto that line. The first attempt was refused and the refusal
named the missing field, which is what pointed at the right one. It was then read back on the job
page before anything was measured.

**The second half of the case is untested.** It also asks that parts sharing a category with the
job's existing parts get a small lift over unrelated ones. Since no contextual effect is applied at
all, that half cannot be distinguished from the first; it is covered by the same finding, and the
ticket does not claim it separately.
