import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,quick:'tech'}); const p=s.page; const net=[]; const out={};
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/work-orders/.test(r.url())){ let b=''; try{b=(await r.text()).slice(0,160);}catch(e){} net.push({st:r.status(),url:new URL(r.url()).pathname,req:(r.request().postData()||'').slice(0,300),res:b});} });
await post(s,'/api/iam/change-location',{workplace_id:'f8a8b802-7780-4b16-bf10-343caeb616b2',workplace_timezone:'America/Edmonton'}); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('f8a8b802-7780-4b16-bf10-343caeb616b2')));
out.role=(await s.api('/api/auth/me/fe-permissions')).json.data.fe_permissions.length;
await s.go('/workorders/288cddba-f3ca-491d-8927-e86412a2ca24/lines'); await p.waitForTimeout(4000);
const PID='3ccf9522-4bd2-4ace-9504-a8a3dd3f8284';
out.price0=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.innerText,'part_number_'+PID); out.priceShown=await p.evaluate(t=>!!document.querySelector(`[data-test-id="${t}"]`),'part_sell_price_'+PID); out.status=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText);
const cm=await p.evaluate(t=>[...document.querySelectorAll(`[data-test-id^="button_part_context_menu_${t}"]`)].map(e=>e.getAttribute('data-test-id'))[0],PID);
out.menuButton=!!cm; await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.locator(`[data-test-id="part_number_${PID}"]`).click(); await p.waitForTimeout(2500); out.afterRowClick=await p.evaluate(()=>document.querySelectorAll('.q-dialog').length);
const ed={count:async()=>out.afterRowClick, click:async()=>{}};
if(await ed.count()){ await ed.click(); await p.waitForTimeout(2500);
  out.dialog=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,400)).join(' ## '));
  out.dialogIds=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.tagName==='INPUT'?'='+e.value:'')).join(' '));
  out.sellField=await p.evaluate(()=>!!document.querySelector('.q-dialog [data-test-id="input_workorder_part_sell_price"]')); const sp='input_workorder_part_description';
  await p.screenshot({path:'ev/tech-dialog-before.png'});
  if(sp){ const loc=p.locator(`.q-dialog [data-test-id="${sp}"], .q-dialog input[aria-label="${sp}"]`).first(); out.dlgPrice0=await loc.inputValue(); await loc.click(); await loc.press('Control+a'); out.typed=out.dlgPrice0.trim()+' ZZ10628'; await loc.pressSequentially(out.typed,{delay:60}); await p.waitForTimeout(500);
    await p.screenshot({path:'ev/tech-dialog-typed.png'});
    const save=p.locator('.q-dialog button').filter({hasText:/^\s*Save/}).last(); out.saveBtn=await save.count(); if(out.saveBtn){ await save.click(); await p.waitForTimeout(3500); }
    out.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' ## '));
    out.dialogOpen=await p.evaluate(()=>document.querySelectorAll('.q-dialog').length);
    await p.reload(); await p.waitForTimeout(4500); out.price1=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.closest('tr,div.row,.q-item')?.innerText.replace(/\s+/g,' ').slice(0,200),'part_number_'+PID); out.status1=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText);
    await p.screenshot({path:'ev/tech-dialog-after.png'}); }
} else await p.keyboard.press('Escape');
out.net=net; fs.writeFileSync('runs/tech-dialog.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1).slice(0,3000));
await s.close();
