# Paused 10 Oct 2026 on the QA lead's instruction ("Save this state for now and ask me later to resume it")

Where things stand:
- Setup-to-doc work is done: 454 cases changed (Dashboard 68, Part Lifecycle 252, Retire OR retest 8, five FM/DVI suites 126).
- Display checks: 233 of 389 checked, all OK, 0 failures. 156 left, listed in rc-a-rest.txt, rc-b-rest.txt, rc-c-rest.txt.
- Part Lifecycle update against Chris's changed PRD: on hold ("Wait", 9 Oct).

To resume the display checks (only after the QA lead says so):
  rm build/setup-to-doc-2026-10-09/STOP-CHECKPOINT
  for x in a b c; do nohup bash build/setup-to-doc-2026-10-09/render_check.sh build/setup-to-doc-2026-10-09/rc-$x-rest.txt build/setup-to-doc-2026-10-09/render-$x.log >/dev/null 2>&1 & done
