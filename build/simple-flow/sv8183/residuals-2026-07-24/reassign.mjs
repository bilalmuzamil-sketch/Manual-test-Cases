// reassign.mjs — reassign qa_reassign staff to a role, verify fe-perms via impersonation.
// Usage: node reassign.mjs <role_id> <label>
import { login, api, switchUser } from './lib.mjs';
const QA_STAFF='0ca87d16-c9bf-4387-825c-304ba37687b9';
const QA_UID='01221b93-47b1-497f-bf74-30601453a469';
const WP='4665d389-4824-47a8-8083-f70535a99d67'; // qa_reassign's own workplace
const [,, roleId, label] = process.argv;
const l = await login('admin');
const body={
  first_name:'QA', last_name:'Reassign mr6j7w8y', email:'qa_reassign_mr6j7w8y@yopmail.com',
  role_id: roleId, workplace_id: WP,
  job_title:null, salary_type:null, salary:null, billable:0, clockable:false,
  departments:['LocAtion/Shop Time (Shop hand)','QB Location/Shop Time (Shop hand)']
};
const ch = await api(l.sessCookie,'POST',`/api/staff/${QA_STAFF}/change`, body);
console.log('reassign', label, '->', ch.status, JSON.stringify(ch.body).slice(0,160));
// impersonate to read fe-perms
const l2 = await login('admin');
const sw = await switchUser(l2.sessCookie, QA_UID);
console.log('switch-user', sw.status);
const fe = await api(l2.sessCookie,'GET','/api/auth/me/fe-permissions');
const perms = fe.body?.data?.fe_permissions||[];
console.log('impersonated perms count', perms.length, 'view_mode', fe.body?.data?.view_mode);
console.log('has settingsApp', perms.includes('settingsApp'), '| workOrdersCreateAndEdit', perms.includes('workOrdersCreateAndEdit'), '| woReviewWorkOrders', perms.includes('woReviewWorkOrders'), '| woOrderParts', perms.includes('woOrderParts'), '| vendorOrderManagementCreateAndEdit', perms.includes('vendorOrderManagementCreateAndEdit'));
