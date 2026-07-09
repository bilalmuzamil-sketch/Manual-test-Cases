# Simple Flow — Latest Spec + Epic Diff & Assessment (vs V2.4)

> **Inputs ingested 2026-07-09:**
> 1. Spec doc `991acdb4-SimpleMode_...BulkReceiving.doc` → `spec-latest-source.md`.
> 2. Design bundle `a30380c8-Simple_Flow_Design_1.zip` → `design-latest-catalog.md`.
> 3. Epic "Simple Mode — Streamlined WO Completion & Bulk Receiving" → `epic-content.md`.
>
> **Scope: INGEST + DIFF + PROPOSE only.** This worker did NOT edit cases,
> `requirements.md`, `PROJECT-STATE.md`, `bugs-log.md`, or the tracker — another
> worker owns those right now. Everything below is a **proposal** for that worker.

---

## 1. Is the new spec doc newer than V2.4? — NO.

**Verdict: the uploaded spec doc is the SAME V2.4** already recorded in
`build/simple-flow/spec-current-source.md`.

Evidence:
- **Status line identical** — "Draft for build — V2.4 (line approval = all must be
  approved; sell-price mandatory at save + orderable-from-line; editable cost on
  Accept-Delivery; core resolution in Stories 3/4/8/10/16; in sync with Jira
  SV-7696…SV-7710 + SV-7870 + SV-7876)".
- **§9 Change Log identical** — last row **2026-07-08 @Milos Vasic** (sell price
  mandatory at save; sell-price-only orderable from line; order-before-receive;
  editable cost on Accept-Delivery; Part Sales investigation added). No new row.
- A **normalized text diff** (both files parsed the same way, whitespace + empty
  bullets stripped) shows changes are almost entirely **HTML-parse artifacts**
  (bold-marker placement, spacing). The only **substantive** deltas are minor
  clarifying phrases in Story 3 (below) — no new/removed stories, ACs, settings,
  or decisions.

### Minor clarifying phrases newly present (Story 3, non-material)
| Ref | Prior V2.4 | This upload adds |
|---|---|---|
| S3 intro | (absent) | "We are going to cover all scenarios here, with the Tech story ON/Off, Mileage ON/Off, Engine hours ON/Off, Automatically pick inventory parts ON/Off." |
| S3-R1 | "flagged **Vendor Missing** — Story 6" | "…— Story 6, **flagged them from QB integration**" |
| S3-R3 | "mileage + VIN + engine hours" | "mileage + VIN **(in case Review toggle is off; if ON, VIN is asked when the Reviewer clicks review)** + engine hours"; "Tech story is NOT here **(keeping mostly current behaviour)**" |
| S3-R5 | "(not an inline popup)" | "(not an inline popup **as now**)" |
| S3-R6 | "…still shows a Receive button." | "…still shows a Receive button **so the user can access this later**" |
| S3-R9 | "must be re-approved." | "must be re-approved **manually**." |

None of these change an expected result; they reinforce existing behavior. **No
case rewrite is driven by the spec doc alone.**

**The genuinely new input in this batch is the EPIC "What's Been Built" content**
(§3 below), which reports which stories are now DEPLOYED.

---

## 2. Story inventory (unchanged) — 17 stories

Story 1 Settings (SV-7696) · Story 2 No-PO completion (SV-7697) · Story 3 PO+Optional
(SV-7698) · Story 4 PO+Required (SV-7699) · Story 5 Vendorless/no-PN part add (SV-7700)
· Story 6 Vendor-Missing on WO PO + QB flag (SV-7701) · Story 7 PO multi-select +
Receive Selected (SV-7702) · Story 8 PO Bulk Receive page (SV-7703) · Story 9
Apply-invoice-to-selected (SV-7704) · Story 10 Inline part-number fix (SV-7705) ·
Story 11 Receive button on WO-originated POs (SV-7706) · Story 12 Accept Delivery
multi-vendor (SV-7707) · Story 13 Assign vendor + merge (SV-7708) · Story 14
"Waiting on Parts" column (SV-7709) · Story 15 UX refinements (SV-7710) · Story 16
Review ON gate (SV-7870) · Story 17 Tech-story flow (SV-7876). Matches
`requirements.md` §7. No stories added/removed.

---

## 3. ⚠️ CRITICAL — Epic says Stories 7 / 8 / 9 / 14 (+ 6 / 13) are BUILT; our VIU said NOT-BUILT

Our durable memory + last VIU (`viu-findings.md`, `SimpleFlow_Blockers_Tracker`,
CLAUDE.md) mark these as **NOT built** on sv7301:
- **Story 7** — PO multi-select + Receive Selected
- **Story 8** — PO Bulk Receive page
- **Story 9** — Apply-invoice-to-selected POs
- **Story 14** — "Waiting on Parts" column

But the Epic's **"What's Been Built"** explicitly lists them as **delivered**:
- **"(4) Bulk Vendor Parts Receiving"** = PO-page checkbox + **"Receive Selected"**
  (**= Story 7**); dedicated **bulk-receive page grouped by vendor → WO** (**=
  Story 8**); per-WO invoice + **"Apply to All"** (**= Story 9**); editable
  Qty/Cost/Sell; per-WO or global receive (**= Story 8**).
- **"(5) WO List 'Waiting on Receive' column"** = count of unreceived parts,
  clickable → Accept Delivery, replaces the old badge (**= Story 14**).
- **"(3) Dummy Purchase Orders for vendorless parts"** = separate no-vendor PO,
  "Vendor Missing" indicator, Receive hidden, vendor dropdown on PO detail →
  becomes receivable (**= Stories 6 + 13**).
- **"(1) Express Mode Settings"** (Auto-approve, Create-POs toggle, Vendor-invoice
  Optional/Required) (**= Story 1**) and **"(2) Express WO Completion Dialog"**
  (**= Stories 2/3/4**) — already largely VIU'd.

### Interpretation
These stories were **almost certainly DEPLOYED to sv7301 since our last VIU
(2026-07-08)**. **The ~24 "dev-not-built" VIU-Pending cases are now very likely
VIU-ABLE and need a fresh re-VIU on sv7301 to confirm.** (Caveat: the QA env is
shared and the Epic's "built" claim is not yet confirmed live — re-VIU before
flipping any status.)

### Cases that move dev-not-built → testable (re-VIU on sv7301)

**Primary (directly gated on Stories 7/8/9/14) — 22 cases, all currently VIU-Pending:**

| Story | Cases | Count |
|---|---|---|
| **7** — PO multi-select | SF-POSEL-01, -02, -03, -04, -05, -06 | 6 |
| **8** — Bulk Receive page | SF-BULK-01, -02, -03, -04, -05, -06, -07, -08, -09, -10 | 10 |
| **9** — Apply invoice | SF-INV-01, -02, -03 | 3 |
| **14** — Waiting on Parts | SF-WOP-01, -02, -03 | 3 |

**Secondary (dependent on the above / vendor-assign now existing) — also re-VIU-able:**

| Area | Cases | Why now testable |
|---|---|---|
| Story 13 assign-vendor + merge | SF-VEND-01..05 | Epic (3): "vendor dropdown on PO detail → becomes receivable" ⇒ Story 13 built. |
| Story 6/13 Vendor-Missing resolve/receive | SF-VMIS-03, -04, -05, -06, -07 | Vendor-Missing PO + assign-vendor + unflag now reachable. |
| Receive on bulk/accept surfaces | SF-RCV-05, -06, -07, -08, -10 | Depend on the bulk-receive / assign-vendor surfaces existing. |
| Bulk-receive permissions | SF-PERM-03 | "Verify which roles can perform Bulk Receive" — needs the page live. |
| QB pipeline from receive | SF-QB-03 (both-surface pipeline), and revisit SF-QB-06/07/08 | Depend on receiving actually running (bulk + accept). |

Net: **~22 primary + ~13 secondary ≈ 35** VIU-Pending cases likely become
VIU-able. (Total VIU-Pending currently = 77; VIU-Verified = 80; Open-Question = 5.)

**PROPOSED next step:** a targeted **re-VIU pass on sv7301** covering
SF-POSEL / SF-BULK / SF-INV / SF-WOP first, then SF-VEND / SF-VMIS / SF-RCV /
SF-PERM-03 / SF-QB-03. Do NOT flip statuses until confirmed live (shared env).

---

## 4. New decisions / terminology from the Epic that affect EXPECTED results (PROPOSALS)

These come from the Epic's "What's Been Built" + "Key Decisions". Where they
conflict with the latest spec V2.4, apply **last-update-wins** — but note the Epic
describes **shipped behavior**, so for VIU the built app is the ground truth.
**All items below are proposals for the case-owning worker; no cases were edited.**

### 4a. ⚠️ "Dummy PO" (Epic) vs "No dummy PO" (spec V2.4) — direct CONFLICT
- **Spec V2.4** (Story 6 / §4 / §6 Terminology, unchanged in this upload):
  *"**No dummy PO.** A vendorless vendor part goes on the **WO's normal PO**,
  flagged **Vendor Missing**… (No separate 'dummy PO')."* Our Story-6 cases
  (SF-VMIS-*) are authored to **"placed on the WO's PO, not a separate dummy PO."**
- **Epic "What's Been Built (3)"**: *"**Dummy Purchase Orders** for vendorless
  parts [**separate no-vendor PO**, 'Vendor Missing' indicator, **Receive hidden**,
  vendor dropdown on PO detail → becomes receivable]."*
- **Implication:** if the app shipped a **separate dummy/no-vendor PO**, then
  SF-VMIS-01/02 (which assert "placed on the WO's PO, not a separate dummy PO")
  and SF-POSEL-05 (spec S7-R5: "vendor-missing POs are **selectable**" — Epic says
  **Receive hidden**) may **fail against the built app**.
- **Proposal:** flag as a **priority open question / re-VIU** for SF-VMIS-01, -02,
  SF-POSEL-05, SF-BULK-07, SF-VEND-*. Confirm on sv7301 whether the vendorless PO
  is a *separate* PO or the WO's own PO, and whether Receive is *hidden* vs
  *disabled-but-shown*. This is a spec-vs-build reconciliation, not a case bug —
  escalate the terminology mismatch to Milos/dev.

### 4b. "One invoice per vendor per WO" (Epic key decision)
- Spec §4: *"One vendor bill per vendor per receive; merge → one bill,
  keep-separate → two; invoice-# uniqueness relaxed."* Epic phrases it as **one
  invoice per vendor per WO**. Consistent in spirit.
- **Affects:** SF-INV-01/02/03 (apply-invoice scope per vendor), SF-BULK-05
  (invoice-gates-receive), SF-VEND-02 (merge = one bill / keep-separate = two),
  SF-RCV (per-vendor bill). **Proposal:** verify the "per vendor per WO" scoping
  wording in these cases matches the shipped grouping (vendor → WO on the bulk page).

### 4c. "Cost AND sell captured during receiving" (Epic)
- Matches spec S8-R7 / S10-R3 / S12-R5 (cost editable + sell editable-until-locked).
  Epic confirms **both** are editable on the receive surfaces (parity across Bulk
  Receive + Accept Delivery).
- **Affects:** SF-BULK-06, SF-RCV-* (field editability/locking), SF-PNFIX-*.
  **Proposal:** no change — Epic confirms already-authored expectations; verify
  during re-VIU.

### 4d. "Waiting on Receive" column REPLACES the old badge (Epic naming + behavior)
- Our cases + spec call it **"Waiting on Parts"** (Story 14 / SF-WOP-*). The Epic
  calls the shipped column **"Waiting on Receive"** and says it **replaces the old
  badge**.
- **Proposal:** flag a **label reconciliation** for SF-WOP-01/02/03 — confirm the
  live column header ("Waiting on Receive" vs "Waiting on Parts") and add a check
  that it **replaces** the prior receiving badge. Update wording to the live label
  once confirmed (last-update-wins → the shipped label).

### 4e. QB sync skipped for vendorless POs — "flagged, not coded" (Epic "What's Remaining")
- Spec S6-R3: vendor-missing PO **flagged + excluded from QB** until vendor +
  part number provided. Epic adds it is **flagged but the QB-skip is not yet
  coded** ("What's Remaining: QB sync flag for vendorless POs").
- **Affects:** SF-VMIS-03 (QB exclude), SF-QB-* (vendorless QB behavior).
  **Proposal:** treat the vendorless-PO QB-skip as **partially-built / expect the
  flag but not full QB enforcement**; keep as VIU-Pending / open question, not a
  hard expected-fail, until dev confirms coding status.

### 4f. Vendorless PO excluded from bulk receive until vendor assigned (Epic decision)
- Epic: *"vendorless POs excluded from bulk receive until vendor assigned"* and
  *"Receive hidden."* Spec S7-R5 says vendor-missing POs **are selectable** on the
  PO list; S8-R8 says assign vendor on the bulk page moves it into the vendor group.
- **Tension:** selectable-on-list (spec) vs excluded-from-bulk/receive-hidden
  (Epic). **Affects:** SF-POSEL-05, SF-BULK-04/07. **Proposal:** re-VIU to confirm
  whether the vendorless PO is selectable-but-not-receivable-until-assigned (likely
  reconciliation) or fully excluded.

### 4g. "Express Mode not limited to small shops" (Epic decision)
- Matches spec §4 ("Simple Mode is not a separate mode… configurable per org").
  No case impact; confirms scope. Also confirms the **Create-POs toggle exists**
  in Express Mode Settings (Epic "(1)") — which bears on **VIU deviation #1**
  ("live has no Create-POs toggle"): the deviation **may now be resolved** →
  **re-VIU SF-SET-* / SF-SET-08, -13** (currently VIU-Pending) + revisit the
  recorded VIU deviations #1–#4.

---

## 5. Last-update-wins reconciliation (proposals only)

| Topic | Latest spec V2.4 (this upload) | Design bundle 3 | Epic (built) | Authoritative for VIU | Proposal |
|---|---|---|---|---|---|
| Vendorless PO shape | On WO's normal PO, **no dummy PO** | Vendor-Missing on PO list/detail | **Separate dummy/no-vendor PO** | **Built app** (re-VIU) | Reconcile SF-VMIS-01/02; escalate mismatch to Milos/dev (4a). |
| Sell price at completion | **Mandatory at save** (S5-R1) | Screenshot: warns "$0.00, no action needed to continue" | (not stated) | Re-VIU | Open question for SF-VAL-*/SF-VPART- (see design-latest-catalog §conflict). |
| Column name | "Waiting on Parts" | "Waiting On Parts" (Work Orders List.html) | **"Waiting on Receive"** (replaces badge) | **Built app** | Confirm live label; update SF-WOP-* wording (4d). |
| Create-POs toggle | Setting exists (S1-R2) | Toggle in settings design | **Built** in Express Settings | Built app | Re-VIU SF-SET-*; may retire VIU-deviation #1 (4g). |
| Review-note field | R10 test id `input_review_note` | Confirmed in 07-08 screenshots | (not stated) | Re-VIU | VIU-deviation #3 (missing note) stays a build gap; re-check. |
| Stories 7/8/9/14 build status | (spec is intent, not status) | Design surfaces exist | **BUILT** | **Built app** | Re-VIU the ~22+13 cases (§3). |

> Because the case-owning worker is mid-edit, **none of the above are applied.**
> They are the ready-to-action proposal set once that worker's pass lands.

---

## 6. Summary of proposed actions (for the case-owning worker + coordinator)

1. **Do NOT treat the spec doc as a new version** — it is V2.4 unchanged (only
   parse artifacts + minor Story-3 clarifications). `requirements.md` needs no
   revision from the spec doc.
2. **Schedule a targeted re-VIU on sv7301** for Stories 7/8/9/14 (SF-POSEL-*,
   SF-BULK-*, SF-INV-*, SF-WOP-*) + dependents (SF-VEND-*, SF-VMIS-03..07,
   SF-RCV-05..08/10, SF-PERM-03, SF-QB-03) — the Epic reports them BUILT.
3. **Escalate / open-question the "dummy PO vs no dummy PO" conflict** (4a) —
   spec says WO's PO; Epic says separate dummy PO. Confirm live; may require
   rewording SF-VMIS-01/02, SF-POSEL-05.
4. **Reconcile the "Waiting on Receive" vs "Waiting on Parts" label** (4d) and the
   "replaces old badge" behavior on SF-WOP-*.
5. **Re-check VIU deviations #1 (Create-POs toggle) and #3 (review note)** now that
   the Epic reports Express Settings + review dialog built (4g, §4).
6. **Open question on sell-price-at-completion** (design screenshot vs S5-R1) for
   SF-VAL-*/SF-VPART- (see `design-latest-catalog.md`).

---

*Written 2026-07-09. Companion files: `spec-latest-source.md`, `epic-content.md`,
`design-latest-catalog.md`. Baselines: `spec-current-source.md`,
`spec-change-diff.md`, `design-notes.md`, `design-change-diff.md`, `viu-findings.md`.*
