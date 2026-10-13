## M. Figma: extract ALL frames from a design link (proven 2026-07-31, Filters)
**Use when** the user hands over one or more `figma.com/design/<fileKey>/...?node-id=A-B` links and
wants every frame/board captured. **Do NOT WebFetch the figma.com URL** (returns the app shell only)
and do not assume the Figma MCP is connected — it usually is not.

- **Creds:** a Figma **personal access token** goes at **`/tmp/figma-token`** (`chmod 600`; secret →
  `/tmp` only, NEVER committed; scripts must read the file, never inline the value). Verify with
  `GET https://api.figma.com/v1/files/<fileKey>?depth=1` → HTTP 200 + the file name. **`/tmp` is
  ephemeral — on a fresh container ASK THE USER for a token** (Figma → Settings → Security →
  Personal access tokens → scope *"File content read-only"*).
- **⭐ WHICH ACCESS ROUTE, and in what order (learned the hard way 2026-07-30/31, Filters — this
  ordering saves a day):** **ASK FOR A REST TOKEN FIRST when there is a BACKLOG of frames.** The
  **Figma MCP** `get_screenshot` needs no token and is cheap per call, but it has a **low per-seat
  tool-call cap** (*"You've reached the Figma MCP tool call limit for your View seat"* — no
  `retry-after`, so Rule 35's +9 h applies): it managed **6 boards then stopped**. **REST
  `/v1/images` with a token has no such cap** — it rendered the **remaining 6 in ONE call with no
  429** and finished an 85-board set that had been stuck for two days. So: **MCP is fine for one or
  two boards; a token is the only sane route for a backlog.** The two budgets are independent, so a
  capped MCP does not mean REST is capped, and vice versa.
- **⚠️ A LAYER TREE CANNOT ANSWER "IS THIS CONTROL PRESENT?" — ONLY A RENDER CAN.** This cost us two
  wrong "control X is absent" claims that we wrote into our own design notes as *corrections*: a
  toolbar sort icon and a `Status ↓` column indicator were both declared absent from a tree read and
  are plainly there in the PNG. **The reason:** an icon lives inside a component `INSTANCE` under a
  layer name containing no keyword you would search for. **Rule:** use the tree for *text* and
  *structure*; for any presence/absence question, render the board, crop the region and read it at
  2–3×. And when a render lands, **re-check every absence claim you made from the tree** — record the
  verdicts in a table (correct / wrong / indeterminate), and say plainly which ones the render could
  not settle (e.g. a heading row hidden behind an open panel).
- **Node-id format gotcha:** the URL uses a **dash** (`11817-27678`); the **API uses a colon**
  (`11817:27678`). Convert both ways.
- **Step 1 — enumerate the whole tree (Rule 17 completeness):**
  `GET /v1/files/<fileKey>/nodes?ids=<id1>,<id2>,...` (all ids in ONE call), then walk it:
  descend through `CANVAS` and `SECTION`, and **collect at the first `FRAME` / `COMPONENT_SET`**
  (do not recurse into a frame or you collect its inner layers as separate boards).
  **Dedupe by node id** — a link often points at a whole CANVAS that *contains* the other links, so
  the union is far smaller than the sum. *(Filters: 4 links → 118 hits → **85 unique boards**.)*
  State the exact total found before rendering.
- **Step 2 — read the exact on-screen labels WITHOUT any image:** walk the same tree collecting
  `TEXT.characters` per board, **skipping `visible:false`** layers. This is the Rule-9 wording source
  and it survives a rate limit. Also read `componentProperties`/`variantProperties` on `INSTANCE`
  nodes — that is how you prove a state (e.g. a chip rendered with variant `Disabled` vs `Selected`),
  and `COMPONENT_SET` children names give the full variant list (`Default/Hover/Selected/Disabled`).
  Layer NAMES also identify unlabelled icons (`Filter-lines`, `Columns`, `Switch-vertical` = sort).
  **⚠️ Never report a `visible:false` layer as design content** — Figma components are full of hidden
  placeholder text ("By ownership", "Administrator", "Placeholder").
- **Step 3 — render:** `GET /v1/images/<fileKey>?ids=<comma ids>&format=png&scale=2` returns
  `{images:{id:url}}` (signed S3 URLs), then `curl -L -o <file> <url>`.
- **⚠️ THE BIG GOTCHA — the images endpoint has a hard, long-window cap.** After ~24 renders it
  returns `HTTP 429 {"err":"Rate limit exceeded"}` with **`retry-after: ~37874` (≈10.5 HOURS)**.
  `scale=1` is capped identically (cost is not per-pixel), and no amount of backoff helps inside a
  session. The **`/nodes` endpoint is a separate budget and keeps working** — which is why Step 2
  matters. Practical rules: **render in small batches with a pause, most-important boards FIRST**,
  make the fetcher **resumable** (skip any file already on disk, cache the signed URLs to json), and
  when capped, fall back to (a) PNGs already exported for the same node ids in an earlier pass, and
  (b) the Step-2 text/variant extraction — then state the honest split in the deliverable.
- **⚠️ AND YOU MUST STILL GO BACK FOR THE MISSING FRAMES — Standing Rule 35 (mandatory, no
  authorization needed).** A rate limit is a DELAY, never an end state: "all the frames needed"
  means **100%**. When capped, create/update a **`PENDING-FIGMA-FETCH.md` queue file in that
  project's design folder** holding: an **OPEN** status header with the check-and-run instruction ·
  the file key · the exact **missing node ids + target filenames** · the **UTC error timestamp** ·
  **DUE-AT = error time + 9 HOURS** · the fresh `retry-after` for reference · the **exact resumable
  command** · and a **RETRY LOG** table (attempt #, timestamp, outcome, frames obtained, still
  missing, `retry-after`, next DUE-AT) wrapped in `<!-- RETRY-LOG-START -->` /
  `<!-- RETRY-LOG-END -->` markers so the fetcher appends its own rows and re-arms DUE-AT. Then
  **re-attempt at/after DUE-AT automatically without asking**; on another 429, append + re-arm
  (new error time + 9 h) and **repeat until every board has a PNG**. Check the queue at **every
  session start** and **before/after any work on that project or any design ingest**
  (`ls build/*/design-*/PENDING-FIGMA-FETCH.md`). **A design pass may NOT be called complete while
  a queue is OPEN** — state the shortfall ("73/85 PNGs; 12 pending, due-at <ts>") in the design
  notes AND the project's PROJECT-STATE.md. There is **no background timer** across sessions — the
  queue file + that mandatory check IS the mechanism. Live example (open):
  `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md`.
- **Naming (Rule 19):** `<Section-Name>__<Board-Name>__<node-id-with-dash>.png` — board names repeat
  constantly ("Mobile" ×4, "Step 1" ×3), so the node id is mandatory to disambiguate.
- **Python gotcha:** do NOT name a helper script `enum.py` — it shadows stdlib `enum` and breaks
  `import json` with a circular-import error.
- **Helpers (copy these):** `build/filters/design-2026-07-31/tools/` — `enumerate_frames.py`
  (tree walk + dedupe), `texts.py` (visible-text per board), `render.py` (batch image request),
  `fetch_all.py` (**the resumable/idempotent fetcher — reads `frame-inventory.json`, skips boards
  already on disk, caches signed URLs in `imgurls.json`, runs from any cwd, and on a 429 prints +
  logs the error time / `retry-after` / DUE-AT into `PENDING-FIGMA-FETCH.md`; exit 0 = complete,
  2 = rate-limited & re-armed, 3 = short for another reason**). Canonical example output:
  `build/filters/design-2026-07-31/DESIGN-NOTES.md` (85-board inventory + design-vs-cases flags)
  and `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` (the Rule-35 retry queue).

