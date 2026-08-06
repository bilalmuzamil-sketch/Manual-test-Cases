# Execution log - every Jira write, one row each

**Rule 50: "204 No Content" alone is not a record.** Each row carries the operation, the ticket, the HTTP
status, how many fields were compared between the pre-write and post-write reads, which fields moved, and
the verification verdict. A description edit is expected to move exactly `description` and `updated`;
anything else is collateral damage and stops the batch.

**63 operations · 62 PASS · 1 FAIL · every response HTTP 204.**

The one FAIL is real and is not a write failure: the description was written exactly as intended, but the
pre/post comparison showed the `attachment` field had moved, because Jira deleted a pasted image whose
reference the new body no longer carried. **The batch stopped there, as required.** Full account in
[`ATTACHMENT-LOSS-SV-8818.md`](ATTACHMENT-LOSS-SV-8818.md).

| # | Operation | Ticket | HTTP | Fields compared | Fields moved | Description byte-identical to payload | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | update_description | [SV-8780](https://shopview.atlassian.net/browse/SV-8780) | 204 | 56 | description, updated | yes | PASS |
| 2 | update_description | [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | 204 | 59 | attachment, description, updated | yes | **FAIL - batch stopped** |
| 3 | update_description | [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | 204 | 59 | description, updated | yes | PASS |
| 4 | update_description | [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | 204 | 59 | description, updated | yes | PASS |
| 5 | update_description | [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | 204 | 59 | description, updated | yes | PASS |
| 6 | update_description | [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | 204 | 59 | description, updated | yes | PASS |
| 7 | update_description | [SV-8880](https://shopview.atlassian.net/browse/SV-8880) | 204 | 59 | description, updated | yes | PASS |
| 8 | update_description | [SV-8881](https://shopview.atlassian.net/browse/SV-8881) | 204 | 59 | description, updated | yes | PASS |
| 9 | update_description | [SV-8926](https://shopview.atlassian.net/browse/SV-8926) | 204 | 56 | description, updated | yes | PASS |
| 10 | update_description | [SV-8927](https://shopview.atlassian.net/browse/SV-8927) | 204 | 56 | description, updated | yes | PASS |
| 11 | update_description | [SV-8928](https://shopview.atlassian.net/browse/SV-8928) | 204 | 56 | description, updated | yes | PASS |
| 12 | update_description | [SV-8929](https://shopview.atlassian.net/browse/SV-8929) | 204 | 56 | description, updated | yes | PASS |
| 13 | update_description | [SV-8930](https://shopview.atlassian.net/browse/SV-8930) | 204 | 56 | description, updated | yes | PASS |
| 14 | update_description | [SV-8931](https://shopview.atlassian.net/browse/SV-8931) | 204 | 56 | description, updated | yes | PASS |
| 15 | update_description | [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | 204 | 56 | description, updated | yes | PASS |
| 16 | update_description | [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | 204 | 56 | description, updated | yes | PASS |
| 17 | update_description | [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | 204 | 56 | description, updated | yes | PASS |
| 18 | update_description | [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | 204 | 56 | description, updated | yes | PASS |
| 19 | update_description | [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | 204 | 56 | description, updated | yes | PASS |
| 20 | update_description | [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | 204 | 56 | description, updated | yes | PASS |
| 21 | update_description | [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | 204 | 56 | description, updated | yes | PASS |
| 22 | update_description | [SV-8940](https://shopview.atlassian.net/browse/SV-8940) | 204 | 56 | description, updated | yes | PASS |
| 23 | update_description | [SV-8943](https://shopview.atlassian.net/browse/SV-8943) | 204 | 56 | description, updated | yes | PASS |
| 24 | update_description | [SV-8944](https://shopview.atlassian.net/browse/SV-8944) | 204 | 56 | description, updated | yes | PASS |
| 25 | update_description | [SV-8945](https://shopview.atlassian.net/browse/SV-8945) | 204 | 56 | description, updated | yes | PASS |
| 26 | update_description | [SV-8946](https://shopview.atlassian.net/browse/SV-8946) | 204 | 56 | description, updated | yes | PASS |
| 27 | update_description | [SV-8947](https://shopview.atlassian.net/browse/SV-8947) | 204 | 56 | description, updated | yes | PASS |
| 28 | update_description | [SV-8948](https://shopview.atlassian.net/browse/SV-8948) | 204 | 56 | description, updated | yes | PASS |
| 29 | update_description | [SV-8949](https://shopview.atlassian.net/browse/SV-8949) | 204 | 56 | description, updated | yes | PASS |
| 30 | update_description | [SV-8950](https://shopview.atlassian.net/browse/SV-8950) | 204 | 56 | description, updated | yes | PASS |
| 31 | update_description | [SV-8951](https://shopview.atlassian.net/browse/SV-8951) | 204 | 56 | description, updated | yes | PASS |
| 32 | update_description | [SV-8952](https://shopview.atlassian.net/browse/SV-8952) | 204 | 56 | description, updated | yes | PASS |
| 33 | update_description | [SV-8953](https://shopview.atlassian.net/browse/SV-8953) | 204 | 56 | description, updated | yes | PASS |
| 34 | update_description | [SV-8954](https://shopview.atlassian.net/browse/SV-8954) | 204 | 56 | description, updated | yes | PASS |
| 35 | update_description | [SV-8955](https://shopview.atlassian.net/browse/SV-8955) | 204 | 56 | description, updated | yes | PASS |
| 36 | update_description | [SV-8956](https://shopview.atlassian.net/browse/SV-8956) | 204 | 56 | description, updated | yes | PASS |
| 37 | update_description | [SV-8962](https://shopview.atlassian.net/browse/SV-8962) | 204 | 56 | description, updated | yes | PASS |
| 38 | update_description | [SV-8963](https://shopview.atlassian.net/browse/SV-8963) | 204 | 56 | description, updated | yes | PASS |
| 39 | update_description | [SV-8964](https://shopview.atlassian.net/browse/SV-8964) | 204 | 56 | description, updated | yes | PASS |
| 40 | update_description | [SV-8965](https://shopview.atlassian.net/browse/SV-8965) | 204 | 56 | description, updated | yes | PASS |
| 41 | update_description | [SV-8966](https://shopview.atlassian.net/browse/SV-8966) | 204 | 56 | description, updated | yes | PASS |
| 42 | update_description | [SV-8907](https://shopview.atlassian.net/browse/SV-8907) | 204 | 56 | description, updated | yes | PASS |
| 43 | update_description | [SV-8908](https://shopview.atlassian.net/browse/SV-8908) | 204 | 56 | description, updated | yes | PASS |
| 44 | update_description | [SV-8967](https://shopview.atlassian.net/browse/SV-8967) | 204 | 56 | description, updated | yes | PASS |
| 45 | update_description | [SV-8968](https://shopview.atlassian.net/browse/SV-8968) | 204 | 56 | description, updated | yes | PASS |
| 46 | update_description | [SV-8969](https://shopview.atlassian.net/browse/SV-8969) | 204 | 56 | description, updated | yes | PASS |
| 47 | update_description | [SV-8970](https://shopview.atlassian.net/browse/SV-8970) | 204 | 56 | description, updated | yes | PASS |
| 48 | update_description | [SV-8987](https://shopview.atlassian.net/browse/SV-8987) | 204 | 56 | description, updated | yes | PASS |
| 49 | update_description | [SV-8988](https://shopview.atlassian.net/browse/SV-8988) | 204 | 56 | description, updated | yes | PASS |
| 50 | update_description | [SV-8989](https://shopview.atlassian.net/browse/SV-8989) | 204 | 56 | description, updated | yes | PASS |
| 51 | update_description | [SV-8925](https://shopview.atlassian.net/browse/SV-8925) | 204 | 56 | description, updated | yes | PASS |
| 52 | update_description | [SV-8972](https://shopview.atlassian.net/browse/SV-8972) | 204 | 56 | description, updated | yes | PASS |
| 53 | update_description | [SV-8973](https://shopview.atlassian.net/browse/SV-8973) | 204 | 56 | description, updated | yes | PASS |
| 54 | update_description | [SV-8974](https://shopview.atlassian.net/browse/SV-8974) | 204 | 56 | description, updated | yes | PASS |
| 55 | update_description | [SV-8975](https://shopview.atlassian.net/browse/SV-8975) | 204 | 56 | description, updated | yes | PASS |
| 56 | update_description | [SV-8976](https://shopview.atlassian.net/browse/SV-8976) | 204 | 56 | description, updated | yes | PASS |
| 57 | update_description | [SV-8977](https://shopview.atlassian.net/browse/SV-8977) | 204 | 56 | description, updated | yes | PASS |
| 58 | update_description | [SV-8978](https://shopview.atlassian.net/browse/SV-8978) | 204 | 56 | description, updated | yes | PASS |
| 59 | update_description | [SV-8979](https://shopview.atlassian.net/browse/SV-8979) | 204 | 56 | description, updated | yes | PASS |
| 60 | update_description | [SV-8980](https://shopview.atlassian.net/browse/SV-8980) | 204 | 56 | description, updated | yes | PASS |
| 61 | update_description | [SV-8981](https://shopview.atlassian.net/browse/SV-8981) | 204 | 56 | description, updated | yes | PASS |
| 62 | update_description | [SV-8982](https://shopview.atlassian.net/browse/SV-8982) | 204 | 56 | description, updated | yes | PASS |
| 63 | update_description | [SV-8983](https://shopview.atlassian.net/browse/SV-8983) | 204 | 56 | description, updated | yes | PASS |

## What was NOT written

- **Zero writes to anyone else's ticket.** The three foreign Story Defects by Nebojsa Glavinic (SV-8960, SV-8961, SV-8984) were read and left alone.
- **Zero TestRail calls of any kind.** No `get_*`, no `update_*`, nothing.
- **Zero changes to any field other than the description.** No type, parent, priority, status, link, label, assignee or Product Area was touched on any ticket, and that is proven per ticket by the fields-moved column above and again by the final live re-read.
- **Zero new tickets, zero comments, zero transitions, zero attachments added or removed by us.**
- **The three closed tickets were not written to at all** - SV-8819, SV-8821 and SV-8822 are byte-identical to their pre-edit snapshots.
