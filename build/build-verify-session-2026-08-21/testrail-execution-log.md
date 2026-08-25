# TESTRAIL EXECUTION LOG — 2026-08-25

| # | Operation | Target | HTTP | Byte-verification | custom_atmstatus at write |
|---|---|---|---|---|---|
| 1 | `update_case` (title only) | [C44864](https://shopview.testrail.io/index.php?/cases/view/44864) | 200 | FAILED | 1 (Not Automated) |

**Sources read at pass start:** 2026-08-25T10:20Z (local `requirements.md` 5.2 State 4).
**Sources re-read at write start:** 2026-08-25T10:30:41.872401+00:00 — the case itself re-read live and proven byte-identical
to the pre-write snapshot on all five fields before sending (Rule 59 / core 2.5: verified by CONTENT,
not by `updated_on`).
**Confluence PRD 576978945 was NOT re-fetched this turn** — the only version-bearing MCP call returns
the entire page body (documented limitation, `BLOCKED-confluence-version-integers.md`), and this edit
does not alter the expectation, only repairs a placeholder the import destroyed. Stated rather than
implied.

**Title before:** `No matches shows 'No results for ' plus the three quick-create buttons`
**Title after :** `No matches: 'No results for' with the typed query and three quick-create buttons`

**Source it is quoted back to** (core 2.10 post-write audit, check 1): `build/global-search/requirements.md`
line 139 — **"No results for '<query>'"** plus the same three quick-create chips. The new title states
exactly that, without the angle brackets TestRail cannot store.
**Reachable by the case's own steps** (check 2): yes — the steps type a no-match query and read the
message and buttons.
**Content belongs to this case** (check 3): yes — same screen, same message, same three buttons.
**Note paragraphs diffed** (check 4): none present; `custom_expected` is byte-identical.

**AUTOMATED CASES CHANGED — FOR VLAD: none.** C44864 is `custom_atmstatus = 1` (Not Automated), so
Rule 65 raises no hand-off. Verified live at write time, not inferred.

**NOT DONE, because it is outside the approved scope:** C44864's `refs` and its `custom_expected`
provenance line both still read `(No results for  + quick-create chips)` — the same swallowed
`<query>`. Sent back byte-identical. Listed as an ask.

---

## OPERATION 2 — THE REPAIR OF MY OWN COLLATERAL DAMAGE

| # | Operation | Target | HTTP | Byte-verification | atm |
|---|---|---|---|---|---|
| 2 | `update_case` (line breaks only) | [C44864](https://shopview.testrail.io/index.php?/cases/view/44864) | 200 | **13 checks, ALL PASSED** | 1 |

**WHAT WENT WRONG ON OPERATION 1, STATED PLAINLY.** The title write returned HTTP 200 and the byte-check
**FAILED on three fields**: `custom_preconds`, `custom_steps` and `custom_expected` all came back
**wrapped in `<p>…</p>` with their newlines left bare and no `<br>`** — the exact
collapse-into-one-run-on-paragraph pattern. The case had been plain text before my write. **So the
write made the case WORSE for the tester than it was**, on top of doing the approved job.

**🔴 THIS CONTRADICTS `00-COMMON-CORE.md` §2.1, WHICH IS THEREFORE WRONG AS WRITTEN.** §2.1 says a
partial payload is unsafe because omitted fields get re-rendered, and states: ***"A field sent
explicitly is stored verbatim."*** **All three fields WERE sent explicitly, at their exact pre-write
snapshot values, and all three were re-rendered anyway.** Sending all three fields is still correct and
still necessary — but it is **NOT sufficient**, and a pass relying on §2.1's promise will report a
clean write over a case it has just damaged. The byte-check is what caught it; §2.1's guarantee is what
would have talked a pass out of looking.

**THE REPAIR** — the documented recipe (skill `14`, playbook §J "bare-`\n`-inside-`<p>`"): rewrite
**the breaks only, never the wording**, inserting `<br>` before each newline. Verified afterwards that
the **wording is identical to the ORIGINAL pre-write snapshot** in all three fields with tags stripped,
that none of the three still collapses, and that the title, refs, marker, marker date, provenance count,
`custom_atmstatus` and `section_id` are all as intended.

**Residual, disclosed rather than tidied away:** each repaired field now ends `…<br></p>`, so the
rendered text carries **one trailing blank line**. Cosmetic, no wording effect, and left as-is rather
than spending a third write on it.

**Net position of C44864:** title repaired as approved; wording unchanged throughout; renders in
separate lines as it did before; marker and its 8/21/2026 date untouched because **no build was
checked**.

**WRITES THIS SESSION, COMPLETE LIST: 2 — both `update_case` on C44864, both authorised
(the approved title fix, and the restoration of the damage that fix caused).** No other case in any
project was written to. No `add_case`, no `delete_case`, no run write, no result write, no Jira.
