# Rule-49 re-check queue — Schedule, opened 2026-08-06

**STATUS: OPEN.** The `sv8685` QA branch has **not** been declared final, so every one of the 168
verdicts is **PROVISIONAL**. Re-run this queue when the branch is declared final, or the moment the
app-version marker moves.

**Check at every session start:** `ls build/*/viu-*/RECHECK-QUEUE.md build/*/full-viu-*/RECHECK-QUEUE.md`

## Build markers this queue covers

| Marker | Cases | Read at |
|---|---|---|
| **`v3.5-7ec992f`** · last-modified Wed 05 Aug 2026 22:49:36 GMT · etag `e2a80a6ab5e0b47c29fd88af9db1e980` · `index.html` sha256 `66e91c527d587216c80f5111c294ddc39a34049e59e3769bef110b7836dbbc53` | **90** | 06:03:34Z and 06:37:13Z on 6 Aug — **byte-identical**, no redeploy under the session |
| **`v3.5-d122eef`** — **SUPERSEDED, gone** | **78** | 5 Aug |

**Every case names its own marker in its Expected Results**, so a reader never has to guess which half a
verdict came from.

## What must be re-confirmed, and why

| Priority | Rows | What to re-check |
|---|---|---|
| **1** | the **78** on `v3.5-d122eef` | Their build no longer exists. This session proved the risk is real seven times over — SV-8857, SV-8849 and SV-8850 were all fixed while their tickets sat open. Re-drive them, deviations first. |
| **2** | the **7** marked `HOLD - not re-checked against the current build` | C29967, C29982, C29984, C29985, C30004, C30013, C30020. They need a drag that our tooling cannot perform. Drive them by hand, or restore the click-to-arm control (SV-8957) and use that. |
| **3** | the **13** marked `HOLD - needs a second sign-in` | The whole Permissions area plus C30044, C38872, C38874, C38926. Needs a non-administrator sign-in in an exclusive window. |
| **4** | the **21** `READY - EXPECT FAIL` rows | Each names a ticket. If any stops reproducing, the marker and the three-outcome block must both be removed — a case told to expect a failure that no longer happens is worse than a stale one. |
| **5** | the **3** `NOT BUILT` rows | C38868, C38869, C38871. Re-check whether the Dashboard schedule section, the appointment on work order creation and the Priority field have shipped. |

## Re-run recipe

1. Read `<meta name="app-version">` plus `last-modified` and `etag` on `index.html` at the start, at every
   batch boundary and at the end. Record all of them.
2. Re-derive the case set by **CASE ID** from the live group, never by counting lines in a file.
3. Re-drive each row live. **Nothing is inferred from ticket status** — this session proved ticket status
   does not track build state.
4. Flip each row to **CONFIRMED** or **CHANGED** with fresh evidence. A row that flips to CHANGED is a
   finding in its own right and is reported, not quietly corrected.
5. Re-stamp the provenance line and the marker on every case touched (Rule 54 — a re-check without a
   re-stamp is not a re-check).
6. Close the queue only at **100%**.

## Rows

The full per-row detail is the two verdict files, which carry the observation, the evidence file and the
build marker for every case:

* `evidence/batch10/VERDICTS.json` — the 27 that had no verdict before this session
* `evidence/batch11/VERDICTS.json` — the 25 stale deviations, plus the C29962 regression
* `evidence/batch1/`…`batch8/VERDICTS.json` — the earlier 141

The single authoritative per-case state table, build marker included, is
`snapshots/POST-WRITE-168-2026-08-06.json` read together with `write_plan_2026-08-06.py`.
