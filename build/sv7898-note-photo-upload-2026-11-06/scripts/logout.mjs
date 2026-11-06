// usage: node logout.mjs <woId> -> phone: paperclip upload fails (connection dropped) so the photo is kept on the note; then log out from the
// mobile menu, log back in WITHOUT reloading the page, open the same note: the kept photo and its Retry banner must be gone.
import {sess} from './common.mjs'; const s=await sess({device:'iPhone 12 Pro',dir:'/tmp/qa95'}); const p=s.page; const wo=process.argv[2]; const T0=Date.now(); const L=(...a)=>console.log(`+${((Date.now()-T0)/1000).toFixed(1)}s`,...a);
await p.addInitScript(()=>{ const o=window.setTimeout; window.setTimeout=function(fn,ms,...a){ if(typeof fn==='function'&&/location\.href/.test(String(fn))) return 0; return o.call(this,fn,ms,...a); }; });
await s.go(`/workorders/${wo}/notes`); await p.waitForTimeout(3000);
await p.route('**/api/note/add-attachments',rt=>rt.abort('internetdisconnected'));
const fc=p.waitForEvent('filechooser'); await p.click('[data-test-id="button_attach_files"]'); await (await fc).setFiles('/tmp/sv7898/image.jpg'); await p.waitForTimeout(4000);
const has=async()=>p.evaluate(()=>!!document.querySelector('[data-test-id="note_upload_failed"]')); L('banner before logout',await has()); await p.screenshot({path:'../ev/logout-1-kept.png'}); await p.unroute('**/api/note/add-attachments');
await p.evaluate(()=>{window.__zzSameTab=1;}); let navs=0; p.on('framenavigated',f=>{ if(f===p.mainFrame()){ navs++; L('NAV',f.url()); } });
await p.click('[data-test-id="button_open_mobile_menu"]'); await p.waitForTimeout(1500);
const items=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||'').trim().slice(0,30)).filter(x=>/log|sign|out|profile|user/i.test(x))); L('menu',JSON.stringify(items));
const out=await p.$('text=/log ?out|sign ?out/i'); L('logout control',!!out); if(out){ await out.click(); await p.waitForTimeout(1500); const conf=await p.$('.q-dialog >> text=/yes|log ?out|confirm/i'); if(conf){ L('confirm dialog'); await conf.click(); } }
await p.waitForTimeout(4000); L('url after logout',p.url()); await p.screenshot({path:'../ev/logout-2-loggedout.png'});
const btns=await p.evaluate(()=>[...document.querySelectorAll('button,[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'')+'|'+(e.innerText||'').trim().slice(0,25))); L('login page controls',JSON.stringify(btns.slice(0,25)));
const adm=await p.$('text=/^\\s*admin\\s*$/i'); L('quick admin button',!!adm); if(adm){ await adm.click(); await p.waitForTimeout(5000); }
L('url after login',p.url(),'full navigations',navs);
// back to the work order via the app's own router (no page reload)
await p.evaluate(w=>{ const r=window.__VUE_APP__?.config?.globalProperties?.$router||document.querySelector('#q-app')?.__vue_app__?.config?.globalProperties?.$router; if(r) r.push(`/workorders/${w}/notes`); else window.__noRouter=1; },wo); await p.waitForTimeout(4000);
L('url',p.url(),'router missing',await p.evaluate(()=>!!window.__noRouter),'banner after re-login',await has(),'same page (no reload)',await p.evaluate(()=>window.__zzSameTab===1)); await p.screenshot({path:'../ev/logout-3-relogin.png'});
await s.close(); process.exit(0);
