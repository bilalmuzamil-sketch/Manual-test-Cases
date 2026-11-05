// usage: ENV=prod|branch node reloadshot.mjs <partSearch> <shot> -> after a fresh load: screenshot the inventory list, then open the part's edit dialog and screenshot it; prints rects
import {sess} from './common.mjs'; const [Q,SH]=process.argv.slice(2); const s=await sess({dpr:2}); const p=s.page;
await s.go('/parts/inventory'); await p.waitForTimeout(5000);
const row=p.locator('table tbody tr').filter({hasText:Q}).first(); console.log('ROW',JSON.stringify(await row.boundingBox()), (await row.innerText()).replace(/\s+/g,' '));
await p.screenshot({path:`../ev/${SH}-list.png`}); await row.click(); await p.waitForTimeout(3000);
for(const id of ['input_average_cost','input_sell_price','input_quantity_0']){ const l=p.locator(`[data-test-id="${id}"]`); console.log(id, await l.inputValue(), JSON.stringify(await l.boundingBox())); }
await p.screenshot({path:`../ev/${SH}-dialog.png`}); console.log('BUILD', await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content)); await s.close(); process.exit(0);
