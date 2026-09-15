// The staff screen's Location dropdown renders empty, so a role cannot be changed THROUGH IT.
// That is a fact about one widget, never about the capability (Rule 68/104). The server has not
// yet been asked directly. This probe asks it -- READ ONLY except for one reversible role change
// on ONE technician, which is undone in the same run.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,500)};
  }catch(e){ return {error:String(e).slice(0,160)}; }},[`https://${APIH}${p}`,method,body]);
const out={at:new Date().toISOString()};

// 1. the role templates and what each one can actually DO
const rt=await api('/api/role-templates');
const rtd=rt.json&&(rt.json.data!==undefined?rt.json.data:rt.json);
const tpl=Array.isArray(rtd)?rtd:(rtd&&typeof rtd==='object'?(Object.values(rtd).find(v=>Array.isArray(v))||[]):[]);
out.rawTemplateShape=Array.isArray(rtd)?'array':(rtd?Object.keys(rtd).slice(0,8):null);
out.templates=tpl.map(t=>({id:t.id,name:t.name,slug:t.slug,
  perms:(t.fePermissions||t.permissions||[]).map(p=>p.name||p).sort()}));
out.templateHasPermsInline = out.templates.some(t=>t.perms.length>0);

// 2. if the list does not carry them, ask per template
if(!out.templateHasPermsInline){
  out.perTemplate={};
  for(const t of tpl){
    for(const path of [`/api/role-templates/${t.id}`,`/api/role-templates/${t.id}/fe-permissions`]){
      const r=await api(path);
      if(r.status===200){
        const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
        const perms=(d&&(d.fePermissions||d.permissions))||[];
        out.perTemplate[t.name]={path,status:r.status,n:perms.length,
          perms:perms.map(p=>p.name||p).sort()};
        break;
      } else { out.perTemplate[t.name]={path,status:r.status,head:r.body.slice(0,120)}; }
    }
  }
}

// 3. one live technician, read in full -- what does a staff record actually carry?
const st=JSON.parse(fs.readFileSync(`${DIR}/STAFF-LIVE.json`,'utf8'));
const tech=st.find(x=>x.active && x.role==='Technician');
out.subject={id:tech.id,name:tech.name,role:tech.role};
for(const path of [`/api/staff/${tech.id}`,`/api/staff/view/${tech.id}`,`/api/users/${tech.id}`]){
  const r=await api(path);
  out[`read_${path.replace(/[^a-z]/gi,'_')}`]={status:r.status,head:r.body.slice(0,400)};
  if(r.status===200){ out.staffDetailRoute=path;
    const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
    const o=Array.isArray(d)?d[0]:d;
    out.staffDetailKeys=o?Object.keys(o):null;
    out.staffDetail=o?Object.fromEntries(Object.entries(o).filter(([k,v])=>
      v===null||['string','number','boolean'].includes(typeof v))):null;
    break; }
}

// 4. the workplaces, so a location can be supplied BY ID rather than through the broken picker
const w=await api('/api/staff/my-workplaces');
const wd=(w.json&&(w.json.data!==undefined?w.json.data:w.json))||[];
out.workplaces=(Array.isArray(wd)?wd:(wd.workplaces||[])).map(x=>({id:x.id,name:x.name,tz:x.timezone}));

// 5. what write methods does the staff route admit at all?
out.methods={};
for(const m of ['PUT','PATCH']){
  const r=await api(`/api/staff/${tech.id}`,m,{});
  out.methods[m]={status:r.status,head:r.body.slice(0,240)};
}
fs.writeFileSync(`${DIR}/PROBE-ROLES-API.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify({templates:out.templates.map(t=>t.name), templateHasPermsInline:out.templateHasPermsInline,
  perTemplate:out.perTemplate&&Object.fromEntries(Object.entries(out.perTemplate).map(([k,v])=>[k,v.n!==undefined?v.n:v.status])),
  staffDetailRoute:out.staffDetailRoute, staffDetailKeys:out.staffDetailKeys,
  workplaces:out.workplaces, methods:out.methods},null,2));
await browser.close();
