// edit location LOC on screen, set its time zone to TZ (type to search, pick exact), save; print the dialog fields + request
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\//.test(r.url())&&!/collect|recent/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.status()+' '+r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,500)+' -> '+b);} });
await s.go('/administration/locations'); await p.waitForTimeout(6000);
await p.locator('tr',{hasText:process.env.LOC}).first().locator('[data-test-id="button_edit_workplace"]').click(); await p.waitForTimeout(2500);
const dlg=()=>p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.value||e.innerText||'').replace(/\s+/g,' ').slice(0,40)).filter(x=>/zone|time|save|name/i.test(x)):null;});
console.log('dialog',JSON.stringify(await dlg()));
const tz=p.locator('.q-dialog [data-test-id*="timezone"], .q-dialog [data-test-id*="time_zone"]').first(); console.log('tz control',await tz.count());
if(process.env.TZ2 && await tz.count()){ await tz.click(); await p.waitForTimeout(1000); await p.keyboard.type(process.env.TZ2.split('/')[1],{delay:40}); await p.waitForTimeout(1500);
  const opt=p.locator('.q-menu .q-item',{hasText:process.env.TZ2}).first(); console.log('opts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()).slice(0,6)))); await opt.click(); await p.waitForTimeout(800);
  console.log('dialog after pick',JSON.stringify(await dlg())); await p.screenshot({path:`../ev/prod-loc-${process.env.TZ2.replace('/','-')}.png`});
  const save=p.locator('.q-dialog button').filter({hasText:/save|update/i}).last(); await save.click(); await p.waitForTimeout(3000); }
console.log('caps',JSON.stringify(caps)); await s.close(); process.exit(0);
