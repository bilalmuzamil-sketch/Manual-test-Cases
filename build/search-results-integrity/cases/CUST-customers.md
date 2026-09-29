# Search Results Integrity — Customers tab

Local ids `SRI-CUST-*`. **These are files, not TestRail cases** — the Jira/TestRail creation hold (Rule 62) is in force and nothing here has been pushed.

**What the PRD says this row displays**, quoted verbatim:

> Displayed: customer name (primary), address line, open WO count badge (e.g. `12`), telephone on hover.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §4 — Customers*

**What the build actually renders** (fact, read from `app/src/components/ts/navigation/search/searchRowVariants.ts` — a FACT, never an expectation, Rule 57): bold line = customer name; second line = address line; a count badge reading "N open" when the customer has open work orders. NO TELEPHONE IS RENDERED ANYWHERE - see the root-cause analysis §5.

---

## Class A — show me the whole value you matched on

### SRI-CUST-A1 — The matched value is shown in full, not just the characters typed

**Tab:** Customers

**Why an end user cares:** If the row shows only what I typed, I am reading my own query back. It tells me nothing about which record this is.

**Preconditions**

1. A customer record exists whose telephone contains a distinctive run of characters somewhere after its first character.
2. You are signed in with a role that can see this tab.

**Steps**

1. Open global search and type a fragment that appears in the middle of that telephone — not the whole value.
2. Open the **Customers** tab.
3. Look at the row for that record, without opening it.

**Expected result — the source's own words, quoted (Rule 113)**

> Every row has a left-side entity icon, a primary line (bold), a secondary line (subdued), and an
> optional right-side cluster (status badges, counts, and quick-action buttons on hover). The
> matched substring of the query is highlighted in the primary and secondary text — searching
> `Fib` highlights "Fib" in "S1-644 Fibridge Commercial".

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §5.3 Result row anatomy*

**In plain words (our restatement — NOT the source):** The row shows the COMPLETE telephone, with the part you typed emphasised inside it. Seeing only the typed characters, or the value cut short with "…", is a fail — that is SV-10619 and SV-10551.

**Provenance.** Expected behaviour from Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §5.3. Defect family: SV-10619, SV-10551 (both on SV-9170 (story, parent of SV-10619 and SV-10551)).

AUTOMATION: READY

---

### SRI-CUST-A2 — A long value is not clipped through the part that matched

**Tab:** Customers

**Why an end user cares:** A row that clips to "9…" has hidden the one thing I was looking for.

**Preconditions**

1. A customer record exists whose displayed text is long enough to overflow the search modal (the modal is a fixed 640px wide).
2. The matched characters sit near the END of that long value.

**Steps**

1. Open global search and type the fragment that matches near the end of that value.
2. Open the **Customers** tab.
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

### SRI-CUST-A3 — The emphasis marks the matched part inside the text, not instead of it

**Tab:** Customers

**Why an end user cares:** Emphasis is meant to point at something. If it replaces the text, it points at nothing.

**Preconditions**

1. Any customer record that can be found by typing part of a displayed field.

**Steps**

1. Open global search and type a fragment of that field.
2. Open the **Customers** tab.
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

### SRI-CUST-B1 — Two records sharing the typed fragment are distinguishable from the rows alone

**Tab:** Customers

**Why an end user cares:** This is the QA lead's own example: type `123786`, and if two records both draw as `786` I cannot tell `123786` from `185786` without opening both.

**Preconditions**

1. TWO customers records exist whose telephone values are DIFFERENT but share a common run of characters (for example `123786` and `185786`).
2. Both are visible to the signed-in role.

**Steps**

1. Open global search and type the shared run of characters.
2. Open the **Customers** tab.
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

### SRI-CUST-B2 — Two records with the same primary line differ somewhere visible

**Tab:** Customers

**Why an end user cares:** Real shops have two vehicles of the same year/make/model, two customers with the same name, two parts with the same description. If the rows are identical the list is useless.

**Preconditions**

1. TWO customers records exist whose primary (bold) line is identical.
2. They differ in at least one other field.

**Steps**

1. Open global search and type a term that returns both.
2. Open the **Customers** tab.
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

### SRI-CUST-C1 — A match on **the customer's own telephone** explains itself on the row

**Tab:** Customers

**Why an end user cares:** the single most common way a service advisor finds a caller — and the PRD asks for it on hover, which the build does not do at all

**Preconditions**

1. A customer record exists carrying a distinctive value in **the customer's own telephone** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type the last four digits of the customer's telephone.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **the customer's own telephone** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **the customer's own telephone**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **the customer's own telephone** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-CUST-C2 — A match on **a contact's telephone** explains itself on the row

**Tab:** Customers

**Why an end user cares:** the person calling is an employee of the company, not the company

**Preconditions**

1. A customer record exists carrying a distinctive value in **a contact's telephone** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type the last four digits of a contact's telephone.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **a contact's telephone** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **a contact's telephone**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **a contact's telephone** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-CUST-C3 — A match on **a contact's email address** explains itself on the row

**Tab:** Customers

**Why an end user cares:** the enquiry arrived by email

**Preconditions**

1. A customer record exists carrying a distinctive value in **a contact's email address** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type part of a contact's email address.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **a contact's email address** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **a contact's email address**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **a contact's email address** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-CUST-C4 — A match on **a contact's name** explains itself on the row

**Tab:** Customers

**Why an end user cares:** the caller gives their own name, not the company name

**Preconditions**

1. A customer record exists carrying a distinctive value in **a contact's name** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a contact's surname.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **a contact's name** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **a contact's name**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **a contact's name** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-CUST-C5 — A match on **address line 2** explains itself on the row

**Tab:** Customers

**Why an end user cares:** a suite or unit number distinguishes two customers at one street address

**Preconditions**

1. A customer record exists carrying a distinctive value in **address line 2** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a suite number that appears only in address line 2.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **address line 2** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **address line 2**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **address line 2** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-CUST-C6 — A match on **city** explains itself on the row

**Tab:** Customers

**Why an end user cares:** two customers share a name and differ only by town

**Preconditions**

1. A customer record exists carrying a distinctive value in **city** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a city name.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **city** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **city**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **city** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-CUST-C7 — A match on **state / province** explains itself on the row

**Tab:** Customers

**Why an end user cares:** the same, one level up

**Preconditions**

1. A customer record exists carrying a distinctive value in **state / province** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a province name.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **state / province** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **state / province**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **state / province** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

### SRI-CUST-C8 — A match on **postal code** explains itself on the row

**Tab:** Customers

**Why an end user cares:** measured on the build and NOT listed in PRD §4 — see PO-QUESTIONS Q6

**Preconditions**

1. A customer record exists carrying a distinctive value in **postal code** — a value that appears in NO other field of that record.
2. Confirm the value is unique to that field: blank nothing, but search the value and check it does not also sit in the name or the number. If it does, the case proves nothing (this is the attribution trap of Rule 110).

**Steps**

1. Open global search and type a postal code, with and without its space.
2. Open the **Customers** tab.
3. Find the record. Without opening it, answer: does anything on this row tell you why it came back?

**Expected result — the source's own words, quoted (Rule 113)**

> Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle,
> which is what tells two of the same customer's work orders apart.

*Quoted from: SV-9170 (story, parent of SV-10619 and SV-10551)*

**🔴 THE SOURCE IS SILENT ON THIS CASE — HELD.** PRD §4 lists the field **postal code** among what is matched, and does not list it among what the row displays. §5.3 says the match is highlighted "in the primary and secondary text" — which cannot happen when the matched value is in neither.

The sentence above is the GOVERNING expectation and is what the tester judges against. It does not state what the row should show when the matched field is not one of the displayed fields, so this case is held for the PO's answer rather than resolved from the build (Rules 58, 64, 113).

**In plain words (our restatement — NOT the source):** You can tell from the row that the match came from **postal code**, and you can see that value. If the row shows no trace of what you typed, record it: the row came back and cannot say why.

**Provenance.** Governing expectation from SV-9170 (story, parent of SV-10619 and SV-10551). The field **postal code** is matchable per Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4 (or measured on the build where §4 omits it), and is not in that section's list of displayed fields for Customers.

AUTOMATION: HOLD - the expected outcome is a PO decision, not yet answered

---

## Class D — show me everything the specification promised

### SRI-CUST-D1 — The Customers row displays every field §4 says it displays

**Tab:** Customers

**Why an end user cares:** Each of these fields is there because somebody decided you need it to choose. A missing one is a choice you now have to make by opening records.

**Preconditions**

1. At least one customer record is returned by some query.
2. The record has a non-empty value for each field named in the quote below.

**Steps**

1. Open global search and type a term that returns the record.
2. Open the **Customers** tab.
3. Check the row against the quoted list, field by field.

**Expected result — the source's own words, quoted (Rule 113)**

> Displayed: customer name (primary), address line, open WO count badge (e.g. `12`), telephone on
> hover.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §4 — Customers*

**In plain words (our restatement — NOT the source):** Every field named in the quote is on the row. Mark any that is missing — do not judge whether it matters, just record it.

**Provenance.** Expected behaviour from Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §4.

AUTOMATION: READY

---

## Class I — a corrected typo must say it corrected something

### SRI-CUST-I1 — A fuzzy match carries its soft-match marker

**Tab:** Customers

**Why an end user cares:** If the system quietly corrects my typo without saying so, I will believe I found an exact match and act on the wrong record.

**Preconditions**

1. A customer record exists whose name or description is reachable by a near-miss spelling (one or two characters wrong).
2. NOTE: identifier fields are excluded by the PRD — see the quote in Class F of the cross-tab file.

**Steps**

1. Open global search and type the near-miss spelling.
2. Open the **Customers** tab.
3. Look at how the matched token is drawn.

**Expected result — the source's own words, quoted (Rule 113)**

> When a match is fuzzy rather than exact, the matched token in the row is still highlighted, and
> a subtle `≈` or italicized treatment indicates the soft match.

*Quoted from: Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945, §7 Fuzzy Matching — Highlighting*

**In plain words (our restatement — NOT the source):** The matched token is highlighted AND carries the `≈` or italic treatment that says it is a soft match. A fuzzy hit drawn identically to an exact hit is a fail.

**Provenance.** Expected behaviour from Global Search - Product Requirements, v1.5 (2026-09-08), page 576978945 §7.

AUTOMATION: READY

---
