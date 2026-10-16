import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const view=async v=>{await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click(`[data-test-id=display_option_${v}]`); await p.waitForTimeout(5000);};
const theme=async t=>{await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click(`[data-test-id=button_night_mode_${t}]`); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800);};
const rect=(av,nm)=>p.evaluate(([av,nm])=>{const a=document.querySelector(`[data-test-id=${av}]`), n=document.querySelector(`[data-test-id=${nm}]`); const ra=a.getBoundingClientRect(), rn=n.getBoundingClientRect(); const ca=getComputedStyle(a), cn=getComputedStyle(n); return {a:{x:ra.x,y:ra.y,w:ra.width,h:ra.height,bg:ca.backgroundColor,fg:getComputedStyle(a.querySelector('span')).color,txt:a.innerText.trim()},n:{x:rn.x,y:rn.y,w:rn.width,h:rn.height,fs:cn.fontSize,fw:cn.fontWeight,col:cn.color,txt:n.innerText.trim()}};},[av,nm]);
const out={mk};
for(const t of ['light','dark']){
  if(t==='dark') await theme('dark');
  await view('tech_view'); if(t==='light'){ await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);}
  let id=null; for(let i=0;i<60&&!id;i++){ id=await p.evaluate(()=>{const n=[...document.querySelectorAll('[data-test-id^=tech_view_group_name_]')].find(e=>e.innerText.trim()==='Brandi Smith'); if(n){n.scrollIntoView({block:'center'}); return n.getAttribute('data-test-id').replace('tech_view_group_name_','');} const sc=[...document.querySelectorAll('[data-test-id=tech_view] *')].find(e=>e.scrollHeight>e.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(e).overflowY))||document.scrollingElement; sc.scrollTop+=500; return null;}); await p.waitForTimeout(400);} console.log('tech id',id);
  await p.mouse.move(1500,950); await p.waitForTimeout(800);
  out['tech_'+t]=await rect('tech_view_group_avatar_'+id,'tech_view_group_name_'+id); await p.screenshot({path:`/tmp/qa11310/a7-tech-${t}.png`});
  await view('board_view');
  for(let i=0;i<80;i++){ const hit=await p.evaluate(()=>{const n=[...document.querySelectorAll('[data-test-id^=board_column_name_]')].find(e=>e.innerText.trim()==='Brandi Smith'); if(n){n.scrollIntoView({inline:'center',block:'nearest'}); return n.getAttribute('data-test-id').replace('board_column_name_','');} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=1200; return null;}); if(hit){out.bid=hit;break;} await p.waitForTimeout(400);}
  await p.mouse.move(1500,950); await p.waitForTimeout(1200);
  out['board_'+t]=await rect('board_column_avatar_'+out.bid,'board_column_name_'+out.bid); await p.screenshot({path:`/tmp/qa11310/a7-board-${t}.png`});
  await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollLeft=0);
}
await theme('light'); fs.writeFileSync('/tmp/qa11310/a7.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,1500)); await s.close();
