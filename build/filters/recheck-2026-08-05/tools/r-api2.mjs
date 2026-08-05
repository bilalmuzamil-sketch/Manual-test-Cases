import {api} from './boot.mjs';
import fs from 'fs';
const r=await api('GET','/api/customers/list-options?search=Lastone');
console.log('list-options status',r.status);
console.log(JSON.stringify(r.body).slice(0,600));
