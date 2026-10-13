## J. TestRail API
- **⚠️ TestRail is the ONLY real/production system — NEVER create/update/delete cases, runs, or
  results without EXPLICIT user permission (Standing Rule 6).** Log ONLY Passed cases to a run; keep
  Failed/Retest/Blocked local.
- **🛠️ `fr-view` WRITE HARNESS (`hs_write.mjs`) — CLONE + RE-RUN CHECKLIST (L0023, 2026-09-09).** When
  you copy this harness into a new suite dir (sed-clone from an existing copy), three traps bite:
  **(1)** grep its hard-coded constants first — the Automated whitelist must read
  `const AUTOMATED_OK = new Set((process.env.AUTOMATED_OK||'').split(',').map(x=>x.trim()).filter(Boolean));`
  (a cloned `new Set([])` silently ignores the env and skips every `custom_atmstatus=3` case, even
  QA-lead-approved ones). **(2)** a Node process ALREADY RUNNING keeps its old code in memory — fixing
  the file on disk does NOT fix a launched process; re-run the affected cases with the fixed file.
  **(3)** the harness's `done` set reads BOTH `REPAIRED-hs.jsonl` and `FAILED-hs.jsonl` and treats a
  `{skipped:true}` line as done, so a plain re-run skips them again — **delete the skip lines from
  `FAILED-hs.jsonl` first**, then run `ONLY=<cids> AUTOMATED_OK=<cids> node hs_write.mjs`. Always
  confirm with an independent live `get_case` audit (needle in `custom_expected`), never from the log.
- **Project 1 / single suite 1 "Master"**; API v2, Basic auth. Helper `testrail-api.mjs` reads creds
  from `/tmp/testrail/creds.json` (email + password-OR-key + host) — **never hard-code creds.** Calls
  hit `{host}/index.php?/api/v2/{path}`.
- **🛑 `add_case` MUST SEND `custom_atmstatus:1` (= "Not Automated") + a REAL `custom_automation_type`
  (`1 E2E · 2 Functional · 3 Unit` — NEVER `0`/None; QA lead 2026-09-02). `custom_atmstatus` is NEVER
  `3`. CORRECTED 2026-08-11 for atmstatus; automation_type made mandatory-non-zero 2026-09-02.** The
  type is set at birth in the TestRail case AND in any CSV/XML upload file, so it is never bulk-edited
  later (a 285-case sweep on 2026-09-02 fixed cases that were all born `0`). Rubric: Unit = isolated
  calc/format/single-field validation; E2E = cross-feature journey / browser print / audit trail /
  email-PDF delivery; Functional = single-feature UI behaviour (default).
  Place any case with API content in a section whose title includes "API" (Rule 4).
  **⚠️ SUPERSEDED WORDING, KEPT VISIBLE AND DATED (the Rules 31/52/53 pattern) — until 2026-08-11
  this bullet read: *"`add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0`
  (non-API cases)."* **THAT IS THE INSTRUCTION THAT MADE EVERY API-CREATED CASE IN THIS WORKSPACE
  CLAIM TO BE AUTOMATED**, because every `add_case` script copied it; it is left visible so nobody
  re-derives it from an old script.
  **THE FIELD, READ LIVE FROM `get_case_fields` 2026-08-11 (not inferred):** `custom_atmstatus`,
  field id 17, label **"Automation status"**, dropdown values **`1` Not Automated · `2` Cannot be
  automated · `3` Automated · `4` Pending**. It is `is_required: true` for project 1 **but its
  `default_value` is `"1"`** — so `3` was never required by anything, and the required value, if one
  must be sent, is **`1`**. (`custom_automation_type` is `is_required: false`, `default_value: "0"`.)
  **WHY IT MATTERS: `3` is Vladimir Tomovic's OWN flag for what HE has automated**, and Standing
  Rule 65 keys the whole tell-Vlad duty off it, so a case born `3` corrupts the signal he and we both
  rely on. **31 Schedule cases were corrected `3 → 1` on 2026-08-11**
  (`build/automated-flag-and-c30041-2026-08-11/`).
  **USE THE CANONICAL HELPER, DO NOT HAND-ROLL THE PAYLOAD:**
  **`build/testing-tools/testrail_add_case.py`** — `add_case_payload()` sets `1` and **raises** on
  `3`; `verify_created_case()` does the Rule-50 byte-check on the created case.
  **AND THE GUARD: `build/testing-tools/check_add_case_payloads.py`** fails any new payload carrying
  `3` (run it before committing a pass that creates cases).
  **⚠️ DO NOT COPY AN `add_case` PAYLOAD OUT OF AN EXECUTED PUSH SCRIPT.** The 19 already-executed
  scripts still contain `3` **deliberately** — they are the audit record of what was actually run, and
  rewriting them would make that record lie. Copy from this bullet or from the helper.
- **Result statuses:** 1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed.
- **🛑 CASE-FIELD FORMATTING — THE ONLY SAFE FORMAT IS BLOCK-LEVEL HTML; NEVER INLINE TAGS, NEVER
  PLAIN NEWLINES (proven live 2026-08-28, C27800 + probe round-trips).** `custom_preconds`,
  `custom_steps`, `custom_expected` are **`format: markdown`** (read live from `get_case_fields`), but
  TestRail runs every submitted value through a **sanitiser that WRAPS the whole value in ONE outer
  `<p>…</p>`** on save. Consequences, all verified by round-trip:
  - **Plain text with `\n` / `\n\n` LOSES ALL LINE BREAKS.** The blank lines end up *inside* that single
    outer `<p>`, and a paragraph collapses internal whitespace → every paragraph runs together as one
    block. **This is the bug that made C27800 show as a wall of text.** (It is also why the earlier
    "plain text auto-wraps and renders cleanly" note was WRONG — it does wrap, but into ONE `<p>`.)
  - **STYLING inline tags show LITERALLY** — `<b>`, `<i>`, `<u>`, `<code>`, `<em>`, `<strong>` were seen
    printed as text by the tester. **Never use styling inline tags for formatting.**
  - **⚠️ `<br>` IS ORIGIN-DEPENDENT — IT SHOWS LITERALLY WHEN WRITTEN VIA THE API (corrected
    2026-08-28, QA lead observed our API update print `<br>` as text).** The TestRail **UI editor** stores
    `<br>` in a way that renders (that is why the QA lead's own manual edit of C27800 looks right), but an
    **API write** of the same `<br>` shows the literal tag. **Because our scripts write via the API, NEVER
    emit `<br>` (or any inline tag) in an API payload.** To put each statement on its own line via the
    API, use **separate `<p>` blocks** (wider gap) or a **`<ul><li>` list** (tight lines). A `<br>` seen
    on a live case is normally a human's UI edit — leave it; just never generate one.
  - **BLOCK-LEVEL tags are the ONLY thing proven to render when written via the API:** `<p>` (one per
    paragraph — do NOT put `\n\n` inside a `<p>`), `<ol>/<ul>` with `<li>`, and `<hr />`.
    The sanitiser strips some closing
    `</p>` and re-nests the markup (raw read-back looks mangled: `<p>A<p>B</p>…</p>`), **but the browser
    auto-closes an open `<p>` when the next block starts, so it renders as clean separate blocks.** Do
    not "fix" the mangled read-back — that is expected and it renders correctly.
  - **QA-LEAD-APPROVED REFERENCE EXAMPLE (blessed 2026-08-28): C27801** — preconditions as separate
    `<p>` paragraphs, steps as `<ol><li>`, expected = statement + `<hr />` + a "Source of expected
    behaviour:" `<ul><li>` list + a final `<p>` "Source-verified <date>". The QA lead confirmed this
    layout is "ideal". Copy it for any Custom Roles / permission case.
  - **THE RULE WHEN UPDATING ANY CASE (e.g. after source verification): MATCH THE PROVEN-GOOD FORMAT.**
    Copy the exact block structure of a case known to render well — e.g. C27801 or Global Search
    **C44804** — which
    stores steps/expected as `<ol><li>…</li></ol>` and appends provenance as `<hr /><p>…</p>` after the
    last item. **One paragraph = one `<p>`; steps = `<ol><li>`; the source block goes BELOW the expected
    behaviour, separated by `<hr />`, as a `<p>` label + `<ul><li>` list + a final `<p>` with the
    verification date.** No inline tags anywhere. Never send raw `\n`-separated plain text.
  - The canonical converters already do this right: `to_ol()` / `expected_html()` in
    `build/global-search/apply_to_testrail.py` and `.../regression-2026-08-26/push_to_testrail.py` emit
    block-only HTML — **reuse them; do not hand-author field HTML.**
  - **🛑 POST-WRITE RENDER SELF-CHECK IS MANDATORY (standing rule, QA lead, 2026-08-28).** After ANY
    `add_case` / `update_case`, **fetch the case back and confirm it renders correctly for a manual
    tester before you call the work done.** Never assume the write looks right — verify it. Run
    **`python3 build/testing-tools/check_case_render.py <C-ID> [<C-ID> ...]`** for every C-ID you
    touched; it fetches each case live and fails (exit 1) on inline tags, wall-of-text (blank-line
    paragraphs with no block structure), or multi-line content with no block tags. Push/apply scripts
    that create or edit cases should call it (or reproduce its checks) as their final step. A green
    self-check is part of "done"; a case is not finished until it passes.
- **⚠️ `get_sections` NEEDS PAGING, AND IT FAILS SILENTLY IF YOU FORGET (proven live 2026-08-05,
  Filters).** This project now has **625 sections**. An unpaged `get_sections/1&suite_id=1` returns
  only the **first 250**, with no error and no warning — and because the Filters group is section
  **4110**, well past 250, an unpaged call finds **ZERO Filters sections and therefore zero cases**,
  which reads exactly like "the group is empty" rather than "you truncated the list". **Always page:**
  loop `&limit=250&offset=N` until a chunk comes back shorter than 250, then walk the `parent_id` tree
  down from the group id to collect the subtree. **Also note the URL form:** the query separator must
  be `&`, not `?` — `get_sections/1?suite_id=1` returns
  `HTTP 400 {"error":"Invalid characters in URI: [/api/v2/get_sections/1?suite_id]"}`. The same paging
  rule applies to `get_cases`, `get_tests` and `get_results_for_run`.
- **⚠️ WHY THAT `&` RULE HOLDS FOR *EVERY* PARAMETER, NOT JUST `suite_id` — AND WHY IT IS THE REAL
  CAUSE OF THE `getall()` / `trlib` PAGING BREAKAGE (recorded 2026-08-11, Schedule staged push).**
  **TestRail joins EVERY parameter after the endpoint with `&`, NEVER `?`, because the whole
  `/api/v2/...` path already sits INSIDE the `index.php` query string.** The base URL is
  `{host}/index.php?/api/v2/{path}` — the `?` has already been spent on `/api/v2/...` itself, so a
  second `?` anywhere in `path` is not a separator at all, it is an **illegal character inside a query
  value**. Hence `get_cases/1?suite_id=1` fails with **`400 Invalid characters in URI`** for exactly
  the same reason an appended `?limit=` does, and hence `get_cases/1&suite_id=1&limit=250&offset=0`
  works with **four** parameters and only ampersands.
  **PROVEN LIVE 2026-08-11, all three read-only:** `get_cases/1?suite_id=1` → **HTTP 400
  `{"error":"Invalid characters in URI: [/api/v2/get_cases/1?suite_id]"}`** · the four-parameter
  ampersand form → **HTTP 200** · a five-parameter form with `&section_id=` → **HTTP 200**. **And
  TestRail corroborates it itself: the `_links.next` it hands back reads
  `/api/v2/get_cases/1&suite_id=1&limit=2&offset=2` — ampersands throughout, no `?` anywhere.** So the
  server's own pagination link is the canonical example of the form to build.
  **THIS IS DEEPER THAN "it appends `?limit=` twice", which is how the fault has been described
  before.** The paginators in `build/testrail-run-sync-2026-07-31/{run_sync_audit,sync_runs_EXECUTOR,
  exec_run_sync_2026-07-31}.py` all carry the shape
  `f"{path}{'&' if '?' in path or '/' in path else '?'}limit=250&offset={offset}".replace('?limit', '&limit')`
  — a conditional that can emit `?` followed by a `.replace()` that patches it back to `&`. **It
  happens to work, but only because the patch undoes the conditional**, so the moment anyone edits
  either half, or adds a parameter, or reorders the string, the request 400s and the failure reads
  like a permissions or paging problem rather than a URL problem.
  **THE RULE TO CODE TO: build the path with `&` unconditionally and never write a `?` into it.**
  `f"{path}&limit=250&offset={offset}"` needs no conditional and no `.replace()`. The clean
  implementation is `/tmp/testrail/tr.py` (`get_cases` / `get_tests` / `get_results_for_run`), which
  concatenates `&limit=250&offset=N` and has never hit the error.
  **AND THE FAILURE IS SILENT IN THE OTHER DIRECTION**, which is why it is worth this much space:
  forget the parameter and you get **250 rows and HTTP 200** (the truncation trap in the bullet above);
  write it with `?` and you get **HTTP 400 with a message that names a URI nobody wrote by hand**.
  Neither symptom points at the cause.
- **Corroboration of DECLARED NORMALISATION #2 below, from a second project (Filters, 2026-08-05):**
  retitling **C29624** made **5 of run 352's 429 historical result records** read back with a different
  `case_title`, and `case_title` was **the only field that differed across all 429** — status, comment,
  who, when, elapsed, defects and version were byte-identical. Two independent projects, same
  behaviour, so it is safe to rely on.
- **⚠️ DECLARED NORMALISATION #2 — `get_results_for_run` ECHOES THE CASE'S *CURRENT* TITLE (proven live
  2026-08-05, Report Suite).** Historical result records carry a **`case_title`** field that TestRail
  fills in **at read time from the case as it stands now**, not from the title the case had when the
  result was graded. **So retitling a case makes its old result records read back differently with NO
  run write whatsoever.** Proven: 3 of run 359's 532 result records differed pre-versus-post a
  `update_case` batch, the ONLY differing field across all 532 was `case_title`, the 3 belonged to
  exactly the 2 cases retitled, and `status_id` · `comment` · `created_on` · `created_by` · `elapsed`
  · `defects` · `version` · `test_id` · `id` were **byte-identical on all 532**. **CONSEQUENCE for
  Standing Rules 34/47/50: verify a run untouched on those fields and treat `case_title` as DERIVED —
  a raw whole-record compare will otherwise report a false "results changed" and stop a clean batch.**
- **⚠️ DECLARED NORMALISATION #2b — `case_refs` IS THE SAME KIND OF ECHO AS `case_title` (found 2026-08-05,
  Report Suite).** A result record also carries a **`case_refs`** field, filled in **at read time from the
  case's References as they stand now**. So **writing `refs` on a case makes its old result records read
  back differently with NO run write** — exactly as retitling does (#2). Both are DERIVED; neither is a
  graded field and neither can be written by us. **Verify a run untouched on the graded fields
  (`status_id` · `comment` · `defects` · `elapsed` · `version` · `assignedto_id` · `created_by` ·
  `created_on` · `test_id` · `case_id` · `id`) and treat `case_title` AND `case_refs` as echoes** — a raw
  whole-record compare will otherwise report a false "results changed" and stop a clean batch. Confirmed by
  reading a live run-359 result record whose `case_refs` reproduced its case's full Rule-20 reference
  string verbatim.
- **🛑 DECLARED NORMALISATION #3a — AND THE "SENT EXPLICITLY IS STORED VERBATIM" HALF OF #3 IS FALSE.
  PROVEN 2026-08-25 (Global Search / Digital Inspections).** Three normalisations fire on `update_case`
  **even when every field is sent explicitly at its exact snapshot value.** They are recorded here, with
  their evidence, **because Standing Rule 50 forbids relying on an undeclared normalisation** — and a
  pass that byte-compares without knowing these will stop a correct batch, while a pass that shrugs them
  off will miss real damage. **Compare on the RENDERED text** — tags stripped, entities decoded,
  whitespace collapsed — **and treat byte-equality as reportable but unattainable.**

  | # | What TestRail does on write | Evidence |
  |---|---|---|
  | **3a-i** | **Plain multi-line text is wrapped in `<p>…</p>` with the newlines left BARE** — producing the run-on-paragraph collapse. **A plain-text case is therefore DAMAGED by any write that does not pre-empt it.** Mitigation: insert `<br>` before each newline **in the same payload**. | C44864: three fields sent byte-identical, all three returned `<p>`-wrapped; case had been plain text |
  | **3a-ii** | **Characters are entity-encoded** — `—` → `&mdash;`. Renders identically, so it is a true normalisation, not damage. | C44506 `custom_preconds` |
  | **3a-iii** | **🔴 BLOCK MARKUP IS RE-PARSED AND A LIST'S CLOSING TAG IS RELOCATED TO THE END OF THE FIELD.** `<ol>…</ol><hr /><p>prov</p><p>marker</p>` comes back as `<ol>…<hr><p>prov</p><p>marker</p></ol>` — the provenance and marker end up **nested inside the ordered list**, and `<hr />` becomes `<hr>`. **This is NOT recoverable by writing the correct HTML back:** two attempts, one with the original bytes and one with the blocks made contiguous (no newlines between them), both re-parsed the same way. | C44506, three writes |

  **⇒ THE OPERATIONAL CONSEQUENCE, AND IT IS A REASON NOT TO WRITE:** a case created by **CSV import**
  holds clean block HTML that `update_case` **cannot reproduce**. So **touching such a case costs its
  markup structure permanently**, for the rendering gain of nothing. **Do not write to a case unless the
  write fixes something a tester can actually see.** *(Scar: a batch built on a faulty "collapse"
  detector wrote to C44506 believing it was repairing a run-on paragraph. The field had been correct
  block HTML all along; the write nested its provenance inside the list and could not be undone. The
  detector had flagged any field holding `<p>` + a newline + no `<br>` — which is the NORMAL import
  shape. The correct test is narrower: a **single `<p>` whose own inner text contains a newline**.
  Re-derived across all 428 August cases with the corrected test: **0 genuinely collapsed cases** —
  against 16 the faulty one claimed.)*

- **🛑 DECLARED NORMALISATION #3 — `update_case` RE-RENDERS ANY TEXT FIELD YOU *OMIT* FROM THE PAYLOAD
  (found the hard way 2026-08-05, Filters).** Send a partial payload — say only `custom_expected` — and
  TestRail may push the fields you did **not** send back through its HTML pipeline: `custom_preconds`
  and `custom_steps` came back **wrapped in `<p>…</p>` with every `\n` converted to `\r\n`**. A field
  **sent explicitly is stored verbatim**. **THE MITIGATION, APPLY IT WITHOUT EXCEPTION: on EVERY
  `update_case`, send ALL THREE text fields — `custom_preconds` + `custom_steps` + `custom_expected` —
  even when you are changing only one**, setting the unchanged ones to their exact pre-write snapshot
  value. It costs nothing and it is the only reliable protection.
  **WHY IT MATTERS SO MUCH HERE: these projects render that markup LITERALLY to the manual tester.**
  This is not cosmetic — on the very same day, **10 Filters cases and 16 Schedule cases** had to be
  repaired for showing raw `<ol>`/`<li>` to the tester. A partial payload silently manufactures that
  same defect.
  **HOW IT WAS FOUND:** write **1 of 110** (**C29557**) sent only `custom_expected`, returned **HTTP
  200**, and the Rule-50 byte-check flagged **two UNINTENDED field changes**. The batch **stopped
  immediately**, the two fields were **restored byte-exact** from the pre-write snapshot, and all 110
  subsequent payloads carried all three fields and verified clean. An untouched control case
  (**C29558**) was byte-identical **including `updated_on`**, so the re-render was caused by the
  partial payload, not by anything ambient. **A "200 OK" tells you nothing about this — only the
  byte-check catches it.**
  **⚠️ IT IS CONDITIONAL OR INTERMITTENT — DO NOT ASSUME YOU ARE SAFE (independently verified
  2026-08-05, all three active projects).** The same day, in the **same project 1 / suite 1**, the
  **Report Suite** pass sent **469 partial payloads** (`custom_expected` only) over content
  structurally identical to the Filters cases — same plain numbered text, same `\n`, same `---`
  separators — and was **NOT affected at all**; **Schedule** sent all three fields on all 165 payloads
  and was **immune by design**. So the trigger condition is **NOT characterised**, and it fired on one
  pass while sparing another hours earlier. **Therefore treat every partial payload as unsafe rather
  than trying to predict it.** (Independent audit that established this: all **753** live cases across
  groups 4281 / 4254 / 4110 re-read **twice**, by `get_cases` and by per-case `get_case`, with **0
  field differences**, and every project's committed pre-write snapshot diffed field-by-field against
  live — **0 damage signatures introduced anywhere**.)
  **THIS IS NOT A NORMALISATION YOU MAY USE TO EXPLAIN AWAY A MISMATCH.** Unlike the `refs` re-join
  and the `case_title` / `case_refs` echoes, this one is **silent data corruption**, not a benign
  server transformation. If a byte-check flags `custom_preconds` or `custom_steps` moving on a write
  that did not intend to touch them, **the write FAILED**: stop the batch, restore from the snapshot,
  and re-send with all three fields (Rule 50).
  **SCOPE:** the exposure is the three text fields above. The other text-ish custom fields
  (`custom_mission`, `custom_goals`, `custom_steps_separated`, `custom_testrail_bdd_scenario`) are
  **null on all 753 of our cases**, so they cannot be damaged today — but if any project ever populates
  one, it joins the send-it-every-time list.

- **🔴🔴 CORRECTION, 2026-08-26 — NORMALISATION #3's MITIGATION IS INVERTED AND MUST NOT BE FOLLOWED.
  OMITTED FIELDS ARE PRESERVED; *SENT* FIELDS ARE THE ONES THAT GET RE-RENDERED. SEND ONLY WHAT YOU
  ARE CHANGING.** Settled empirically on a **throwaway case**, never on a real one, because the two
  recorded positions (#3 "always send all three" vs. hazard #6 "every sent field is re-wrapped")
  cannot both be operational advice. **The old #3 text above is kept visible and is NOT deleted — but
  its instruction *"on EVERY `update_case`, send ALL THREE text fields"* is SUPERSEDED and is now the
  wrong thing to do.**

  **THE EXPERIMENT (script `build/report-suite/writes2-2026-08-26/job4_field_preservation.py`, log
  `logs/job4-field-preservation.log`).** One `ZZAUTOTEST`-prefixed case, `custom_atmstatus: 1`, created
  in section 237 with distinctive multi-block preconditions/steps/expected, then **deleted** (re-GET
  after delete → HTTP 400 `"Field :case_id is not a valid test case."` — confirmed gone).

  | Test | What was sent | Result, byte-compared on a re-GET |
  |---|---|---|
  | **(a)** | `update_case` with **only `{"title": …}`**, all three text fields **OMITTED** | **ALL THREE PRESERVED BYTE-IDENTICAL.** `custom_preconds` sha `853db875…` before and after; `custom_steps` `48024bf0…`; `custom_expected` `dca7952b…`. **Nothing was re-rendered.** |
  | **(b)** | `update_case` with **all four fields**, the three text values byte-identical to the re-GET | **LOSSLESS** — all three came back byte-identical to what was sent. |
  | **(c)** | the **initial `add_case`**, plain text sent | **ALTERED ON THE WAY IN**: `'ZZAUTOTEST-PRE-B1\n1. …'` was stored as `'<p>ZZAUTOTEST-PRE-B1\n1. …</p>\n'` — sent-vs-stored identical = **False**. |

  **⇒ WHICH RULE IS TRUE:** the **last worker is right**. Round-tripping is stable *once* a value has
  been through TestRail's pipeline — which is why (b) looked lossless — but the pipeline runs on
  **what you send**, never on what you omit. **A field you omit is untouched. A field you send is
  re-rendered.** This CONFIRMS hazard #6 and **REFUTES normalisation #3's mitigation**: sending an
  unchanged field "for safety" is the only way to damage it.

  **⇒ THE RULE, FROM 2026-08-26:** **send ONLY the fields whose content you are actually changing.**
  Omit the rest. Then byte-verify: the omitted fields must be byte-identical to the pre-write snapshot,
  and the sent fields must equal the sent value **after normalisation** (`—`→`&mdash;`, `<p>` wrap if
  the value does not already start with a block tag, trailing `\n`). Reference implementation of that
  comparison: `build/report-suite/writes2-2026-08-26/job1_verify.py`.

- **🔴🔴 THE `<p>` WRAP IS UNCONDITIONAL — AND WHETHER IT HARMS THE TESTER DEPENDS ON A PER-CASE
  RENDER FLAG THE API DOES NOT EXPOSE. CHECK THE VIEW PAGE BEFORE ANY TEXT-FIELD WRITE (proven
  2026-08-26).** This is the missing half of hazard #6 and it explains why some passes "got away with
  it" and others did not.

  **(i) The wrap cannot be avoided.** Eight formulations were tried on a throwaway — plain, trailing
  `\n`, leading `\n`, CRLF, blank-line-separated, leading space, markdown bullets — and **all eight
  came back `<p>…</p>\n`.** The only value stored unwrapped is one that **already begins with a
  block-level tag** (`<ol>…</ol>` stored as sent, no wrapper added, and `<p>x</p>` is not
  double-wrapped).

  **(ii) The damage is decided by the container, not by the content.** TestRail's case-view page emits
  each field into one of two containers:

  | Container in the served view page | Behaviour | Effect of the `<p>` wrapper |
  |---|---|---|
  | `<div class="markdown fr-view">` | value emitted **RAW**, HTML renders | **invisible — harmless** |
  | `<div class="markdown">` | value run through the **markdown renderer**, which **ESCAPES** every tag | **the tester literally reads `<p>` and `</p>`** |

  **The container is a per-case property that `get_case` does not return** — it is not derivable from
  the value's content (a `<p>`-wrapped plain body renders raw on one case and escaped on another), and
  it is **not** the field's configured `format: markdown`. **It can only be read from the served view
  page**, by looking for `markdown fr-view` vs `markdown`. Scanner:
  `build/report-suite/writes2-2026-08-26/job4_render_path_scan.py`.

  **(iii) THE BLAST RADIUS ALREADY INCURRED — 72 Report Suite cases are showing tag text to testers
  right now.** All 185 cases touched on 2026-08-26 were scanned: **72 sit in an escaping `markdown`
  container and now display a literal `<p>` and `</p>`** (three of them a `<br>` as well). **71 were
  written by the 12:40 write pass; 1 (C30518) by the 13:1x Job 1 rewrite.** Causation is **proven, not
  assumed**: the pre-write snapshot `build/report-suite/source-verify-2026-08-26/data/live-cases.json`
  was captured at **11:53, before those writes**, and **all 72 contained no HTML tag at all in any of
  the three fields at that moment**. C-ids: `build/report-suite/writes2-2026-08-26/logs/job4-damaged-cids.txt`;
  causation split: `logs/job4-causation.json`.

  **(iv) THEY CANNOT BE REPAIRED THROUGH THE API.** Any API write re-adds the wrapper, and any HTML
  written instead is escaped by the same renderer — so on an escaping case **every possible API value
  puts visible tag text on the tester's screen**. Repair needs the **TestRail web editor**. A
  UI-form-post repair path was investigated and **not attempted**: `index.php?/cases/edit/<id>` does
  not expose the three text fields as form inputs (they are JS editors) and the form carries a
  `_token`, so reconstructing the post is not safe to do blind.

  **⇒ THE PRE-WRITE GATE, FROM 2026-08-26 — do this BEFORE any text-field write:** fetch
  `index.php?/cases/view/<id>` on a logged-in UI session and read the container. **`markdown fr-view`
  → safe to write. Plain `markdown` → DO NOT WRITE via the API**; the write will damage the case
  visibly, whatever you send. (Worked example: C30287 and C30536 are `fr-view` and were written safely
  on 2026-08-26; C30518 is `markdown` and was damaged by an otherwise-correct write.)

  **⇒ THE STANDING OPERATIONAL RULE (recorded 2026-08-26, after the repair was approved):**
  **`update_case` RE-RENDERS ANY FIELD YOU SEND AND PRESERVES ANY FIELD YOU OMIT — SO SEND ONLY THE
  FIELD YOU ACTUALLY NEED TO CHANGE.** Whether the re-render is **VISIBLE** depends on a **per-case
  container flag** (`markdown` escapes and shows literal tags to the tester; `markdown fr-view`
  renders correctly) which **`get_case` DOES NOT EXPOSE**. Therefore: **NEVER bulk-write plain text
  via the API**, and **where a case's body must change and its container is unknown, prefer the UI
  editor.** On 2026-08-26 this damaged **72 cases**.

  **⇒ 🔑 sv8218 (ShopView QA) — REAL ROUTES, FOUND BY WATCHING THE APP (2026-08-31).** Guessed routes
  404'd every single time on this project; every working one came from `page.on('request')` while
  clicking the app's own tabs. **The convention is `/api/<thing>/view/<id>`, not `/api/<thing>/<id>`**
  — `/api/customers/<id>` is a 404 while **`/api/customers/view/<id>` is a 200**.

  | Route | Method | Notes |
  |---|---|---|
  | `/api/customers/view/{id}` | GET | the customer record (NOT `/api/customers/{id}`) |
  | `/api/customer-payment/list` | GET | customer payments |
  | `/api/customer-deposits/list` | GET | customer deposits |
  | `/api/customer-account/list-unpaid-transaction?account_id=<id>` | GET | **the rows are at `data.response.collection`, NOT `data.collection`** — alongside `unpaid_transactions_count` and a `groupByDueDateData` ageing block. Reading `data.collection` returns `undefined`, which a loop silently treats as "no rows" and reports as zero for every account. **And it is the UNPAID list only**, so it is the wrong list for finding a credit that has been applied — ask the endpoint that answers the question (2026-09-02) |
  | `account_id` itself | — | **`customer_account_id`, and it is ONLY on `/api/customers/view/<id>`** — the customers LIST does not carry it. Passing the customer id instead returns HTTP 200 with zero rows, on every account (2026-09-02) |
  | `/api/customers/{id}/default-adjustments` | GET | fees & discounts defaults |
  | `/api/part-sales` | GET | **53 part sales**, statuses paid/complete/estimate; fields include `number`, `status`, `invoiceShopId`, `invoicedDate` — but **no `invoice_id`**, and `/api/part-sales/view/{id}` is a **404**, so the part-sale document route is still unfound |
  | `/api/credit-memos` | **POST only** | GET answers **405 `Allow: POST`**; a bare POST answers 400 *"customer_account_id: Missing required parameter, amount: Missing required parameter"* ⇒ **credit memos are created against a CUSTOMER ACCOUNT, not a work order** |
  | `/api/work-orders/statuses` | GET | Estimate · Approved · In progress · Review · Complete · Invoiced · Paid |
  | `/api/invoices/preview?invoice_id=<id>&type=html&isEstimate=<0\|1>&includeDeclined=<0\|1>&historyEvent=` | GET | the document render path; invoice id is `data.work_order.invoice_id` on `/api/work-orders/view/{woId}` |

  **⇒ ✅ THE INVOICE UI REFRESH DOCUMENT ROUTES, ALL BUILD-VERIFIED LIVE 2026-08-31.** Two of these
  came from a source-read by another session (`CROSS-SESSION-UNBLOCK-2026-08-31.md`, badge **never
  build-verified**); each was then confirmed with one live call, which is what moves a lead to a fact
  (Rule 12). **One of them did NOT behave as the source predicted — see the 500 below.**

  | Document | Route | Live result |
  |---|---|---|
  | Invoice / Estimate (HTML) | `GET /api/invoices/preview?invoice_id=<id>&type=html&isEstimate=0\|1&includeDeclined=0\|1&historyEvent=` | 200 |
  | Invoice / Estimate (**PDF**) | same route, **`type=pdf`** | **200, real PDF v1.7, 187 KB** |
  | **Credit Invoice** | `GET /api/credit-memos/{creditMemoId}/pdf` | **200, PDF, `credit-memo.pdf`** |
  | **Parts Sale** Invoice / Estimate | `GET /api/invoices/preview?invoice_id=<the part sale's invoice_id>&isEstimate=0\|1` | **200** — `INV-P2-123` / `EST-P2-123` |
  | Parts Sale (dedicated endpoint) | `GET /api/part-sales/{workOrderId}/invoice-pdf?estimate=0\|1` | **HTTP 500** — twice, two part sales, both `estimate` values |

  **🔑 A PART SALE *IS* A WORK ORDER.** `/api/part-sales/{id}/pdf` and `/api/part-sales/view/{id}`
  are 404, but **`GET /api/work-orders/view/{partSaleId}` returns 200** and the paid one carries
  `invoice_id` — which the ordinary preview route accepts. The `/api/part-sales` row `id` **is** the
  work order id (the view payload echoes it back as `"id"`). The clue was in the credit memo payload:
  `origin_invoices[0].work_order_type == 'service'` implies other work-order types exist.

  **🔑 `type=pdf` WAS ALWAYS THERE.** The DTO asserts `Choice(['html','HTML','pdf','PDF'])`. A pass
  spent a day rendering `type=html` and reported four cases blocked on *"Generate the PDF"*. **Try
  the one-token variant of the call you are already making before reporting a capability missing.**

  **🔑 `includeDeclined=1` RENDERS DECLINED WORK — the capability ships without a UI control.**
  Live: the same invoice goes from 4,366 to 5,256 visible characters and the label **`Declined Work`**
  appears. The **toggle** is absent from the Invoice Details dialog (proven with a firing control),
  and no front-end code sends the param. **This is NOT Rule 24** — Rule 24 is about a permission
  boundary correctly hidden from a user who should not act; here the control is missing for an admin
  who *should* have it, on a story still In Progress. So it is **possibly-unfinished (Rules 49/60)**,
  keeps the documented expectation (Rule 57) and the **NOT AVAILABLE ON BUILD** marker (Rule 69) —
  **not a PASSED case, and not a defect ticket.**

  **⚠️ A 500 IS NOT A 404, AND THE DIFFERENCE IS THE DIAGNOSIS.** On `part_sales_invoice_pdf` the
  param is `#[MapEntity('partSaleId')] WorkOrder`, so an unresolvable id yields **404**. Getting
  **500** proves the entity bound and the fault is inside the handler — and the same document
  renders fine through the preview route, so template and data are good. Candidate written up at
  `build/invoice-ui-refresh/build-verify-2026-08-31/DEFECT-CANDIDATE-partsale-invoice-pdf-500.md`
  (not filed — hold active).

  **⚠️ THE CREDIT DOCUMENT IS PDF-ONLY.** `type=html`, `format=html`, `html=1` and `?preview=1` all
  still return `%PDF-`. Text extraction needs pypdf; this image's `cryptography` is broken
  (`_cffi_backend` missing) and `pip install --force-reinstall cffi` fixes it. **pypdf inserts
  kerning artefacts inside words** — the captured credit document literally reads `T ax`,
  `T erritory` — so a label matcher needs a **space-insensitive fallback applied only after an exact
  miss**, with controls drawn from the PDF itself. **Never edit the captured text to suit the
  matcher.**

  **⇒ 🔑 CUSTOMER CREDIT MEMOS ON sv8218 — the record is reachable, the DOCUMENT is not (2026-08-31).**
  `GET /api/customer-account/list-unpaid-transaction?account_id=<customer_account_id>` returns them,
  with `type: credit`, `formatted_invoice_number: CM-100`, `status_label: Unapplied`. The
  **`customer_account_id` is `data.company.customer_account_id` on
  `GET /api/customers/view/{customerId}`** — it is NOT the customer id. The **invoice menu's
  "Issue Credit" action DOES create a genuine customer credit memo** (a session on 2026-08-31 first
  concluded it made "only a part-sale credit" — wrong; the `has_part_sale_credits: true` flag was a
  side effect). **✅ CORRECTED 2026-09-07 - THE CREDIT MEMO DOCUMENT *CAN* BE RENDERED: `GET /api/credit-memos/{creditMemoId}/pdf` -> 200, a one-page PDF.** Found by clicking the `print` action on the credit row (Customers -> the customer -> Invoices tab) with a request listener attached, rather than by guessing routes - the app DOES call a credit route, contrary to the note below. Verified live on staging build v26.35.9-9812433 with CM-4347. **Two gotchas:** the print control opens NO popup and triggers NO download, so `expect_page`/`expect_download` both time out - watch the network instead; and the row in the Invoices tab displays the number as **CM2-4347** while the DOCUMENT itself reads **CM-4347**. *(Superseded note kept verbatim below, per the dated-correction pattern:)* **The credit memo's document could not be rendered:** it is absent from the customer's
  Invoices/Payments/Deposits tabs and from the originating work order's finance tab, 13 candidate
  routes all 404, `/api/invoices/preview` rejects a credit memo id, and the app never calls a
  credit/preview route. **Before re-running that hunt, read this list — it is the searched set.**

  **⚠️ A 405 IS A FIND, NOT A FAILURE.** `/api/credit-memos` answering *405 Method Not Allowed
  (Allow: POST)* proved the endpoint exists and named its method, and the 400 that followed named its
  required parameters. **Read the error body — on this API it enumerates the missing fields.** A
  session that treats any non-200 as "absent" will report a built feature as missing.

  **⚠️ AND: `/api/work-orders/statuses` DOES NOT LIST INVOICE STATES.** On 2026-08-31 a session read
  that list, saw no partial/void/draft, and told the QA lead those invoice states were "probably not
  built". **Wrong: they are WORK ORDER statuses.** Partially-paid and voided/reversed invoices are
  both explicitly in the Invoice UI Refresh spec, and Jira has shipped reversal work (SV-9087,
  SV-9382, both Done). **Never answer "is this state built?" from a different entity's status list.**

  **⚠️ THE PAID BANNER IS PORTAL-ONLY.** Spec S8-R8: the paid banner *"appears only on the Invoice
  PDF generated by the customer portal… An Invoice PDF generated in the shop app never carries the
  banner."* So `PAID IN FULL`, `PARTIALLY PAID`, `Payment Receipt - Payments by ShopView`,
  `Total Charged`, `Remaining Balance`, `Convenience Fee`, `Late Fee`, `Paid By`, `Method`,
  `Date / Time`, `Invoice Amount`, `Payment X of Y - Batch` **can never be found by rendering a
  shop-app invoice, however it was paid.** A label absent from one render path is not absent from
  the product — establish WHICH path is supposed to carry it before calling it a gap.

  **⚠️ JIRA STORY STATUS IS NOT EVIDENCE ABOUT THE BUILD.** All 13 SV-8218 stories read **Open** on
  2026-08-31 while the sv8218 build already rendered `Paid date:` in place of `Due date:` — net-new
  S10-R4. **The branch runs ahead of the tickets.** Ticket status is context; only observation is
  evidence (Rule 57, and Rule 61's *"ticket status is never evidence about the build"*).

  **⇒ 🛑 THE UI-LOGIN CREDENTIAL TRAP — IT TURNS THE CONTAINER SCANNER INTO A DETECTOR THAT CANNOT
  FIRE, AND IT REPORTS A CLEAN BILL OF HEALTH (found 2026-08-31, Invoice UI Refresh).**
  **`/tmp/testrail/creds.json['password']` holds the TESTRAIL API KEY, not the account password.**
  The API accepts the key as the Basic-auth password, so every `get_case` works and the file looks
  correct. But the **web UI login form needs the real account password**, and posting the API key into
  it **fails silently**: the POST returns HTTP 200, you land back on `/auth/login/`, and every
  subsequent `index.php?/cases/view/<id>` fetch returns the **24 KB login shell** instead of the case.
  The container regex then matches **nothing**, and the scan reports **"0 escaping containers"** for
  every case — i.e. *"all safe, write via the API"* — which is the exact opposite of the truth.
  On this pass the real split was **48 escaping / 5 fr-view**; the broken scan said **0 / 53**.
  **⇒ Keep the UI password in a SEPARATE file (`/tmp/testrail/ui-creds.json`, `chmod 600`), and make
  every UI-session scanner CONTROL ITSELF:** assert the post-login URL is **not** `/auth/login`, assert
  the fetched page actually contains the case's own title, and classify a case whose container could
  not be located as **UNKNOWN — never as "safe"**. Working scanner with all three assertions:
  `build/invoice-ui-refresh/build-verify-2026-08-31/markers/render_scan.py`.
  *(This is Rule 12 in miniature: "0 problems found" from a probe that cannot fire is not a result.)*

  **⇒ ✅ A UI SAVE FLIPS THE CONTAINER TO `fr-view`; AN API WRITE LEAVES IT ESCAPING (measured
  2026-08-31).** §J above says repair "needs the web editor" but not *why it sticks*. It sticks because
  the container flag follows the **write path**, not the content:

  | How the field was last written | Resulting container | Tester sees |
  |---|---|---|
  | `add_case` / `update_case` (API) | plain `<div class="markdown">` | **literal `<ol><li><p>` text** |
  | the TestRail web editor (UI save) | `<div class="markdown fr-view">` | correctly rendered |

  **Evidence, both directions, on one suite:** of the 53 build-verified Invoice cases, the **48 written
  only ever by the API are all plain `markdown`**, and the **5 that had been repaired through the UI
  editor earlier the same day are all `fr-view` — 5 of 5**. So the flag is not random and not per-suite:
  it is a fingerprint of the last write path. **Consequences:** (a) a case authored via the API is
  *born* showing tags if it stores any HTML, so **API-authored cases should store PLAIN TEXT, never
  block HTML**; (b) the render repair and any content edit are **ONE operation** — do them in the same
  UI save rather than writing twice; (c) **`fr-view` is achievable, so "the tester reads tags" is never
  a permanent state.**

  **⇒ ✅ CARVE-OUT (measured 2026-09-09, L0028): A STRUCTURE-PRESERVING API WRITE TO A FIELD THAT IS
  ALREADY `fr-view` KEEPS `fr-view`.** The rule above ("API write leaves it escaping") is about the write
  that *establishes the field's HTML* — an API write that INTRODUCES block tags into a plain field is born
  escaping. It is NOT true of an API write that changes only **text inside HTML the field already holds and
  that is already rendering fr-view** (e.g. a build-line re-stamp: `…v26.35.9-7f2e4fa on 9/8/2026` →
  `…v26.36.0-f43b2fd on 9/9/2026` inside an existing `<ul><li>`). There the container is **preserved**.
  **Evidence:** API-wrote C53477 and its served page matched UI-written C44988 (both fr-view=true,
  blocks=true, escaped=false); a bulk API re-stamp of 123 cases (errors=0) followed by the FULL 167-case
  served-page scan returned **escaped=true = 0, fr-view=false-on-real-field = 0**. **Practical payoff:** a
  bulk build-line re-stamp is an API job (~3 min, checkpointed) — NOT a Froala/UI-editor job (~2 hrs, prone
  to the L0010 deadlock). **The line not to cross:** *text-within-existing-fr-view-HTML = safe via API;
  plain-text→block-HTML, or adding new tags = still needs a UI save.* Always confirm with the served-page
  scan (`/tmp/check_served2.mjs`, or the committed equivalent) after any such bulk write — a green
  API-stored-value check is not sufficient on its own.

  **⇒ ⚠️ CORRECTION TO THE COLLAPSE CENSUS (2026-08-28 → 2026-08-31): IT MEASURED THE WRONG ARTEFACT.**
  The census that concluded **"0 genuinely collapsed cases across the 428"** ran `genuine_collapse()`
  over the **API-stored value**. That answers *"is a newline stranded inside a `<p>`?"* — a real
  question, and the 0 stands **for that question**. It says **nothing** about whether the tester can
  read the case, because **escaping is decided by the container, which the stored value does not
  reveal.** Run on the served page instead, the same corpus's Invoice slice came back **48 of 53
  unreadable**. **⇒ THERE ARE TWO SEPARATE DEFECTS AND EACH NEEDS ITS OWN PROBE: the bare-`\n`-inside-
  `<p>` COLLAPSE (read the stored value) and the ESCAPING CONTAINER (read the served view page). A
  clean bill from one is not a clean bill from the other.** Never report "the suite renders fine"
  from the stored value alone.

  **⇒ THE REPAIR ROUTE, PROVEN (C30197, then the 70-case batch, 2026-08-26).** The UI editor is
  driven with **Playwright**, and Playwright needs the **LOCAL MITM BRIDGE** — chromium **cannot TLS
  through the egress proxy directly** (`net::ERR_CONNECTION_RESET` on every host, `curl` through the
  same proxy is fine). Start a **fresh** `build/atlassian-login/bridge.mjs` per run (the port rotates;
  it writes `/tmp/atlassian/bridge-port.txt`) per `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` §1, then
  `chromium.launch({ proxy: { server: 'http://127.0.0.1:<port>' } })`. **Import playwright as
  `/opt/node22/lib/node_modules/playwright/index.js` (or `index.mjs`) — a bare `import 'playwright'`
  fails outside `/opt/node22`.** Never disable TLS verification, never unset `HTTPS_PROXY`.
  Per case: open `index.php?/cases/edit/<id>`, click the `#custom_<field>_display .fr-element` editor,
  `Control+A` + `Delete`, **PASTE** the intended text with `keyboard.insertText` (**paste, never
  re-type** — re-typing introduced curly apostrophes on C30197), click `#accept`, then verify by API
  re-GET **and** by re-reading the view container. Working script:
  `build/report-suite/damage-2026-08-26/ui_repair_batch.mjs`.

- **🔧 `delete_case` — AND EVERY WRITE ENDPOINT — MUST BE A POST WITH A BODY; A GET RETURNS HTTP 404
  AND THE CASE SURVIVES (2026-08-26).** A helper that only switches to POST when it has a payload will
  send `delete_case/<id>` as a GET. TestRail answers **404**, which reads like "already gone" — but the
  case is still there. Send `{}` as the body, and **always confirm with a re-GET**: a genuinely deleted
  case returns **HTTP 400 `"Field :case_id is not a valid test case."`**, not 404.

- **🔧 `add_case` REQUIRES `custom_automation_type` AS WELL AS `custom_atmstatus` (2026-08-26).**
  Omitting it returns HTTP 400 `{"error":"Field :custom_automation_type is a required field."}`.
  Both are required on this instance. **`custom_automation_type` must be a REAL type — `1 E2E ·
  2 Functional · 3 Unit`, NEVER `0`/None (QA lead 2026-09-02)**; `custom_atmstatus: 1` = Not Automated
  (**never send `3` on a throwaway** — that is the Automated flag Rule 71 protects). Same requirement on
  any CSV/XML upload file: an Automation Type per case, never blank.

- **🛑🛑 DECLARED HAZARD #6 — `update_case` NOW RENDERS THE MARKDOWN FIELDS TO HTML AND STORES THE HTML
  ON *EVERY* WRITE — A TESTRAIL-SIDE CHANGE ON 2026-08-19, AND IT IS A HARD BLOCK ON ALL TEXT-FIELD
  WRITES WHILE ACTIVE (diagnosed 2026-08-19, Report Suite; evidence
  `build/report-suite/build-verify-2026-08-18/UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md`).**
  **This is NOT normalisation #3 and NOT hazard #5.** #3 wraps only the fields you OMIT; #5 fires
  hours later when a run owner works the case in the UI. **This one fires on your OWN write, during
  the write, on fields you SEND, regardless of content.** `custom_expected` / `custom_preconds` /
  `custom_steps` (all `format: markdown`, `get_case_fields` HTTP 200) come back **wrapped in
  `<p>…</p>\n` with `—` escaped to `&mdash;` and `&`/`<`/`>` entity-escaped** — i.e. a full
  markdown→HTML render, stored.
  **PROVEN TESTRAIL-SIDE, NOT A METHOD ERROR (this is the important part — do not "fix your payload"):**
  the **exact Python `tr_client` method that byte-verified CLEAN on 64 Schedule batch-C cases at
  ~08:30 UTC** (all three text fields sent explicitly, `Content-Type: application/json`, JSON body)
  **wrapped when re-run at ~10:45 UTC the same day.** A **115-minute change window** is bracketed by
  the last clean write (C30016, 2026-08-19 08:30:28 UTC) and the first wrapped write (C30133,
  2026-08-19 10:25:27 UTC). TestRail is hosted (`shopview.testrail.io`); we do not control its version.
  **NO WRITE METHOD AVOIDS IT — battery on C30133 (the standing canary):** a trivial single word
  `"plain test line"` → `"<p>plain test line</p>\n"`; a numbered string, hyphens-not-em-dash, and
  all-three-fields payloads **all wrap**; only sending content that is **already the exact HTML**
  round-trips idempotently (`"<p>already wrapped</p>"` → unchanged), which just stores the raw-markup
  defect. So there is **no payload shape that stores the house plain-text form.**
  **IT IS RENDER-ON-WRITE (STORED), NOT RENDER-ON-READ:** cases not written today (C30016/C30096/
  C30124) still read back **clean** via the same `get_case`, so the HTML is in storage, not applied at
  read time — and this project renders the STORED value literally to the manual tester.
  **WHAT TO DO WHILE IT IS ACTIVE:** **HALT all text-field `update_case` writes** (the SBC sweep's halt
  was correct, Rule 50). A refs-only or marker-only re-stamp is **also blocked**, because #3 forces you
  to send all three text fields on every `update_case` and they will wrap. **RE-TEST CHEAPLY before any
  future write batch:** write a throwaway string to **C30133** and re-GET — if it returns with no
  `<p>`, the block has lifted; then repair anything wrapped during the block with
  `build/markup-regression-2026-08-10/demark.py` + a post-batch census (C30133 first). Do not report
  "0 raw markup" as durable while this is active.
  **⏱️ RE-TEST 2026-08-19 11:16 UTC — STILL ACTIVE (block NOT lifted).** The QA lead manually
  Edit→Saved C30133 in the TestRail UI and it stored clean (literal `—`, HTML `<p>`/`<br>`/`&nbsp;`
  that *renders* clean), so the **UI path is clean**. But an **idempotent API `update_case`** of that
  exact content (1 write, HTTP 200) **re-wrapped it**: trailing `\n` appended to all three fields and
  the literal `—` re-escaped to `&mdash;` in `custom_expected` (1074→1087 b); `refs` byte-identical
  (non-markdown). **So it is UI-clean / API-dirty — a TestRail API-side regression, for their
  support.** Fields are still `format: markdown` (no config switch). The literal-em-dash→`&mdash;`
  escape is the decisive discriminator (pure-ASCII HTML round-trips idempotently even during the
  block; a literal `—` is re-escaped only when the render still runs). **All paused text-field writes
  stay HALTED; C30133 is re-wrapped and can only be re-fixed via the UI by the QA lead.** Evidence:
  UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md §8; snapshots `/tmp/c30133-retest/{PRE,POST}.json`.
  **⏱️ RE-DIAGNOSIS 2026-08-19 ~11:35 UTC — STILL ACTIVE; the visible symptom is now RUN-TOGETHER
  numbered lines, and the ONLY API format that renders as separate lines is embedded `<br>`.** The QA
  lead reported C30133 "no longer shows `<p>` but the numbered lines run together (no line break after
  each numbered item)." **Cause:** the block wraps the WHOLE field in a SINGLE `<p>…</p>`, and inside
  that one `<p>` HTML block TestRail's markdown render turns **NO** internal whitespace into a line
  break — not `\n`, not `\r\n`, not a blank line `\n\n` (a full battery on C30133 confirmed each stays
  in one `<p>`, `\n` preserved verbatim, never `<ol>/<li>`; `\n\n` is NOT split into separate `<p>`).
  So single-`\n`-joined numbered items collapse onto one visual line. **This corrects §5's imprecise
  "full markdown→HTML render" wording:** the block never built `<ol>/<li>` — it only escapes
  `&`/`<`/`>`/`—`, preserves recognised inline HTML (`<br>`, `<p>`), single-`<p>`-wraps, appends `\n`.
  **The clean pre-block cases (C30016/C30096/C30124) render as separate lines ONLY because they are
  stored PLAIN with NO `<p>` (markdown builds an `<ol>` from `1.\n2.\n3.`).** "`<p>` no longer shows"
  just means the field IS markdown-rendered (the `<p>` renders as a paragraph, not shown literally).
  **THE CORRECT WRITE FORMAT:** (1) the **clean/correct house form stays `1. line\n2. line\n3. line`
  (plain, single `\n`, NO HTML)** — it renders as separate lines only when stored WITHOUT the `<p>`
  wrap, so **the true fix is TestRail lifting the wrap block; then no writer change is needed.**
  (2) **INTERIM workaround that renders line-broken DESPITE the block: join numbered items with a
  literal `<br>`** (`1. line<br>2. line<br>3. line`) — the block PRESERVES `<br>` (does not escape it)
  and it renders as a break. **Cost: it stores raw HTML `<br>` (+ `&mdash;`; `---` shows literally, no
  `<hr>` inside the wrap) — the very markup the house style avoids and the `demark.py`/census tooling
  strips, and it makes `words()` mis-count list markers. Display workaround, not a clean fix.**
  **RESUME?** clean-form passes: **NO** (still wrap → run-together) — keep HALTED and escalate the API
  regression to TestRail support; `<br>` form: functionally yes but stores raw HTML — adopt only if
  the QA lead accepts it as interim. **C30133 was restored with the `<br>` form (renders line-broken),
  byte-verified round-trip, 0 collateral, refs intact; a UI Edit→Save would make it byte-clean.**
  Evidence: UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md §9; snapshots
  `/tmp/c30133-rediag/{CURRENT-BEFORE,PROBE-RESULTS,PROBE2,RESTORED}.json`.
- **⚠️ DECLARED NORMALISATION #2c — `case_refs` ON A RUN RESULT IS A STORED SNAPSHOT, NOT A LIVE
  MIRROR (found 2026-08-10, Schedule).** Normalisation #2b called `case_refs` a read-time echo. It is
  better described as a **snapshot that catches up when the case is next written**: on 2026-08-10 it
  moved on **208 run-357 result records belonging to cases whose `refs` we never edited**, purely
  because those cases were touched by an unrelated `custom_expected` write. So **do not use "its refs
  did not change" to predict that `case_refs` will not move** — any `update_case` on a case can
  refresh it across that case's whole result history. Treat it exactly as #2b says: a **derived**
  field, never graded, never writable by us, and excluded from the untouched-run comparison alongside
  `case_title`. Verify the run on the graded fields only.
- **🛑 DECLARED HAZARD #5 — TESTRAIL RE-RENDERS A CASE'S TESTER TEXT INTO HTML *HOURS AFTER* YOUR
  WRITE, WITHOUT MOVING `updated_on` OR `updated_by` — SO THE IMMEDIATE RE-GET BYTE-CHECK CANNOT SEE
  IT (proven 2026-08-10, Filters + Schedule).** **This is NOT normalisation #3 and the mitigation for
  #3 does not prevent it.** #3 fires *during* a partial write and wraps the omitted field in `<p>`
  with `\r\n`. **This one fires later, on cases written with all three fields sent**, and produces a
  **full rich-text render**: `<ol>`/`<li>` built out of numbered lines, plus `<p>`, `<br />`,
  `<hr />` for `---`, `<a href>` around bare URLs and `&nbsp;`, with plain `\n`.
  **THE PROOF, and it is the part that matters:** two committed **live** snapshots of the same 110
  Filters cases, 2.5 hours apart with **no write in between** — `cases-POST.json` (commit `3e34d4ea`,
  5 Aug 17:25) and `PRE-cases-110.json` (commit `a4f8b870`, 5 Aug 19:56) — differ on **10 cases, in
  exactly `custom_preconds`, `custom_steps` and `custom_expected` and no other field**, while
  **`updated_on` is byte-identical in both (`1785950271`) and `updated_by` is 3 in both**. Content
  moved; the timestamp did not. **`updated_on` is therefore NOT a reliable change detector for case
  text** — compare content, never timestamps (this is the concrete proof behind that standing
  caution).
  **WHAT TRIGGERS IT:** the run owners working the cases in the TestRail UI, not our writes. Run 357
  has been graded exactly once ever — user 5, 10 Aug 21:17–21:31 UTC, 28 results — and **19 of the 20
  Schedule cases found rendered had been graded inside that 14-minute window**, out of only 26 graded
  in the whole 168-case suite. Two were already rendered earlier that day, so it is the tester
  *working in* the case rather than the act of grading itself.
  **WHY IT DEFEATS OUR VERIFICATION:** at re-GET time the text is still exactly what we sent, so every
  pass since 5 August truthfully reported "0 raw markup" and every one of them was right at the moment
  it looked. Tightening the write path cannot fix this.
  **THE MITIGATION — a DEFERRED census, not a tighter write:** **(1) census raw markup across the whole
  project at the START of every pass**, before any write, and treat a non-zero count as a finding to
  repair rather than a surprise; **(2) never report "0 raw markup" as a durable state** — it is true
  only of the moment it was measured; **(3) expect repaired cases to regress** once a tester next works
  through them, and say so rather than implying the repair is permanent. **It matters because these
  projects render that markup LITERALLY to the manual tester**, who then cannot follow the case.
  Converter + evidence: `build/markup-regression-2026-08-10/` (`TRACE.md`, `demark.py`,
  `exec_repair.py`); 40 cases repaired 2026-08-10, census afterwards **0 of 282**.
- **🔧 REPAIR RECIPE — THE BARE-`\n`-INSIDE-`<p>` COLLAPSE, AND THE TWO WAYS TO FIX IT (proven
  2026-08-21; this is the *repair* half of hazard #5 and of the wrap-block bullet above, both of which
  describe the defect but not how to undo it).**
  **THE DEFECT, in one line:** a text field stored as `<p>…</p>` containing **bare `\n` and NO `<br>`**
  renders to the manual tester as **ONE COLLAPSED RUN-ON PARAGRAPH** — numbered steps arrive as a wall
  of text. Inside a single `<p>` block TestRail turns **no** internal whitespace into a line break, so
  `\n`, `\r\n` and `\n\n` all collapse. **The fix is `<br>` tags.**
  **PATH (a) — API `update_case`.** Rewrite the field with explicit `<br>` where the breaks belong.
  **Change ONLY the line breaks — never a word of the wording** (Rule 57: a reflow is formatting, not
  a re-authoring). Send all three text fields + `refs` on the payload (normalisation #3) and byte-verify.
  **PATH (b) — THE UI "." TRICK**, for a field the API cannot clean while the wrap block is active:
  open `https://shopview.testrail.io/index.php?/cases/edit/<id>` → **append `.` to the Title** → Save
  (this pushes the whole case through TestRail's HTML pipeline, converting `\n` → `<br>`) → reopen →
  **remove the `.`** → Save. Two writes, title back to byte-identical.
  **⚠️ DANGER — THE "." TRICK *COLLAPSES* A FIELD THAT IS ALREADY BARE-`\n`-INSIDE-`<p>`-WITH-NO-`<br>`.**
  On such a field the pipeline preserves the single `<p>` and the `\n`s, so the trick makes the run-on
  paragraph **permanent** instead of fixing it. **Those cases must be API-rewritten (path a) FIRST**,
  then the trick is safe on the rest. **DETECT before choosing a path**, on **MID-TEXT** newlines only:
  `('\n' in text and '<p' in text.lower() and '<br' not in text.lower())`.
  **🔴 CORRECTION 2026-08-25 — THAT DETECTOR IS WRONG AND IT COST A DAMAGED CASE. USE THE REFINED ONE.**
  The expression above flags **any** field that contains a `<p>` anywhere plus a newline anywhere — which
  is the **NORMAL, CORRECT shape the CSV import produces**: a field of block elements
  (`<ol><li>…</ol>` · `<hr />` · `<p>provenance</p>` · `<p>marker</p>`) separated by newlines. Those
  newlines sit **BETWEEN blocks**, where they are insignificant whitespace, and the field renders
  perfectly. The prose above says *"MID-TEXT newlines only"*, but **the code as written does not
  implement that qualifier**, and a session implementing it literally will flag most of a suite.
  **THE REFINED DETECTOR — a newline inside ONE `<p>`'s own inner text:**
  ```python
  P_BLOCK = re.compile(r'<p\b[^>]*>(.*?)</p>', re.S | re.I)
  def genuine_collapse(t):
      return any('\n' in inner.strip() and '<br' not in inner.lower()
                 for inner in P_BLOCK.findall(t or ''))
  ```
  **MEASURED BOTH WAYS over the 428 cases of the six August suites: the old detector claimed 16
  collapsed cases; the refined one finds 0.** All 16 were the normal import shape.
  **THE SCAR:** a batch built on the old detector wrote `<br>` throughout
  **[C44506](https://shopview.testrail.io/index.php?/cases/view/44506)**, whose `custom_expected` was
  correct block HTML. TestRail re-parsed the result and **relocated `</ol>` to the end of the field**, so
  its provenance and marker paragraphs are now nested inside the ordered list. **Two API attempts to
  restore it — the original bytes verbatim, then the blocks made contiguous — were both re-parsed the
  same way** (see DECLARED NORMALISATION #3a-iii). **⇒ VALIDATE A DETECTOR AGAINST A KNOWN-GOOD CASE
  BEFORE BUILDING A BATCH ON IT.** A detector that cannot distinguish the correct shape from the broken
  one manufactures work and then damage.
  **⇒ AND FOR STRUCTURAL DAMAGE OF THIS KIND, PATH (b) IS THE UNTRIED OPTION, NOT "PERMANENT".** The API
  cannot rebuild the block structure; the **UI "." trick pushes the case through a DIFFERENT pipeline** —
  the one that produced the clean structure originally. On a case with no bare-`\n`-inside-`<p>` field the
  danger note above does **not** apply, so the trick is safe to attempt. **Say "not recoverable via the
  API" — never "permanent" — until path (b) has actually been tried.**
  **⚠️ FALSE POSITIVE THAT COST TWO WASTED PASSES (2026-08-21) — A LONE *TRAILING* `\n` AFTER `</p>` ON
  A SINGLE-LINE FIELD IS HARMLESS.** There is no mid-text break to lose, nothing renders wrong, and
  **rewriting it INJECTS A SPURIOUS BLANK LINE** the tester then sees. **Leave it alone.** Strip the
  trailing newline before applying the detector, or it flags every clean single-line field in the suite.
- **🛑 DECLARED HAZARD #4 — EDITING A JIRA DESCRIPTION *DESTROYS* ANY PASTED IMAGE WHOSE MEDIA NODE
  YOU DO NOT CARRY INTO THE NEW BODY, AND THE DELETION IS NOT IN THE CHANGELOG (proven the hard way
  2026-08-06, Report Suite ticket reformat).** This one is in §J rather than the Jira section because
  §J is where the declared write hazards live and this is the same class of silent, unlogged loss as
  #3 — **but it is JIRA, not TestRail.**
  **THE MECHANISM.** A **pasted** screenshot is an **embedded** attachment: the only reason the file
  exists is the `media` node inside the description that points at it. `PUT /rest/api/3/issue/{key}`
  with a new `description` that does not contain that node removes its last reference, **and Jira
  deletes the file.** Proven: **[SV-8818](https://shopview.atlassian.net/browse/SV-8818)** lost
  `image-20260804-061644.png` (attachment `59255`, media `4aec0119-…`) on write **1 of 63**. The file
  is **unrecoverable** — `GET /rest/api/3/attachment/59255` now returns **HTTP 404** *"The attachment
  with id '59255' does not exist"* — and no copy exists anywhere.
  **AND THE CHANGELOG DOES NOT MENTION IT — VERIFIED LIVE, AND THE ASYMMETRY IS THE POINT.** Read
  live 2026-08-06 (`GET /rest/api/3/issue/SV-8818/changelog`, 22 entries): the changelog **DOES** log
  attachment **additions** — five separate `Attachment` items, including `image-20260804-06164…` being
  added at `01:17:54.565-0500` — but the destroying write at `08:25:43.777-0500` logs **exactly one
  item, `description`, and NO attachment item at all.** **Jira records the arrival of a pasted image
  and stays silent about its deletion.** So from Jira's own history nobody can reconstruct that the
  file went. **The loss is provable ONLY because the write was byte-compared against a pre-write
  snapshot (Rule 50)** — the same reason the silent Product Area wipe under Rule 52 was ever
  detectable.
  **THE WORKING METHOD — LIFT THE EXISTING NODES VERBATIM, DO NOT REBUILD THEM.** Before building the
  new body: walk the CURRENT description's ADF, deep-copy every **`mediaSingle` / `mediaGroup`** node
  whole, and place those copies into the new body. Then **assert `media_ids(new) ⊇ media_ids(old)` and
  REFUSE TO WRITE the ticket at all if it does not hold** — a refusal costs nothing, a write costs the
  file. Proven on 8 tickets: SV-8821's two pictures and SV-8844's picture + screen recording came back
  **byte-identical**.
  **REBUILDING A NODE FROM THE MEDIA ID IS SAFE FOR THE FILE BUT LOSES THE DISPLAY ATTRIBUTES.** The
  Report Suite pass rebuilt nodes as `{'mediaSingle', attrs:{layout:'align-start'}}` + `{'media',
  attrs:{type:'file', id, alt, collection:''}}`. The file reference survives — nothing is deleted —
  but `width` / `height` / `localId` on the media node and `width` / `widthType` / `layout` on the
  wrapper are **dropped**, so a picture the author had sized to 921px renders at full size and a
  centred one becomes left-aligned. Cosmetic, but it is a real diff a byte-check will flag: seen on
  SV-8820 (×2), SV-8823 and SV-8879. **Verbatim lifting avoids it entirely.**
  **VERIFY AFTER EVERY WRITE, BY ID.** Re-read the issue and compare the `attachment` array
  **attachment id by attachment id, and each survivor's filename** — never by count, because a count
  match hides a swap. A description-only edit must leave `attachment` byte-identical.
  **A DANGLING ATTACHMENT *CAN* BE MADE INLINE — the media UUID is obtainable (proven 2026-08-06,
  correcting an earlier note that said it was not).** `curl -D - -o /dev/null` on
  `/rest/api/3/attachment/content/{attachment_id}` returns a **303** whose `location` is
  `https://api.media.atlassian.com/file/{UUID}/…`; that UUID is the `attrs.id` an ADF `media` node
  needs. **Keep only the UUID — the signed token on that URL is a secret and is never stored or
  printed.** This is how SV-8818 came to show `parts-velocity-download-menu.png`, an image that had
  been attached and never referenced. No media-API upload is required.
  **REUSABLE TOOLING (read-only auditor + safe writer):**
  `build/ticket-reformat-2026-08-06/attachment-audit/tools/{jira.py,audit.py,media_exact.py}` — audits
  every ticket's attachment set against a pre-write baseline and every media reference attribute by
  attribute; `build/ticket-reformat-2026-08-06/closed-tickets/tools/rewrite.py` — the writer that
  lifts nodes verbatim, refuses on a would-be drop, and byte-verifies. Full evidence:
  `build/ticket-reformat-2026-08-06/attachment-audit/ATTACHMENT-VERIFICATION.md` (92 tickets, 46
  attachments before, 45 now, 1 loss, 0 renamed, 0 broken references).
- **`/api/reporting/reports/{slug}/export` REQUIRES `variant` (proven live 2026-08-05, `sv8582`,
  `v3.5-16cf83f`).** `?format=pdf&range=this_year` alone returns **HTTP 400** `{"errors":[{"error":"Invalid
  export variant. Allowed values: summary, expanded."}]}`. The working shape is
  `?format=csv|pdf&range=<preset>&variant=summary|expanded[&locations=<id>[,<id>]]`. Accepted `range`
  values on that build: `this_year` `last_year` `this_quarter` `last_quarter` `this_month` `last_month`
  `this_week` `last_week` `today` `yesterday` (all 200); `custom` needs `start_date`+`end_date`;
  **`last_12_months` returns 400 "Selected date range is invalid."** `locations` is a **comma-separated**
  list (not `locations[]`), and an unknown id gives 400 `Invalid location id "…"`. Report slugs:
  `sales-by-customer` `sales-by-representative` `parts-velocity` `technician-utilization`
  `work-in-progress` `inventory-value`. Filenames come back on `content-disposition`, and each CSV opens
  with a UTF-8 BOM then `"Date Range: …"` and `"Locations: …"` metadata lines above the header row.
- **🛑🛑 THE C30341 LESSON — BYTE-VERIFICATION PROVES YOU WROTE WHAT YOU INTENDED, NOT THAT YOUR
  INTENT WAS **CORRECT** (found the hard way 2026-08-06, Report Suite). READ THIS BEFORE TRUSTING A
  CLEAN BYTE-CHECK.** **C30341** stores its text as **raw HTML** (`<ol>/<li>`, `<hr />`,
  `<p>AUTOMATION: READY</p>`). None of the writer's plain-text patterns matched that form, so instead of
  **REPLACING** the Rule-54 provenance line and the automation marker it **APPENDED A SECOND ONE OF
  EACH** — and **the Rule-50 byte-check PASSED, because the write was faithful to the payload; the
  PAYLOAD ITSELF WAS WRONG.** **TWO MITIGATIONS, both now standing practice:** **(a) make the writer
  REFUSE OUTRIGHT on any case whose stored text contains raw markup** rather than pattern-matching
  through it (the `rebuild()` guard added that day); **(b) RUN A CENSUS AFTER EVERY BATCH** confirming
  **exactly one provenance line and exactly one marker per touched case** — that census is what found
  this, not chance. The repair converted the case to plain numbered text with **not one word of meaning
  changed**. **Generalise it: a byte-check is a check on FIDELITY, never on CORRECTNESS — pair it with a
  post-batch invariant census, always.**
- **🛑 `updated_on` IS NOT PROOF A CASE IS UNTOUCHED — PROVE IT BY BYTE-COMPARING CONTENT (found
  2026-08-05, Report Suite; corrects a belief Standing Rule 50 leaned on).** **Fourteen** of our cases —
  **C30341 · C30392 · C30451 · C30456 · C30457 · C30460 · C30487 · C30490 · C30491 · C30493 · C30519 ·
  C30522 · C30526 · C30528** — had **all three text fields change from plain numbered text into raw
  `<ol>`/`<li>` HTML while `updated_on` and `updated_by` STAYED FROZEN** at values from *before* that
  pass began. Confirmed with a direct `get_case/30341`, which returned the markup while still reporting
  `updated_on=1785951654`. Nobody in that pass wrote to any of them. **CONSEQUENCE: every
  "we did not touch it" proof — including the Rule-38 proof that a foreign case is untouched — must be a
  BYTE COMPARISON OF THE FIELD CONTENT against a pre-write snapshot committed before the first write.
  A timestamp is context, never evidence.**
- **🛑 AND THE MIRROR IMAGE IS ALSO TRUE — A *FRESH* `updated_on` IS NOT PROOF A WRITE *LANDED*
  (found 2026-08-11, Filters; the companion to the bullet above, and the more dangerous of the two).**
  The bullet above is about a **frozen** timestamp hiding a change that happened. **This is the
  opposite: a MOVED timestamp advertising a change that did NOT happen.** Three Filters cases —
  **C29601 · C38882 · C43562** — carried **the current day's `updated_on`** while the write intended
  for them had **never landed**: the timestamps came from a *different* pass (the read-date sweep) that
  had legitimately touched the same cases hours earlier. A worker checking "did my write go through?"
  by timestamp would have read **today's date on all three and concluded success**. **WHY THIS ONE IS
  WORSE: the frozen-timestamp failure makes you re-check something that was fine; the fresh-timestamp
  failure makes you STOP checking something that is broken** — and on a shared suite, where several
  passes touch the same cases in a day, a fresh timestamp is the *expected* state and proves nothing at
  all. **THE RULE IS THE SAME IN BOTH DIRECTIONS AND HAS NO EXCEPTIONS: VERIFY BY CONTENT.** Compare
  the live field text against the **intended payload**, never against a clock. *(Recorded in
  `build/RECOVERY-2026-08-11/STATE.md` §B pass 2.)*
- **⚠️ THE WORK IN PROGRESS EXPORT TAKES DIFFERENT DATE PARAMETERS FROM THE OTHER FIVE REPORTS
  (proven live 2026-08-06, `v3.5-16cf83f`) — and getting it wrong makes a REAL HTTP 500 look like your
  own input error, which is exactly what blocked the finding for two passes.** The other five use
  `range=<preset>` (or `range=custom&start_date=&end_date=`); **Work In Progress uses `from=` and `to=`
  with FULL ISO INSTANTS**:
  `GET /api/reporting/reports/work-in-progress/export?format=csv|pdf&tab=<Tab>&from=2026-08-02T00:00:00.000Z&to=2026-08-06T23:59:59.999Z&locations=<ids>&columns=<list>&sortBy=days_open&descending=true`.
  **TAKE THE SHAPE FROM THE PRODUCT'S OWN DOWNLOAD MENU, NEVER GUESS IT** — attach a request listener
  and click the menu item; that is how this was recovered. **The rule generalises: when an export or
  read endpoint rejects every datetime form you try, assume YOUR shape is wrong and go read the request
  the product itself sends.** (Once the shape was right the real defect appeared: HTTP 500 on every
  non-empty tab in both formats, HTTP 200 with a real file when the window is empty — presence of rows,
  not size.)
- **Known runs — do NOT write without permission:** Custom Roles run **312**, section **3527**;
  Simple Flow / F&D / Schedule / Report Suite run **325** (and R359 Reports). Section IDs per project
  in CLAUDE.md.
- **THE `refs` FIELD HAS A PER-ENTRY LIMIT OF 248 CHARS AND IS COMMA-DELIMITED (probed live
  2026-08-03, Report Suite verifier-fix pass).** TestRail treats `refs` as a COMMA-separated list of
  references: it **splits on `,`, TRIMS each entry, and re-joins with a bare `,`** (sent
  `"AAA, BBB,   CCC ,DDD"` → stored `"AAA,BBB,CCC,DDD"`). Any **single entry longer than 248
  characters rejects the WHOLE `update_case`** with **HTTP 400 `Field :refs does not match the
  required pattern.`** — 248 passes, 249 fails, and it is a *pattern* error not a length error, so
  it is easy to misdiagnose. **Total** length is unbounded (674 chars across 40 short entries → 200).
  **Consequences:** (a) **write Rule-20 `refs` COMMA-FREE and ≤ 248 chars, using semicolons as
  separators** — this is already the house style: all 475 Report Suite `refs` are comma-free single
  entries, longest 245, and one earlier author wrote `"the 10; 000-row cap"` to dodge the comma in
  10,000; (b) never put a comma inside a quoted list in `refs` (`"Today, Yesterday, …"` silently
  becomes many references) — describe the list instead; (c) **when verifying a `refs` write, compare
  under the normalisation** `','.join(p.strip() for p in s.split(','))`, or a byte compare will
  report a false mismatch. Probe + validator: `build/report-suite/verifier-fixes-2026-08-03/tools/`
  (`refs_final.json` asserts comma-free + ≤ 248 before every run).
  **⚠️ THIS IS THE ONE DECLARED NORMALISATION PERMITTED BY STANDING RULE 50** ("verify exhaustively —
  byte-level means nothing is skipped, sampled, or assumed": **every case, every field, no sampling**,
  and then **exact** byte comparison). It may be applied **only because it is recorded HERE with
  its evidence**, and it must be **asserted explicitly as the expected transformation** in the audit
  log — never treated as "close enough". Every OTHER field is compared **raw byte-for-byte**, and any
  **NEWLY discovered normalisation must be added to this section, with its evidence, BEFORE it may be
  relied on** to explain away a mismatch. Until it is recorded here, **a mismatch means the write
  FAILED** — stop the batch and report both byte sequences (Rule 50).
- **TestRail swallows angle-bracket `<placeholders>` as HTML — never use `<` `>` in case text; write
  plain words instead** (e.g. "Expand, then the technician's name" — not an angle-bracket
  placeholder). Confirmed live 2026-07-29: TU-DAY-01/C30418's expected result imported 2026-07-22 as
  "Expand 's daily breakdown" — the placeholder was eaten as an HTML tag. Sweep any import/push
  payload for `<` before sending.
- **WHO CREATED / LAST UPDATED A CASE (how to spot FOREIGN cases — not ours)** *(proven 2026-07-31;
  this is how Vladimir Tomovic's 5 Report Suite cases C38919–C38923 were identified)*
  - **In the UI:** case page → **bottom-left "People & Dates" panel** → **Created** (name + date) and
    **Updated** (name + date).
  - **Via the API:** `get_case/{id}` returns **`created_by` / `updated_by` as USER IDS** (+
    `created_on` / `updated_on` epoch). `get_cases` returns them in bulk too, so one paged pull covers
    a whole suite. Resolve ids with **`get_user/{id}`** — **`get_users` is ADMIN-ONLY** for our Lead
    account (`Access Denied. You are not a TestRail administrator. Field:project_id is a required
    field.`, and adding `&project_id=1` does NOT fix it). Our own id: `get_user_by_email&email=…`.
  - **User map (project 1):** 1 Vladimir Tomovic · 2 Nebojsa Glavinic · **3 Bilal Muzamil = US (the
    account we push with)** · 4 Viktoria Videnovic · 5 Ayesha Khan · 6 Mudassir Qamar · 7 Ahtasham
    Amjad · 8 Chris Amani · 9 Sasha Grossman. Ids 10+ do not exist.
  - **Practical tells beyond `created_by`** (measured over 474 of our Report Suite cases vs his 5):
    **`refs` empty** (ours: 474/474 populated — Rule 20 means we never ship a case without one) ·
    **`template_id` 2 = Steps** (ours: 1 = Text, 474/474) · **`custom_automation_type` unset/`0`** (ours:
    now always a real type 1/2/3 per the 2026-09-02 rule; historically `0`) · **`type_id` 7 "Other"** (ours: 6/5/1/2) · **titles over 80 chars** (ours: 0/474 —
    the ≤80 title rule) · **no expected results at all** (automated cases keep the assertion in code).
    **⚠️ `custom_atmstatus` is NOT a usable tell** — it is 3 ("Automated") on his cases AND on 16 of
    ours. Field decode from `get_case_fields`: atmstatus `1 Not Automated · 2 Cannot be automated ·
    3 Automated · 4 Pending`; **automation_type `0 None · 1 E2E · 2 Functional · 3 Unit`** (verified live
    from `get_case_fields` 2026-09-02 — an earlier note saying "1 Ranorex" was wrong).
  - **The reusable READ-ONLY checker:** `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`
    — pulls every live case under a group, splits ours vs foreign by `created_by`, and ranks the
    best-matching OF-OURS cases per foreign case on **normalised assertion text** (title + preconds +
    steps + expected, not the title alone), printing the tells + a verdict-ready table.
    `source /tmp/tr-creds.env && python3 foreign_overlap_check.py --group 4281` (Report Suite; Filters
    **4110**, Schedule **4254**; `--top N --min-score X --csv out.csv --refresh`). Similarity only
    **suggests candidates — a human confirms** DUPLICATE / AUTOMATED EQUIVALENT / NEW COVERAGE (the
    true duplicate found on 2026-07-31 scored just 0.264, because his cases carry no expected results
    to match on; trust the RANK, not the value, and read the top handful).
  - **STANDING EXPECTATION — re-check after every authorized push.** As the last step of any push
    manifest/execution log (right next to the Rule-34 run-sync), re-run the checker on the group to
    (1) catch **new foreign cases** and (2) catch **new overlaps** between someone else's cases and
    ours, so drift is found the same day instead of at audit time. Always report **"ours N / live
    total M"**. **Never edit/delete/move a foreign case or add one to a run** — identify it, exclude
    it from our counts, raise it with the author (see CLAUDE.md standing convention).
  - **⚠️ THE OVERLAP CHECKER ONLY FINDS HALF THE PROBLEM — ALWAYS RUN THE REVERSE ONE TOO
    (Standing Rule 45a).** `foreign_overlap_check.py` answers *"do THEIR cases duplicate OURS?"*.
    It **cannot** find the shape that actually cost us on 2026-07-31: an assertion of theirs with
    **NO counterpart in ours**. **Their case existing where ours does not is a COVERAGE SIGNAL, not
    a nuisance.** The reverse checker is
    **`build/gap-rootcause-2026-07-31/reverse_coverage_diff.py`** (READ-ONLY, `get_*` only, no POST
    code path):
    ```
    source /tmp/tr-creds.env
    python3 build/gap-rootcause-2026-07-31/reverse_coverage_diff.py \
      --group 4281 --group 4110 --group 4254 --scope-to-section \
      --md OUT.md --csv OUT.csv --json OUT.json
    ```
    Flags: `--scope-to-section` (compare only against OUR cases in the same report/area folder —
    **use it**, it cuts most cross-report noise) · `--sig-size N` (signature tokens, default 3) ·
    `--ours-uid 3` · `--cache-dir /tmp/trrcd` · `--refresh`. Groups: Report Suite **4281**, Filters
    **4110**, Schedule **4254**.
    **How to read the output — the useful block first.** It splits each foreign case into
    **assertion units** (a single foreign case routinely mixes one assertion we cover with one we do
    not) and labels each **COVERED-BY / CANDIDATE GAP / CONTRADICTS-OURS**, naming the **missing
    token**. Two things make it readable rather than noisy:
    - **`STRENGTH`** — **STRONG** = the missing word IS in our own vocabulary, it just never
      co-occurs with the rest (a meaningful absence); **PHRASING** = a word we never use anywhere
      (*"refetch"*, *"widened"*) = their wording, not our gap. **Only STRONG units set the
      case-level verdict.**
    - **`CLOSED-LIST COLLISIONS`** — **read this block first.** It finds OUR cases that enumerate a
      closed list (*"exactly"*, *"in order"*, *"only these"* — the Rule 42 time-bomb shape) on the
      same subject as a foreign case, and names the term their case asserts that our closed list
      never mentions. **This is the detector for the actual 2026-07-31 defect:** for **C38923** it
      narrowed **474 of our cases to 8** with the two real defects — **SBR-EXP-10 = C30285** and
      **SBR-EXP-11 = C30286** — ranked **3rd and 4th**.
    **Honest limits (say them when quoting it):** lexical, not semantic — a gap phrased in words we
    use elsewhere can read as COVERED-BY, and a synonym can read as a gap; the per-unit verdicts on
    step-only automated cases carry real false-alarm noise from setup prose (**that is why the
    collision block and the STRONG filter exist**); it compares written text on both sides and
    **proves nothing about the running build** (Rule 12). It **suggests — a human rules.** A
    CANDIDATE GAP goes to the QA lead; **never author or push from it unasked** (Rule 6), and
    **never touch the foreign case** (Rule 38).
    **Live baseline 2026-07-30T20:20Z** (read-only, zero writes): Report Suite **4281** = live 479 =
    ours 474 + **foreign 5, all Vladimir Tomovic (user id 1; we are id 3)**; Filters **4110** = 110 =
    ours 110 + **0 foreign**; Schedule **4254** = 165 = ours 165 + **0 foreign**. Output kept at
    `build/gap-rootcause-2026-07-31/REVERSE-DIFF-2026-07-31.md`.
- **🔴 `get_history_for_case` IS THE AUTHORITATIVE RECORD OF A FOREIGN EDIT — CHECK IT FIRST (proven
    live 2026-08-28; CORRECTS A STANDING BELIEF).** `GET index.php?/api/v2/get_history_for_case/<case_id>`
    returns **one entry per save**, each with `id`, `created_on` (unix), `user_id`, `type_id`, and a
    **`changes[]` array carrying `field`, `old_value` AND `new_value`** — **full text bodies, not
    truncations**: `title`, `refs`, `custom_preconds`, `custom_steps`, `custom_expected`,
    `custom_atmstatus`. **It survives our own later overwrites**, so a foreign edit is reconstructable
    field by field long after the fact. **Nothing may be reported as "we cannot establish what was
    changed" until this call has been made and its output recorded** (Rule 12). Committed body
    snapshots (Rule 87) remain useful as a **fast offline diff** and for the things history cannot do —
    a **deleted** case has no history, history is **one call per case** so it does not scale to a
    714-case group, and it cannot show that a case **appeared or vanished** — but **history is primary**.
    **SUPERSEDED, kept visible per Rules 32/33:** the pre-2026-08-28 playbook/rule position that
    *"TestRail stores only the LAST writer; there is no per-field history"* is **FALSE** — it was true
    of `updated_by` / `updated_on` only, then wrongly generalised.
    **Evidence:** **C29557** returned **17 entries** and recovered the 2026-08-05 Ahtasham Amjad
    (user id 7) edit in full — three fields, a rich-text save that `<p>`-wrapped them and truncated
    Expected Result 687 → 423 chars (`build/custom-roles/foreign-edit-C29557/HISTORY.json`). **C27792
    and C27805** returned **exactly one entry each — `custom_atmstatus` `1 → 4 Pending`, no text change**
    — disproving the claim that an undiffable body edit had happened to them.
    **`custom_atmstatus` values: `1` Not Automated · `3` Automated · `4` Pending. `4` IS NOT `3`** — a
    `1 → 4` move does **not** make a case Automated and does **not** trigger Rules 65 / 71, but it means
    someone has queued it for automation, so **preserve the value and never send that field**.
- **🔧 ON THE CASE EDIT PAGE, REFERENCES IS `div#refs` — `#requirements_display` IS A DIFFERENT FIELD
    (DOM-probed 2026-08-28).** The **References** field is the **contenteditable `div#refs`**, backed by
    the hidden input **`#refs_hidden[name=refs]`** — that hidden input is what actually submits, so a UI
    edit must land in both. **`#requirements_display` is NOT references**: it is the unrelated **"AI
    context"** field, and driving it silently edits the wrong thing while appearing to work. Found while
    repairing C30518; source note `build/report-suite/damage-2026-08-26/C30518-REPAIR-2026-08-28.md` §6.

