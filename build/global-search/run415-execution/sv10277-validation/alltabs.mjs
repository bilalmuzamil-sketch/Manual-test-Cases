import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
import fs from 'fs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
const WORDS=['truck','repair','diesel','trailer','service','mobile','heavy','fleet','auto','equipment','express','transport','logistics','freight','hauling','cartage','center','brake','filter','shoe','drum','hose','seal','valve','bearing','kit','pump','belt','light','clamp','wheel','oil','fuel','air','water','tire','door','switch','power','steel'];
const norm=s=>String(s||'').toLowerCase().replace(/^[^a-z0-9]+/,'');
const startsWith=(name,q)=>norm(name).startsWith(q.toLowerCase());
const containsWord=(name,q)=>new RegExp('\\b'+q.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'','i').test(String(name)) && !startsWith(name,q);
const found={}; const examined={};
for(const w of WORDS){
  const r=await get('/api/search?q='+encodeURIComponent(w));
  for(const g of (r?.data?.groups||[])){
    const it=g.items||[]; if(it.length<3) continue;
    examined[g.type]=(examined[g.type]||0)+1;
    const idxStarts=it.findIndex(i=>startsWith(i.primary,w));
    const idxContains=it.findIndex(i=>containsWord(i.primary,w));
    if(idxStarts>-1 && idxContains>-1 && idxContains<idxStarts){
      (found[g.type]=found[g.type]||[]).push({q:w, higher:{p:it[idxContains].primary, row:idxContains+1, score:it[idxContains].score}, lower:{p:it[idxStarts].primary, row:idxStarts+1, score:it[idxStarts].score}});
    }
  }
}
console.log('A NAME THAT MERELY CONTAINS THE WORD, RANKED ABOVE ONE THAT ACTUALLY BEGINS WITH IT');
for(const t of Object.keys(examined).sort()){
  const f=found[t]||[];
  console.log('\n['+t+']  lists examined '+examined[t]+'  |  wrong order in '+f.length);
  for(const x of f.slice(0,4)) console.log('    "'+x.q+'"  row '+x.higher.row+' '+String(x.higher.p).slice(0,40)+' ('+x.higher.score+')   ABOVE   row '+x.lower.row+' '+String(x.lower.p).slice(0,40)+' ('+x.lower.score+')');
}
fs.writeFileSync('/tmp/gs/alltabs.json',JSON.stringify({examined,found},null,1));
await browser.close();
