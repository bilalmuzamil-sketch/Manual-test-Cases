import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export async function sess(quick='admin',opts={}){
  const s=await open(Object.assign({env:'branch',ticket:'11253',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick,dir:'/tmp/qa21',vp:{width:1600,height:1100},dpr:1},opts));
  s.J=(p,b,m='POST')=>s.api(p,{method:m,headers:{'content-type':'application/json'},body:JSON.stringify(b)});
  s.L=(t,r)=>console.log(t,r.status,JSON.stringify(r.json??r.text).slice(0,300));
  s.rows=async wo=>{const r=await s.api('/api/work-orders/lines/'+wo); return (r.json?.data?.collection||[]).map(l=>({line:l.line_name, lid:l.line_id, tasks:(l.tasks||[]).map(t=>({id:t.id||t.task_id, tech:t.tech_assigned_id, name:((t.first_name||'')+' '+(t.last_name||'')).trim()||'(Unassigned)', exists:t.tech_exists, time:t.logged_time_decimal, origin:t.origin??t.source??null}))}));};
  return s;
}
export const st=JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/sv11253-move-labour-stray-row-2026-10-27/data/staff.json'));
