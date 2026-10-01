# HANDOFF → RUN SESSION — Part Sales QA Additions (Mudassir) · 43 cases
### Execute on QA branch **sv9667.qa.shopview.com** (build `v26.39.2-210868d`), record results. 2026-10-01.

**You are the run session.** All 43 (TestRail group **20481 "Part Sales — QA Additions (Mudassir)"**, under
Founder Mode 20434) are build-verified on sv9667. Each is runnable, renders `fr-view`, stamped
*"Last checked against build v26.39.2-210868d on 10/1/2026."* **38 are AUTOMATION: READY · 5 are HOLD (customer
portal, staging-only — see §PORTAL).** Mark Passed / Failed / Blocked.

- **Scope:** 43 cases, **created_by=6 (Mudassir Qamar)** — the designated manual QA tester (Rule 38, in-scope).
  Sections: S9 deposit audit log (20482, SV-9867) · S10 portal deposit (20483, SV-10261) · XC cross-cutting (20484).
- **Env:** QA branch sv9667.qa.shopview.com / sv9667api. Disposable (Rule 6/107). Access: 3 cookies →
  /tmp/cln/sv9667-cookies.json (ask QA lead for fresh set). Boot `qa-branch-boot.mjs sv9667 <route> admin`.

## Glossary confirmed on the build (Create Deposit dialog)
Finance tab → **"Add Deposit"** opens the **"Create Deposit"** dialog: "Deposit Date" (pre-filled today) ·
"Payment Method" · "Deposit Amount" · "Reference Number" · "Memo" (pre-filled "Deposit for Part Sale P-###") ·
"Cancel" · **"Collect In Portal"** (disabled unless portal handoff) · **"Record Deposit"**.

## §PORTAL — 5 cases HELD (customer portal only exists on staging, cannot run on the QA branch)
C154849 · C154862 · C154864 · C154869 · C154870 — these require completing a payment / operating a screen IN the
Customer Portal. Marker: "HOLD - customer portal only exists on staging; this case cannot run on the QA branch".
The other S10 cases (inspect the "Collect In Portal" button state / tooltip / refusal on the shop app) ARE testable
on the branch and are READY.

## 🔎 Confirm LIVE when you run (entry points confirmed; these screens were not raisable via automation)
- QuickBooks settings "Automatically Apply Credits" / "Automatically Apply Payments" / "Deposit sync enabled"
  (preconditions) · the Part Sale Log / deposit audit entries ("Deposit received"/"Deposit applied"/"Delete
  Deposit") · the "Access restricted" permission-gate message (log out/in after deploy for the new Part Sale Log
  permission). The Create Deposit dialog and the Part Sales document ARE confirmed.

## Run + result writes — needs the QA lead's go-ahead (Rule 6)
No manual run exists. Ask the QA lead to authorise a run over these 43, then record with push_results_to_run.py.

## The 43 cases
| C-id | Section | Title | Marker |
|---|---|---|---|
| C154841 | S9 | Recording a deposit on a service work order writes "De | READY |
| C154842 | S9 | A backdated deposit entry also shows the Deposit date | READY |
| C154843 | S9 | Invoicing the work order writes "Deposit applied" with | READY |
| C154844 | S9 | Reversing the payment that used the deposit writes "De | READY |
| C154845 | S9 | Reversing (deleting) a held deposit writes "Deposit re | READY |
| C154846 | S9 | Applying a deposit through Receive Payment writes "Dep | READY |
| C154847 | S9 | An IBS batch payment using the deposit writes applied, | READY |
| C154848 | S9 | A part sale writes the same four deposit entries, read | READY |
| C154849 | S9 | A Customer Portal deposit is attributed to the Custome | HOLD (staging-only/portal) |
| C154850 | S9 | A retried Customer Portal request does not duplicate t | READY |
| C154851 | S9 | A Customer Portal refund writes "Deposit reversed" wit | READY |
| C154852 | S9 | A general customer deposit applied to a work order inv | READY |
| C154853 | S9 | Deposits taken before this build have no entries (no b | READY |
| C154854 | S9 | Recording a deposit still moves the same money as befo | READY |
| C154855 | S9 | Invoicing and Receive Payment still move the same mone | READY |
| C154856 | S9 | Reversals still move the same money as before the buil | READY |
| C154857 | S9 | Deposits appear in the Financial Info card Payments fi | READY |
| C154858 | S9 | A mixed multi-work-order payment names the deposit own | READY |
| C154859 | S9 | Deposit entries never show up on another work order or | READY |
| C154860 | S9 | A stale session gets "Access restricted" on the Part S | READY |
| C154861 | S9 | Automated case C146394 passes on this build | READY |
| C154862 | S10 | No card is ever charged when Core would refuse the dep | HOLD (staging-only/portal) |
| C154863 | S10 | A part sale at Estimate, Approved or Complete returns  | READY |
| C154864 | S10 | A portal checkout completes and the deposit lands on t | HOLD (staging-only/portal) |
| C154865 | S10 | A service work order at Complete is still refused | READY |
| C154866 | S10 | An invoiced or paid part sale is still refused by the  | READY |
| C154867 | S10 | Every other refusal reason still fires in the same ord | READY |
| C154868 | S10 | A part-sale deposit syncs to QuickBooks on BOTH the Sa | READY |
| C154869 | S10 | The portal Deposits page lists a part-sale deposit and | HOLD (staging-only/portal) |
| C154870 | S10 | Portal deposit screens call a part sale a part sale | HOLD (staging-only/portal) |
| C154871 | XC | Permission matrix: what each role sees versus what the | READY |
| C154872 | XC | A vendor-permission user can Return Core without the p | READY |
| C154873 | XC | Nothing a role could do before the release is refused  | READY |
| C154874 | XC | End to end on a post-cutoff sale: quote, deposit, rece | READY |
| C154875 | XC | End to end on a pre-cutoff sale: the quoted total neve | READY |
| C154876 | XC | No release cutoff configured means no sale charges its | READY |
| C154877 | XC | Every new control stays usable at tablet width | READY |
| C154878 | XC | Document, Financial Info card and Stats tab agree to t | READY |
| C154879 | XC | Returning a core and recording a deposit at the same m | READY |
| C154880 | XC | A part sale whose lines are all declined keeps its dep | READY |
| C154881 | XC | Credit limit and credit hold are unaffected by chargin | READY |
| C154882 | XC | Service work order regression pack: nothing on a work  | READY |
| C154883 | XC | Spec discrepancies to raise with the PRD owner (record | READY |

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | QA lead go-ahead to create the manual run over these 43, then record Passed/Failed/Blocked. |
| 2 | The 5 portal cases are HELD (staging-only) — do not run on the QA branch; run them on staging. |
| 3 | Confirm the QuickBooks settings, Part Sale Log entries, and "Access restricted" gate live. |

**Standing holds:** no Jira/external artefact without the QA lead; run creation + result writes need his go-ahead
(Rule 6); Mudassir's cases are in-scope but never change a case flagged Automated without him (none here); secrets
never committed; QA branch disposable.
