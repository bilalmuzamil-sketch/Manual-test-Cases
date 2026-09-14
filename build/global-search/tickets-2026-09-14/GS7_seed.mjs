// RE-SEEDABLE Global Search test data for sv9160.
// The 14 Sep branch rebuild destroyed the seed and the previous session had recorded only its IDs,
// never a script -- so this exists. Idempotent: each record is looked up by its ZZAUTOTEST marker
// and only created if absent, making a post-reset run a replay rather than a rebuild.
// Records are created THROUGH THE SCREEN (the API's /api/companies is GET-only -- guessing a POST
// route wasted a pass), and the write each form makes is logged so the routes are captured too.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const STATE=`${DIR}/GS7-seed-state.json`;
const APP='https://sv9160.qa.shopview.com', API='sv9160api.qa.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const S=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{};
S.at=S.at||new Date().toISOString(); S.ids=S.ids||{}; S.routes=S.routes||[]; S.notes=S.notes||[];
const save=()=>fs.writeFileSync(STATE, JSON.stringify(S,null,1));
const { browser, page } = await boot('sv9160','/','admin');
page.on('request', r=>{const u=r.url(); if(/sv9160api/.test(u)&&r.method()!=='GET'){
  const e=`${r.method()} ${u.split('sv9160api.qa.shopview.com')[1]}`;
  if(!S.routes.includes(e)) S.routes.push(e);}});
const req=(m,p)=>page.evaluate(async({a,m,p})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:API,m,p});
const rows=(o)=>{const pick=x=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(x&&x[k]))return x[k];}
  if(Array.isArray(x))return x; for(const k of Object.keys(x||{})){const v=pick(x[k]); if(v&&v.length)return v;} return [];};return pick(o);};
const findCompany=async(name)=>{ for(let p=1;p<=20;p++){
  const r=await req('GET',`/api/companies?limit=100&pagination%5Bpage%5D=${p}&pagination%5BrowsPerPage%5D=100`);
  const rs=rows(r.j); if(!rs.length) return null;
  const hit=rs.find(x=>String(x.name||x.company_name||'').trim().toLowerCase()===name.toLowerCase());
  if(hit) return hit; } return null;};
const fill=async(tid,val)=>page.evaluate(({t,v})=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document;
  const el=d.querySelector(`[data-test-id="${t}"]`); if(!el) return false;
  const inp=el.tagName==='INPUT'||el.tagName==='TEXTAREA'?el:el.querySelector('input,textarea');
  if(!inp) return false;
  const proto=inp.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto,'value').set.call(inp,v);
  inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{t:tid,v:val});

const CUSTNAME='ZZAUTOTEST Bridgeport Hauling';
let cust=await findCompany(CUSTNAME);
if(cust){ L('customer already present -> %s', cust.id); S.ids.customer=cust.id; }
else {
  await page.goto(`${APP}/customers`,{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_new_customer"]'); b&&b.click();});
  await page.waitForTimeout(4000);
  const f=[['input_customer_name',CUSTNAME],['input_customer_postal_code','44872-9931'],
           ['input_customer_website','bridgeporthauling-zzt.com'],['input_customer_city','Fernvale'],
           ['input_customer_address_1','1450 Kestrelway Industrial']];
  for(const [t,v] of f) L('   fill %s -> %s', t, await fill(t,v));
  await page.waitForTimeout(1200);
  const btns=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    return d?[...d.querySelectorAll('button')].filter(vis).map(b=>(b.innerText||'').trim()).filter(Boolean):[];});
  L('   dialog buttons: %s', JSON.stringify(btns));
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return;
    const b=[...d.querySelectorAll('button')].filter(vis).find(x=>/^(save|create|add|save & close)$/i.test((x.innerText||'').trim()));
    b&&b.click();});
  await page.waitForTimeout(12000);
  cust=await findCompany(CUSTNAME);
  if(cust){ S.ids.customer=cust.id; L('customer CREATED -> %s', cust.id); }
  else { S.notes.push('customer not created via the New customer form'); L('customer NOT created'); }
}
save();

// ---------------------------------------------------------------- helpers for the remaining records
const openForm=async(url,tid)=>{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
  await page.waitForTimeout(8000);
  const ok=await page.evaluate((t)=>{const b=document.querySelector(`[data-test-id="${t}"]`); if(!b) return false; b.click(); return true;}, tid);
  await page.waitForTimeout(4500);
  return ok;
};
const submit=async(re)=>{
  const clicked=await page.evaluate((r)=>{const vis=e=>{const x=e.getBoundingClientRect();return x.width>2&&x.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const b=[...d.querySelectorAll('button')].filter(vis).find(x=>new RegExp(r,'i').test((x.innerText||'').trim()));
    if(!b) return null; b.click(); return (b.innerText||'').trim();}, re);
  await page.waitForTimeout(11000); return clicked;
};
const pickSelect=async(tid,text)=>{
  // Set the value with REAL keystrokes. Setting .value directly does not drive Quasar's filter, which
  // is why an earlier run saw "no option" for entries that are simply further down a virtual list.
  const opened=await page.evaluate((t)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document;
    const sel=d.querySelector(`[data-test-id="${t}"]`); if(!sel) return false;
    const inp=sel.querySelector('input'); (inp||sel).focus(); sel.click(); return true;}, tid);
  if(!opened) return 'no-control';
  await page.waitForTimeout(1500);
  if(text){ await page.keyboard.type(text,{delay:60}); await page.waitForTimeout(2200); }
  const res=await page.evaluate((v)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const items=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(vis)
      .map(e=>({e, txt:(e.textContent||'').replace(/^check/,'').trim()}));
    if(!items.length) return 'no-options-shown';
    const hit=v ? items.find(o=>o.txt.toLowerCase().includes(v.toLowerCase())) : items.find(o=>o.txt.length>1);
    if(!hit) return 'no-match among ['+items.slice(0,4).map(o=>o.txt).join('|')+']';
    hit.e.click(); return 'picked:'+hit.txt.slice(0,26);}, text||null);
  await page.waitForTimeout(900);
  return res;
};
const pickAny=async(tid)=>pickSelect(tid,null);
// Some selects carry no usable data-test-id (the asset's Contact is just "select_"), so address
// them by their visible label instead.
const pickByLabel=async(label,text)=>{
  const opened=await page.evaluate((l)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return false;
    const el=[...d.querySelectorAll('[aria-label]')].filter(vis).find(e=>e.getAttribute('aria-label')===l);
    if(!el) return false; const host=el.closest('.q-field')||el; const inp=host.querySelector('input');
    (inp||host).focus(); host.click(); return true;}, label);
  if(!opened) return 'no-control';
  await page.waitForTimeout(1600);
  if(text){ await page.keyboard.type(text,{delay:60}); await page.waitForTimeout(2000); }
  const res=await page.evaluate((v)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const items=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(vis)
      .map(e=>({e, txt:(e.textContent||'').replace(/^check/,'').trim()}));
    if(!items.length) return 'no-options';
    const hit=v?items.find(o=>o.txt.toLowerCase().includes(v.toLowerCase())):items.find(o=>o.txt.length>1);
    if(!hit) return 'no-match'; hit.e.click(); return 'picked:'+hit.txt.slice(0,26);}, text||null);
  await page.waitForTimeout(900); return res;
};

// ---------------------------------------------------------------- 2. contact
if(S.ids.customer && !S.ids.contact){
  const ok=await openForm(`${APP}/customers/${S.ids.customer}/contacts`,'button_new_contact');
  L('contact form opened: %s', ok);
  if(ok){
    for(const [t,v] of [['input_first_name','Marlene'],['input_last_name','Okonkwo'],
                        ['input_title','Dispatch Supervisor'],['input_email','marlene.okonkwo-zzt@example.com']])
      L('   fill %s -> %s', t, await fill(t,v));
    L('   submit: %s', await submit('^save$'));
    const c=await req('GET',`/api/customers/view/${S.ids.customer}`);
    S.ids.contact='created (see the Contacts tab)';
    const seenIt=await page.evaluate(()=>(document.body.innerText||'').includes('Okonkwo'));
    S.ids.contact = seenIt ? 'present' : null;
    L('contact present on the page: %s', seenIt);
  }
  save();
}
// ---------------------------------------------------------------- 3. asset
if(S.ids.customer && !S.ids.asset){
  const ok=await openForm(`${APP}/customers/${S.ids.customer}/vehicles`,'button_new_asset');
  L('asset form opened: %s', ok);
  if(ok){
    for(const [t,v] of [['input_vehicle_vin','1FUJGLDR9KLZZ4471'],['input_year','2019'],
                        ['input_unit','ZZT-4471'],['input_licence_plate','OHZZT471']])
      L('   fill %s -> %s', t, await fill(t,v));
    // Make and model are chosen from values already in the system and there is no "Cascadia" in the
    // list, so the vehicle cannot be an exact copy of the original seed. Nothing in these tests
    // searches on make or model -- they search VIN, unit number and licence plate, which ARE exact --
    // so the substitution is recorded rather than faked.
    // Contact is a REQUIRED field on this form -- that, not the model, is what silently blocked the
    // earlier saves. It is why the contact must be seeded before the asset.
    L('   contact: %s', await pickByLabel('Contact *','Okonkwo'));
    await page.waitForTimeout(1200);
    const mk=await pickSelect('select_vehicle_make','freightliner'); L('   make  : %s', mk);
    await page.waitForTimeout(1500);
    const md=await pickAny('select_vehicle_model'); L('   model : %s', md);
    await page.waitForTimeout(1200);
    S.notes.push({asset:'make/model substituted from the existing list; no "Cascadia" option exists. VIN, unit and plate are exact.', make:mk, model:md});
    L('   submit: %s', await submit('^save$'));
    const chk=await req('GET','/api/search?q=1FUJGLDR9KLZZ4471');
    const grp=((chk.j&&chk.j.data&&chk.j.data.groups)||[]).find(g=>g.type==='assets');
    S.ids.asset = (grp&&grp.total>0) ? 'present' : null;
    L('asset found by search: %s', grp?grp.total:'?');
  }
  save();
}
// ---------------------------------------------------------------- 4. vendor
const VENDNAME='ZZAUTOTEST Kestrel Parts Supply';
if(!S.ids.vendor){
  let v=await findCompany(VENDNAME);
  if(v){ S.ids.vendor=v.id; L('vendor already present -> %s', v.id); }
  else {
    const ok=await openForm(`${APP}/parts/vendors`,'button_new_vendor');
    L('vendor form opened: %s', ok);
    if(ok){
      for(const [t,val] of [['input_vendor_name',VENDNAME],['input_vendor_postal_code','43055-2210'],
                            ['input_vendor_email','parts@kestrelsupply-zzt.com'],['input_vendor_city','Marnston'],
                            ['input_vendor_address_1','88 Halbrook Trace']])
        L('   fill %s -> %s', t, await fill(t,val));
      // The state list offers CANADIAN PROVINCES until the country is set -- that is why an
      // earlier run found no "Ohio" and quietly failed. Country first, then state.
      L('   country: %s', await pickSelect('select_vendor_country','United States'));
      await page.waitForTimeout(1800);
      L('   state  : %s', await pickSelect('select_vendor_state','Ohio'));
      await page.waitForTimeout(1200);
      // "Taxes is a required field" is what actually blocked the earlier save -- not the state.
      L('   taxes  : %s', await pickSelect('select_vendor_tax',null));
      await page.waitForTimeout(1000);
      L('   submit: %s', await submit('save'));
      // Check by SEARCH, not by the companies list -- the vendor is not in /api/companies and an
      // earlier run wrongly reported "not created" because of that.
      const chk=await req('GET','/api/search?q=ZZAUTOTEST%20Kestrel');
      const grp=((chk.j&&chk.j.data&&chk.j.data.groups)||[]).find(g=>g.type==='vendors');
      if(grp&&grp.total>0){ S.ids.vendor='present'; L('vendor CREATED (search finds %s)', grp.total); }
      else L('vendor NOT created');
    }
  }
  save();
}
L('ids now: %s', JSON.stringify(S.ids));
L('write routes observed: %s', JSON.stringify(S.routes));

await browser.close();
