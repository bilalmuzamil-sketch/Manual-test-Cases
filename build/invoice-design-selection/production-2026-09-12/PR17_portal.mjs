// PRODUCTION -- the customer portal. Entry is the two-step chain proven on staging: POST /api/token
// for a bearer token, then POST <portal>/sso-login with it. Production host is portal.shopview.com.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APIH='api.shopview.com';
const PORTALS=['https://portal.shopview.com','https://app.portal.shopview.com'];
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), tries:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR17.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
const call=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,400)};},{a:APIH,m,p,b:b||null});
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// is there a Customer Portal item in the profile menu at all?
const menu=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(ok).find(e=>/Truck|Hrs Today/.test(t(e)));
  if(b) b.click(); return true;});
await page.waitForTimeout(3500);
R.profileMenu=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const m=[...document.querySelectorAll('.q-menu')].filter(ok).pop();
  return m?[...m.querySelectorAll('.q-item,a,button')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,14):null;});
L('profile menu: %s', JSON.stringify(R.profileMenu));
await page.screenshot({path:`${EV}/PR17-profile-menu.png`, fullPage:false});
// ROUTE 3 -- click the menu item the way a person does; the click mints the portal session itself
const pops=[]; const on=q=>pops.push(q); ctx.on('page', on);
const clicked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const m=[...document.querySelectorAll('.q-menu')].filter(ok).pop();
  const scope=m||document;
  const el=[...scope.querySelectorAll('.q-item,a,button')].filter(ok)
    .find(e=>/Customer Portal/i.test((e.innerText||'')));
  if(el){el.click(); return (el.innerText||'').replace(/\s+/g,' ').trim();} return null;});
L('clicked the Customer Portal item: %s', clicked);
await page.waitForTimeout(14000); ctx.off('page', on);
R.portalClick={clicked, newTabs:pops.length};
L('new tabs: %d', pops.length);
for(const q of pops){
  await q.waitForTimeout(9000).catch(()=>{});
  const u=q.url();
  const txt=await q.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300)).catch(()=>'');
  L('  tab: %s', u.slice(0,100));
  L('  text: %s', txt.slice(0,220));
  R.portalClick.url=u; R.portalClick.text=txt;
  await q.screenshot({path:`${EV}/PR17-portal-clicked.png`, fullPage:true}).catch(()=>{});
  if(/portal/i.test(u) && !/login|token-expired/i.test(u)){
    // we are in -- list the invoices the portal shows
    await q.goto(u.replace(/\/$/,'')+'/invoices',{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
    await q.waitForTimeout(11000);
    R.portalClick.invoices=await q.evaluate(()=>{try{
      const j=JSON.parse(document.querySelector('script[data-page]').textContent);
      const l=(j.props.invoices&&(j.props.invoices.data||j.props.invoices))||[];
      return {n:l.length, rows:l.slice(0,5).map(x=>({id:x.id,num:x.invoice_number||x.number,st:x.status}))};
    }catch(e){ return {err:String(e).slice(0,90), text:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,200)};}});
    L('  portal invoices: %s', JSON.stringify(R.portalClick.invoices).slice(0,300));
    await q.screenshot({path:`${EV}/PR17-portal-invoices.png`, fullPage:true}).catch(()=>{});
  }
  save();
}
// the token
const tk=await call('POST','/api/token');
R.token={status:tk.s, hasToken:/accessToken/.test(tk.t)};
L('token: %s hasToken=%s', tk.s, R.token.hasToken);
let accessToken=null; try{ accessToken=JSON.parse(tk.t).data.accessToken; }catch(e){}
for(const P of PORTALS){
  const t={portal:P};
  const r=await page.evaluate(async({P,tok})=>{ try{
      const r=await fetch(`${P}/sso-login`,{method:'POST',credentials:'include',
        headers:{'Content-Type':'application/json',Accept:'application/json',
                 ...(tok?{Authorization:`Bearer ${tok}`}:{})},
        body:JSON.stringify({returnJson:true,portalType:'customer'})});
      return {s:r.status, t:(await r.text()).slice(0,260)};
    }catch(e){ return {err:String(e).slice(0,120)}; }},{P, tok:accessToken});
  t.ssoLogin=r; L('%s /sso-login -> %s', P, JSON.stringify(r).slice(0,220));
  R.tries.push(t); save();
  if(r.s===200){
    const pp=await ctx.newPage();
    await pp.goto(`${P}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
    await pp.waitForTimeout(12000);
    t.invoicesPage={url:pp.url().slice(0,90), text:await pp.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,240))};
    L('  portal invoices page: %s', JSON.stringify(t.invoicesPage).slice(0,260));
    await pp.screenshot({path:`${EV}/PR17-portal.png`, fullPage:true});
    await pp.close();
    save(); break;
  }
}
L('done'); save(); await browser.close(); process.exit(0);
