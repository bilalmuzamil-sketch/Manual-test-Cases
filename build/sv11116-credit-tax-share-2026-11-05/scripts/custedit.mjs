// usage: node custedit.mjs <tag> -> Customer page > edit (pencil) dialog: labels + test-ids; screenshot
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go(`/customers/${S.company}/work-orders`); await p.waitForTimeout(5000); await p.locator('[data-test-id="button_base"]').first().click(); await p.waitForTimeout(2500);
console.log('DLG',(await p.locator('.q-dialog').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1500));
console.log('IDS',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
await p.screenshot({path:'/tmp/sv11116/custedit.png'}); await s.close(); process.exit(0);
