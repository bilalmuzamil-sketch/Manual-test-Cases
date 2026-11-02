import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const out=await s.page.evaluate(async()=>{const r=[]; for(const n of ['MovePartToLineDialog.BUXNiZil.js','MoveLabourToLineDialog.7rJ98rTt.js']){const t=await (await fetch('/js/'+n)).text(); r.push(n+' '+t.length); for(const m of t.matchAll(/.{0,160}(move|work_order|workOrder|search|api)[a-zA-Z\-\/]*.{0,160}/g)) r.push('  '+m[0]);} return r;});
console.log([...new Set(out)].slice(0,60).join('\n'));
process.exit(0);
