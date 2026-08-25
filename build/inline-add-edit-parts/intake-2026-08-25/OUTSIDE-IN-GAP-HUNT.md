# Outside-in gap hunt — Inline Add and Edit Parts

Deliberate look for gaps a rule-by-rule pass could miss:

1. **View-mode fork fully covered?** Yes — Tech (Areas 02/03) and Full (Areas 04/05) both authored;
   Add Part/Edit routing by mode (IAEP-BTN-03, IAEP-BTN-05).
2. **Keyboard-only completion (a headline goal)?** Covered: focus-on-open (BTN-02), Enter saves
   (TADD-11/FADD-13), Tab order (TADD-12/FADD-15), Shift+Enter More Options (FADD-14), hint legends
   (TADD-17/FADD-18), edit legend variant (TEDIT-03).
3. **Every user-facing message from §8 asserted?** Yes — combined validation, qty>0, numeric/negative
   cost & sell, below-cost note, "Part added", both discard dialogs, leave-without-saving, save-fail,
   not-editable, changed-by-someone-else. Cross-checked against §8 table.
4. **Status/permission negative gating on BOTH controls?** Add Part and Edit each covered for
   Complete/Invoiced/Paid/Declined/Imported (BTN-06/07), missing permission (BTN-08, TEDIT-10,
   FEDIT-04), and other-non-editable (BTN-09).
5. **Requested / needs-details flow?** Tech (TADD-16) and Full (FADD-19); "Create as new part" Full
   only (FADD-20).
6. **One-row-at-a-time + swap semantics?** GUARD-06/07 + S5-E1 (FEDIT-06) + S1-E2 (BTN-10).
7. **Empty vs populated vs unchanged discard branches?** All three: populated (GUARD-01/02),
   empty (GUARD-08/09), unchanged edit (GUARD-10), untouched follow-on row (GUARD-13).
8. **Known open items (build-dependent):** S3-E1 scope (PO-IAEP-1), Imported guard (PO-IAEP-2).

No uncovered gap found beyond the two PO questions above.
