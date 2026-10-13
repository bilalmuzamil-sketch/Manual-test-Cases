## §T — AN AUTOMATED KEYBOARD SWEEP CAN CLOCK YOU IN, AND IT CHANGES THE WORK ORDER'S STATUS (happened 2026-09-01, sv9315)

**A Tab/Enter sweep left the quick-login Admin clocked in to a work order for about ten minutes, and
moved that work order to In Progress.** Found only because the masthead in an unrelated screenshot
read `stop_circle 00:04:30 S-15888`.

- The masthead's `clock_in_button` is reachable by Tab like anything else, and Enter activates it.
  Tab-order probes and any `keyboard.press('Enter')` after a focus walk can hit it.
- Proof it was mine, not a real user's: `GET /api/technician-tasks/my-current-task` returned a task
  with `start_date` inside the probing window, `end_date: null`, and `staff_id` = the Admin.
- **Clock out with `POST /api/technician-tasks/check-out` and the body `{"task_id": "<id>"}`.**
  `{"id": …}` and `{"technician_task_id": …}` both answer **400 "Task not found for the given
  technician ID."** — only `task_id` works. Confirm with `my-current-task` returning an empty array.
- **The work order stays at In Progress.** A clock-in advances it, and clocking out does not put it
  back. Its prior status cannot be recovered from `GET /api/work-orders` (that list's cursor wraps —
  §S), so **do not guess a status and write it: report the change.**

**PREVENTION, and it is cheap:** before a keyboard sweep, scope it. Focus the element you mean to
start from, bound the number of presses, and **assert that focus is still inside the row/dialog under
test before sending Enter**. A sweep that can reach the masthead can reach anything in it.

