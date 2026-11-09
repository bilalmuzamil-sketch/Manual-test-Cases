import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess({vp:{width:1600,height:1200}}); const p=s.page;
await s.go('/administration/payment-methods'); await p.waitForTimeout(6000);
const b=await p.evaluate(()=>{const r=[];for(const tr of document.querySelectorAll('tr')){const t=tr.innerText.split("\t")[0].trim(); if(/^(Check|ZZ12038 Race 87216)$/.test(t)){const x=tr.getBoundingClientRect(); r.push({t,x:x.x,y:x.y+scrollY,w:x.width,h:x.height});}} return {r,rows:[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.trim())};});
await p.screenshot({path:'../ev/recheck-pm-list2.png',fullPage:true}); fs.writeFileSync('../ev/recheck-pm-boxes.json',JSON.stringify(b)); console.log(JSON.stringify(b).slice(0,700)); await s.close(); process.exit(0);
