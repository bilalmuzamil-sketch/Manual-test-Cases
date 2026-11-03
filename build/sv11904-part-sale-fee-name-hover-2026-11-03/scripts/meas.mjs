// usage: node meas.mjs <width> [dark] [env=branch|prod] [psId]
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [W0,mode,ENV0,PS0]=process.argv.slice(2); const W=+W0; const DARK=mode==='dark'; const ENV=ENV0||'branch';
const PS=PS0||'90a95f29-f405-4763-834d-6e3a237f8c33'; const OUT=process.env.OUT||'/tmp/sv11904/m'; fs.mkdirSync(OUT,{recursive:true}); const tag=`${ENV}-${W}${DARK?'-dark':''}`;
const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim();
const s=ENV==='prod'? await open({env:'prod',dir:'/tmp/qa42',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:W,height:900},dpr:2,scrollbars:true})
  : await open({env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41',vp:{width:W,height:900},dpr:2,scrollbars:true});
const p=s.page; const R={tag,marker:await s.marker(),at:new Date().toISOString()};
if(process.env.LOC) console.log('screen location',await import('./loc.mjs').then(m=>m.setLoc(s,process.env.LOC)));
await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(7000);
if(DARK){ await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1200);
  R.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.replace(/\s+/g,' ').trim().slice(0,40)));
  await p.click('[data-test-id="button_night_mode_dark"]'); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  R.isDark=await p.evaluate(()=>document.body.classList.contains('body--dark')); }
await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
const th=()=>p.evaluate(()=>[...document.querySelectorAll('thead th')].filter(t=>t.getBoundingClientRect().width>0).map(t=>{const r=t.getBoundingClientRect(); const rg=document.createRange(); rg.selectNodeContents(t); const tops=new Set([...rg.getClientRects()].filter(x=>x.width>0).map(x=>Math.round(x.top))); return {t:t.innerText.trim().replace(/\n/g,'⏎'),x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),lines:tops.size};}));
R.thBefore=await th();
await p.evaluate(()=>{const w=[...document.querySelectorAll('.q-table__middle')].sort((a,b)=>b.scrollWidth-a.scrollWidth)[0]; w.scrollLeft=w.scrollWidth;}); await p.waitForTimeout(900);
R.thAfter=await th();
R.cells=await p.evaluate(()=>[...document.querySelectorAll('td.fees-cell')].map((td,i)=>({i,td})).filter(x=>x.td.innerText.trim()).map(({i,td})=>{const row=td.closest('tr'); const nm=td.querySelector('[data-test-id^="text_part_adjustment_name_"]'); const rt=td.querySelector('[data-test-id^="text_part_adjustment_rate_"]');
  const kids=[...td.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText&&e.innerText.trim()).map(e=>({t:e.innerText.trim(),id:e.getAttribute('data-test-id'),cls:e.className,b:(r=>[r.x,r.y,r.width,r.height].map(Math.round))(e.getBoundingClientRect())}));
  const r=td.getBoundingClientRect(); return {row:i,desc:row?.querySelector('input')?.value||row?.innerText.split('\n')[0],cell:td.innerText.replace(/\n/g,' | '),tdB:[r.x,r.y,r.width,r.height].map(Math.round),name:nm&&{t:nm.innerText,full:nm.textContent,cut:nm.scrollWidth>nm.clientWidth+1,sw:nm.scrollWidth,cw:nm.clientWidth,id:nm.getAttribute('data-test-id'),b:(q=>[q.x,q.y,q.width,q.height].map(Math.round))(nm.getBoundingClientRect())},kids};}));
const tips=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim()));
const tipBoxes=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>{const r=t.getBoundingClientRect(); return [r.x,r.y,r.width,r.height].map(Math.round);}));
await p.screenshot({path:`${OUT}/${tag}-scrolled.png`});
R.hover=[];
for(const c of R.cells){ const kb=await p.evaluate(i=>{const td=document.querySelectorAll('td.fees-cell')[i]; td.scrollIntoView({block:'center',inline:'nearest'}); return [...td.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText&&e.innerText.trim()).map(e=>{const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];});},c.row); await p.waitForTimeout(500);
  const kb2=await p.evaluate(i=>{const td=document.querySelectorAll('td.fees-cell')[i]; return [...td.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText&&e.innerText.trim()).map(e=>{const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];});},c.row);
  for(const [ki,k] of c.kids.entries()){ const [x,y,w,h]=kb2[ki]; if(w<=0) continue; await p.mouse.move(5,5); await p.waitForTimeout(400); await p.mouse.move(x+Math.min(w/2,30),y+h/2,{steps:6}); await p.waitForTimeout(1100);
    const t=await tips(); R.hover.push({row:c.row,el:k.t,id:k.id,tips:t,tipB:await tipBoxes(),elB:[x,y,w,h].map(Math.round)}); if(ki===0) await p.screenshot({path:`${OUT}/${tag}-hover-row${c.row}.png`}); } }
await p.mouse.move(5,5); await p.waitForTimeout(800); R.tipsAfterLeave=await tips();
fs.writeFileSync(`${OUT}/${tag}.json`,JSON.stringify(R,null,1));
console.log(tag,'marker',R.marker.version,'dark',R.isDark,'menu',JSON.stringify(R.menu||'').slice(0,300));
console.log('TH before',JSON.stringify(R.thBefore.map(t=>t.t.slice(0,16)+':'+t.h+'/'+t.lines+'L/'+t.x)));
console.log('TH after ',JSON.stringify(R.thAfter.map(t=>t.t.slice(0,16)+':'+t.x)));
for(const c of R.cells) console.log('CELL row',c.row,JSON.stringify(c.cell),'name',JSON.stringify(c.name&&{t:c.name.full,cut:c.name.cut,sw:c.name.sw,cw:c.name.cw}),'kids',JSON.stringify(c.kids.map(k=>k.t+'@'+k.b[2])));
for(const h of R.hover) console.log('HOVER row',h.row,JSON.stringify(h.el),'->',JSON.stringify(h.tips));
console.log('tips after leaving',JSON.stringify(R.tipsAfterLeave));
await s.close(); process.exit(0);
