// Put my own account into the ZZAUTOTEST Receive Later role (built from Admin, so it keeps App
// Settings and I can switch back), after proving the role is in the shape it claims - Rule 118.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setRoleFor } from './lib-role.mjs';
const EMAIL='bilal.muzamil@shopview.com';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(40000);
// open the role and read its Receive later switch
const opened=await page.evaluate(()=>{const r=[...document.querySelectorAll('tr')].find(t=>/ZZAUTOTEST Receive Later/.test(t.innerText||''));
  if(!r)return 'the role is not listed'; const b=[...r.querySelectorAll('.q-btn,button')].find(e=>/edit/.test(e.innerText||''));
  if(!b)return 'no edit on its row'; b.click(); return 'opened it';});
console.log(opened); await page.waitForTimeout(11000);
const state=await page.evaluate(()=>{
  const find=(L)=>{let el=null; for(const e of document.querySelectorAll('*')) if(e.children.length===0&&(e.textContent||'').trim()===L){el=e;break;}
    if(!el)return null; let row=el.parentElement,tg=null;
    for(let i=0;i<6&&row;i++){tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement;}
    return tg?{on:tg.getAttribute('aria-checked')==='true'}:null;};
  return {receiveLater:find('Receive later'), orderParts:find('Order parts'), pickParts:find('Pick parts')};});
console.log('the role carries:',JSON.stringify(state));
if(state.receiveLater && !state.receiveLater.on){
  console.log(await page.evaluate(()=>{let el=null; for(const e of document.querySelectorAll('*')) if(e.children.length===0&&(e.textContent||'').trim()==='Receive later'){el=e;break;}
    let row=el.parentElement,tg=null; for(let i=0;i<6&&row;i++){tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement;}
    tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); return 'switched Receive later on';}));
  await page.waitForTimeout(2500);
  console.log(await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
    .find(x=>/^Save$/i.test((x.innerText||'').trim())); if(!b)return 'no Save'; b.click(); return 'saved the role';}));
  await page.waitForTimeout(8000);
}
// now move my account into it - the staff list remembers a role filter, so try each likely one
let out='not moved';
for(const from of ['Admin','ZZAUTOTEST Receive Later','ZZAUTOTEST Lines Read Only','Owner']){
  out=await setRoleFor(page,EMAIL,from,'ZZAUTOTEST Receive Later');
  console.log(`looking under "${from}":`,out);
  if(!/is not listed/.test(out)) break;
}
await browser.close();
