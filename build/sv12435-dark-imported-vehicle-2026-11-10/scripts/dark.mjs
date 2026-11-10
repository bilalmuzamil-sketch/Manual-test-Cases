import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const EV='../ev/'+ENV; fs.mkdirSync(EV,{recursive:true});
const s=await sess(); const p=s.page; const res={marker:await s.marker()};
const lst=await s.api('/api/work-orders-imported?limit=5'); res.list=[lst.status,JSON.stringify(lst.json).slice(0,300)];
const col=lst.json?.data?.workOrders||[]; const id=process.env.ID||col[0]?.id; res.id=id;
async function theme(mode){ await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1200);
  await p.click(`[data-test-id="button_night_mode_${mode}"]`); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  return p.evaluate(()=>document.body.className.includes('body--dark')); }
const measure=()=>p.evaluate(()=>{ const sec=document.querySelector('.workorder-info-section'); if(!sec) return {none:true};
  const cs=getComputedStyle(sec); let bg=null,e=sec; while(e){const b=getComputedStyle(e).backgroundColor; if(b&&b!=='rgba(0, 0, 0, 0)'){bg=b;break;} e=e.parentElement;}
  const kids=[...sec.querySelectorAll('*')].filter(x=>x.childNodes.length&&[...x.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).slice(0,40).map(x=>[x.textContent.trim().slice(0,30),getComputedStyle(x).color]);
  let sheet=sec; while(sheet&&getComputedStyle(sheet).backgroundColor!=='rgb(255, 255, 255)') sheet=sheet.parentElement;
  const white=[...(sheet||document).querySelectorAll('*')].filter(x=>[...x.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&x.getBoundingClientRect().width>0).filter(x=>{const m=getComputedStyle(x).color.match(/\d+/g).map(Number);return m[0]>200&&m[1]>200&&m[2]>200;}).map(x=>x.textContent.trim().slice(0,40));
  const nText=[...(sheet||document).querySelectorAll('*')].filter(x=>[...x.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).length;
  const r=sec.getBoundingClientRect(); return {sheetTextEls:nText,whiteTextOnSheet:white,color:cs.color,bg,box:[r.x,r.y,r.width,r.height],kids,text:sec.innerText.replace(/\s+/g,' ').slice(0,300)}; });
for(const mode of ['dark','light']){
  await s.go('/workorders'); await p.waitForTimeout(3000); res['body_'+mode]=await theme(mode);
  await s.go('/imported-work-orders/'+id); await p.waitForTimeout(6000);
  res['m_'+mode]=await measure(); await p.screenshot({path:`${EV}/imported-${mode}.png`});
  const sec=await p.$('.workorder-info-section'); if(sec){ await sec.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await p.screenshot({path:`${EV}/imported-${mode}-strip.png`}); res['m2_'+mode]=await measure(); }
}
fs.writeFileSync(EV+'/dark.json',JSON.stringify(res,null,1)); console.log(JSON.stringify(res,null,1).slice(0,4000));
await s.close(); process.exit(0);
