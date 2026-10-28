import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ck=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')); const out=[];
const cases=[['p2162-desc','90a95f29-f405-4763-834d-6e3a237f8c33','.description-cell .q-field__native','Engine Oil'],
 ['p2162-avatar','90a95f29-f405-4763-834d-6e3a237f8c33','.q-avatar','Engine Oil'],
 ['p2162-category','90a95f29-f405-4763-834d-6e3a237f8c33','.category-cell .q-field__native','Engine Oil'],
 ['p2162-vendor','90a95f29-f405-4763-834d-6e3a237f8c33','.vendor-cell','Ignition'],
 ['p2109-desc-editable','48ba5757-175a-4701-8c4a-810791ac2ede','.description-cell .q-field__native','ZZ12CHARPN01']];
for(const [name,id,sel,rowKey] of cases){
 const s=await open({env:'branch',ticket:'11631',cookies:ck,quick:'admin',dir:'/tmp/qa21',vp:{width:390,height:844},dpr:3,scrollbars:true,touch:true});
 const p=s.page; await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(7000);
 const b=await p.evaluate(([sel,k])=>{ const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>r.innerText.includes(k)||[...r.querySelectorAll('input')].some(i=>i.value.includes(k))); if(!r) return null; const n=r.querySelector(sel); n.scrollIntoView({block:'center'}); const x=n.getBoundingClientRect(); const sp=[...n.children].find(c=>c.tagName!=='INPUT')||n; return {box:[x.x,x.y,x.width,x.height],text:sp.textContent.trim(),cut:sp.scrollWidth>sp.clientWidth+0.5}; },[sel,rowKey]);
 if(!b){ out.push({name,missing:true}); continue; }
 await p.waitForTimeout(600); const b2=await p.evaluate(([sel,k])=>{const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>r.innerText.includes(k)||[...r.querySelectorAll('input')].some(i=>i.value.includes(k))); const x=r.querySelector(sel).getBoundingClientRect(); return [x.x,x.y,x.width,x.height]},[sel,rowKey]);
 const tx=Math.max(b2[0]+Math.min(b2[2]/2,30),1), ty=b2[1]+b2[3]/2;
 const pre=await p.evaluate(()=>document.querySelectorAll('.q-tooltip').length);
 await p.touchscreen.tap(tx,ty); await p.waitForTimeout(1800);
 const shown=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip, .q-menu')].filter(t=>t.getBoundingClientRect().height>0).map(t=>{const r=t.getBoundingClientRect(); return (t.className.includes('q-menu')?'MENU ':'TOOLTIP ')+JSON.stringify(t.innerText.trim().replace(/\n/g,' / ').slice(0,110))+' at y='+Math.round(r.y)}));
 await p.screenshot({path:`/tmp/qa11631/w/hov/tap2-${name}.png`});
 out.push({name,value:b&&b.text,cut:b&&b.cut,tap:[Math.round(tx),Math.round(ty)],tooltipsBefore:pre,shown}); await s.close?.();
}
console.log(JSON.stringify(out,null,1)); process.exit(0);
