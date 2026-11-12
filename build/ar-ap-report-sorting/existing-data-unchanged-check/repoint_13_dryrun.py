"""DRY RUN (no TestRail writes): re-point the 13 cases of section 133628 from production/release timing to staging.
Reads the before-images saved by the read pass (repoint-13-before-images/C<id>.json), applies Tier A (timing phrases
only, outside the quoted-source block and the AUTOMATION marker) and proposes Tier B (one added precondition naming the
staging snapshot and records). Writes repoint-13-proposed/C<id>.json and REPOINT-13-CASES-DRYRUN.md."""
import json, os, re, html
HERE = os.path.dirname(os.path.abspath(__file__))
BI, PR = f'{HERE}/repoint-13-before-images', f'{HERE}/repoint-13-proposed'
os.makedirs(PR, exist_ok=True)
IDS = [715471, 715472, 715475, 715617, 715618, 715476, 715480, 715582, 715583, 715619, 715620, 715584, 1062590]
GH = 'https://github.com/bilalmuzamil-sketch/Manual-test-Cases/tree/claude/global-search-v1-baseline-6ax9ul/build/ar-ap-report-sorting/existing-data-unchanged-check/'
SNAP = GH + 'staging-before-feature-captured-2026-11-12'
PROD = GH + 'production-before-release-captured-2026-11-10'
ST = 'the feature was deployed on staging'
BODY = [  # Tier A, body fields: (old, new) — longest first
    ('before the release was installed', 'before ' + ST),
    ('After the release is installed', 'After the feature is deployed on staging'),
    ('as-of date before the release', 'as-of date before ' + ST),
    ('dated a day before the release', 'dated before ' + ST),
    ('taken before the release', 'taken before ' + ST),
    ('saved before the release', 'saved before ' + ST),
    ('noted before the release', 'noted before ' + ST),
    ('as before the release', 'as before ' + ST),
]
TITLE = [('On release day an untouched', 'After the staging deploy an untouched'),
         ('saved before the release', 'saved before the staging deploy'),
         ('as before the release', 'as before the staging deploy')]
# Tier B: one added precondition per case (proposal; see the dry-run file for why it needs a yes)
LINK = lambda sub, label: f'<a href="{SNAP}/{sub}">{label}</a>'
PRODLINE = f' The production snapshot of 10 Nov 2026 (<a href="{PROD}">production before the release</a>) is kept for the short check on production after the release.'
B = {
 715471: f'On staging this was done on 12 Nov 2026, before {ST}, for as of <strong>12 Nov 2026</strong>: {LINK("1-six-reports", "the screenshots, prints and every row")}. Choose 12 Nov 2026 as the as-of date.',
 715472: f'On staging this was done on 12 Nov 2026, before {ST}, for as of <strong>12 Nov 2026</strong>: {LINK("1-six-reports", "the screenshots and every row")}. Choose 12 Nov 2026 as the as-of date.',
 715475: f'On staging the saved files and links are in {LINK("3-files-and-links", "files and links")}. With only Staging Heavy Duty - 9919 ticked, the PDF already failed before {ST} ("This report is too large to export. Narrow the date range or filters, then try again."), so compare the files saved with <strong>only DVI Test</strong> ticked, and open the link saved with it. Set the as-of date to 12 Nov 2026.',
 715617: f'On staging the saved files and link are in {LINK("3-files-and-links", "files and links")}: <strong>Staging Heavy Duty - 9919</strong> ticked, date range "This month" (November 2026). Set the same date range.',
 715618: f'On staging the saved files and link are in {LINK("3-files-and-links", "files and links")}: <strong>Staging Heavy Duty - 9919</strong> ticked, as of 12 Nov 2026. Set the as-of date to 12 Nov 2026.',
 715476: f'On staging the message noted before {ST} is in {LINK("4-export-failure", "export failure")}.',
 715480: f'On staging your current location is <strong>Staging Heavy Duty - 9919</strong> and location B is <strong>Staging Lethbridge - 4310</strong>; the screenshot is in {LINK("5-location-switcher", "location switcher")}.',
 715582: f'On staging customer A is <strong>Mobile Truck &amp; Trailer Repair Island Lake</strong> and vendor A is <strong>123 Cannabis Forestlawn</strong>; the saved addresses are in {LINK("6-drill-down-links", "drill-down links")}.',
 715583: f'On staging location A is <strong>Staging Heavy Duty - 9919</strong> and location B is <strong>Staging Lethbridge - 4310</strong>; what was noted is in {LINK("7-location-filter-memory", "location filter memory")}.',
 715619: f'On staging location A is <strong>Staging Heavy Duty - 9919</strong> and location B is <strong>Staging Lethbridge - 4310</strong>; what was noted is in {LINK("7-location-filter-memory", "location filter memory")}.',
 715620: f'On staging location A is <strong>Staging Heavy Duty - 9919</strong> and location B is <strong>Staging Lethbridge - 4310</strong>; what was noted is in {LINK("7-location-filter-memory", "location filter memory")}.',
 715584: f'On staging what was noted is in {LINK("8-sbc-filter-menus", "Sales By Customer filter menus")}.',
 1062590: f'On staging the customer is <strong>ZZAUTOTEST SV11315 Staging CM</strong>. Before 14 Nov 2026 use credit memo <strong>CM2-4541</strong> ($3.00) with date A = <strong>12 Nov 2026</strong>. From 14 Nov 2026 you may also use <strong>CM2-4540</strong> ($5.00) with date A = <strong>14 Nov 2026</strong> (the date picker offers no day after today). Both were in "1-30 days past due" before {ST}: {LINK("2-credit-memo", "credit memo")}.',
}
def split_protected(exp):
    """Everything from the quoted-source heading on, and the AUTOMATION line, is never edited."""
    i = exp.find('<p><strong>Exact quotes from the source')
    head, tail = (exp[:i], exp[i:]) if i >= 0 else (exp, '')
    m = re.search(r'<p>AUTOMATION:[^<]*</p>', head)
    if m: head, tail = head[:m.start()], head[m.start():] + tail
    return head, tail
def apply(text, pairs):
    out, changes = text, []
    for old, new in pairs:
        for m in re.finditer(re.escape(old), out): changes.append((old, new))
        out = out.replace(old, new)
    return out, changes
plain = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()
md = ['# Re-point the 13 "existing data stays the same" cases to staging — DRY RUN (nothing written)', '',
      'Generated by `repoint_13_dryrun.py` from the live case bodies read 12 Nov 2026 (before-images: `repoint-13-before-images/`). Proposed bodies: `repoint-13-proposed/`. **No TestRail write has been made.**', '']
summ = []
for i in IDS:
    c = json.load(open(f'{BI}/C{i}.json'))
    p = dict(c)
    p['title'], tch = apply(c['title'], TITLE)
    p['custom_preconds'], pch = apply(c['custom_preconds'], BODY)
    p['custom_steps'], sch = apply(c['custom_steps'], BODY)
    head, tail = split_protected(c['custom_expected'])
    head2, ech = apply(head, BODY)
    p['custom_expected'] = head2 + tail
    pb = p['custom_preconds'].rsplit('</ul>', 1)
    p_b = pb[0] + f'<li>{B[i]}{PRODLINE}</li></ul>' + (pb[1] if len(pb) > 1 else '')
    p['custom_preconds_tierB'] = p_b
    json.dump(p, open(f'{PR}/C{i}.json', 'w'), indent=1, ensure_ascii=False)
    assert tail == split_protected(c['custom_expected'])[1]
    left = [m.group(0) for f in ('title', 'custom_preconds', 'custom_steps', 'custom_expected') for m in re.finditer(r'[^.<>]{0,40}\brelease\b[^.<>]{0,30}', p[f])]
    left_head = [m.group(0).strip() for m in re.finditer(r'[^.<>]{0,40}\brelease\b[^.<>]{0,30}', head2)]
    md += [f'## C{i} — https://shopview.testrail.io/index.php?/cases/view/{i}', '',
           f'Automation status: `custom_atmstatus={c.get("custom_atmstatus")}` (= "Not Automated"), created_by {c.get("created_by")}, section {c["section_id"]}, last updated {c["updated_on"]} (Unix).', '']
    if c['title'] != p['title']: md += [f'- **Title:** "{c["title"]}" → "{p["title"]}" ({len(p["title"])} characters)']
    for fld, ch in (('Preconditions', pch), ('Steps', sch), ('Expected (our wording only)', ech)):
        for old, new in ch: md.append(f'- **{fld}:** "…{old}…" → "…{new}…"')
    md += [f'- **Tier B — added precondition (needs a yes):** "{plain(B[i] + PRODLINE)}"',
           f'- **Left unchanged on purpose** ({len(left_head)} in our own wording, plus every quoted source sentence and the AUTOMATION line): ' + ('; '.join(f'"{x}"' for x in left_head) if left_head else 'none'), '']
    summ.append((i, len(tch) + len(pch) + len(sch) + len(ech)))
open(os.environ.get('DRYRUN_BODY', '/tmp/repoint-body.md'), 'w').write('\n'.join(md) + '\n')
print(summ)
