set -x
cd /tmp/qa9667
O=/tmp/qa9667b/r4
node role-swap.mjs f3fff656-6c82-407e-b3a8-17f536358966 && node kinds.mjs tech toggle $O-tvedit
node role-swap.mjs 70a8bf83-23de-4e57-b8a6-18856e28bfb5 && node kinds.mjs tech observe $O-tvview
node role-swap.mjs af8d02b5-ecd1-4205-a82f-32a4d5bb1015 && node kinds.mjs tech observe $O-tech
node role-swap.mjs 224da903-6f11-4c79-98f2-d1bd3c4ea892 && node kinds.mjs tech toggle $O-salesrep
node role-swap.mjs af8d02b5-ecd1-4205-a82f-32a4d5bb1015
node kinds.mjs admin toggle $O-admin
