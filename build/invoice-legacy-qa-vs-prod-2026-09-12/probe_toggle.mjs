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
  posts.push(r.method()+' '+r.url().replace('https://api.shopview.com','')+'  '+(r.postData()||'').slice(0,300)); });
const p = await ctx.newPage();
await p.addInitScript(([u,t,f])=>{localStorage.setItem('user',JSON.stringify({data:u}));localStorage.setItem('token',t);
  localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));},[login,login.token,fep]);
await p.goto('https://app.shopview.com/administration/settings',{waitUntil:'commit',timeout:90000});
await p.waitForTimeout(9000);
await p.locator('.q-tab,[role="tab"]').filter({hasText:/^Invoice$/}).first().click({timeout:20000});
await p.waitForTimeout(5000);

// find the element whose text is the label, and describe its neighbourhood
const info = await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('*').forEach(e=>{
    if(e.children.length) return;
    if(!/Legacy invoice layout/i.test(e.innerText||'')) return;
    let node=e, chain=[];
    for(let i=0;i<5 && node;i++){ chain.push(node.tagName+'.'+(node.className||'').toString().split(' ').slice(0,3).join('.')); node=node.parentElement; }
    const host=e.closest('.q-toggle,.q-checkbox,.q-item,.row,div');
    const inp=host? host.querySelector('input'):null;
    const r=(host||e).getBoundingClientRect();
    out.push({chain, hostClass:(host&&host.className||'').toString().slice(0,120),
      inputType:inp&&inp.type, ariaChecked:host&&host.getAttribute('aria-checked'),
      role:host&&host.getAttribute('role'),
      box:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}});
  });
  return out;
});
console.log('LABEL CONTEXT:', JSON.stringify(info,null,1));

// click by coordinate on the control to the LEFT of the label (Quasar toggles sit left)
{
  const box = await p.evaluate(()=>{
    const lbl=[...document.querySelectorAll('*')].find(e=>!e.children.length && /Legacy invoice layout/i.test(e.innerText||''));
    const row=lbl.closest('.row.col-12.items-center');
    const inp=row.querySelector('input[type=checkbox]');
    const host=inp.closest('.q-toggle,.q-checkbox') || inp.parentElement;
    const r=host.getBoundingClientRect();
    return {x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2), w:Math.round(r.width), checked:inp.checked};
  });
  console.log('TOGGLE BOX:', JSON.stringify(box));
  await p.mouse.click(box.x, box.y);
  await p.waitForTimeout(1500);
  const after = await p.evaluate(()=>{
    const lbl=[...document.querySelectorAll('*')].find(e=>!e.children.length && /Legacy invoice layout/i.test(e.innerText||''));
    return lbl.closest('.row.col-12.items-center').querySelector('input[type=checkbox]').checked;
  });
  console.log('checkbox checked after click:', after);
  await p.locator('.q-btn').filter({hasText:/Save Details/i}).first().click({timeout:15000}).catch(e=>console.log('save:',e.message.slice(0,60)));
  await p.waitForTimeout(5000);
}
console.log('NON-GET CALLS:', JSON.stringify(posts,null,0));
await p.screenshot({path:'toggle_after.png'});
await b.close();
