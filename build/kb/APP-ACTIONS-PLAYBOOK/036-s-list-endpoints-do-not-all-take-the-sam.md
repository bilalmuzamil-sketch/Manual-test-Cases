## §S — LIST ENDPOINTS DO NOT ALL TAKE THE SAME PAGING PARAMETERS, AND THE WRONG ONE IS SILENT (measured live 2026-09-01, sv9315 `v26.35.6-598cc8a`)

**This produced a false "the data state does not exist" that was one message away from being handed
to the QA lead as a blocker.** Three list endpoints, three different paging shapes, and none of them
errors on a parameter it does not understand — it just returns the first page:

| Endpoint | What actually works | What is SILENTLY IGNORED | What it cost |
|---|---|---|---|
| `GET /api/inventory/parts` | **`pagination[rowsPerPage]` and `pagination[page]`** — the shape the SPA's own `parts/fetchInventory` sends | `limit`, `rowsPerPage`, `page`, `per_page` | Read **100 of 6,879** parts and concluded that no part was held in more than one bin. **Nine test cases were written up as blocked on a data state that was there all along** — including a part in **four** bins (`S31S-950`), one with an already-negative bin (`TP-12-1013-CH`) and one with no prices (`6050-P`). |
| `GET /api/work-orders` | `limit` + `page` | — but **the cursor wraps**: page 30 returns page 1's rows again, so a naive loop "found" 3,000 work orders that were 500 repeated six times | A status survey with a six-times-inflated denominator |
| `GET /api/work-orders/part/list-requests` | nothing useful | **every** filter — `work_order_id`, `workOrderId`, `work_order`, `filter[work_order_id]` all return the same first 100 rows from across the estate | Two probes matched nothing and silently tested nothing. **Filter client-side on `work_order_id`.** |

**THE RULE: before concluding that a record or a data state does not exist, PROVE THE PAGING WORKED.**
Three checks, one minute:

1. **Read the SPA's own call.** `grep` the bundle for the action name (`fetchInventory`,
   `fetchWorkOrders`) and copy the parameter shape it sends. The client is the specification.
2. **Compare the response's own `pagination` block with what you asked for.** Asking
   `rowsPerPage=500` and being told `"rowsPerPage": 100` is the endpoint telling you it ignored you.
3. **De-duplicate by id and stop when a page adds nothing new.** Never trust a `total`, and never
   assume page N+1 differs from page N.

**And the honesty consequence:** *"this data state does not exist on the branch"* is a claim about the
branch and needs the same standard as any other finding (Rule 12). **Say how much of the set you
actually read** — "100 of 6,879" and "6,879 of 6,879" are different sentences.

