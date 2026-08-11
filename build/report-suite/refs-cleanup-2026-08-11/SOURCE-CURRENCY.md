# Report Suite — source currency, refs-cleanup pass, 2026-08-11

Every figure here was **read live in this pass** from the Confluence version API. Nothing is
inherited from the earlier passes of today, and where a figure agrees with them that is stated as
confirmation rather than assumed as a starting point.

---

## 1 · The six specifications — established live, and confirmed BY CONTENT

**The brief asked for these to be confirmed rather than inherited, and confirmed by content — so
each anchor a case cites was located in the body of the version now being named, not merely
assumed to still exist.**

| Report | Confluence page | HTTP | **Live version** | Published (UTC) | Last editor | Verdict |
|---|---|---|---|---|---|---|
| Sales By Customer | 577634305 | 200 | **17** | 2026-08-10T17:22:42Z | Chris Ward | CURRENT |
| Sales By Representative | 585629698 | 200 | **18** | 2026-08-07T03:43:08Z | Chris Ward | CURRENT |
| Parts Velocity | 620888066 | 200 | **6** | 2026-08-07T03:43:09Z | Chris Ward | CURRENT |
| Technician Utilization | 641400833 | 200 | **7** | 2026-08-07T03:43:12Z | Chris Ward | CURRENT |
| Work In Progress | 703660034 | 200 | **11** | 2026-08-10T17:21:17Z | Chris Ward | CURRENT |
| Inventory Value | 720142338 | 200 | **5** | 2026-08-07T03:43:11Z | Chris Ward | CURRENT |

**All six agree with the figures the refs-pins pass measured earlier today**, so nothing moved in
the intervening hours. Evidence: `evidence/<report>-v<N>-meta.json` and the full storage-format
bodies beside them.

### The API integer is the only marker — verified, not assumed

**Standing Rule 31 trap (a)** is that a page's in-body "Version" field can sit still while the real
version advances. **On these six pages the trap cannot fire, because there is no in-body version
field at all.** Every six bodies were searched: the only hits for the word "version" are prose
about *report* formats — *"a Summary version or an Expanded version"*, *"its store version does not
match the current one"* — and none of them is a document version marker. **So the Confluence
version integer is the only currency signal these pages have**, and it is what every pin now names.

### Content confirmation, per case, not per page

A version number matching is not the same as the requirement still being there. So for all **95**
cases written:

- **375 anchors cited, 0 absent** from the live body of the version now named.
- The three citations that name a section sign rather than an anchor were checked by locating the
  **literal heading text**: `7. User Feedback Summary` in SBC v17, and `3. Key Decisions` plus the
  accounting-parentheses and half-up-rounding sentences in SBR v18. All present.
- Anchor totals in the live bodies: SBC 240 · SBR 228 · PV 74 · TU 122 · WIP 124 · IV 113.

Full working: `logs/anchor-verification.txt`.

---

## 2 · Rule 59 — the sources were re-read again immediately before the writes began

| | Time (UTC) | Result |
|---|---|---|
| Sources read at **pass start** | 2026-08-11T21:00:5xZ | six versions established |
| Sources **re-read at write start** | **2026-08-11T21:09:50Z** | **all six UNCHANGED — safe to write** |

Recorded in `evidence/reread-at-write-start.json`. This is the cheap check Rule 59 requires, and it
is not theoretical on this project: Chris Ward edited **all six specifications inside a single
running pass** on 5 August, one of them **sixty seconds before it was fetched**.

---

## 3 · The build — deliberately absent, and why that is correct here

**No build was observed in this pass, and none was needed.** The QA-branch session is expired
estate-wide, and this pass changes **only `refs`** — a traceability field. **Rule 54 sentence 2, the
"Last checked against build … on …" line, was not touched on any case**, which the writer asserted
byte-exact on every one of the 95 writes rather than trusting the payload.

**Claiming a build fact here would have been a Rule 12 violation with nothing to gain**: a version
pin points at a document, and no document's version is evidence about a build.

---

## 4 · Other sources — not consulted, and not needed

| Source | State | Why it does not bear on this pass |
|---|---|---|
| Epic **SV-8582** | not re-read | No ticket key was added, removed or changed on any case. |
| Designs | none exist for this project | Spec-only authoring; unchanged. |
| Engineering tech plan | committed copy, unchanged | Cited by 2 of the 95 cases, and their citation of it was not touched. |
| PO answers (Chris Ward) | unchanged | Several cases cite them; no citation of an answer was altered. |

**Nothing in this pass is blocked on a source we could not obtain.**
