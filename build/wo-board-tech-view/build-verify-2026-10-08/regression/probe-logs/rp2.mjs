import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('rp2'); const b=await start('/reports','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 for(const r of ['Work In Progress','Technician Utilization','Sales By Customer','Sales By Representative','Parts Velocity','Inventory Value']){
  await page.getByText(r,{exact:true}).first().click(); await page.waitForTimeout(6000);
  const fb=(await btns(page)).filter(x=>/keyboard_arrow_down/.test(x)); log('REPORT',r,page.url(),'| filters',fb.join(' ; '));
  await dump('RP2-'+r.replace(/\W/g,''));
 }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('RP2-err');}
await b.browser.close();
