import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(6000);
// profile menu
await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(1000);
console.log('PROFILE', await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim().replace(/\s+/g,' ')).join(' || ')));
await p.keyboard.press('Escape'); await p.waitForTimeout(500);
// card more actions in board
await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(5000);
await p.locator('[data-test-id=button_work_order_more_actions]').first().click(); await p.waitForTimeout(1000);
console.log('MORE', await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim().replace(/\s+/g,' ')).join(' || ')));
await s.close();
