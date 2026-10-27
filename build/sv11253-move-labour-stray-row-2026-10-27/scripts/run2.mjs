import {sess} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('../data/wo1.json')); const [A,B,C]=W.lines;
const snap=async(s,tag)=>{const r=await s.rows(W.wo); console.log('['+tag+']'); for(const l of r) console.log('  '+l.line.trim()+': '+l.tasks.map(x=>x.name+' '+x.time+'h').join(', ')); return r;};
const s=await sess(); await snap(s,'before move');
// exactly what the dialog sends: tasks = selected technician entries of the source line, line_id = target, workOrderId
let r=await s.api('/api/work-orders/lines/'+W.wo); const la=r.json.data.collection.find(l=>l.line_id===A);
const tasks=la.tasks.filter(t=>t.tech_assigned_id).map(t=>({...t,id:t.id,name:`${t.first_name} - ${t.last_name}`,tech_assigned_id:t.tech_assigned_id}));
r=await s.J('/api/work-orders/tasks/move',{tasks,line_id:B,workOrderId:W.wo}); s.L('move',r);
await snap(s,'after move line 1 -> line 2');
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_number_'+B); await s.page.waitForTimeout(1500);
await s.page.screenshot({path:'../ev/raw-3-after-move.png'});
await s.browser.close(); process.exit(0);
