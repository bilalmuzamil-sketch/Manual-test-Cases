import {sess} from './lib.mjs';
const s=await sess(); const P=s.page;
const p=await s.api('/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=5&pagination[page]=1&search=QA-11669-05'); const row=(Object.values(p.json.data).find(Array.isArray)||[]).find(x=>JSON.stringify(x).includes('QA-11669-05')); console.log('row keys',Object.keys(row).join(','),'id',row.id||row.catalogue_part_id);
await s.go('/parts/parts-catalogue/'+(row.id)); await P.waitForTimeout(3500);
console.log('url',P.url());
console.log(await P.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>!/nav|module|clock|notif|profile|search|skip/.test(t)).join(' | ')));
console.log(await P.evaluate(()=>document.querySelector('main, .q-page')?.innerText.slice(0,500).replace(/\n+/g,' | ')));
await P.screenshot({path:'../ev/ed0-detail.png'});
await s.browser.close(); process.exit(0);
