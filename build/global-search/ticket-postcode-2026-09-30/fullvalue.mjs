// The rewritten Expected: the labelled note must show the WHOLE value, not just what you typed.
// Typing the whole value proves nothing - it echoes identically either way. So each check runs
// a FRAGMENT and reads what the note comes back with.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
async function q(term, tab, needle){
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
  await page.fill('.search-modal input',''); await page.waitForTimeout(300);
  await page.type('.search-modal input', term, {delay:45}); await page.waitForTimeout(3500);
  if(tab){ await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
    .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2500); }
  const rows = await page.evaluate(()=>[...document.querySelectorAll('.search-row')]
    .map(r=>r.innerText.replace(/\s*\n\s*/g,' | ')));
  const hit = rows.find(r=>r.includes(needle)) || rows[0] || 'NO ROWS';
  console.log('typed '+JSON.stringify(term).padEnd(26)+' -> '+hit.slice(0,165));
}
console.log('--- C146221 postal code: whole value is H8A3X9 ---');
await q('H8A3X9','Customers','7 Star');
await q('H8A 3X9','Customers','7 Star');
console.log('--- C146241 category: whole value is ".Brake Parts" ---');
await q('.Brake Parts','Parts','Category');
await q('Brake Part','Parts','Category');
await q('rake Part','Parts','Category');
console.log('--- C146250 vendor email: whole value is zzhidden.vendor@staging.shopview.local ---');
await q('zzhidden.vendor@staging.shopview.local','Vendors','Rowcheck');
await q('zzhidden','Vendors','Rowcheck');
await q('zzhidden.vendor','Vendors','Rowcheck');
await browser.close();
