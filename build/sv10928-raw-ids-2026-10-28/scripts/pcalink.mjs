// Punch Clock Activities opened from a link for a technician who doesn't exist: what does the Staff filter show?
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2); const fake='0badf00d-1234-4abc-8def-000000010928';
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
await s.go('/reports/punch-clock-activities?technicianId='+fake); await p.waitForTimeout(9000);
const r=await p.evaluate(f=>{ const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
  const hits=[...document.querySelectorAll('body *')].filter(e=>vis(e)&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.includes(f.slice(0,8)))).map(e=>e.tagName+':'+e.innerText.slice(0,80));
  const inputs=[...document.querySelectorAll('input')].filter(i=>i.value.includes(f.slice(0,8))).map(i=>'input:'+i.value);
  const chips=[...document.querySelectorAll('[data-test-id*=filter],[data-test-id*=chip],.q-chip,.q-field')].filter(vis).map(e=>(e.getAttribute('data-test-id')||e.className.split(' ')[0])+'='+e.innerText.replace(/\s+/g,' ').trim().slice(0,60)).slice(0,15);
  return {hits,inputs,chips}; },fake);
console.log(env,JSON.stringify(r)); console.log('url',p.url().replace(s.host.app,''));
await p.screenshot({path:`/tmp/s10928/pca-${env}.png`}); await s.close(); process.exit(0);
