import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); const p=s.page; const S=JSON.parse(fs.readFileSync('../ev/seed.json'));
await s.go('/customers/'+S.company_id+'/contacts'); await p.waitForTimeout(6000);
await p.screenshot({path:'../ev/prod-contacts-tab.png'});
const g=await p.evaluate(()=>{ const out={}; for(const t of ['Anna','Ben','Cara','Contacts (']){ const el=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim().startsWith(t)).pop(); if(el){ const r=el.getBoundingClientRect(); out[t]=[Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)]; } } return out; });
console.log(JSON.stringify(g)); await s.close(); process.exit(0);
