import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3000);
await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1200);
console.log(await p.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); const e=[...m.querySelectorAll('*')].find(x=>/dark_mode/.test(x.innerText)&&x.children.length<6&&/Dark/.test(x.innerText)); return (e?e.outerHTML:m.outerHTML).slice(0,2500);}));
console.log('ls',await p.evaluate(()=>JSON.stringify(Object.keys(localStorage))));
await s.close(); process.exit(0);
