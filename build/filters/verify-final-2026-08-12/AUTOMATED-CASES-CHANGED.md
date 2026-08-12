# Filters — automated cases changed, verify-final, 2026-08-12

## NONE.

**0 cases were changed by this pass**, so no case the automation engineer has already automated was
touched, and no `AUTOMATION` marker moved.

For the record, the marker census as this pass found it and leaves it — read live 2026-08-12, all
115, no sampling:

| Marker | cases |
|---|---|
| `AUTOMATION: READY` | **90** |
| `AUTOMATION: READY - EXPECT FAIL` | **7** |
| `AUTOMATION: HOLD` | **18** |
| **total** | **115** |

**The arithmetic gate passes both ways: 90 + 7 = 97, and 115 − 18 = 97.**

Per-case detail: `evidence/case-census-2026-08-12.json`.

## The one thing the automation engineer should know from this session

**Nothing changed, so nothing he has automated needs re-reading.** The suite he last saw is the suite
that is there now.

**And a caution for whoever writes next:** `custom_atmstatus` was set by hand by another author on
**C29600, C29614, C29623 and C38877**. It is his flag, not ours — never send that field on a payload.
