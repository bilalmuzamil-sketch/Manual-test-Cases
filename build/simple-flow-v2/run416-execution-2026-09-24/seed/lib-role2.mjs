export const APP='https://app.shopview.com';
// Build a role from the Admin template, setting BOTH kinds of control:
//   matrix  - the View / Create & Edit / Delete checkboxes on a named permission row
//   toggles - the switches that sit inside a permission (Review work orders, Pick parts, ...)
// Admin is the template on purpose: the role keeps App Settings, so whoever holds it can be moved
// back out of it. Every change is read back before the role is saved, and the saved role is read
// back again afterwards - a role whose name does not match what it carries is worse than no role.
const ROW=`(()=>{window.__findRow=(name)=>{
  for(const row of document.querySelectorAll('tr,div')){
    const r=row.getBoundingClientRect(); if(r.width<400||!r.height) continue;
    const label=(row.innerText||'').replace(/\\s+/g,' ').trim();
    if(!label.toLowerCase().startsWith(name.toLowerCase())) continue;
    const cbs=[...row.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
    if(cbs.length>=2&&cbs.length<=4) return {row,cbs};
  } return null;};})()`;
const stateOf=cb=>`(${(function(c){return c.getAttribute('aria-checked')==='true'||/q-checkbox--truthy/.test(c.className)||!!c.querySelector('.q-checkbox__inner--truthy');}).toString()})`;

export async function setMatrix(page,name,want){ // want = [view, edit, del]; null leaves one alone
  // ORDER MATTERS. Delete implies Create & Edit implies View, so switching Create & Edit off while
  // Delete is still on is simply refused - the click lands and nothing changes. Turn them off from
  // the right (delete, edit, view) and on from the left.
  const order=[0,1,2].filter(i=>want[i]!==null&&want[i]!==undefined);
  const offFirst=order.filter(i=>want[i]===false).sort((a,b)=>b-a);
  const onAfter=order.filter(i=>want[i]===true).sort((a,b)=>a-b);
  const out=[];
  for(const i of [...offFirst,...onAfter]){
    for(let attempt=0;attempt<2;attempt++){
      const r=await page.evaluate(([n,idx,w,rowFn])=>{
        eval(rowFn); const hit=window.__findRow(n);
        if(!hit) return {msg:n+': no row with that name'};
        const on=c=>c.getAttribute('aria-checked')==='true'||/q-checkbox--truthy/.test(c.className)||!!c.querySelector('.q-checkbox__inner--truthy');
        const c=hit.cbs[idx]; if(!c) return {msg:n+': it has no column '+idx};
        if(on(c)===w) return {done:true,msg:['view','edit','delete'][idx]+' is '+(w?'on':'off')};
        c.scrollIntoView({block:'center'}); (c.querySelector('input')||c).click();
        return {clicked:true,msg:['view','edit','delete'][idx]+' clicked'};
      },[name,i,want[i],ROW]);
      await page.waitForTimeout(1500);
      if(r.done){ out.push(r.msg); break; }
      const now=await readMatrix(page,name);
      if(now&&now[i]===want[i]){ out.push(['view','edit','delete'][i]+' -> '+(want[i]?'on':'off')); break; }
      if(attempt===1) out.push(['view','edit','delete'][i]+' WOULD NOT CHANGE (still '+(now?(now[i]?'on':'off'):'?')+')');
    }
  }
  return name+': '+out.join(', ');
}
// Change a role that already exists, rather than making another one beside it.
export async function editRole(page,name,{matrix={},toggles={}}){
  await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(10000);
  const opened=await page.evaluate((n)=>{const r=[...document.querySelectorAll('tr')].find(t=>(t.innerText||'').includes(n));
    if(!r)return 'the role is not listed'; const b=[...r.querySelectorAll('.q-btn,button')].find(e=>/edit/.test(e.innerText||''));
    if(!b)return 'no edit on its row'; b.click(); return 'opened it';},name);
  if(opened!=='opened it') return {opened};
  await page.waitForTimeout(11000);
  const log=[];
  for(const [k,v] of Object.entries(matrix)) log.push(await setMatrix(page,k,v));
  for(const [k,v] of Object.entries(toggles)) log.push(await setToggle(page,k,v));
  const saved=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width&&!/disabled/.test(x.className||''))
    .find(x=>/^(Save|Save & Close|Update)$/i.test((x.innerText||'').trim()));
    if(!b)return 'no Save offered'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed '+(b.innerText||'').trim();});
  await page.waitForTimeout(7000);
  const anyway=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return null; const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(x=>/Anyway|^(Disable|Confirm|Yes|Continue|Save)$/i.test((x.innerText||'').trim()));
    if(b){b.click(); return 'pressed "'+(b.innerText||'').trim()+'"';} return null;});
  await page.waitForTimeout(9000);
  return {opened,log,saved,anyway};
}
export async function readMatrix(page,name){
  return await page.evaluate(([n,rowFn])=>{
    eval(rowFn); const hit=window.__findRow(n); if(!hit) return null;
    const on=c=>c.getAttribute('aria-checked')==='true'||/q-checkbox--truthy/.test(c.className)||!!c.querySelector('.q-checkbox__inner--truthy');
    return hit.cbs.map(on);
  },[name,ROW]);
}
export async function setToggle(page,label,want){
  const r=await page.evaluate(([L,w])=>{
    let el=null; for(const e of document.querySelectorAll('*')) if(e.children.length===0&&(e.textContent||'').trim()===L){el=e;break;}
    if(!el) return L+': not on the page';
    let row=el.parentElement,tg=null;
    for(let i=0;i<6&&row;i++){ tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement; }
    if(!tg) return L+': no switch beside it';
    const isOn=tg.getAttribute('aria-checked')==='true';
    if(isOn===w) return L+': already '+(w?'on':'off');
    tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click();
    return L+': '+(isOn?'on':'off')+' -> '+(w?'on':'off');
  },[label,want]);
  await page.waitForTimeout(1200);
  // some permissions warn that others go with them; until that is confirmed the change does not take
  const casc=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return null; const txt=(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,150);
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>/^(Disable|Enable|Confirm|Yes|Continue|OK)$/i.test((e.innerText||'').trim()));
    if(!b)return 'a warning with no obvious confirm: '+txt; b.click(); return 'confirmed on: '+txt;});
  if(casc) await page.waitForTimeout(2500);
  return r+(casc?' | '+casc:'');
}
export async function buildRole(page,name,{matrix={},toggles={}}){
  await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(10000);
  await page.locator('.q-btn:has-text("Create custom role")').first().click();
  await page.waitForTimeout(6000);
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
    const card=[...d.querySelectorAll('div,li,button')].find(e=>/^Admin\b/.test((e.innerText||'').trim())&&(e.innerText||'').length<60);
    if(card)card.click();});
  await page.waitForTimeout(2000);
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='Apply'); if(b)b.click();});
  await page.waitForTimeout(11000);
  await page.locator('.q-field:has-text("Role Name") input').first().fill(name);
  const log=[];
  for(const [k,v] of Object.entries(matrix)){ log.push(await setMatrix(page,k,v)); await page.waitForTimeout(1400);
    const casc=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150&&/warn|disable|will also/i.test(x.innerText||'')).pop();
      if(!d)return null; const b=[...d.querySelectorAll('button,.q-btn')].find(e=>/^(Disable|Confirm|Yes|Continue|OK)$/i.test((e.innerText||'').trim()));
      if(!b)return 'a warning appeared with no obvious confirm'; b.click(); return 'confirmed a warning';});
    if(casc){ log.push('  '+casc); await page.waitForTimeout(2500); } }
  for(const [k,v] of Object.entries(toggles)) log.push(await setToggle(page,k,v));
  // read back BEFORE saving
  const before={}; for(const k of Object.keys(matrix)) before[k]=await readMatrix(page,k);
  log.push('as set: '+JSON.stringify(before));
  const created=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
    .find(x=>/^(Create|Save)$/i.test((x.innerText||'').trim())); if(!b)return 'no Create button';
    b.scrollIntoView({block:'center'}); b.click(); return 'pressed '+(b.innerText||'').trim();});
  await page.waitForTimeout(7000);
  const anyway=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return null; const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(x=>/Anyway|^(Disable|Confirm|Yes|Continue|Save|Create)$/i.test((x.innerText||'').trim()));
    if(b){b.click(); return 'pressed "'+(b.innerText||'').trim()+'"';} return null;});
  await page.waitForTimeout(9000);
  return {log,created,anyway};
}
export async function verifyRole(page,name,matrix){
  await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(10000);
  const opened=await page.evaluate((n)=>{const r=[...document.querySelectorAll('tr')].find(t=>(t.innerText||'').includes(n));
    if(!r)return 'the role is not listed'; const b=[...r.querySelectorAll('.q-btn,button')].find(e=>/edit/.test(e.innerText||''));
    if(!b)return 'no edit on its row'; b.click(); return 'opened it';},name);
  if(opened!=='opened it') return {opened};
  await page.waitForTimeout(11000);
  const got={}; for(const k of Object.keys(matrix)) got[k]=await readMatrix(page,k);
  return {opened,got};
}
