import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const out='../ev/prod';
await s.go('/workorders'); await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>{const r=e.getBoundingClientRect();return e.getAttribute('data-test-id')+'@'+Math.round(r.x)+','+Math.round(r.y);}).filter(t=>/view|list|board|layout|mode/i.test(t))); console.log(ids.join(' | '));
await s.close(); process.exit(0);
