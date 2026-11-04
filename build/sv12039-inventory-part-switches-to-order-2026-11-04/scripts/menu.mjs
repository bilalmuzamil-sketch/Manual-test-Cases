import {sess} from './common.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync(process.env.WOJ||'/tmp/sv12039/wo-explore.json','utf8'));
const s=await sess(); const p=s.page; await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000);
const t=p.locator('[data-test-id="line_title"]').first(); console.log('title count',await p.locator('[data-test-id="line_title"]').count());
await t.click({button:'right'}); await p.waitForTimeout(1200);
console.log('right-click menu',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()+'|'+e.getAttribute('data-test-id')))));
await p.screenshot({path:'ev/explore/menu.png'}); await s.close(); process.exit(0);
