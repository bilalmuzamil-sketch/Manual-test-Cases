# Problem 3 re-checked, 25 September 2026 — and narrowed

The first reading was taken on a work order with **no finished line** and with the tick-lines bar
closed. Two of the four things I called missing were my own doing. Re-checked properly:

## What was done this time
- Two work orders that DO carry finished lines (S2-810, three finished plus one declined; S2-786, finished).
- Every line **expanded**, every line **selected**, the bar's **More** opened.
- Every line row **hovered** first, and every three-dot menu on it opened.
- The whole page searched for every word the product might use instead.

## Corrected — two of my four were wrong

| What I said | What is actually true |
|---|---|
| "Request part" is missing | **Wrong.** The product's word for it is **Add Part**, present on every line that can take one, and the parts tab is served at `/part-requests`. Same thing, different word |
| "Authorization required" is missing | **Partly wrong.** It exists, in the tick-lines bar's More, but **only when a line awaiting approval is selected** - never on an approved or finished line. That is a placement difference, not an absent feature |

## Confirmed — and these stand

| | Evidence |
|---|---|
| **A finished line cannot be reopened** | On two work orders carrying finished lines, with every line expanded and selected: no *Uncomplete*, *Un-complete*, *Reopen*, *Re-open*, *Undo complete*, *Mark incomplete* - on the row, in its menu, in the bar or its More, or anywhere in the page text |
| **A line cannot be deleted** | No *Delete line*, *Remove line*, *Delete* or *Remove* anywhere on the work order screen. There is no pencil on a line row either, so there is no line editor to hold one |
| **A finished line offers nothing at all** | Its Action column is empty and its three-dot menu holds one item: *Add Labor Fee / Discount* |
| **The bar on finished lines** | With four lines selected it reads *Create Invoice, More, close*; More holds only *Split work order* |
| **Decline on an approved line** | Not offered. It exists in the bar's More for lines awaiting approval only |

## What each check needs
- C44565 - reopening a finished line: no route exists.
- C44566 - the buttons a line offers: *Delete line* absent everywhere; *Decline* and *Authorization
  required* not on an approved line; *Request part* is satisfied by *Add Part*.
- C44567 - decline greyed with its reason: cannot happen, decline is not offered on an approved line.
- C44602 - the line's three-dot menu: holds one item where seven are expected.
- C44603 - *Uncomplete* only on a finished line: it is nowhere, so the negative cannot be checked.

Raw readings: `recheck-problem3.json`, `synonym-search.json`, `line-editor.json`, and the screenshots
`recheck-*.png`, `synonyms-*.png`.
