// pr4c_readback.mjs (read-only copy of pr4b) — 11 Nov 2026 ~16:25: RESTORE the production sign-in's Location to "Truck Hill 1". pr4 found the Edit Staff Member "Location" box is SINGLE-select (not enrolment): picking "Trucks Hill 2" replaced Truck Hill 1. Same screen route, picks Truck Hill 1, Save & Close, reads the form back.
// its Change Location list holds only that), so C715477's "before the release" side cannot be seen. Rule 107 (production in scope, 2026-09-16 and
// 2026-09-22): enrol it at a second location ON SCREEN - Settings > Staff > open that staff row > Edit > locations - read the form first, add
// one more location, save, read back the Change Location list. Output prod/pr4c.json + pictures. No other field is changed.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; let k = 80; const save = () => fs.writeFileSync(OUT + 'pr4c.json', JSON.stringify(o, null, 1));
const B = await bootProdLogin('/administration/staff', { viewport: { width: 1440, height: 900 } }); const p = B.page;
const shot = async (n) => { const f = `${OUT}${String(++k).padStart(2, '0')}-${n}.png`; await p.screenshot({ path: f }); return f; };
try { await p.waitForTimeout(5000); o.url = p.url(); o.list = (await p.locator('main').innerText()).split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 40); await shot('pr4-0-staff');
  /* 16:05: the list has 216 rows; search by the sign-in's own email part, then the row's edit_note icon opens the edit dialog */ await p.locator('main').getByText('Search', { exact: true }).first().click(); await p.waitForTimeout(800); await p.keyboard.type('serviceadvis'); await p.waitForTimeout(3000);
  const row = p.locator('main tr').filter({ hasText: /serviceadvis/i }).first(); o.row = await row.count(); o.rowText = o.row ? (await row.innerText()).replace(/\s+/g, ' ') : (await p.locator('main').innerText()).slice(0, 400); await shot('pr4-0b-search'); if (!o.row) throw new Error('staff row not found');
  await row.getByText('edit_note').first().click().catch(async () => { await row.click(); }); await p.waitForTimeout(2500);
  const dlg = p.locator('.q-dialog').last(); o.form = (await dlg.innerText().catch(() => (p.locator('main').innerText()))).split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 50); await shot('pr4-1-form');
  /* READ-BACK ONLY: no field touched, the dialog is closed with Escape */ await p.keyboard.press('Escape');
} catch (e) { o.err = String(e).slice(0, 300); try { await shot('pr4-error'); } catch {} }
save(); console.log('pr4c', JSON.stringify({ row: o.row, locField: o.locField, opts: o.opts, picked: o.picked, saved: o.saved, notes: o.notes, err: o.err }).slice(0, 900)); await B.browser.close(); process.exit(0);
