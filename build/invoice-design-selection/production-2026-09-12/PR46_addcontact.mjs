// PRODUCTION -- C53570 precondition, take 4. Neither customer here has a contact, so the Authorizer
// dropdown has nothing to offer. Seed one through the Contacts tab (authorised on this account),
// then set it as the Authorizer on a work order.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53570', steps:{}, net:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR46.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)&&r.method()!=='GET') R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
await page.goto(`${APP}/customers/${CUST}/contacts`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(13000);
await page.screenshot({path:`${EV}/PR46-contacts-before.png`, fullPage:true});
R.steps.before=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, len:t.length, body:t.slice(0,400),
    controls:[...document.querySelectorAll('button,[data-test-id]')].filter(ok)
      .map(e=>({tid:e.getAttribute('data-test-id')||null, txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,34)}))
      .filter(x=>x.tid||x.txt).slice(0,40)};});
L('contacts tab: %s', R.steps.before.body.slice(0,200));
L('add-ish controls: %s', JSON.stringify(R.steps.before.controls.filter(c=>/add|new|contact|create/i.test(`${c.tid} ${c.txt}`))));
save();
const clicked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const b=[...document.querySelectorAll('button,[data-test-id]')].filter(ok)
    .find(e=>/add.*contact|new contact|button_add_contact/i.test(`${e.getAttribute('data-test-id')||''} ${e.textContent||''}`));
  if(!b) return null; b.click(); return (b.getAttribute('data-test-id')||b.textContent||'').trim().slice(0,40);});
L('add clicked: %s', clicked); R.steps.addClicked=clicked;
await page.waitForTimeout(5000);
await page.screenshot({path:`${EV}/PR46-add-dialog.png`, fullPage:true});
R.steps.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300),
    inputs:[...d.querySelectorAll('input,textarea')].filter(ok).map(e=>({tid:e.getAttribute('data-test-id')||null,
      ph:e.getAttribute('placeholder')||null, aria:e.getAttribute('aria-label')||null, type:e.type})),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
L('dialog: %s', JSON.stringify(R.steps.dialog));
save();
if(R.steps.dialog){
  // fill every visible text input with a clearly-tagged test value
  R.steps.filled=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const set=(el,v)=>{const p=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
      p.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));};
    const out=[];
    const ins=[...d.querySelectorAll('input')].filter(ok).filter(e=>!/checkbox|radio/.test(e.type));
    ins.forEach((el,i)=>{const lab=`${el.getAttribute('data-test-id')||''} ${el.getAttribute('aria-label')||''} ${el.getAttribute('placeholder')||''}`.toLowerCase();
      let v='ZZAUTOTEST';
      if(/first/.test(lab)) v='ZZAUTOTEST';
      else if(/last/.test(lab)) v='Authorizer';
      else if(/email/.test(lab)||el.type==='email') v='';
      else if(/phone|tel/.test(lab)) v='';
      else if(i===0) v='ZZAUTOTEST';
      else if(i===1) v='Authorizer';
      else v='';
      if(v){ set(el,v); out.push({lab:lab.trim().slice(0,40), v}); }});
    return out;});
  L('filled: %s', JSON.stringify(R.steps.filled));
  await page.waitForTimeout(1500);
  await page.screenshot({path:`${EV}/PR46-filled.png`, fullPage:true});
  const saved=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/^(save|add|create|save & close|done)$/i.test((x.innerText||'').trim()));
    if(!b) return null; b.click(); return (b.innerText||'').trim();});
  L('saved with: %s', saved); R.steps.saved=saved;
  await page.waitForTimeout(11000);
  await page.screenshot({path:`${EV}/PR46-after-save.png`, fullPage:true});
}
R.steps.writes=R.net; L('writes made: %s', JSON.stringify(R.net));
await page.goto(`${APP}/customers/${CUST}/contacts`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(11000);
R.steps.after=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {hasTag:t.includes('ZZAUTOTEST'), len:t.length, body:t.slice(0,400)};});
L('after: contact present=%s', R.steps.after.hasTag);
await page.screenshot({path:`${EV}/PR46-contacts-after.png`, fullPage:true});
save(); await browser.close();
