## I. UI automation (Quasar)
- **Escalation ladder when a click won't take:** (1) selector click → (2) fire the element's own
  handler / `dispatchEvent` → (3) **bounding-box / element-center COORDINATE click**
  (`page.mouse.click`) → (4) JS set value + dispatch `input`/`change` → (5) keyboard → (6) call the
  EXACT endpoint the button calls, ONLY after confirming the FE gate/dialog was reachable (disclose it;
  never PASS on gate presence alone). *Source: HEADLESS-AUTOMATION section below.*
- **Reach an in-page tab / WO detail (bounce fix):** land on `/workorders` then `page.evaluate(()=>{
  history.pushState({},'','/workorders/{id}/lines'); dispatchEvent(new PopStateEvent('popstate'))})`.
  Close the auto New-Line dialog via `.q-dialog i:text("close")` (Escape does NOT close Quasar
  persistent dialogs). JS-click a tab: `document.querySelector('[data-test-id=link_finance_tab]').click()`.
- **Quasar selects:** click `.q-dialog .q-select` by INDEX (labels wrap the whole dialog — never
  `label:has-text()`); options in `.q-menu .q-item`. Inputs: `input.q-field__native` by index.
- **🛑 QUASAR CHECKBOX STATE LIVES ON THE COMPONENT ROOT'S `aria-checked`, NOT ON THE HIDDEN
  `<input>` (proven live 2026-08-06, Schedule).** Reading the hidden input **mis-reported 9 of 11 roles**
  as having a permission switched OFF when they did not. Read the root's `aria-checked` (and the
  matching class), never the input's `checked` property. Same rule for the View-Options and
  Filter-and-Display toggles, which are the same component.
- **🛑 ALWAYS `scrollIntoViewIfNeeded()` BEFORE A COORDINATE CLICK — a click that misses looks EXACTLY
  like a feature that does nothing (proven twice, 2026-08-06, Schedule).** In the staff dialog the
  **Save & Close** button sits below the fold; a bounding-box-centre `page.mouse.click` landed on
  nothing, **0 requests** were sent, the dialog stayed open, and that was read as *"saving working
  hours does not persist"* — a **false "the working-hours service is broken" report** that came within
  one step of being filed as a defect. Same script with `scrollIntoViewIfNeeded()` first:
  `POST /change` **201** + `PUT /working-hours` **200**, and the edited value read back. **Two controls
  proved the mechanism from both sides** (hours untouched + button scrolled into view → both requests
  fired every time). **The variable is never the feature — it is whether the click reached the button.**

### 🔬 READING A LABEL OFF THIS SPA — the visible TEXT NODE, never the screen and never the accessible name (proven 2026-08-11, Schedule `sv8685`, `v3.5-65d6500`)

**Two traps, both of which produce a CONFIDENT WRONG ANSWER to a casing question. They cost nothing to
avoid once you know them, and a screenshot cannot settle either.**

**TRAP 1 — CSS `text-transform` makes the screen lie about capitalisation.**
`textContent` (and a `TreeWalker` over text nodes) returns the **raw markup**, immune to
`text-transform`. `innerText` **applies** it. The Schedule toolbar panels are styled uppercase, so:

| Read via | Filter & Display control | View options control |
|---|---|---|
| the screen / `innerText` | `FILTER & DISPLAY` | `VIEW OPTIONS` |
| **`textContent` (the shipped string)** | **`Filter & display`** | **`View options`** |

**A screenshot — or an `innerText` dump — would have decided two label questions wrongly.** So: harvest
with a `TreeWalker` over `SHOW_TEXT` for the canonical string, and keep `innerText` only for
*"what does the tester physically see"*.

**TRAP 2 — DO NOT ACCEPT THE ACCESSIBLE NAME AS THE LABEL.** The same toolbar button carries
`aria-label="Filter and display options"`. A containment/substring diff therefore "finds" a case's
wording `Filter and Display` **in the build** — but only inside a string **no manual tester can ever
see**. The visible label is `Filter & display`. **A label diff that accepts the accessible name will
certify the wrong wording with full confidence.** Rank the sources: **visible text node → tooltip →
`aria-label` (diagnostic only, never the tester-facing label).**

**A THIRD, CHEAPER TRAP WORTH THE SAME BREATH — a placeholder is not a mismatch.** Our own sweep
flagged `'N Lines'` on four cases as wrong because the build renders `8 Lines`. The cases are RIGHT:
one of them spells out *"(with N = the line count)"*. **Before staging a correction, check whether the
"mismatch" is deliberate scope-conditional wording (Rule 42) or a negative assertion** (*"there is no
'View Day' item"* — a string search cannot tell an assertion from a negation).

**Method that works, in one line:** dump `texts` (TreeWalker), `buttons`/`headers` (`innerText`),
`aria`, `placeholders` and every `data-test-id` per surface, keep them **per surface** so a change list
can say WHERE a label was seen, and prefer the **non-all-caps** form when the same label appears twice.
Harvester: `build/schedule/build-viu-2026-08-11/tools/harvest.cjs`; differ: `.../tools/sweep.py`.

### ⚡ THIS SPA AUTHENTICATES FROM `localStorage`, NOT COOKIES — a live API session is not enough to reach a page

A cookie set that returns **HTTP 200** on `…api.` will still land the browser on **`/login?redirect=…`**,
because the SPA decides "signed in" from `localStorage` (`user`, `token`, `fe_permissions_wrapper`). The
boot2 hydration is therefore **required**, not a shortcut. **Build the seed from LIVE reads every time**
(`/api/auth/me/fe-permissions`, `/api/staff`, `/api/staff/my-workplaces`) — **never reuse a stored
seed.** A seed captured hours earlier carried `default_workplace: "None"` from before the account was
configured, and reusing it would have faithfully reproduced the bounce it was meant to solve.

### 🕒 WORKING HOURS AND THE BEFORE/AFTER-HOURS FLAG — read the BOARD, and read the RIGHT technician

- **Per-staff hours:** `GET /api/staff/{staff_id}/working-hours` → `{data:{workingHours:{ranges:[{dayOfWeek,startMinute,endMinute}]}}}`.
  **Minutes from midnight** (420 = 07:00). **A non-working day has NO range at all** — and because a
  missing day is absent under ISO (1=Mon…7=Sun) *and* JS (0=Sun…6=Sat) numbering alike, "absent = not
  working" is **convention-independent** and safe to state.
  **Note the id: it is the `staff_id`, not the user `id`** — the user id returns `404 'Staff' was not found.`
- **Everything at once:** `GET /api/schedule/board?from=<ISO-Z>&to=<ISO-Z>` (**it rejects bare dates**:
  *"Must be a UTC ISO-8601 instant, for example 2026-08-03T00:00:00Z"*) returns `shifts` with
  **`conflictReasons`** (`before_hours` · `after_hours` · `double_booked`) and **`workingWindows`
  per staffId per date** — so a conflict can be checked against its OWN technician's window without
  opening the UI.
- **🛑 THE MISTAKE TO AVOID, and it nearly cost a false defect:** the flag is measured against **each
  technician's own configured hours**, and technicians on one board **differ** (Alicia Campbell
  06:00–15:00, MQ Test Tech Qamar 07:00–19:00). Comparing a flagged shift against **the signed-in
  account's** hours will look like a bug and is not one. **Proven correct: the UI quoted "(3:00 PM)" for
  Alicia's 15:00 end and "(7:00 AM)" for Qamar's 07:00 start, on the same board.**
- **⚠️ Build-wording caveat worth knowing before reading a case:** the message says *"Starts before
  **business** hours (7:00 AM)"* even though the boundary is demonstrably the **technician's** window.
  The label says business, the arithmetic is per-technician.

### ⚠️ EDITING A STAFF RECORD KILLS THAT USER'S SESSION — not just a ROLE change (widened 2026-08-11)

§A already records this for a **role** change (409 at +0 ms, new state applies only on a **fresh
login**). It also fires on a **default-location** change and on a **working-hours** change — i.e. it
appears to be **any** edit to the staff record. **Operational consequence: finish ALL account
configuration FIRST, then sign in, then hand over the cookies** — a set minted between two edits is
dead on arrival. **And the recovery ask is a FRESH SIGN-IN, not a `cf_clearance`:** the tell is
**409 on every branch and never 401** (proven end to end — the replacement set had a new `PHPSESSID`
with `sv_sso_session` and `cf_clearance` **byte-identical** to the set that was 409ing).

