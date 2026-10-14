import {ob,J} from './lib.mjs'; const s=await ob(); console.log('branch',J(await s.marker(),300)); await s.close();
