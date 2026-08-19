# Filters build-verify 2026-08-19 — AUTOMATED cases HELD (Rule 71)

**5 of our cases carry `custom_atmstatus = 3` (Automated).** Per Standing Rule 71 they were
**verified live but NOT written** — the intended change is recorded here for the QA lead's ask-first
ratification and Vlad's (Vladimir Tomovic, id 1) hand-off. **0 writes to these 5.**

Build: **v3.8-d0e135e** (last-mod Wed 19 Aug 2026 13:27:07 GMT). All observed live as admin.

| C-id | Section | Live verification (v3.8) | Current marker | Intended change |
|---|---|---|---|---|
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Status Filter | **PASS** — selecting **Imported** greys out the Assigned to me + Asset on Site chips (both `disabled`, opacity 0.7); URL `?status=imported`. | `READY` | Refresh Rule-54 build sentence to v3.8 / 8-19 (marker already READY). |
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Active Chips | **PASS** — Status + Asset on Site combine (AND): `filters[0]=status:estimate & filters[1]=vehicleHere:1` → HTTP 200, intersection returned. | `Not available on Build to test Yet` | **Lift → `AUTOMATION: READY`** + build sentence. |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Persistence | **PASS (present)** — filter state persists across reload; per-user (admin ≠ tech distinct sessions). "Permanently, even after closing the browser" rests on the saved-filters/user-pref service (URL + server-side per user). | `READY` | Refresh build sentence to v3.8 / 8-19. |
| [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | URL State | **PASS** — opening the shared URL `?status=estimate` in a fresh page loads with the filter applied and the chip showing "Status: Estimate". | `READY` | Refresh build sentence to v3.8 / 8-19. |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Mobile | **PASS** — on a phone (390×844) the Status sheet is a fullscreen dimmed bottom sheet; ticking Estimate does NOT change the URL until "Apply filters" is tapped (deferred apply). | `Not available on Build to test Yet` | **Lift → `AUTOMATION: READY`** + build sentence. |

**Recommended to the QA lead:** authorise these 5 edits (all their features are present and passing on
v3.8); on approval, lift C29600 + C29623 to `READY`, refresh the build sentence on all 5, and hand
their case numbers to Vlad via `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`
(Rule 71 / 65). **Nothing was written to these cases this pass.**
