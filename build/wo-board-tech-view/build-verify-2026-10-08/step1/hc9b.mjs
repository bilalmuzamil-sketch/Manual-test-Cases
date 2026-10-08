import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc9b.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/administration/invoices-import','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(20000);
page.on('response',async r=>{const u=r.url(); if(/import/i.test(u)&&r.request().method()!=='GET'){let t='';try{t=(await r.text()).slice(0,800);}catch{} log('RESP',r.status(),u.replace(/^https?:\/\/[^/]+/,''),t);}});
try{
 const [dl]=await Promise.all([page.waitForEvent('download',{timeout:15000}).catch(()=>null), page.locator('button:has-text("Download Template")').click()]);
 if(dl){ const p='/tmp/cln/imp/template.csv'; await dl.saveAs(p); log('TEMPLATE',fs.readFileSync(p,'utf8').slice(0,600)); } else log('no download');
 await page.locator('input[type=file]').first().setInputFiles('/tmp/cln/imp/zz2.csv'); await page.waitForTimeout(4000);
 log('PREVIEW',(await body()).slice((await body()).indexOf('Preview'),(await body()).indexOf('Preview')+800)); await dump('hc-import-preview');
 await page.locator('button:has-text("Import Invoices")').click(); await page.waitForTimeout(8000); log('AFTER IMPORT',await ov()); log('BODY',(await body()).slice(-600)); await dump('hc-import-after');
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
