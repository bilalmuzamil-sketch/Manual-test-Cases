import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,pn,pre]=process.argv.slice(2); const {wo}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob({dpr:2}); const p=s.page; await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(1200);
const c=await p.evaluate(pn=>{const b=[...document.querySelectorAll('button')].filter(b=>/^Pick$/.test(b.innerText.trim())).find(b=>{let e=b;for(let i=0;i<8&&e;i++){e=e.parentElement;if(e&&/\(.+\)/.test(e.innerText))return e.innerText.includes('('+pn+')');}return false;}); if(!b)return null; const g=b.getBoundingClientRect(); return {x:g.x+g.width/2,y:g.y+g.height/2};},pn);
console.log('pick btn',j(c)); await p.mouse.click(c.x,c.y); await p.waitForTimeout(2500);
const d=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\n+/g,' | ').slice(0,400))); console.log('dialog',j(d));
await s.shot(pre+'-after-pick-click','shots');
const conf=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(b=>/^(pick|confirm|yes|save)/i.test(b.innerText.trim()));if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim()};});
if(conf){console.log('confirm',conf.t); await p.mouse.click(conf.x,conf.y); await p.waitForTimeout(3000);}
const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.trim())); console.log('toasts',j(t));
console.log('writes',s.writes.filter(w=>!/envelope|quick-login|touch/.test(w)).map(w=>w.slice(0,220)).join('\n'));
const inv=(await s.api('/api/inventory/parts?search='+encodeURIComponent(pn))).json.data.collection.map(x=>[x.part_number,x.quantity]); console.log('inventory now',j(inv));
await s.close();
