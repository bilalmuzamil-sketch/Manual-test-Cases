import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('p6'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const firsts=async()=>(await body()).match(/S\d+-\d+ (location_on )?\w+( \d+)? [^S]{0,40}/g)?.slice(0,5);
try{ await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(7000);
 await page.getByRole('button',{name:'Sort work orders'}).click(); await page.waitForTimeout(1500); log('SORT MENU',await menu(page)); await page.screenshot({path:OUT+'P6-sort-menu.png'});
 const items=await page.locator('.q-menu .q-item, .q-dialog .q-item').allInnerTexts(); log('ITEMS',items);
 const sel=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].map(e=>e.innerText.replace(/\s+/g,' ')+':'+(e.className.includes('active')||e.getAttribute('aria-selected')))); log('SEL',sel);
 await page.locator('.q-menu .q-item, .q-dialog .q-item').filter({hasText:/Newest|Number|Created/}).first().click().catch(e=>log('pick1',e.message.slice(0,50))); await page.waitForTimeout(3000); log('AFTER other',await firsts());
 await page.getByRole('button',{name:'Sort work orders'}).click(); await page.waitForTimeout(1500); await page.locator('.q-menu .q-item, .q-dialog .q-item').filter({hasText:/Customer A/}).first().click(); await page.waitForTimeout(3000); log('AFTER Customer A-Z',await firsts());
 await page.reload(); await page.waitForTimeout(8000); log('RELOAD',await firsts()); await page.getByRole('button',{name:'Sort work orders'}).click(); await page.waitForTimeout(1500); log('SEL after reload',await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].map(e=>e.innerText.replace(/\s+/g,' ')+':'+(e.className.includes('active')||e.getAttribute('aria-selected'))))); await page.screenshot({path:OUT+'P6-sort-after-reload.png'}); await esc();
 // 210 scroll paging
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(4000); const n1=[...new Set((await body()).match(/S\d+-\d+/g))].length; log('CARDS before scroll',n1);
 for(let i=0;i<6;i++){ await page.mouse.wheel(0,3000); await page.waitForTimeout(1500);} const all=(await body()).match(/S\d+-\d+/g)||[]; log('CARDS after scroll',[...new Set(all)].length,'dupes',all.length-[...new Set(all)].length);
 // 211 no match
 await page.evaluate(()=>window.scrollTo(0,0)); await page.getByRole('button',{name:'Search'}).last().click(); await page.waitForTimeout(800); await page.keyboard.type('zz-no-such-work-order',{delay:30}); await page.waitForTimeout(4000); const t=await body(); log('NOMATCH',t.slice(t.indexOf('No work'),t.indexOf('No work')+200)); await page.screenshot({path:OUT+'P6-nomatch.png'});
 const cf=page.getByRole('button',{name:/Clear (all )?filters/}); log('clear btn',await cf.allInnerTexts()); if(await cf.count()){ await cf.first().click(); await page.waitForTimeout(4000); log('AFTER clear',(await firsts()), await page.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.value).filter(Boolean)));}
}catch(e){log('ERR',e.message.slice(0,300)); await dump('P6-err');}
await b.browser.close();
