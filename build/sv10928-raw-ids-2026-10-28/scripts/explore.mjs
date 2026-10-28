// node explore.mjs <env> <path> [<path> ...]  — lists visible clickables (text | test-id | aria) per page
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const paths=process.argv.slice(3);
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
for(const p of paths){ await s.go(p); await s.page.waitForTimeout(2500);
  const L=await s.page.evaluate(()=>[...document.querySelectorAll('button,a,[role=button],[role=tab],.q-tab,[data-test-id]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.y<2400;})
    .map(e=>{const t=(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,40); return [t,e.getAttribute('data-test-id')||'',e.getAttribute('aria-label')||''].filter(Boolean).join('|');}).filter(x=>x&&x.length<120));
  console.log('==',p,'->',s.page.url().replace(s.host.app,'')); console.log([...new Set(L)].slice(0,90).join(' ;; ')); }
await s.close();
