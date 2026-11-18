# Whole-data checks, as of 2026-11-18, screen zone Asia/Karachi


## A/R

- **A/R Detail S1-R5a Past Due = as-of minus due date (credit: own date)** — PASS: 0 wrong of 1828 
- **A/R Detail bucket agrees with Past Due (S1-R5a)** — PASS: 0 wrong of 1828 
- **A/R Detail S1-R5 bucket order "91+, 61-90, 31-60, 1-30, Current"** — PASS: 0 wrong of 1 
- **A/R Detail S5-R18 every "Total for" and Totals add up the lines** — PASS: 0 wrong of 7 
- **A/R Summary S5-R18 Totals row = sum of the rows; each row total = its buckets** — PASS: 0 wrong of 341 
- **A/R S5-R18a Summary Totals = Detail Open Balance Totals bucket by bucket** — PASS: 0 wrong of 5 
- **A/R S5-R18a each customer: Summary row = its Detail lines, bucket by bucket** — PASS: 0 wrong of 1675 
- **A/R Summary S1-R1..R4 opens in name order** — PASS: 0 wrong of 334 
- **A/R Summary S1-R8 paging repeats no customer** — PASS: 0 wrong of 335 
- **A/R ar-aging-collection S1-R6 groups in name order** — PASS: 0 wrong of 308 
- **A/R ar-aging-collection S1-R6 rows oldest date first, ties by number; subtotals add up** — PASS: 0 wrong of 1689 
- **A/R ar-aging-collection S5-R18 Totals = sum of groups** — PASS: 0 wrong of 3 
- **A/R ar-aging-collection every document matches the same document on Detail** — PASS: 0 wrong of 1689 
- **A/R Collection = A/R Detail minus invoices not overdue (S8-R1 "Overdue invoices"; old report CollectionsItem.php:31)** — PASS: 0 wrong of 1689 (invoices due exactly on the as-of date: 16, of which on Collection: 0)
- **A/R Detail S1-R5 lines open in customer name order, ties by number (100-line pages)** — PASS: 0 wrong of 1828 
- **A/R Detail S1-R8 paging repeats/skips no line** — PASS: 0 wrong of 1828 

## A/P

- **A/P Detail S1-R5a Past Due = as-of minus due date (credit: own date)** — PASS: 0 wrong of 14743 
- **A/P Detail bucket agrees with Past Due (S1-R5a)** — PASS: 0 wrong of 14743 
- **A/P Detail S1-R5 bucket order "91+, 61-90, 31-60, 1-30, Current"** — PASS: 0 wrong of 1 
- **A/P Detail S5-R18 every "Total for" and Totals add up the lines** — PASS: 0 wrong of 7 
- **A/P Summary S5-R18 Totals row = sum of the rows; each row total = its buckets** — PASS: 0 wrong of 504 
- **A/P S5-R18a Summary Totals = Detail Open Balance Totals bucket by bucket** — PASS: 0 wrong of 5 
- **A/P S5-R18a each vendor: Summary row = its Detail lines, bucket by bucket** — PASS: 0 wrong of 2490 
- **A/P Summary S1-R1..R4 opens in name order** — PASS: 0 wrong of 497 
- **A/P Summary S1-R8 paging repeats no vendor** — PASS: 0 wrong of 498 
- **A/P ap-unpaid-invoices S1-R6 groups in name order** — PASS: 0 wrong of 497 
- **A/P ap-unpaid-invoices S1-R6 rows oldest date first, ties by number; subtotals add up** — PASS: 0 wrong of 14743 
- **A/P ap-unpaid-invoices S5-R18 Totals = sum of groups** — PASS: 0 wrong of 3 
- **A/P ap-unpaid-invoices every document matches the same document on Detail** — PASS: 0 wrong of 14743 
- **A/P Unpaid holds every A/P Detail document** — PASS: 0 wrong of 14743 
  - note: 1321 A/P Unpaid lines with no Past Due (types: {'Vendor Credit': 1321})
- **A/P Detail S1-R5 lines open in vendor name order, ties by number (100-line pages)** — PASS: 0 wrong of 14743 
- **A/P Detail S1-R8 paging repeats/skips no line** — PASS: 0 wrong of 14743 
