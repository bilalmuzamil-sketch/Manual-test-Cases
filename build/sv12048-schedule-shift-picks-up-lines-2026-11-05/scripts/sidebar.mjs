// usage: node sidebar.mjs <tag> <shot> -> Schedule, search the WO in the sidebar, open its line panel, print text
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,SHOT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/schedule'); await p.waitForTimeout(4500); await p.locator('[data-test-id="input_sidebar_search"]').fill(S.number); await p.waitForTimeout(3000);
const card=p.locator('[data-test-id="sidebar_work_order_card"]',{hasText:S.number}).first(); console.log('CARD',(await card.innerText()).replace(/\s+/g,' '));
await card.click(); await p.waitForTimeout(2500);
console.log('PANEL',(await p.locator('[data-test-id="schedule_sidebar"]').innerText()).replace(/\s+/g,' ').slice(0,700)); await p.screenshot({path:`../ev/${SHOT}.png`}); await s.close(); process.exit(0);
