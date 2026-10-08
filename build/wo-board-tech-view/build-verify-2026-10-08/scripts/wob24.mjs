import {start,mk,log} from './woblib.mjs';
const b=await start('/customers','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page);
await page.getByRole('button',{name:'New Customer'}).first().click().catch(e=>log('nc',e.message));
await page.waitForTimeout(4000); log('URL',page.url()); log('OV',await ov()); await dump('new-customer');
const inputs=await page.evaluate(()=>[...document.querySelectorAll('input,textarea,[role=combobox]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||'')+'|'+(e.closest('label')?.innerText||'').replace(/\s+/g,' ').slice(0,60)));
log('INPUTS',JSON.stringify(inputs));
log('BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean))));
await b.browser.close();
