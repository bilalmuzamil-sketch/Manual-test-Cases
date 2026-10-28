// node pagebtns.mjs <env> <path> [clickText] — buttons by text + test-ids, screenshot
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,path,clickText]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
await s.go(path); await p.waitForTimeout(7000);
const B=()=>p.evaluate(()=>[...document.querySelectorAll('button,[role=button],a.q-btn,[data-test-id]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.x>230;}).map(e=>(e.getAttribute('data-test-id')||'-')+'|'+(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,30)).filter((v,i,a)=>a.indexOf(v)===i).join(' ; '));
console.log('URL',p.url()); console.log('btns',(await B()).slice(0,2000));
if(clickText){ await p.getByText(clickText,{exact:false}).first().click(); await p.waitForTimeout(3500); console.log('after',(await B()).slice(0,2000)); }
await p.screenshot({path:'/tmp/s10928/pagebtns.png'}); await s.close(); process.exit(0);
