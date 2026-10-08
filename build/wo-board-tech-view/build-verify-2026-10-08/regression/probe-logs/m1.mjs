import {start,mk,L,menu,inputs,btns,notes,st,save,leadVal,B,OUT} from './h.mjs';
const log=L('m1'); const b=await start('/customers','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(4000);
 // 245 customers
 const ths=await page.evaluate(()=>[...document.querySelectorAll('thead th')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim())); log('CUST THS',ths);
 const clickTh=async()=>{const bb=await page.evaluate(()=>{const th=[...document.querySelectorAll('thead th')].find(e=>e.offsetParent&&e.innerText.includes('Customer Name')); const r=th.getBoundingClientRect(); return {x:r.x+30,y:r.y+r.height/2};}); await page.mouse.click(bb.x,bb.y);};
 const names=()=>page.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.children[0]?.innerText.trim().slice(0,30)));
 log('P1',(await names()).slice(0,8)); const t=await body(); log('PAGER',t.slice(-300)); log('PBTNS',(await btns(page)).filter(x=>/chevron|page|Rows|first|last|navigate/i.test(x)));
 await clickTh(); await page.waitForTimeout(3000); log('SORT1',(await names()).slice(0,8)); await clickTh(); await page.waitForTimeout(3000); log('SORT2',(await names()).slice(0,8));
 const n0=new Set(await names()); await page.evaluate(()=>{const el=[...document.querySelectorAll('.q-virtual-scroll,.q-table__middle')][0]; if(el) el.scrollTop=el.scrollHeight; window.scrollTo(0,document.body.scrollHeight);}); await page.waitForTimeout(3500); const n1=await names(); log('AFTER SCROLL count',n1.length,'new',n1.filter(x=>!n0.has(x)).length,'last',n1.slice(-4)); await page.screenshot({path:OUT+'M1-customers.png',fullPage:true}); await dump('M1-customers');
 // 247 imported
 await page.goto(B+'/workorders?status=imported'); await page.waitForTimeout(7000); const r=(await body()).match(/S\d+-\d+/g); log('IMPORTED list',r&&r.slice(0,5),page.url());
 if(r&&r.length){ await page.locator('tbody tr').filter({hasText:r[0]}).first().locator('td').nth(2).click(); await page.waitForTimeout(7000); log('IMP url',page.url(),'lead',await leadVal(page),'dropdown',await page.locator('.q-field').filter({hasText:'Lead Technician'}).count()); await page.screenshot({path:OUT+'M1-imported-wo.png'}); await dump('M1-imported-wo'); }
 await page.goto(B+'/workorders'); await page.waitForTimeout(5000); // clear status param
 // 246 dashboard
 await page.goto(B+'/dashboard'); await page.waitForTimeout(9000); const d=await body(); log('DASH',d.slice(200,2500)); await page.screenshot({path:OUT+'M1-dashboard.png',fullPage:true}); await dump('M1-dashboard');
 log('DASH tables',await page.locator('table').count());
}catch(e){log('ERR',e.message.slice(0,300)); await dump('M1-err');}
await b.browser.close();
