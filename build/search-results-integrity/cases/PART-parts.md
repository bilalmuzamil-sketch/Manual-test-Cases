# Search Results Integrity — Parts tab

Local ids `SRI-PART-*`. **These are files, not TestRail cases** — the Jira/TestRail creation hold (Rule 62) is in force and nothing here has been pushed.

**What the PRD says this row displays**, quoted verbatim:

> Displayed: description (primary), part number (secondary), total quantity with a stock-status badge (see §5.3).

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §4 — Parts*

**What the build actually renders** (fact, read from `app/src/components/ts/navigation/search/searchRowVariants.ts` — a FACT, never an expectation, Rule 57): bold line = description; second line = part number; a stock badge built from quantity on hand against the min/max thresholds.

---

## Class A — show me the whole value you matched on

### SRI-PART-A1 — The matched value is shown in full, not just the characters typed

**Tab:** Parts

**Why an end user cares:** If the row shows only what I typed, I am reading my own query back. It tells me nothing about which record this is.

**Preconditions**

1. A part record exists whose part number contains a distinctive run of characters somewhere after its first character.
2. You are signed in with a role that can see this tab.

**Steps**

1. Open global search and type a fragment that appears in the middle of that part number — not the whole value.
2. Open the **Parts** tab.
3. Look at the row for that record, without opening it.

**Expected result — the source's own words, quoted (Rule 113)**

> Every row has a left-side entity icon, a primary line (bold), a secondary line (subdued), and an
> optional right-side cluster (status badges, counts, and quick-action buttons on hover). The
> matched substring of the query is highlighted in the primary and secondary text — searching
> `Fib` highlights "Fib" in "S1-644 Fibridge Commercial".

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §5.3 Result row anatomy*

**In plain words (our restatement — NOT the source):** The row shows the COMPLETE part number, with the part you typed emphasised inside it. Seeing only the typed characters, or the value cut short with "…", is a fail — that is SV-10619 and SV-10551.

**Provenance.** Expected behaviour from Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §5.3. Defect family: SV-10619, SV-10551 (both on SV-9170 (story, parent of SV-10619 and SV-10551)).

AUTOMATION: READY

---

### SRI-PART-A2 — A long value is not clipped through the part that matched

**Tab:** Parts

**Why an end user cares:** A row that clips to "9…" has hidden the one thing I was looking for.

**Preconditions**

1. A part record exists whose displayed text is long enough to overflow the search modal (the modal is a fixed 640px wide).
2. The matched characters sit near the END of that long value.

**Steps**

1. Open global search and type the fragment that matches near the end of that value.
2. Open the **Parts** tab.
3. Read the row. If any text is cut off with an ellipsis, note exactly what is hidden.

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**In plain words (our restatement — NOT the source):** The row still lets you identify the record. If the ellipsis has eaten the matched characters, or eaten the part that tells this record from its neighbours, that is a fail — record what was hidden and what you typed.

**Provenance.** Expected behaviour from SV-9170 (story, parent of SV-10619 and SV-10551). Related mechanism: the row's text is clipped by CSS and the clip does not know which characters matched (root-cause analysis §6).

AUTOMATION: READY

---

### SRI-PART-A3 — The emphasis marks the matched part inside the text, not instead of it

**Tab:** Parts

**Why an end user cares:** Emphasis is meant to point at something. If it replaces the text, it points at nothing.

**Preconditions**

1. Any part record that can be found by typing part of a displayed field.

**Steps**

1. Open global search and type a fragment of that field.
2. Open the **Parts** tab.
3. Look at how the match is drawn on the row.

**Expected result — the source's own words, quoted (Rule 113)**

> Every row has a left-side entity icon, a primary line (bold), a secondary line (subdued), and an
> optional right-side cluster (status badges, counts, and quick-action buttons on hover). The
> matched substring of the query is highlighted in the primary and secondary text — searching
> `Fib` highlights "Fib" in "S1-644 Fibridge Commercial".

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §5.3 Result row anatomy*

**In plain words (our restatement — NOT the source):** The full text is on the row and the matched part is highlighted within it — exactly as the quoted example does, where typing `Fib` shows the whole of "S1-644 Fibridge Commercial" with `Fib` marked.

**Provenance.** Expected behaviour from Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §5.3.

AUTOMATION: READY

---

## Class B — let me tell two similar records apart

### SRI-PART-B1 — Two records sharing the typed fragment are distinguishable from the rows alone

**Tab:** Parts

**Why an end user cares:** This is the QA lead's own example: type `123786`, and if two records both draw as `786` I cannot tell `123786` from `185786` without opening both.

**Preconditions**

1. TWO parts records exist whose part number values are DIFFERENT but share a common run of characters (for example `123786` and `185786`).
2. Both are visible to the signed-in role.

**Steps**

1. Open global search and type the shared run of characters.
2. Open the **Parts** tab.
3. Without opening either record, write down which row is which.

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**In plain words (our restatement — NOT the source):** You can say which row is which from the rows alone. If both rows read the same, the case fails — and note that a correct row count does not rescue it: two indistinguishable rows are worse than one, because the user cannot even tell they are different records.

**Provenance.** Expected behaviour from SV-9170 (story, parent of SV-10619 and SV-10551).

AUTOMATION: READY

---

### SRI-PART-B2 — Two records with the same primary line differ somewhere visible

**Tab:** Parts

**Why an end user cares:** Real shops have two vehicles of the same year/make/model, two customers with the same name, two parts with the same description. If the rows are identical the list is useless.

**Preconditions**

1. TWO parts records exist whose primary (bold) line is identical.
2. They differ in at least one other field.

**Steps**

1. Open global search and type a term that returns both.
2. Open the **Parts** tab.
3. Compare the two rows.

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**In plain words (our restatement — NOT the source):** Something visible on the row differs — the second line, a badge, a number. If the two rows are indistinguishable, record both records' identifiers and what differs between them in the data.

**Provenance.** Expected behaviour from SV-9170 (story, parent of SV-10619 and SV-10551).

AUTOMATION: READY

---

## Class C — tell me why this row came back

Each case below is one field that the query is matched against but that the row does not display. **The PRD does not say what should happen in this situation**, so every case in this class is HELD against a PO question and quotes the governing sentence from SV-9170 (story, parent of SV-10619 and SV-10551). They are written now, and held, because an unwritten case is how these reach customers.

### SRI-PART-C1 — A match on **bin location** explains itself on the row

**Tab:** Parts

**Why an end user cares:** the whole point of the search is often "where is it?" — the PRD names bin location as indexed and the row never shows it

**Preconditions**

1. A part record exists carrying a distinctive value in **bin location** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a bin location.
2. Open the **Parts** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **bin location** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **bin location**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **bin location** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Parts.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-PART-C2 — A match on **manufacturer** explains itself on the row

**Tab:** Parts

**Why an end user cares:** a parts person searches by who makes it

**Preconditions**

1. A part record exists carrying a distinctive value in **manufacturer** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a manufacturer's name.
2. Open the **Parts** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **manufacturer** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **manufacturer**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **manufacturer** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Parts.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-PART-C3 — A match on **vendor name** explains itself on the row

**Tab:** Parts

**Why an end user cares:** a parts person searches by who sells it

**Preconditions**

1. A part record exists carrying a distinctive value in **vendor name** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a vendor's name.
2. Open the **Parts** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **vendor name** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **vendor name**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **vendor name** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Parts.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-PART-C4 — A match on **category** explains itself on the row

**Tab:** Parts

**Why an end user cares:** a broad hunt for "brakes"

**Preconditions**

1. A part record exists carrying a distinctive value in **category** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a category name.
2. Open the **Parts** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **category** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **category**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **category** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Parts.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-PART-C5 — A match on **tags** explains itself on the row

**Tab:** Parts

**Why an end user cares:** shop-specific labelling

**Preconditions**

1. A part record exists carrying a distinctive value in **tags** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a tag.
2. Open the **Parts** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **tags** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **tags**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **tags** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Parts.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

## Class D — show me everything the specification promised

### SRI-PART-D1 — The Parts row displays every field §4 says it displays

**Tab:** Parts

**Why an end user cares:** Each of these fields is there because somebody decided you need it to choose. A missing one is a choice you now have to make by opening records.

**Preconditions**

1. At least one part record is returned by some query.
2. The record has a non-empty value for each field named in the quote below.

**Steps**

1. Open global search and type a term that returns the record.
2. Open the **Parts** tab.
3. Check the row against the quoted list, field by field.

**Expected result — the source's own words, quoted (Rule 113)**

> Displayed: description (primary), part number (secondary), total quantity with a stock-status
> badge (see §5.3).

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §4 — Parts*

**In plain words (our restatement — NOT the source):** Every field named in the quote is on the row. Mark any that is missing — do not judge whether it matters, just record it.

**Provenance.** Expected behaviour from Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4.

AUTOMATION: READY

---

## Class I — a corrected typo must say it corrected something

### SRI-PART-I1 — A fuzzy match carries its soft-match marker

**Tab:** Parts

**Why an end user cares:** If the system quietly corrects my typo without saying so, I will believe I found an exact match and act on the wrong record.

**Preconditions**

1. A part record exists whose name or description is reachable by a near-miss spelling (one or two characters wrong).
2. NOTE: identifier fields are excluded by the PRD — see the quote in Class F of the cross-tab file.

**Steps**

1. Open global search and type the near-miss spelling.
2. Open the **Parts** tab.
3. Look at how the matched token is drawn.

**Expected result — the source's own words, quoted (Rule 113)**

> When a match is fuzzy rather than exact, the matched token in the row is still highlighted, and
> a subtle `≈` or italicized treatment indicates the soft match.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §7 Fuzzy Matching — Highlighting*

**In plain words (our restatement — NOT the source):** The matched token is highlighted AND carries the `≈` or italic treatment that says it is a soft match. A fuzzy hit drawn identically to an exact hit is a fail.

**Provenance.** Expected behaviour from Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §7.

AUTOMATION: READY

---
