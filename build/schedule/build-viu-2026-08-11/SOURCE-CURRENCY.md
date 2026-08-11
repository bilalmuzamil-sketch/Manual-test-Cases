# Schedule build VIU — SOURCE CURRENCY (Standing Rule 31), 2026-08-11

| | |
|---|---|
| **Sources read at pass START** | **2026-08-11 13:16Z** |
| **Sources RE-READ at report time** (Rule 59) | **2026-08-11 13:25Z** |
| **Overall verdict** | **The DOCUMENT sources are CURRENT. The BUILD source is UNREADABLE, and that is the whole story of this pass.** |

**Why this block is short, and why that is honest rather than thin:** this pass **took no observation
and made no write**, so no deliverable of ours rests on a document. The one source it needed was the
**build**, and that is the one it could not read.

---

## The sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Read at (UTC) | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **713031682** "Schedule" | **`lastModified` Aug 07, 2026, by Branko Cicovic** — confirmed **live by this pass**. The **version number 27** and `version.when` **2026-08-07T15:01:20.801Z** come from a **sibling pass's live read at 13:09:33Z today**, 16 minutes before ours, and our own read **corroborates it** (same last-modified, same author, nothing since). | **13:25Z** (ours) · 13:09:33Z (sibling) | **CURRENT — v27, unmoved since 7 August.** |
| **B** | **THE BUILD** | `https://sv8685.qa.shopview.com` — **`v3.5-65d6500`**, last-mod **Tue 11 Aug 2026 09:33:33 GMT**, etag `3250d285ffcf50626363a578fe273071`, `index.html` sha256 `9348ca09…` | **Marker read at 13:16:21Z and 13:20:42Z — byte-identical, 0 moves under the pass** | **🔴 PARTIAL — AND THE SHORTFALL IS TOTAL. The marker was read; the APPLICATION could not be.** Every API read returns **HTTP 409 `Session has expired.`** and `/schedule` redirects to `/login`. **0 of 174 cases observed on this build.** |
| **B2** | **The environment configuration** — the account's **default location** and **working hours** | `admin@shopview.com`, intended location `Staging Heavy Duty - 9919` (`b3c8c820-…`), intended hours 07:00–19:00 Mon–Fri, Sat not working, Sun unknown | **NOT READ — 409** | **🔴 NOT VERIFIED.** Both values are the **QA lead's report**, not our observation (Rule 12). **Sunday is unknown even to him.** Reading this live is the first action of the next pass, before any hours-dependent case. |
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

**Standing Rule 31 forbids claiming completeness while any source is STALE or PARTIAL**, and here the
**build is PARTIAL with a total shortfall**. Accordingly nothing in this pass's deliverables describes
the Schedule suite as verified, current, or VIU-complete against `v3.5-65d6500`. **All 174 verdicts
remain on earlier builds: 90 on `v3.5-7ec992f`, 78 on `v3.5-d122eef` (which no longer exists), 6 on
`v3.5-af3a6e1`.**
