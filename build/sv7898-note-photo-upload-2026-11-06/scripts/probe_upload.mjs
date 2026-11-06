// usage: node probe_upload.mjs <woId> -> phone emulation, toolbar paperclip, picks a JPEG, logs every non-GET request + menus shown
import {sess} from './common.mjs'; const s=await sess({device:'iPhone 12 Pro'}); const p=s.page; const wo=process.argv[2];
p.on('request',r=>{ if(r.method()!=='GET') console.log('REQ',r.method(),r.url().replace(/^https:\/\/[^/]+/,'')); });
p.on('response',r=>{ if(r.request().method()!=='GET') console.log('RES',r.status(),r.url().replace(/^https:\/\/[^/]+/,'')); });
await s.go(`/workorders/${wo}/notes`); await p.waitForTimeout(3000);
const fc=p.waitForEvent('filechooser',{timeout:8000}).catch(()=>null); await p.click('[data-test-id="button_attach_files"]'); const ch=await fc;
console.log('filechooser',!!ch, ch?await ch.element().evaluate(e=>({accept:e.accept,capture:e.getAttribute('capture'),multiple:e.multiple})):null);
if(!ch){ await p.waitForTimeout(1000); console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-menu,.q-dialog,[role=menu]')].map(e=>e.innerText).join(' | '))); await p.screenshot({path:'../ev/probe-menu.png'}); }
else { await ch.setFiles('/tmp/sv7898/small.jpg'); await p.waitForTimeout(6000); await p.screenshot({path:'../ev/probe-after.png'}); }
await s.close(); process.exit(0);
