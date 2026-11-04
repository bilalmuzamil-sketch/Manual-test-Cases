# What/Why — stamp C154710 and C839513 on staging (4 Nov 2026)

QA lead, 4 Nov 2026: "1. (a)" — stamp the two New Line tests (rewritten by the test-writing session at 04:33 UTC for Chris's answer 15)
against today's staging. Earlier check: 28 Oct 2026 on v26.43.1-f2d183d (`../build-verify-staging-2026-10-28/README.md`).

- Staging `v26.45.0-440aa25`, quick-login Admin (59 permissions).
- p01: New Line window, top to bottom: AI SHOPCOACH LINE BUILDER · Title (placeholder "What are you doing?") · Description ("Why are you
  doing it?") · Technicians / Add Technician · Labor Rate · Estimated Time · Tech Time · Line Approved · Save & Add Part · Save & Add Line ·
  Save & Close. Canned lines offered on typing (for example "Replace - Brake pot"). Create Work Order (Customer, Add Asset, Save). The
  throwaway work order was deleted afterwards (Confirmation "Are you sure you want to delete this work order?" → Delete).
- p02: Settings (profile menu) → Settings → Work Orders tab → "Require Approval for New Lines" (on) · Save Settings; Canned Lines under
  SERVICE in the left menu. Note: the second sign-in landed at Staging Lethbridge - 4310; the tests already say to check the location.
- `apply.py`: build line `Last checked against build v26.45.0-440aa25 (staging) on 11/4/2026.` added before the marker; expected results
  otherwise untouched. Read back OK; tester-runnable PASS; runnable 2/2; display 2/2 (`served-2.json`).
