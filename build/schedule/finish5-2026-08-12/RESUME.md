# Schedule finish5 — resume point, 2026-08-12

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag
`3250d285ffcf50626363a578fe273071` · **re-read at 10:33Z this pass and unmoved.**
Location **`Staging Heavy Duty - 9919`** unless a case names another.

## THE FIVE THIS PASS WAS GIVEN

| Case | State |
|---|---|
| **C38875** | **WALKED** — foreign shift seeded at Lethbridge, 404 confirmed, PATCH controlled |
| **C38863** | **WALKED** — both guards driven; 409 warn→acknowledge→201, 422 refuse |
| **C38865** | **WALKED** — 59-shift series across 1 Nov; local 07:00 both sides |
| **C29986** | in progress |
| **C30615** | in progress |

## DO NOT TOUCH

**C29971, C30080, C30083, C38870** — each needs a role / staff / settings change, awaiting the
QA lead's go-ahead. **No role definition, staff record or setting is edited by this pass.**

## SESSION

Administrator, alive. Cookie header `/tmp/qa-cookies/sched-hdr.txt`, mode 600, **never written
into the repository**. `/tmp` is empty after a container restart — rewrite it from the task.

## RE-RUN RECIPE

```
cd build/schedule/finish5-2026-08-12/tools
python3 c38875.py        # seeds a Lethbridge shift, then drives the cross-location case
python3 c38863_65.py     # the >120 and 8-week guards, and the DST series
python3 write.py         # DRY RUN by default; --go executes
```

## CARRIED FORWARD — things that cost earlier passes time

- **Deleting a shift from the detail modal asks NOTHING** for a non-series shift. Two passes have
  destroyed a shift by pressing Delete expecting a confirmation. **This pass presses no destructive
  control at all.**
- **The board endpoint refuses a range over 62 days** — page it.
- **The grid is taller than the viewport**; scroll a block into view and re-read its rect.
- **Hover before declaring a control absent** (`fc-event-resizer` only exists at the block edge).
- The scheduling API needs **`total_minutes`**, and **`start_date` must be a LOCAL date**.
- **`acknowledgeLongSeries` is camelCase** where every other field on that payload is snake_case.
