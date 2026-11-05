// usage: node editpart.mjs [search] -> Parts > Inventory, open first row (or one matching search) edit dialog: labels + test-ids + inputs with values
import {sess} from './common.mjs'; const [Q]=process.argv.slice(2); const s=await sess({dpr:1}); const p=s.page;
await s.go('/parts/inventory'); await p.waitForTimeout(5000); console.log('URL',p.url());
const row=Q?p.locator('table tbody tr').filter({hasText:Q}).first():p.locator('table tbody tr').filter({hasText:/[A-Za-z0-9]/}).first(); console.log('row',(await row.innerText()).replace(/\s+/g,' ').slice(0,150)); await row.click(); await p.waitForTimeout(3000);
console.log('URL2',p.url()); console.log('DLG',(await p.locator('.q-dialog').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,700));
console.log('INPUTS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input, .q-dialog [data-test-id]')].filter(e=>e.offsetParent).map(e=>[(e.getAttribute('data-test-id')||e.tagName),(e.value||'').slice(0,20)]))));
await p.screenshot({path:'../ev/editpart-dialog.png'}); await s.close(); process.exit(0);
