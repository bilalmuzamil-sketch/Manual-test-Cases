# Annotated screenshots + bite-proof Jira tickets — a hand-off guide

**Purpose:** a self-contained guide for another QA session on **(1) how to make annotated
before/after screenshots** for Jira comments and tickets, and **(2) the small set of habits that
keep a ticket from biting the QA lead.** Part 1 is the main thing to learn. Part 3 is the checklist.

Everything here is proven on real tickets (SV-8733, SV-8781, SV-8815, SV-9705). Paths and snippets
are copy-pasteable.

---

## Part 1 — Annotated screenshots (the technique)

**What "annotated" means:** boxes, arrows and a caption drawn **on the image**, pointing at the
exact value being evidenced — so a reader sees the defect (or the pass) without being told where to
look. A bare screenshot the reader has to interpret does **not** count.

**Before AND after:** whenever the test asserts a *change* (a save, a state flip, a value, a
permission gate, a tooltip reveal), you need a **before** picture and an **after** picture. One
screenshot proves nothing about a change. Where the proof is revealed by a hover/click/menu, the
"before" is how the control looks at rest and the "after" is the reveal.

The method has three steps: **capture real geometry → screenshot → draw with PIL.**

### Step 1 — capture the element's real geometry (don't eyeball coordinates)

Drive the page with Playwright and read the bounding box of the element you're evidencing, so the
box lands exactly on it. (Chromium is pre-installed; import Playwright from the system path.)

```js
// inside a Playwright page, after the element is visible:
const rect = await page.locator('[data-test-id="input_part_cost"]').evaluate(el => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
console.log('rect', JSON.stringify(rect));   // e.g. {x:544.8, y:616.2, w:91.7, h:40}
await page.screenshot({ path: 'raw-02-reopen.png' });   // SAME viewport as the geometry read
```

Rules that matter here:
- Screenshot at the **same viewport** you read the geometry in (e.g. `viewport:{width:1600,height:1000}`),
  so the coordinates match the pixels. A `fullPage` shot shifts nothing horizontally but grows
  vertically — fine as long as the element is inside the captured area and you read its rect in the
  same page.
- **Capture at the moment it reproduces.** The state that proves a bug is often destroyed by the
  next click, a redeploy, or the session expiring. Shoot first, then continue.

### Step 2 — annotate with PIL

`pip install pillow` (fonts already live at `/usr/share/fonts/truetype/dejavu/`). This is the
**exact, reusable `canvas()` helper** used on SV-8733 — it draws boxes, arrows with arrowheads, and
a caption band **below** the screenshot (so captions never cover the values):

```python
from PIL import Image, ImageDraw, ImageFont
import math
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def F(sz, bold=True): return ImageFont.truetype(FB if bold else FR, sz)

RED=(211,47,47); GREEN=(27,120,60); BLUE=(21,101,192); WHITE=(255,255,255); DARK=(33,33,33)
# GREEN = pass / fixed / correct value   RED = the defect / wrong value   BLUE/DARK = neutral pointer

def canvas(src, cap_lines, boxes, arrows):
    """src=png path; cap_lines=[(text,color)]; boxes=[(x,y,w,h,color)]; arrows=[(x1,y1,x2,y2,color)]"""
    im = Image.open(src).convert("RGB")
    W, H = im.size
    caph = 34*len(cap_lines) + 28
    out = Image.new("RGB", (W, H+caph), WHITE)   # extra canvas at the bottom for the caption
    out.paste(im, (0, 0))
    d = ImageDraw.Draw(out)
    for (x, y, w, h, color) in boxes:            # box around the value (4px padding out)
        d.rectangle([x-4, y-4, x+w+4, y+h+4], outline=color, width=4)
    for (x1, y1, x2, y2, color) in arrows:       # arrow from caption area up to the box
        d.line([x1, y1, x2, y2], fill=color, width=4)
        ang = math.atan2(y2-y1, x2-x1)
        for a in (ang-0.4, ang+0.4):
            d.line([x2, y2, x2-16*math.cos(a), y2-16*math.sin(a)], fill=color, width=4)
    y = H + 12
    for (txt, color) in cap_lines:               # caption sits in the extended band, not on the image
        d.text((20, y), txt, fill=color, font=F(21)); y += 34
    return out

# --- one exhibit: box the reopened Cost value, arrow to it, green because it PASSED ---
e = canvas("raw-02-reopen.png",
    [("STEP 2  -  Reopened the Edit Part Request window: Cost still reads $45.78900 - NOT $45.79000.", GREEN),
     ("This is the reported bug (rounding on reopen). It is FIXED.", GREEN)],
    boxes  = [(544, 616, 92, 40, GREEN)],           # <- the rect from Step 1
    arrows = [(430, 560, 548, 616, GREEN)])          # from a clear area up to the box
e.save("exhibit-02-reopen.png")
```

Annotation rules that keep it clean:
- **Caption goes in the extended band below the image, never over the value.** If you must caption
  inside the image, give the text a white background box first so it stays readable.
- **One box per value being evidenced**, sized from the real rect (Step 1) with a few px of padding.
- **Colour carries meaning:** green = the correct/fixed value, red = the wrong value/defect, blue or
  dark = a neutral "look here". Use red on the *before* (the bug) and green on the *after* (the fix).
- **Name the exact element in the caption** — the row/control by its on-screen name *and* id
  (e.g. "the Lamkin Diesel Services Inc row, INV-S2-17228"), never "a row" / "one of the invoices".
- Keep the captions plain-English and in a human QA voice — no jargon, no AI phrasing (Part 3).

### Step 3 — sanity-check the finished image

Open the annotated PNG and confirm the box is on the right value and no caption covers it, before
you commit it. (In this harness you can just Read the PNG back.)

---

## Part 2 — getting the screenshots into a Jira comment/ticket

The Atlassian MCP has **no attachment upload**. The proven route: **commit the PNGs to this repo**
and embed them as **ADF external media** pointing at the public raw URL.

1. Commit the exhibit PNGs to the repo (they must be pushed and public).
2. Build the raw URL:
   `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>/exhibit-02-reopen.png`
   — this repo is **public**, so `raw.githubusercontent.com` returns **200**. The branch name is part
   of the path.
3. **`curl` every URL for a 200 before posting** — a broken image is a visible bite:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' "https://raw.githubusercontent.com/<owner>/<repo>/<branch>/.../exhibit-02-reopen.png"
   ```
4. Post the comment with `contentFormat:"adf"`. Each image is a `mediaSingle` → `media` external node,
   followed by a caption paragraph:
   ```json
   {"type":"mediaSingle","attrs":{"layout":"full-width"},
    "content":[{"type":"media","attrs":{"type":"external",
      "url":"https://raw.githubusercontent.com/<owner>/<repo>/<branch>/.../exhibit-02-reopen.png"}}]}
   ```
5. Comments are updatable via `commentId` — a wrong post is corrected **in place**, never stacked on
   top. Post **one complete comment** that states the result, not a chain of "I said X, actually Y".

**Comment shape (every ticket, pass or fail):** first line = **`OVERALL QA STATUS: PASSED/FAILED`**
in a panel + one sentence naming the env + build marker + checks-passed count → a **table** of every
check with its own PASSED/FAILED → **inline annotated images**, one captioned per check → a `rule`
node → **"Technical details for developers"** LAST (build marker, endpoints, ids, raw responses).

---

## Part 3 — tickets that do NOT bite (the checklist)

A ticket bites the QA lead when someone opens it and **can't reproduce it**, or acts on something
that turns out false/stale. Every item below exists to prevent that.

**Content**
- [ ] **Everything is live-verified on the branch, at the moment of shipping** — never from memory,
      inference, spec-only reading, or a stale screenshot. Re-confirm the data is still there right
      before the ticket goes out.
- [ ] **Name the EXACT test data** the reproduction depends on — the work order, line, part, customer,
      row, by on-screen name *and* id — and **verify it is still live on the branch**. An unnamed
      variable is the classic bite (the reader picks a different one and can't reproduce).
- [ ] **Reproduction runnable by a non-technical PO, click-by-click on the named QA branch.** Start
      with "Open the QA branch to reproduce: `<sv####.qa.shopview.com link>`", then numbered steps
      using exact on-screen labels + the navigation path. If a control is inside a collapsed/closed
      container, the steps must include the **open/expand** action and show the collapsed starting
      state. Nothing requires a console or an endpoint.
- [ ] **Annotated before/after screenshots inline** (Part 1), one per check, boxes on the real values.
- [ ] **"Found while testing `<TICKET>`"** as the **first line** (with the ticket linked) when the
      finding came out of testing another ticket — then a line break, then the description.
- [ ] **Concise title that explains the problem** — names the screen/feature *and* the actual problem,
      ~≤80 chars, no ids/jargon. Not a vague label, not a paragraph.
- [ ] **Short, plain description** — one or two lines; add a line only if genuinely needed. No case ids,
      endpoints, HTTP codes, or jargon in the PO-facing text.
- [ ] **"Fastest way to reproduce" deep link** after the full steps — lands as close to the issue as
      the app truly supports, then names the tiny remaining clicks. Honest: never claim the link opens
      a tab/state it doesn't (client-side tabs/dialogs often don't change the URL — say so).
- [ ] **Technical details LAST**, under a `rule`, for the developer only.

**Voice & metadata**
- [ ] **Human QA voice — no AI/Claude fingerprint anywhere** in the ticket/comment body (no "as an AI",
      no model name, no attribution footer, no robotic scaffolding). Nobody should be able to tell AI
      tested it. (Git commit trailers are internal and don't count.)
- [ ] **Priority always `Medium`** on any ticket you create or edit — the PO raises/lowers it, not us.
- [ ] **Parent = the epic** where one exists; the owning story is **linked as `Relates`** (never
      reparent onto a story, never a subtask). If the tested ticket is parentless, match it and say so.
- [ ] **Never file an API-only defect without asking** — if a fault is reachable *only* by calling an
      endpoint (no screen sends that request), ask the QA lead separately before filing. If it also
      fails through a screen, it's user-facing and normal.

**The pre-post bite-proof gate (run right before you hit send, every time)**
- [ ] **Re-read the build marker live** (`index.html` app-version + last-modified/etag) — confirm it
      still matches the build you tested on. If it moved, the branch redeployed → re-verify before posting.
- [ ] **Re-read the ticket live** (status, newest comments) — a mid-pass comment can change scope.
- [ ] **`curl` every image URL → 200.**
- [ ] **Every number/claim traces to evidence captured this pass** — no stale figure carried forward.
- [ ] **Scan the reader-facing text for any AI fingerprint.**
- [ ] **After posting, read the comment/ticket back** and verify the first line, the image count AND
      order, and the row counts against what you sent (the write response only echoes the request).

---

*Canonical worked example to copy from: `build/sv8733-part-cost-precision-2026-09-04/` — the
`evidence/annotate.py` (verbatim template above), the three `exhibit-*.png`, and the posted comment
(SV-8733 comment 76030). For the full reasoning behind each checklist item, see CLAUDE.md Standing
Rules 52, 62–72 and the "Deliverable conventions the user likes" Jira section.*
