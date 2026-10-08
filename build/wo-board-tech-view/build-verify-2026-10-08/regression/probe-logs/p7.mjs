import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('p7'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ // positive control: desktop Board View no-match
 await page.setViewportSize({width:2600,height:1000}); await page.waitForTimeout(3000); await page.getByRole('button',{name:'Board View'}).click(); await page.waitForTimeout(5000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('zz-no-such-work-order',{delay:30}); await page.waitForTimeout(5000);
 log('CONTROL board btns',(await btns(page)).filter(x=>/Clear/i.test(x)), (await body()).match(/No work orders[^.]*\./)?.[0]);
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(2000);
 await page.goto(B+'/workorders'); await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(8000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:'Search'}).last().click(); await page.waitForTimeout(800); await page.keyboard.type('zz-no-such-work-order',{delay:30}); await page.waitForTimeout(8000);
 log('ATTEMPT2 url',page.url(),'msg',(await body()).match(/No work orders[^.]*\./)?.[0],'all btns',await btns(page),'pages',b.browser.contexts()[0].pages().length); await dump('P7-phone-nomatch-2');
 const x=page.locator('button,i').filter({hasText:/^cancel$/}).first(); log('x count',await page.locator('button,i').filter({hasText:/^cancel$/}).count()); if(await x.count()){ await x.click(); await page.waitForTimeout(4000); log('AFTER x',(await body()).match(/S\d+-\d+/g)?.slice(0,3), await page.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.value).filter(Boolean)));}
 await page.setViewportSize({width:1600,height:1000});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('P7-err');}
await b.browser.close();
