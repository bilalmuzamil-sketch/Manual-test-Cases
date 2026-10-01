# FEATURE KICK-OFF `<feature>` — collect the sources and access, and measure the environments

> **Call it:** `FEATURE KICK-OFF for Invoicing`
>
> Run this first on any feature. It is cheap, it is mostly questions, and it stops the expensive
> processes from starting without what they need.

**RUNS AFTER:** nothing — this one can be called cold.

**SAFETY:** this process obeys [what must never happen](00-WHAT-MUST-NEVER-HAPPEN.md), and may not report success while any check there
is unmet. Mechanical half: `python3 build/testing-tools/safety_check.py --staged`.

---

## THE GATE — what I ask you for

| What I need | Why | If you do not have it |
|---|---|---|
| **Feature name**, and the project type: **NEW** / **V2-UPGRADE** / **REVIVAL** | V2 triggers `V1 vs V2 Capability Check`, which is the whole ballgame on an upgrade | Tell me and I will work it out from the epic |
| **The spec / PRD** link | Expected results are quoted from it, verbatim | I will flag the suite as source-incomplete and we proceed at risk |
| **The epic key** and its stories | Traceability, and often the only statement of intent | |
| **Designs** (Figma / Claude design / technical design) | They are expected to AGREE with the PRD; where they do not, that is a finding | |
| **The engineering tech plan** | A standard input (Rule 30) — I will remind you if it is missing | |
| **Who the PO is** | Questions go to a named person, never "the PO" | |
| **Environment URLs** — which exist, which to use | | |
| **A login per environment**, ideally a DEDICATED account | A login expires that user's previous session; using yours kills your own browser mid-run | I cannot seed or prove terms |

---

## THE STEPS

### 1 — Make the project a real thing
Create `build/<slug>/` with `PROJECT-STATE.md`, `requirements.md`, `cases/`, `testrail-id-map.csv`.
Record the canonical spec URL and the PO's name. *(Skill 15, and `01` §11.)*

### 2 — 🔴 MEASURE which version each environment runs. Never assume from its name.
This is not pedantry. Global Search shipped to production between two sessions, and a kit that had
"production runs V1" written into it would have seeded one universe of seven and then proved it with
a verifier pointed at an endpoint that no longer existed — reporting a dead environment that was
perfectly healthy.

```bash
# a route that EXISTS answers 401 unauthenticated; one that does not answers 404
curl -s -o /dev/null -w '%{http_code}\n' https://<api-host>/api/<v2-route>
curl -s -o /dev/null -w '%{http_code}\n' https://<api-host>/api/<v1-route>
```

Read **both**, because one alone cannot tell "V1 is deployed" from "the whole host is behind a
parking page" — a sleeping QA branch answers 403 to everything.

### 3 — Record the build marker of each environment, and keep recording it
```bash
curl -s https://<host>/ | grep -o 'app-version" content="[^"]*"'
```
Every later finding is read against this. *(proof rules, leg c.)*

### 4 — Establish access, and prove it
Log in once per environment and confirm the account reaches the **workplace you will actually work
in** — not just that it authenticated. On Global Search the production account could see 3 of the 9
workplaces; the one we needed was in there, but that had to be checked, not hoped.

Store credentials in `/tmp/<env>/`, `chmod 600`. **Never commit them — this repo is public**
(Rule 82). They are gone when the container restarts, so expect to ask again.

### 5 — Write down the access facts you just learned
Which login works, whether quick-login is available, whether a fresh login kills the previous
session, which workplace. Put it in `build/APP-ACTIONS-PLAYBOOK.md` so the next session does not
rediscover it. *(Rule 27.)*

---

## THE TRAPS

| Trap | Symptom | Fix |
|---|---|---|
| Assuming an environment's version from its name | A verifier reports a healthy environment as dead | Measure both routes (step 2) |
| Using the QA lead's own login | Every long run dies with `session_expired` halfway | Ask for a dedicated account |
| A default list page standing in for the list | A record you just created "does not exist" | Pass an explicit `limit`; a default page is not the list |
| Taking the in-body "Version 1.8" on a Confluence page as the version | The source is stale while the badge looks fresh | Use the page's real version number, not the text in it |

---

## DONE WHEN
The project folder exists, every source is named with a link, each environment has a measured
version + build marker, and a login has been proved to reach the right workplace.

**Canonical:** `build/skills/15-NEW-PROJECT-INTAKE.md`, `build/skills/14-ACCESS-RESILIENCE.md`.
**Rules:** 30, 31, 82, 83, 89, 110.
