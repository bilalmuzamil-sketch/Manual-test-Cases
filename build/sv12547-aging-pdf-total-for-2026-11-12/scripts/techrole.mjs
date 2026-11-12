import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa76',quick:'tech'}); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>localStorage.getItem('user')?.match(/"details":\{[^}]*\}/)?.[0]));
await s.close(); process.exit(0);
