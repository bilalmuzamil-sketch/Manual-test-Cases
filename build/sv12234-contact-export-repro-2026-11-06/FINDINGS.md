# SV-12234 — Customer Contact export: one contact per customer (replicated on production, 6 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12234 (Bug, Ready to Fix, assignee Bilal Muzamil). QA lead asked for a production replication with layman steps + annotated screenshots, after the Board-2 queue.
Production build v26.45.2-198e632 (test org 72b2cc90, Trucks Hill 2).

- Seeded customer ZZAUTOTEST SV12234 Contacts 47637 (company 106cc439-8384-4e57-a8f0-f007625fd21b) with 3 contacts: Ben Second, Anna First, Cara Third (API set-up; the Contacts tab shows "Contacts (3)").
- Screen: Reports > left menu Accounting > Export Reports > Report Name "Customer Contact", Date Range "Today" > Export → customer_contact.csv (`GET /api/reporting/export/customer_contact?report=customer_contact&range=today`).
- File: ONE row for the customer (Ben Second). Anna First and Cara Third missing.
- Whole-org check: This Month 128 rows / 128 companies; Last Month 447 rows / 447 companies; max rows per company = 1 in both.
- Posted comment 80382 (steps + exhibit), edited once to replace the "Today" range with "a range covering the day the customer was made" (dated note).

Exhibit: ev/jira/01-contact-export-one-per-customer.png. Scripts: scripts/{seedc,doexp,shots,exhibit}.
