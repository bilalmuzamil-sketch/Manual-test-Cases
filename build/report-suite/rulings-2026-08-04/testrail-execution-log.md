# TestRail execution log — QA-lead rulings pass, 2026-08-04

Every operation, its target, its HTTP status and its byte-level verification result (Standing Rule 50).
An entry recording only "200 OK" would be non-compliant, so each row states exactly how many fields
were compared and how many differed.

**Verification method per write:** full `get_case` snapshot before → `update_case`/`delete_case` →
`get_case` again → **every field compared**: each intended field against the intended payload, and
**every other field proven byte-identical to the pre-write snapshot**. A mismatch is treated as a
FAILED write: the batch stops and both byte sequences are reported. Snapshots: `/tmp/testrail/snapshots/`.

**Declared normalisation (the only one relied on):** TestRail's `refs` field splits on commas, trims
each entry and rejoins with a bare comma, and rejects any single entry over 248 characters with
HTTP 400 `Field :refs does not match the required pattern.` So `refs` is compared under
`','.join(p.strip() for p in s.split(','))`.

**Build marker:** `v3.4.1-0ed4433`, `index.html` last-modified Mon, 03 Aug 2026 13:40:38 GMT,
etag `02091e9dc11f187d7739b4efa166ea21` — captured at the start **and** the end of the pass, identical.

---

## RULING 1 — the 15 cases (see RULING-1-THE-15-CASES.md)

| # | Operation | Target | HTTP | Byte-level verification |
|---|---|---|---|---|
| 1 | `update_case` | **C30259** (SBR-DEACT-08) | **200** | **30 fields compared, 1 intended (`custom_expected`), 0 mismatch** — all 29 others byte-identical |
| 2 | `update_case` | **C30255** (SBR-DEACT-04) | **200** | **30 fields compared, 1 intended (`custom_expected`), 0 mismatch** — all 29 others byte-identical |

**Op 1 — why:** the error toast observed live reads **"Ooooops! An error occurred"**. Our case
misspelled it **"occured"**, which would make a literal-minded tester fail a correct toast.
Rule-41 whole-case re-read of C30259 against SBR spec v15 (2026-07-29): re-verified whole against
SBR specification v15 — title, preconditions, all 3 steps, all 3 expected results, refs, section, type
and the provenance line all checked; the caption text matched the build verbatim including the
`[{request-id}]` placeholder; provenance line already current; **1 defect found and fixed, 0 others.**

**Op 2 — why:** Cancel renders **grey** and Deactivate renders **red**; the case called Cancel
"red outline", which is the wrong control.
Rule-41 whole-case re-read of C30255 against SBR spec v15: re-verified whole against SBR specification
v15 — all 5 expected results driven live, refs and provenance line current. **Second finding recorded,
not silently left:** expectation 3 (Escape does not dismiss) **contradicts spec S13-R8**, which says it
does. The build agrees with our case, so no change was made; the divergence is logged in
RULING-1-THE-15-CASES.md and raised as a spec correction for Chris Ward.

**Not written, and why:** no case among the 15 contained an SV-8821 reference or any
"known issue / filed for a fix" line — grepped for `8821`, "known issue", "filed for a fix", "blocked",
"server error", "cannot be run": **zero hits**. All 15 provenance lines already carried the correct
build date (8/4/2026), specification version and anchors, so **no re-stamp was required**.

**Run 359: NOT touched by Ruling 1** — `update_case` cannot change a run's selection, and no
`add_case`/`delete_case` was performed in this ruling.
