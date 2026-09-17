# DRAFT — held for the QA lead's per-ticket go-ahead (Rule 62 / 113)

**Type** `Story Defect` · **Parent** the owning story · **Priority** `Medium` · also link the owning
story *relates to*. No Product Area on this type.

**Owning story — RESOLVED, and it passes the gate.** `SV-9170` — *FE — Entity result rows: shared base row, nine variants, badges and match highlighting* — read live
from Jira on 17 September 2026: **Ready for QA**. Rule 112 is satisfied, so a defect may be
raised against it once the go-ahead comes. Set `parent` = `SV-9170` and also link it *relates to*.

**Sources section — BLOCKED ON A SOURCE READ.** Rule 106 needs the specification's own wording
quoted verbatim, with its page id and the date it was read. That read has not been authorised. The
ticket must not be filed with a Sources section written from our own case text.

**Picture:** `C44838-status-colour.png` in this folder. Upload it first, then embed by filename;
options split on commas, so keep the alt text comma-free.

---

## Title

`Work Order Stage Colours Do Not Match Between the Search and the Work Orders List`

## Wiki markup body (for `PUT /rest/api/2/issue/<KEY>` via jira.sh — the MCP tools take markdown and cannot embed images)

```
h2. Description

A work order's stage must be shown in the same colour wherever the stage appears, so that a person reading a result recognises it without stopping to read the words. The search does not follow the Work Orders list.

For example, a job that is *In Progress*:

* is *green* on the Work Orders list, and
* is *orange* in the search.

The search also gives one single orange to four different stages - *Ready for Review*, *In Progress*, *Complete* and *Declined* - so a job that has been declined looks the same as a job that is finished. The Work Orders list does not do this: there, *In Progress* has its own colour and is easy to pick out.

h2. Steps to Reproduce

# Sign in and open *Work Orders*.
# Click *Search* on the Work Orders toolbar and type {{Fibridge Commercial}}.
#* Four jobs read *In Progress* and their stage is shown in green.
#* Three jobs below them read *Ready for Review* and their stage is orange.
# Press {{Ctrl}} + {{K}} to open the search, type {{Fibridge Commercial}}, and click the *Work orders* tab.
#* The same four jobs now read *In Progress* in orange, not green.
#* They are the same orange as the *Ready for Review* jobs directly above them.
# Scroll down the same list of results.
#* *Complete* and *Declined* jobs are that same orange as well.

!C44838-status-colour.png|width=760!

*Actual Result* - a job that is *In Progress* is green on the Work Orders list and orange in the search, and four different stages share one orange in the search.

*Expected Result* - a stage keeps the same colour everywhere it is shown, and stages a person needs to tell apart do not share one.

h2. Environment

QA branch [sv9160|https://sv9160.qa.shopview.com/workorders], build {{v26.36.7-29ca209}}, observed 17 September 2026.

h2. Sources

TO BE COMPLETED - the specification's own wording, quoted verbatim, with its page id and the date it was read. Not yet authorised.
```

## Measurements behind the wording (not for the ticket)

Read from the colours the product itself applies, both screens in one session.

| Stage | Work Orders list | Search |
|---|---|---|
| In Progress | green, background 217,251,208, text 81,102,62 | orange, background 255,250,235, text 181,71,8 |
| Ready for Review | orange, background 255,239,202, text 188,56,3 | orange, background 255,250,235 |
| Complete | orange, background 255,239,202 | orange, background 255,250,235 |
| Declined | not shown on any of the list's four views | orange, background 255,250,235 |
| Approved | green, background 224,242,241 | green, background 236,253,243 |
| Estimate | blue, background 229,237,255 | blue, background 233,245,255 |
| Invoiced | not shown | grey, background 238,242,246 |
| Paid | green, background 224,242,241 | not shown |

The remaining stages differ only by a shade a person would not notice; they are deliberately left
out of the ticket.
