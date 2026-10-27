import {sess} from './lib.mjs';
const s=await sess(); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(2500);
let b=await s.box('button_new_catalog_part'); await P.mouse.click(b.x,b.y); await s.waitFor('select_catalogue_part_manufacturer');
console.log(await P.evaluate(()=>{const e=document.querySelector('[data-test-id="select_catalogue_part_manufacturer"]'); return e.tagName+' '+e.className.slice(0,120)+'\nparent '+e.parentElement.className.slice(0,120)+'\n'+e.outerHTML.slice(0,900);}));
await s.browser.close(); process.exit(0);
