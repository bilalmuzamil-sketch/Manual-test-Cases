// UI driver for inventory purchase orders. Every action below happens on the screen,
// the way a user would, because the SV-9833 fix is in the front end.
export const sel=id=>`[data-test-id="${id}"]`;

export async function clickId(page,id,{timeout=15000}={}){
  const h=await page.waitForSelector(sel(id),{timeout,state:'visible'});
  const b=await h.boundingBox(); if(!b) throw new Error('no box for '+id);
  await page.mouse.click(b.x+b.width/2,b.y+b.height/2);
}
export async function typeId(page,id,val,{clear=true}={}){
  const h=await page.waitForSelector(sel(id)+' input, '+sel(id)+' textarea, input'+sel(id)+', textarea'+sel(id),{timeout:15000});
  await h.click(); if(clear){ await h.fill(''); }
  await h.type(String(val),{delay:25});
}
export async function qSelect(page,id,text,{exact=false,typeIt=true,typed=null}={}){
  const el=await page.waitForSelector(sel(id),{timeout:15000,state:'visible'});
  await el.click();
  await page.waitForTimeout(400);
  if(typeIt && text){ await page.keyboard.type(String(typed||text).split(' ')[0],{delay:55}); }
  try{ await page.waitForSelector('.q-menu .q-item',{timeout:8000,state:'visible'}); }catch{}
  await page.waitForTimeout(2600);
  let picked=await page.evaluate(({t,exact})=>{
    const items=[...document.querySelectorAll('.q-menu .q-item')];
    const vis=items.filter(i=>i.offsetParent!==null);
    const pool=vis.length?vis:items;
    const norm=s=>s.trim().replace(/\s+/g,' ');
    const m=pool.find(i=>exact? norm(i.innerText)===t : norm(i.innerText).toLowerCase().includes(String(t).toLowerCase()));
    if(!m) return {ok:false,n:pool.length,options:pool.slice(0,10).map(i=>norm(i.innerText).slice(0,70))};
    const r=m.getBoundingClientRect(); return {ok:true,x:r.x+r.width/2,y:r.y+r.height/2,txt:norm(m.innerText).slice(0,90)};
  },{t:text,exact});
  if(!picked.ok && (picked.n===0 || (picked.options||[]).join(' ').includes('No results'))){
    // the option list is debounced; nudge it and look again before giving up
    await page.keyboard.press('Backspace'); await page.waitForTimeout(1200);
    await page.keyboard.type(String(typed||text).split(' ')[0].slice(-1),{delay:60});
    await page.waitForTimeout(3000);
    picked=await page.evaluate(({t,exact})=>{
      const items=[...document.querySelectorAll('.q-menu .q-item')];
      const vis=items.filter(i=>i.offsetParent!==null); const pool=vis.length?vis:items;
      const norm=s=>s.trim().replace(/\s+/g,' ');
      const m=pool.find(i=>exact? norm(i.innerText)===t : norm(i.innerText).toLowerCase().includes(String(t).toLowerCase()));
      if(!m) return {ok:false,n:pool.length,options:pool.slice(0,10).map(i=>norm(i.innerText).slice(0,70))};
      const r=m.getBoundingClientRect(); return {ok:true,x:r.x+r.width/2,y:r.y+r.height/2,txt:norm(m.innerText).slice(0,90)};
    },{t:text,exact});
  }
  if(!picked.ok) throw new Error('option not found '+id+' :: '+text+' :: n='+picked.n+' :: '+JSON.stringify(picked.options));
  await page.mouse.click(picked.x,picked.y);
  await page.waitForTimeout(1000);
  return picked.txt;
}
export async function tableText(page,id='order_items_table'){
  return page.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`);return e?e.innerText:null;},id);
}
export async function ids(page){
  return page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')]
    .map(e=>e.getAttribute('data-test-id')))].filter(x=>!/nav|skip-to|global_search|clock_in|notifications|profile/.test(x)));
}
