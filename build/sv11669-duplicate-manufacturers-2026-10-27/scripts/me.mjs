import {sess} from './lib.mjs'; const s=await sess(); const P=s.page;
console.log(await P.evaluate(()=>Object.keys(localStorage).join(',')));
console.log(await P.evaluate(()=>{const u=localStorage.getItem('user'); return (u||'').slice(0,400);}));
const r=await s.api('/api/staff?limit=300&search=admin'); console.log(r.status,JSON.stringify(r.json).match(/"email":"[^"]*admin[^"]*"/gi));
await s.browser.close(); process.exit(0);
