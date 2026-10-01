# OBSERVED UI LABELS — Part Sales DEPOSITS (Mudassir QA additions) · sv9667 v26.39.2-210868d · 2026-10-01
# Evidence: mudassir-qa-additions-2026-10-01/

## Add Deposit → "Create Deposit" dialog  (Finance tab → "Add Deposit")  — Evidence: add-deposit-open.png
Dialog title: **"Create Deposit"**. Fields: "Deposit Date" (pre-filled today) · "Payment Method" (dropdown) ·
"Deposit Amount" · "Reference Number" · "Memo" (pre-filled "Deposit for Part Sale P-147").
Actions: "Cancel" · **"Collect In Portal"** (disabled unless portal handoff enabled) · **"Record Deposit"**.
# Alignment for cases: button is "Add Deposit"; dialog title "Create Deposit"; "Deposit Amount" (not just
#   "Amount"), "Reference Number" (not "Reference"), "Payment Method" (not "method"). Build shows "Collect In
#   Portal" (capital I) — cases write "Collect in Portal".

## STAGING-ONLY (14 cases, S10 Portal deposit) — cannot run on a QA branch
These reference the Customer Portal / ShopPay / "Collect In Portal" completion → marker:
"AUTOMATION: HOLD - customer portal only exists on staging; this case cannot run on the QA branch" (not READY).

## STILL TO OBSERVE
# QuickBooks settings "Automatically Apply Credits" / "Automatically Apply Payments" / "Deposit sync enabled"
# (17 cases as preconditions) · Part Sale Log (S9 audit: "Deposit received"/"Deposit applied"/"Delete Deposit",
# the new log permission) · "Access restricted" permission-gate message.
