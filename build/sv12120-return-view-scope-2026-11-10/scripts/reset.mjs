import {sess} from './common.mjs'; import fs from 'fs';
const pw=fs.readFileSync('/tmp/sv12120/orgb-pw','utf8').trim(), tok=fs.readFileSync('/tmp/sv12120/token','utf8').trim(), em='bilal.muzamil+sv12120b@shopview.com';
const s=await sess();
const r=await s.api('/api/reset-password?username='+encodeURIComponent(em)+'&token='+tok,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({new_password:pw,confirmed_password:pw})});
console.log('reset',r.status,JSON.stringify(r.json).slice(0,200));
const l=await s.api('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:em,password:pw})});
console.log('login',l.status,JSON.stringify(l.json).slice(0,200));
const o=await s.api('/api/staff/my-workplaces'); console.log('wp',o.status,JSON.stringify(o.json).slice(0,200));
await s.close(); process.exit(0);
