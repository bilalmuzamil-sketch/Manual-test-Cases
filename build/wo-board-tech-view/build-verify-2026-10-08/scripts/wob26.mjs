import {start,mk,log} from './woblib.mjs';
const b=await start('/customers/b416a8ad-011f-4946-a6af-e736abf7fe2f/work-orders','admin'); const {page}=b; const {dump,ov}=mk(page);
await page.getByRole('tab',{name:/Assets/}).first().click(); await page.waitForTimeout(4000); await page.getByRole('button',{name:'New Asset'}).first().click(); await page.waitForTimeout(4000);
log('OV',await ov()); await dump('new-asset');
log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input,.q-dialog textarea')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||'')+'|'+(e.closest('label')?.innerText||'').replace(/\s+/g,' ').slice(0,60)))));
await b.browser.close();
