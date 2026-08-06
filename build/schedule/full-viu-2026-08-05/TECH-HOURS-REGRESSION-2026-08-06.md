# The working-hours service is failing — three symptoms, one likely cause

**Status: OBSERVED, CAUSE NARROWED, NOT YET FILED.** A duplicate search and one network capture are
owed before a ticket is raised. **Our own edit has been RULED OUT as the cause** — see step 2 below.

## The three symptoms, all live on `v3.5-7ec992f`

**1. The grid shows no technician hours, though the toggle is on.**
"Tech Hours" in View Options goes `aria-checked=false` → `true`, and **0 of 23 rows** show any hours
text — sampled at **1.5 s, 5.5 s and 11.5 s** after the toggle, and again on a fresh page load.
`GET /api/schedule/board` carries **no hours data anywhere** (recursive key search for
`hour`/`workingHours` returned nothing).

**2. Saving a technician's hours does not persist.**
Ayesha Khan AK's Monday was set to **10:00 – 16:00** and saved with "Save & Close"; the dialog
accepted it. Re-opened later, Monday reads **07:00 – 21:00** — **the original value, unchanged**.

**3. One staff member's hours cannot be loaded at all.**
Turning "Set custom hours for this technician" ON for **Benjamin Peters** (Staging Lethbridge - 4310)
produces, on **every** attempt, the inline error `text_working_hours_error`:

> "Couldn't load this technician's hours, so they can't be edited right now. Close and reopen the
> dialog to try again."

…and the toggle snaps back to OFF, so no editor ever appears for him.

**A single explanation fits all three: the working-hours service is erroring.** It cannot be read
(symptom 1 and 3) and writes are not landing (symptom 2).

## This is not a build change

The build marker was read at session start and at session end: **`v3.5-7ec992f`**, last-modified
**Wed 05 Aug 2026 22:49:36 GMT**, etag `e2a80a6ab5e0b47c29fd88af9db1e980`, and the served
`index.html` is **byte-identical on sha256** (`66e91c52…dbbc53`) across both reads. **No redeploy
occurred.** Earlier the same day, on this same marker, the hours rendered correctly.

## Our own edit is RULED OUT

The first draft of this note listed "our own edit" as the leading candidate, because we had changed
Ayesha Khan AK's Monday hours between the working and failing observations.

**That is now disproven.** Re-opening her record shows Monday at **07:00 – 21:00** — exactly its
original value. **Our change never persisted**, so no stored value was altered by us and the failure
cannot be a consequence of it. (Our failed save is itself symptom 2.)

## The consequence for the suite

**SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) is UNSETTLED and
must not be written either way.** It was flipped from DEVIATION to **PASS — "Fixed"** earlier today,
and that flip was reported as evidence that **SV-8851's fix had shipped while its ticket sat Open**.
Both observations are real and both are on the same build. Until the service question is resolved we
cannot say whether the fix shipped, whether it regressed, or whether the earlier PASS was taken
during a healthy window of a flapping service.

**SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) is NOT settleable
after all.** The plan was to give one technician a genuinely distinct window; the save does not
persist, so the distinct window cannot be created through the UI. It stays blocked, and the reason
has changed — record the new reason, not the old one.

**C38847, C38849 and SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970)**
all depend on setting shop business hours on Edit Location. If the same service backs that screen,
they may be blocked by this too — **check before assuming they are merely unstarted.**

## What is owed before a ticket is raised

1. **A network capture** of the failing request behind symptom 1 or 3 — the status code and response
   body. Without it the ticket says "it does not work", which is not the standard.
2. **A duplicate search** across the epic. SV-8851 is adjacent (Tech Hours toggle) but is about the
   toggle doing nothing, not about the service failing; **SV-8827 is about the toggle's default
   state and is itself half wrong.** Neither is this.
3. **Confirmation of scope** — is it one location, or the whole org? Benjamin Peters is Lethbridge;
   the grid is Heavy Duty. Both fail, which suggests the whole org, but that has not been proven.

**When it is filed:** `Story Defect` (10007), parent **the owning story** (an epic parent returns
HTTP 400), priority **Low**, also link the owning story `relates to`, and **do not send Product
Area**.
