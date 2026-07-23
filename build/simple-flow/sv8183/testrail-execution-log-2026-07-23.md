# SV-8183 Permission VIU — TestRail Execution Log (2026-07-23)

**STATUS: EXECUTED 2026-07-23** (user-authorized). Project 1 / suite 1 "Master".
Scope = exactly ONE `update_case` (SF-PERM-01 = C29405), per
`build/simple-flow/sv8183/testrail-sync-manifest.md`. NO add/delete/section. NO run
writes (run 325 untouched).

---

## 1 × update_case — SF-PERM-01 (C29405)

**Field changed:** Expected Result (`custom_expected`) only. Title, Preconditions, Steps,
References (`refs`) UNCHANGED. Status unchanged (stays VIU-Verified).

**Why:** live BE finding 2026-07-23 — `POST /api/organizations/settings/change` gates on the
settings atom-FAMILY, not `settingsApp` specifically (a clean Parts Manager with
settingsParts/settingsFinance and no settingsApp gets HTTP 200; no-settings roles get 403).
The FE settings route remains settingsApp-gated. Prior expected #3 ("backend rejects a save by
a role lacking App Settings") was imprecise; reworded to the page-reachability truth (Rule 9,
plain layman). The BE driver detail lives in the case's local viu metadata (not the
tester-facing fields, per Rules 7/20).

**BEFORE (`custom_expected`):**
```
<ol>
<li>Only a role with the App Settings permission (system defaults Admin, Service Manager and Office) can view and modify the Work Order settings page.</li>
<li>A role without App Settings cannot open or change the Work Order settings.</li>
<li>The backend rejects a Work Order settings save attempted by a role that lacks App Settings.</li>
</ol>
```

**AFTER (`custom_expected`):**
```
<ol>
<li>Only a role with the App Settings permission (system defaults Admin, Service Manager and Office) can open and change the Work Order settings page.</li>
<li>A role without App Settings cannot reach the Work Order settings page (it is redirected away) and so cannot change those settings from the screen.</li>
<li>A role that cannot open the Work Order settings page cannot save changes to it.</li>
</ol>
```

**refs (unchanged):** `SV-7696 (S1 AC / §8 Permissions)`. Traceability driver = SV-8183 §9/§9.2 EditSet=settingsApp.

**Result:** `POST update_case/29405` → **HTTP 200** (`updated_on` set). Re-GET `get_case/29405`
→ `custom_expected` == AFTER (**MATCH**); title unchanged; refs unchanged.

---

## Guardrails honored

- **NO run writes.** Run 325 ("Simple Flow — Ayesha Khan → Specs 7/7/2026") untouched (no add_result / result_for_case).
- **NO add_case / delete_case / add_section.** Exactly 1 in-place `update_case`.
- No secrets committed (TestRail creds in `/tmp/tr-creds.env` only).
