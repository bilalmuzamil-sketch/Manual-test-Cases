# Schedule — the Staff / Roles harness fault: FIXED, 2026-08-12

**Both repairs the 11 August file asked for are done, and the pages render.**
Tools: `tools/harness.cjs` (the shared bridge + hydration), used by every probe in this folder.

---

## 1 · The presenting fault — and it was never a product defect

`/administration/roles-permissions` requested **`/api/organizations//roles`** — an **empty
organisation id** — and 404'd; `/administration/staff` never sent `/api/staff` at all.

**The 11 August pass had the mechanism right and the cause not yet found**, and its recommended first
move (capture a working `view-profile` and compare) would **not** have worked: `GET /api/iam/view-profile/`
returns **HTTP 200 with real data**, its trailing slash is **normal**, and **it carries no organisation
id at all**. That lead was a dead end, so it is recorded as one rather than quietly dropped.

**The answer was in the bundle, not in a payload.** From `index.D4lWI4An.js`:

```
Tt = "user"
k  = { getUser: () => oe(Tt) || null, ... }          // oe = JSON.parse(localStorage.getItem(key))

const e = a.data.details.intercom_data.company.id ?? ""      // <- the organisation id
yield J.getOrganizationFeatures(e)
```

So the id the roles URL is built from lives at

```
localStorage["user"] -> .data.details.intercom_data.company.id
```

Seven hydration shapes were tried on 11 August; none put the id **there**, which is why all seven
failed. Two more keys matter and were found the same way:

| Key | Why it is needed |
|---|---|
| `user.data.details.default_workplace` | the request interceptor **blocks every call** for a truthy user with no default workplace — this is the `/no-location` bounce |
| `localStorage["location"]` | supplies the **`X-Location-ID`** request header |

**And this explains the shape of the 11 August symptom exactly**: the harness seeded **no**
`localStorage` at all, so `getUser()` returned `null`, the block above never fired (it needs a
*truthy* user), most pages worked — and only the two pages that need the organisation id broke.

### Result, measured

| Page | Before | After |
|---|---|---|
| `/administration/roles-permissions` | `/api/organizations//roles` → **404**, page empty | **`/api/organizations/d55bc308-…/roles` → 200**, 12 roles listed |
| `/administration/staff` | `/api/staff` **never sent** | **`/api/staff?…` → 200**, 96 active / 66 deactivated |
| bridge errors | 12 × `net::ERR_FAILED`, indistinguishable | **0** |

Every value seeded was **read live from the API this session**, not invented:
org `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (`GET /api/organizations`), staff id
`ccbacb31-…` and `clockable` (`GET /api/staff`), workplace `b3c8c820-…`
(`GET /api/staff/my-workplaces`), permissions (`GET /api/auth/me/fe-permissions`).

## 2 · The request bridge — repaired first, as instructed

The old handler ended `catch (e) { route.abort(); }`, which made **a genuine failure and a request the
app never sent look identical**. It now records the URL and the exception and **fulfils with a
synthetic `599`**:

```js
} catch (e) {
  bridgeErrors.push({ m: req.method(), u: <path>, e: String(e) });
  await route.fulfill({ status: 599, headers: {...}, body: '{"bridge":"fetch threw"}' });
}
```

Every probe now writes `bridge_errors` into its evidence file. **They have read `0` on every run
today** — which is what makes "the app never asked for X" a statement worth making.

## 3 · What the fix unblocked, same session

All five previously-unread dialogs were read, as raw text nodes. See `LABEL-DIFF.md`.

## 4 · Two traps worth carrying forward

- **`scrollIntoViewIfNeeded` BEFORE any coordinate click.** The first Edit-Staff attempt clicked
  `y=3288` on a row below the fold and hit nothing; the dialog silently never opened. Same class as
  the Save-button miss that produced a false "the working-hours service is broken" report.
- **Take the LAST `.q-menu`, not the first.** Quasar leaves earlier menus mounted in the DOM, so
  reading the first one reports a stale menu as the live one. `tools/roles_kebab.cjs` does this.

## 5 · Honest limits

- The hydration is **ours, not the app's own login output**. It carries only the fields the bundle
  reads. A page needing a field we did not seed could still fail — no such page was met today, but
  that is an absence of evidence, not evidence of absence.
- `Reset to template` was first spotted in the `EditRole` chunk. **It was then observed live before
  anything was written**, and only the live read was used.
