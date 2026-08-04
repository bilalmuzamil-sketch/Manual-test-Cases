import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page,netlog}=await boot();
await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(12000);
const info=await page.evaluate(()=>{
  const out={};
  // tab row + filter bar structure
  const tabs=[...document.querySelectorAll('.q-tab, [role=tab]')].map(e=>e.innerText.trim());
  out.tabs=tabs;
  // find elements whose text matches a chip name
  const names=['Status','Customer','Lead Technician','Service Advisor','Asset on Site','Asset on site'];
  out.chips=[];
  for(const n of names){
    const els=[...document.querySelectorAll('button,div,span,a')].filter(e=>e.innerText&&e.innerText.trim()===n&&e.getBoundingClientRect().height>10&&e.getBoundingClientRect().height<70);
    if(els.length){
      // pick outermost clickable
      let e=els[0];
      let btn=e.closest('button')||e;
      const r=btn.getBoundingClientRect();
      out.chips.push({name:n,tag:btn.tagName,cls:btn.className,text:btn.innerText.trim().replace(/\n/g,'|'),
        x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),
        icons:[...btn.querySelectorAll('i,svg,.q-icon,.material-icons')].map(i=>(i.textContent||'').trim()||i.getAttribute('class')||'svg')});
    }
  }
  // the tab element positions to compare y with chips
  out.tabPos=[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>{const r=e.getBoundingClientRect();return{t:e.innerText.trim(),x:Math.round(r.x),y:Math.round(r.y),h:Math.round(r.height)};});
  // toolbar icon buttons near the chip row
  out.iconBtns=[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.y<160&&r.y>70&&r.width<70;}).map(b=>{const r=b.getBoundingClientRect();return{cls:b.className.slice(0,90),icon:[...b.querySelectorAll('i,.q-icon')].map(i=>(i.textContent||'').trim()).join(','),aria:b.getAttribute('aria-label'),title:b.getAttribute('title'),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width)};});
  // table row count + header labels
  out.headers=[...document.querySelectorAll('thead th')].map(e=>e.innerText.trim());
  out.rows=document.querySelectorAll('tbody tr').length;
  out.search=[...document.querySelectorAll('button,div')].filter(e=>e.innerText&&e.innerText.trim()==='Search'&&e.getBoundingClientRect().y<170&&e.getBoundingClientRect().y>70).map(e=>{const r=e.getBoundingClientRect();return{tag:e.tagName,cls:e.className.slice(0,80),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width)};});
  return out;
});
console.log(JSON.stringify(info,null,1));
fs.writeFileSync('/tmp/fviu/p1.json',JSON.stringify({info,net:netlog.filter(n=>n.phase==='res'&&n.url.includes('shopview'))},null,1));
await browser.close();
