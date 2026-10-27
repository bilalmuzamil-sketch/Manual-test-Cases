# TestRail ⇄ TMS sync — standing instruction

**Ordered by the QA lead, 2026-10-27, verbatim:**

> *"We have to sync the testcases from Testrail to TMS, anycase that is extra in TMS for any testing
> suite but missing intestrail always ask me as what to do with them, If I ask you to keep that test
> case in TMS then we can keep it if I ask to edit it then ask me what to edit I tell you what to edit
> and you edit in TMS and if I ask you to delete in TMS, you will give me the number and link of those
> case which are missing in testrail but available in TMS and if I say that delete them you will
> delete them, we will have to run these syncs for test cases/milestones and test runs and manymore
> from TMS to testrail and from TESTrail to TMS"*

## The rules this sets

**What a sync may do on its own:**
- **TestRail → TMS, case present on both sides, TestRail newer:** update the TMS case to match TestRail
  (title, text, fields, folder). Every write is logged and read back.

**What a sync must always bring to the QA lead first:**
- **A case in TMS that is missing from TestRail (an "extra"), in any suite:** **never touched without
  his decision, case by case.** List each with its **number and TMS link**. Then:
  - **"Keep"** → leave it in TMS.
  - **"Edit"** → ask him **what** to edit; make exactly that edit in TMS.
  - **"Delete"** → give him the **numbers and links** of the cases to be deleted; delete only after he
    says to delete them.
- **A case edited in TMS after its last TestRail edit (a conflict):** do not overwrite. Show both versions and ask.
- **A case or folder in TestRail that is missing from TMS:** report it and ask how to create it. A
  case created through the API gets a new TMS number, not its TestRail number.
- **A case either side flags Automated (`automation_status` / `custom_atmstatus` = 3):** hold it, and
  tell Vlad if it changes (Rules 65/71).

**Scope still to come (same rules, both directions):** milestones, test runs and results, and
**TMS → TestRail** syncs. None is built yet; each gets its own dry run before its first write.

**Tool:** `build/testing-tools/tms_sync.py` (cases, TestRail → TMS). Dry run is the default;
`--apply` writes.
