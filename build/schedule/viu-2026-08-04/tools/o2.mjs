import {boot,APP} from './boot.mjs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/';
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
// class inventory
const cls=await page.evaluate(()=>{
  const s=new Set();
  document.querySelectorAll('*').forEach(e=>{const c=(e.className||'').toString();
    c.split(/\s+/).forEach(x=>{if(x&&!x.startsWith('q-')&&!x.startsWith('material')&&!x.startsWith('text-')&&!x.startsWith('bg-')&&!x.startsWith('row')&&!x.startsWith('col')&&!x.startsWith('items-')&&!x.startsWith('justify-')&&!x.startsWith('flex')&&!x.startsWith('absolute')&&!x.startsWith('relative')) s.add(x);});});
  return [...s].sort();
});
console.log('=== CLASS INVENTORY ==='); console.log(cls.join('\n'));
await browser.close();
