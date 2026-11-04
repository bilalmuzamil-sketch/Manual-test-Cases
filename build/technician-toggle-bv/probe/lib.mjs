import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
export const A = 'https://sv11788.qa.shopview.com';
export async function start(OUT) { fs.mkdirSync(OUT, { recursive: true }); const r = await boot('sv11788', '/administration/staff', 'admin'); const page = r.page; page.setDefaultTimeout(12000);
  let k = 0;
  const dump = async (name, whole) => { await page.waitForTimeout(1800); const n = String(++k).padStart(2, '0') + '-' + name;
    const dlg = page.locator('.q-dialog:visible, .q-menu:visible');
    const t = (!whole && await dlg.count()) ? (await dlg.allInnerTexts()).join('\n----\n') : (await page.locator('main').innerText().catch(() => ''));
    fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, page.url(), t.length); };
  const step = async (n, f) => { try { await f(); } catch (e) { console.log('FAIL', n, e.message.split('\n')[0].slice(0, 150)); await dump('FAIL-' + n).catch(() => {}); await page.keyboard.press('Escape').catch(() => {}); } };
  const go = async p => { await page.goto(A + p, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); await page.waitForTimeout(1500); };
  const search = async v => { await page.locator('main').getByText('Search', { exact: true }).first().click(); await page.waitForTimeout(500); await page.locator('main input:visible').first().fill(v); await page.waitForTimeout(2500); };
  const dots = () => page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') }).last();
  const btn = (t, scope) => (scope || page.locator('main')).locator('button:visible', { hasText: t }).first();
  const dlg = () => page.locator('.q-dialog:visible').last();
  return { r, page, dump, step, go, search, dots, btn, dlg };
}
