// node kinds.mjs <mode:admin|userId> <action:toggle|observe> <outdir> [kinds,comma]
import {open} from '/tmp/qa9667/qa-session-q.mjs';
import {C} from '/tmp/qa9667/lib.mjs'; import fs from 'fs';
const [MODE,ACT,OUT,KS]=process.argv.slice(2); fs.mkdirSync(OUT,{recursive:true});
const F=JSON.parse(fs.readFileSync('/tmp/qa9667/p3/fixtures.json')); const kinds=(KS||Object.keys(F).join(',')).split(',');
const s=await open({env:'branch',ticket:'9667',dir:'/tmp/qa9667',cookies:C,quick:(MODE==='tech'?'tech':'admin'),vp:{width:1600,height:1000},dpr:2});
const pg=s.page, R={mode:MODE,act:ACT,kinds:{}}; let net=[];
pg.on('response',async r=>{try{const u=new URL(r.url()); if(/\/api\/note\/update-attachment/.test(u.pathname)) net.push({st:r.status(),body:r.request().postData(),resp:(await r.text()).slice(0,200)});}catch(e){}});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
if(MODE!=='admin'&&MODE!=='tech'){R.switch=(await post('/api/switch-user',{user_id:MODE})).status; await s.go('/workorders'); }
const fe=await s.api('/api/auth/me/fe-permissions'); R.who={slug:fe.json?.data?.template_slug,n:(fe.json?.data?.fe_permissions||[]).length,perms:(fe.json?.data?.fe_permissions||[]).filter(p=>/workOrder|partSale|customer|vehicle|asset/i.test(p))};
R.spa=await pg.evaluate(()=>{try{const w=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');const u=JSON.parse(localStorage.getItem('user')||'{}');return {n:(w.fe_permissions||[]).length,perms:(w.fe_permissions||[]).filter(p=>/workOrder|partSale|customer/i.test(p)),user:(u.data?.first_name||u.data?.firstName||'')+' '+(u.data?.last_name||u.data?.lastName||''),email:u.data?.email,nav:[...document.querySelectorAll('header a, nav a')].map(a=>a.innerText.trim()).filter(Boolean).slice(0,8)};}catch(e){return String(e)}});
R.version=await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
const flag=async(o)=>{const n=await s.api('/api/notes?search=&filters[0][field]=status&filters[0][operator]=neq&filters[0][value]=deleted&pagination[sortBy]=created_at&pagination[descending]=true&pagination[rowsPerPage]=40&pagination[page]=1');const nn=(n.json?.data?.notes||[]).find(x=>x.id===o.noteId);return nn?nn.attachments?.find(a=>a.id===o.att)?.forCustomer:'note-not-visible';};
const find=async(o)=>{const sel=`[data-test-id="checkbox_attachment_for_customer_${o.att}"]`;
  if(await pg.waitForSelector(sel,{timeout:8000}).catch(()=>null)) return sel;
  for(const t of ['link_notes_tab','tab_notes','vehicle_tab_notes','route_tab_notes']){const e=await pg.$(`[data-test-id="${t}"]`); if(e){await e.click().catch(()=>{}); break;}} if(await pg.waitForSelector(sel,{timeout:12000}).catch(()=>null)) return sel;
  return null;};
const st=(o)=>pg.evaluate(([att,note])=>{const R=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom].map(Math.round);};
  const cb=document.querySelector(`[data-test-id="checkbox_attachment_for_customer_${att}"]`); if(!cb) return {present:false};
  cb.scrollIntoView({block:'center'}); const card=document.querySelector(`[data-test-id="note_attachment_card_${att}"]`); const nc=document.querySelector(`[data-test-id="note_card_${note}"]`);
  return {present:true,aria:cb.getAttribute('aria-checked'),ariaDis:cb.getAttribute('aria-disabled'),disCls:/disabled|disable/.test(cb.className),tab:cb.getAttribute('tabindex'),cbR:R(cb),cardR:card?R(card):null,noteR:nc?R(nc):null,label:cb.innerText.trim()};},[o.att,o.noteId]);
for(const k of kinds){const o=F[k]; const r={}; net=[];
  await s.go(o.link); const sel=await find(o); r.url=pg.url();
  if(!sel){r.present=false; r.apiFlag=await flag(o); await pg.screenshot({path:`${OUT}/${k}-0-notfound.png`}); R.kinds[k]=r; console.log(k,'NOT FOUND on',r.url,'apiFlag',r.apiFlag); continue;}
  await pg.waitForTimeout(600); r.a=await st(o); r.flag0=await flag(o); await pg.screenshot({path:`${OUT}/${k}-1-before.png`});
  const c=r.a.cbR; await pg.mouse.click(c[0]+12,(c[1]+c[3])/2); await pg.waitForTimeout(2500);
  r.b=await st(o); r.netClick=[...net]; await pg.screenshot({path:`${OUT}/${k}-2-after-click.png`});
  if(ACT==='observe'){ r.apiTry=await post('/api/note/update-attachment',{id:o.att,forCustomer:!(r.flag0===true)}); r.apiTry={st:r.apiTry.status,body:JSON.stringify(r.apiTry.json).slice(0,200)}; }
  await pg.reload({waitUntil:'commit'}); await find(o); await pg.waitForTimeout(800); r.c=await st(o); r.flag1=await flag(o); await pg.screenshot({path:`${OUT}/${k}-3-after-reload.png`});
  R.kinds[k]=r;
  console.log(k,'| before',r.a.aria,'dis',r.a.ariaDis,r.a.disCls,'| click->',r.b.aria,'net',JSON.stringify(r.netClick.map(n=>n.st+' '+n.body+' '+n.resp)),'| api',JSON.stringify(r.apiTry||''),'| reload',r.c.aria,'| apiFlag',r.flag0,'->',r.flag1);
}
R.version2=await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content); R.at=new Date().toISOString();
fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); console.log('spa',JSON.stringify(R.spa),'who',JSON.stringify(R.who),'ver',R.version,R.version2,R.at); await s.close();
