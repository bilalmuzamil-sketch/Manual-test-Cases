import {ob,j} from './lib.mjs'; import fs from 'fs';
const {id}=JSON.parse(fs.readFileSync('y.json')); const s=await ob({vp:{width:1900,height:1000}}); const p=s.page;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3500);
console.log(j(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>({t:tr.innerText.replace(/\s+/g,' ').slice(0,60),ctl:[...tr.querySelectorAll('[data-test-id],button')].map(e=>(e.getAttribute('data-test-id')||e.tagName)+':'+(e.innerText||'').trim().slice(0,15)).filter(x=>!/^input_|^select_/.test(x))}))),2500));
const js=await p.evaluate(()=>[...document.querySelectorAll('script[src]')].map(s=>s.src)); console.log('scripts',js.length);
await s.close();
