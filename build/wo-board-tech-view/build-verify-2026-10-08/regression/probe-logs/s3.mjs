import {start,mk,L,menu,notes,save,createWO,addLine,B} from './h.mjs';
const log=L('s3'); const b=await start('/workorders','admin'); const {page}=b; const {dump,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000});
 for(const k of ['woE','woG']){ const w=await createWO(page,'ZZAUTOTEST Regression Walk',log); save(k,w);
  await addLine(page,'Service - Full grease service',true,log,{close:false,canned:true});
  await addLine(page,'Service - Adjust clutch',true,log,{close:true,canned:true});
  await page.reload(); await page.waitForTimeout(6000); const t=await body(); const i=t.indexOf('Name/Description'); log(k,'LINES',t.slice(i,i+500)); log(k,'STATUS',(t.match(/S10043-\d+ (\w+)/)||[])[0]); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('S3-err');}
await b.browser.close();
