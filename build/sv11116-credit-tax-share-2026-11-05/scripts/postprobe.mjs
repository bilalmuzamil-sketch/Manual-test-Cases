// usage: node postprobe.mjs <path> '<json>' -> POST and print status + body (read validation errors)
import {sess,post} from './common.mjs'; const [U,B]=process.argv.slice(2); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const r=await post(s,U,JSON.parse(B||'{}')); console.log(U,r.status,JSON.stringify(r.json).slice(0,Number(process.env.N||900))); await s.close(); process.exit(0);
