// C45090 — a user whose role cannot view work orders cannot reach the print option.
// Route: sign in as admin, then step into the shoes of the one member of staff on the
// "Time Clock User" role (no role is edited, nobody's access is changed), and try to open
// the work order from the address bar. Positive control: the same address as admin opens
// the page and offers Print. Impersonation is ended at the finish, always.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG8b.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,240)};},{api:API_HOST,m,p,b:b||null});
const openMore=()=>page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]');
  if(!b) return {opened:false}; b.click(); return {opened:true};});
const menuTexts=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);}, VIS);
const state=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, chars:body.length, head:body.slice(0,240),
    denied:/not authori|no permission|access denied|forbidden|don.t have permission|404|not found/i.test(body),
    hasMore:!!document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'),
    hasLinesTable:!!document.querySelector('[data-test-id=table_work_order_lines]'),
    printInPage:/print work order/i.test(body)};}, VIS);

await settle(page,{label:'admin'});
// ---- positive control, as the administrator
R.control = await state();
R.control.menu = await openMore(); await page.waitForTimeout(2200);
R.control.items = await menuTexts();
R.control.printOffered = R.control.items.some(t=>/print work order/i.test(t));
await page.keyboard.press('Escape');
log('CONTROL admin -> page opens %s, print offered %s', R.control.hasLinesTable, R.control.printOffered);

// ---- who has no work-order access
const staff = rowsOf((await call('GET','/api/staff?limit=200')).json);
R.roleCounts = staff.reduce((m,x)=>{const k=x.role_label||'?'; m[k]=(m[k]||0)+1; return m;},{});
const target = staff.find(x=>/time clock/i.test(x.role_label||'') && x.is_active!==false)
            || staff.find(x=>/time clock/i.test(x.role_label||''));
R.target = target && {id:target.id, staff_id:target.staff_id, role:target.role_label,
  name:`${target.first_name} ${target.last_name}`, active:target.is_active};
log('the user we will step into: %s', JSON.stringify(R.target));
save();

if (target){
  R.switch={};
  for (const uid of [target.id, target.staff_id]){
    const r = await call('POST','/api/switch-user',{user_id:uid});
    R.switch[String(uid).slice(0,8)] = r.status+' '+r.text.slice(0,120);
    if (r.status>=200 && r.status<300){ R.switch.used=String(uid).slice(0,8); break; }
  }
  await page.waitForTimeout(2500);
  const fp = (await call('GET','/api/auth/me/fe-permissions')).json;
  R.asThem = {perms:(fp?.data?.fe_permissions||[]).length, slug:fp?.data?.template_slug,
    permList:(fp?.data?.fe_permissions||[]).slice(0,50)};
  R.asThem.canSeeWorkOrders = (fp?.data?.fe_permissions||[]).some(p=>/workOrdersView/i.test(String(p)));
  // attempt 1, through the address bar the way a person would
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'them1'});
  R.attempt1 = await state();
  R.attempt1.menu = await openMore(); await page.waitForTimeout(2000);
  R.attempt1.items = await menuTexts();
  R.attempt1.printOffered = R.attempt1.items.some(t=>/print work order/i.test(t));
  await page.keyboard.press('Escape');
  // attempt 2, on a settled page, as the guard requires
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'them2'});
  R.attempt2 = await state();
  // and through the Work Orders menu item, not only the address bar
  R.attempt3 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const l=[...document.querySelectorAll('a,button')].filter(isVis).find(e=>/^work orders$/i.test(t(e)));
    if(!l) return {menuItemPresent:false}; l.click(); return {menuItemPresent:true};}, VIS);
  await page.waitForTimeout(4000);
  R.attempt3.after = await state();
  await page.screenshot({path:`${DIR}/evidence/BIG8b-asthem.png`, fullPage:true}).catch(()=>{});
  log('as them: perms=%d workOrdersView=%s | url=%s lines=%s more=%s print=%s | Work Orders in the menu: %s',
    R.asThem.perms, R.asThem.canSeeWorkOrders, R.attempt1.url, R.attempt1.hasLinesTable,
    R.attempt1.hasMore, R.attempt1.printOffered, R.attempt3.menuItemPresent);
  save();
  // ---- always step back out
  R.exit = (await call('POST','/api/exit-switch-user',{})).status;
  await page.waitForTimeout(2000);
  const fp2 = (await call('GET','/api/auth/me/fe-permissions')).json;
  R.backToAdmin = {perms:(fp2?.data?.fe_permissions||[]).length, slug:fp2?.data?.template_slug};
  log('stepped back out: %s -> %s permissions', R.exit, R.backToAdmin.perms);
}
save();
log('done');
await s.browser.close();
process.exit(0);
