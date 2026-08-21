# Simple v2 — line actions spec

## Precedence

When two files disagree, the higher one wins:

1. `line-part-cascade-verified.md` — verified against the backend source
2. `claude-design-spec-line-actions.md` — action availability, counting, predicates
3. `bulk-bar-button-priority.md` — slot order, labels, worked scenarios
4. `line-status-action-matrix.md` — background, state machine, known bugs
5. `matrix-a-settings.csv` — settings × behaviour, for PM review

## What each file answers

| File | Question |
|---|---|
| `line-part-cascade-verified.md` | Which transitions are legal, what they do to parts, what blocks them |
| `claude-design-spec-line-actions.md` | Does this button exist for this selection |
| `bulk-bar-button-priority.md` | Where does it sit and what is it called |
| `fix-prompt.txt` | Paste-ready instruction for the current prototype gaps |

## Unresolved — do not invent an answer

1. Bulk receive when the selected parts span more than one vendor. A single vendor
   invoice number cannot cover several vendors.
2. Whether `declined`, `hold` and `imported` work orders are editable, or read-only
   like `invoiced` and `paid`.
3. Whether Delete is allowed on a Complete line.
4. When Complete is disabled because of parts, should the unblocking parts action take
   slot 2 ahead of Decline.
5. Single-line complete and work-order complete enforce different parts rules today.
   See `line-part-cascade-verified.md` section 6.
