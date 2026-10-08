import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const res=[];
let last=null; p.on('response',async r=>{try{const u=new URL(r.url()); if(r.request().method()!=='GET'&&/categor/i.test(u.pathname)){ last={st:r.status(),path:u.pathname,req:r.request().postData(),body:(await r.text()).slice(0,300)}; }}catch(e){}});
const names=['Uncategorized',' Uncategorized','Uncategorized ','UNCATEGORIZED','uncategorized','  uNcAtEgOrIzEd  ','Uncategorized ',' Uncategorized','Uncategorized​'];
await s.go('/administration/categories'); await p.waitForTimeout(1200);
let i=0;
for(const n of names){ i++; last=null;
  const add=await s.box('new_category_button'); await p.mouse.click(add.x,add.y); await p.waitForTimeout(900);
  await p.fill('[data-test-id="category_name_input"]',n); await p.waitForTimeout(300);
  const sv=await s.box('category_save_button'); await p.mouse.click(sv.x,sv.y); await p.waitForTimeout(2200);
  const msg=await p.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-field__messages,.q-dialog .text-negative,[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));
  const open=await p.evaluate(()=>!!document.querySelector('.q-dialog'));
  await p.screenshot({path:`/tmp/qa9138/add-${i}.png`});
  res.push({i,name:JSON.stringify(n),resp:last,msg,dialogStillOpen:open}); console.log(j(res.at(-1),700)); fs.writeFileSync('/tmp/qa9138/add-results.json',JSON.stringify(res,null,1));
  if(open){ const c=await s.box('button_close_dialog'); if(c) await p.mouse.click(c.x,c.y); await p.waitForTimeout(800);} 
  await s.go('/administration/categories'); await p.waitForTimeout(800);
}
fs.writeFileSync('/tmp/qa9138/add-results.json',JSON.stringify(res,null,1));
const a=await s.api('/api/parts-catalogue/categories-list?search=&pagination%5BrowsPerPage%5D=500&pagination%5Bpage%5D=1'); const c=a.json.data.collection;
console.log('total',c.length, JSON.stringify(c.filter(x=>/uncateg/i.test(x.name)).map(x=>[JSON.stringify(x.name),x.id,x.isDefault,x.deletable,x.editable])));
await s.close();
