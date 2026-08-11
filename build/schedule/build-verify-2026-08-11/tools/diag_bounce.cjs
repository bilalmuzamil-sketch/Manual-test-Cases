// Diagnose the /administration/locations bounce precisely: is it Schedule-only or app-wide?
// Read-only. Nothing faked, nothing set.
const {boot}=require('./boot.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-verify-2026-08-11/evidence';
(async()=>{
  const {browser,page,api,APP}=await boot();
  const rec={routes:[]};
  await api('/api/iam/change-location',{method:'POST',body:{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}});
  for(const r of ['/schedule','/workorders','/customers','/reports','/parts']){
    await page.goto(APP+r,{waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForTimeout(6000);
    rec.routes.push({asked:r,landed:new URL(page.url()).pathname});
    console.log(r,'->',new URL(page.url()).pathname);
  }
  rec.localStorage=await page.evaluate(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);const v=localStorage.getItem(k);o[k]=(v&&v.length>120)?v.slice(0,120)+'…('+v.length+')':v;}return o;});
  // does the server-side schedule API work at all? (tells us feature vs guard)
  for(const ep of ['/api/schedule/shifts','/api/schedule','/api/schedule/events']){
    const r=await api(ep); rec['api'+ep]=r.status;
    console.log('API',ep,r.status);
  }
  fs.writeFileSync(OUT+'/diag_bounce.json',JSON.stringify(rec,null,1));
  console.log('LS keys:',Object.keys(rec.localStorage).join(','));
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
