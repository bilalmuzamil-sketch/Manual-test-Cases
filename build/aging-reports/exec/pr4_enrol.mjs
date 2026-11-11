// pr4_enrol.mjs — 11 Nov 2026 ~16:15: production's sign-in ("Service Advisor No Reports (Admin)") is enrolled at ONE location (Truck Hill 1:
// its Change Location list holds only that), so C715477's "before the release" side cannot be seen. Rule 107 (production in scope, 2026-09-16 and
// 2026-09-22): enrol it at a second location ON SCREEN - Settings > Staff > open that staff row > Edit > locations - read the form first, add
// one more location, save, read back the Change Location list. Output prod/pr4.json + pictures. No other field is changed.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; let k = 60; const save = () => fs.writeFileSync(OUT + 'pr4.json', JSON.stringify(o, null, 1));
const B = await bootProdLogin('/administration/staff', { viewport: { width: 1440, height: 900 } }); const p = B.page;
const shot = async (n) => { const f = `${OUT}${String(++k).padStart(2, '0')}-${n}.png`; await p.screenshot({ path: f }); return f; };
try { await p.waitForTimeout(5000); o.url = p.url(); o.list = (await p.locator('main').innerText()).split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 40); await shot('pr4-0-staff');
  /* 16:05: the list has 216 rows; search by the sign-in's own email part, then the row's edit_note icon opens the edit dialog */ await p.locator('main').getByText('Search', { exact: true }).first().click(); await p.waitForTimeout(800); await p.keyboard.type('serviceadvis'); await p.waitForTimeout(3000);
  const row = p.locator('main tr').filter({ hasText: /serviceadvis/i }).first(); o.row = await row.count(); o.rowText = o.row ? (await row.innerText()).replace(/\s+/g, ' ') : (await p.locator('main').innerText()).slice(0, 400); await shot('pr4-0b-search'); if (!o.row) throw new Error('staff row not found');
  await row.getByText('edit_note').first().click().catch(async () => { await row.click(); }); await p.waitForTimeout(2500);
  const dlg = p.locator('.q-dialog').last(); o.form = (await dlg.innerText().catch(() => (p.locator('main').innerText()))).split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 50); await shot('pr4-1-form');
  const locField = dlg.locator('.q-field').filter({ hasText: /Location/i }).first(); o.locField = await locField.count();
  if (o.locField) { await locField.click(); await p.waitForTimeout(1500); const opts = p.locator('.q-menu:visible .q-item'); const n = await opts.count(); o.opts = []; for (let i = 0; i < n; i++) o.opts.push((await opts.nth(i).innerText()).replace(/\s+/g, ' '));
    await shot('pr4-2-options'); const pick = o.opts.findIndex((t) => !/Truck Hill 1/.test(t)); if (pick >= 0) { await opts.nth(pick).click(); o.picked = o.opts[pick]; await p.waitForTimeout(800); } await p.keyboard.press('Escape'); await p.waitForTimeout(600);
    o.formAfter = (await dlg.innerText()).split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 50); await shot('pr4-3-picked');
    const sv = dlg.getByRole('button', { name: /^(Save|Update)/ }).first(); if (o.picked && (await sv.count())) { await sv.click(); await p.waitForTimeout(3500); o.saved = true; o.notes = await p.locator('.q-notification').allInnerTexts().catch(() => []); await shot('pr4-4-saved'); } }
} catch (e) { o.err = String(e).slice(0, 300); try { await shot('pr4-error'); } catch {} }
save(); console.log('pr4', JSON.stringify({ row: o.row, locField: o.locField, opts: o.opts, picked: o.picked, saved: o.saved, notes: o.notes, err: o.err }).slice(0, 900)); await B.browser.close(); process.exit(0);
