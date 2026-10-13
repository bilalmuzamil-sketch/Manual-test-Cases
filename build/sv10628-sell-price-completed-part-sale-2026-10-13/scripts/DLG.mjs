import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,quick:'tech'}); const p=s.page; const net=[]; const out={};
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/work-orders/.test(r.url())){ let b=''; try{b=(await r.text()).slice(0,160);}catch(e){} net.push({st:r.status(),url:new URL(r.url()).pathname,req:(r.request().postData()||'').slice(0,300),res:b});} });
await post(s,'/api/iam/change-location',{workplace_id:'f8a8b802-7780-4b16-bf10-343caeb616b2',workplace_timezone:'America/Edmonton'}); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('f8a8b802-7780-4b16-bf10-343caeb616b2')));
out.role=(await s.api('/api/auth/me/fe-permissions')).json.data.fe_permissions.length;
await s.go('/workorders/288cddba-f3ca-491d-8927-e86412a2ca24/lines'); await p.waitForTimeout(4000);
const PID='3ccf9522-4bd2-4ace-9504-a8a3dd3f8284';
out.price0=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.innerText,'part_sell_price_'+PID); out.status=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText);
const cm=await p.evaluate(t=>[...document.querySelectorAll(`[data-test-id^="button_part_context_menu_${t}"]`)].map(e=>e.getAttribute('data-test-id'))[0],PID);
await p.locator(`[data-test-id="${cm}"]`).scrollIntoViewIfNeeded(); await p.locator(`[data-test-id="${cm}"]`).click(); await p.waitForTimeout(1500);
out.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(e=>e.getBoundingClientRect().width>0).map(m=>[...m.querySelectorAll('.q-item')].map(i=>(i.getAttribute('data-test-id')||'')+'='+i.innerText.trim().replace(/\s+/g,' ')).join(' | ')).join(' ## '));
await p.screenshot({path:'ev/wo-part-menu.png'});
const ed=p.locator('.q-menu .q-item').filter({hasText:/^\s*(Edit|Edit Part)\b/i}).first();
if(await ed.count()){ await ed.click(); await p.waitForTimeout(2500);
  out.dialog=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,400)).join(' ## '));
  out.dialogIds=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.tagName==='INPUT'?'='+e.value:'')).join(' '));
  const sp=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog input')].find(i=>/sell/i.test(i.getAttribute('aria-label')||'')||/sell/i.test(i.getAttribute('data-test-id')||'')); return e? e.getAttribute('data-test-id')||e.getAttribute('aria-label'):null;}); out.sellField=sp;
  await p.screenshot({path:'ev/wo-part-dialog-before.png'});
  if(sp){ const loc=p.locator(`.q-dialog [data-test-id="${sp}"], .q-dialog input[aria-label="${sp}"]`).first(); out.dlgPrice0=await loc.inputValue(); await loc.click(); await loc.press('Control+a'); out.typed=(parseFloat(out.dlgPrice0.replace(/,/g,''))+5).toFixed(2); await loc.pressSequentially(out.typed,{delay:80}); await p.waitForTimeout(500);
    await p.screenshot({path:'ev/wo-part-dialog-typed.png'});
    const save=p.locator('.q-dialog button').filter({hasText:/^\s*Save/}).last(); out.saveBtn=await save.count(); if(out.saveBtn){ await save.click(); await p.waitForTimeout(3500); }
    out.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' ## '));
    out.dialogOpen=await p.evaluate(()=>document.querySelectorAll('.q-dialog').length);
    await p.reload(); await p.waitForTimeout(4500); out.price1=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.innerText,'part_sell_price_'+PID); out.status1=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText);
    await p.screenshot({path:'ev/wo-part-dialog-after.png'}); }
} else await p.keyboard.press('Escape');
out.net=net; fs.writeFileSync('runs/dialog.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1).slice(0,3000));
await s.close();
