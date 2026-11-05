// usage: node custtax.mjs <tag> <taxRegex> -> Customer edit dialog: Taxes = option matching regex, Save; prints options + writes
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,RX]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go(`/customers/${S.company}/work-orders`); await p.waitForTimeout(5000); await p.locator('[data-test-id="button_base"]').first().click(); await p.waitForTimeout(2500);
await p.locator('[data-test-id="select_tax"]').click(); await p.waitForTimeout(1200); console.log('OPTS',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()).join(' | ')));
await p.locator('.q-menu .q-item').filter({hasText:new RegExp(RX)}).first().click(); await p.waitForTimeout(800); const n=s.writes.length;
await p.locator('[data-test-id="button_save_customer"]').click(); await p.waitForTimeout(3000); console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,500)))); await s.close(); process.exit(0);
