# SECRET REDACTION — 2026-08-11

**Scope:** repository hygiene only. **0 TestRail calls · 0 Jira calls · 0 repository-setting
changes.** Branch `claude/slack-session-0sxnd9`, fast-forwarded to `cb538b4a` before any work
(0 commits behind, no force, no rebase, no reset).

---

## 🔴 THE ONE-LINE ANSWER FOR THE QA LEAD

**Twelve Mercure notification tokens were published in a PUBLIC repository — eight of them since
4 August. Every one is now expired, and none of them ever granted more than "listen to one user's
notification feed". The files are cleaned at HEAD. The tokens are still in git history and cannot
be recalled. The decision that actually matters is whether to rotate the Mercure signing secret.**

---

## 1. THE TRUE SCOPE — RE-ESTABLISHED ON THE UPDATED TREE

The sweep was re-run from scratch across all **11,314 tracked files**, not inherited.

### ⚠️ THE HEADLINE FIGURE IN THE BRIEF WAS WRONG, AND IT WAS WRONG IN THE SAFE DIRECTION

The brief said **28 tokens**. The true figure is **12 distinct tokens in 14 occurrences across 13
files**. The earlier scan counted **regex hits**, and `eyJ` matches **twice per token** — a JWT's
header *and* its payload both begin `eyJ` because both are base64 of `{"`. 28 hits ÷ 2 = 14
occurrences, of which 12 are unique. **The file count of 13 was correct.**

| File | Occurrences | Distinct tokens |
|---|---:|---:|
| `build/report-suite/rulings-2026-08-04/evidence/deact-RepB/calls.json` | 1 | 1 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepA-enter/calls.json` | 1 | 1 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepB-confirm/calls.json` | 1 | 1 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepB-dismiss/calls.json` | 1 | 1 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepB-reactivate/calls.json` | 1 | 1 |
| `build/report-suite/rulings-2026-08-04/evidence/deact2-RepZ-notoggle/calls.json` | 1 | 1 |
| `build/report-suite/rulings-2026-08-04/evidence/fault-RepB-precheck/calls.json` | 1 | 1 |
| `build/report-suite/rulings-2026-08-04/evidence/fault-RepB-submit/calls.json` | 1 | 1 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-roles-fix.json` | 1 | 1 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-roles.json` | 1 | 1 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-staff-fix.json` | 1 | 1 |
| `build/schedule/build-viu-2026-08-11/evidence/diag-staff.json` | 1 | 1 |
| `build/schedule/build-viu-2026-08-11/evidence/staff-diagnosis.log` | **2** | 2 |
| **TOTAL** | **14** | **12** |

The log file carries duplicates of the two `*-fix.json` tokens, which is why 14 occurrences yield
12 unique values. **The 8 + 5 split in the brief is confirmed exactly.**

### SIX FILES MATCHED `eyJ` AND ARE **NOT** LEAKS — each checked, not assumed

| File | What it actually is |
|---|---|
| `build/custom-roles-run/sv7388-done-tickets/SV-7831.md` | Jira smart-link tracking param. Decoded: `{"bridge":"smartLinks","id":"1782754252486","source":"jira-JSW"}` |
| `build/custom-roles-run/sv7388-done-tickets/SV-8196.md` | same |
| `build/schedule/design-2026-07-27/prototypes/Schedule Week Export.dc.html` | `eyJ` occurring by chance inside a base64 image blob, not at a token boundary |
| `build/schedule/design-2026-07-27/prototypes/schedule-week-view.html` | same |
| `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` | prose quoting the pattern: `` `eyJ` (a JWT prefix) `` |
| `build/RECOVERY-2026-08-11/STATE.md` | prints its own detection pattern in an audit table |

### EVERY OTHER CREDENTIAL CLASS — SWEPT AND CLEAN

| Swept for | Result |
|---|---|
| `Bearer ` literal | **0** (only the recovery doc's own prose) |
| `Authorization` **with a literal value** | **0** — all 10 code hits are `'Basic ' + AUTH`, a runtime variable |
| Hardcoded `AUTH`/`TOKEN`/`PASSWORD` | **0** — all 35 derive from `CREDS`/`SECRET` read from `/tmp` at runtime |
| `set-cookie` **values** | **0** |
| `sv_sso_session` / `PHPSESSID` / `cf_clearance` **values** | **0** — 8 files hold templated variables (`${CK.sv_sso_session}`) |
| Known cookie prefixes (`5f4382b1`, `cbbb1de8`, `f6c4fc3c`, `d8a3efd6`, `PTkkGsPD`, `8703d34c`) | **0** — all 6 appear *only* inside the recovery doc's own audit table |
| `figd_` Figma tokens | **0** |
| Private keys, AWS / GitHub / Slack tokens | **0** |
| **Byte-match against the 24 real credentials currently in `/tmp`** | **0** |

**One near-miss worth recording.** A first, looser pass flagged 508 files. Every hit was the
Atlassian **accountId** `712020:6d590212-…`, which is a **public identifier** appearing in profile
URLs — not a secret. It reached the candidate list because a `/tmp` credentials file stores it
under a `value` key. This is now filtered in both raw and URL-encoded (`%3A`) form; without that
filter the scanner flags every Jira snapshot in the repository and would have been abandoned within
a day.

---

## 2. WHAT THE TOKENS ACTUALLY GRANT — DECODED LOCALLY, NOTHING SENT ANYWHERE

All 12 decode to **one identical shape**:

```
header  {"typ":"JWT","alg":"HS256"}
payload {"mercure":{"subscribe":["/users/0eabf741-019e-4b02-84ce-66097c140b3a/notifications"]},
         "exp":<unix ts>}
```

- **Grant:** subscribe to the **Mercure** push hub (`mercure.qa.shopview.com`) for **one topic** —
  a single user's notification stream.
- **Subject:** **all twelve name the same user**, `0eabf741-019e-4b02-84ce-66097c140b3a`. One
  account's feed, not the estate.
- **No `publish` claim** — they cannot inject or forge notifications, only listen.
- **They are not API credentials.** They do not authenticate to the ShopView API, TestRail, Jira or
  QuickBooks; they are useless outside the Mercure hub.
- **Expiry:** every one carries `exp`. Earliest **2026-08-04T08:52:34Z**, latest
  **2026-08-11T14:27:59Z**. **ALL TWELVE ARE EXPIRED** — the newest lapsed **3.5 hours before this
  pass ran**. Consecutive `exp` values sit 1–10 minutes apart, consistent with a short-lived,
  per-page-load token.

### THE PART THAT DOES **NOT** EXPIRE, AND IS THE REAL REASON TO ROTATE

Each token carries a valid **HS256 signature** over a **known plaintext**. That makes every one an
**offline oracle for brute-forcing the Mercure signing secret** — no network access needed, no rate
limit, no log entry, and **it works just as well in five years as today**. If that secret is weak or
guessable, an attacker who recovers it can mint **arbitrary** Mercure tokens, including ones with a
**`publish`** claim and **wildcard topics**, which is a materially larger grant than anything the
leaked tokens themselves ever had.

**So: low impact from the tokens; the residual risk is entirely in the signing key.**

---

## 3. WHAT WAS REDACTED

Each token value replaced **in place** with:

```
[REDACTED — Mercure JWT bearer token, removed 11 August 2026]
```

**Structure deliberately preserved** — the `"body_head"` field, the `"data"` / `"token"` keys and
the sibling `"hubUrl"` all remain, so the evidence stays diagnostically useful and is **visibly**
altered rather than silently changed. These are audit records; nothing was deleted, no line was
removed, and no other byte in any file was touched.

**Verification (Rule 50 — exhaustive, then exact):**

| Check | Result |
|---|---|
| JWT-shaped tokens remaining in the tracked tree | **0** |
| Files changed vs files intended | **13 = 13**, set-equal in both directions |
| Diff size | **14 insertions, 14 deletions** — exactly one line per token |
| Applying the same substitution to the committed version reproduces the file **byte-for-byte** | **13 of 13** |
| Collateral changes | **ZERO** |
| Touched JSON still parses | **12 of 12** |

Pre-write SHA-256 of all 13 files: `snapshots/pre-write-hashes.json`.

---

## 4. PREVENTION

### (a) The scanner — `build/testing-tools/scan_secrets.py`

Takes a path list, `--tracked`, `--staged`, or `--diff`; **exits non-zero on a match**.
Covers JWTs, `Bearer`/`Basic` values, literal `Authorization` headers, `set-cookie` and
session-cookie **values**, the six known cookie prefixes, `figd_`, private keys, AWS/GitHub/Slack
tokens, and literal password assignments.

**It distinguishes a reference from a value**, which is the difference between a tool people use and
one they disable:

| Not flagged (reference) | Flagged (value) |
|---|---|
| `{'Authorization': 'Basic ' + AUTH}` | `{'Authorization': 'Basic ZGVtbzpodW50…'}` | <!-- scan-secrets:allow -->
| `"sv_sso_session": "${CK.sv_sso_session}"` | `sv_sso_session=5f4382b1c0ffee…` |
| `json.load(open("/tmp/testrail/creds.json"))` | `password = "hunter2hunter2"` | <!-- scan-secrets:allow -->
| `"password":"<password>"` (doc placeholder) | — |

**It ships with no secret material.** This repo is public, so committing the real passwords *even
hashed* would publish a brute-forceable target. `--build-fingerprints` hashes the real `/tmp`
credentials **into `/tmp`**, where the scanner loads them automatically. 24 fingerprints were built
and matched **0** files.

### (b) Proven BOTH ways — a scanner that only ever passes proves nothing

| Test | Expect | Got |
|---|---|---|
| **NEGATIVE** — cleaned tree, 11,357 tracked files, fingerprints loaded | exit 0 | **exit 0 ✅** |
| **POSITIVE** — a **real** token recovered from git history | non-zero | **exit 1, caught `[jwt]` ✅** |
| **POSITIVE** — planted token in a staged diff | non-zero | **exit 1, caught `[jwt]` + `[bearer_value]` ✅** |
| **SELFTEST** — 6 positive, 15 negative, 2 fingerprint controls | exit 0 | **ALL PASSED ✅** |

Captured output: `scanner-proof.txt`.

Two real defects were found *by* these controls and fixed, rather than papered over with an
allowlist: doc placeholders such as `"password":"<password>"` were being flagged (3 false positives
in the tree), and because `=` is a legitimate value character the tokenizer swallowed `name=` along
with the value so no fingerprint could ever match.

### (c) The harness cause — **and the brief's stated cause was wrong**

The brief said *"a capture wrote `Authorization` headers straight to disk."* **It did not.** There
is **not one `Bearer` literal anywhere in the repository.** The real mechanism, in
`build/schedule/build-viu-2026-08-11/tools/step9_staffdiag.cjs`:

```js
body = JSON.stringify(j).slice(0, 600);   // first 600 chars of EVERY JSON response
```

and `/api/notifications/subscribe-token` is an endpoint whose **entire purpose is to return a
token**. **This matters:** a fix aimed only at request headers would have left the leak exactly
where it was. **Response bodies leak credentials as readily as request headers, and are watched far
less.**

**Fixed at the point of capture** in both `step9_staffdiag.cjs` and `step9b_staffdiag.cjs`: a
`scrub()` helper now redacts JWTs, `token`/`password`/`secret` JSON values and `Bearer`/`Basic`
header values **before anything is written**, keeping the key so the evidence stays useful. Verified
against the exact leaked payload — token gone, `"token"` key and `hubUrl` preserved, both files pass
`node --check`.

**The order matters: redact at capture; scan before commit as the backstop, never as the control.**

### (d) The books

- `build/APP-ACTIONS-PLAYBOOK.md` — new header block: the repo is **PUBLIC**, the incident, the
  reasoning that failed, the harness cause, the scanner usage.
- `CLAUDE.md` — the existing *"NEVER commit secrets"* rule extended in place (additive; neither file
  restructured).

Both state the lesson plainly: **a JWT is a credential even when it is short-lived and narrowly
scoped.** *"It expires in ten minutes"* and *"it only grants read access to one topic"* describe the
**blast radius**; they are not arguments for committing it.

### (e) The repository is PUBLIC — now recorded where a future pass will see it

`bilalmuzamil-sketch/Manual-test-Cases`, `"private": false`. **This was not stated in the books
before today**, and it changes what may be written to disk at all — not merely how tidy we are. It
is now in the playbook header and in `CLAUDE.md`.

---

## 5. 🔴 WHAT REMAINS EXPOSED — READ THIS BEFORE TREATING THE MATTER AS CLOSED

**The redaction cleans HEAD. It does not clean history, and it does not end the exposure.**

- The tokens remain in **5 commits**, the earliest `f3f81ea5` (**2026-08-04 08:55:17Z**).
- Eight tokens have been world-readable for **7 days**; four for **~3.5 hours**.
- On a **public** repository, anything pushed must be assumed **already cloned, forked, mirrored and
  cached by third parties** — including GitHub's own API, which serves blobs from unreachable commits.
- **`git log -p` and `git show` still print every token today.** This report's own scanner will
  keep finding them in history, correctly.

**Do not let the tidy diff above be mistaken for the exposure ending.**

### The three options, with their real costs

| Option | What it achieves | What it costs | Honest verdict |
|---|---|---|---|
| **A. Leave history as-is** | Nothing further. HEAD is clean; history still carries 12 expired, subscribe-only, single-user tokens | Zero disruption | **Defensible on its own** — every token is expired and none ever granted more than one user's notification feed |
| **B. Rewrite history** (`filter-repo` / BFG + force-push) | Removes them from *this* remote's reachable history | **Rewrites 491 commits.** Force-push to a branch **several live sessions share** from other containers — every one would need re-cloning, and any un-pushed work risks being lost. Forks, clones and caches are **unaffected**. Contradicts the standing "never force, never rebase" rule | **Not recommended.** High, immediate, certain cost; buys little on a public repo |
| **C. Rotate the Mercure signing secret** | **Actually revokes every leaked token** and, more importantly, **closes the offline key-brute-force path**, which is the only risk that does not expire | One config change plus a hub restart by engineering. No QA disruption | **RECOMMENDED** |

### RECOMMENDATION

1. **DO ROTATE the Mercure signing secret (C).** It is the only control that actually revokes
   anything, it is cheap, and it closes the sole risk with no expiry date. **Rotation is worth doing
   even though every token is already expired** — precisely because the brute-force oracle is not.
2. **DO NOT rewrite history (B)** unless the QA lead directs it after weighing the cost. It disrupts
   several live sessions, rewrites 491 commits, breaks the standing no-force rule, and cannot recall
   anything already cloned from a public repo.
3. **A is acceptable if C is done.** With the signing secret rotated, the historic tokens are inert
   strings.
4. **Worth raising separately, and outside a worker's remit:** the repository is **public** and
   contains this organisation's full QA corpus, internal Jira keys, staging endpoints and staff
   names. Whether that is intended is the QA lead's call. **No repository setting was changed by
   this pass.**

---

## 6. WHAT THIS PASS DID NOT DO (Rule 12)

1. **No history rewrite, no force-push, no `reset --hard`, no rebase.**
2. **No repository visibility change.** Making it private was not attempted — it is not a worker's
   decision, and it would not recall existing clones.
3. **No token validity test against the live Mercure hub.** Expiry was established by **decoding the
   `exp` claim**, not by attempting a connection — that would be using a leaked credential. Every
   `exp` is in the past; that is arithmetic, not an inference.
4. **The signing secret was not tested for strength.** No brute-force was attempted. The risk is
   stated as a *structural* property of a signed token over known plaintext.
5. **`.gitignore`d and untracked content was not swept** — the scan covers **tracked files** and
   history for the 13 known paths.
6. **Other capture harnesses were not audited.** Two proven leaking harnesses were fixed. Other
   `boot*.cjs` / `harvest.cjs` tools may capture response bodies the same way and **have not been
   reviewed**; the tree is clean today, so none has leaked yet. **A sweep of every capture harness is
   a sensible follow-up and is not claimed as done.**

---

## FILES IN THIS PASS

| Path | What it is |
|---|---|
| `REPORT.md` | this document |
| `snapshots/pre-write-hashes.json` | SHA-256 + byte length of all 13 files before redaction |
| `scanner-proof.txt` | captured output of the four both-ways scanner tests |
| `../testing-tools/scan_secrets.py` | the reusable scanner (contains no secret material) |

---

## OUTSTANDING — what I need from you

1. **Rotate the Mercure signing secret?** — engineering owns the hub; this is the one control that
   revokes anything. **Recommended.**
2. **Rewrite git history, or leave it?** — 491 commits, a force-push onto a branch other live
   sessions share. **Recommendation: leave it, and rotate instead.**
3. **Should this repository be public at all?** — it holds the full QA corpus, internal Jira keys and
   staging endpoints. Not a worker's call; nothing was changed.
4. **Sweep the remaining capture harnesses?** — two were fixed; the others have not been reviewed.

---

## 7. ⚠️ COMMIT-SCOPE INCIDENT — MY ERROR, RECORDED RATHER THAN TIDIED AWAY

**The redaction commit `5775229d` contains 50 files, not the 21 this pass touched.** The other 29
are a **live Filters worker's in-flight SV-9041 work**, which that worker staged into the **shared
git index** in the seconds between my `git add` calls and my `git commit`.

**The cause was mine.** I staged 21 explicit paths correctly, then built the commit's path list by
**re-reading `git diff --cached --name-only` at commit time** instead of using my own list. By then
the index held their files too, so `git commit -- <paths>` was handed *their* paths as well as mine
and faithfully committed all 50.

**What this did and did not do:**

- **Nothing was lost, reverted, discarded or altered.** All 50 working-tree files are byte-identical
  to their pre-commit state (verified by SHA-256, 50/50 unchanged, 0 changed, 0 missing). The other
  worker's content is exactly as they wrote it — it is simply committed under my message.
- **No fix was attempted, deliberately.** `git reflog` shows `5775229d … update by push`: **the
  commit is already on `origin`.** Undoing it would require a **force-push onto a branch several
  live sessions share**, which the standing rules forbid and which is far more dangerous than an
  over-broad commit message.
- **The only real damage is a misleading commit message** — it describes a credential redaction and
  silently also carries a Filters pass.

**The lesson, which is the same class of error as the leak itself:** *build the path list once, from
your own explicit set, and never re-derive it from shared mutable state.* A shared index on a branch
with concurrent workers is exactly that.

**Nothing is owed to the Filters worker beyond awareness** — their files are committed and pushed
intact, so their pass can continue unaffected. It is worth their knowing their work landed in
someone else's commit.
