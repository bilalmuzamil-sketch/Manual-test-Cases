import {sess} from './common.mjs';
const s=await sess(); console.log('url',s.page.url()); await s.page.screenshot({path:'/tmp/sv12292/probe.png'});
console.log((await s.page.evaluate(()=>document.body.innerText)).slice(0,300).replace(/\n+/g,' | '));
await s.close(); process.exit(0);
