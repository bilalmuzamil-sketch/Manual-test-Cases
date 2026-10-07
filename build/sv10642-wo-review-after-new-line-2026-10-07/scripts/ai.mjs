import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-L.json'));
const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const inp=p.locator('[data-test-id="input_shopcoach-linebuilder-query"]'); await inp.click(); await inp.fill('Battery service'); 
const c=await p.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>/Build Lines/.test(b.innerText));const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(c.x,c.y);
for(let i=0;i<30;i++){ await p.waitForTimeout(3000); const w=await p.evaluate(()=>/SHOPCOACH WORKING/i.test(document.body.innerText)); if(!w&&i>1) break; }
const t=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>(b.getAttribute('data-test-id')||'')+':'+b.innerText.trim().replace(/\n/g,' ')).filter(x=>/shopcoach|add|create|line/i.test(x)&&!/button_line_expand|tech_story|labor_adj|new_line/.test(x))); console.log('buttons',j(t,900));
await s.shot('L-ai','shots');
const add=await p.evaluate(()=>{const e=[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).find(b=>/^(add|create|add lines?|add \d+ lines?|add selected.*)$/i.test(b.innerText.trim())||/linebuilder-submit/i.test(b.getAttribute('data-test-id')||''));if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim(),tid:e.getAttribute('data-test-id')};});
console.log('add btn',JSON.stringify(add));
if(add){ await p.mouse.click(add.x,add.y); await p.waitForTimeout(5000); await s.go(`/workorders/${wo}/lines`); console.log('badge',await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim())); console.log('line statuses',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e=>e.innerText.trim())))); await s.shot('L-after-ai','shots'); }
console.log('writes',s.writes.filter(w=>!/envelope|quick-login/.test(w)).map(w=>w.slice(0,160)).join('\n'));
await s.close();
