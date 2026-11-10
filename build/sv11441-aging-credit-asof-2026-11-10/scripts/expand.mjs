// open a Detail report, expand the "Current" (and optional second) bucket on screen; capture the rows the screen loads
import {sess} from './common.mjs'; import fs from 'fs';
const REP=process.env.REP||'ar-aging-detail', ASOF=process.env.ASOF||'', TAG=process.env.TAG||REP;
const s=await sess(); const p=s.page; const got=[]; p.on('response',async r=>{ if(/buckets\/.+\/rows/.test(r.url())){ try{ got.push({url:decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/,'')),json:await r.json()}); }catch{} } });
await s.go('/reports/'+REP+(ASOF?'?asOfDate='+ASOF:'')); await p.waitForTimeout(7000);
for(const k of (process.env.KEYS||'current').split(',')){ const b=p.locator(`[data-test-id$="_toggle_${k}"]`).first(); if(await b.count()){ await b.click(); await p.waitForTimeout(5000);} else console.log('no toggle',k); }
fs.mkdirSync('../ev/'+TAG,{recursive:true}); await p.screenshot({path:`../ev/${TAG}/screen.png`});
const boxes=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).slice(0,40).map(r=>{const b=r.getBoundingClientRect(); return [r.innerText.replace(/\s+/g,' ').slice(0,140),Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)];}));
const heads=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>{const b=t.getBoundingClientRect(); return [t.innerText.trim(),Math.round(b.x),Math.round(b.width)];}));
fs.writeFileSync(`../ev/${TAG}/result.json`,JSON.stringify({got,boxes,heads,url:p.url()},null,1));
console.log(p.url()); console.log(got.map(g=>g.url).join('\n')); console.log(boxes.map(b=>b.join(' | ')).join('\n').slice(0,3000));
await s.close(); process.exit(0);
