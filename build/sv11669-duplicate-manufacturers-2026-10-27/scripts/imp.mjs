// node imp.mjs <tag> <csv> [prod]
import {sess} from './lib.mjs'; import fs from 'fs';
const [tag,csv]=process.argv.slice(2); const s=await sess('admin',{vp:{width:1400,height:950},dpr:2}); const P=s.page; const out={tag};
const norm=x=>String(x??'').trim().toLowerCase().replace(/\s+/g,' ');
const list=async()=>Object.values((await s.api('/api/parts-catalogue/manufacturers')).json?.data||{}).find(Array.isArray)||[];
const summ=a=>{const c={}; a.forEach(m=>c[norm(m.label)]=(c[norm(m.label)]||0)+1); return {total:a.length,blank:c['']||0,dupes:Object.entries(c).filter(([k,v])=>v>1),accuride:c['accuride']||0,dayco:c['dayco']||0,hdb:c['heavy duty brand']||0,hdb_labels:a.filter(m=>norm(m.label)==='heavy duty brand').map(m=>JSON.stringify(m.label))};};
out.before=summ(await list());
await s.go('/administration/inventory-import'); await P.waitForTimeout(2000);
await P.setInputFiles('input[type=file]',csv); await P.waitForTimeout(2500); await P.screenshot({path:`../ev/${tag}-1-preview.png`,fullPage:true});
out.preview=(await P.evaluate(()=>document.querySelector('.q-page')?.innerText||'')).replace(/\n+/g,' | ').slice(0,1200);
const sb=await s.box('button_submit_file'); if(sb){await P.mouse.click(sb.x,sb.y); await P.waitForTimeout(3000);}
await P.screenshot({path:`../ev/${tag}-2-mapping.png`,fullPage:true});
out.step2=(await P.evaluate(()=>document.querySelector('.q-page')?.innerText||'')).replace(/\n+/g,' | ').slice(0,1500);
await P.evaluate(()=>{window.__sent=[];const enc=async b=>{ if(b instanceof FormData){const o=[];for(const [k,v] of b.entries()){o.push(k+'='+(v instanceof Blob? 'FILE:'+JSON.stringify(await v.text()):JSON.stringify(v)));}return o.join('&');} return typeof b==='string'?b:String(b);};
 const of=window.fetch; window.fetch=async(u,i)=>{ if(/import/.test(String(u))) window.__sent.push(String(u)+' '+await enc(i&&i.body)); return of(u,i);};
 const os=XMLHttpRequest.prototype.send, oo=XMLHttpRequest.prototype.open; XMLHttpRequest.prototype.open=function(m,u){this.__u=u; return oo.apply(this,arguments);}; XMLHttpRequest.prototype.send=function(b){ if(/import/.test(String(this.__u))){ const u=this.__u; enc(b).then(x=>window.__sent.push(u+' '+x)); } return os.apply(this,arguments);};});
const resp=[]; P.on('response',async r=>{if(/import/.test(r.url())&&r.request().method()!=='GET') resp.push(r.status()+' '+r.url().split('/api')[1]+' '+(await r.text().catch(()=>'')).slice(0,300));});
const ib=await P.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>/Import Inventory/i.test(b.innerText)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
out.import_button=!!ib; if(ib){await P.mouse.click(ib.x,ib.y); await P.waitForTimeout(12000);}
out.sent=await P.evaluate(()=>window.__sent); out.responses=resp;
out.after_text=(await P.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-dialog,.q-page')].map(e=>e.innerText).join(' | '))).replace(/\n+/g,' | ').slice(0,600);
await P.screenshot({path:`../ev/${tag}-3-after.png`});
out.after=summ(await list());
const parts=[]; for(let i=1;i<=9;i++){const pn=(process.env.PNPFX||'QA-11669-IMP-')+i; const p=await s.api(`/api/parts-catalogue/catalogue-parts?pagination[rowsPerPage]=5&pagination[page]=1&search=${pn}`); const r=(Object.values(p.json?.data||{}).find(Array.isArray)||[]).filter(x=>x.part_number===pn); parts.push({pn,count:r.length,manufacturer:r.map(x=>x.manufacturer_name),mid:r.map(x=>(x.manufacturer_id||'').slice(0,8)),category:r.map(x=>x.category_label)});}
out.parts=parts; console.log(JSON.stringify(out,null,1).slice(0,5000)); fs.writeFileSync(`../data/${tag}.json`,JSON.stringify(out,null,1));
await s.browser.close(); process.exit(0);
