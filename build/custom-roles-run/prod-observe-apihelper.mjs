import fs from 'fs';
const SID='<PROD_PHPSESSID_FROM_TMP>';
const BASE='https://api.shopview.com';
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const H=()=>({'Cookie':'PHPSESSID='+SID,'User-Agent':UA,'Accept':'application/json','Origin':'https://app.shopview.com','Referer':'https://app.shopview.com/'});
export async function papi(method,path,body){
  const opts={method,redirect:'manual',headers:H()};
  if(body!==undefined){opts.headers['Content-Type']='application/json';opts.body=JSON.stringify(body);}
  const r=await fetch((path.startsWith('http')?path:BASE+path),opts);
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{}
  return {status:r.status, body:j??t};
}
if(import.meta.url===`file://${process.argv[1]}`){
  const roles=await papi('GET','/api/iam/list-roles');
  fs.writeFileSync('/tmp/custom-roles/prod2-roles.json',JSON.stringify(roles.body));
  const staff=await papi('GET','/api/staff?page=1');
  fs.writeFileSync('/tmp/custom-roles/prod2-staff.json',JSON.stringify(staff.body));
  const wos=await papi('GET','/api/work-orders?page=1');
  fs.writeFileSync('/tmp/custom-roles/prod2-wos.json',JSON.stringify(wos.body));
  const org=await papi('GET','/api/organizations/settings');
  console.log('roles',roles.status,'staff',staff.status,'wos',wos.status,'org',org.status);
  console.log('orgId', org.body?.data?.organizationId || org.body?.organizationId);
}
