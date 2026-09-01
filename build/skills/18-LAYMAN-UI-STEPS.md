# 18 · LAYMAN UI STEPS — a manual tester must be able to follow every case from the screen alone

**Standing requirement, QA lead 2026-08-31, verbatim:**
> *"make sure that all the tests which you have build verified have got the Steps or reproduction and
> preconditions which a lay many and a manual tester can easily follow from the UI"*
> *"steps of reproduction/preconditions should be from the UI preferably so that the Manual QA tester
> Victoria can easily follow the steps of replication and set the preconditions from the UI. Those
> steps of replication and preconditions should be super easier for a lay man to follow"*

Named testers so far: **Victoria** (new suites, sv9315) · **Mudassir Qamar** (Invoice UI Refresh).

## 🛑 SCOPE — UNIVERSAL (QA lead, 2026-08-31, reaffirmed)
**This applies to EVERY case in EVERY suite — not only build-verified ones.** No case may ship with a
spec-level precondition or step. Verbatim: *"Make sure that NO test case has the spec level preconditions
and steps of replication — they should always be Runnable by the manual QA in the build."* A source-only
(Rule-85) suite is NOT exempt: draft the route from the **design/spec**, mark it PROVISIONAL until the
build confirms exact labels/filters, and NEVER invent an unreachable path or state (the hard line below).
On a no-build suite the EXPECTED results still come only from the documents (Rule 57); it is the
PRECONDITIONS/STEPS route that is drafted-from-design and confirmed at build time.

## THE RULE

**A case is not tester-ready until a person who has never seen the feature can open the right screen
and reach the right state using only the case text.** "Generate the Invoice" is not a step — it is a
summary of one. The tester needs the clicks.

**Every case that inspects a document, a screen or a dialog carries, in its PRECONDITIONS, the route
to get there, written as UI clicks in the build's own words.** Nothing else changes: the STEPS still
describe the check, and the EXPECTED RESULTS still come from the documents, never the build (Rule 57).

### What "followable from the UI" means, concretely

| ❌ Not followable | ✅ Followable |
|---|---|
| "Generate the Invoice." | "Click **Work Orders** in the top menu. Open the work order. Click the **Finance** tab — the document appears on screen." |
| "Enable the Show declined work option." | "…and if the option is not on that dialog, say so and stop — do not use an API call to reach a state a tester cannot reach." |
| "POST /api/work-orders/{wo}/authorizer" | Name the real route AND the screen: "Open the work order, click the **Authorizer** row in the customer card…" — API-only steps belong to API-titled cases (Rule 4). |
| "Reach a credit in Partially applied status." | "Customers → open the customer → **Invoices** tab → the credit's row → the print icon (tooltip *Print credit memo*)." |

### The five things a route must state

1. **The entry point** — the top-menu item or screen name, exactly as it is labelled.
2. **The record to open**, and how you know you have the right one.
3. **The tab or panel** to click.
4. **Where the thing appears** once you are there.
5. **Any filter or setting that hides it** — a default-on filter that hides the row is the difference
   between "not there" and "not found". *(Worked example: a fully-applied credit memo is hidden by the
   **Open only** chip, which defaults to on; a credit issued at another location does not appear at
   all because the list is workplace-scoped.)*

## 🛑 THE LINE THIS RULE MUST NOT CROSS

**Making a step followable must never make an unreachable state reachable on paper.** If the UI has
no control for the state the case needs, the case is **NOT AVAILABLE ON BUILD** (Rule 69) — it does
not get a step that quietly substitutes an API call.

Worked example, 2026-08-31: `includeDeclined=1` on the render endpoint produces the declined-work
document, but the **"Show declined work" toggle does not exist in the Invoice Details dialog**.
Rewriting C44937–C44939 to use the API parameter would have made three cases "pass" and **deleted the
finding that an operator cannot reach that state at all**. They were left unverified on purpose. Skill
03 §8.1 is the authority: rewriting a substantive gap into a runnable step deletes the finding.

## THE ROUTES, AS OBSERVED ON THE BUILD (sv8218, v26.35.5-8c3cc21, 2026-08-31)

Re-observe these per environment before reusing them — they are facts about a build, not law.

**A work order's Estimate or Invoice**
1. Click **Work Orders** in the top menu.
2. Open the work order (click its row in the list).
3. Click the **Finance** tab. The document appears on screen.
4. Use the **Estimate/Invoice** toggle above the document to switch between the two.
5. The printer icon prints it and the download icon saves it; the cog icon opens the invoice display
   settings (Labor rate, Labor hours, Labor price, Summarize labor total, Summarize parts total,
   Part number, Part description).

**A Parts Sale Estimate or Invoice** — **Customers** → open the customer → **Part Sales** tab → open
the part sale → **Finance** tab.

**A Credit Invoice** — **Customers** → open the customer → **Invoices** tab → the credit's row (its
number, e.g. `CM-100`, sits in the **Invoice #** column among ordinary invoice numbers) → the print
icon at the right of that row, tooltip **Print credit memo**. Your active location must be the one the
credit was issued at, and **Open only** must be off for a fully applied or refunded credit.

**The Authorizer** — open the work order; the **Authorizer** row is in the customer card on the left,
below **Contact** and **Phone**. The list offers only contacts with **Approves Work** ticked on their
contact record (**Customers** → customer → **Contacts** tab → edit a contact).

## HOW THIS IS CHECKED

`build/testing-tools/check_layman_steps.py` — flags any case whose preconditions and steps contain no
UI route (no screen name, no tab, no click). Run it before any handover; pair it with the
served-page render check (skill 04 §4.5), because a case can be perfectly worded and still unreadable
on screen.
