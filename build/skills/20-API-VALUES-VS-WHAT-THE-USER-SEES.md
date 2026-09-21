# Skill 20 — WHAT THE API SAYS IS NOT WHAT THE USER SEES

**Written 2026-09-21 on the QA lead's instruction, after this was learned the hard way three times in
two days and cost two retracted defect tickets and one wrong answer to a developer.**

> **THE RULE.** A value read from an endpoint is **evidence about the endpoint**. A test verdict is a
> statement about **what a person sees on the screen**. The two are different claims, and the first
> one does not prove the second. Read the API to *seed* state, to *enumerate* a set, or to *support*
> a finding. **Never to decide a pass or a fail.**

This is a companion to `19-HOW-NOT-TO-TEST.md`, which names the general habit. This file is the
specific one, with every real case that has caught us, so the next session can recognise the shape
before it costs a ticket.

---

## 1 · THE THREE MECHANISMS — why the two disagree at all

Every case below is one of these three. Learn the mechanisms and you can predict the trap instead of
discovering it.

### (a) THE API IS A DIFFERENT **SURFACE** — it never received what the screen sends

The front end adds things to a request that a hand-rolled call does not: the page you are standing
on, the scope tab, the debounce, the workplace. Call the endpoint yourself and those are simply
absent — so the feature that depends on them **cannot** appear, and its absence is **guaranteed by
your method**, not observed.

### (b) THE API IS A DIFFERENT **LAYER** — the value is transformed before a human sees it

A number is capped on the way out. A string is uppercased by CSS. HTML is escaped by one container
and rendered by another. The stored value and the displayed value are both real; they are not the
same value, and the requirement is about the displayed one.

### (c) THE API IS A DIFFERENT **MOMENT** — it answers about a state that is not the one on screen

A `200` says the request was accepted, not that the record changed. A field read a second later
reflects a write that the screen has not re-fetched. A cached list answers about the set as it was.

---

## 2 · THE CASES — every one of these is real, and every one was measured

| # | The claim I was making | What the API said | What the user actually sees | Mechanism |
|---|---|---|---|---|
| 1 | *"the ranking is flattened, the order is wrong"* (**SV-10277**, withdrawn) | `score: 1` on every top result | the list is ordered correctly — **the engine sorts on the real, uncapped value; 1.00 is only a cap on the number in the response** | (b) layer |
| 2 | *"the begins-with credit is not applied to Parts"* (**SV-10279**, withdrawn) | the row's internal **match label** read differently | the credit **is** applied; a controlled pair proved it. **No source defines that field at all** | (b) layer |
| 3 | *"standing on a work order makes no difference to the order"* (**SV-10188**, wrong — the developer was right) | two direct calls to `/api/search?q=` returned **identical** lists | the order **does** change: the part already on the work order drops below the one that is not, and returns to the top when you leave. **The page context is attached by the search box, not by the URL** (PRD §8) | (a) surface |
| 4 | *"disabling Financial Data wrongly removes Part Sales"* (**SV-10278**, withdrawn) | the role record still listed `partSalesView` | the **Roles and Permissions screen** shows Part Sales depends on Financial Data — disabling one deliberately disables the other | (b) layer |
| 5 | *"the build has not changed"* (would have been wrong) | `GET /api/version` → `{"version":"0.1"}` | the real marker is `meta[name=app-version]` → **`v26.36.8-d146c39`**. The endpoint answers a different question | (b) layer |
| 6 | a case renders correctly (long-standing TestRail trap) | `check_case_render.py` passes on the **stored** value | the tester reads literal `<ol><li><p>` — an API write lands in the **escaping** container; only a UI save flips it to `markdown fr-view` | (b) layer |
| 7 | *"the user has the right role"* | `role.name` looked right | access is decided by **`fe_permissions.length`**, not the role's name | (b) layer |
| 8 | *"the field is empty / the palette is broken"* | `.search-modal__input` returned placeholder `undefined`, focused `false` | that selector is the Quasar **`<label>` wrapper**; the field is the inner `<input>` | (b) layer |
| 9 | *"the label is X"* | `textContent` said one thing | CSS `text-transform` means the tester reads another. **Quote what is displayed** | (b) layer |
| 10 | *"the write landed"* | `200 OK` | nothing changed until it was **read back off the screen** (Rule 104) | (c) moment |
| 11 | *"hover does nothing anywhere in this app"* | a synthetic `dispatchEvent('mouseover')` changed nothing | **synthetic events do not trigger CSS `:hover`.** A real `elementHandle.hover()` changed every row | (a) surface |
| 12 | *"no quick-action button on the row"* | scanned inside the row element only | a button could be rendered **outside** the row in a portal — had to scan the **whole document** before and after to close it | (a) surface |

**Cases 1–4 each produced a Jira ticket or a wrong statement to a developer. Cases 5–12 were caught
in the probe.** The difference was never skill; it was whether the screen was consulted.

---

## 3 · WHEN AN API VALUE **IS** ADMISSIBLE

The API is not banned — it is the fastest tool we have. It is admissible for:

- **SEEDING** state (Rule 14): create the part, put it on the work order, set the permission.
- **ENUMERATING** a set you will then check on screen: which parts exist, which categories, which ids.
- **READING BACK A PRECONDITION** *alongside* the screen, never instead of it.
- **SUPPORTING** a finding already observed on screen — "and the stored value agrees" is a good
  sentence in a ticket; it is a bad one on its own.
- **A requirement that is explicitly about the endpoint** — an API-titled case (Rule 4). Then the
  endpoint *is* the user.

It is **never** admissible for: the pass/fail verdict on a UI requirement · an ordering claim · a
label · a "nothing happened" claim · anything the specification words as *"the user sees"*,
*"the row shows"*, *"if the user is currently on…"*.

---

## 4 · THE FIVE QUESTIONS TO ASK BEFORE YOU TRUST A READ

1. **Does the screen send something my call does not?** Page context, scope, workplace, debounce. If
   the requirement mentions where the user is standing or what is selected — **the answer is yes, and
   the call is useless for it.**
2. **Is this value transformed before a human sees it?** Capped, rounded, uppercased, escaped,
   masked, formatted, re-labelled.
3. **Is the field I am reading defined by any source?** If no specification sentence names it, it
   cannot carry a defect (worked example: case 2 above).
4. **Am I reading the right element / the right endpoint for this question?** The wrapper is not the
   input. `/api/version` is not the build marker. The role name is not the permission set.
5. **If the answer is "it never differs, under any condition" — is that the product, or is that my
   method?** A product that ignores a rule and an instrument that cannot see the rule read
   identically. **Run the positive control before you believe the negative.**

---

## 5 · WHAT TO DO INSTEAD, IN ONE PARAGRAPH

Drive the real control — the search box, the button, the tab — with a real event, on a settled page,
and read the rendered result. Build the fixture so only the thing under test differs, and check the
fixture could have shown the opposite. Take it twice with the conditions alternating. Run a positive
control proving the instrument can see this class of thing at all. Record the build marker from
`meta[name=app-version]`. Then, and only then, quote the API value as corroboration if it helps.

---

## 6 · ENFORCEMENT — this is wired in, not left to memory

`build/testing-tools/probe_guard.mjs`:

- **`assertContextRuleMethod({requirementText, method})`** — **throws** when a requirement worded
  *"if the user is currently on…"*, *"if on a …"*, *"in the context of…"* is about to be measured by
  an api / fetch / endpoint / direct call. This is case 3, made impossible.
- **`assertBehaviour({...})`** — refuses an ordering or behaviour claim unless it carries a verbatim
  source sentence, a **screen** observation, named confounders held equal by a built fixture, two
  agreeing alternating rounds, a discriminating fixture, a passing positive control, the build
  marker, and an answer to *"what would make this my fault?"*
- **`assertNegative({...})`** — the older gate, for absence claims.
- **`blocker_gate.py --check <file>`** — seven proofs with evidence before anything is called blocked.

---

## 7 · RELATED

`19-HOW-NOT-TO-TEST.md` (the general habit and the full drill) · `00-COMMON-CORE.md` (the label rule,
the counting rule) · `03-RUN-CHECK.md` (probe design) · `06-DEFECT-PREP.md` (before any defect) ·
`APP-ACTIONS-PLAYBOOK.md` §A (login traps) and §J (the `fr-view` escaping container) ·
Rules 12, 24, 57, 97, 104, 106, 114 · learnings **L0171, L0174, L0178, L0179, L0180, L0181**.

**Rule 24 is the one honourable exception and is not a contradiction:** *front end blocks + back end
allows = a **PASSED** case*. There the specification is about the screen, the API is expected to stay
open, and the API's behaviour is therefore not a fault. The inverse — **the screen exposing what the
back end blocks** — is a real defect. Both readings still come from comparing the two surfaces
deliberately, which is this whole file in one rule.
