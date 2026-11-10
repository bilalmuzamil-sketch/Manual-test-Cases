# SV-12268 — rewrite per Standing Rule 128 (10 Nov 2026, QA lead: "do the same with this ticket")
Production (app.shopview.com v26.45.3-fc08f23, Trucks Hill 2): new vendor **ZZAUTOTEST SV12268 P** (`d516fc4c-1695-417a-a9ac-370ce1b4f2e1`),
two $10 bills received on screen (ZZ12268P1, ZZ12268P2). Paid ZZ12268P1 on screen with Amount to credit 100: window showed
Payment amount $110.00; saved payment $10.00; Unpaid Invoices afterwards only ZZ12268P2, Balance $10.00, no credit; remittance
PDF Subtotal $10.00 / Credits Included $0.00 / Total $10.00 (ev/P1-*). **ZZ12268P2 left unpaid for readers.**
QA environment sv11839 (v26.45.2-e5eff4a, woken via sleep page): vendor ZZAUTOTEST SV12146 F, bill ZZ12146F10 + 100 →
window $110.00, saved $10.00, no credit (reproduces).
Description rewritten 10:02 CST (16:02 UTC): "Where it happens" line, production steps/data/link, production picture
(attachment beb4c6ab…), table with production 10 Nov + 6 Nov and QA 10 Nov, dated edit note. Old QA picture attachment
(63717, amount-to-credit-lost.png) is no longer embedded but still in the attachment list — the Jira tools here cannot delete
attachments.
SV-12510 also given its "Where it happens" line (only on the QA environment sv12120), 16:03 UTC.
