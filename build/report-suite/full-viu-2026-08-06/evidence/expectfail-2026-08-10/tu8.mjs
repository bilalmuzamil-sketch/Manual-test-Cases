import {boot,APP} from './boot2.mjs';
const {browser,page}=await boot();
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
const t=await page.evaluate(()=>{
  const el=document.querySelector('[data-test-id="select_multiple_tu_technician_filter"]');
  const walk=(n,d)=>{let o=[];for(const c of n.children){o.push({d,tag:c.tagName,cls:c.className.toString().slice(0,55),tid:c.getAttribute('data-test-id'),txt:(c.childElementCount?'':c.innerText||'').trim().slice(0,40)});if(d<3)o=o.concat(walk(c,d+1));}return o;};
  const par=el.closest('.row,.q-toolbar,div');
  return {ownText:el.innerText.replace(/\s+/g,' ').trim(), outer:el.outerHTML.slice(0,600),
    parentText:par?par.innerText.replace(/\s+/g,' ').trim().slice(0,300):'', tree:walk(el,0)};
});
console.log('CONTROL innerText:',JSON.stringify(t.ownText));
console.log('PARENT text:',JSON.stringify(t.parentText));
console.log('TREE:',JSON.stringify(t.tree,null,1).slice(0,1200));
console.log('OUTER:',t.outer.slice(0,500));
// full toolbar text
const tool=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="page_technician_utilization_report"]')||document.body; return b.innerText.split('\n').slice(0,25);});
console.log('PAGE TOP LINES:',JSON.stringify(tool,null,1));
await browser.close();
