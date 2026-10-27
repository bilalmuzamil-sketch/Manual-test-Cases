import {sess} from './lib.mjs'; const s=await sess(); const P=s.page;
await s.go('/register'); await P.waitForTimeout(3000); console.log('url',P.url()); console.log(await P.evaluate(()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,500)));
console.log(await P.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>!/nav|module|clock|notif|profile|search|skip/.test(t)).join(' | ')));
await P.screenshot({path:'../ev/reg-page.png'}); await s.browser.close(); process.exit(0);
