import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
const s=await boot('sv9315','/administration/roles-permissions/'+ROLE+'/edit','admin');
const page=s.page; await page.waitForTimeout(6000);
// dump the View mode control structure + See Financial toggle state
const state=await page.evaluate(()=>{
  const out={viewMode:null, segments:[], seeFinancial:null};
  // find element containing "View mode"
  const vmLabel=[...document.querySelectorAll('*')].find(e=>(e.textContent||'').trim()==='View mode'&&e.children.length===0);
  // segmented control for Full View / Tech view
  const segs=[...document.querySelectorAll('[class*=segment] *, .q-btn-group *, [role=radio], .q-tab')].filter(e=>{const t=(e.textContent||'').trim();return t==='Full View'||t==='Tech view';});
  out.segments=segs.map(e=>({t:(e.textContent||'').trim(),cls:e.className.slice(0,60),pressed:e.getAttribute('aria-pressed'),checked:e.getAttribute('aria-checked'),active:/active|selected|--active|q-tab--active|text-primary|bg-primary/.test(e.className)}));
  // See Financial toggle
  const sf=[...document.querySelectorAll('*')].find(e=>(e.textContent||'').trim()==='See Financial Data'&&e.children.length===0);
  if(sf){let c=sf;for(let i=0;i<5&&c;i++){const tog=c.querySelector?c.querySelector('[role=switch],.q-toggle,input[type=checkbox]'):null;if(tog){out.seeFinancial={aria:tog.getAttribute('aria-checked'),cls:(tog.className||'').slice(0,50),checked:tog.checked};break;}c=c.parentElement;}}
  return out;
});
console.log('BEFORE:', JSON.stringify(state,null,1));
await s.browser.close();
