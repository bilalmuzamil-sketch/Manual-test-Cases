# AUTOMATED CASES CHANGED — FOR VLAD

**Standing Rule 65.** `custom_atmstatus` was recorded **at write time** for every case this pass
wrote, from the same snapshot the byte-check takes — the flag moves both ways, so reading it
afterwards can give a different answer from the truth at the moment of the write.

## none

**All 15 cases written this pass carry `custom_atmstatus = 1` (Not Automated).** Not one case
TestRail flags as Automated was changed, so there is nothing for Vlad to adjust.

Per-case values are in the last column of `testrail-execution-log.md` and in
`evidence/testrail-oplog.json`.

**Nothing else was touched:** zero `add_case`, zero `delete_case`, zero section writes, zero run
writes, zero results. And `custom_atmstatus` was **never sent** on any payload, so no case's
automation flag could have moved as a side effect of this pass.
