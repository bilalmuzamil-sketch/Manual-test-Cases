// node det.mjs <tag> <pn>
import {sess} from './lib.mjs'; import fs from 'fs'; const [tag,pn]=process.argv.slice(2);
const s=await sess('admin',{vp:{width:1300,height:800},dpr:2}); const P=s.page;
const p=await s.api(`/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=5&pagination[page]=1&search=${pn}`); const part=(Object.values(p.json.data).find(Array.isArray)||[]).find(x=>x.part_number===pn);
await s.go('/parts-catalogue/'+part.id); await P.waitForTimeout(3500);
const r=await P.evaluate(()=>{const lab=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.innerText&&e.innerText.trim()==='Manufacturer'); if(!lab) return null; const box=lab.parentElement.getBoundingClientRect(); const pn=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.innerText&&e.innerText.trim()==='Part number'); const pb=pn.parentElement.getBoundingClientRect(); return {man:{x:box.x,y:box.y,w:box.width,h:box.height,t:lab.parentElement.innerText.replace(/\n/g,' | ')},pn:{x:pb.x,y:pb.y,w:pb.width,h:pb.height,t:pn.parentElement.innerText.replace(/\n/g,' | ')}};});
console.log(JSON.stringify(r)); await P.screenshot({path:`../ev/${tag}.png`}); fs.writeFileSync(`../ev/${tag}.json`,JSON.stringify(r)); await s.browser.close(); process.exit(0);
