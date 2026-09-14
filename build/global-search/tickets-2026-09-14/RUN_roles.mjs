// The twelve role-gated cases of run 415 (C45142-C45151, C45159, C53589).
//
// Each asks the same shape of question: a user WITHOUT some permission must not see that type in
// global search. The blocker was "we can only sign in as Admin or Tech" -- quick-login offers exactly
// those two. The playbook's §G gives the route, least invasive first:
//   1. IMPERSONATE an existing holder -- POST /api/switch-user {user_id} -- mutates nothing.
//   2. Else SWAP the role on the Tech quick-login user and restore it afterwards.
// Rule 107 authorises both on a QA branch. The QA lead's standing constraint protects the ADMIN
// staff user; it is never touched here, and this script refuses to act on any staff row whose email
// is not an EXACT match for the Tech user.
//
// TRAP from the playbook, and it is why each role is exercised in its own browser session: swapping
// Tech's role MID-SESSION bounces the SPA to /no-location, which looks like a permission result and
// is a technique artifact. Role changes also force re-auth (409 "Session has expired"), which is
// expected, not a blocker.
//
// PASS 1 (default) READS ONLY: it enumerates roles and holders and writes the plan it WOULD run.
// Set ACT=1 to execute. Restoration is registered before the first change and re-asserted at the end.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const ACT=process.env.ACT==='1';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const STATE=`${DIR}/ROLES-RESULTS.json`;
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString()};
const save=()=>fs.writeFileSync(STATE,JSON.stringify(R,null,1));

// What each case needs the signed-in user to be able to -- and not able to -- see.
const NEEDS=[
 {id:45142, want:'a user WITHOUT Work Orders access', hide:['work_orders']},
 {id:45143, want:'a Part-Sales-only user',            hide:['parts','vendors'], show:['part_sales']},
 {id:45144, want:'a user WITHOUT Catalog & Inventory',hide:['parts']},
 {id:45145, want:'a user WITHOUT Vendor & Order Mgmt',hide:['vendors']},
 {id:45146, want:'a user WITHOUT Customers access',   hide:['customers','assets']},
 {id:45147, want:'a Time Clock user',                 hide:['work_orders','customers','assets','parts','vendors','part_sales','purchase_orders','vendor_invoices']},
 {id:45148, want:'a user without an unrecognised type permitted', hide:[]},
 {id:45149, want:'a user who lost access to a recent item',       hide:[]},
 {id:45150, want:'any user -- other organisations must never appear', hide:[]},
 {id:45151, want:'any user -- other locations must not appear',   hide:[]},
 {id:45159, want:'a user with NO default workplace',              hide:[]},
 {id:53589, want:'any user -- typing must not be lost while loading', hide:[]},
];

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,300)};
  }catch(e){ return {error:String(e).slice(0,120)}; }},[`https://${APIH}${p}`,method,body]);
const rows=(r)=>{ const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  return Array.isArray(d)?d:((d&&(d.collection||d.roles||d.staff))||[]); };

const org=await page.evaluate(()=>{try{const u=JSON.parse(localStorage.getItem('user')||'null');
  const d=u&&u.data; return (d&&(d.organization_id||(d.organization&&d.organization.id)))||null;}catch(e){return null;}});
R.organizationId=org;

const rolesR=org?await api(`/api/organizations/${org}/roles`):{status:'no org id'};
R.roles=rows(rolesR).map(x=>({id:x.id,name:x.name,default:x.default,editable:x.editable,users:x.usersCount}));
const staffR=await api('/api/staff?limit=200');
R.staff=rows(staffR).map(x=>({id:x.id,email:x.email,name:[x.first_name,x.last_name].filter(Boolean).join(' '),
  role:x.role_label||(x.role&&x.role.name)||null, roleId:(x.role&&x.role.id)||x.role_id||null}));
R.rolesStatus=rolesR.status; R.staffStatus=staffR.status;
save();
L(`roles: ${R.roles.length} (status ${rolesR.status})   staff: ${R.staff.length} (status ${staffR.status})`);

// Which role can serve each case, and is anyone holding it? An existing holder means impersonation,
// which changes nothing and needs no restore.
const byName=(re)=>R.roles.find(r=>re.test(r.name||''));
const holders=(roleId)=>R.staff.filter(s=>s.roleId===roleId);
R.plan=NEEDS.map(n=>{
  const guesses={45142:/tech|time ?clock|parts|inventory/i, 45143:/part ?sale/i, 45144:/office|service|tech/i,
    45145:/office|tech|service/i, 45146:/tech|time ?clock/i, 45147:/time ?clock/i}[n.id];
  const role=guesses?byName(guesses):null;
  const hs=role?holders(role.id):[];
  return {case:'C'+n.id, needs:n.want, hide:n.hide, show:n.show||[],
    candidateRole:role?{id:role.id,name:role.name}:null,
    holders:hs.map(h=>({id:h.id,email:h.email,name:h.name})),
    route: hs.length?'impersonate an existing holder (mutates nothing)'
         : role?'swap the Tech user onto this role, then restore'
         : 'no obvious existing role -- needs a custom role, or the case is not role-shaped'};
});
save();
console.log(JSON.stringify({roles:R.roles.map(r=>r.name), plan:R.plan.map(p=>
  ({case:p.case, role:p.candidateRole&&p.candidateRole.name, holders:p.holders.length, route:p.route}))},null,1));

if(!ACT){ L('READ-ONLY pass. Nothing changed. Set ACT=1 to execute the plan above.'); }
await browser.close();
