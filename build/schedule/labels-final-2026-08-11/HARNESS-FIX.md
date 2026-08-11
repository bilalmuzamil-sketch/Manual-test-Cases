# Schedule — the Staff / Roles harness fault, 2026-08-11

## 🔴 NOT FIXED THIS PASS — and the reason is not the harness

**The app session is dead: `GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions` →
HTTP 401 `{"error":"sso_required"}`**, probed twice ~17 minutes apart and on two API hosts.
**The harness cannot be fixed without a browser session to fix it against**, because every candidate
change has to be *tested* by loading the page and watching which requests go out.

**`quick-login` and `switch-user` were deliberately NOT called** — both rotate the shared token and
would sign the QA lead out of his own browser, and sibling workers with it.

**So this file records the diagnosis, the evidence, and the exact next move — it does not claim a
fix.** Everything below is carried forward from the build-VIU pass's live diagnosis
(`build/schedule/build-viu-2026-08-11/FINDINGS.md` F14, evidence `evidence/diag-*.json`,
`evidence/staff-diagnosis.log`).

---

## What is actually broken — measured, not assumed

The Staff and Roles admin pages render **empty**. It is a **harness fault, not a product defect**:

| Page | What the app requests | Result |
|---|---|---|
| `/administration/roles-permissions` | **`/api/organizations//roles`** — note the **double slash**: an **empty organisation id** | **HTTP 404** |
| `/administration/staff` | **`/api/staff` is NEVER REQUESTED AT ALL** | — |
| both | the feature-flags call, with the same empty value | **HTTP 400** |
| both | every other call | **HTTP 200 with real data** |

**So the session is fine and the pages load — our hydration simply does not carry the organisation id
where the app reads it.** Seven plausible hydration shapes were tried and none worked, so **the exact
key is still unknown while the mechanism is pinned**.

## The two things to try first, in order

**1. `/api/iam/view-profile/` is the likeliest source, and it is showing the SAME symptom.** That call
also goes out **with a trailing slash and no id**, which is the strongest available hint that the app
initialises its organisation context from that payload (or from a store it populates) rather than from
anything we seed into `localStorage`. **Start by capturing a real, working `view-profile` response
from an ordinary browser session and comparing it against what our hydration produces.**

**2. 🔴 FIX THE REQUEST BRIDGE FIRST — it is currently destroying the evidence needed to fix anything
else.** The bridge calls **`route.abort()` on any `fetch` exception**, which makes **a failure
indistinguishable from a request the app never made**. Both pages log **12 × `net::ERR_FAILED`**, and
under the current bridge there is no way to tell which of those were real network failures and which
were requests the bridge itself killed.

**This is the higher-priority repair even though it is not the presenting fault**, because until it is
done every observation about "which requests the page sends" is unreliable — including the finding
that `/api/staff` is never requested. **Change the handler to distinguish the two: on a `fetch`
exception, log the URL and the exception and `route.fulfill()` with an explicit synthetic error
status, rather than aborting.** Then re-run the diagnosis and re-establish the request list on
trustworthy footing.

---

## What it blocks — five dialogs, still NOT OBSERVED

These are the labels that cannot be confirmed until the harness is fixed **and** a session exists:

| Label our case asserts | Case | Link |
|---|---|---|
| `Reset To Template` | **C38926** | [view](https://shopview.testrail.io/index.php?/cases/view/38926) |
| `Time Clock` | **C30084** | [view](https://shopview.testrail.io/index.php?/cases/view/30084) |
| `Add hours` | **C38850** | [view](https://shopview.testrail.io/index.php?/cases/view/38850) |
| `Set business hours for this shop` | **C38847** | [view](https://shopview.testrail.io/index.php?/cases/view/38847) |
| `Set custom hours for this technician` | **C38848**, **C38849** | [view](https://shopview.testrail.io/index.php?/cases/view/38848) · [view](https://shopview.testrail.io/index.php?/cases/view/38849) |

## ⚠️ Interim evidence exists for three of them — and it was NOT acted on

The QA lead's screenshots of the **Edit Staff Member** dialog (11 August) show:

| Our case says | His screenshot shows | Status |
|---|---|---|
| `Set custom hours for this technician` | **`Set working hours for this technician`** | **likely wrong in our case** |
| `Add hours` | **`Add Hours`** — capital H | **likely wrong in our case** |
| — | `Time Clock` **present** | consistent with C30084 |

**NOTHING WAS CHANGED ON THE STRENGTH OF THIS, deliberately.** Its provenance is *"read from the QA
lead's screenshot, 11 August 2026"* — **not our live capture**, and a case corrected from it could not
honestly carry *"Last checked against build v3.5-65d6500"* in its Rule-54 sentence 2. **Our own read
supersedes it, and that read has not happened.** Two label corrections are therefore **owed and
queued**, not applied — recorded so the next pass with a session picks them up in its first ten
minutes rather than rediscovering them.
