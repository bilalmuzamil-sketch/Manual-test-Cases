import {sess} from './lib.mjs';
const R='73f72525-3d67-436b-9c1d-12677cdf9883';
const s=await sess();
const reqs=[]; s.page.on('request',q=>{if(q.url().includes('/api/roles')&&q.method()!=='GET')reqs.push({m:q.method(),u:q.url(),b:q.postData()?.slice(0,3000)})});
s.page.on('response',async p=>{if(p.url().includes('/api/roles')&&p.request().method()!=='GET'){reqs.push({resp:p.status(),body:(await p.text().catch(()=>'')).slice(0,400)})}});
await s.go('/administration/roles-permissions/'+R+'/edit'); await s.page.waitForTimeout(3000);
const st=async()=>s.page.evaluate(()=>{const e=document.querySelector('[data-test-id="wosetting_movelabor"]'); return e?.querySelector('.q-toggle__inner')?.className.match(/(truthy|falsy)/)?.[1]??e?.getAttribute('aria-checked');});
console.log('before',await st());
let el=await s.page.$('[data-test-id="wosetting_movelabor"]'); await el.scrollIntoViewIfNeeded(); let b=await el.boundingBox();
await s.page.mouse.click(b.x+b.width-15,b.y+b.height/2); await s.page.waitForTimeout(800);
console.log('after click',await st()); await s.page.screenshot({path:'../ev/branch-0b-role-movelabor-on.png'});
b=await s.box('submit_edit_role'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1500);
for(let i=0;i<3;i++){ const btns=await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(x=>{const r=x.getBoundingClientRect();return {t:x.innerText.trim(),x:r.x+r.width/2,y:r.y+r.height/2}}));
  console.log('dialog',JSON.stringify(btns.map(x=>x.t))); const c=btns.find(x=>/Edit Anyway|Confirm|Save/i.test(x.t)); if(!c)break; await s.page.screenshot({path:`../ev/branch-0c-dialog-${i}.png`}); await s.page.mouse.click(c.x,c.y); await s.page.waitForTimeout(2000);}
const pb=JSON.parse(reqs.find(x=>x.b).b); console.log("payload ids",pb.fePermissions.length,"keys",Object.keys(pb).join(","),"other",JSON.stringify(Object.fromEntries(Object.entries(pb).filter(([k])=>k!=="fePermissions")))); console.log("resp",JSON.stringify(reqs.filter(x=>x.resp)));
const r=await s.api('/api/roles/'+R); console.log('api after',r.json.data.fe_permissions.map(x=>x.code).filter(c=>/ove|ater/.test(c)), r.json.data.fe_permissions.length);
await s.go('/administration/roles-permissions/'+R+'/edit'); await s.page.waitForTimeout(3000); console.log('reload toggle',await st());
await s.browser.close(); process.exit(0);
