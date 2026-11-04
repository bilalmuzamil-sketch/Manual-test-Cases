import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(6000); await p.click('[data-test-id="tab_all"]').catch(()=>{}); await p.waitForTimeout(3000);
console.log('headers',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('th')].map(t=>t.innerText.replace(/\s+/g,' ').trim()))));
console.log('pref',JSON.stringify((await s.api('/api/users/me/preferences/work-orders-list')).json).slice(0,1500));
await p.screenshot({path:'/tmp/sv12112/p-probe.png'}); await s.close(); process.exit(0);
