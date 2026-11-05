import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const r=(await s.api('/api/fe-permissions')).json; const t=JSON.stringify(r); const i=t.indexOf('woReceivedLater'); console.log('catalogue has woReceivedLater:',i>=0, i>=0?t.slice(Math.max(0,i-120),i+60):'');
await s.close(); process.exit(0);
