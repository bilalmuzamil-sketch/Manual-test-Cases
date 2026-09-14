// Find this branch's ROLE list. The first attempt read the organisation id out of localStorage,
// found nothing there, and skipped the roles call entirely -- so "0 roles" was a fact about where I
// looked, not about the branch. Try the places the id actually lives, and the role routes the
// playbook records, and report which combination answered.
//
// Why it matters: three role cases need a permission set nobody currently holds -- a part-sales-only
// user, a time-clock user, a user with no default workplace. Rule 107 allows creating a role and
// assigning it on a QA branch; this establishes what already exists first, so nothing is created
// that is not needed.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p)=>page.evaluate(async(u)=>{
  try{ const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,200)};
  }catch(e){ return {error:String(e).slice(0,120)}; }}, `https://${APIH}${p}`);
const out={at:new Date().toISOString()};

// where does the organisation id actually live?
out.idSources=await page.evaluate(()=>{
  const g=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
  const u=g('user'), w=g('fe_permissions_wrapper');
  const dig=(o,d=0)=>{ if(!o||typeof o!=='object'||d>3) return [];
    return Object.entries(o).flatMap(([k,v])=>
      /organi[sz]ation|org_id|orgId|company_id|workplace/i.test(k)&&(typeof v==='string'||typeof v==='number')
        ? [[k,String(v)]] : (typeof v==='object'?dig(v,d+1):[]));};
  return {fromUser:dig(u), fromWrapper:dig(w), localStorageKeys:Object.keys(localStorage)};});

const me=await api('/api/auth/me');
out.me={status:me.status, head:(me.head||'').slice(0,200)};
if(me.json){ const d=me.json.data||me.json;
  out.meOrg=Object.entries(d).filter(([k])=>/organi[sz]ation|org/i.test(k)).slice(0,6); }

const candidates=[...new Set([
  ...(out.idSources.fromUser||[]).map(x=>x[1]),
  ...(out.idSources.fromWrapper||[]).map(x=>x[1]),
  ...((out.meOrg||[]).map(x=>typeof x[1]==='string'?x[1]:(x[1]&&x[1].id)).filter(Boolean)),
])].filter(v=>/^[0-9a-f-]{8,}$/i.test(String(v)));
out.orgCandidates=candidates;

const routes=['/api/roles','/api/role-templates','/api/iam/roles','/api/organizations/roles',
  ...candidates.map(c=>`/api/organizations/${c}/roles`)];
out.routes={};
for(const r of routes){ const res=await api(r);
  const d=res.json&&(res.json.data!==undefined?res.json.data:res.json);
  const list=Array.isArray(d)?d:((d&&(d.collection||d.roles))||null);
  out.routes[r]={status:res.status, n:Array.isArray(list)?list.length:null,
    roles:Array.isArray(list)?list.map(x=>({id:x.id,name:x.name,users:x.usersCount,
      editable:x.editable, default:x.default})):null,
    head:Array.isArray(list)?undefined:(res.head||'').slice(0,120)};
  if(Array.isArray(list)&&list.length){ out.workingRoute=r; out.roles=out.routes[r].roles; break; } }

fs.writeFileSync(`${DIR}/ROLES-LIST.json`, JSON.stringify(out,null,1));
console.log(JSON.stringify({workingRoute:out.workingRoute||'none answered',
  roles:(out.roles||[]).map(r=>`${r.name} (${r.users} users${r.editable?'':', locked'})`),
  triedStatuses:Object.fromEntries(Object.entries(out.routes).map(([k,v])=>[k,v.status]))},null,1));
await browser.close();
