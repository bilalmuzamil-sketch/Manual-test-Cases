"""Did Address 2 actually save? Without that, the masthead comparison proves nothing."""
import sys, json, re, os, importlib, time
sys.path.insert(0, '/tmp/claude-0/wk')
from playwright.sync_api import sync_playwright
from browse import launch
import sv, doc

LOC = 'Staging Heavy Duty - 9919'
WO = '0fc91f4d-86f0-4e98-af2e-5a6177eec850'
ADDR2 = 'Suite 240 ZZAUTOTEST'


def stored():
    s, d = sv.call('/api/workplaces')
    rows = d['data'] if isinstance(d.get('data'), list) else d['data'].get('collection')
    w = [x for x in rows if LOC in str(x.get('name', ''))][0]
    return w.get('address_2')


def meta():
    for _ in range(3):
        st, h = doc.render(WO, 'html')
        if isinstance(h, str) and len(h) > 5000:
            break
        time.sleep(2)
    i = h.find('<div class="shop-meta">'); j = h.find('<div class="mh-logo">', i)
    return [re.sub(r'<[^>]+>', '', d).strip()
            for d in re.findall(r'<div>(.*?)</div>', h[i:j], re.S)]


def edit(pg, value):
    pg.goto('https://app.staging.shopview.com/administration/locations',
            wait_until='domcontentloaded', timeout=60000)
    pg.wait_for_timeout(7000)
    # the row is opened by the pencil (edit_note) at the end of it, not by the name
    opened = pg.evaluate("""(loc) => {
      for (const tr of document.querySelectorAll('tr')) {
        if (!(tr.innerText||'').includes(loc)) continue;
        const btn = [...tr.querySelectorAll('button')]
          .find(b => (b.innerText||'').includes('edit_note'));
        if (btn) { btn.click(); return true; }
      }
      return false; }""", LOC)
    print('   edit pencil clicked:', opened)
    pg.wait_for_timeout(5000)
    filled = pg.evaluate("""(v) => {
      for (const f of document.querySelectorAll('.q-field')) {
        if (!/^Address 2/i.test((f.innerText||'').trim())) continue;
        const i = f.querySelector('input'); if (!i) continue;
        const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
        set.call(i, v);
        i.dispatchEvent(new Event('input',{bubbles:true}));
        i.dispatchEvent(new Event('change',{bubbles:true}));
        i.dispatchEvent(new Event('blur',{bubbles:true}));
        return i.value;
      }
      return null; }""", value)
    print(f'   field now reads {filled!r}')
    btns = pg.evaluate("""() => [...document.querySelectorAll('.q-dialog button, button')]
        .map(x=>(x.innerText||'').trim()).filter(Boolean).slice(0,25)""")
    print('   buttons on the dialog:', btns)
    for lbl in ('Save & Close', 'Save and Close', 'Save', 'Update'):
        loc = pg.get_by_role('button', name=lbl, exact=False)
        if loc.count() and loc.first.is_visible():
            loc.first.click(); print('   clicked', lbl); break
    pg.wait_for_timeout(6000)


with sync_playwright() as p:
    b, ctx = launch(p, viewport={'width': 1600, 'height': 1200}, fresh=True)
    pg = ctx.new_page()
    pg.goto('https://app.staging.shopview.com/login', wait_until='domcontentloaded', timeout=60000)
    pg.wait_for_timeout(4000)
    pg.get_by_role('button', name='Admin', exact=False).first.click()
    pg.wait_for_timeout(9000)
    keep = {c['name']: c['value'] for c in ctx.cookies()
            if c['name'] in ('sv_sso_session', 'PHPSESSID', 'cf_clearance')}
    open('/tmp/qa-cookies/staging-cookie-header.txt', 'w').write(
        '; '.join('%s=%s' % kv for kv in keep.items()))
    os.chmod('/tmp/qa-cookies/staging-cookie-header.txt', 0o600)
    importlib.reload(sv); importlib.reload(doc)

    print('BEFORE   stored address_2 =', repr(stored()), '| masthead', meta())
    print('SET Address 2')
    edit(pg, ADDR2)
    after = stored()
    print('AFTER    stored address_2 =', repr(after), '| masthead', meta())
    print()
    if after == ADDR2:
        print('>>> Address 2 SAVED. The masthead above is the honest answer.')
    else:
        print('>>> Address 2 DID NOT SAVE - the comparison proves nothing yet.')
    print('CLEARING again')
    edit(pg, '')
    print('RESTORED stored address_2 =', repr(stored()), '| masthead', meta())
    b.close()
