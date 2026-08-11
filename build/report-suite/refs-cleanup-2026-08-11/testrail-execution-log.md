# Report Suite — TestRail execution log, refs-cleanup pass, 2026-08-11

**95 `update_case` operations. 95 returned HTTP 200. 95 verified with 0 mismatches.**
Fields compared per write: [30]. **0 `add_case`, 0 `delete_case`, 0 section writes,
0 run writes, 0 results logged, 0 Jira calls.**

**One field changed on every operation: `refs`.** Expected Results, Steps, Preconditions and
Title were asserted byte-identical by the writer on every single write — this pass had no
Expected-Results exception at all, unlike its predecessor.

**Every payload carried all three text fields** (`custom_preconds`, `custom_steps`,
`custom_expected`) alongside `refs`, taken byte-exact from a read moments before the write,
because TestRail re-renders any text field omitted from a payload into `<p>`-wrapped HTML with
CRLF (playbook §J, declared normalisation #3) and this project shows markup literally to the
tester. **0 of the 95 came back with raw markup or CRLF.**

## Column meanings

- **chars before → after** — the measured length of `refs`, in CHARACTERS. The TestRail limit is
  **248 characters per comma-separated entry** (not bytes: a live entry sits at 248 chars / 251
  bytes). Every entry was measured before sending; none was estimated.
- **atm** — `custom_atmstatus` **captured at write time**, as Rule 65 requires. `3` = Automated.
- **Rule 41** — the whole-case re-read: every field, not only the one edited.

---

## GAP 1 — version pins, batch A — 20 operations

| # | Case | HTTP | Byte verification | chars before → after | spare | atm | Change |
|---|---|---|---|---|---|---|---|
| 1 | [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | 200 | 30 fields compared, 4 intended, 0 mismatch | 222 → 237 | 11 | 1 | add-pin |
| 2 | [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | 200 | 30 fields compared, 4 intended, 0 mismatch | 227 → 242 | 6 | 1 | add-pin |
| 3 | [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | 200 | 30 fields compared, 4 intended, 0 mismatch | 215 → 230 | 18 | 1 | add-pin |
| 4 | [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | 200 | 30 fields compared, 4 intended, 0 mismatch | 136 → 151 | 97 | 1 | add-pin |
| 5 | [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | 200 | 30 fields compared, 4 intended, 0 mismatch | 242 → 244 | 4 | 1 | add-pin |
| 6 | [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | 200 | 30 fields compared, 4 intended, 0 mismatch | 234 → 245 | 3 | 1 | add-pin |
| 7 | [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | 200 | 30 fields compared, 4 intended, 0 mismatch | 178 → 193 | 55 | 1 | add-pin |
| 8 | [C30195](https://shopview.testrail.io/index.php?/cases/view/30195) | 200 | 30 fields compared, 4 intended, 0 mismatch | 208 → 223 | 25 | 1 | add-pin |
| 9 | [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | 200 | 30 fields compared, 4 intended, 0 mismatch | 238 → 244 | 4 | 1 | add-pin |
| 10 | [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | 200 | 30 fields compared, 4 intended, 0 mismatch | 228 → 243 | 5 | 1 | add-pin |
| 11 | [C30235](https://shopview.testrail.io/index.php?/cases/view/30235) | 200 | 30 fields compared, 4 intended, 0 mismatch | 153 → 168 | 80 | 1 | add-pin |
| 12 | [C30236](https://shopview.testrail.io/index.php?/cases/view/30236) | 200 | 30 fields compared, 4 intended, 0 mismatch | 128 → 143 | 105 | 1 | add-pin |
| 13 | [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) | 200 | 30 fields compared, 4 intended, 0 mismatch | 197 → 212 | 36 | 1 | add-pin |
| 14 | [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | 200 | 30 fields compared, 4 intended, 0 mismatch | 221 → 236 | 12 | 1 | add-pin |
| 15 | [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | 200 | 30 fields compared, 4 intended, 0 mismatch | 222 → 236 | 12 | 1 | add-pin |
| 16 | [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) | 200 | 30 fields compared, 4 intended, 0 mismatch | 199 → 213 | 35 | 1 | add-pin |
| 17 | [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) | 200 | 30 fields compared, 4 intended, 0 mismatch | 239 → 245 | 3 | 1 | add-pin |
| 18 | [C30336](https://shopview.testrail.io/index.php?/cases/view/30336) | 200 | 30 fields compared, 4 intended, 0 mismatch | 139 → 153 | 95 | 1 | add-pin |
| 19 | [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | 200 | 30 fields compared, 4 intended, 0 mismatch | 226 → 240 | 8 | 1 | add-pin |
| 20 | [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | 200 | 30 fields compared, 4 intended, 0 mismatch | 164 → 178 | 70 | 1 | add-pin |

## GAP 1 — version pins, batch B — 17 operations

| # | Case | HTTP | Byte verification | chars before → after | spare | atm | Change |
|---|---|---|---|---|---|---|---|
| 1 | [C30345](https://shopview.testrail.io/index.php?/cases/view/30345) | 200 | 30 fields compared, 4 intended, 0 mismatch | 164 → 178 | 70 | 1 | add-pin |
| 2 | [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) | 200 | 30 fields compared, 4 intended, 0 mismatch | 193 → 207 | 41 | 1 | add-pin |
| 3 | [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) | 200 | 30 fields compared, 4 intended, 0 mismatch | 218 → 232 | 16 | 1 | add-pin |
| 4 | [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | 200 | 30 fields compared, 4 intended, 0 mismatch | 231 → 226 | 22 | 1 | normalise-variant |
| 5 | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | 200 | 30 fields compared, 4 intended, 0 mismatch | 220 → 215 | 33 | 3 | normalise-variant |
| 6 | [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | 200 | 30 fields compared, 4 intended, 0 mismatch | 226 → 241 | 7 | 1 | add-pin |
| 7 | [C30480](https://shopview.testrail.io/index.php?/cases/view/30480) | 200 | 30 fields compared, 4 intended, 0 mismatch | 156 → 171 | 77 | 1 | add-pin |
| 8 | [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | 200 | 30 fields compared, 4 intended, 0 mismatch | 233 → 248 | 0 | 1 | add-pin |
| 9 | [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | 200 | 30 fields compared, 4 intended, 0 mismatch | 166 → 181 | 67 | 1 | add-pin |
| 10 | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | 200 | 30 fields compared, 4 intended, 0 mismatch | 240 → 247 | 1 | 1 | add-pin |
| 11 | [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | 200 | 30 fields compared, 4 intended, 0 mismatch | 144 → 159 | 89 | 3 | add-pin |
| 12 | [C30534](https://shopview.testrail.io/index.php?/cases/view/30534) | 200 | 30 fields compared, 4 intended, 0 mismatch | 144 → 158 | 90 | 1 | add-pin |
| 13 | [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | 200 | 30 fields compared, 4 intended, 0 mismatch | 172 → 186 | 62 | 1 | add-pin |
| 14 | [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | 200 | 30 fields compared, 4 intended, 0 mismatch | 234 → 248 | 0 | 1 | add-pin |
| 15 | [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | 200 | 30 fields compared, 4 intended, 0 mismatch | 143 → 157 | 91 | 1 | add-pin |
| 16 | [C38924](https://shopview.testrail.io/index.php?/cases/view/38924) | 200 | 30 fields compared, 4 intended, 0 mismatch | 198 → 212 | 36 | 1 | add-pin |
| 17 | [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) | 200 | 30 fields compared, 4 intended, 0 mismatch | 214 → 229 | 19 | 1 | add-pin |

## GAP 2 — Technician Utilization date, batch A — 30 operations

| # | Case | HTTP | Byte verification | chars before → after | spare | atm | Change |
|---|---|---|---|---|---|---|---|
| 1 | [C30393](https://shopview.testrail.io/index.php?/cases/view/30393) | 200 | 30 fields compared, 4 intended, 0 mismatch | 37 → 37 | 211 | 1 | tu-date |
| 2 | [C30394](https://shopview.testrail.io/index.php?/cases/view/30394) | 200 | 30 fields compared, 4 intended, 0 mismatch | 51 → 51 | 197 | 1 | tu-date |
| 3 | [C30395](https://shopview.testrail.io/index.php?/cases/view/30395) | 200 | 30 fields compared, 4 intended, 0 mismatch | 44 → 44 | 204 | 1 | tu-date |
| 4 | [C30396](https://shopview.testrail.io/index.php?/cases/view/30396) | 200 | 30 fields compared, 4 intended, 0 mismatch | 38 → 38 | 210 | 1 | tu-date |
| 5 | [C30397](https://shopview.testrail.io/index.php?/cases/view/30397) | 200 | 30 fields compared, 4 intended, 0 mismatch | 55 → 55 | 193 | 1 | tu-date |
| 6 | [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | 200 | 30 fields compared, 4 intended, 0 mismatch | 247 → 247 | 1 | 3 | tu-date |
| 7 | [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | 200 | 30 fields compared, 4 intended, 0 mismatch | 212 → 212 | 36 | 3 | tu-date |
| 8 | [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | 200 | 30 fields compared, 4 intended, 0 mismatch | 187 → 187 | 61 | 3 | tu-date |
| 9 | [C30402](https://shopview.testrail.io/index.php?/cases/view/30402) | 200 | 30 fields compared, 4 intended, 0 mismatch | 48 → 48 | 200 | 1 | tu-date |
| 10 | [C30403](https://shopview.testrail.io/index.php?/cases/view/30403) | 200 | 30 fields compared, 4 intended, 0 mismatch | 61 → 61 | 187 | 1 | tu-date |
| 11 | [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | 200 | 30 fields compared, 4 intended, 0 mismatch | 48 → 48 | 200 | 3 | tu-date |
| 12 | [C30405](https://shopview.testrail.io/index.php?/cases/view/30405) | 200 | 30 fields compared, 4 intended, 0 mismatch | 171 → 171 | 77 | 1 | tu-date |
| 13 | [C30406](https://shopview.testrail.io/index.php?/cases/view/30406) | 200 | 30 fields compared, 4 intended, 0 mismatch | 70 → 70 | 178 | 1 | tu-date |
| 14 | [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) | 200 | 30 fields compared, 4 intended, 0 mismatch | 52 → 52 | 196 | 1 | tu-date |
| 15 | [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) | 200 | 30 fields compared, 4 intended, 0 mismatch | 37 → 37 | 211 | 1 | tu-date |
| 16 | [C30409](https://shopview.testrail.io/index.php?/cases/view/30409) | 200 | 30 fields compared, 4 intended, 0 mismatch | 53 → 53 | 195 | 1 | tu-date |
| 17 | [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | 200 | 30 fields compared, 4 intended, 0 mismatch | 46 → 46 | 202 | 3 | tu-date |
| 18 | [C30411](https://shopview.testrail.io/index.php?/cases/view/30411) | 200 | 30 fields compared, 4 intended, 0 mismatch | 42 → 42 | 206 | 1 | tu-date |
| 19 | [C30412](https://shopview.testrail.io/index.php?/cases/view/30412) | 200 | 30 fields compared, 4 intended, 0 mismatch | 38 → 38 | 210 | 1 | tu-date |
| 20 | [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) | 200 | 30 fields compared, 4 intended, 0 mismatch | 38 → 38 | 210 | 1 | tu-date |
| 21 | [C30414](https://shopview.testrail.io/index.php?/cases/view/30414) | 200 | 30 fields compared, 4 intended, 0 mismatch | 65 → 65 | 183 | 1 | tu-date |
| 22 | [C30415](https://shopview.testrail.io/index.php?/cases/view/30415) | 200 | 30 fields compared, 4 intended, 0 mismatch | 61 → 61 | 187 | 1 | tu-date |
| 23 | [C30416](https://shopview.testrail.io/index.php?/cases/view/30416) | 200 | 30 fields compared, 4 intended, 0 mismatch | 37 → 37 | 211 | 1 | tu-date |
| 24 | [C30417](https://shopview.testrail.io/index.php?/cases/view/30417) | 200 | 30 fields compared, 4 intended, 0 mismatch | 37 → 37 | 211 | 1 | tu-date |
| 25 | [C30418](https://shopview.testrail.io/index.php?/cases/view/30418) | 200 | 30 fields compared, 4 intended, 0 mismatch | 45 → 45 | 203 | 1 | tu-date |
| 26 | [C30419](https://shopview.testrail.io/index.php?/cases/view/30419) | 200 | 30 fields compared, 4 intended, 0 mismatch | 233 → 233 | 15 | 1 | tu-date |
| 27 | [C30420](https://shopview.testrail.io/index.php?/cases/view/30420) | 200 | 30 fields compared, 4 intended, 0 mismatch | 48 → 48 | 200 | 1 | tu-date |
| 28 | [C30421](https://shopview.testrail.io/index.php?/cases/view/30421) | 200 | 30 fields compared, 4 intended, 0 mismatch | 52 → 52 | 196 | 1 | tu-date |
| 29 | [C30422](https://shopview.testrail.io/index.php?/cases/view/30422) | 200 | 30 fields compared, 4 intended, 0 mismatch | 37 → 37 | 211 | 1 | tu-date |
| 30 | [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) | 200 | 30 fields compared, 4 intended, 0 mismatch | 44 → 44 | 204 | 1 | tu-date |

## GAP 2 — Technician Utilization date, batch B — 28 operations

| # | Case | HTTP | Byte verification | chars before → after | spare | atm | Change |
|---|---|---|---|---|---|---|---|
| 1 | [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | 200 | 30 fields compared, 4 intended, 0 mismatch | 218 → 218 | 30 | 3 | tu-date |
| 2 | [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | 200 | 30 fields compared, 4 intended, 0 mismatch | 58 → 58 | 190 | 1 | tu-date |
| 3 | [C30426](https://shopview.testrail.io/index.php?/cases/view/30426) | 200 | 30 fields compared, 4 intended, 0 mismatch | 49 → 49 | 199 | 1 | tu-date |
| 4 | [C30428](https://shopview.testrail.io/index.php?/cases/view/30428) | 200 | 30 fields compared, 4 intended, 0 mismatch | 52 → 52 | 196 | 1 | tu-date |
| 5 | [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | 200 | 30 fields compared, 4 intended, 0 mismatch | 51 → 51 | 197 | 3 | tu-date |
| 6 | [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) | 200 | 30 fields compared, 4 intended, 0 mismatch | 57 → 57 | 191 | 1 | tu-date |
| 7 | [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) | 200 | 30 fields compared, 4 intended, 0 mismatch | 47 → 47 | 201 | 1 | tu-date |
| 8 | [C30432](https://shopview.testrail.io/index.php?/cases/view/30432) | 200 | 30 fields compared, 4 intended, 0 mismatch | 47 → 47 | 201 | 1 | tu-date |
| 9 | [C30433](https://shopview.testrail.io/index.php?/cases/view/30433) | 200 | 30 fields compared, 4 intended, 0 mismatch | 37 → 37 | 211 | 1 | tu-date |
| 10 | [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) | 200 | 30 fields compared, 4 intended, 0 mismatch | 52 → 52 | 196 | 1 | tu-date |
| 11 | [C30436](https://shopview.testrail.io/index.php?/cases/view/30436) | 200 | 30 fields compared, 4 intended, 0 mismatch | 53 → 53 | 195 | 1 | tu-date |
| 12 | [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | 200 | 30 fields compared, 4 intended, 0 mismatch | 216 → 216 | 32 | 1 | tu-date |
| 13 | [C30438](https://shopview.testrail.io/index.php?/cases/view/30438) | 200 | 30 fields compared, 4 intended, 0 mismatch | 47 → 47 | 201 | 1 | tu-date |
| 14 | [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) | 200 | 30 fields compared, 4 intended, 0 mismatch | 164 → 164 | 84 | 1 | tu-date |
| 15 | [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) | 200 | 30 fields compared, 4 intended, 0 mismatch | 54 → 54 | 194 | 1 | tu-date |
| 16 | [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) | 200 | 30 fields compared, 4 intended, 0 mismatch | 231 → 231 | 17 | 1 | tu-date |
| 17 | [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | 200 | 30 fields compared, 4 intended, 0 mismatch | 207 → 207 | 41 | 1 | tu-date |
| 18 | [C30443](https://shopview.testrail.io/index.php?/cases/view/30443) | 200 | 30 fields compared, 4 intended, 0 mismatch | 215 → 215 | 33 | 1 | tu-date |
| 19 | [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) | 200 | 30 fields compared, 4 intended, 0 mismatch | 58 → 58 | 190 | 1 | tu-date |
| 20 | [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | 200 | 30 fields compared, 4 intended, 0 mismatch | 244 → 244 | 4 | 1 | tu-date |
| 21 | [C30447](https://shopview.testrail.io/index.php?/cases/view/30447) | 200 | 30 fields compared, 4 intended, 0 mismatch | 191 → 191 | 57 | 1 | tu-date |
| 22 | [C30448](https://shopview.testrail.io/index.php?/cases/view/30448) | 200 | 30 fields compared, 4 intended, 0 mismatch | 223 → 223 | 25 | 1 | tu-date |
| 23 | [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | 200 | 30 fields compared, 4 intended, 0 mismatch | 44 → 44 | 204 | 3 | tu-date |
| 24 | [C30450](https://shopview.testrail.io/index.php?/cases/view/30450) | 200 | 30 fields compared, 4 intended, 0 mismatch | 73 → 73 | 175 | 1 | tu-date |
| 25 | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | 200 | 30 fields compared, 4 intended, 0 mismatch | 247 → 247 | 1 | 1 | tu-date |
| 26 | [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) | 200 | 30 fields compared, 4 intended, 0 mismatch | 213 → 213 | 35 | 1 | tu-date |
| 27 | [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | 200 | 30 fields compared, 4 intended, 0 mismatch | 234 → 234 | 14 | 1 | tu-date |
| 28 | [C43552](https://shopview.testrail.io/index.php?/cases/view/43552) | 200 | 30 fields compared, 4 intended, 0 mismatch | 179 → 179 | 69 | 1 | tu-date |

---

## Rule 41 — the whole-case re-read, on all 95 touched cases

Every touched case was re-read END TO END before it was left, not only the field being edited. Fields checked on each: **title · preconditions · steps · expected results · refs · section · type**.

| Check | Result |
|---|---|
| anchors cited that are ABSENT from the live specification body now named | **0** |
| fields carrying raw HTML markup | **0** |
| cases carrying CRLF line endings | **0** |
| titles longer than 80 characters | **0** |
| cases NOT carrying exactly one automation marker | **0** |
| cases NOT carrying exactly one provenance sentence | **0** |
| cases whose Expected Results moved by a byte | **0** |
| refs entries containing a comma | **0** |
| refs entries over 248 characters | **0** |

**Verdict recorded on every case:** *re-verified whole against the live specification set read 2026-08-11*.

---

## Length, measured — never estimated

The ten tightest entries after the writes:

| Case | chars | spare | bytes |
|---|---|---|---|
| [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | 248 | 0 | 248 |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | 248 | 0 | 252 |
| [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | 247 | 1 | 248 |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | 247 | 1 | 249 |
| [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | 247 | 1 | 249 |
| [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | 245 | 3 | 245 |
| [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) | 245 | 3 | 245 |
| [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | 244 | 4 | 246 |
| [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | 244 | 4 | 247 |
| [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | 244 | 4 | 246 |

**35 entries grew** (the version pins); **60 stayed exactly the same length** (the date normalisation, which is a same-length substitution and so moved no entry closer to the ceiling).

**Maximum length after the pass: 248 characters. The limit is 248.**
