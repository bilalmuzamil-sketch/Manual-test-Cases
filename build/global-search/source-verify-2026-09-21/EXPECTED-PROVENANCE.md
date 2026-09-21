# Were the ORIGINAL Expecteds of C55736 and C55737 taken from the sources? — 21 September 2026

The QA lead asked the right question, and the answer overturns what I told him an hour earlier.

## What I had checked, and what I had missed
I checked the **PRD only** (page 576978945 v17) and found:

* one sentence about permissions, §9: *"All result fields must respect existing tenant-isolation and
  role-based-access checks — a technician without Parts access does not see Parts results, and the same
  applies to Purchase Orders and Vendor Invoices…"*
* §4's Parts display list: *"description (primary), part number, quantity on hand badge, bin location"* —
  **no price**

From that alone I concluded C55736's original Expected contradicted the source. **I had not read the
epic's stories, which Rule 57 lists as a source in their own right.**

## What the story actually says — SV-9309, a child of epic SV-9160
*"Verify Phase 3 — /api/search matching, ranking, permissions, recents"*, three of its checklist lines:

> 🔴 Per-bundle section gating: **hidden groups leak neither rows nor counts**; tabs absent; TimeClock role → empty result

> 🔴 **Pricing-blind user gets masked prices in every row type (part prices, PS/WO/PO/VI totals)**

> Recents: … deleted or **permission-lost entities never returned** …

## The answer, case by case

| Case | Was the ORIGINAL Expected from the sources? |
|---|---|
| **C55736** | **YES.** *"Pricing-blind user gets masked prices in every row type (part prices …)"* is exactly what it asserted — including on a **part** row. My "it contradicts §4, so the case is the defect" reasoning was **wrong**: §4 lists what the PRD says a row displays, the story states what a pricing-blind user must not see, and where two sources differ that is a **finding to raise** (Rules 57/32), never a licence to re-point the check. |
| **C55737** | **PARTLY.** The counts half — *"hidden groups leak neither rows nor counts"* — is source-backed. The **per-record** framing (a person who sees some records of a kind but not one particular record) is not in the PRD, not in this story, and not in any source I can find. |

**Both cases cite the wrong document.** Their provenance names *"section 9 — results, group counts and
scope tabs are all filtered by the user's permissions"*, a sentence that is **not in the PRD**. The
substance turns out to be real; it lives in the story, and was cited to the specification instead.

## The consequence, and it is the worst kind
C55736's original Expected was **correct and the build fails it**: a Parts row displays no price to
anyone, so a permitted user cannot see one and a pricing-blind user has nothing to be masked. By
re-pointing that check at a Vendor invoice row I **turned a check that was correctly failing a real
product gap into a check that passes.** That is precisely the harm Rule 114 exists to prevent, and it
happened because I checked one source and stopped.

**Not yet raised as a defect** — held under Rule 62, and reported to the QA lead first.

## Method note for next time
Rule 57's source list is **open-ended and plural**. Reading the PRD is not "checking the source". The
epic's stories are sources; a verification story's checklist can carry a requirement the PRD never
spells out. **Before calling any Expected unfounded, search every source type, and say which ones were
searched** (Rule 104's instrument proof, applied to documents).
