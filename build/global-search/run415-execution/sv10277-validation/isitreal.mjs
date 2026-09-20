import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
const WORDS=['brake','filter','shoe','drum','hose','seal','valve','bearing','kit','pump','belt','light','clamp','bolt','gasket','sensor','mirror','hub','pad','wire','oil','fuel','air','water','tire','wheel','door','switch','cap','nut'];
let visibleStock=0, checkedStock=0;
console.log('A) PARTS: does an OUT OF STOCK part ever appear ABOVE an IN STOCK one?');
for(const w of WORDS){
  const r=await get('/api/search?q='+encodeURIComponent(w));
  const it=((r?.data?.groups||[]).find(g=>g.type==='parts')?.items||[]);
  if(it.length<3) continue;
  checkedStock++;
  for(let i=0;i<it.length;i++){
    const a=it[i].fields?.quantityOnHand;
    if(a!==0) continue;
    const below=it.slice(i+1).find(x=>(x.fields?.quantityOnHand??0)>0);
    if(below){ visibleStock++; console.log('   *** "'+w+'"  row '+(i+1)+' "'+String(it[i].primary).slice(0,40)+'" 0 Available  ABOVE  row '+(it.indexOf(below)+1)+' "'+String(below.primary).slice(0,40)+'" '+below.fields.quantityOnHand+' Available'); break; }
  }
}
console.log('   searches examined:',checkedStock,'| searches where out-of-stock outranks in-stock:',visibleStock);
console.log('');
console.log('B) COMPANIES/VENDORS: does a name that CONTAINS the word ever appear ABOVE one that STARTS with it?');
let visibleName=0, checkedName=0;
for(const w of ['truck','repair','diesel','trailer','service','mobile','heavy','fleet','auto','equipment','express','transport','logistics','freight','hauling','cartage','center','centre','sons','star']){
  const r=await get('/api/search?q='+encodeURIComponent(w));
  for(const t of ['customers','vendors']){
    const it=((r?.data?.groups||[]).find(g=>g.type===t)?.items||[]);
    if(it.length<3) continue;
    checkedName++;
    for(let i=0;i<it.length;i++){
      if(!(it[i].match?.field==='name' && it[i].match?.kind==='word')) continue;
      const below=it.slice(i+1).find(x=>x.match?.field==='name' && x.match?.kind==='prefix');
      if(below){ visibleName++; console.log('   *** "'+w+'" ['+t+']  row '+(i+1)+' "'+String(it[i].primary).slice(0,38)+'" (word inside)  ABOVE  row '+(it.indexOf(below)+1)+' "'+String(below.primary).slice(0,38)+'" (name starts with it)'); break; }
    }
  }
}
console.log('   lists examined:',checkedName,'| lists where "contains" outranks "starts with":',visibleName);
await browser.close();
