"""C45275 — final execution, with the Change Customer dialog's real controls.

Dialog: change_customer_customer_select / change_customer_contact_select / "Update Customer"
Card:   select_customer_contact / select_authorizer / customer_card_change_action

A = Abode Trucking & Repair (flagged Heather Best, unflagged Hailey Rivera)
B = Ado Truck Center - Oasis (flagged Taylor Lopez, unflagged Brent Miller)
Work order S2-32272.
"""
import sys, json
sys.path.insert(0, '/tmp/claude-0/wk')
from playwright.sync_api import sync_playwright
from boot import admin_page

WO = json.load(open('/tmp/claude-0/wk/_c45275_wo.json'))
SHOT = '/tmp/claude-0/wk/_c45275f'
A, B = 'Abode Trucking & Repair', 'Ado Truck Center - Oasis'
A_FLAG, A_PLAIN = 'Heather Best', 'Hailey Rivera'
B_FLAG, B_PLAIN = 'Taylor Lopez', 'Brent Miller'
OBS = {}


def strip_and_click(pg, tid):
    """Remove blocking overlays and click, atomically. Overlays only - no app state touched."""
    ok = pg.evaluate("""(tid) => {
      document.querySelectorAll('.q-dialog__backdrop').forEach(e => e.remove());
      const el = document.querySelector(`[data-test-id="${tid}"]`);
      if (!el) return false;
      el.click(); return true; }""", tid)
    pg.wait_for_timeout(2000)
    return ok


def kill_newline(pg):
    pg.evaluate("""() => {
      for (const d of document.querySelectorAll('.q-dialog')) {
        if ((d.innerText||'').includes('New Line')) d.remove();
      }
      document.querySelectorAll('.q-dialog__backdrop').forEach(e => e.remove()); }""")
    pg.wait_for_timeout(600)


def menu(pg):
    o = pg.locator('.q-menu .q-item, .q-menu [role=option]')
    return [(o.nth(i).inner_text() or '').replace('check', '').strip() for i in range(o.count())]


def choose(pg, tid, want, typed=True):
    strip_and_click(pg, tid)
    if typed:
        try:
            pg.keyboard.type(want.split()[0], delay=35)
            pg.wait_for_timeout(2600)
        except Exception:
            pass
    else:
        pg.wait_for_timeout(2200)
    o = pg.locator('.q-menu .q-item, .q-menu [role=option]')
    for i in range(o.count()):
        t = (o.nth(i).inner_text() or '').strip()
        if want.lower() in t.lower():
            o.nth(i).click(); pg.wait_for_timeout(2200)
            print(f'   {tid}: picked "{t[:44]}"')
            return True
    print(f'   {tid}: NO MATCH "{want}" among {o.count()}: {menu(pg)[:6]}')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(700)
    return False


def card(pg):
    return pg.evaluate("""() => {
      const v = t => { const e=document.querySelector(`[data-test-id="${t}"]`);
        if(!e) return null; const i=e.querySelector('input');
        return ((i? i.value : e.innerText)||'').trim(); };
      return {contact: v('select_customer_contact'), authorizer: v('select_authorizer')}; }""")


def reload(pg):
    pg.reload(wait_until='domcontentloaded'); pg.wait_for_timeout(9000); kill_newline(pg)


def submit(pg):
    for lbl in ('Update Customer', 'Confirm', 'Save'):
        loc = pg.get_by_role('button', name=lbl, exact=False)
        if loc.count() and loc.first.is_visible():
            try:
                loc.first.click(timeout=10000); print('   submitted with:', lbl)
                pg.wait_for_timeout(4000); return True
            except Exception as e:
                print('   submit failed:', str(e).split('\n')[0][:60])
    strip_and_click(pg, 'button_confirm_dialog')
    print('   submitted via button_confirm_dialog')
    pg.wait_for_timeout(4000)
    return True


with sync_playwright() as p:
    b, ctx, pg = admin_page(p, viewport={'width': 1600, 'height': 1200})
    pg.goto(WO['url'], wait_until='domcontentloaded', timeout=60000)
    pg.wait_for_timeout(9000); kill_newline(pg)

    OBS['precondition'] = card(pg)
    print('PRECONDITION', OBS['precondition'])
    pg.screenshot(path=SHOT + '_0.png')

    print('STEP 1 - read the Authorizer row on the customer card')
    OBS['step1'] = card(pg)
    print('  ', OBS['step1'])

    print('STEP 2 - Change Customer: keep customer A, switch the CONTACT only')
    strip_and_click(pg, 'customer_card_change_action'); pg.wait_for_timeout(3000)
    pg.screenshot(path=SHOT + '_2a.png')
    choose(pg, 'change_customer_contact_select', A_PLAIN)
    pg.screenshot(path=SHOT + '_2b.png')
    submit(pg); reload(pg)
    OBS['step2'] = card(pg)
    print('  ', OBS['step2'])
    pg.screenshot(path=SHOT + '_2c.png')

    print('STEP 3 - Change Customer: switch the CUSTOMER from A to B')
    strip_and_click(pg, 'customer_card_change_action'); pg.wait_for_timeout(3000)
    choose(pg, 'change_customer_customer_select', B)
    pg.wait_for_timeout(2000)
    pg.screenshot(path=SHOT + '_3a.png')
    submit(pg); reload(pg)
    OBS['step3'] = card(pg)
    print('  ', OBS['step3'])
    pg.screenshot(path=SHOT + '_3b.png')

    print('STEP 4 - open the Authorizer picker')
    strip_and_click(pg, 'select_authorizer'); pg.wait_for_timeout(2600)
    OBS['step4_options'] = menu(pg)
    print('   options:', OBS['step4_options'])
    pg.screenshot(path=SHOT + '_4.png')

    print("STEP 5 - pick customer B's flagged contact")
    o = pg.locator('.q-menu .q-item, .q-menu [role=option]')
    picked = False
    for i in range(o.count()):
        if B_FLAG.lower() in (o.nth(i).inner_text() or '').lower():
            o.nth(i).click(); picked = True; break
    print('   picked:', picked)
    pg.wait_for_timeout(3000); reload(pg)
    OBS['step5'] = card(pg)
    OBS['step5_picked'] = picked
    print('  ', OBS['step5'])
    pg.screenshot(path=SHOT + '_5.png')

    json.dump(OBS, open('/tmp/claude-0/wk/_c45275_obs.json', 'w'), indent=1)
    print('\n=== OBSERVATIONS ===')
    print(json.dumps(OBS, indent=1))
    b.close()
