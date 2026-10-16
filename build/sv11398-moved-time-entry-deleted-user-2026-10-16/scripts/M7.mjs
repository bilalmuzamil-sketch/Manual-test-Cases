import {start,labor,apiTasks,J,shot} from './drv.mjs';
const s=await start(); const wid='e7722fe3-f43a-4b01-8f79-19c7815a9174';
console.log('screen',J(await labor(s,wid),800)); console.log('api',J(await apiTasks(s,wid),1200)); await shot(s,'m7-old-S2-35973.png'); await s.close();
