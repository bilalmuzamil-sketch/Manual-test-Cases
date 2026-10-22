# Reading notes — part JS-A (appifact-app.pretty.js lines 1-45,400), started 22 Oct 2026

File: appifact-app.pretty.js (3,110,193 bytes, 90,786 lines). Range 1-45,400, read with the Read tool in chunks of at most
1,500 lines, in order. Long line 12761 (25,902 chars, colour token JSON) read by script split. No embedded font in this range
(the only `data:font` is at line 53546, part JS-B).

| Range | What the code does | Findings |
|---|---|---|
| 1-1500 | L1-7 sets `<html data-theme>` from the viewer's OS `prefers-color-scheme` (dark/light) if not already set; L8-53 esbuild module helpers; L54-326 React scheduler; L331-795 React 19.2.7 core; L800-987 react-dom shared; L988+ react-dom client (fibre helpers, component stack, lanes) | F1: viewer chrome theme follows the viewer's OS dark/light setting (L1-7). No ShopView content. |
| 1501-3000 | react-dom client internals: lanes/priorities, fibre/DOM keys, attribute/property setters, controlled inputs, style setter, SVG attribute map, javascript: URL blocking, synthetic events (mouse/key/pointer/wheel/touch), composition/input/select events, animation/transition event names | Nothing that matters (generic React library). |
| 3001-4500 | react-dom reconciler: update queues, fibre creation, hydration checks, context propagation, thenable/suspense handling, child reconciliation, class update queue, hooks dispatcher setup | Nothing that matters (generic React library). |
| 4501-6000 | react-dom hooks implementation (useState/useReducer/useSyncExternalStore/useActionState/useOptimistic/useId etc.), class component updater, error capture/boundaries, beginWork for forwardRef/memo/offscreen/activity | Nothing that matters (generic React library). |
