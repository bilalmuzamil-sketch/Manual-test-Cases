import {sess,st} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const W=JSON.parse(fs.readFileSync('../data/wo1.json'));
await s.go(`/workorders/${W.wo}/lines`); await s.page.waitForTimeout(3000);
const all=await s.page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.dataset.testId.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>')))]);
console.log(all.filter(i=>/menu|more|kebab|option|edit|dots/i.test(i)).join(' | '));
// open the first line's menu-ish button
const cand=await s.page.evaluate((lid)=>[...document.querySelectorAll(`[data-test-id*="${lid}"]`)].map(e=>e.dataset.testId),W.lines[0]); console.log('line A ids',cand.join(' | '));
// hover the labor row and list buttons
const lab=await s.box('line_labor_name_'+(await s.page.evaluate(()=>document.querySelector('[data-test-id^="line_labor_name_"]').dataset.testId.slice(16))));
if(lab){ await s.page.mouse.move(lab.x,lab.y); await s.page.waitForTimeout(800);
 const near=await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>/labor|task|move/i.test(t))); console.log('after hover',near.join(' | ')); }
await s.page.screenshot({path:'/tmp/qa11685/w/l2.png'});
await s.browser.close(); process.exit(0);
