// open A/R Collection, list test-ids + report requests
import {sess} from './common.mjs'; import fs from 'fs';
const REP=process.env.REP||'ar-aging-collection';
const s=await sess(); const p=s.page; const reqs=[]; p.on('request',r=>{ if(/\/api\/(reports|accounting|aging|ar|ap)/.test(r.url())) reqs.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'').slice(0,200)); });
console.log('marker',JSON.stringify(await s.marker()));
await s.go('/reports/'+REP); await p.waitForTimeout(8000);
const tids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>')))].slice(0,120));
console.log(tids.join(' '));
console.log(reqs.join('\n'));
await p.screenshot({path:'../ev/probe-'+REP+'.png'}); await s.close(); process.exit(0);
