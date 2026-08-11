# Schedule build VIU — SOURCE CURRENCY (Standing Rule 31), 2026-08-11

| | |
|---|---|
| **Sources read at pass START** | **2026-08-11 13:16Z** |
| **Sources RE-READ at report time** (Rule 59) | **2026-08-11 13:25Z** |
| **Sources re-read after the fresh sign-in** | **2026-08-11 13:32Z** |
| **Overall verdict** | **ALL sources CURRENT, and the BUILD is now READABLE — 15 surfaces harvested on `v3.5-65d6500`.** |

**⚠️ THE PARAGRAPH THAT STOOD HERE IS SUPERSEDED, KEPT DATED.** It read: *"this pass took no observation
and made no write… The one source it needed was the build, and that is the one it could not read."*
**True at 13:28Z, false by 13:36Z**, when the fresh sign-in landed and the Schedule page was reached.

## 🔑 THE SESSION FAILURE MODE, PROVEN END TO END FOR THE FIRST TIME

The QA lead's fresh sign-in returned **a new `PHPSESSID` and BYTE-IDENTICAL `sv_sso_session` and
`cf_clearance`**. That closes the loop on the diagnosis:

- **The shared token was alive the whole time** — which is why every probe returned **409**, never 401.
- **The dead thing was the session record behind our own per-branch `PHPSESSID`**, invalidated by his
  edits to the staff record of the account we were signed in as.
- **The 409-versus-401 control was decisive**: our set gave 409 on all three API hosts while the older
  Reports set gave 401 on all three, in the same minute. **That comparison is what produced the right
  ask** — a fresh sign-in rather than a `cf_clearance` or "new cookies".

**Worth recording because the playbook only documented this for a ROLE change.** Here it fired on a
**default-location** change and again on a **working-hours** change, i.e. it appears to be *any* edit to
the staff record. **Stated with its limit: two edits, one dead session, and we could not read the record
in between to attribute it to one of them** (`FINDINGS.md` F2).

---

## The sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Read at (UTC) | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **713031682** "Schedule" | **`lastModified` Aug 07, 2026, by Branko Cicovic** — confirmed **live by this pass**. The **version number 27** and `version.when` **2026-08-07T15:01:20.801Z** come from a **sibling pass's live read at 13:09:33Z today**, 16 minutes before ours, and our own read **corroborates it** (same last-modified, same author, nothing since). | **13:25Z** (ours) · 13:09:33Z (sibling) | **CURRENT — v27, unmoved since 7 August.** |
| **B** | **THE BUILD** | `https://sv8685.qa.shopview.com` — **`v3.5-65d6500`**, last-mod **Tue 11 Aug 2026 09:33:33 GMT**, etag `3250d285ffcf50626363a578fe273071`, `index.html` sha256 `9348ca09…` | **Marker read at 13:16:21Z, 13:20:42Z and 13:32:11Z — byte-identical every time, 0 moves under the pass** | **✅ READABLE, and PARTIAL only as to coverage.** 15 surfaces harvested, 909 distinct strings. **Labels checked for the 57 cases that assert one; 117 assert none.** The scope picker could not be opened (a drag our tooling cannot perform, SV-8957), so 24 quoted labels remain unreached. |
| **B2** | **The environment configuration** — the account's **default location** and **working hours** | `admin@shopview.com` (staff `ccbacb31-…`): `defaultWorkplace` = `b3c8c820-…` **`Staging Heavy Duty - 9919`** (and that workplace carries `is_default: 1`); working hours **07:00–19:00 Mon–Fri, Saturday NOT working, Sunday NOT working** | **13:33:23Z** (hours) · **13:33Z** (staff record) · location also confirmed **on screen** | **✅ CURRENT AND OBSERVED — the earlier NOT VERIFIED is discharged, and Sunday is answered.** Both were **read, never written**. Raw response: `evidence/working-hours-admin.json`. **Limit: these are ADMIN's hours; the technicians who own the flagged shifts have hours we did not read** (`FINDINGS.md` F7). |
| **C** | **The epic and its stories** | Jira epic **SV-8685**, **24 direct children**, verified two independent ways with equal key sets and no paging remainder | as at **13:12:29Z** (sibling pass, today) | **CURRENT — carried from a live read 13 minutes before this pass, and cited as carried rather than as ours.** No case verdict in this pass depends on it, because there is no verdict. |
| **D** | **The designs** | Claude prototype `Schedule.dc.html` (Branko's Q0) + the Fabian/Sasha design review of 5 August | prototype: **no version, no date** | not read | **PARTIAL — standing, unchanged, and recorded not resolved.** SV-8915/8916/8917 cite a live editable `claude.ai/design/p/…?via=share` link with **no version and no date**, which cannot be dated at all, so Rule 32's latest-wins cannot be applied to it (Rule 57 follow-up (i)). **Which design artefact is canonical is still an open question with the QA lead.** Measured: **0 of 174** provenance lines cite a design or Figma. |
| **E** | **The engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md`, 92,084 bytes, sha256 `def59e47…` | last changed in git **2026-07-30**; supplied, **not re-fetchable** | **PARTIAL as to currency** — no newer version has been supplied and there is no source we can poll, so "current" is not asserted. **11 cases cite it.** |
| **F** | **PO answers** | `build/schedule/branko-answers-2026-07-31/answers-ingested.md`, sha256 `fb6b46cc…` | ingested **2026-07-31** | **CURRENT as a record.** **9 cases cite it.** The standing item that the **6 August Branko question sheet has never been sent** is unchanged and stays outstanding. |

---

## The Rule-31 trap (a), confirmed live once more

The page's **in-body "Version" field still reads `1.0`** — it is visible in the live search summary
fetched by this pass. **The Confluence version number is 27.** Go by the Confluence number, never the
version printed inside the document. This is the trap that let the Schedule spec drift five versions
unnoticed once already.

## No completeness is claimed

**Standing Rule 31 forbids claiming completeness while any source is PARTIAL**, and the **build source
is still PARTIAL as to coverage** — 24 quoted labels sit on surfaces this pass could not reach, most of
them behind a drag our tooling cannot perform. Accordingly **nothing in this pass's deliverables
describes the Schedule suite as label-complete against `v3.5-65d6500`**, and the honest split is stated
per case in `BUILD-VERIFICATION.md` §4.

**And the pass/fail verdicts are a separate matter entirely: all 174 still rest on earlier builds — 90
on `v3.5-7ec992f`, 78 on `v3.5-d122eef` (which no longer exists), 6 on `v3.5-af3a6e1` — because
verdicting is no longer ours to do** (the QA lead's 2026-08-10 ruling, confirmed 2026-08-11). **This
pass checked LABELS; it did not re-verdict behaviour and does not claim to have.**
