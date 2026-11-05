// usage: node woshot.mjs <tag> <shot> -> WO Lines tab screenshot ../ev/<shot>.png at DPR (default 2); prints rects of each line's status badge
import {sess} from './common.mjs'; import fs from 'fs'; const [TAG,SHOT]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:Number(process.env.DPR||2)}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(5000);
console.log('BADGES',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"],[data-test-id^="line_number_"]')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect(); return [e.getAttribute('data-test-id').slice(0,18),e.innerText.trim(),Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)];}))));
await p.screenshot({path:`../ev/${SHOT}.png`}); await s.close(); process.exit(0);
