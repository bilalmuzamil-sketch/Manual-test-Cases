// usage: node repfilter.mjs [pickRegex] -> Sales Tax report: open Invoice Status chip, list options; optional pick one; print report GET url + rows text
import {sess} from './common.mjs'; const [PICK]=process.argv.slice(2); const s=await sess({dpr:1}); const p=s.page; const gets=[]; p.on('request',r=>{ if(r.url().includes('sales-tax-report')) gets.push(decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/,''))); });
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000);
await p.locator('[data-test-id="filter_chip_statuses"]').click(); await p.waitForTimeout(1500);
console.log('OPTS',await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-test-id')||'')+'='+e.innerText.replace(/\s+/g,' ').trim()).join(' | ')));
if(PICK){ for(const rx of PICK.split(',')){ await p.locator('.q-menu .q-item').filter({hasText:new RegExp(rx,'i')}).first().click(); await p.waitForTimeout(1500);} await p.keyboard.press('Escape'); await p.waitForTimeout(3000);
 console.log('ROWS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('table tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,160))))); }
console.log('GETS',gets.slice(-2).join('\n')); await s.close(); process.exit(0);
