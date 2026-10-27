import {sess} from './lib.mjs';
const s=await sess();
let r=await s.api('/api/fe-permissions'); console.log('cat', JSON.stringify(r.json).match(/[^"]*[Mm]ov[^"]*|[^"]*[Rr]eceiv[^"]*[Ll]ater[^"]*/g));
r=await s.api('/api/roles/73f72525-3d67-436b-9c1d-12677cdf9883'); const t=JSON.stringify(r.json);
console.log('role keys', Object.keys(r.json?.data||{}).join(','), 'updated', r.json?.data?.updated_at||r.json?.data?.updatedAt);
console.log('role move', t.match(/.{0,80}[Mm]ove.{0,80}/g));
r=await s.api('/api/auth/me/fe-permissions'); console.log('me', JSON.stringify(r.json?.data).match(/.{0,40}[Mm]ove.{0,40}/g), 'cross', JSON.stringify(r.json?.data?.cross_toggles||{}).slice(0,400));
await s.browser.close(); process.exit(0);
