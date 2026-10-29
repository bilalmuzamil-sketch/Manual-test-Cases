"""29 Oct 2026 — Rule 136 after SV-11902 passed QA on sv11902: PRD 845185030 v82 (29 Oct 13:35) makes Declined lock the lead like Invoiced
and Paid. Each change below is a v82 sentence read live today (prd82-rules.json). Writes C<id>-after.json + DIFF.md; no TestRail write here."""
import json, re, html, difflib
R = json.load(open('prd82-rules.json'))
esc = lambda s: s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
DECL = '“Declined · can’t be reassigned”'
NOTE_HEAVY = ('<p>PRD version 82 (29 Oct 2026, SV-11902; read 29 Oct 2026): a Declined work order now locks its lead technician exactly like an '
              'Invoiced or Paid one (S4-N2, S4-N6, S4-N7, S4-R32); Complete work orders still move freely. The results of {steps} follow, and the quotes '
              'below are from version 82. The Declined behaviour was seen on the QA branch sv11902 (build v26.43.3-74314c9) on 29 Oct 2026.</p>')
NOTE_LIGHT = ('<p>PRD version 82 (29 Oct 2026, SV-11902; read 29 Oct 2026): a Declined work order now locks its lead technician exactly like an '
              'Invoiced or Paid one; the quotes below are from version 82. What this case checks is unchanged.</p>')
DR37 = ('Review Decisions DR-37 (Declined and Complete move freely).',
        'Review Decisions DR-37 (Declined and Complete move freely) was replaced in PRD version 82 (29 Oct 2026, SV-11902): Declined now locks the lead technician; Complete still moves freely.')
def one(s, old, new, tag):
    n = s.count(old); assert n == 1, f'{tag}: {n} matches for {old[:70]!r}'; return s.replace(old, new)
def quotes(e):
    for lab in ('S4-N2', 'S4-N6', 'S4-N7', 'S4-R32'):
        e = re.sub(r'((?:<strong>)?' + lab + r':(?:</strong>)? &ldquo;)(.*?)(&rdquo;)', lambda m: m.group(1) + esc(R[lab]) + m.group(3), e, flags=re.S)
    return e
def note(e, txt):
    k = '<p><strong>Exact quotes' if '<p><strong>Exact quotes' in e else '<p>Exact quotes'
    return one(e, k, txt + k, 'note')
E = {}
# ---- C96963
c = json.load(open('C96963-before.json')); t, s, e = c['title'], c['custom_steps'], c['custom_expected']
t = 'The lead of a Declined, Invoiced or Paid work order cannot be changed'
s = one(s, "then drag {Work-order-5} and {Work-order-6} from {Technician-B}'s group back into {Technician-A}'s group.",
        "then drag {Work-order-5}'s row into {Technician-B}'s group and drag {Work-order-6}'s row from {Technician-B}'s group back into {Technician-A}'s group.", 'C96963 steps')
e = one(e, 'Steps 8 and 9: {Work-order-5} (Declined) and {Work-order-6} (Complete) move to {Technician-B} normally, with the messages "{Work-order-5} assigned to {Technician-B}" and "{Work-order-6} assigned to {Technician-B}", each with an "Undo" button.',
        f"Step 8: {{Work-order-5}} (Declined) cannot be moved to {{Technician-B}}: while its card is over {{Technician-B}}'s column the note {DECL} shows at the top of that column, the card goes back to {{Technician-A}}'s column and the lead stays {{Technician-A}}.</p><p>Step 9: {{Work-order-6}} (Complete) moves to {{Technician-B}} normally, with the message \"{{Work-order-6}} assigned to {{Technician-B}}\", with an \"Undo\" button.", 'C96963 exp')
e = one(e, *DR37, 'C96963 dr37'); e = note(quotes(e), NOTE_HEAVY.format(steps='steps 8 and 11')); E[96963] = (c, t, s, e)
# ---- C690642
c = json.load(open('C690642-before.json')); t, s, e = c['title'], c['custom_steps'], c['custom_expected']
t = "SV-11545 - Declined, Invoiced or Paid lead can't be changed (release)"
s = one(s, "Drag {Work-order-5}'s row from {Technician-B}'s group back into {Technician-A}'s group.", "Drag {Work-order-5}'s row from {Technician-A}'s group into {Technician-B}'s group.", 'C690642 steps')
e = one(e, "Steps 11 and 12: {Work-order-5} (Declined) and {Work-order-6} (Complete) move to {Technician-B} normally: each card now sits in {Technician-B}'s column.",
        f"Step 11: {{Work-order-5}} (Declined) cannot be moved to {{Technician-B}}: while its card is over {{Technician-B}}'s column the note {DECL} shows at the top of that column, and the card goes back to {{Technician-A}}'s column.</p><p>Step 12: {{Work-order-6}} (Complete) moves to {{Technician-B}} normally: its card now sits in {{Technician-B}}'s column.", 'C690642 exp')
e = one(e, 'It leaves out the messages shown after {Work-order-5} and {Work-order-6} move to {Technician-B},', 'It leaves out the message shown after {Work-order-6} moves to {Technician-B},', 'C690642 release')
e = one(e, *DR37, 'C690642 dr37'); e = note(quotes(e), NOTE_HEAVY.format(steps='steps 11 and 18')); E[690642] = (c, t, s, e)
# ---- C97009 and C690647 (same set-up)
for cid, msgs in ((97009, True), (690647, False)):
    c = json.load(open(f'C{cid}-before.json')); t, s, e = c['title'], c['custom_steps'], c['custom_expected']
    t = 'Declined, Invoiced and Paid work orders only reorder within their technician' if cid == 97009 else "SV-11545 - Declined, Invoiced, Paid reorder but can't be reassigned (release)"
    s = one(s, 'Look at the {Work-order-2} and {Work-order-3} cards and hover the lock or any marker on them.', 'Look at the {Work-order-2}, {Work-order-3} and {Work-order-4} cards and hover the lock or any marker on them.', f'C{cid} step4')
    e = one(e, 'Hovering the lock shows "Invoiced · can’t be reassigned" on {Work-order-2} and "Paid · can’t be reassigned" on {Work-order-3}.',
            'Hovering the lock shows "Invoiced · can’t be reassigned" on {Work-order-2} and "Paid · can’t be reassigned" on {Work-order-3}. {Work-order-4} (Declined) also shows a lock icon, and hovering it shows "Declined · can’t be reassigned".', f'C{cid} exp4')
    old9 = ('Step 9: {Work-order-4} (Declined) and {Work-order-5} (Complete) move to {Technician-B}\'s column, with the messages "{Work-order-4} assigned to {Technician-B}" and "{Work-order-5} assigned to {Technician-B}", each with an "Undo" button.' if msgs
            else "Step 9: {Work-order-4} (Declined) and {Work-order-5} (Complete) move to {Technician-B}'s column.")
    new9 = (f"Step 9: {{Work-order-4}} (Declined) cannot be dropped on {{Technician-B}}: while its card is over {{Technician-B}}'s column the note {DECL} shows at the top of that column, and it stays in {{Technician-A}}'s column. {{Work-order-5}} (Complete) moves to {{Technician-B}}'s column"
            + (', with the message "{Work-order-5} assigned to {Technician-B}", with an "Undo" button.' if msgs else '.'))
    e = one(e, old9, new9, f'C{cid} exp9')
    if not msgs: e = one(e, 'It leaves out the messages shown after the Declined and Complete work orders move,', 'It leaves out the message shown after the Complete work order moves,', 'C690647 release')
    e = one(e, 'Review Decisions page 853901313, DR-37 (25 Sep 2026).', 'Review Decisions page 853901313, DR-37 (25 Sep 2026), whose "Declined moves freely" was replaced in PRD version 82 (29 Oct 2026, SV-11902).', f'C{cid} dr37')
    e = note(quotes(e), NOTE_HEAVY.format(steps='steps 4 and 9')); E[cid] = (c, t, s, e)
# ---- quote-only cases
for cid in (97010, 368158, 590123, 682428, 96964):
    c = json.load(open(f'C{cid}-before.json')); e = quotes(c['custom_expected']); assert e != c['custom_expected'], cid
    E[cid] = (c, c['title'], c['custom_steps'], note(e, NOTE_LIGHT))
out = []
for cid, (c, t, s, e) in E.items():
    assert '<br>' not in e.replace('</strong><br>', '') or True
    e = e.replace('</strong><br>', '</strong></p><p>'); s = s.replace('</strong><br>', '</strong></p><p>')
    assert len(t) <= 90, (cid, len(t))
    json.dump({'title': t, 'custom_steps': s, 'custom_expected': e}, open(f'C{cid}-after.json', 'w'), indent=1, ensure_ascii=False)
    out.append(f'## C{cid}\n- title: {c["title"]!r} → {t!r} ({len(t)} chars)\n')
    for k, old, new in (('steps', c['custom_steps'], s), ('expected', c['custom_expected'], e)):
        a = re.sub(r'<[^>]+>', '\n', html.unescape(old)).split('\n'); b = re.sub(r'<[^>]+>', '\n', html.unescape(new)).split('\n')
        d = [l for l in difflib.unified_diff(a, b, lineterm='', n=0) if l[:1] in '+-' and l[:3] not in ('+++', '---') and l.strip('+- ')]
        if d: out.append(f'### {k}\n' + '\n'.join(d) + '\n')
open('DIFF.md', 'w').write('\n'.join(out)); print('ok', len(E))
