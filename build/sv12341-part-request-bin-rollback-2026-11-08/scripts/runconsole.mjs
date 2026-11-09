import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); const p=s.page;
await s.go(`/workorders/${process.env.WO}/lines`); await p.waitForTimeout(3000); console.log(await p.evaluate(fs.readFileSync('../console-check.js','utf8'))); await s.close();
