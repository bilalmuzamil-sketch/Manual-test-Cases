// Served-page display check: log into TestRail's web UI and confirm each case's Preconditions/Steps/Expected render (markdown fr-view), not escaped HTML.
import pw from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pw;
import fs from 'fs';
const c=JSON.parse(fs.readFileSync('/tmp/testrail/creds.json','utf8'));
const ids=(process.env.CIDS||'').split(',').filter(Boolean); const out=process.env.OUTF||'/tmp/cln/served.json';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
const p=await (await b.newContext()).newPage();
const host=c.host.replace(/\/$/,'');
await p.goto(host+'/index.php?/auth/login',{waitUntil:'domcontentloaded'});
await p.fill('input[name="name"]',c.user); await p.fill('input[name="password"]',c.password);
await Promise.all([p.waitForLoadState('domcontentloaded'),p.click('#button_primary')]); await p.waitForTimeout(3000);
const res={};
for(const id of ids){ await p.goto(`${host}/index.php?/cases/view/${id}`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);
  res[id]=await p.evaluate(()=>{const o={}; for(const d of document.querySelectorAll('div.markdown')){ let h=d.closest('.field-content, .io-container, div')?.previousElementSibling; let lab=''; let e=d; for(let i=0;i<4&&!lab;i++){ const ps=e.previousElementSibling; if(ps&&ps.innerText) lab=ps.innerText.trim().split('\n')[0]; e=e.parentElement||e;} const ok=d.classList.contains('fr-view'); const lit=/<\/?(p|ol|li|ul|br|b|strong)>/.test(d.innerText); o[lab.slice(0,30)||('div'+Object.keys(o).length)]=(ok?'OK-frview':'ESCAPING')+(lit?' LITERAL-TAGS':'')+' len='+d.innerText.length;} return o;}); }
fs.writeFileSync(out,JSON.stringify(res,null,1));
const bad=Object.entries(res).filter(([k,v])=>Object.entries(v).some(([f,x])=>/ESCAPING|LITERAL/.test(x)&&!/len=0$/.test(x)));
console.log('scanned',ids.length,'bad',bad.length,JSON.stringify(bad));
await b.close();
