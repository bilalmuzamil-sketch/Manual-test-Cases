// usage: node flow.mjs <variant> <step>   steps run separately so each stays under the 2-minute limit
import {sess} from './lib.mjs'; import fs from 'fs';
const V=process.argv[2], STEP=process.argv[3]; const F=`../data/${V}.json`;
const D=fs.existsSync(F)?JSON.parse(fs.readFileSync(F)):{}; const save=()=>fs.writeFileSync(F,JSON.stringify(D,null,1));
const log=(...a)=>{console.log(...a); fs.appendFileSync(`../data/${V}.log`,a.join(' ')+'\n');};
const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
async function ui(s){
  s.click=async tid=>{const b=await s.box(tid); if(!b) throw new Error('no '+tid); await s.page.mouse.click(b.x,b.y);};
  s.pick=async re=>{await s.page.waitForTimeout(900); const bb=await s.page.evaluate(src=>{const re=new RegExp(src,'i'); const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.offsetParent&&re.test(x.innerText)); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText};},re.source); if(!bb) throw new Error('no option '+re); await s.page.mouse.click(bb.x,bb.y); return bb.t.replace(/\n/g,' ');};
  s.choose=async(tid,text)=>{await s.click(tid); await s.page.waitForTimeout(600); await s.page.keyboard.type(text.split(' ')[0],{delay:60}); await s.page.waitForTimeout(1200); const o=s.page.locator('.q-menu .q-item').filter({hasText:text}).first(); const got=(await o.innerText()).replace(/\n/g,' '); await o.click(); await s.page.waitForTimeout(700); const b=await s.box('dialog_title'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(400); return got+' -> box shows: '+(await s.page.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.innerText.replace(/\n/g,' '),tid));};
  s.rclick=async lid=>{await s.go(`/workorders/${D.wo}/lines`); await s.waitFor('line_number_'+lid); await s.page.waitForTimeout(800); const b=await s.box('line_number_'+lid); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(800);};
  return s;}
const snap=async(s,tag)=>{const r=await s.rows(D.wo); log('['+tag+']'); for(const l of r) log('  '+l.line.trim()+': '+l.tasks.map(x=>`${x.name} ${x.time}h${x.exists===false?' (tech_exists false)':''}`).join(', ')); D.snaps=D.snaps||{}; D.snaps[tag]=r; save(); return r;};
const shotLines=async(s,name)=>{await s.go(`/workorders/${D.wo}/lines`); await s.waitFor('line_number_'+D.lines[1]); await s.page.waitForTimeout(1800); await s.page.screenshot({path:`../ev/${V}-${name}.png`});
  const rects=await s.page.evaluate(ids=>{const top=id=>document.querySelector(`[data-test-id="line_number_${id}"]`).getBoundingClientRect().y; const ys=ids.map(top);
    const out={lines:ids.map((id,i)=>{const r=document.querySelector(`[data-test-id="line_number_${id}"]`).getBoundingClientRect(); return {i,x:r.x,y:r.y,w:r.width,h:r.height};}),labels:[]};
    for(const e of document.querySelectorAll('div,span,td')){ if(e.children.length) continue; const t=(e.innerText||'').trim(); if(!/^(Unassigned|Deleted user|[A-Z][a-z]+ [A-Z][A-Za-z]+)$/.test(t)) continue; const r=e.getBoundingClientRect(); if(!r.width) continue; out.labels.push({t,x:r.x,y:r.y,w:r.width,h:r.height});}
    const lab=[...document.querySelectorAll('div,span,td')].find(e=>!e.children.length&&(e.innerText||'').trim()==='Labor'); return out;},D.lines);
  fs.writeFileSync(`../ev/${V}-${name}.rects.json`,JSON.stringify(rects,null,1));};

if(STEP==='seed'){ const s=await sess();
  let r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=30'); let src=null;
  for(const w of r.json.data.work_orders){const v=(await s.api('/api/work-orders/view/'+w.id)).json?.data?.work_order; if(v?.vehicle?.id){src=v;break;}}
  r=await s.api('/api/work-orders/canned-lines?limit=300'); const cl=(r.json?.data?.collection||[]).filter(c=>!c.fixed_price&&c.labour_type_id&&!c.total_parts&&c.workplace_id===src.workplace_id);
  r=await s.J('/api/work-orders/create',{company_id:src.company_id,customer_id:src.customer_id,vehicle_id:src.vehicle.id,workplace_id:src.workplace_id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true,type:'service'});
  D.wo=r.json.data.work_order_id; D.lines=[];
  for(const c of cl.slice(0,3)){r=await s.J(`/api/work-orders/${D.wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'}); D.lines.push(r.json.data.line_id);}
  D.names=cl.slice(0,3).map(c=>c.canned_line_name); D.number=(await s.api('/api/work-orders/view/'+D.wo)).json.data.work_order.display_number; save();
  log(V,'seeded',D.number,JSON.stringify(D.names)); await snap(s,'0 seeded'); await s.browser.close();}

if(STEP==='start'||STEP==='stop'){ const L=D.lines[+process.argv[4]]; const t=await ui(await sess(process.env.WHO||'tech'));
  await t.go(`/workorders/${D.wo}/lines`); await t.waitFor('button_clock_toggle_task_'+L); await t.page.waitForTimeout(800);
  await t.click('button_clock_toggle_task_'+L);
  if(STEP==='stop'){await t.waitFor('button_clock_out'); await t.page.locator('[data-test-id="input_tech_story"] textarea, textarea[data-test-id="input_tech_story"]').first().fill('ZZAUTOTEST SV-11253 '+V); await t.click('button_clock_out');}
  await t.page.waitForTimeout(2500); log(V,STEP,'line',process.argv[4],t.writes.filter(w=>/technician|task|clock/.test(w)).map(w=>w.slice(0,160)).join(' || '));
  await t.page.screenshot({path:`../ev/${V}-${STEP}${process.argv[4]}.png`}); await t.browser.close();
  const s=await sess(); await snap(s,`after tech ${STEP} on line ${+process.argv[4]+1}`); await s.browser.close();}

if(STEP==='editlabor'){ const L=D.lines[+process.argv[4]]; const who=process.argv[5]; const s=await ui(await sess());
  await s.rclick(L); await s.click('menu-item_edit_labor'); await s.waitFor('select_technician'); for(const w of who.split(',')) log(V,'edit labor pick',await s.choose('select_technician',w));
  await s.click('button_save_labour'); await s.page.waitForTimeout(2500); await snap(s,`after Edit labor line ${+process.argv[4]+1} -> ${who}`); await s.browser.close();}

if(STEP==='move'){ const from=+process.argv[4], to=+process.argv[5]; const techs=process.argv[6].split(','); const s=await ui(await sess());
  await s.rclick(D.lines[from]); await s.page.screenshot({path:`../ev/${V}-move-menu.png`}); await s.click('menu-item_move_labor'); await s.waitFor('select_technician');
  for(const t of techs) log(V,'move tech',await s.choose('select_technician',t));
  await s.click('select_move_labour_target_line'); log(V,'target',await s.pick(new RegExp(esc(D.names[to].trim().slice(0,18)))));
  await s.page.waitForTimeout(600); await s.page.screenshot({path:`../ev/${V}-move-dialog.png`});
  await s.click('button_confirm_dialog'); await s.page.waitForTimeout(3000);
  log(V,'move writes',s.writes.filter(w=>/move/.test(w)).map(w=>w.slice(0,300)).join(' || '));
  await snap(s,`after Move labor line ${from+1} -> line ${to+1}`); await s.browser.close();}

if(STEP==='tsmove'){ const who=process.argv[4], from=+process.argv[5], to=+process.argv[6]; const s=await ui(await sess('admin',{vp:{width:2000,height:1100},dpr:+(process.env.DPR||1)}));
  await s.go(`/workorders/${D.wo}/timesheets`); await s.page.waitForTimeout(3000);
  const rows=await s.page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim())); log(V,'timesheet rows',JSON.stringify(rows));
  const tr=s.page.locator('tbody tr').filter({hasText:who}).filter({hasText:D.names[from].trim().slice(0,14)}).first(); await tr.hover(); await s.page.waitForTimeout(500);
  const eb=await s.page.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id="button_edit_timesheet"]')].find(x=>x.offsetParent); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
  await s.page.mouse.click(eb.x,eb.y); await s.waitFor('select_timesheet_line'); await s.click('select_timesheet_line'); log(V,'ts line',await s.pick(new RegExp(esc(D.names[to].trim().slice(0,18)))));
  await s.page.waitForTimeout(500); await s.page.screenshot({path:`../ev/${V}-ts-edit.png`});
  {const bb=await s.page.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(b=>b.innerText.trim()==='Save'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await s.page.mouse.click(bb.x,bb.y);} await s.page.waitForTimeout(3000);
  const ov=await s.box('button_confirm_overwrite_confirmation'); if(ov){log(V,'confirm overwrite shown'); await s.page.mouse.click(ov.x,ov.y); await s.page.waitForTimeout(3000);}
  log(V,'ts writes',s.writes.filter(w=>/technician-tasks/.test(w)).map(w=>w.slice(0,200)).join(' || '));
  await snap(s,`after timesheet move ${who} line ${from+1} -> line ${to+1}`); await shotLines(s,'lines-after-ts'); await s.browser.close();}

if(STEP==='shot'){ const s=await sess('admin',{vp:{width:2000,height:1100},dpr:+(process.env.DPR||1)}); await shotLines(s,process.argv[4]); await snap(s,'shot '+process.argv[4]); await s.browser.close();}
process.exit(0);
