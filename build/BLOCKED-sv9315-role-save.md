# BLOCKED — a role change cannot be saved on the sv9315 QA branch (2026-09-10)

**Proved, not assumed.** `build/inline-add-edit-parts/execution-2026-09-09/probe69_rolepersist.mjs`,
evidence `evidence/69-rolepersist.json` and `evidence/69-rolepersist.png`.

## What was done

1. Signed in as Admin, opened `/administration/roles-permissions/2d4b8464-81a9-4c1e-96c6-a2a64f02a389/edit`
   (the **Technician** role). Read state: **View mode = Tech view**, See Financial Data **off**.
2. Clicked the **Full View** segment. The DOM updated — `wo-settings__segment--active` moved.
3. Clicked **Save**. The button was enabled and the click landed.
4. Watched every non-GET request the page made. **The only call was
   `POST /api/check-existing-roles` → 200.** There was no role-update request of any kind.
5. Reloaded the page. **View mode = Tech view** again. `GET /api/roles/<id>` agrees.

## What this means

**No role edit persists through the UI on this branch.** This is the same behaviour the QA lead
described on 2026-09-09 for the "Move labor" toggle — *"for now ignore if MOVE labor is not sticking,
it's a separate bug which is not related to testing this feature"* — but it is **not limited to that
one toggle**: the View-mode segment does not stick either, and the Save fires no write at all.

## What it blocks — and what it does not (Rule 68)

**Blocked** — four cases whose precondition is a role the branch will not let us build:

| Case | Needs |
|---|---|
| [C53477](https://shopview.testrail.io/index.php?/cases/view/53477) | Full View **without** See Financial Data |
| [C45066](https://shopview.testrail.io/index.php?/cases/view/45066) | Full View with **Work order lines → Create & Edit OFF** |
| [C45032](https://shopview.testrail.io/index.php?/cases/view/45032) | Tech view with **Create & Edit OFF** |
| [C44995](https://shopview.testrail.io/index.php?/cases/view/44995) | any role with **Create & Edit OFF** |

**NOT blocked** — everything else in suite 6597. The two roles that already exist (Administrator =
Full View with See Financial Data; Technician = Tech view, Create & Edit on) cover every other case,
and 81 of them are already Passed on [R418](https://shopview.testrail.io/index.php?/runs/view/418).

## Routes still to try before this is called final

1. **Create a NEW role** rather than editing one — creation may write where editing does not, and the
   Tech staff can then be assigned to it (assigning a role to staff is proven to work: the Admin-role
   restore on 2026-09-09 did exactly that).
2. **Write the role through the API** — `GET /api/roles/<id>` answers, so the write side is worth
   probing.

Neither has been tried yet; this file will be updated with the result.
