import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const theme=process.argv[3]||'light';
const o= env==='prod'?{env:'prod',user:'bilal.muzamil@shopview.com'}:{env:'branch',ticket:'11588',cookies:JSON.parse(fs.readFileSync('/tmp/qa11588/cookies.json')),quick:'admin'};
const s=await open({...o,dir:'/tmp/qa21',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const R={env,theme};
const setTheme=async t=>{await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click(`[data-test-id=button_night_mode_${t}]`); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(500);};
await s.go('/workorders'); await p.waitForTimeout(5000);
R.startView=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=display_option_]')].filter(e=>/selected|active|--on/.test(e.className)).map(e=>e.getAttribute('data-test-id'))[0]);
if(theme==='dark') await setTheme('dark');
const view=async(v,wait)=>{const b=await p.$('[data-test-id=display_option_'+v+']'); const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForSelector(wait,{timeout:60000}); await p.waitForTimeout(3000); await p.mouse.move(3,600);};
const norm=`v=>{if(!v)return v; if(v.includes('url(')){const m=v.match(/%20'([a-z-]+)'%20/)||v.match(/'([a-z-]+)'/); const tail=v.slice(v.lastIndexOf(')')+1).trim(); return 'CUSTOM['+(m?m[1]:'?')+'] '+tail;} return v;}`;
const survey=(sel,grid)=>p.evaluate(([sel,grid,norm])=>{const N=eval(norm); const els=[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth});
  const own={}; els.forEach(e=>{const c=N(getComputedStyle(e).cursor); own[c]=(own[c]||0)+1;});
  const pts={}; let n=0; for(const e of els.slice(0,25)){const r=e.getBoundingClientRect(); for(let i=1;i<grid;i++)for(let j=1;j<grid;j++){const x=r.left+r.width*i/grid,y=r.top+r.height*j/grid; if(x<0||y<0||x>innerWidth||y>innerHeight)continue; const t=document.elementFromPoint(x,y); if(!t||!e.contains(t))continue; n++; const c=N(getComputedStyle(t).cursor); const tag=(t.getAttribute('data-test-id')||t.className||t.tagName).toString().replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/g,'<id>').slice(0,40); const k=c+' @ '+tag; pts[k]=(pts[k]||0)+1;}}
  return {count:document.querySelectorAll(sel).length,visible:els.length,own,pointsTested:n,points:pts};},[sel,grid,norm]);
await view('board_view','[data-test-id^=board_card_]');
R.board={cards:await survey('[data-test-id^=board_card_]:not([data-test-id*="_status"]):not([data-test-id*="_avatar"])',5),headers:await survey('[data-test-id^=board_column_header_]',6)};
await p.screenshot({path:`/tmp/qa11588/${env}-${theme}-board.png`});
await view('tech_view','[data-test-id^=tech_view_row_]');
R.tech={rows:await survey('tr[data-test-id^=tech_view_row_]',8),grips:await survey('[data-test-id^=tech_view_row_drag_handle_]',3),groups:await survey('[data-test-id^=tech_view_group_header_],[data-test-id^=tech_view_group_]:not([data-test-id*=avatar]):not([data-test-id*=name]):not([data-test-id*=toggle])',6)};
await p.screenshot({path:`/tmp/qa11588/${env}-${theme}-tech.png`});
// cursor set on any ancestor up the tree for a card and a header (what the hand inherits from)
R.groupTids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id^=tech_view_group]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/g,'<id>')))].slice(0,20));
await s.go('/workorders'); await p.waitForTimeout(4000); if(R.startView){const v=R.startView.replace('display_option_',''); const b=await p.$('[data-test-id=display_option_'+v+']'); if(b){const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(3000);} }
if(theme==='dark') await setTheme('light');
R.build=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
fs.writeFileSync(`/tmp/qa11588/g-${env}-${theme}.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R).slice(0,3000)); await s.close();
