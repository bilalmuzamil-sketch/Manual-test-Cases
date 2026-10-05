# RUN HAND-OFF — Founder Mode · Notifications (group 20436) — build-verified 2026-10-05
Build: QA branch **sv9667.qa.shopview.com**, app **v26.40.7-7ffda69**. Users: Admin quick-login ("Admin ShopView") and, as the
second user, Tech quick-login ("Tech ShopView") in a private window. Where a case needs User C/D, give Tech ShopView that role.
- **READY (67):** C154651–C154706, C236963–C236973.
- **HOLD — customer portal, staging only (1):** C236974.
- Email halves of C154699 / C154700 (and the email check in C154669, C154702) cannot be read by a tester on a QA branch (the
  quick-login mailboxes are not readable) — the case says so; do the inbox/bell half.
- Seeded test data you can reuse: tag group "ZZAUTOTEST Service Team", quick note "ZZAUTOTEST Road test", notes on work order
  S2-4219 and part sale P9667-370.
- Not walked on screen this pass (routes written in the cases from the documents): asset Notes tab, Dashboard notifications
  card (C236966), "For Customer" on attachments (C236972), 12-image note layout (C236973), new-mention pop-up (C236967).
