import {sess} from './common.mjs';
const s=await sess(); console.log('url',s.page.url().slice(0,150)); console.log(JSON.stringify(await s.marker()));
console.log((await s.page.evaluate(()=>document.body.innerText.slice(0,300))).replace(/\s+/g,' '));
await s.close(); process.exit(0);
