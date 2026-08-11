# Filters — TestRail execution log — read-date sweep, 2026-08-11

> **Every operation is an `update_case`. There is no other operation in this pass:**
> **0 `add_case` · 0 `delete_case` · 0 section write · 0 run write · 0 result logged ·
> 0 Jira call that creates anything** (Rules 6 and 62, and the active creation hold).

## Sources, at pass start and again at write start (Rule 59)

| | |
|---|---|
| Read at pass start | **2026-08-11 13:41:2xZ** — Confluence page 572030978, `version.number` **19**, `version.when` 2026-08-06T11:48:47.371Z, body 57,028 chars |
| **Re-read immediately before the writes began** | **2026-08-11 13:59:09Z** — same page, **still version 19**, same `when`, same 57,028-char body; epic **SV-8785 still 21 children**, `updated` still 2026-08-07T13:12:18Z, status Open |
| Verdict of the second read | **UNCHANGED — nothing moved between pass start and write start, so no conclusion was re-derived.** |

## Per-operation record

`atm` is TestRail's own `custom_atmstatus`, **captured at write time** from the post-write `get_case` body (Rule 65) — it is recorded per operation because the flag moves both ways, so reading it afterwards can give a different answer from the truth at the moment of the write.

| # | op | case | HTTP | fields compared | byte verification | atm at write | read-dates inserted |
|---|---|---|---|---|---|---|---|
| 1 | `update_case` | [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | 200 | 30 | **MATCH** | 1 | epic |
| 2 | `update_case` | [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | 200 | 30 | **MATCH** | 1 | epic, story |
| 3 | `update_case` | [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | 200 | 30 | **MATCH** | 1 | epic, story, answers-0717 |
| 4 | `update_case` | [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 5 | `update_case` | [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 6 | `update_case` | [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 7 | `update_case` | [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 8 | `update_case` | [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 9 | `update_case` | [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 10 | `update_case` | [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 11 | `update_case` | [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 12 | `update_case` | [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 13 | `update_case` | [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 14 | `update_case` | [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 15 | `update_case` | [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 16 | `update_case` | [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 17 | `update_case` | [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 18 | `update_case` | [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 19 | `update_case` | [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 20 | `update_case` | [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 21 | `update_case` | [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 22 | `update_case` | [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 23 | `update_case` | [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 24 | `update_case` | [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 25 | `update_case` | [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 26 | `update_case` | [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 27 | `update_case` | [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 28 | `update_case` | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 29 | `update_case` | [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 30 | `update_case` | [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 31 | `update_case` | [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 32 | `update_case` | [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 33 | `update_case` | [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 34 | `update_case` | [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 35 | `update_case` | [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 36 | `update_case` | [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 37 | `update_case` | [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 38 | `update_case` | [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 39 | `update_case` | [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 40 | `update_case` | [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 41 | `update_case` | [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 42 | `update_case` | [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 43 | `update_case` | [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 44 | `update_case` | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | 200 | 30 | **MATCH** | 3 | story |
| 45 | `update_case` | [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 46 | `update_case` | [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 47 | `update_case` | [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 48 | `update_case` | [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 49 | `update_case` | [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 50 | `update_case` | [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | 200 | 30 | **MATCH** | 1 | epic |
| 51 | `update_case` | [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | 200 | 30 | **MATCH** | 1 | epic |
| 52 | `update_case` | [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 53 | `update_case` | [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) | 200 | 30 | **MATCH** | 1 | epic, story, answers-0717 |
| 54 | `update_case` | [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) | 200 | 30 | **MATCH** | 1 | epic, story, answers-0717 |
| 55 | `update_case` | [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 56 | `update_case` | [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | 200 | 30 | **MATCH** | 1 | epic, story, answers-0717 |
| 57 | `update_case` | [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | 200 | 30 | **MATCH** | 1 | epic |
| 58 | `update_case` | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | 200 | 30 | **MATCH** | 3 | epic, spec |
| 59 | `update_case` | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 60 | `update_case` | [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | 200 | 30 | **MATCH** | 1 | epic |
| 61 | `update_case` | [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 62 | `update_case` | [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | 200 | 30 | **MATCH** | 1 | epic |
| 63 | `update_case` | [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | 200 | 30 | **MATCH** | 1 | epic |
| 64 | `update_case` | [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | 200 | 30 | **MATCH** | 1 | epic |
| 65 | `update_case` | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | 200 | 30 | **MATCH** | 1 | epic, spec, techplan |
| 66 | `update_case` | [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 67 | `update_case` | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | 200 | 30 | **MATCH** | 3 | epic, spec |
| 68 | `update_case` | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | 200 | 30 | **MATCH** | 1 | epic |
| 69 | `update_case` | [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | 200 | 30 | **MATCH** | 1 | epic |
| 70 | `update_case` | [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 71 | `update_case` | [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 72 | `update_case` | [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | 200 | 30 | **MATCH** | 1 | epic |
| 73 | `update_case` | [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 74 | `update_case` | [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 75 | `update_case` | [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 76 | `update_case` | [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | 200 | 30 | **MATCH** | 1 | epic |
| 77 | `update_case` | [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 78 | `update_case` | [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | 200 | 30 | **MATCH** | 1 | epic |
| 79 | `update_case` | [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 80 | `update_case` | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | 200 | 30 | **MATCH** | 1 | epic, answers-0804 |
| 81 | `update_case` | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | 200 | 30 | **MATCH** | 3 | epic, spec |
| 82 | `update_case` | [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 83 | `update_case` | [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 84 | `update_case` | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 85 | `update_case` | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | 200 | 30 | **MATCH** | 1 | epic, spec, techplan |
| 86 | `update_case` | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 87 | `update_case` | [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 88 | `update_case` | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 89 | `update_case` | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 90 | `update_case` | [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 91 | `update_case` | [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | 200 | 30 | **MATCH** | 1 | epic |
| 92 | `update_case` | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 93 | `update_case` | [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 94 | `update_case` | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | 200 | 30 | **MATCH** | 1 | epic, spec, techplan |
| 95 | `update_case` | [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 96 | `update_case` | [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | 200 | 30 | **MATCH** | 1 | epic |
| 97 | `update_case` | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 98 | `update_case` | [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 99 | `update_case` | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 100 | `update_case` | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 101 | `update_case` | [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 102 | `update_case` | [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | 200 | 30 | **MATCH** | 1 | epic, spec |
| 103 | `update_case` | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | 200 | 30 | **MATCH** | 1 | epic, design, answers-0804 |
| 104 | `update_case` | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | 200 | 30 | **MATCH** | 1 | epic, design, answers-0804 |
| 105 | `update_case` | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | 200 | 30 | **MATCH** | 1 | epic, design, answers-0804 |
| 106 | `update_case` | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | 200 | 30 | **MATCH** | 1 | epic, design, answers-0804 |
| 107 | `update_case` | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | 200 | 30 | **MATCH** | 1 | epic, design, answers-0804 |
| 108 | `update_case` | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | 200 | 30 | **MATCH** | 1 | epic, design, spec, answers-0804 |
| 109 | `update_case` | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | 200 | 30 | **MATCH** | 1 | epic, design, answers-0804 |
| 110 | `update_case` | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | 200 | 30 | **MATCH** | 1 | epic, design, answers-0804 |
| 111 | `update_case` | [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | 200 | 30 | **MATCH** | 1 | epic, story, spec |
| 112 | `update_case` | [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | 200 | 30 | **MATCH** | 1 | epic, story, spec |
| 113 | `update_case` | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | 200 | 30 | **MATCH** | 1 | epic, answers-0731 |
| 114 | `update_case` | [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) | 200 | 30 | **MATCH** | 1 | epic, story, spec |

**114 operations. 114 returned HTTP 200 and byte-verified MATCH. 0 did not.**

## Standing Rule 41 — the whole-case re-read, recorded per operation

Every one of the 114 operations carries this line in `evidence/testrail-execution-log.json`:

> *re-verified whole against the Filters specification, Confluence version 19, read live 2026-08-11 13:41Z and re-read 13:59Z — title, preconditions, steps, expected results, refs, section, type, requirement anchors, automation marker and raw-markup census all checked*

The re-read was ALSO run as a checkable script over all 114 cases **before** any write (`tools/rule41.py`, output `evidence/rule41-findings-PRE.json`): **0 findings** — 0 stale requirement anchors against live spec v19, 0 provenance naming a version other than 19, exactly one provenance opening and exactly one `AUTOMATION:` marker per case with nothing after it, 0 raw markup, 0 barred phrases, `refs` carrying both a Jira key and a spec anchor on all 114 with no entry over 248 characters, 0 API content outside an API section, 0 title over 80 characters, and the `---` separator present on all 114.

**Two things the re-read DID find are reported in `FINDINGS.md` rather than fixed here**, because both are wording changes beyond this pass's charter: C38882's wrong publication date for version 19, and C29600 naming no epic.

## Post-write verification (Rule 50 — exhaustive, then exact)

All figures below are from `tools/final_verify.py`, run **2026-08-11 14:03:38Z–14:05:01Z**, re-reading every case individually with `get_case`.

| Check | Result |
|---|---|
| Our cases re-read live, field by field | **114 — 0 mismatches.** `custom_expected` equals the planned bytes on all 114; every other field byte-identical to the pre-write snapshot |
| Fields compared per case | **30** |
| `refs` written | **never** — not sent on any payload, and byte-identical on all 114 afterwards |
| All three text fields sent on every payload | **yes, 114 of 114** (playbook §J #3 — an omitted text field is re-rendered into `<p>`/CRLF, and this project shows markup literally to the tester) |
| Sentence 2 (`Last checked against build …`) | **altered on 0 cases.** 103 have one, 11 do not; **95 read `v3.4.2-d00239b` on 8/5/2026 and 8 read `v3.6-3e9dd6d` on 8/11/2026**, exactly as before. None added, none removed, none re-dated |
| Read-date census | **0 of 114 without one.** 2 mentions on 93 cases, 3 on 20, 5 on 1 (C38909) |
| `AUTOMATION` marker / provenance count / `---` separator | **unchanged on all 114** |
| Raw markup, all 119 live cases | **0**, measured 14:03Z |
| Foreign cases (Rule 38) | **5 byte-identical, including `updated_on` and `updated_by`** |
| `custom_atmstatus = 3` after | the same **4**: C29600, C29614, C29623, C38877 |

### Run 352 proven undamaged

| Check | Before | After |
|---|---|---|
| `include_all` | false | **false** |
| tests | 114 | **114** — test-id sets and case-id sets **equal in both directions** |
| result records | 473 | **473 — every prior record present BY ID, 0 missing, 0 new** |
| graded fields changed (`status_id`, `comment`, `defects`, `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`, `case_id`, `id`) | — | **0** |
| counters | 65 P / 7 F / 0 B / 42 U | **65 P / 7 F / 0 B / 42 U** |
| declared echoes (`case_title`, `case_refs`) that moved | — | **0** (see `FINDINGS.md` §6 — playbook normalisation #2c predicts `case_refs` can move on any `update_case`; it did not fire on this pass, which is recorded rather than assumed away) |

**No result was logged anywhere. `update_run` was never called.**

