import {sess} from './common.mjs'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page;
const ids=async()=>p.evaluate(()=>[...new Set([...document.querySelectorAll('[aria-haspopup],[data-test-id*=more],[data-test-id*=action],[data-test-id*=kebab],[data-test-id*=menu]')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+(e.getAttribute('aria-haspopup')||'')+'|'+(e.getAttribute('aria-label')||'')))].slice(0,40));
for(const [v,opt] of [['list','display_option_list'],['tech','display_option_tech_view'],['board','display_option_board_view']]){ await s.go('/workorders'); await p.waitForTimeout(3500); await p.click(`[data-test-id=${opt}]`).catch(()=>{}); await p.waitForTimeout(3500); console.log(v,JSON.stringify(await ids())); }
const wo=await p.evaluate(()=>{const a=document.querySelector('a[href*="/workorders/"]'); return a?.getAttribute('href')}); console.log('wo',wo);
if(wo){ await s.go(wo.replace(/^https?:\/\/[^/]+/,'')); await p.waitForTimeout(5000); console.log('detail',JSON.stringify(await ids())); }
await s.close(); process.exit(0);
