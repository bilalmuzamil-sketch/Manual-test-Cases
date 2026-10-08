import {start,mk,L,menu,inputs,btns,notes,st,save,setLead,leadVal,B,OUT} from './h.mjs';
const log=L('ph2'); const S=st(); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const api=(p)=>page.evaluate(async(p)=>{const tok=localStorage.getItem('token'); const h={}; if(tok) h.Authorization='Bearer '+tok.replace(/"/g,''); const r=await fetch('https://sv10043api.qa.shopview.com/api/'+p,{credentials:'include',headers:h}); return await r.text();},p);
const topAvatar=()=>page.evaluate(()=>{const p=document.querySelector('[aria-label="Profile"]'); const i=p&&p.querySelector('img'); return i? i.src.slice(-60):'initials:'+(p?p.innerText.replace(/\s+/g,' ').slice(-4):'?');});
const imgNear=(name)=>page.evaluate((name)=>{const el=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText&&e.innerText.trim()===name); const out=[]; for(const e of el){ let p=e; for(let k=0;k<5&&p;k++){ const i=p.querySelector&&p.querySelector('img'); if(i){out.push(i.src.slice(-50)); break;} p=p.parentElement;} if(!p) out.push('noimg'); } return out.slice(0,3).join(' | ')||'name not found';},name);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 const j=JSON.parse(await api('staff?limit=20&search=ZZAUTOTEST Dan')); const dan=j.data.collection[0]; log('DAN',dan.id,dan.avatar_url); save('uDan',dan.id);
 await page.goto(S.woG.url+'/lines'); await page.waitForTimeout(6000); await setLead(page,'ZZAUTOTEST Dan',log); log('woG lead',await leadVal(page));
 async function upload(color){ await page.goto(B+'/impersonate-user/'+dan.id); await page.waitForTimeout(9000); log('IMP',(await body()).slice(20,90)); log('top before',await topAvatar());
  await page.goto(B+'/profile'); await page.waitForTimeout(5000); await page.locator('input[type=file]').setInputFiles('/tmp/cln/agent-R/img/'+color+'.png'); await page.waitForTimeout(5000); log('after upload',color,await notes(page),(await menu(page)).slice(0,200)); 
  const dl=page.locator('.q-dialog'); if(await dl.count()){ log('DLG',await menu(page)); await page.screenshot({path:OUT+'PH2-crop-'+color+'.png'}); const ok=dl.locator('button').filter({hasText:/Save|Upload|Crop|Apply|Confirm/}); if(await ok.count()){ await ok.last().click(); await page.waitForTimeout(5000); log('after confirm',await notes(page)); } }
  log('top after upload (no reload)',await topAvatar()); await page.reload(); await page.waitForTimeout(7000); log('top after reload',await topAvatar()); await page.screenshot({path:OUT+'PH2-profile-'+color+'.png'});
  await page.getByRole('button',{name:'Exit'}).click(); await page.waitForTimeout(8000); }
 async function look(tag){ await page.goto(B+'/administration/staff'); await page.waitForTimeout(5000); await page.locator('main').getByText('Search',{exact:true}).first().click(); await page.waitForTimeout(600); await page.keyboard.type('ZZAUTOTEST Dan',{delay:40}); await page.waitForTimeout(3500); log(tag,'STAFF',await imgNear('ZZAUTOTEST')); await page.screenshot({path:OUT+'PH2-staff-'+tag+'.png'});
  await page.goto(B+'/schedule'); await page.waitForTimeout(7000); await page.locator('text=ZZAUTOTEST Dan Delta').last().scrollIntoViewIfNeeded().catch(()=>{}); await page.waitForTimeout(800); log(tag,'SCHED',await imgNear('ZZAUTOTEST Dan Delta')); await page.screenshot({path:OUT+'PH2-sched-'+tag+'.png'});
  await page.goto(B+'/workorders'); await page.setViewportSize({width:2600,height:1000}); await page.waitForTimeout(5000); await page.getByRole('button',{name:'Board View'}).click(); await page.waitForTimeout(6000); log(tag,'BOARD',await imgNear('ZZAUTOTEST Dan Delta')); await page.screenshot({path:OUT+'PH2-board-'+tag+'.png'}); await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(2000); await page.setViewportSize({width:1600,height:1000}); }
 await look('before');
 await upload('red'); await look('red');
 await upload('blue'); await look('blue');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PH2-err'); await page.getByRole('button',{name:'Exit'}).click().catch(()=>{});}
await b.browser.close();
