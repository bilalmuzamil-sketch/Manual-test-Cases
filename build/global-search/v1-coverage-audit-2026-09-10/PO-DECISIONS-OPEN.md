# OPEN PO DECISIONS — 9 items, each already flagged inside its test case

Every item is a **code-versus-document conflict**: V1's code did it, PRD v1.5 does not mention it.
Standing Rule 96 keeps the V1 behaviour as the default; Standing Rule 58 makes the conflict a PO
decision rather than a silent invariant. **Each case tells the tester to record and flag, not to raise
a defect**, so an intentional scope cut cannot become a false bug report.

| # | Question for the PO | Case | Risk if dropped silently |
|---|---|---|---|
| 1 | 🔴 **Are catalogue parts that were never stocked intentionally dropped from search?** V1 searched the parts catalogue; V2 searches inventory | C53601 | **Highest.** The likeliest source of "I could search this part in V1 and cannot now" |
| 2 | Should a run-together customer name ("BridgeportHauling") still match? | C53602 | A habit users may already rely on |
| 3 | Should a contact's **job title** still be searchable? | C53603 | Low volume, easy to miss |
| 4 | Should **customer postal code** still be searchable? | C53582 | Common for dispatch |
| 5 | Should **customer website** still be searchable? | C53583 | Low |
| 6 | Should **vendor postal code** still be searchable? | C53585 | Low |
| 7 | Should **vendor state/province** still be searchable? | C53606 | Low |
| 8 | Should **asset licence plate** still be searchable? | C53516 | Medium - plates are how yard staff identify trucks |
| 9 | Which **shop-prefixed work order number forms** must still match? V1 accepted four | C53579 | Medium |

**None of these blocks testing.** Each case is runnable today; the ruling only decides whether a
failure becomes a defect or a documented scope cut.
