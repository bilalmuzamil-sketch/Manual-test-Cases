"""C44902 — does a shop with NO logo render a clean masthead, or a placeholder?

Organisation: "Logo" (bilal.muzamil+logo@shopview.com), created by the QA lead precisely so the
no-logo state exists. Confirmed no logo: GET /api/organization/organization-details/logo -> data: [].
"""
import sys, json, re, os, importlib, time
sys.path.insert(0, '/tmp/claude-0/wk')
from playwright.sync_api import sync_playwright
from browse import launch

SHOT = '/tmp/claude-0/wk/_c44902'
env = dict(l.strip().split('=', 1) for l in open('/tmp/shopview/logo-org.env') if '=' in l)
OBS = {}


def kill_overlay(pg):
    pg.evaluate("() => document.querySelectorAll('.q-dialog__backdrop').forEach(e => e.remove())")
    pg.wait_for_timeout(500)


with sync_playwright() as p:
    b, ctx = launch(p, viewport={'width': 1600, 'height': 1200}, fresh=True)
    pg = ctx.new_page()
    pg.goto('https://app.staging.shopview.com/login', wait_until='domcontentloaded', timeout=60000)
    pg.wait_for_timeout(4000)
    pg.get_by_label('Email', exact=False).first.fill(env['SV_USER'])
    pg.get_by_label('Password', exact=False).first.fill(env['SV_PASS'])
    pg.get_by_role('button', name='Login', exact=False).first.click()
    pg.wait_for_timeout(11000)
    keep = {c['name']: c['value'] for c in ctx.cookies()
            if c['name'] in ('sv_sso_session', 'PHPSESSID', 'cf_clearance')}
    open('/tmp/qa-cookies/staging-cookie-header.txt', 'w').write(
        '; '.join('%s=%s' % kv for kv in keep.items()))
    os.chmod('/tmp/qa-cookies/staging-cookie-header.txt', 0o600)
    import sv, doc; importlib.reload(sv); importlib.reload(doc)

    st, lg = sv.call('/api/organization/organization-details/logo')
    OBS['logo_endpoint'] = {'status': st, 'data': lg}
    print('logo endpoint ->', st, lg)

    # ---- create a work order
    pg.goto('https://app.staging.shopview.com/workorders', wait_until='domcontentloaded', timeout=60000)
    pg.wait_for_timeout(8000)
    pg.get_by_role('button', name='Create Work Order', exact=False).first.click()
    pg.wait_for_timeout(4000)
    def pick(tid, label):
        pg.evaluate("""(t) => { const e=document.querySelector(`input[data-test-id="${t}"]`);
                                if (e) e.click(); }""", tid)
        pg.wait_for_timeout(2500)
        o = pg.locator('.q-menu .q-item, .q-menu [role=option]')
        n = o.count()
        print(f'  {label} options: {n}')
        if n:
            idx = 0
            for k in range(n):
                if label.lower() in (o.nth(k).inner_text() or '').lower():
                    idx = k; break
            print('   picking:', (o.nth(idx).inner_text() or '').strip()[:50])
            o.nth(idx).click(); pg.wait_for_timeout(2500)
            return True
        pg.keyboard.press('Escape'); pg.wait_for_timeout(700)
        return False

    pick('select_customer_select', 'dsfsafsaf')
    pick('select_company_vehicle_select', 'asset')
    pg.screenshot(path=SHOT + '_3_createwo.png')
    pg.get_by_role('button', name='Save', exact=True).first.click()
    pg.wait_for_timeout(3000)
    for lbl in ('Create', 'Confirm', 'Yes', 'OK'):
        loc = pg.get_by_role('button', name=lbl, exact=True)
        if loc.count() and loc.first.is_visible():
            loc.first.click(); pg.wait_for_timeout(2000); break
    pg.wait_for_timeout(8000)
    print('work order url:', pg.url)
    OBS['wo_url'] = pg.url
    m = re.search(r'/workorders/([0-9a-f-]{36})', pg.url)
    woid = m.group(1) if m else None
    print('work order id:', woid)
    OBS['wo_id'] = woid
    body = pg.inner_text('body')
    num = re.search(r'\b(S\d?-\d{3,6})\b', body)
    OBS['wo_number'] = num.group(1) if num else None
    print('work order number:', OBS['wo_number'])

    # ---- add a line with labour hours (the New Line dialog opens by itself)
    pg.wait_for_timeout(2000)
    d = pg.locator('.q-dialog')
    if d.count() and 'New Line' in (d.first.inner_text() or ''):
        print('  New Line dialog open - filling labour')
        try:
            pg.locator('.q-dialog [data-test-id="select_complaint"]').first.click(timeout=8000)
            pg.wait_for_timeout(2500)
            o = pg.locator('.q-menu .q-item, .q-menu [role=option]')
            print('   complaint options:', o.count())
            if o.count():
                o.first.click(); pg.wait_for_timeout(2000)
            else:
                pg.keyboard.type('ZZAUTOTEST logo check', delay=25); pg.wait_for_timeout(1500)
                pg.keyboard.press('Enter'); pg.wait_for_timeout(1500)
        except Exception as e:
            print('   complaint:', str(e).split('\n')[0][:70])
        for tid, val in (('input_time_estimate', '1'), ('input_tech_time', '1')):
            f = pg.locator(f'input[data-test-id="{tid}"]')
            if f.count():
                try:
                    f.first.fill(val); pg.wait_for_timeout(700)
                    print('   ', tid, '=', val)
                except Exception:
                    pass
        pg.screenshot(path=SHOT + '_4_line.png')
        for lbl in ('Save & Close', 'Save and Close'):
            loc = pg.get_by_role('button', name=lbl, exact=False)
            if loc.count() and loc.first.is_visible():
                try:
                    loc.first.click(timeout=9000); pg.wait_for_timeout(5000)
                    print('   line saved')
                except Exception:
                    print('   Save & Close disabled - continuing without a line')
                break
    kill_overlay(pg)

    # ---- Finance tab
    pg.goto(f'https://app.staging.shopview.com/workorders/{woid}/finance',
            wait_until='domcontentloaded', timeout=60000)
    pg.wait_for_timeout(11000)
    kill_overlay(pg)
    pg.screenshot(path=SHOT + '_5_finance.png', full_page=True)

    # ---- the masthead, read out of the rendered document
    for _ in range(3):
        st, h = doc.render(woid, 'html')
        if isinstance(h, str) and len(h) > 5000:
            break
        time.sleep(3)
    OBS['render_status'] = st
    if isinstance(h, str):
        open('/tmp/claude-0/wk/_c44902_doc.html', 'w').write(h)
        i = h.find('<div class="mh">'); j = h.find('<div class="addr', i)
        mh = h[i:j] if i >= 0 else ''
        OBS['masthead_html'] = re.sub(r'\s+', ' ', mh)[:2500]
        OBS['has_img_tag'] = bool(re.search(r'<img', mh, re.I))
        OBS['mh_logo_block'] = re.sub(r'\s+', ' ',
            (re.search(r'<div class="mh-logo">.*?</div>\s*</div>', mh, re.S).group(0)
             if re.search(r'<div class="mh-logo">', mh) else 'NO mh-logo BLOCK'))[:800]
        for word in ('no logo', 'No Logo', 'placeholder', 'logo'):
            OBS[f'text_{word}'] = word.lower() in mh.lower()
        print('\nmasthead contains <img>:', OBS['has_img_tag'])
        print('mh-logo block:', OBS['mh_logo_block'][:400])

    json.dump(OBS, open('/tmp/claude-0/wk/_c44902_obs.json', 'w'), indent=1)
    print('\n=== OBS ===')
    print(json.dumps({k: v for k, v in OBS.items() if k != 'masthead_html'}, indent=1)[:1800])
    b.close()
