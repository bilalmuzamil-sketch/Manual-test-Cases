# Questions for the product owner — Dashboard (Chris Ward), 28 Oct 2026

Each question can be answered with one word. The tickets behind DQ-1 and DQ-2 are already written and will be filed only after your answer.

| # | Project · feature | Question | Why we ask | If "Yes" | If "No" |
|---|---|---|---|---|---|
| DQ-1 | Dashboard · Technician Efficiency (and the Technician Efficiency report) | **When a customer declines a line, should that line's technician time still count in "Invoiced Tech Hrs" (and its clocked time in "Clocked")?** | Today it does. Example S1-38198: only line 1 was billed, yet the technician shows 2.00 Invoiced Tech Hrs and 133.33 %. The Billing Efficiency tile leaves the same declined line out. The PRD calls the figure "invoiced technician hours" but defines it as "technician time *recorded* on work order lines". | Working as intended — no ticket | We file TICKET-F2 |
| DQ-2 | Dashboard · Revenue (and the Sales report) | **Should a work-order discount lower Revenue?** | Today it does: $135.00 labor with a $20.00 discount counts as $115.00 (S1-38200). The PRD says "sum of invoice subtotals … before any discount", but the invoice's own Subtotal line is $115.00, so the sentence can be read both ways. | Working as intended — no ticket (and the PRD wording could say "after work-order discounts") | We file TICKET-F4 |
| DQ-3 | Dashboard · Revenue split | When credits or discounts make a share negative, is "Parts -28% · Labor 130% · Other -2%" the intended display? | It is arithmetically right (the three add to 100) but may confuse users | — | Say how it should read |
| DQ-4 | Dashboard · Technician Utilization | The PRD says WO hours ÷ (WO + internal hours); the build divides by all clocked time. They agree today because no clock can be on neither. Confirm the PRD formula is the one to keep? | Latent difference | — | — |
