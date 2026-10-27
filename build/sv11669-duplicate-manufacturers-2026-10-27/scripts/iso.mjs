import {sess} from './lib.mjs'; import {sess2} from './lib2.mjs';
const s=process.env.ORG2? await sess2({vp:{width:1400,height:950},dpr:2}) : await sess('admin',{vp:{width:1400,height:950},dpr:2}); const P=s.page;
const p=await s.api('/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=50&pagination[page]=1&search=QA-11669'); const rows=Object.values(p.json?.data||{}).find(Array.isArray)||[];
console.log(process.env.ORG2?'ORG2':'ORG1','parts matching QA-11669:',rows.length, JSON.stringify(rows.slice(0,40).map(r=>r.part_number)).slice(0,700));
const m=Object.values((await s.api('/api/parts-catalogue/manufacturers')).json.data).find(Array.isArray); console.log('manufacturers',m.length,'accuride ids',JSON.stringify(m.filter(x=>/accuride/i.test(x.label)).map(x=>x.value.slice(0,8))));
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000); const b=await s.box('filter_chip_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1500);
console.log('filter items',JSON.stringify(await P.evaluate(()=>[...[...document.querySelectorAll('.q-menu')].pop().querySelectorAll('.q-item')].map(e=>e.innerText.trim()).slice(0,8))));
await P.screenshot({path:`../ev/iso-${process.env.ORG2?'org2':'org1'}-filter.png`}); await s.browser.close(); process.exit(0);
