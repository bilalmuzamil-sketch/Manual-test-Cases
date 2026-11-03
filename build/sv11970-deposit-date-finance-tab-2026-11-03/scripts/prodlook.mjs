import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900}});
console.log(JSON.stringify(await s.marker()));
const w=await s.api('/api/workplaces'); const c=w.json?.data?.collection||w.json?.data||[];
for(const x of c) console.log(x.id,'|',x.name,'|',x.timezone);
const me=await s.api('/api/staff/my-workplaces'); console.log('mine',JSON.stringify(me.json).slice(0,600));
await s.close(); process.exit(0);
