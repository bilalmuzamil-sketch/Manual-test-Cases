// usage: node rep.mjs <shot> [range=this_month] -> Sales Tax Collected report screen: filters text, rows, totals; screenshot ../ev/<shot>.png; prints the report GET urls
import {sess} from './common.mjs'; const [SHOT,R]=process.argv.slice(2); const s=await sess({dpr:2}); const p=s.page; const gets=[]; p.on('request',r=>{ if(r.url().includes('sales-tax')) gets.push(r.url().replace(/^https:\/\/[^/]+/,'')); });
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000);
console.log('TEXT',(await p.locator('main, .q-page').first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1500));
console.log('IDS',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(t=>!/^(menu|nav|button_nav|report_nav)/.test(t)).slice(0,60).join(' ')));
console.log('GETS',gets.join('\n')); await p.screenshot({path:`../ev/${SHOT}.png`}); await s.close(); process.exit(0);
