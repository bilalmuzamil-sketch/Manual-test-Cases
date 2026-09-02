# Decision — the Add Part design gets NO design-reference line on suites 6597 / 6617

**Date:** 2026-09-02 · **Asked by the QA lead:** *"do you think we need to do the same for the Print
wo and Inline part suites? If that would make the test cases runnable and easy to follow for a manual
tester Viktoria? If yes then go ahead … Otherwise Ignore."*

**Answer: NO for both suites.** Five reasons, each checked rather than assumed.

## 1 · This design is not new — it is the source we already ingested on 2026-08-25

The zip's substantive file is `Add Part.html` (292,716 bytes). Its text is the SAME design already held
at `build/inline-add-edit-parts/intake-2026-08-25/sources/design-add-part-text-extract.txt`.

Diff of the two extracts, lines of 4+ characters, both directions:

| Direction | Lines |
|---|---|
| in the 2026-09-02 extract only | `Print Work Order` · `Pulled from` — both extraction artefacts, present in the HTML of both |
| in the 2026-08-25 extract only | `Auto-allocate` · `Main Storage` · `Overflow Rack` · `Shelf A3` · `Default` · `(ALF9080) Air Filter, Primary — allocate 23 EA` · `Total 23 EA — quantity on the row stays 23` · `−2` |

So the **older extract is the more complete one** (it captured the Bin Locations modal in its populated
state). Nothing arrived that the suite was not already built from.

## 2 · For 6597 the source of expectation is the SPEC, and the spec already carries the design's words

The Invoice case was different: the developer said that feature *"is just a design improvement"*, so the
design **was** the source. Here the spec is, and it is more specific than the design. Checked on five of
the cases the design depicts — each already quotes the design's own strings verbatim **and** cites a
spec section:

| Case | Spec anchor in its provenance | Verbatim strings it already carries |
|---|---|---|
| **C45069** | SV-9321 Story 6, spec v16 **S6-R1** | `Discard this part?` · `The details you entered will be lost.` · `Keep Editing` · `Discard Part` |
| **C45073** | SV-9321 Story 6, spec v16 **S6-R4** | `Leave without saving?` · `This part hasn't been added to the work order yet. Leaving will discard it.` · `Stay on Work Order` · `Leave` |
| **C45221** | Story 7, spec v16 **S7-R1** | bins, on-hand quantity, exactly one Default bin |
| **C45049** | SV-9319 Story 4, spec v16 **S4-R14** | Shift+Enter opens More Options |
| **C45009** | SV-9317 Story 2, spec v16 **S2-R13** + Keyboard Model — Inline Row | the Tech View Tab order, `Pulled from` |

A design line would add a second, weaker pointer to wording the case already states.

## 3 · There is no link the tester could open

The Invoice reference works because a URL was supplied
(`https://claude.ai/code/artifact/c88ee207-…`). For this design there is only the zip. A provenance line
naming a document Viktoria cannot reach is noise, not help. **This is the one thing that would flip the
answer** — given a shareable link, the ~34 cases below become worth one pass.

## 4 · Suite 6617 (Printer Friendly Work Orders) has no design in this set at all

`Print Work Order` occurs **once in the whole zip**, as a More-menu item. The only print artwork is the
invoice document panel — `Document`: `Invoice` · `Estimate` · `Payment Receipt` · `Credit Memo`, with no
"Work Order" option — which is the **Invoice UI Refresh** feature, not the printed work order. Citing it
on 6617 would send the tester to another feature's artwork.

## 5 · The zip's other six files disagree with the build, so they must not be cited

`Work Order Details Page.html` says **`Add New Part`**; the build says **`+ Add Part`**
(`build/OBSERVED-UI-LABELS-sv9315.md`). `Work Order Line.html`, `Work Order Line v1.html`,
`Work Order Line - Bundled.html` and `Customer Page.html` contain none of the add-part flow.

## Cost that would have been paid for no gain

6597 is handed off on **run 418 (122 tests)** and Viktoria is reading those cases now. A 122-case rewrite
is a deadlock-prone UI pass that changes what she is reading mid-run.

---

## What the design WAS used for — the cases it depicts, and one gap

Overlap measured by design marker (`/tmp/handoff/inline-design-overlap.json`), **34 cases**:

| Design element | Cases |
|---|---|
| `Pulled from` bin chip | C45009 · C45025 · C45050 · C45224 · C45226 · C45227 · C45232 · C45238 · C45239 |
| `More options` | C45025 · C45041 · C45044 · C45045 · C45046 · C45047 · C45049 · C45057 · C45060 |
| `Bin Locations` modal (`Bin name` / `Quantity in stock` / `Amount` / `Cancel` / `Apply`) | C45221 · C45232 · C45233 · C45234 · C45235 · C45243 |
| `Sell price` | C45058 · C45059 · C45060 · C45252 · C45253 |
| discard guard (`Discard this part?` / `Keep Editing` / `Discard Part`) | C45047 · C45069 · C45070 · C45071 · C45072 · C45074 |
| navigate-away guard (`Leave without saving?` / `Stay on Work Order`) | C45073 · C45083 |
| `Core charge` · `Margin` in the More-options modal | C45251 |

Keyboard contract (`Enter` save & next row · `Tab` next field · `Esc` cancel · `⇧Enter` more options) is
covered by 11 cases: C44991 · C45008 · C45009 · C45014 · C45025 · C45048 · C45050 · C45053 · C45238 (Tab/
Enter/Esc) and C45049 · C45053 (Shift+Enter).

### 🔎 GAP — the unpriced-parts approval gate is in the design and in NO case

The design carries a whole dialog: **`3 parts unpriced`** · **`Margin on this line is provisional`** ·
*"Approving sends the line to the customer with no price on these parts. The line total and margin will
change once they're priced."* · **`Price them first`** · **`Approve anyway`**.

Grep over the case bodies for `unpriced|Approve anyway|Price them first|Margin on this line` → **0 hits**.
`AI ShopCoach Parts Guide` (also in the design's Add part modal) → **0 hits**.

**Not acted on.** Approving a line is arguably the Work Order Line feature rather than Inline Add and Edit
Parts, and no case is created without the QA lead's permission. Reported as a decision item.

**Freshness of the grep:** case bodies came from the 2026-09-01 06:19 snapshot (119 cases) plus the four
manual additions' payloads — **not live**, because this container came up with no TestRail credentials
(`TESTRAIL_API_KEY` absent, `/tmp/shopview-creds.env` gone, `init_creds.sh` fails). Titles and body text
are stable across the 2026-09-01 write pass, so the 0-hit result stands; re-run it live when credentials
are back.
