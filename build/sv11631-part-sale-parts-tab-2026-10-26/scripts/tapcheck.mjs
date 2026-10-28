// Retest 28 Oct: R3/R9 on touch, two tap methods, plus desktop-hover control on the same element.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ck=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')); const O='/tmp/qa11631/w/tap28/'; fs.mkdirSync(O,{recursive:true}); const out=[];
const PS={p2162:'90a95f29-f405-4763-834d-6e3a237f8c33',p2109:'48ba5757-175a-4701-8c4a-810791ac2ede'};
const cases=[['p2162','Engine Oil','.description-cell .q-field__native','desc'],['p2162','Engine Oil','.q-avatar','avatar'],
             ['p2109','WK4707Q-23KW','.q-avatar','avatar'],['p2109','WK4707Q-23KW','.description-cell .q-field__native','desc']];
const tips=p=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim().replace(/\n/g,' ').slice(0,90)));
for(const [ps,key,sel,kind] of cases) for(const mode of ['touch-tap','locator-tap','desktop-hover']){
  const touch=mode!=='desktop-hover';
  const s=await open({env:'branch',ticket:'11631',cookies:ck,quick:'admin',dir:'/tmp/qa21',vp:touch?{width:390,height:844}:{width:1440,height:900},dpr:touch?3:2,scrollbars:true,touch});
  const p=s.page; await s.go(`/parts/part-sale/${PS[ps]}/part-requests`); await p.waitForTimeout(7000);
  const ok=await p.evaluate(k=>{const r=[...document.querySelectorAll('.base-table tbody tr')].find(r=>r.innerText.includes(k)||[...r.querySelectorAll('input')].some(i=>i.value.includes(k))); if(!r) return false; r.setAttribute('data-qa','1'); r.scrollIntoView({block:'center'}); return true;},key);
  if(!ok){ out.push({ps,key,kind,mode,missing:true}); await s.close?.(); continue; }
  await p.waitForTimeout(800); const L=p.locator(`tr[data-qa] ${sel}`).first(); const b=await L.boundingBox();
  const x=b.x+Math.min(b.width/2,30), y=b.y+b.height/2; const name=`${ps}-${kind}-${mode}`;
  await p.screenshot({path:O+name+'-before.png'});
  if(mode==='touch-tap') await p.touchscreen.tap(x,y); else if(mode==='locator-tap') await L.tap({force:true,timeout:8000,position:{x:Math.min(b.width/2,30),y:b.height/2}}); else await p.mouse.move(x,y,{steps:6});
  await p.waitForTimeout(1800); const t=await tips(p); await p.screenshot({path:O+name+'-after.png'});
  out.push({ps,key,kind,mode,box:[b.x,b.y,b.width,b.height].map(Math.round),tooltips:t}); console.log(JSON.stringify(out.at(-1))); await s.close?.();
}
fs.writeFileSync(O+'tap28.json',JSON.stringify(out,null,1)); process.exit(0);
