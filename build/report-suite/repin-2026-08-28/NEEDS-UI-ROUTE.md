# Report Suite re-pins that must NOT go through the API — 2026-08-28

These cases are **approved for a re-pin and still un-re-pinned**. Each one is listed with
the pin it needs. None was written this pass, and none may be written through
`update_case`: the reason is in the last column and it is a property of the case, not a
preference.

The safe route for all of them is the **TestRail UI editor** (the route proven on the 71
cases repaired on 2026-08-28 — `build/report-suite/damage-2026-08-26/ui_repair_batch.mjs`).
A UI save also flips the field to the rendering container, so a case repaired that way
stops being fragile.

**Nothing here is done without the QA lead's go-ahead (Rule 6).**

| C-id | Report | Pin now → needs | Expected container | Blocks | Why the API is barred | Link |
|---|---|---|---|---|---|---|
| C30195 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30195 |
| C30206 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30206 |
| C30208 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30208 |
| C30213 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30213 |
| C30226 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30226 |
| C30229 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30229 |
| C30230 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30230 |
| C30231 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30231 |
| C30233 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30233 |
| C30235 | SBR | 22 → **24** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/30235 |
| C30236 | SBR | 22 → **24** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/30236 |
| C30237 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30237 |
| C30238 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30238 |
| C30325 | PV | 10 → **11** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30325 |
| C30345 | PV | 10 → **11** | `markdown fr-view` | 1 | CONTENT CHANGE NEEDED - its Expected Result still says the exports right-align numerics; live v11 S3-R8 says only the PDF does. Prepared, stopped at the button. | https://shopview.testrail.io/index.php?/cases/view/30345 |
| C30368 | PV | 10 → **11** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30368 |
| C30369 | PV | 10 → **11** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/30369 |
| C30370 | PV | 10 → **11** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/30370 |
| C30371 | PV | 10 → **11** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/30371 |
| C30381 | PV | 10 → **11** | `markdown fr-view` | 1 | PIN-ONLY BUT EXTENDED - the case names the specification version TWICE (once in a tester note, with a date), so the one-token swap would leave it self-contradictory. Prepared, stopped at the button. | https://shopview.testrail.io/index.php?/cases/view/30381 |
| C30459 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/30459 |
| C30464 | WIP | 24 → **28** | `markdown fr-view` | 3 | Multi-block body (3 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30464 |
| C30475 | WIP | 22 → **28** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30475 |
| C30476 | WIP | 22 → **28** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30476 |
| C30477 | WIP | 22 → **28** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30477 |
| C30478 | WIP | 22 → **28** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30478 |
| C30479 | WIP | 22 → **28** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30479 |
| C30480 | WIP | 22 → **28** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/30480 |
| C30485 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/30485 |
| C30526 | WIP | 22 → **28** | `markdown fr-view` | 1 | HELD - the case cites NO specification anchor, so the anchor diff cannot prove its content is current. Re-pinning it would stamp it with a version nobody read it against, which is the exact fault this pass exists to fix. Needs a hand read against the live spec first. | https://shopview.testrail.io/index.php?/cases/view/30526 |
| C38894 | SBR | 22 → **24** | `markdown fr-view` | 4 | Multi-block body (4 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/38894 |
| C38913 | SBR | 22 → **24** | `markdown fr-view` | 5 | Multi-block body (5 top-level blocks). The API sanitiser keeps only one top-level block and nests the rest inside it, silently restructuring the body. | https://shopview.testrail.io/index.php?/cases/view/38913 |
| C38916 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/38916 |
| C43547 | PV | 10 → **11** | `markdown fr-view` | 1 | HELD - the case cites NO specification anchor, so the anchor diff cannot prove its content is current. Re-pinning it would stamp it with a version nobody read it against, which is the exact fault this pass exists to fix. Needs a hand read against the live spec first. | https://shopview.testrail.io/index.php?/cases/view/43547 |
| C43592 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/43592 |
| C43593 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/43593 |
| C43594 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/43594 |
| C43821 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/43821 |
| C43836 | WIP | 22 → **28** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/43836 |
| C43839 | SBR | 22 → **24** | `markdown` | 1 | Escaping container. Its Expected Result renders in a bare `markdown` container, so any API write turns the wrapper TestRail adds into literal `<p>` text on the tester's screen. | https://shopview.testrail.io/index.php?/cases/view/43839 |

## Count

**40 cases** need the UI route.

| Reason | Count |
|---|---|
| Escaping `markdown` container — an API write is visible damage | 14 |
| Renders fine but the body is multi-block — an API write restructures it | 22 |
| Renders fine and single-block, but held on content/judgement (see the assessment) | 4 |

## OUTSTANDING — what I need from you

1. Go-ahead to run the proven UI editor route over the 40 cases above.
2. The 4 content/judgement holds are separate — they are in `HELD-25-ASSESSMENT.md` and need a decision before any route is used.
