// usage: node catopts.mjs <search...> -> New Inventory Part dialog: list catalog part options per search, marking ones already in inventory
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; await s.go('/parts/inventory'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_new_inventory_part"]').click(); await p.waitForTimeout(2000);
for(const q of process.argv.slice(2)){ const f=p.locator('[data-test-id="select_catalogue_part"]'); await f.click(); await f.fill(''); await p.keyboard.type(q,{delay:30}); await p.waitForTimeout(2500);
 const t=await p.locator('.q-menu .q-item').allInnerTexts(); console.log(q, t.length, t.filter(x=>!/^check/.test(x.trim())).slice(0,3).map(x=>x.replace(/\s+/g,' ').slice(0,50))); await p.keyboard.press('Escape'); }
await s.close(); process.exit(0);
