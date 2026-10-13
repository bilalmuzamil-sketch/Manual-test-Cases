// usage: node RUN.mjs "<Role name>"  — Rule 105: reset role -> assign to tech -> log in as tech -> edit Sell Price on completed PS + completed WO
import {ob,J,post} from './lib.mjs'; import fs from 'fs'; import {resetRole,assignRole} from './roles.mjs';
const ROLE=process.argv[2]; const slug=ROLE.replace(/\W+/g,'-').toLowerCase();
const roles=JSON.parse(fs.readFileSync('roles.json')); const role=roles.find(r=>r.name===ROLE); const tech=JSON.parse(fs.readFileSync('tech-before.json'));
const DOCS=[{kind:'part sale',id:'6c6bb614-e7b0-4f48-aa76-053f7b29d33b',tab:'/parts/part-sale/6c6bb614-e7b0-4f48-aa76-053f7b29d33b/part-requests',pns:['FF5324','FS19593'],loc:{id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',tz:'America/Edmonton'}},
            {kind:'service WO',id:'288cddba-f3ca-491d-8927-e86412a2ca24',tab:'/workorders/288cddba-f3ca-491d-8927-e86412a2ca24/part-requests',pns:['68399093AB','SH550057739'],loc:{id:'f8a8b802-7780-4b16-bf10-343caeb616b2',tz:'America/Edmonton'}}];
const out={role:ROLE,role_id:role.id,t:new Date().toISOString()};
let a=await ob({dpr:1}); await post(a,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const rr=await resetRole(a,role.id); out.reset={n0:rr.before.length,n1:rr.after.length,added:rr.added,removed:rr.removed,log:rr.log}; out.perms=rr.after;
out.assign=await assignRole(a,tech,role.id);
const setLoc=async(x,l)=>{ await post(x,'/api/iam/change-location',{workplace_id:l.id,workplace_timezone:l.tz}); await x.page.evaluate(l=>{localStorage.setItem('location',JSON.stringify(l.id)); localStorage.setItem('timezone',JSON.stringify(l.tz));},l); };
for(const d of DOCS){ await setLoc(a,d.loc); const l=(await a.api('/api/work-orders/lines/'+d.id)).json; const parts=(l.collection||l.data?.collection||[]).flatMap(li=>li.parts||[]); d.parts=d.pns.map(pn=>{const p=parts.find(x=>x.part_number===pn); if(!p) throw new Error(d.kind+' '+pn+' not in '+JSON.stringify(parts.map(x=>x.part_number))+' raw '+JSON.stringify(l).slice(0,200)); return {pn,id:p.id,src:p.part_source_type,api_price:p.sell_price};}); }
await a.close();
const s=await ob({dpr:2,quick:'tech'}); const p=s.page; const net=[];
p.on('response',async r=>{ if(/parts\/change/.test(r.url())){ let b=''; try{b=(await r.text()).slice(0,200);}catch(e){} net.push({st:r.status(),req:(r.request().postData()||'').slice(0,260),res:b}); } });
out.fe=(await s.api('/api/auth/me/fe-permissions')).json.data.fe_permissions; out.sfd=out.fe.includes('seeFinancialData');
out.who=await p.evaluate(()=>JSON.parse(localStorage.getItem('user')||'{}')?.data?.details?.email);
out.docs=[];
for(const d of DOCS){ const r={kind:d.kind,parts:[]}; await setLoc(s,d.loc);
  await s.go(d.tab); await p.waitForTimeout(3500);
  r.num=await p.evaluate(()=>document.querySelector('[data-test-id="text_wo_number"]')?.innerText); r.status0=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText);
  r.sellCol=await p.evaluate(()=>[...document.querySelectorAll('th')].some(t=>/Sell Price/.test(t.innerText)));
  for(const pt of d.parts){ const tid='input_sell_price_'+pt.id; const x={pn:pt.pn,src:pt.src};
    x.present=await p.evaluate(t=>!!document.querySelector(`[data-test-id="${t}"]`),tid);
    if(x.present){ x.disabled=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return !!(e.disabled||e.readOnly);},tid); x.before=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).value,tid);
      if(!x.disabled){ const n0=net.length; const inp=p.locator(`[data-test-id="${tid}"]`); await inp.scrollIntoViewIfNeeded(); await inp.click(); await inp.press('Control+a'); x.typed=(parseFloat(x.before.replace(/,/g,''))+1).toFixed(2); await inp.pressSequentially(x.typed,{delay:70}); await inp.press('Enter'); await p.waitForTimeout(3500);
        x.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' ## ')); x.net=net.slice(n0);
        await p.screenshot({path:`runs/${slug}-${d.kind.replace(' ','')}-${pt.pn}.png`}); await p.evaluate(()=>document.querySelectorAll('.q-notification button').forEach(b=>b.click())); await p.waitForTimeout(600); } }
    r.parts.push(x); }
  await p.reload(); await p.waitForTimeout(4500);
  for(const x of r.parts){ const pt=d.parts.find(q=>q.pn===x.pn); x.afterReload=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.value,'input_sell_price_'+pt.id); }
  r.status1=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText);
  out.docs.push(r); }
out.marker=await s.marker(); await s.close();
fs.writeFileSync(`runs/${slug}.json`,JSON.stringify(out,null,1));
console.log(ROLE,'| reset',J(out.reset,300),'| who',out.who,'| SFD',out.sfd,'| fe',out.fe.length);
for(const r of out.docs){ console.log(' ',r.kind,r.num,r.status0,'->',r.status1,'sellCol',r.sellCol); for(const x of r.parts) console.log('   ',x.pn,x.src,'present',x.present,'dis',x.disabled,x.before,'->',x.typed,'reload',x.afterReload,'| net',(x.net||[]).map(n=>n.st+' '+n.res.slice(0,90)).join(';'),'| toast',(x.toast||'').slice(0,90)); }
