// Reads IBS settings, location mappings and IBS customers (read-only).
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const H=env==='prod'?{headers:{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'}}:{};
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const p=s.page; const seen=[]; p.on('response',async r=>{ if(/\/api\/.*ibs/i.test(r.url())) seen.push(r.status()+' '+r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,400)); });
console.log('settings',JSON.stringify((await s.api('/api/ibs/settings',H)).json).slice(0,400));
await s.go('/administration/ibs'); await p.waitForTimeout(6000); console.log('page text',(await p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\s+/g,' ').slice(0,700))));
console.log(seen.join('\n'));
const c=await s.api('/api/customers?limit=200&search=',H); const L=c.json?.data?.collection||[]; const ibs=L.filter(x=>JSON.stringify(x).match(/"ibs[a-z_]*":"?[A-Za-z0-9]/i)); console.log('customers',L.length,'with ibs field',ibs.length, ibs.slice(0,4).map(x=>x.name+' '+JSON.stringify(x).match(/"ibs[a-z_]*":"?[^,]*/gi)).join(' | '));
console.log('ibs objects',L.filter(x=>x.ibs).slice(0,3).map(x=>x.name+' '+JSON.stringify(x.ibs)).join(' | '));
await s.close(); process.exit(0);
