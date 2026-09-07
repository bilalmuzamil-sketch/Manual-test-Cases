# READY-PLAN — Source-verify Inline Add & Edit Parts (6597) + Printer Friendly WO (6617)

**Status: STAGED, HELD FOR "RESUME" (QA lead, 2026-09-07).** Nothing external has been fetched or
written. Build verification is a SEPARATE session (not this one). This pass does **source
verification only** — make the cases current against the latest documents; leave build-dependent
routes PROVISIONAL where a QA build has not confirmed a label.

## The order
QA lead, 2026-09-07: *"we have the PRD updates for both the testing suites Inline Add part and WO
print. We need to source verify the testcases now, once you are done, I will need to build verify
them but build verification will be done in another session."* Then: *"pause for now until I say
Resume, but make everything ready to execute when I say resume."*

## Non-negotiables carried into this pass
- **Standing directive (skill 02 top):** the FIRST step of any source-verify is to pull the LATEST
  of EVERY source live, then proceed. No analysis/write off a held copy.
- **Rule 57:** expected behaviour comes from the DOCUMENTS, never the build. From the build we take
  only on-screen labels/navigation + pass/fail — and this session has no build anyway.
- **Rule 38 — Vladimir Tomovic (created_by==1) is NEVER touched**, whatever else is authorised:
  Inline **C45220** (foreign) and any other created_by==1 case the census finds. Check created_by
  live BEFORE any write, never the title.
- **Rule 71/65 — Automated (atm==3) cases:** the 2026-09-02 authorization covers updating Automated
  cases in exactly these suites to keep them runnable/build-verified, **Vladimir's excluded**. A
  source-verify change to an Automated case is allowed for OUR atm==3 cases only, and every one
  changed is logged in a FOR-VLAD note (Rule 65) with C-id + one-line change + whether it affects an
  automated assertion. Known OUR atm==3 (confirm live at census): Inline C45005, C45026, C45223,
  C45224, C45227, C45237; Printer C45123.
- **Rule 54 / skill 02 §8:** each source in a provenance line carries the date WE read it this pass;
  a source not re-read keeps its old date (back-filling today's date is a fabricated observation).
- **G8/G9 (Rule 69):** a metadata-only refresh (provenance/version/date, testable content
  byte-identical) does NOT change the AUTOMATION marker; never overwrite an EXPECT-FAIL/HOLD marker
  with anything.
- **Render trap:** write through the TestRail **UI editor (Froala `html.set`, deadlock-retry)** so
  every edited field lands `markdown fr-view`; an API write escapes it. Post-write: served-page
  container scan MUST show `fr-view` + zero literal tags + marker last.
- **Manually-added cases (Inline C45250-C45253, C45254):** source is "Manually added (QA lead)",
  NOT the spec pipeline — do NOT overwrite their Expected from the PRD. C45252 uses `<br>` from a UI
  save; never API-write it.

## Sources to pull LIVE at Resume (skill 02 five types)
### Inline Add & Edit Parts
| Source | Identifier | Last held | How to fetch |
|---|---|---|---|
| Spec/PRD | Confluence **782761986** | v16 (2026-08-31) | `getConfluencePage` id=782761986 (version + body + change log); also footer/inline comments |
| Epic + stories | **SV-9315** (SV-9316-9321 + Story 7) | 7 stories/129 rule IDs | `getJiraIssue` SV-9315 + `searchJiraIssuesUsingJql` parent=SV-9315 AND "Epic Link"=SV-9315 (two ways, no remainder); changelog (trap b) |
| Design | Claude "Add Part" artifact **561657da** (static export held) | appearance ref | check for a newer export; ask for download if link dead |
| Tech plan | intake-2026-08-25/sources/tech-plan-2026-08-18.md | behind PRD v13; informs only (Rule 30) | note currency |
| PO answers | Sasha Grosman | PO-IAEP-1/2 open | any newer written/Slack decision |

### Printer Friendly WO
| Source | Identifier | Last held | How to fetch |
|---|---|---|---|
| Spec/PRD | Confluence **519176194** | v9 (2026-08-31) | `getConfluencePage` id=519176194 (version + body + change log + comments) |
| Epic + stories | **SV-9383** (SV-9384-9389) | 6 stories/45 rule IDs | `getJiraIssue` + JQL two ways; changelog |
| Design | none | — | n/a |
| Tech plan | none | — | remind (Rule 30) |
| PO answers | **TBD** (PO-PFWO-1 open) | owner unconfirmed | flag again |

## Execution steps (run in order at Resume)
0. `git fetch origin` (Rule 100). Restart the MITM bridge:
   `cd build/atlassian-login && NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt /opt/node22/bin/node bridge.mjs 0 &` → note `/tmp/atlassian/bridge-port.txt`.
1. **Live census (system of record):**
   `python3 build/testing-tools/census_group.py --group 6597 --out /tmp/census-6597.json` and
   `--group 6617 --out /tmp/census-6617.json`. Filter rows by section-path prefix
   ("Inline Add and Edit Parts" / "Printer Friendly Work Orders"). Build three lists per suite:
   OURS (created_by==3, atm!=3), OUR-AUTOMATED (created_by==3, atm==3), PROTECT (created_by==1).
2. **Pull every source live** (tables above). Record Confluence version integers via
   `GET pages/<id>` metadata (trap a), Jira changelog (trap b), and DATE each rule's own text
   across versions before calling it new/old (trap c).
3. **Per-suite SPEC-DIFF (skill 02 step 5, Rule 43):** re-derive the requirement->case map from the
   NEW spec body + current case source, both directions. One verdict row PER added/changed/removed
   rule ID; reconcile row count to the diff's delta count; state both totals.
4. **Disposition each changed rule:** update the covering case's Expected (documents only, Rule 57) +
   re-stamp provenance to the new version/date; author a new case if a rule has no cover (skill 01);
   Rule-64 candidate + tell-Vlad if a rule was removed. Ambiguous/ document-vs-document conflict =>
   HOLD + PO question (do NOT resolve from the build, Rule 58). Unchanged rules => re-stamp
   provenance date ONLY, marker untouched (G8).
5. **Writes** through the Froala `html.set` harness (reuse `render-repair-2026-08-31/layman_fix.mjs`
   + `fix_deterministic.mjs`, Rule 27) targeting only changed fields; PROTECT list skipped by
   created_by; OUR-AUTOMATED changed => FOR-VLAD note. Re-read sources at write start (Rule 59; log
   both timestamps + second-read verdict).
6. **Post-write gates:** served-page `fr-view` scan (0 escaping), `check_case_render.py`,
   `check_runnable_cases.py` for any case whose steps changed (routes stay PROVISIONAL — no build),
   AUTOMATION arithmetic gate, run-sync R418/R419 union-only (Rule 34) if any case added/removed.
7. **PO question sheet** (xlsx, `make_question_sheet.py`) LAST, only if step 4 raised questions;
   layman wording; QA-internal tab for C-ids. Printer: re-raise PO-PFWO-1 (owner TBD).
8. **SOURCE-CURRENCY.md + SPEC-DIFF-2026-09-07.md** per suite; update both PROJECT-STATE.md files
   and OUTSTANDING-ITEMS-REGISTER.md.
9. **Report** in the five-table form (DONE/LEFT/BLOCKED/HOW-TO-UNBLOCK/HANDOFF-READY), C-ids named,
   ending with OUTSTANDING. Commit path-scoped after each suite (secret scan first); push to
   `claude/slack-session-0sxnd9`.

## Open question to raise at Resume if the diff is large
Tier-2 epic re-read (skill 02 step 3 / G5) is ASK-FIRST. If either epic shows meaningful story
movement, I will ask before an exhaustive per-ticket read rather than launch one unannounced.

## Note on "the PRD updates"
The QA lead said updates exist "for both suites." Expectation: the two Confluence pages have advanced
past v16 / v9. If a live fetch shows them UNCHANGED, or if he meant separate documents/attachments
not yet on Confluence, STOP and ask where the updated PRD lives before proceeding (Rule 1) rather
than verifying against an unchanged page.
