import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc37.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.setViewportSize({width:2600,height:1000});
 await page.getByRole('button',{name:'Board View'}).first().click(); await page.waitForTimeout(6000);
 for(let a=1;a<=2;a++){
 await page.evaluate(()=>{const els=[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+50&&getComputedStyle(e).overflowX!=='visible');els.forEach(e=>e.scrollLeft=e.scrollWidth);});
 await page.waitForTimeout(3000);
 const info=await page.evaluate(()=>{const out=[];document.querySelectorAll('*').forEach(e=>{if(e.childElementCount===0&&/ZZAUTOTEST Dan Delta/.test(e.textContent||'')){let h=e;for(let k=0;k<5;k++){h=h.parentElement;}out.push({html:h.outerHTML.replace(/\s+/g,' ').slice(0,700)});}});return out.slice(0,2);});
 log('ATTEMPT',a,JSON.stringify(info));
 const imgs=await page.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>i.offsetParent).map(i=>i.src.slice(0,80)+' alt='+(i.alt||'')).slice(0,10)); log('IMGS',JSON.stringify(imgs)); }
 await page.screenshot({path:'/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/step1/hc-board-dan-delta.png'});
 await page.getByRole('button',{name:'List'}).first().click({force:true}).catch(()=>{}); await page.waitForTimeout(2000);
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
