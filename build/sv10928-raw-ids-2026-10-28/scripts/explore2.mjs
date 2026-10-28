import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,path]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
const reqs=[]; s.page.on('request',r=>{ if(/\/api\//.test(r.url())&&r.method()==='GET') reqs.push(r.url().replace(/^https:\/\/[^/]+/,'').slice(0,160)); });
await s.go(path); await s.page.waitForTimeout(6000);
console.log('hrefs',[...new Set(await s.page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>!/^#|^http/.test(h))))].slice(0,40).join(' '));
console.log('reqs',[...new Set(reqs)].join('\n'));
await s.close(); process.exit(0);
