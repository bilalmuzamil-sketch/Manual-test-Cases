// usage: node linepeek.mjs <tag> <lineIdx> [clickTestId] -> lists data-test-ids that mention the line id (optionally clicks one first and lists menu items)
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,I,CL]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const id=S.lines[Number(I)]; const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
const ids=await p.$$eval('[data-test-id]',(els,id)=>els.map(e=>e.getAttribute('data-test-id')).filter(t=>t.includes(id.slice(0,8))||t.includes(id)),id); console.log('IDS',[...new Set(ids)].join(' | '));
if(CL){ await p.locator(`[data-test-id="${CL}"]`).first().click(); await p.waitForTimeout(1200); const m=await p.$$eval('.q-menu [data-test-id], .q-menu .q-item',els=>els.map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.replace(/\s+/g,' ').trim())); console.log('MENU',m.join(' | ')); await p.screenshot({path:`/tmp/sv12048/peek-${TAG}.png`}); }
await s.close(); process.exit(0);
