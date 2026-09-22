# Global Search V2 — Playwright suite

Converted from the probes used to execute **TestRail run 415** on the `sv9160` QA branch,
14–22 September 2026. **48 tests in 4 files**, each named with the C-id of the manual check it
automates, so a red result points straight at a case in the run.

```bash
source build/testing-tools/ensure_bridge.sh     # the local relay Chromium needs; it dies with the container
cd build/global-search/e2e
ln -sfn /opt/node22/lib/node_modules/playwright node_modules/playwright   # or: npm install
npx playwright test                              # everything
npx playwright test --list                       # what is covered
npx playwright test --grep C55716                # one check
```

## Signing in — read this first

The branch uses Google SSO. **There is no scriptable login.** The suite reuses cookies from a live
browser session, read at run time from `/tmp/qa-cookies/<branch>-full.json`:

```json
{ "sv_sso_session": "…", "PHPSESSID": "…" }
```

Never committed — this repository is public (Standing Rule 82).

**Both cookies are required.** Measured 22 September: either alone answers `401 sso_required`; the
two together answer 200. Older notes in this repo insist the sign-in cookie is enough — true before
the branch moved to Google sign-in, wrong now.

**A session lasts about an hour.** Measured the same day: stored 13:30, refused at 14:28 with
`session_expired`. Any run longer than that needs fresh cookies part way through. If every test
fails at `signIn`, that is what has happened — the message says so rather than leaving you guessing.

## What the tests are actually worth

Not the assertions — those are the easy part. **The value is the traps baked into
`fixtures/search.ts`.** Sixteen times during run 415 a measurement of mine was wrong and a working
feature looked broken. Each of those is now prevented by construction:

| The trap | What it did | Where it is handled |
|---|---|---|
| The combined view lists only **five** rows per group | **Eight** checks read as failures because the record sat sixth | `search()` always opens the record type's own tab, where twenty are listed |
| The tab strip is on screen **before** you type | Counting tabs said a search had run when none had | `C45161` counts **tab counts**, not tab elements |
| Every row icon shares the class `lucide-icon` | Reading the class said "one icon for everything"; there are eight | `C55682` reads the drawn path |
| The panel remembers its query and tab | "33 recent items" were 33 results from the previous search | `typeQuery()` always clears first |
| Loose expectations | `"Brake Chamber"` also matches two unrelated stock parts, so a check passed on the wrong record | expectations name the seeded record in full |
| Counts settle late | `All (0)` at 2s, right at 4s | `search()` needs two identical reads **and** counts present |
| The index refreshes asynchronously | Judging order before the entry rebuilds measures the old state | `waitForIndex()` — and the ranking tests refuse to judge until the edit is visible |
| One character is below the minimum | A one-letter query returns **recent items**, not results; earlier readings were contaminated | `C45161` asserts the distinction |
| Changing shop needs a **full reload** | The shop name comes from a cached copy; a soft navigation keeps the old one | the shop test reloads |
| Removing `workOrdersView` alone does nothing | Four other permissions each re-grant it | `C45142` strips all nine together |
| A role the product refuses to create | Granting part-sales alone shows nothing — **correctly**; the roles screen will not allow it without See Financial Data. A report was withdrawn over this | `C45143` sets the toggle the screen enforces |
| Two different records sharing a name prefix | Read as one record listed twice | `C45157` compares leading names, not a count |

## Known failures — red on purpose

These reproduce reported faults and stay red until fixed. Each names its report so nobody
re-investigates a known problem.

| Test | Report |
|---|---|
| `C53601` a catalogue-only part is not findable | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) |
| `C53605` year and make together return nothing | [SV-10055](https://shopview.atlassian.net/browse/SV-10055) |
| `C55660` a mid-word fragment finds nothing | [SV-10060](https://shopview.atlassian.net/browse/SV-10060) |
| `C55685` a correct spelling returns unrelated names | [SV-10025](https://shopview.atlassian.net/browse/SV-10025) |
| `C53476` the All tab counts above 20 | [SV-10320](https://shopview.atlassian.net/browse/SV-10320) |
| `C55716` ×2 the most-recently-changed rule | [SV-10340](https://shopview.atlassian.net/browse/SV-10340) |

## What is NOT here, and why

Honesty about coverage matters more than the number of tests.

- **194 manual checks were executed; 48 are automated here.** The rest are either covered by
  another test, or not worth automating, or cannot be.
- **`C53582`** (typing a town) is deliberately absent. It fails because our own later fixtures all
  carry the same town and push the seeded customer past the twenty-row limit — nothing to do with
  the product. A red result there would mean nothing until the check gets a town of its own.
- **The hover checks** (`C44866`–`C44873`) are not here. Their story was cancelled, the buttons were
  never built, and the cases are set to Retest.
- **`C45137`'s third clause** — a boost for a purchase order you raised yourself — is not asserted.
  Nothing on the branch gives two purchase orders alike except their author, and the author is not
  shown on the row.
- **Where "Partial Delivery" should rank** is not asserted. The requirement never mentions that
  state, so there is no right answer to test against. It is an open product-owner question.
- **Jobs, part sales, purchase orders and supplier invoices** are not covered by the tie-break
  tests. All four carry system-generated numbers, so nothing can be changed without also moving
  something the ranking scores.

## Data the suite depends on

Seeded by `build/global-search/seeding/seed.py` (V1 universe, 11 records). **Run
`python3 seed.py --check` before trusting a red result** — a search that returns nothing because a
value has drifted is not a product failure, and `findability.spec.ts` starts with a seed control
that fails loudly for exactly that reason.

The ranking tests **create their own records** (suppliers, and jobs at each shop) and tag them
`ZZ…` so they are identifiable. The access tests **edit the Technician role** and restore it in
`afterAll`, reading it back rather than assuming. **Do not point this suite at anything but a
disposable QA branch.**
