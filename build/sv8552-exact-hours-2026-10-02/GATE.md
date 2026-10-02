# Pre-post bite-proof gate — SV-8552 revision 2 (Standing Rule 72)

Run 2 October 2026, immediately before preparing the Jira comment.

| # | Check | Result |
|---|---|---|
| 1 | **Build marker re-read live** | `v26.40.2-b57d7c7`, last-modified Fri, 02 Oct 2026 07:49:51 GMT, etag `69a4a9ecfb83cd23d6fe39475f164032` — **identical to the start-of-pass read, and `index.html` sha256 `a3d0e1cb23c0778462…` byte-identical**, so nothing redeployed under the run |
| 2 | **Which handoff is in force** | the uploaded handoff is **revision 2**, which its own header states (*"revision 2: PM changes from Jira comment 77735"*) and whose QA-site build matches the branch; corroborated by Dipesh's comment 77770 naming the same build |
| 3 | **Ticket re-read live** | SV-8552 — Bug, **Medium**, status **Code Review**, 12 comments, latest Dipesh 77770 (2 Oct 02:59); nothing new since testing began |
| 4 | **Every figure traces to a live measurement this pass** | every window, px/h and scrollLeft in RESULTS.md was read from the running build in this run; the predicted values are computed from the same readings and stated alongside them |
| 5 | **Named test data confirmed live** | the ZZAUTOTEST events and shifts were created this pass and read back from `GET /api/schedule/board`; the pre-existing *Jarod off* event and the S2-9379 shift were read from the same source |
| 6 | **The BEFORE half is a real capture of the real old build** | the Wednesday panel in exhibit 1 is our own 1 October capture of `v26.39.2-ad6deec` at the same viewport with the same saved hours — not a reconstruction, not a simulation |
| 7 | **Exhibits** | 3 built, annotated on the pixels at coordinates read from the live DOM in the same page state as each screenshot, each labelled with environment, build and date; gutter captions re-checked after a first build clipped two of them |
| 8 | **A near-miss caught before it was written down** | resizing to 700 px showed today opening at 8:49 AM, which looked like a departure from the documented fallback. Loading **fresh** at 700 px gave 5:28 AM with the clock at 6:04 AM — the fallback is correct, and the resize path is the separate re-fit requirement. No false regression reported (Standing Rule 75) |
| 9 | **Human voice / no AI fingerprint** | reader-facing text scanned — no model name, no AI self-reference, no attribution footer |
| 10 | **Format** | verdict is the first line; **no "Technical details for developers" section** — the QA lead has not been asked for one on this ticket (Standing Rule 84) |
| 11 | **Environment restored** | department filter re-shown, Friday's hours back to 9:00 AM – 5:00 PM (confirmed by the window returning to 9 AM – 5 PM), location switched back to Staging Heavy Duty - 9919 |

Outcome: clear.
