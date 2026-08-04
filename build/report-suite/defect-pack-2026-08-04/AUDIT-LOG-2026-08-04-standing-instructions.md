# AUDIT LOG — applying the QA lead's three new standing instructions to the six tickets

**Date:** 2026-08-04 · **Account:** Bilal Muzamil (`712020:6d590212-5c9b-4135-ae11-277f3826110e`) via a
live Atlassian session (`GET /rest/api/3/myself` → **HTTP 200** before any write).
**Scope:** SV-8818 · SV-8819 · SV-8820 · SV-8821 · SV-8822 · SV-8823.
**No TestRail writes. No test-case edits.** Nothing was deleted.

The three instructions, verbatim, now installed as **Standing Rules 51 / 52 / 53** in `CLAUDE.md`:

1. *"do not create the tickets which are related to API , if there are any ASK me (ask again if I have
   previously given a go ahead for the API tickets with the Non API tickets) and create them ONLY if I
   ask you to create them"*
2. *"when you attach a ticket to a story that should ALWAYS be attached as a Story Defect and NOT as a
   bug"* — **clarified the same day, and the clarification is the operative wording:** *"So Yes, attach
   the tickets to the Epic as Parent but when you liunk th etickets to the stories they should be linked
   as their story defects. You did it correctly before."*
3. *"never mark the priority as High for the tickets you create always keep the priority as LOW"*

---

## PRE-WRITE SNAPSHOT (Rule 50 — the baseline every later compare is made against)

`GET /rest/api/3/issue/{key}?expand=names` for all six, **HTTP 200 ×6**, stored to
`/tmp/atlassian/pass3/pre/`. State on arrival:

| Key | Priority | Type | Parent | Status | Resolution | Attachments |
|---|---|---|---|---|---|---|
| SV-8818 | **Low** | Bug (10008) | SV-8582 | Open | — | 5 |
| SV-8819 | **Low** | Bug (10008) | SV-8582 | Open | — | 6 |
| SV-8820 | **Low** | Bug (10008) | SV-8582 | Open | — | 5 |
| SV-8821 | **Low** | Bug (10008) | *(none)* | Open | — | 4 |
| SV-8822 | **Low** | Bug (10008) | *(none)* | Open | — | 3 |
| SV-8823 | **Medium** | Bug (10008) | SV-8582 | **OBSOLETE** | Done | 4 |

---

## PER-OPERATION LOG

| # | Operation | Key | HTTP | Verification result |
|---|---|---|---|---|
| 1 | `GET /rest/api/3/myself` — session check | — | **200** | Authenticated as the expected account. |
| 2 | `GET issue?expand=names` ×6 — pre-write snapshot | all six | **200** ×6 | Baseline stored; table above. |
| 3 | `GET issue/{key}/changelog` ×5 | 8818/19/20/21/23 | **200** ×5 | Priority history recovered — see the correction section below. |
| 4 | `GET /rest/api/3/issue/createmeta/SV/issuetypes` | — | **200** | `Bug` 10008 **level 0** · `Epic` 10006 **level 1** · `Story Defect` 10007 **subtask, level −1** · `Story` 10245 level 0. |
| 5 | **`PUT issue` — `priority: Low`** | **SV-8823** | **204** | Re-read: `priority = Low`. **`status` still `OBSOLETE`, `resolution` still `Done`** — untouched. Description **byte-identical**. Attachments 4→4 identical (name+size). **All other fields byte-identical: NONE differed.** |
| 6 | Read-back verify ×6 | all six | **200** ×6 | **All six now `priority = Low`.** Descriptions byte-identical ×6; attachments unchanged ×6; no unintended field diffs. |
| 7 | **`PUT issue` — attempt `issuetype:10007` + `parent:SV-8591`** | SV-8818 | **400** | **REFUSED.** `{"pid":"Issues with this Issue Type must be created in the same project as the parent."}` — misleading, SV-8591 *is* in project SV (verified: project `SV`/10001, type `Story`). **Nothing changed.** |
| 8 | **`PUT issue` — attempt `issuetype:10007` alone** | SV-8818 | **400** | **REFUSED.** `{"issuetype":"Issue type is a sub-task but parent issue key or id not specified."}` — an unwinnable pair with op 7. **Nothing changed.** |
| 9 | Read-back verify ×6 after the two refusals | all six | **200** ×6 | **No conversion occurred.** Types all `Bug`; parents unchanged (SV-8582 ×3, none ×2, SV-8582 for 8823); statuses unchanged; descriptions byte-identical; attachments unchanged. |
| 10 | `GET /rest/api/3/issueLinkType` | — | **200** | Full list captured — see below. |
| 11 | `GET issue?fields=issuelinks` ×4 | 8818/19/20/23 | **200** ×4 | Story links present and intact: link `32044` 8818→**SV-8591**, `32045` 8819→**SV-8645**, `32046` 8820→**SV-8672**, `32050` 8823→**SV-8677**, all type **`Relates`** outward `relates to`. **Not modified** (see the link-type section). |
| 12 | `GET issue/SV-8822/transitions` | SV-8822 | **200** | Available: `Blocked` (7) · **`Close` (8) → OBSOLETE** · `Ready to Fix` (12). No resolution screen on any. |
| 13 | **`POST /rest/api/2/issue/SV-8822/comment`** — plain-language withdrawal note | SV-8822 | **201** | Comment read back verbatim; plain words, no jargon, no endpoint names. |
| 14 | **`POST issue/SV-8822/transitions` — `Close` (id 8)** | SV-8822 | **204** | Re-read: `status = OBSOLETE`, `resolution = Done`, `priority = Low`, comment present. |
| 15 | Final read-back verify ×6 | all six | **200** ×6 | See the final-state table. Only expected diff: `statusCategory` on SV-8822 (a consequence of its own transition). |
| 16 | `GET issue?expand=renderedFields` ×4 | 8818/19/20/23 | **200** ×4 | **Inline images still render**: each has **7 `<h2>` sections**, **1 `mediaSingle` node in the stored ADF**, and **1 real `<img src=".../attachment/content/…">`** in `renderedFields`. |

**Total writes this pass: 3** — one `priority` edit (SV-8823), one comment (SV-8822), one transition
(SV-8822). **Two attempted writes were refused by Jira and changed nothing** (ops 7 and 8).
**0 deletions. 0 issues created. 0 links changed. 0 TestRail operations.**

---

## FINAL STATE — verified by read-back

| Key | Priority | Type | Parent | Story link | Status | Resolution | Description | Attachments |
|---|---|---|---|---|---|---|---|---|
| SV-8818 | **Low** ✓ | Bug (unchanged) | SV-8582 (unchanged) | `Relates` → SV-8591 | Open | — | **byte-identical** | 5, identical |
| SV-8819 | **Low** ✓ | Bug (unchanged) | SV-8582 (unchanged) | `Relates` → SV-8645 | Open | — | **byte-identical** | 6, identical |
| SV-8820 | **Low** ✓ | Bug (unchanged) | SV-8582 (unchanged) | `Relates` → SV-8672 | Open | — | **byte-identical** | 5, identical |
| SV-8821 | **Low** ✓ | Bug (unchanged) | *(none)* | *(blocks SV-8582/8592)* | Open | — | **byte-identical** | 4, identical |
| SV-8822 | **Low** ✓ | Bug (unchanged) | *(none)* | *(relates SV-8582)* | **OBSOLETE** | **Done** | **byte-identical** | 3, identical |
| SV-8823 | **Low** ✓ | Bug (unchanged) | SV-8582 (unchanged) | `Relates` → SV-8677 | **OBSOLETE** (his call, untouched) | Done | **byte-identical** | 4, identical |

**The seven-section format, the inline images, and both prohibitions (no test-case references, no
provisional disclaimer) all survive on all six** — proven by the byte-identical descriptions, not
assumed.

---

## ⚠️ THE PRIORITY MISTAKE — recorded plainly so nobody repeats it (Standing Rule 53)

The changelog, read live this pass, is the whole story. All times −0500 on 2026-08-04:

| Key | The QA lead downgraded | **We wrongly "restored"** | He re-applied |
|---|---|---|---|
| SV-8818 | `High → Low` 00:35:27 | **`Low → High` 00:54:23** | `High → Low` **00:56:20** |
| SV-8819 | `High → Low` 00:35:32 | **`Low → High` 00:54:25** | `High → Low` **00:56:11** |
| SV-8820 | `High → Low` 00:35:37 | **`Low → High` 00:54:26** | `High → Low` **00:56:00** |
| SV-8821 | `High → Low` 00:36:58 | **`Low → High` 00:54:27** | `High → Low` **00:56:29** |

**What went wrong, in one sentence: a pass saw four priority values change with no action of its own,
called it "drift", and put them back — reversing the QA lead's deliberate triage.**

**Why it was invisible:** he works in the Jira UI **under this same account**
(`bilal.muzamil@shopview.com`), so **his edits are indistinguishable from ours in the changelog** — the
author column reads our own name. The earlier pass even reasoned toward an "automation rule running under
the triggering user", then corrected itself when SV-8823 was transitioned to OBSOLETE with a resolution,
which is a human workflow action. **That correction was right; the restore had already happened.**

**The tells that a change is HIS triage, not a fault:**

- it is **selective and semantically coherent** — only the four `High` ones moved, while the `Low` and
  `Medium` ones sat untouched; a stray overwrite does not discriminate;
- a **status transition that sets a resolution** (SV-8823 → OBSOLETE/Done) is a deliberate workflow act;
- the project's own **`Severity` field never moved** — only `Priority` did, which is precisely the field a
  triager adjusts.

**The rule now, unconditional (Rule 53):** **never set `High`; always file at `Low`; and NEVER "restore",
"correct" or "repair" a field the QA lead has changed — ask about it instead.** The restore was wrong
twice over: wrong because it undid his decision, and wrong because **`Low` was the correct value all
along** under the instruction he was about to state.

**This pass did not touch priority on the four** — they were already at `Low` on arrival and were left
there. The only priority write was **SV-8823 `Medium → Low`**, which the new rule requires.

---

## ISSUE-TYPE CONVERSION — attempted, refused by Jira, and then ruled unnecessary

The intermediate instruction was to convert the four story-linked tickets to `Story Defect` subtasks
parented to their stories. **Both routes were refused** (ops 7 and 8 above), and **nothing was changed**.

The QA lead then clarified that **the original shape was correct**: *"So Yes, attach the tickets to the
Epic as Parent but when you liunk th etickets to the stories they should be linked as their story
defects. You did it correctly before."*

**So the shape that stands — and it is correct, not a workaround:** **parent = the Epic SV-8582**, with
the owning **story LINKED**. The project fact behind it: `Bug` is **hierarchy level 0**, so an **Epic is
the only parent it can take**; a Story cannot parent a Bug at all, and the level-0 → subtask conversion is
refused by Jira. **Nothing was converted, no replacement issue was created, nothing was closed as a
duplicate.**

---

## ISSUE LINK TYPES — the full list, read live, and why nothing was changed

`GET /rest/api/3/issueLinkType` → **HTTP 200**. The complete set available in this Jira:

| id | Name | inward | outward |
|---|---|---|---|
| 10000 | **Blocks** | `is blocked by` | `blocks` |
| 10040 | **Cause** | `caused by` | `causes` |
| 10001 | **Cloners** | `is cloned by` | `clones` |
| 10002 | **Duplicate** | `is duplicated by` | `duplicates` |
| 10007 | **Fixes** | `Fixes` | `Fixed by` |
| 10006 | **Polaris work item link** | `is implemented by` | `implements` |
| 10003 | **Relates** | `relates to` | `relates to` |
| 10073 | **Split** | `Split from` | `Split to` |

**There is NO defect-of / is-defect-for / story-defect link type.** `Cause` (`caused by`) is the nearest
in spirit but expresses **causation**, not "this is a defect of that story", and `Fixes` is about fix
relationships. **Guessing between plausible options would be inventing a semantic**, so **nothing was
changed**: the four story links remain **`Relates`** as originally filed, and the question of which of the
eight he means goes back to the QA lead.

---

## OUTSTANDING FROM THIS PASS

1. **Which link type should express "story defect"?** No such type exists among the eight above. The four
   links are still `Relates`. **Needs his pick** — one of the eight, or a new link type created in Jira.
2. **SV-8823 is OBSOLETE by his own transition** and was left that way. Its **priority was changed to
   `Low`** per Rule 53; **its status and resolution were not touched.**
3. **SV-8822's finding is retained, not raised.** Documented in `TICKET-5-customers-change-500.md` and
   [`API-SPLIT.md`](API-SPLIT.md). **Do not re-file without asking** (Rule 51).
