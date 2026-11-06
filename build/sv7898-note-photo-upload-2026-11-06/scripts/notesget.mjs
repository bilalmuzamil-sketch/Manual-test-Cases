// usage: node notesget.mjs <woId> -> logs the GET requests the Notes tab makes (to find the notes list endpoint)
import {sess} from './common.mjs'; const s=await sess({dir:'/tmp/qa94'}); const p=s.page;
p.on('response',async r=>{ const u=r.url(); if(/\/api\/.*note/i.test(u)&&!/download-attachment/.test(u)&&r.request().method()==='GET'){ let t=''; try{t=(await r.text()).slice(0,500)}catch(e){} console.log(r.status(),u.replace(/^https:\/\/[^/]+/,''),t); } });
await s.go(`/workorders/${process.argv[2]}/notes`); await p.waitForTimeout(5000); await s.close(); process.exit(0);
