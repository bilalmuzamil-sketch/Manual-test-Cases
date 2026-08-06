# SOURCE-CURRENCY — Report Suite VIU, 2026-08-06 (second session)

Standing Rule 31: establish the currency of **every** source before doing anything.
Standing Rule 59: re-read them again **immediately before the writes begin**, and again at the end.

All three reads were done. The table gives the identifier, the version, the date checked and the
verdict, per source.

## 1 · The six specifications — read LIVE from Confluence, three times

| Source | Confluence page id | Live version | Last edited | Read at pass start | Read at pass end | Verdict |
|---|---|---|---|---|---|---|
| Sales By Customer | 577634305 | **15** | 2026-08-05T17:53:06Z | 08:24Z | 09:25Z | **CURRENT** |
| Sales By Representative | 585629698 | **17** | 2026-08-05T17:53:08Z | 08:24Z | 09:25Z | **CURRENT** |
| Parts Velocity | 620888066 | **5** | 2026-08-05T13:21:40Z | 08:24Z | 09:25Z | **CURRENT** |
| Technician Utilization | 641400833 | **6** | 2026-08-05T13:33:10Z | 08:24Z | 09:25Z | **CURRENT** |
| Work In Progress | 703660034 | **9** | 2026-08-05T17:54:07Z | 08:24Z | 09:25Z | **CURRENT** |
| Inventory Value | 720142338 | **4** | 2026-08-05T13:33:13Z | 08:24Z | 09:25Z | **CURRENT** |

**None of the six moved during this pass.** Chris Ward published nine versions across the six pages
on 5 August; nothing has moved since 17:54Z that day. The version numbers above are the **Confluence
page versions**, not the version written inside each page body — that in-body field is the known
Rule-31(a) trap.

**Every requirement anchor cited by every case in scope was checked to exist in the live body.** For
Sales By Customer, 151 distinct anchors are referenced across its 58 outstanding cases and **all 151
are present in v15** — 0 stale anchors.

## 2 · The three spec updates Chris Ward posted in the Reports channel

The QA lead asked for the channel post to be looked at. It is folded in here as a pre-flight input,
not a separate task, because a VIU pass cannot produce authentic expectations from stale specs.

**All three had already been diffed, per requirement, by the 2026-08-05 pass** —
`build/report-suite/chris-newreqs-2026-08-05/SPEC-DIFF.md`, six verdict rows, totals reconciled. That
work was verified rather than repeated. The state today:

| His item | Where it landed | Status now |
|---|---|---|
| WIP filters apply to ALL open jobs | WIP **S7-R1, S7-R2** changed in v8; **S7-R4** in v9 | **NOW TESTED LIVE FOR THE FIRST TIME — the build does NOT meet it. Filed as SV-8968.** |
| WO # is a link only with Work Order permission | WIP **S4-R5** rewritten in v8, both halves explicit | **NOW TESTED LIVE FOR THE FIRST TIME — the "has permission" half is not built at all. Filed as SV-8967.** |
| Suite-wide link-permission rule (SBC + SBR) | SBC: new anchor **S9-R1a** in v15. SBR: **narrative only, no numbered requirement changed** | Unchanged. SBC S9-R1a still contradicts S9-N2 in the same page; SBR S12-R1/S12-R3 still read unconditionally. **Both still need Chris.** |

**So two of his three new requirements are, on their first live check, not met by the build.** That is
the single most useful thing this pass produced, and it exists only because the spec update was
treated as a pre-flight input.

## 3 · Epic SV-8582 — Rule-37 Tier 1 currency check

| | |
|---|---|
| Children | **105**, verified two ways (`parent=SV-8582` and `"Epic Link"=SV-8582`), key sets equal, no paging remainder |
| Verdict | **CURRENT** |

No full Tier-2 re-read was run; none was needed, because the child set and the story statuses are
unchanged from the 2026-08-06 first-session check. Tier 2 is user-gated (Rule 37) and was not asked
for.

**Story keys used for filing, read live:** SBC Stories 1–21 = SV-8600…SV-8618; WIP Stories 1–11 =
SV-8657…SV-8667.

## 4 · Tickets we have filed against this epic — state read live today

| Ticket | Shape today | Note |
|---|---|---|
| SV-8879, SV-8880, SV-8881 | `Bug`, parent SV-8582, Product Area Reports & Dashboards, Low, Open | the pre-2026-08-05 convention, correct for their date, **not converted by anyone** |
| SV-8818, SV-8819, SV-8820, SV-8823 | `Bug`, parent SV-8582 | unchanged |
| SV-8907, SV-8908 | Open | still the WIP download failure and the Asset-filter defect |
| SV-8925…SV-8940, SV-8943…SV-8956 | filed by the first session today | not re-read case by case |
| **SV-8962…SV-8966, SV-8967…SV-8970** | **filed by THIS session** | `Story Defect`, parent = the owning **story**, priority **Low**, `relates to` link, no Product Area — the amended Rule-52 shape. 11 field checks read back on each, **all PASS** |

## 5 · ⚠️ THE BUILD — and it MOVED UNDER THIS PASS

| Read at | app-version | index.html last-modified | etag | sha256 |
|---|---|---|---|---|
| **08:24:28Z (start)** | `v3.5-16cf83f` | Wed, 05 Aug 2026 06:40:32 GMT | `177c59546701e7810b894492dabc1423` | `67932a75…` |
| **09:25:03Z (end)** | **`v3.5-7168d14`** | **Thu, 06 Aug 2026 08:32:37 GMT** | `207df1aa07090fcf99e98e67f1d1d6d5` | `b14695c8…` |

**The branch redeployed at 08:32:37Z — eight minutes after the start read.** Almost every live
observation in this pass ran from about 08:33Z to 09:20Z, so the observations belong to
**`v3.5-7168d14`**, not to the marker read at the start.

**This was caught by the Rule-59 end-of-pass re-read and corrected rather than left to stand:** every
build line this pass wrote was re-stamped to `v3.5-7168d14`. The honest residue is that the very
first capture of the Sales By Customer page structure (about 08:26–08:29Z) preceded the deploy, so a
small number of the earliest structural observations may have been taken on the predecessor build.
Nothing turns on it — nothing in that first capture became a verdict on its own.

**Verdict: PARTIAL as a source.** The branch is **not declared final** (Rule 49/60), so every verdict
in this pass is **PROVISIONAL**, and the Rule-49 queue in this folder is **OPEN**.

## 6 · Engineering tech plan (Rule 30)

`build/report-suite/tech-plan-2026-07-29/` — held, unchanged, **CURRENT** for this pass. Nothing in
this pass rested on it.

## 7 · Designs

**Still not available for the Report Suite.** No Figma file exists for these six reports, so there is
**no Rule-35 fetch queue** and none is owed. Visual conformance is judged against the specifications'
own Story 20 / Story 10 requirements, which name exact hex values — which is how SV-8965 and SV-8970
were established.

## 8 · Chris Ward's answer sheets

`build/report-suite/chris-answers-2026-08-05/` and the questions spreadsheet cited in the provenance
lines — held, **CURRENT**. Three new questions for him are raised in `QUESTIONS-FOR-CHRIS.md` in this
folder; none of them changed a case's expectation, because an unanswered question may never do that
(Rule 58).

---

## SESSION 4 — 2026-08-06, re-read live at 10:57:47Z

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| SBC specification | Confluence 577634305 | **15** — 2026-08-05T17:53:06Z | 2026-08-06 10:57Z | **CURRENT** |
| SBR specification | Confluence 585629698 | **17** — 2026-08-05T17:53:08Z | 2026-08-06 10:57Z | **CURRENT** |
| Parts Velocity specification | Confluence 620888066 | **5** — 2026-08-05T13:21:40Z | 2026-08-06 10:57Z | **CURRENT** |
| Technician Utilization specification | Confluence 641400833 | **6** — 2026-08-05T13:33:10Z | 2026-08-06 10:57Z | **CURRENT** |
| WIP specification | Confluence 703660034 | **9** — 2026-08-05T17:54:07Z | 2026-08-06 10:57Z | **CURRENT** |
| Inventory Value specification | Confluence 720142338 | **4** — 2026-08-05T13:33:13Z | 2026-08-06 10:57Z | **CURRENT** |
| Epic + child stories | SV-8582 | **104 children** (fully paged `parent=SV-8582`) | 2026-08-06 11:41Z | **CURRENT** — and this **corrects our own record of 105**. An unpaged call returns 100 and under-reports |
| Designs | — | none exist for this project | — | **N/A**, spec-only authoring |
| Engineering tech plan | `build/report-suite/tech-plan-2026-07-29/` | 2026-07-29 | — | **CURRENT** |
| Chris Ward's answers | the 2026-08-05 sheet | 2026-08-05 | — | **CURRENT**, with **7 questions unanswered** |
| **The build** | `sv8582` QA branch | **`v3.5-f77875c`**, last-modified 2026-08-06 10:43:37 GMT | 10:55:54Z **and** 11:53:07Z, sha256 identical | **PARTIAL — and this is the material shortfall.** Only **35 of 476** cases carry a verdict established on this marker. 133 sit on `v3.5-7168d14`, 219 on `v3.5-16cf83f`, 85 on `v3.4.1-3d03023`, 4 on none. **The branch is NOT declared final** |
| **The signed-in session** | shared `sv_sso_session` across all three QA branches | **DIED at ~11:37Z** | 11:39Z | **STALE — BLOCKING.** See below |

### Rule 59 — sources re-read immediately before the writes began

The six specification versions were re-read at **10:57:47Z** and the first write went out at **~11:45Z**;
**no source moved between those two points**, and the build marker was confirmed byte-identical again at
**11:53:07Z** after the writes. **Verdict of the second read: UNCHANGED.**

### The session loss, diagnosed rather than assumed

At ~11:37Z every request began returning **HTTP 401 `sso_required`**. Diagnosed against the playbook's
five false-dead-session traps before concluding anything:

- **Not trap 2** — probed `sv8582api.qa.shopview.com`, never the SPA host.
- **Not trap 3** — the cookie file is one line, mode 600, unmodified since 10:25, and all three cookies
  are present at their expected lengths.
- **Not Cloudflare (trap 1's usual cause)** — the request **reaches the application** and gets an
  application-level JSON `sso_required`, not a Cloudflare challenge, so `cf_clearance` is still good.
- **It is the shared SSO session.** All three cookie sets carry the **same `sv_sso_session` and the same
  `cf_clearance`** (sha-compared), and **all three branches now 401** — `sv8582api`, `sv8785api` and
  `sv8685api` alike. So there is no newer shared token to borrow from a sibling set.
- **The documented recovery does not work here.** `POST /api/quick-login {"key":"admin"}` — the key that
  works on this estate — **returns HTTP 401 itself**, because quick-login is SSO-gated too.

**This is not something this pass did:** `switch-user` was never called and `quick-login {"key":"tech"}`
was never called. **Only the QA lead can clear it, with a fresh `sv_sso_session` for `.qa.shopview.com`.**
