# Reading record, part CSS: appifact-style.pretty.css, 22 Oct 2026

Brief: `WORKER-BRIEF.md` (Rule 119: every line read). Read only; no commits; nothing written outside this folder.
Running notes: `READING-NOTES-CSS.md`.

## 1. Coverage

| File | Size | Lines | Line ranges read (in order) | How | Coverage |
|---|---|---|---|---|---|
| appifact-style.pretty.css (formatted copy of appifact-style.css, md5 db443f41599d890a9fe6c39dfbc02a8f confirmed) | 524,787 bytes | 11,960 | 1-434 · 436 · 438-1012 · 1014-1713 · 1714-3213 · 3214-4713 · 4714-6213 · 6214-7713 · 7714-9213 · 9214-10013 · 10014-10913 · 10914-11864 · 11866-11960 | Read tool, chunks of at most 1,500 lines | 11,956 lines read line by line |
| same file, the 4 font lines | — | 435 · 437 · 1013 · 11865 | text outside the base64 read with the payload masked; each base64 payload decoded by script (fontTools 4.67.0 + brotli) and its name table, glyph list and axes read | decoded by script, as the brief requires | 4 lines |
| **Total** | | **11,960** | | | **100%** |

Three inline SVG data URIs (L8999, L11897, L11900) were URL-decoded by script and read in full.

## 2. Font table (all embedded fonts)

| Line | Format | Decoded bytes | Family (name id 1) | Style / weight | Glyphs / code points | md5 |
|---|---|---|---|---|---|---|
| 435 | WOFF2 | 14,692 | anthropicons | Regular, 400 | 183 glyphs, 182 code points U+F101-U+F1B6 (Private Use Area) | eb198a5f1dc03d5d801e95db845b7148 |
| 437 | WOFF | 18,372 | anthropicons | Regular, 400 (WOFF fallback of L435, same glyph set) | 183 / 182, U+F101-U+F1B6 | 970de08bbeb0a26fdac156b8056edf10 |
| 1013 | WOFF2 | 29,424 | anthropicons-20-regular (CSS family "anthropicons-v2") | Regular, 400 | 262 glyphs, 261 code points U+F101-U+F205 | 4acc527eb7a9d1f2fd604559db33c210 |
| 11865 | WOFF2 (variations) | 91,684 | Anthropicons RVRN (CSS family "Anthropicons-Variable") | Regular; variable axes wght 400-700, opsz 12-32, ANIM 0-100, ANM2 0-100 | 760 glyphs, 300 code points U+E000-U+E12D | 5713d4bfac254297e8b4e270efd1677f |

All four are **icon fonts** (glyph names such as Check, CaretDown, Search, Settings, Trash). None has a letter or digit, so
none can stand in for a text font. No ShopView word appears in any glyph name.

Decoded SVGs: L8999 = 16x16 resize grip (two diagonal strokes, #898781); L11897 = 10x6 down triangle rgba(0,0,0,.5)
(dropdown chevron, light); L11900 = the same triangle rgba(250,249,245,.6) (dropdown chevron, dark).

## 3. Findings

Overall: the CSS styles the canvas tool's own frame (toolbar, tab bar, panels, chat/comment box, menus, dialogs). **No rule
targets the content of a board, and there is no ShopView or feature content in the file.**

| # | Lines | What it says, in plain words | Affects the 68 boards? | Affects the text inventory? |
|---|---|---|---|---|
| F1 | 328-330, 366-380 | The tool's own comment says this stylesheet is "host-side only — preview iframes have their own documents and never see this sheet". Board previews are drawn in separate frames (iframes, srcDoc). The CSS forces each such frame to `display:block` and `color-scheme: normal`, so a light board stays light and see-through even when the tool itself is dark. | No. The tool's CSS cannot recolour, re-font or clip anything inside a board. | No |
| F2 | 18-264 (165-169), 10010-10311, 10994-11126 | Three separate dark-mode switches, all for the tool's frame: the `--om-*` palette switches on `data-theme="dark"` on `<html>`; the `--t-*` palette follows the computer's dark setting or `data-theme`; the component library switches on `data-mode` or the computer's dark setting. | No (see F1). Tester note: a dark frame around a board picture is the tool, not the design. | No |
| F3 | 105-108, 240-241 | "Component artboards on the design canvas (imported by another file)" get a frame ring of #8b6ac8 and a title colour of #473aa6 (dark mode #a68dd8 / #b9aaf0). A purple ring or purple board title is the tool marking an imported component, not a colour in the design. | Only boards that are imported components. The CSS cannot say which boards those are; that is a canvas.json / JS question for parts JS-A and JS-B. | No |
| F4 | 11136-11236 | Top tab bar (`.mc-tabbar`): each tab at most 220 px wide, one line, the label cut with "…" when longer; below 32rem width the tabs scroll sideways with a hidden scrollbar. The selected tab is bold (600) with a light wash. | No, but a long page or tab name is shown cut short in the tool. | Yes, in one way: take page or tab names from the files, never from what the tab shows. |
| F5 | 11246-11293 | Toolbar (`.tb-*`): button labels hidden when the toolbar is narrower than 37.5rem, status text hidden below 26rem, some buttons pinned or scrolled at 56rem / 67rem (touch screens). | No. Viewer words only. | No |
| F6 | 3176-3180, 4893-4895, 11433-11447 | General "cut with …" helpers exist (`.truncate`, `.text-ellipsis`). The only named use in the CSS is a collaborator's cursor name (16 characters wide). **No CSS rule targets board titles or notes**, so whether a board title or note is cut is decided by the JS or inline styles. | Unknown from CSS. Hand to JS-A and JS-B: check whether the code puts `truncate`, `text-ellipsis` or a max-width on board titles or notes. | Possibly, if JS does it: the inventory must use the full text in the files. |
| F7 | 5666-5698, 7197-7202, 7436-7441 | General colour-filter helpers exist (`.blur`, `.grayscale`, `.invert`, `.sepia`; darken to 80% while pressed; 2 px blur behind a nested dialog). No CSS rule puts any of them on a board. | Not from CSS. JS-A and JS-B: check whether any is added to a board element. | No |
| F8 | 382-393, 9160-9168, 9328-9338, plus the font table | The tool's text uses the computer's system fonts (-apple-system / Segoe UI / Roboto / Arial; SF Mono / Menlo for code). `--font-anthropic-sans`, `--font-anthropic-mono` and `--font-anthropic-serif` are used but never defined in this file, so system fonts apply unless the JS sets them. The four embedded fonts are icons only. | No. Board text is drawn inside the board's own frame with its own fonts (F1). | No |
| F9 | 11410-11452, 11308-11360 | Live collaborator cursors with name labels are drawn over the canvas (`.mc-peer-cursors`, half-faded when idle). A save-state dot shows grey, amber (pending), red (error) or an outline (loading). | No. Tester note: a coloured arrow and name over a board is another viewer's cursor, not part of the design. | No |
| F10 | whole file (script check) | No `image-rendering`, `zoom`, `line-clamp` or blend-mode rule anywhere. The CSS does not change image smoothing, scale or line clipping of board pictures. Zoom and scale, if any, are in the JS. | No | No |
| F11 | whole file (script check) | No ShopView or feature words (Sales Representative, Unassigned, Labor, Parts, Part Sales, Sales Type, Becky, Devon, Elliot, report names: 0 hits). The 6 "split" hits are the tool's split button (L6393-6394, L6653-6663). The only URLs are the SVG namespace (w3.org) and the Tailwind licence banner (L1041). | No | No: nothing to add to the inventory. |
| F12 | 1000-1010, 1016-1039 | Icon-font housekeeping: six newer icons (Create, Toggles, Grid, BrowseSelect, Fastforward, Pause) come from the v2 icon font; the comment explains why the full switch was not done. | No | No |

Findings count: **12** (F1-F12). Board-affecting from CSS alone: **none confirmed**. Items handed to the JS parts: F3 (which
boards are component artboards), F6 (truncation of board titles or notes), F7 (filters on boards), F10 (zoom and scale).

## 4. canvas.json fields read by the code

**Not applicable to CSS.** A stylesheet cannot read canvas.json; the field list is part JS-A and JS-B's job. For the JS parts,
these are the DOM `data-` attributes the CSS styles (the JS sets them, possibly from canvas.json): data-active, data-anchor-hidden,
data-behind, data-cds, data-cds-segment, data-checked, data-closed, data-density, data-disabled, data-ending-style, data-font,
data-highlighted, data-hoverable, data-idle, data-indeterminate, data-instant, data-invalid, data-limited, data-mode, data-nested,
data-nested-dialog-open, data-panel-open, data-platform, data-popup-open, data-reduce-motion, data-reveal, data-selected,
data-side, data-size, data-starting-style, data-step, data-sync, data-theme, data-theme-switching, data-unchecked. None names a
board, title or note.
