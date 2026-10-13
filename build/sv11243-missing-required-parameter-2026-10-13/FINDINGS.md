# SV-11243 — "Missing required parameter" when editing a part on a work order — reproduction (13 Oct 2026)

**Ticket:** [SV-11243](https://shopview.atlassian.net/browse/SV-11243) · Medium · **Ready to Fix** (read live 13 Oct, before posting) · reporter Mike Freeman · customer Ben Brush / Brush Enterprises LLC (7 users), work order S-1556 · no comments before ours.
**QA lead's ask:** reproduce it on production with exact steps (developers could not). Answers: recording **No**, technical section **No**. He then supplied the customer's recording and the trigger: the part was first ordered as a **Catalog** part from a vendor; click the part number, choose **Inventory** for the same part, Amount 1, Save & Close. Final instruction: tag Chris Ward with the steps and screenshots.

## Environment
Production `app.shopview.com`, build **v26.40.17-f5bf8f4** (last-modified 13 Oct 08:42:45 GMT, etag `W/"a8b1d386…"`), read at the gate just before posting — unchanged. Location **Trucks Hill 2**, work order **S2-968** (`4b2e1143-…`, line `cbb42291-…`), part **ZZ11243-920183** (catalog `f847f790…`, inventory `d7ac7efe…`, bin Location57, vendor Delete Test, cost 0.84, sell 7.56).

## Results (variant matrix)
| Run | Original request | Option picked | Amount | Title after pick | Result |
|---|---|---|---|---|---|
| r1 `4ec70df3` | Catalog, same PN | Inventory | 1 | Edit Part | 400 id+status missing, toast, nothing saved |
| R `8b61b9fd` | Catalog, same PN | Inventory | 1 | Edit Part | same |
| V0 `54c40277` | Catalog, same PN | Inventory | blank | Edit Part | same |
| V25 `1bba0e7e` | Catalog, same PN | Inventory | 25 | Edit Part | same |
| G `4ec70df3` (gate, just before posting) | Catalog, same PN | Inventory | 1 | Edit Part | same |
| earlier | generic, different PN | Inventory part | — | stays Edit Part Request | saves (201) |
Ruled out earlier: Amount over stock, inline add of the Inventory part, non-default category, picked part with bins.

After the gate run all four requests were re-read on a fresh page load: still **Auth To Order, qty 25, $0.00** — nothing saved.

**Mechanism (developer-level, kept here per Rule 84):** picking an inventory option flips `PartDialog.vue` into picked-part mode, which posts `/api/work-orders/parts/change` built from the Inventory option with no `id` and no `status` → `{"errors":[{"id":"Missing required parameter"},{"status":"Missing required parameter"}]}` (full payload in `data/G.log`).

## Side observation (not in the comment — bucket (d), asking)
Swapping a requested part to Inventory elsewhere kept a quantity above stock, and **Pick** took the full quantity with no prompt (stock went negative, -58). Not searched in Jira yet; raised to the QA lead.

## Posted
Comment **78607** (13 Oct 11:05:12 −0500), tags Chris Ward (mention read back: `712020:aa00b8d6-…`). Four pictures as real attachments 62249–62252, rendered in order 01→04. No technical section, no recording. Text scan clean. Pre-post gate: marker unchanged, ticket Ready to Fix with no comments, data live, bug re-reproduced minutes before posting.

## Data left on production (no clean-up, per the QA lead)
S2-968 with four Auth To Order requests and three picked rows of ZZ11243-920183; inventory stock of that part negative.

## Learning check
LESSONS-INDEX row (build the data quirk the ticket note names first); playbook §AN.1 (confirmed trigger, ready data, inline row labels, rendered picture order check).
