import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const [n,v] = fs.readFileSync('sess.txt','utf8').trim().split('=');
const login = JSON.parse(fs.readFileSync('login.json','utf8')).data;
const fep   = JSON.parse(fs.readFileSync('fep_data.json','utf8'));
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--ssl-version-max=tls1.2','--ignore-certificate-errors','--disable-dev-shm-usage'],
  proxy:{server:'http://127.0.0.1:40283'}});
const ctx = await b.newContext({viewport:{width:1500,height:1050}, ignoreHTTPSErrors:true});
await ctx.addCookies([{name:n,value:v,domain:'.shopview.com',path:'/',secure:true}]);
const posts=[];
ctx.on('request', r=>{ if(r.method()!=='GET' && r.url().includes('api.shopview.com'))
  posts.push({m:r.method(), u:r.url().replace('https://api.shopview.com',''), body:(r.postData()||'').slice(0,400)}); });
const p = await ctx.newPage();
await p.addInitScript(([u,t,f])=>{localStorage.setItem('user',JSON.stringify({data:u}));localStorage.setItem('token',t);
  localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));},[login,login.token,fep]);
await p.goto('https://app.shopview.com/administration/settings',{waitUntil:'commit',timeout:90000});
await p.waitForTimeout(9000);
await p.locator('.q-tab,[role="tab"]').filter({hasText:/^Invoice$/}).first().click({timeout:20000});
await p.waitForTimeout(5000);

// what is actually IN the invoice panel?
const panel = await p.evaluate(()=>{
  const main=document.querySelector('.q-tab-panels, main, .q-page') || document.body;
  const labels=[...main.querySelectorAll('label,.q-item__label,.q-toggle__label,.q-radio__label,h5,h6,.text-subtitle1,.text-h6,button,.q-btn__content')]
    .map(e=>e.innerText.trim()).filter(t=>t && t.length<70);
  return [...new Set(labels)];
});
console.log('PANEL CONTROLS:', JSON.stringify(panel.slice(0,40)));
await p.screenshot({path:'invoice_panel.png'});

// click anything offering Legacy
const tog = p.locator('.q-toggle, .q-checkbox').filter({hasText:/Legacy invoice layout/i}).first();
console.log('toggle found:', await tog.count());
const stateBefore = await tog.getAttribute('aria-checked').catch(()=>null);
console.log('aria-checked BEFORE:', stateBefore);
await tog.click({timeout:15000}).catch(e=>console.log('toggle click:',e.message.slice(0,70)));
await p.waitForTimeout(1500);
console.log('aria-checked AFTER :', await tog.getAttribute('aria-checked').catch(()=>null));
const save = p.locator('.q-btn').filter({hasText:/Save Details/i}).first();
console.log('save button found:', await save.count());
await save.click({timeout:15000}).catch(e=>console.log('save click:',e.message.slice(0,70)));
await p.waitForTimeout(5000);
console.log('NON-GET CALLS:', JSON.stringify(posts,null,0));
await p.screenshot({path:'invoice_panel_after.png'});
await b.close();
