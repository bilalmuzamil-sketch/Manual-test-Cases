import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ck=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')); const O='/tmp/qa11631/w/cap/'; const B={};
for(const [name,sel] of [['desc','.description-cell .q-field__control'],['avatar','.q-avatar']]){
 const s=await open({env:'branch',ticket:'11631',cookies:ck,quick:'admin',dir:'/tmp/qa21',vp:{width:390,height:844},dpr:3,scrollbars:true,touch:true});
 const p=s.page; await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await p.waitForTimeout(7000);
 await p.evaluate(()=>{const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>[...r.querySelectorAll('.description-cell *')].some(x=>x.textContent.includes('Engine Oil'))); r.setAttribute('data-qa','1'); r.scrollIntoView({block:'center'});}); await p.waitForTimeout(800);
 const b=await p.evaluate(sel=>{const r=document.querySelector('tr[data-qa]'); const e=r.querySelector(sel); const x=e.getBoundingClientRect(); const n=r.querySelector('.description-cell .q-field__native'); const sp=[...n.children].find(c=>c.tagName!=='INPUT')||n; return {el:[x.x,x.y,x.width,x.height],text:sp.textContent.trim(),row:(()=>{const q=r.getBoundingClientRect();return [q.x,q.y,q.width,q.height]})()}},sel);
 const tx=b.el[0]+Math.min(b.el[2]/2,30), ty=b.el[1]+b.el[3]/2; await p.screenshot({path:O+`T-${name}-before.png`});
 await p.touchscreen.tap(tx,ty); await p.waitForTimeout(1800);
 b.tap=[tx,ty]; b.shown=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText)); await p.screenshot({path:O+`T-${name}-after.png`}); B[name]=b; await s.close?.(); }
fs.writeFileSync(O+'touch.json',JSON.stringify(B,null,1)); console.log(JSON.stringify(B)); process.exit(0);
