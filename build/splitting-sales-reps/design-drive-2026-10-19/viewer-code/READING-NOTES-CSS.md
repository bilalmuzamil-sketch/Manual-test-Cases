# Reading notes, part CSS: appifact-style.pretty.css (11,960 lines), 22 Oct 2026

Source check: appifact-style.css md5 db443f41599d890a9fe6c39dfbc02a8f (matches brief). Pretty copy 524,787 bytes, 11,960 lines.
Method: Read tool, chunks of at most 1,500 lines, in order. Embedded data: URIs decoded by script
(scratchpad decode_fonts.py; fontTools 4.67.0 + brotli installed for the purpose).

## Embedded data: URIs (7), decoded by script before line reading
| Line | Type | Decoded bytes | Family (name id 1) | Style | Notes |
|---|---|---|---|---|---|
| 435 | font/woff2 | 14,692 | anthropicons | Regular, wght 400 | icon font, 183 glyphs, PUA U+F101-U+F1B6, md5 eb198a5f1dc03d5d801e95db845b7148 |
| 437 | font/woff | 18,372 | anthropicons | Regular, wght 400 | same glyph set as line 435 (WOFF fallback), md5 970de08bbeb0a26fdac156b8056edf10 |
| 1013 | font/woff2 | 29,424 | anthropicons-20-regular | Regular, wght 400 | icon font, 262 glyphs, PUA U+F101-U+F205, md5 4acc527eb7a9d1f2fd604559db33c210 |
| 11865 | font/woff2 | 91,684 | Anthropicons RVRN | Regular, variable (wght 400-700, opsz 12-32, ANIM 0-100, ANM2 0-100) | icon font, 760 glyphs, 300 PUA codepoints U+E000-U+E12D, md5 5713d4bfac254297e8b4e270efd1677f |
| 8999 | image/svg+xml | - | - | - | 16x16 two diagonal strokes #898781 (a resize-grip icon) |
| 11897 | image/svg+xml | - | - | - | 10x6 down-triangle rgba(0,0,0,.5) (select chevron, light) |
| 11900 | image/svg+xml | - | - | - | 10x6 down-triangle rgba(250,249,245,.6) (select chevron, dark) |

All four fonts are ICON fonts (glyph names such as Check, CaretDown, Search, Settings); none carries letters or digits, so none
substitutes for any text font. No ShopView text in any glyph name.

## Chunk log
- **1-434** (read): header comment "Omelette design tokens"; :root light palette (--om-*), :root[data-theme="dark"] dark palette
  (dark mode is switched by data-theme="dark" on <html>, L165-169), pp- kit tokens, box-sizing/border reset, form-control font
  inherit, button transparent, autofill repaint, checkbox accent, .cds-root heading reset, html overscroll-behavior none,
  iframe { display:block; color-scheme: normal } (L366-380), html/body system font stack -apple-system/Segoe UI/Roboto/Arial
  with antialiasing (L382-393), .om-scrollbar, theme-switch transition mute.
  FOUND: L328-330 comment says this sheet is host-side only: "preview iframes have their own documents and never see this
  sheet" -> the viewer CSS does not restyle what is drawn inside a board preview iframe. L372-379: preview iframes forced to
  color-scheme normal so a light board stays light/transparent even when the viewer is dark. No ShopView text.
- **435** (decoded by script; the non-base64 part is `url(data:font/woff2;base64,...)`) anthropicons woff2, see font table.
- **437** (decoded by script; non-base64 part `url(data:font/woff;base64,...)`) anthropicons woff, see font table.
- **436, 438-1012** (read): @font-face "anthropicons" (woff2 + woff), i.ai-* icon base rule, 182 .ai-<Name>:before icon classes
  mapping to U+F101-U+F1B6 (XSmall ... Interactive), start of "v2 overlay" comment and @font-face "anthropicons-v2". Viewer
  chrome icons only. Nothing about boards, no ShopView content.
- **1013** (decoded by script; non-base64 part `src: url(data:font/woff2;base64,...)`) anthropicons-20-regular, see font table.
- **1014-1713** (read): end of anthropicons-v2 @font-face; 6 v2 overlay icons (Create, Toggles, Grid, BrowseSelect, Fastforward,
  Pause); tailwindcss v4.3.1 banner (L1041) and @layer properties (--tw-*/--cds-* resets); :root theme vars (spacing, text sizes,
  radii, --color-om-* aliases, om-pulse/fade/scale/spin animation names); utilities: scroll-fade-strip, pointer-events,
  visibility, position, inset/top/right/bottom/left, z-index scale (z-ask 60, z-menu 50, z-modal 70, z-toast 80, z-tooltip 90,
  z-selection 45, z-sheet 47, z-panel 40), grid col/row, container breakpoints, margins. Viewer chrome only; nothing about board
  rendering; no ShopView content.
- **1714-3213** (read): Tailwind utilities: margins, display, size/h/w/min/max, flex, table, transform/translate/rotate,
  animation utilities, cursors, touch-action, resize, scroll-fade-x/-y mask gradients (CDS scroll fades on scroll containers),
  grid templates, alignment, gaps, divide, `.truncate` (ellipsis, nowrap, overflow hidden; generic utility, L3176-3180),
  overflow utilities, start of rounded. Generic viewer-chrome utilities; nothing specific to boards; no ShopView content.
- **3214-4713** (read): Tailwind utilities: border-radius, border widths/styles/colours (om-/cds-/t- tokens, git-status colours),
  background colours (om-/cds-/t- tokens, colour scales), gradients, mask-image fades (L4163-4170 fade content to transparent at
  bottom 3rem / right 24px; generic utilities), background size/clip/position, SVG fill tokens, object-fit, padding, text-align,
  vertical-align, font families (ui-monospace/SF Mono/Menlo; ui-sans-serif/system-ui), text sizes 11/13/14px. Generic chrome
  utilities; nothing specific to boards; no ShopView content.
- **4714-6213** (read): Tailwind utilities: CDS text sizes, small px text sizes 8-13px, line heights, font weights 430/450,
  tracking, text-wrap/overflow-wrap/word-break, `.text-ellipsis`, white-space, text colours (om-/cds-/t- tokens), text-transform,
  tabular-nums, decorations, opacity, many box-shadow and ring utilities, outline, filters `.blur` `.grayscale` `.invert`
  `.sepia` (L5666-5698, generic Tailwind utilities; whether any is put on a board is a JS question, not answerable from CSS),
  backdrop-blur, transitions/durations/easing, select-none, arbitrary custom-prop classes (toast stacking --ty/--ts), start of
  @media (hover:hover) group-hover variants. Viewer chrome; no ShopView content.
- **6214-7713** (read): Tailwind state variants: group-hover / group-focus-visible / group-data-[checked|indeterminate|panel-open]
  (checkbox, radio, accordion, split button), peer variants, ::selection colours, placeholders, ::before/::after utilities
  (incl. `after:content-['×']` L6764, a close glyph), first/last child, focus-within, @media(hover:hover) hover variants (hover
  lift -1px, hover scale 1.15), focus/focus-visible rings, active, disabled opacities, has-[], aria-* and data-[...] state
  variants (popup sides, starting/ending styles), motion-safe/motion-reduce, max-[599px] and max-md (<48rem) responsive
  variants (sheet layout), sm/md, @container queries, rtl, start of `dark:` variants keyed on [data-theme="dark"] (L7689+).
  Viewer chrome interaction states; nothing applies to board content; no ShopView content.
- **7714-9213** (read): rest of `dark:` variants ([data-theme="dark"]); forced-colors; pointer-coarse (touch) sizing;
  data-density compact/comfortable variants; om-max-700 / om-coarse; arbitrary descendant variants: ProseMirror rich-text editor
  styling (inline code colours, links #184e95 / dark #9fc5f4, lists, empty-editor placeholder) used by the viewer's own text
  entry (composer/comment box), sticky table headers, row hover/selected states; `.cds-root` component layer: font smoothing,
  card/button press "squish" animations, MessageActions reveal on hover (chat message actions), cds-input search/resizer
  (decoded resize-grip SVG at L8999), touch text-entry 16px floor, keyframes cds-dot-pulse/shimmer/reveal/fade/scale-fade,
  @property --cds-badge-x-wght, @layer cds-card, :root CDS tokens (system font stacks L9160-9168, weights 400/500/580/600,
  brand colours clay #d97757 etc.), [data-mode="dark"] and prefers-color-scheme pictogram colours, start of .cds-root sizing
  tokens. Chat/editor chrome; nothing applies to boards; no ShopView content.
- **9214-10013** (read): .cds-root token block: spacing/radius, borders, git-status colours, shadows, focus ring, fonts
  `--cds-font-sans: var(--font-anthropic-sans, system)`, `--cds-font-mono: var(--font-anthropic-mono,"SF Mono")...`,
  `--cds-font-voice: var(--font-anthropic-serif, ui-serif)...` (L9328-9338; the --font-anthropic-* variables are NOT defined
  anywhere in this CSS, so chrome falls back to system fonts unless the JS sets them), easing/durations, full colour ramps
  gray/red/orange/yellow/green/aqua/blue/violet/magenta 0-900, neutral/alpha/surface/fill/bg/text tokens, type scale
  (caption 11px ... title 20px), chart categorical/sequential/diverging/status colours (L9951-9982; viewer's own chart
  palette, not the board's), z-indexes, avatar/checkbox/switch/tooltip tokens; start of dark-mode .cds-root override block
  ([data-mode="dark"]). Chrome only; no ShopView content.
- **10014-10913** (read): .cds-root dark-mode token overrides ([data-mode="dark"] and @media prefers-color-scheme:dark for
  data-mode="system" or no data-mode; L10010-10311) - NOTE the CDS component layer follows the OS dark setting when no
  data-mode is set, separate from the om- palette's data-theme switch; data-font="system"; data-platform="desktop" cursor
  default; data-density="comfortable" sizing; min-resolution 2x hairline 0.5px; data-step 1-5 and data-size xs/sm/lg sizing
  scales; color-scheme per mode; @property + keyframes for scroll fades; @layer base (border colour, interactive cursor,
  ::selection), @layer components (cds-input reset, cds-text-link), start of @layer utilities dark font-variation weights.
  Chrome only; nothing applies to boards; no ShopView content.
- **10914-11864** (read): end of @layer utilities (dark/system font-variation weights, "opsz" var(--font-opsz,16));
  :root `--t-*` palette (L10994-11040; color-scheme light dark; accent #d97757, blue #2a78d6, named tints orchid/fig/coral/
  poppy/matcha/olive/cactus/mineral/cloud/sky/heather/plum/pencil); @media prefers-color-scheme:dark --t-* overrides
  (L11041-11070) and explicit :root[data-theme="light"|"dark"] overrides (L11071-11126); pp- tokens to --t-*.
  FOUND: `.mc-tabbar` top tab bar 48px high (58px on touch) with tabs `.mc-tabbar-tab` max-width 220px, white-space nowrap,
  label span `text-overflow: ellipsis; overflow: hidden` (L11136-11186) -> a tab label longer than ~220px is cut with "..." in
  the viewer; selected tab weight 600 + wash face; below 32rem the tab strip scrolls horizontally with hidden scrollbar
  (L11221-11236). `.tb-*` toolbar container queries: `.tb-label` hidden below 37.5rem (L11246-11249), `.tb-status-text` hidden
  below 26rem (L11268-11271), pinned vs scrolling toolbar parts at 56rem/67rem; `.mc-compact-draw` references a font named
  "mc-anthropicons" via inline style (L11250); `.tb-sync-dot` save-state dot with data-sync = error / pending / loading
  (L11308-11360); `.mc-shimmer` loading skeleton, `.mc-spinner`; `.mc-peer-cursors` live collaborator cursors with name label
  max-width 16ch ellipsis (L11410-11452); cds-root resets; keyframes om-pulse / om-presence-pulse / om-spark-pulse / om-fade-in /
  om-scale-in / om-spin; @property --tw-* registrations; keyframes spin/pulse; start of @font-face Anthropicons-Variable.
  No ShopView content.
- **11865** (decoded by script; non-base64 part `src: url(data:font/woff2;base64,...)`) Anthropicons RVRN variable icon font.
- **11866-11960** (read): end of @font-face Anthropicons-Variable (format woff2-variations, weight 400-700, font-display block);
  toast rise/sink animations; `.om-dc-select` chevron (decoded SVGs L11897 light, L11900 dark); `.om-dc-slider` thumbs;
  number-input spinner removal; `.om-dc-caret` blinking caret; `.om-dc-ideas` fade-in. Design-canvas ("dc") property-panel
  controls; nothing about board rendering; no ShopView content.

## Script cross-check after reading (base64 masked)
- ShopView / feature terms (shopview, sales rep, representative, unassigned, labor, parts, part sales, sales type, becky,
  devon, elliot, invoice, work order, customer, technician, report, commission): 0 hits. "split": 6 hits, all split-button UI
  (L6393-6394 group/split, L6653-6663 --cds-split-caret-tuck).
- URLs: only http://www.w3.org/2000/svg (SVG namespace) and https://tailwindcss.com (licence banner L1041).
- No image-rendering, zoom, line-clamp or mix-blend rule anywhere in the file.

READING COMPLETE: lines 1-11,960, 100%.
