import {sess} from './lib.mjs';
const s=await sess(); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000);
const r=await P.evaluate(()=>{const td=[...document.querySelectorAll('tbody tr td')].find(t=>t.innerText.trim().length>3); const r=td.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:td.innerText.trim()};});
console.log('clicking',r.t); await P.mouse.click(r.x,r.y); await P.waitForTimeout(3000); console.log('url',P.url());
console.log(await P.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>!/nav|module|clock|notif|profile|search|skip|checkbox_select_part|chip_more/.test(t)).join(' | ')));
await P.screenshot({path:'../ev/ed1-after-row-click.png'});
await s.browser.close(); process.exit(0);
