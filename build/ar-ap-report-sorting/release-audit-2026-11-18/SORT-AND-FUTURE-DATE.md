- PASS — ar-aging-summary sort current asc: 335 rows, 297 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort current desc: 335 rows, 297 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_1_to_30 asc: 335 rows, 201 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_1_to_30 desc: 335 rows, 201 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_31_to_60 asc: 335 rows, 181 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_31_to_60 desc: 335 rows, 181 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_61_to_90 asc: 335 rows, 307 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_61_to_90 desc: 335 rows, 307 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_91_plus asc: 335 rows, 314 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort days_91_plus desc: 335 rows, 314 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort total asc: 335 rows, 0 blank cells all at the bottom: True; values in order: True
- PASS — ar-aging-summary sort total desc: 335 rows, 0 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort current asc: 498 rows, 460 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort current desc: 498 rows, 460 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_1_to_30 asc: 498 rows, 429 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_1_to_30 desc: 498 rows, 429 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_31_to_60 asc: 498 rows, 423 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_31_to_60 desc: 498 rows, 423 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_61_to_90 asc: 498 rows, 404 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_61_to_90 desc: 498 rows, 404 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_91_plus asc: 498 rows, 72 blank cells all at the bottom: True; values in order: True
- PASS — ap-aging-summary sort days_91_plus desc: 498 rows, 72 blank cells all at the bottom: True; values in order: True
- FAIL — ap-aging-summary sort total asc: 498 rows, 491 blank cells all at the bottom: False; values in order: True
- FAIL — ap-aging-summary sort total desc: 498 rows, 11 blank cells all at the bottom: False; values in order: True
- PASS — ar-aging-summary as of 2026-11-25 (after today): HTTP 200
- PASS — ap-aging-summary as of 2026-11-25 (after today): HTTP 200
- PASS — ar-aging-collection as of 2026-11-25 (after today): HTTP 200
- PASS — ap-unpaid-invoices as of 2026-11-25 (after today): HTTP 200
- PASS — ar-aging-detail as of 2026-11-25: HTTP 200; Past Due counted to Nov 25: 0 wrong of 441 sampled (first 100 lines of each bucket)
- PASS — ap-aging-detail as of 2026-11-25: HTTP 200; Past Due counted to Nov 25: 0 wrong of 500 sampled (first 100 lines of each bucket)

**Correction (same run):** the two "Total" FAILs above are my script's error, not the app's — it treated a Total of $0.00 as a
blank cell. The export prints such a Total as "0.00" (not blank), so it is a value. Re-checked the Total column as plain value
order: 498 rows, 0 out of order, both directions. The four vendors with a $0.00 Total each have an open bill and an unused
vendor credit in the same bucket that cancel out (e.g. Newport Truck and Trailer Repair: bill 08121914 $237.62, credit C-9508 -$237.62).
