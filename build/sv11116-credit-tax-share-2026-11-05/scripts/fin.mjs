// usage: node fin.mjs <tag> <shot> -> WO Finance tab text (payments section), screenshot; prints rects of text containing "incl." 
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,SHOT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11116/seed-${TAG}.json`,'utf8')); const s=await sess({dpr:2}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(3500); await p.locator('.q-tab, [role=tab]').filter({hasText:/^Finance/}).first().click(); await p.waitForTimeout(5000);
const t=(await p.locator('main, .q-page').first().innerText()).replace(/\s+/g,' '); const i=t.search(/Payment/); console.log('FIN',t.slice(0,200)); console.log('PAYSEC',t.slice(Math.max(0,i-300),i+900));
console.log('INCL',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/incl\./.test(e.textContent)).map(e=>{const r=e.getBoundingClientRect(); return [e.textContent.trim(),Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)];}))));
await p.screenshot({path:`../ev/${SHOT}.png`,fullPage:true}); await s.close(); process.exit(0);
