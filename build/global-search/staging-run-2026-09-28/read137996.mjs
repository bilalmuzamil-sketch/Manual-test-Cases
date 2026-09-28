import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const { body } = await api('get_case/137996');
const strip = h => (h || '').replace(/<[^>]+>/g, '\n').replace(/&#8984;/g, 'Cmd').replace(/&rsquo;/g, "'")
  .replace(/&ldquo;|&rdquo;/g, '"').replace(/&mdash;/g, '-').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\n+/g, '\n').trim();
console.log('C137996', body.title);
console.log('section', body.section_id, '| created_by', body.created_by, '| automated flag', body.custom_atmstatus, '| type', body.custom_automation_type);
console.log('\n--PRECONDITIONS--\n' + strip(body.custom_preconds).slice(0, 600));
console.log('\n--STEPS--\n' + strip(body.custom_steps).slice(0, 900));
console.log('\n--EXPECTED--\n' + strip(body.custom_expected).slice(0, 1200));
