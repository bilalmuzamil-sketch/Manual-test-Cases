"""Design-library rules that apply to the Internal Work Orders screens, from the full line-by-line read of _ds_bundle.js
(render/ds-bundle-reading-notes.md, 20 chunks, lines 1-12,181). Each sentence is copied word for word from the bundle (checked by
check() below and by tools/build_all.py). Rule 126: design-library always/never sentences, default labels, empty states and
toast/badge/chip conventions are in scope. Class: COVERED (design case), SPEC-CONFLICT (register row), OUT-OF-SCOPE (reason)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
BUNDLE = os.path.join(os.path.dirname(HERE), 'files', 'project', '_ds', 'shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037', '_ds_bundle.js')

# (id, source file, bundle lines, the library's own words, class, codes / register, what it means for Internal Work Orders)
LIB = [
 ('L01', 'columns-dropdown.jsx', '442-446', 'label: "Total price",', 'SPEC-CONFLICT', ['IWO-D55', 'DC-25'],
  'the list column is "Total price" (lower-case p) and is always last; the PRD writes "Total Price"; the case uses the screen label'),
 ('L02', 'badge.jsx', '280-290', '"Complete": "success",', 'COVERED', ['DC-29', 'DC-45'],
  'no "Closed" status exists in either status map, so the new Closed status renders in the neutral tone (grey), as the boards draw it'),
 ('L03', 'components/sv-components.jsx', '948-950', 'They are NOT interchangeable', 'COVERED', ['DC-29', 'DC-82'],
  'work-order and finance status vocabularies differ; Closed sits in the work-order list (All tab) and on the hub Sales Invoices page'),
 ('L04', 'components/sv-components.jsx', '690-691', 'Now it warns once per name, so a typo or a glyph that was never vendored shows up the first time it renders.', 'SPEC-CONFLICT', ['IWO-D38', 'DC-66', 'DC-69'],
  'the line-menu icons "badge-dollar-sign" and "pencil-line" are not in the vendored set (lucide-icons.js), so the boards show an empty slot'),
 ('L05', 'components/sv-components.jsx', '703', 'do not ship an empty box.', 'SPEC-CONFLICT', ['IWO-D38', 'DC-66', 'DC-69'],
  'Mark as No Charge, Change category and Mark as Billable must carry real icons, like the other menu rows'),
 ('L06', 'components/sv-components.jsx', '836-838', 'Checked state is a TINTED fill with an accent glyph', 'COVERED', ['DC-13', 'DC-23', 'DC-71'],
  'the Internal customer, No Charge and Requires the original work order checkboxes, when ticked'),
 ('L07', 'components/sv-components.jsx', '1013-1015', 'Counts render as parenthesised text, matching the spec. They are not pills.', 'COVERED', ['DC-31'],
  'work order tabs "Lines (2)", "Parts (4)" keep their counts in brackets'),
 ('L08', 'components/sv-components.jsx', '1063', "empty = 'Nothing to show.',", 'COVERED', ['DC-28', 'DC-74'],
  'a table with no rows shows a text-only empty state (the work orders list uses its own empty state, L13)'),
 ('L09', 'components/sv-components.jsx', '1134-1141', "if (e.key === 'Escape') onClose();", 'SPEC-CONFLICT', ['IWO-D53', 'DC-86'],
  'the library Modal closes on Esc and on a click on the scrim; the PRD says Esc and a click outside do nothing in every dialog of the app'),
 ('L10', 'components/sv-components.jsx', '1342-1346', '"aria-label": "Dismiss"', 'SPEC-CONFLICT', ['IWO-D28', 'DC-44', 'DC-45'],
  'an alert or toast that can be dismissed carries an X; the PRD error toasts "must be dismissed", the boards draw them without the X'),
 ('L11', 'components/sv-components.jsx', '1668-1670', 'className: "sv-facts__empty"', 'COVERED', ['DC-83'],
  'an empty value in a key/value block (AccountingHub record) shows a dash'),
 ('L12', 'components/sv-components.jsx', '1706-1707', 'Never both.', 'COVERED', ['DC-25', 'DC-06'],
  'a list screen with tabs has no visible page title; the categories page (no list layout) shows its title "Internal Work Orders"'),
 ('L13', 'filter-bar.jsx', '3948', 'No work orders match these filters', 'COVERED', ['DC-28'],
  'the work orders list filtered by Classification with no match shows "No work orders match these filters" and "Try removing a filter to widen your results."'),
 ('L14', 'filter-chip.jsx', '5142-5148', 'Selected: bg #D8ECFF (primary-100), text + icon #257CFF (primary-500), chevron shown', 'COVERED', ['DC-26', 'DC-27', 'DC-73'],
  'the Classification chip and the Technician Efficiency chip with a value: "Label: value" in blue on light blue'),
 ('L15', 'filter-dropdown.jsx', '5727', 'Single-select list — checkmark on the selected row, no checkboxes (Asset on site)', 'COVERED', ['DC-26', 'DC-73'],
  'the single-choice Classification and Internal work orders lists mark the picked value with a checkmark'),
 ('L16', 'index.js', '7280', "'skeleton / loading': 'No loading state anywhere in the system, including buttons.',", 'SPEC-CONFLICT', ['IWO-D54'],
  'the PRD asks for a spinner on the confirming button while an action runs; the library has no loading state and no board draws one'),
 ('L17', 'index.js', '7281', "'empty state illustration': 'By design — Shopview empty states are text only.',", 'COVERED', ['DC-28'],
  'empty states (filtered list, report with no rows) are text only, no picture'),
 ('L18', 'index.js', '7276', "'pagination': 'Not designed. Tables in the product scroll.',", 'COVERED', ['DC-74', 'DC-75'],
  'the Internal Work Orders report table scrolls; no pages'),
 ('L19', 'mobile-filters.jsx', '7544-7564', 'label: "Asset on site",', 'OUT-OF-SCOPE', ['IWO-N19 (S2-R14 mobile filter sheet)'],
  'the library mobile filter sheet has no Classification row yet; the design draws no mobile filter sheet; the PRD-following case is the case worker\'s'),
 ('L20', 'tokens.js', '1845-1846', "inverse: 'var(--sv-surface-inverse)',", 'COVERED', ['DC-20', 'DC-21', 'DC-73'],
  'tooltips are a dark bubble with light text (Internal badge tooltip, No Charge tooltip, chip tooltip)'),
 ('L21', 'work-orders.jsx', '10019-10024', "completed: ['Complete', 'Invoiced', 'Paid']", 'COVERED', ['DC-29'],
  'the Completed tab holds Complete, Invoiced and Paid; a closed internal work order shows on the All tab with Status Closed'),
 ('L22', 'work-orders.jsx', '10375', 'Nothing. Always this, never an empty cell or a bare hyphen in text.', 'SPEC-CONFLICT', ['IWO-D44', 'DV-05'],
  'empty report cells should show the dash; the design leaves them blank (question 11)'),
 ('L23', 'work-orders.jsx', '10399', 'A cell that navigates. A link, not a button — buttons do things.', 'COVERED', ['DC-74', 'DC-62'],
  'Work order and Original work order in the report, and the original work order on the NO CHARGE document, are links'),
 ('L24', 'work-orders.jsx', '10479-10480', 'A count that needs a person. The only amber in the row, because it is the one thing in it asking for action.', 'SPEC-CONFLICT', ['IWO-D15', 'DC-25'],
  'amber in a list row is kept for the one thing asking for action; the design draws the Internal (and No Charge) badge amber. The PRD settles only "a different style from Internal" (IWO-D15); the colour is not asked'),
 ('L25', 'work-orders.jsx', '11538-11541', "const badgeSize = large ? 'md' : 'sm';", 'COVERED', ['DC-25'],
  'at the default row height (48) list badges are the small size (10px), as drawn; the Small and Large row heights are not drawn (DESIGN-SILENT)'),
 ('L26', 'work-orders.jsx', '11662', "w: c.key === 'onsite' ? 56 : c.key === 'status' ? 120 : undefined", 'COVERED', ['DC-25'],
  'the Status column is 120 px; with the status and the Internal / No Charge badge in it (S2-R10) nothing may wrap or overlap at 1440 and 1536'),
 ('L28', 'components.css', '255-259', 'Spec: preview/tabs.html — pill only, 32px, radius 6.', 'COVERED', ['DC-06', 'DC-07'],
  'the Internal categories / No Charge categories tabs are pills, the selected one grey, as drawn'),
 ('L29', 'components.css', '51', '.sv-btn--primary:disabled { opacity: 0.4; }', 'COVERED', ['DC-02', 'DC-35', 'DC-61'],
  'a disabled blue button (Save with nothing picked, Close Work Order before an original is picked) is the same blue at 40% opacity'),
 ('L30', 'components.css', '233', '.sv-badge--warning { background: var(--sv-warning-fill); border-color: var(--sv-warning-border); color: var(--sv-warning-text); }', 'SPEC-CONFLICT', ['IWO-D15', 'DC-25', 'DC-55'],
  'the boards draw both the Internal and the No Charge badge in exactly this warning tone (fill #FFFAEB, text #B54708); the PRD asks for No Charge "a different style from Internal"'),
 ('L31', 'components.css', '236', '.sv-badge--neutral { background: var(--sv-surface-sunken); border-color: var(--sv-border-strong); color: var(--sv-text-primary); }', 'COVERED', ['DC-29', 'DC-45', 'DC-62'],
  'the Closed status and the INTERNAL / NO CHARGE stamps are neutral grey (fill #EEF2F6)'),
 ('L27', 'design-canvas.jsx / tweaks-panel.jsx / ai-agent-icon.js / theme-toggle.js', '11-230, 2064-3480, 9217-9980', 'They are Claude Design artboard scaffolding', 'OUT-OF-SCOPE', [],
  'designer tooling and the dark-theme switch: no Internal Work Orders board uses them (the design draws light theme only)'),
]

def check():
    import re
    d = os.path.dirname(BUNDLE)
    b = re.sub(r'\s+', ' ', open(BUNDLE, encoding='utf-8').read())  # a sentence that wraps over two comment lines
    css = re.sub(r'\s+', ' ', open(os.path.join(d, 'components.css'), encoding='utf-8').read() + open(os.path.join(d, 'colors_and_type.css'), encoding='utf-8').read())
    return [r[0] for r in LIB if re.sub(r'\s+', ' ', r[3]) not in (css if r[1].endswith('.css') else b)]

if __name__ == '__main__':
    bad = check(); print(len(LIB), 'rules;', 'missing in bundle:', bad)
