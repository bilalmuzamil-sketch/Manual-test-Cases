# Schedule — divergences

## NONE FOUND THIS PASS, AND THE REASON IS NOT REASSURING

**Zero divergences are recorded, because zero cases were walked.** A divergence — cosmetic or
substantive — can only be found by comparing a case's text against the running application, and the
QA session returns **HTTP 401** (`BLOCKER-AUDIT.md` §0).

**This is an empty file by obligation, not by result.** It must not be read as *"the suite diverges
nowhere"*; it means **nobody looked**.

## THE TEST TO APPLY WHEN SOMEONE CAN LOOK

- **(a) COSMETIC** — a label, a step order, a navigation detail differs, but a reader of the source
  would recognise what the build offers as the same thing. **Correct the case and log it.**
- **(b) SUBSTANTIVE** — the route or state the source describes **does not exist**. **Raise it as a
  DIVERGENCE with both texts quoted and the C-ids. Do not rewrite the case.**

**The deciding question: would a reader of the source recognise what the build offers as the same
thing?**

## ⚠️ WHERE A DIVERGENCE IS LIKELY TO BE FOUND FIRST

**The thirteen "not in this build" cases (`BLOCKER-AUDIT.md` §3) are candidate SUBSTANTIVE
divergences already** — each asserts a control the specification requires (panel collapse **§5.3**,
the Unassigned row **§3.2**, the Priority filter **§5.1**, Tech Hours **§9**) and each was recorded
absent. **They have not been re-checked against the build now running**, so they are not yet
divergences of record — they are the first place to look.

## AND ONE DIVERGENCE THAT NEEDS NO SESSION AT ALL — IT IS INSIDE THE SPECIFICATION

Read live from Confluence 713031682 this pass, the spec contradicts itself on shop closures:

> **§4.5:** *"Shop closures and public holidays are **not** skipped in V1."*
>
> **§12:** *"Shop closures (holidays, inventory days) are defined at the shop level and **block the
> spread step** from placing shifts on those days."*

**Both sentences are in the current specification and they cannot both be true.**
[C30089](https://shopview.testrail.io/index.php?/cases/view/30089) follows **§4.5**.

This is a **defect in the document**, and under Rule 57 it is raised, never silently resolved. It is
already the substance of C30089's open product question — **which, per the case's own hold reason,
has never been sent.**
