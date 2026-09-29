# Why search results disappoint — the root cause, measured and traced to the line

**Date:** 2026-09-29 · **Environment measured:** `app.staging.shopview.com`, workplace
**Staging Heavy Duty - 9919** · **Build:** read at measurement time, recorded per finding
**Code read:** `shopview` monorepo — `api/src/Search/**`, `app/src/components/ts/navigation/search/**`

This is the analysis behind the test suite in this folder. It exists because a list of test cases
tells you *what* to check; this tells you *where the family of bugs comes from*, which is what the
QA lead asked for — a way to catch them before customers do.

**Rule 57 stands throughout:** the code and the build are used here to establish FACT (what the
system does and why). They are never a source of EXPECTATION. Every expectation in the test cases
is quoted from the PRD or the story — see `SOURCES.md`.

---

## 1 · The two reported tickets are one defect family, not two bugs

| Ticket | Symptom |
|---|---|
| [SV-10619](https://shopview.atlassian.net/browse/SV-10619) | a result shows `9…` instead of the full match |
| [SV-10551](https://shopview.atlassian.net/browse/SV-10551) | a result does not show the complete unit number it matched |

Both are on the same parent story, **SV-9170**, and both are the same failure of its governing
sentence:

> "Each result row carries enough context to pick the right record without opening it — its
> identifier, who it belongs to, its status, and for work orders the unit number and vehicle, which
> is what tells two of the same customer's work orders apart."

The QA lead's own example is the clearest statement of the damage: type `123786`, and a row that
displays only `786` is indistinguishable from a row for `185786`. **The user cannot do the one thing
the row exists to let them do.**

---

## 2 · How a match is reported — the actual contract

The API returns, per result row, a `match` descriptor:

```json
"match": { "field": "contact_phones", "kind": "word", "highlight": "965" }
```

`api/src/Search/Application/Assembler/MatchDescriptorFactory.php` states the intended division of
labour in its own docblock:

> "It is the matched FRAGMENT as plain text, not an `<em>`-wrapped string. […] **The client
> emphasizes the fragment inside the text it is already rendering safely.**"

So the design is exactly what PRD §5.3 describes: **the row renders the full text, and marks the
matched fragment inside it.** The front end implements this correctly —
`SearchHighlight.vue` renders `before` + `<mark>match</mark>` + `after`, and `splitHighlight()`
returns `null` (render the text plainly) when the fragment is not found in the display string.

**Neither half is wrong on its own. The disappointment happens in the gap between them.**

---

## 3 · Root cause A — `highlight` is not consistently a fragment

`MatchDescriptorFactory::fragmentOf()` (line 513):

```php
foreach ([$query->raw, $query->text, ...$query->tokens] as $needle) {
    $position = mb_stripos($value, $needle);
    if (false !== $position) {
        return mb_substr($value, $position, mb_strlen($needle));   // ← the typed slice only
    }
}
return $value;                                                     // ← the WHOLE field value
```

The value returned depends on whether the typed string happens to appear **literally** in the stored
value:

- it does → `highlight` is the **typed fragment** (`965`);
- it does not (normalization matched, but the raw text differs — parentheses, spaces, dashes) →
  `highlight` is the **entire field value** (`(264) 328-6723`).

**Measured on staging, one query, one field, both behaviours:**

| query | group | match.field | kind | `highlight` |
|---|---|---|---|---|
| `965` | vendors | `contact_phones` | word | `696-541-0475` ← whole value |
| `965` | vendors | `contact_phones` | word | `965` ← fragment only |
| `3286` | customers | `phone` | word | `(264) 328-6723` ← whole value |
| `965` | parts | `part_number` | word | `965` ← fragment only |
| `ZZVORTAC` | parts | `description` | prefix | `ZZVORTAC Brake Kit` ← whole value |
| `ZZVORTAC` | parts | `description` | word | `ZZVORTAC` ← fragment only |

Same field, same match kind, two different meanings for the same response key. Any consumer that
treats `highlight` as "the thing to show the user" is right half the time — which is precisely the
reported symptom.

---

## 4 · Root cause B — the matched field is often not in the row at all

This is the larger one, and it is **structural rather than a coding slip**: for most entities the set
of fields the query is matched against is much bigger than the set of fields the row displays. When
a user matches on a field the row does not show, the row **cannot explain itself** — there is no
text for the front end to mark up, so `splitHighlight()` correctly returns `null` and the row
renders with no indication of why it is there.

**Measured.** For each returned row we asked: does the `highlight` value appear anywhere in the
row's primary line, secondary line, or field payload?

| query | group | match.field | in primary | in secondary | in fields |
|---|---|---|---|---|---|
| `965` | assets | `licence_plate` | no | no | **no** |
| `965` | vendors | `address_line_2` | no | no | **no** |
| `965` | vendors | `contact_phones` | no | no | **no** |
| `3286` | customers | `contact_phones` | no | no | **no** |
| `3286` | customers | `phone` | no | no | yes — but see §5 |
| `3286` | work_orders | `item_part_numbers` | no | no | **no** |
| `3286` | purchase_orders | `item_part_numbers` | no | no | **no** |
| `965` | purchase_orders | `number_variants` | yes | no | no |

A row in the "no / no / no" state is the purest form of the complaint: **it came back, and nothing
on it says why.**

---

## 5 · A code-confirmed gap: a customer matched by phone shows no phone

PRD §4 lists, for Customers: *"Displayed: customer name (primary), address line, open WO count badge
(e.g. `12`), **telephone on hover**."*

In `app/src/components/ts/navigation/search/searchRowVariants.ts`:

```ts
case 'customers':
  meta: present(item.secondary),                       // ← address only

case 'vendors':
  meta: present(item.fields.phone, item.secondary),    // ← phone IS shown
```

`item.fields.phone` appears exactly **once** in the entire search component tree — in the vendors
variant. **No customer row renders a telephone anywhere, on hover or otherwise.**

Telephone is indexed and matchable for customers (PRD §4), so this is a complete round trip with
nothing to show for it: the user types a phone number, the right customer comes back, and the row
shows a name and an address — neither of which is what they typed. **This is SV-10619's exact
scenario** (`965` matched customers on `contact_phones`).

---

## 6 · A third cause the tickets hint at: the row is clipped

`SearchHighlight.vue` documents it:

> "There is no wrapper element, so the `nowrap` and ellipsis of whatever contains it apply straight
> to the fragments."

The modal is a fixed **640px** (PRD §5.1). A long value plus a marked fragment will be clipped by CSS,
and the clip is blind to which characters mattered — it will happily cut the matched fragment in half
and leave `9…`. **A row can therefore hide the match even when every field is present and the
highlight is correct**, which is why the suite tests the *visible outcome*, not the payload.

---

## 7 · The build indexes fields the PRD never listed

Measured field names that do not appear in PRD §4's indexed lists:

| Entity | Field the engine matched on | In PRD §4's indexed list? |
|---|---|---|
| Assets | `licence_plate` | **no** |
| Vendors | `address_line_2` | no — §4 says "address, city" |
| Work Orders | `item_part_numbers` | no — §4 says "line item descriptions" |
| Purchase Orders | `number_variants` | **no** |
| Customers | `postal_code` (per the code's own docblock) | **no** |

Per Rule 57 this is a **deviation to raise, not a silent spec update**: the build is never a source
of expectation. Each is listed in `PO-QUESTIONS.md`. It matters for testing because a field that is
matchable but undocumented is a field nobody wrote a case for — which is exactly how these escape
to customers.

---

## 8 · What this means for catching the next one

The family is defined by a single question, and it is the question every case in this folder asks:

> **If this row came back because of field X, can the user see field X — in full — on the row?**

Three things have to be true, and each has its own failure mode:

| # | Must be true | Fails as | Cases |
|---|---|---|---|
| 1 | the matched field is **in the row payload** | "why is this here?" | Class C |
| 2 | the row **renders** that field | §5 customer-phone gap | Class C, D |
| 3 | the rendering is **complete, not clipped** | SV-10619, SV-10551 | Class A |

And one consequence, which is the user's own example and the story's own sentence:

| 4 | two records sharing the typed fragment are **distinguishable** | `123786` vs `185786` | Class B |

The suite is built from that grid: every tab × every matchable field × these four questions.
