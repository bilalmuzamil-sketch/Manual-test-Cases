# SV-10928 — raw IDs flash in place of names (QA, API mode)

Ticket: https://shopview.atlassian.net/browse/SV-10928 · status TESTING QA · labels none · QA assignee not set (checked 28 Oct).
Mode: API way (QA lead, 28 Oct). No recording. No technical section.
Branch: https://sv10928.qa.shopview.com · build v26.43.2-b517d96 (index.html last-modified Tue 27 Oct 2026 14:57:30 GMT, etag 82123ac7…).
Production before: app.shopview.com · build v26.43.2-537378f.
PR #3909 (branch SV-10928-raw-ids-flash, head fb94c28) — 115 files; the PR's own test plan is the checklist mirrored below.
Note: the Jira ticket asks for "list the screens fixed in a comment here" — no such Jira comment exists; the list is only in the PR description.

## Method
`scripts/detect.mjs` watches every visible text node, input value, placeholder/aria-label/title on every animation frame
for a UUID and records first/last time seen. `scripts/run.mjs` loads a screen many times: once normally, once per
lookup request with only that request held back 3.5 s (so each lookup is "the last to arrive" in turn), once with the
app-shell group held, once with every request held, and three times on Chrome's Slow 4G preset.

## Results so far
| Screen | Branch | Production |
|---|---|---|
| Work order → Parts tab (Vendor column) | 19 loads, ID never on screen | ID shown on 19 of 21 loads: ~0.35–0.4 s on Slow 4G; 3.4 s when the vendor list (`/api/parts-catalogue/options`) is slow; even ~67 ms on a normal load |
