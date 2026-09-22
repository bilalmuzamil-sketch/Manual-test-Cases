import {boot} from '/tmp/prod9940/boot.mjs';
const ID='0085fddf-7299-49aa-b2f4-c40c98fbce71';
const {b,p}=await boot('/parts/inventory');
console.log('URL:', p.url());
// find the header labels of the inventory table
const heads=await p.$$eval('th, [role=columnheader]', e=>e.map(x=>x.innerText.trim()).filter(Boolean)).catch(()=>[]);
console.log('HEADERS:', JSON.stringify(heads));
// locate our part's row
const row=await p.evaluate((id)=>{
  const el=document.querySelector(`[data-test-id="button_part_history_${id}"]`);
  if(!el) return null;
  const tr=el.closest('tr'); if(!tr) return null;
  return {cells: [...tr.querySelectorAll('td')].map(t=>t.innerText.trim()), y: tr.getBoundingClientRect().y};
}, ID);
console.log('ROW:', JSON.stringify(row));
await p.screenshot({path:'/tmp/sv8447/disc-list.png'});
await b.close();
