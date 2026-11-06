// SV-12003 retest: turn on "require tech stories" (per-ticket branch), then on a WO with an approved line without a tech story, list the
// completion controls (line + WO level) so the completion wizard tech-story box and the Tech story gate window can be reached.
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa94'}); const p=s.page;
const st=await s.api('/api/organizations/settings'); const S=st.json?.data||st.json; fs.writeFileSync('/tmp/sv12003/settings-before.json',JSON.stringify(S)); console.log('settings',JSON.stringify(S).slice(0,400));
const wl=await s.api('/api/work-orders?limit=40&status[]=in_progress&status[]=authorized&status[]=open'); console.log('wo list status',wl.status, JSON.stringify(wl.json).slice(0,300));
await s.close(); process.exit(0);
