// usage: node shape.mjs <path> [json] ... -> admin session; POST each path with the given JSON body (default {}); prints status + body (600 chars)
import {sess,post} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const a=process.argv.slice(2); for(let i=0;i<a.length;i++){ const u=a[i]; let b={}; if(a[i+1]&&a[i+1].startsWith('{')){ b=JSON.parse(a[++i]); } const r=await post(s,u,b); console.log(u,r.status,JSON.stringify(r.json).slice(0,Number(process.env.N||600))); }
await s.close(); process.exit(0);
