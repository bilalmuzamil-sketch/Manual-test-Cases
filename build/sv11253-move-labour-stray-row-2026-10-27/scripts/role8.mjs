import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
for(const env of ['staging','prod']){
  const s=await open({env,cookies:env==='staging'?JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')):null,user:'bilal.muzamil@shopview.com',quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
  const r=await s.api('/api/fe-permissions'); const t=JSON.stringify(r.json??r.text); const n=[...t.matchAll(/"code":"([^"]+)"/g)].map(m=>m[1]);
  const me=await s.api('/api/auth/me/fe-permissions');
  console.log(env,r.status,'catalogue',n.length,'has woMoveLabor',n.includes('woMoveLabor'),'| me has',(me.json?.data?.fe_permissions||[]).includes('woMoveLabor'), 'url',s.page.url());
  await s.browser.close();
}
process.exit(0);
