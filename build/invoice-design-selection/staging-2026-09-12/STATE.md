# Invoice Design Selection — the three customer-portal cases on Staging

Run 446 · https://shopview.testrail.io/index.php?/runs/view/446
Worked 12 September 2026. Run now stands at **43 passed · 0 failed · 2 blocked**.

## Where each case stands

| Case | Link | Verdict | Why |
|---|---|---|---|
| C53569 Standalone portal Payment Receipt is unaffected by the setting | https://shopview.testrail.io/index.php?/cases/view/53569 · test https://shopview.testrail.io/index.php?/tests/view/2924654 | **Passed** | Receipt identical under both settings (same wording, same amounts, same page size 42,657) while a control invoice opened in the same pass DID change. 0 guard discards. |
| C53566 Customer portal on-screen and PDF render the current setting | https://shopview.testrail.io/index.php?/cases/view/53566 · test https://shopview.testrail.io/index.php?/tests/view/2924651 | **Blocked — half proven** | On screen: proven. Legacy = sentence-case headings, 246,382 chars; Modern = capitalised headings, 372,586 chars; same invoice `INV-S2-32981`; money set-difference empty both ways. The PDF half was not captured before the Staging session expired. |
| C53567 Paid banner appears only on portal Invoice PDF | https://shopview.testrail.io/index.php?/cases/view/53567 · test https://shopview.testrail.io/index.php?/tests/view/2924652 | **Blocked — nothing claimed** | `#portal-paid-invoice-summary` was absent on screen under both settings, which is what the case expects on screen and says nothing about the PDF. The PDF is the whole subject and was not captured. |

## The one thing that is needed

A fresh Staging `sv_sso_session` (plus `cf_clearance`). The one handed over on 11 September stopped
working mid-pass on 12 September at about 11:15 UTC. Proved through the gate:
`evidence/BLOCKER-CLAIM-staging-session.json` (`blocker_gate.py --check` → 7 of 7, exit 0).
Per the QA lead's 2026-09-03 ruling this is per-need and on him; there is no Staging password and the
password route is closed. The DEV-MODE quick-login panel was re-tested from a cold jar and is not a
way in (`evidence/S17-cold-jar-redirects-to-google.png`).

**What it does NOT block (Rule 68):** nothing else in run 446 — the other 43 cases are done. It blocks
only the PDF halves of C53566 and C53567.

## How to finish it, in one window

`S15_pdf.mjs` is written and ready; it needs only a live cookie file at `/tmp/qa-cookies/staging-full.json`.
It sets each design in turn (verified, 3 attempts), and for the paid invoice, an UNPAID invoice
(positive control) and a payment receipt it captures `document.title`, the print-media text, a real
Chromium PDF and the extracted PDF text — every reading guarded by a stored-setting read before and
after. It restores the setting it found. Run it, then read `evidence/S15.json`.

Probes kept: `S13_controls.mjs` (enumerate every control on a portal page, no exclusions),
`S16_routes.mjs` / `S17_devmode.mjs` (the access probes), `S9_run.mjs` (the on-screen pass that passed
C53569).

## Left behind on Staging

The Invoice Design setting was found on **Legacy** and was put back on **Legacy**. Nothing was seeded.
