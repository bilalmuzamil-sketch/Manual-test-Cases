# Schedule VIU — the 2026-08-06 resume attempt STOPPED AT STEP 0

**Nothing was observed this session. The Schedule QA-branch sign-in is dead, and the
instruction for that case is to stop and ask rather than work around it.**

---

## 1. What is blocked, exactly

| Check | Result |
|---|---|
| `GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions` with `/tmp/schedule-viu/ck.txt` | **HTTP 401** `{"error":"sso_required"}`, three attempts |
| Same call, one hour of container time apart | 401 every time — not a transient |
| `POST /api/quick-login` | **NOT CALLED.** Barred by the instruction for this session |

The stored cookie file holds all three names — `sv_sso_session`, `PHPSESSID`,
`cf_clearance` — and was last written **2026-08-05 13:23**, so it is roughly **14 hours
old**. On this estate cookies die at about 24 hours **or on a deploy**, and the branch
redeployed at **22:49 GMT on 5 August**, which is the more likely killer.

### A false positive worth recording so nobody repeats it

`GET https://sv8685.qa.shopview.com/api/auth/me/fe-permissions` — the **app** host rather
than the **api** host — returns **HTTP 200**. That is not a live session. The SPA host
serves `index.html` for any unmatched path, so the 200 is an HTML page, not an auth
response. **Always probe the `…api.` host.**

### The Filters cookie set does not substitute

`/tmp/filters-viu/cookies.json` is **alive** — HTTP 200 against
`sv8785api.qa.shopview.com`. Against the Schedule API the same set returns **HTTP 409
`{"errors":[{"error":"Session has expired."}]}`**, and `GET /api/schedule/board` returns
409 as well. Each QA branch keeps its own session store, so a live cookie on one branch is
not a live session on another. Recorded because it is the obvious thing to try.

**What is needed:** fresh `sv_sso_session`, `PHPSESSID` and `cf_clearance` for
`.qa.shopview.com`, valid for `sv8685api.qa.shopview.com`. That is the only blocker.

---

## 2. The build has NOT moved

Read at **2026-08-06 03:27 UTC**, unauthenticated (`index.html` needs no session):

* `<meta name="app-version" content="v3.5-7ec992f" />`
* `last-modified: Wed, 05 Aug 2026 22:49:36 GMT`
* `etag: "e2a80a6ab5e0b47c29fd88af9db1e980"`

**Identical on all three markers to the value the previous batch closed on.** So the 29
verdicts taken on `v3.5-7ec992f` are still current, and the 97 taken on `v3.5-d122eef`
are still stale. Evidence: `evidence/build-marker-2026-08-06-0327Z-{index.html,headers.txt}`.

---

## 3. Nothing has been written, and it is proven rather than asserted

**TestRail — all 168 cases re-read live and compared field by field against
`snapshots/PRE-cases-168.json`:**

* **168 of 168 read, 0 errors.**
* **0 cases differ** on `title`, `custom_preconds`, `custom_steps`, `custom_expected`,
  `refs`, `section_id`, `type_id`, `priority_id`, `template_id`, `custom_atmstatus`,
  `custom_automation_type`.
* **0 cases moved on `updated_on`.**

Compared on **content first**, not on the timestamp — a sibling project found cases whose
content changed while `updated_on` stayed frozen, so the timestamp alone proves nothing.
Here both agree. Proof: `snapshots/NOWRITE-proof-2026-08-06.json`.

**Run 357 (Ayesha Khan) re-read live:**

* **168 tests**, `include_all` still **false**, untested 168.
* **429 result records**, every prior result **present by id**.
* **0 results with any graded or real field changed** (`status_id`, `comment`, `elapsed`,
  `defects`, `version`, `created_by`, `created_on`, `test_id`, `assignedto_id`).
* **0 new results** during the window.
* `case_id` sets **equal in both directions** — 0 pre-only, 0 live-only.

Proof: `snapshots/run357-untouched-2026-08-06.json`.

---

## 4. What DID get done — the two unfiled defects are now filed

Both were observed on **`v3.5-7ec992f`**, the build still live, so their evidence is
current and filing did not depend on the 42 outstanding cases. Both duplicate searches
were run first and both came back clean.

### [SV-8923](https://shopview.atlassian.net/browse/SV-8923) — the Business Hours switch shades nothing
Covers **SCH-VIEW-06 = [C30047](https://shopview.testrail.io/index.php?/cases/view/30047)**.
`Story Defect` · parent **SV-8700** · priority **Low** · `relates to` SV-8700 · no Product
Area sent. **11 field checks read back, all PASS.**

**Duplicate search, four queries:** summary matches on overlay/shade/shading/greyed;
free-text `"grey overlay"`; every child of SV-8685 and of all 15 stories containing
`"business hours"`; and Schedule tickets created since 5 Aug. Nearest three are **not**
this: **SV-8827** is about the switch's *default state*, **SV-8837** and **SV-8915** are
about where the view is *scrolled to* when it opens. Nothing asserts the overlay is absent.

### [SV-8924](https://shopview.atlassian.net/browse/SV-8924) — assigning an unassigned job moves its saved start six hours earlier
Covers **SCH-START-07 = [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)**.
`Story Defect` · parent **SV-8688** · priority **Low** · `relates to` SV-8688 **and**
SV-8848 · no Product Area sent. **11 field checks read back, all PASS.**

**The SV-8848 question was checked before filing, as instructed.** SV-8848 was read in
full: it describes times being **shown** six hours later than scheduled — block position,
hover summary, shift window, the now-marker. Ours is the stored instant being **written**
six hours earlier (`2026-08-08T13:00:00Z` → `2026-08-08T07:00:00Z`). Same six hours,
opposite direction, opposite side of the boundary. Almost certainly one missing time-zone
conversion on read and another on write — but fixing the display would leave records
already damaged by the assign path still wrong, so it is separately testable and was filed
separately with the relationship spelled out in the ticket body.

Payloads kept at `tickets/SV-8923-payload.json` and `tickets/SV-8924-payload.json`.

---

## 5. NEW — the sources moved while we were away (Rule 31)

**Three Bug tickets were raised by Sasha Grosman on 5 Aug at 18:25–18:26**, all parented
to epic SV-8685, all **Open**, all sourced to *"the Schedule design review with Fabian on
5 Aug 2026"* and all **scoped for V1**:

| Ticket | Summary | Touches |
|---|---|---|
| [SV-8915](https://shopview.atlassian.net/browse/SV-8915) | Schedule: view opens at midnight instead of the first business hour | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)**, which we currently carry against SV-8837 |
| [SV-8916](https://shopview.atlassian.net/browse/SV-8916) | Schedule: "Add Existing Work Order" button missing from build | no case identified yet — **possible coverage gap** |
| [SV-8917](https://shopview.atlassian.net/browse/SV-8917) | Schedule: conflict label reads "working hours" instead of "business hours" | the conflict-detection cases in batch 5 |

**SV-8915 carries a product decision our cases do not yet reflect.** It states the opening
hierarchy in full: open at the first hour of configured business hours; if none are set
default to **7:00am** (*"per Cody's recommendation"*); and if a shift exists earlier than
that, open at the shift's start instead. It also flags a related change — the grid should
render only business hours plus a buffer rather than the full 24 hours — as tracked
separately. That is a documented expectation (Rule 57 source) and it needs folding in.

**All three cite a design link:**
`https://claude.ai/design/p/d3cdcf5c-83df-45ea-ba75-7ddedb5124b5?file=Schedule.dc.html`.
A design review producing V1-scoped decisions means the **design source may have moved**
since our ingest. Not yet checked — it needs the QA lead's call on whether to re-ingest.

**Three more Schedule tickets from Ayesha Khan on 5 Aug evening**, none matching an
existing case of ours:

* [SV-8922](https://shopview.atlassian.net/browse/SV-8922) — grid shows technicians not in
  Staff for this location (parent SV-8686)
* [SV-8921](https://shopview.atlassian.net/browse/SV-8921) — Jose Young is schedulable but
  not in Staff (no parent)
* [SV-8919](https://shopview.atlassian.net/browse/SV-8919) — Edit Line enforces "Max 5"
  technicians but a line has 8 assigned from Schedule (parent SV-8688)

**These are candidate coverage gaps, deliberately not authored** — authoring needs
authorisation and live observation, and we have neither right now.

---

## 6. Reported, not acted on

* **[SV-8827](https://shopview.atlassian.net/browse/SV-8827) is half wrong.** It claims
  both Business Hours *and* Tech Hours default to ON. **Tech Hours defaults OFF**, which is
  what the spec wants. Only the Business Hours half reproduces. Still **Open**, updated
  5 Aug 03:40. Not edited — it is Ayesha's ticket (Rule 38).
* **[SV-8851](https://shopview.atlassian.net/browse/SV-8851) is still Open although the
  fix has shipped.** **SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050)**
  now passes on all three items — the Tech Hours toggle appends each technician's hours to
  their row header and shows "Not working" where none are configured. Confirmed still Open,
  resolution null, updated 5 Aug 09:33. **Recommend closing it.**

---

## 7. Two files I would have updated and did not

Out of scope for this worker; reported instead.

**`build/OUTSTANDING-ITEMS-REGISTER.md`** — the Schedule row needs:

> **Fresh QA-branch sign-in for `.qa.shopview.com` (`sv_sso_session`, `PHPSESSID`,
> `cf_clearance`), valid against `sv8685api.qa.shopview.com`.** Owed by: the QA lead.
> Blocks: the final **42 of 168** Schedule cases have no verdict at all, and the **25
> deviations** taken on the retired build `v3.5-d122eef` cannot be re-confirmed — so no
> readiness figure and no automation marker can be written. Since: 2026-08-06 03:27 UTC.

**`CLAUDE.md`** — the Schedule entry's status block should record: the build steady at
`v3.5-7ec992f`; 126 of 168 observed across two builds; **zero TestRail writes, proven by
content**; SV-8923 and SV-8924 filed; and the six new Jira tickets above, of which
**SV-8915 carries a V1 product decision our cases do not yet reflect**.
