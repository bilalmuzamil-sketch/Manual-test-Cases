import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
const res=await s.page.evaluate(async(api)=>{for(let pg=1;pg<200;pg++){const r=await fetch(api+`/api/technician-tasks/list?pagination[page]=${pg}&pagination[rowsPerPage]=100`,{credentials:'include'}); const j=await r.json(); const L=j?.data?.collection||[]; if(!L.length) return {pg,none:true}; const e=L.find(x=>x.id==='7a42170f-9461-40cb-8f1a-ecba3307ea7e'); if(e) return {pg,e};} return {none:true};},s.host.api);
console.log(JSON.stringify(res).slice(0,900));
fs.writeFileSync('../data/brett-entry-now.json',JSON.stringify(res,null,1));
await s.browser.close(); process.exit(0);
