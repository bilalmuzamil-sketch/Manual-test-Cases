import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(4000);
const tids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>!/row_|cell_/.test(t)));
console.log('tids:',[...new Set(tids)].slice(0,80).join(' '));
// find the bundle files and grep for orderId usage
const srcs=await p.evaluate(()=>[...document.scripts].map(s=>s.src).filter(Boolean));
console.log('scripts',srcs.length);
const prefs=await s.api('/api/users/me/preferences/work-orders-list'); console.log('prefs',JSON.stringify(prefs.json).slice(0,900));
process.exit(0);
