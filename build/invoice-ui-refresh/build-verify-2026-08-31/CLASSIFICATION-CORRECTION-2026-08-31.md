# Correction — which cases need what (C44937–C44939 vs C44913/C44916)

**QA lead, 2026-08-31: *"Put them where it is accurate."*** Established from the LIVE case bodies,
not from either session's summary.

## The accurate grouping

| Group | Cases | What the precondition actually requires |
|---|---|---|
| **Declined Work — needs the `"Show declined work"` option** | **C44937 · C44938 · C44939** (3) | All three sit in the **Declined Work** section and all three name the `"Show declined work"` option in their preconditions. |
| **Order Reference Fields — needs an integrated-billing `Approval Code`** | **C44913 · C44916** (2) | Both sit in **Order Reference Fields**; C44916 is *"Approval Code field shows the integrated-billing approval code"*, C44913 needs an approval code among the reference fields it checks. |

**A cross-session note grouped C44938 and C44939 with the IBS Approval Code cases. That is wrong** —
their absent label is `Show declined work`, and neither mentions an approval code. Getting this right
matters practically: it is **2 cases** that need an IBS approval code probed, not 4, and **3** that
wait on the declined-work toggle, not 1.

## Why the three Declined Work cases stay unverified — deliberately

The document state they need **is** reachable: `GET /api/invoices/preview?…&includeDeclined=1`
renders the Declined Work section (verified live — the same invoice goes from 4,366 to 5,256 visible
characters and the label `Declined Work` appears), and `includeDeclined=0` gives the "option off"
state C44939 needs. So checks 1–4 are satisfiable.

**What is genuinely absent is the operator control** — `"Show declined work"` is not in the Invoice
Details dialog. Confirmed with a positive control firing in the same read: `Labor rate`,
`Labor hours`, `Labor price`, `Summarize labor total`, `Summarize parts total`, `Part number` and
`Part description` were all FOUND in that dialog, and `Show declined work` was not.

**I could make these three pass by rewriting their preconditions to say "a document generated with
declined work included". I am deliberately not doing that.** Skill 03 is explicit that rewriting a
substantive gap into a runnable step **deletes the finding**, and the finding here is real: an
operator cannot reach this state from the UI. The cases keep their documented expectation
(**Rule 57**), keep the **NOT AVAILABLE ON BUILD** marker (**Rule 69**), and stay excluded from the
ready-to-automate figure. Verdict **PROVISIONAL** (Rule 49) — Story 6 is **SV-9145, In Progress**.

Re-check when SV-9145 closes. If the toggle ships, all three should verify immediately.

## C44942 is a cleaner case of the same shape

`"Show % on Estimates and Invoices"` (Story 7, **SV-9146**, In Progress). Unlike declined work there
is **no backend capability either** — no percent-on-documents field was found anywhere in the source
by the session that read it. Same handling, same reason.
