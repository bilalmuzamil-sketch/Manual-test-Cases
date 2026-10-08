import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('e1'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const W=st().woA.num;
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(3000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(W,{delay:40}); await page.waitForTimeout(4000);
 const row=page.locator('tbody tr').filter({hasText:W}).first(); await row.hover(); log('ROW els',await page.evaluate((W)=>[...document.querySelectorAll('tbody tr')].filter(r=>r.innerText.includes(W)).map(r=>[...r.querySelectorAll('button,[role=button],i')].map(e=>(e.getAttribute('aria-label')||'')+'~'+e.innerText.trim())),W));
 const mb=page.locator(`button[aria-label="More actions for ${W}"]`); log('more count',await mb.count()); if(await mb.count()){ await mb.first().click(); await page.waitForTimeout(1200); log('LIST ROW MENU',await menu(page)); await dump('E1-list-row-menu'); await esc(); }
 await row.click({button:'right'}); await page.waitForTimeout(1000); log('RIGHT',await menu(page)); await esc();
 // customer page WO tab
 await page.goto(st().custUrl); await page.waitForTimeout(7000); log('CUST WO TAB',(await body()).slice(600,1800)); const r2=page.locator('tbody tr').filter({hasText:W}).first(); await r2.hover(); log('CROW els',await page.evaluate((W)=>[...document.querySelectorAll('tbody tr')].filter(r=>r.innerText.includes(W)).map(r=>[...r.querySelectorAll('button,[role=button],i')].map(e=>(e.getAttribute('aria-label')||'')+'~'+e.innerText.trim())),W)); await dump('E1-cust-wo-tab');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('E1-err');}
await b.browser.close();
