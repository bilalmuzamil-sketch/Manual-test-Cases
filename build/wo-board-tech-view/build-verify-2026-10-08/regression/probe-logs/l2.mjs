import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('l2'); const b=await start('/workorders?search=ZZAUTOTEST+Regression+Walk','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const col=(i)=>page.evaluate((i)=>[...document.querySelectorAll('tbody tr')].map(r=>r.children[i]?.innerText.replace(/\s+/g,' ').trim().slice(0,22)).filter(x=>x!==undefined),i);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(3000); log('URL',page.url());
 const ths=await page.evaluate(()=>[...document.querySelectorAll('thead th')].map((th,i)=>i+':'+th.innerText.replace(/arrow_drop_\w+/g,'').trim()+':'+/arrow_drop/.test(th.innerText)));
 log('THS',ths);
 for(const t of ths){ const [i,name,sortable]=t.split(':'); if(sortable!=='true') continue; const th=page.locator('thead th').nth(+i); await th.click(); await page.waitForTimeout(2500); const a=await col(+i); await th.click(); await page.waitForTimeout(2500); const d=await col(+i); log('SORT',name,'ASC',a.join('|'),'DESC',d.join('|')); }
 log('URL2',page.url());
 // pager on full All tab
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(4000);
 log('rows visible',await page.locator('tbody tr').count()); await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await page.waitForTimeout(3000);
 const sc=await page.evaluate(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+200&&getComputedStyle(e).overflowY!='visible'&&e.querySelector('tbody')); if(el){el.scrollTop=el.scrollHeight; return el.className.slice(0,80);} return 'none';}); log('scroller',sc); await page.waitForTimeout(3000);
 log('rows after scroll',await page.locator('tbody tr').count()); const t=await body(); log('TAIL',t.slice(-400)); await page.screenshot({path:OUT+'L2-list-bottom.png'});
 log('pager btns',(await btns(page)).filter(x=>/page|chevron|first|last|Rows|per/i.test(x)));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('L2-err');}
await b.browser.close();
