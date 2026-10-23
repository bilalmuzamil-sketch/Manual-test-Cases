import pw from '/opt/node22/lib/node_modules/playwright/index.js'; import fs from 'fs'; const {chromium}=pw;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const out={};
for(const [env,f] of [['prod','/tmp/qa11685/w/var-prod/modern-S1-decl0.html'],['branch','/tmp/qa11685/w/var-branch/modern-S1-decl0.html']]){
  const p=await b.newPage({viewport:{width:900,height:1200},deviceScaleFactor:2});
  await p.setContent(fs.readFileSync(f,'utf8'),{waitUntil:'load'}); await p.waitForTimeout(1500);
  const info=await p.evaluate(()=>{ const R=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]};
    const jobs=[...document.querySelectorAll('.job')].slice(0,2); return {jobs:jobs.map(j=>({job:R(j),title:R(j.querySelector('.job-ttl')),titleText:j.querySelector('.job-ttl').innerText.trim(),
      labor:[...j.querySelectorAll('.chargesec')].filter(c=>/labor/i.test(c.querySelector('.csec-head').innerText)).map(c=>({row:R(c.querySelector('tr')),cell:R(c.querySelector('.description-cell')),text:c.querySelector('.description-cell').innerText.trim()}))}))}; });
  const j0=info.jobs[0].job, j1=info.jobs[1].job; const clip={x:j0[0]-12,y:j0[1]+2,width:j0[2]+24,height:(j1[1]+j1[3])-j0[1]-6};
  await p.screenshot({path:`/tmp/qa11685/w/shot-${env}.png`,clip}); out[env]={clip,...info}; }
fs.writeFileSync('/tmp/qa11685/w/shot.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,900)); await b.close();
