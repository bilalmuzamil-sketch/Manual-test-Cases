# Technician Toggle — Chris Ward's answers to questions 1-8 (2 Nov 2026)

Source: Google Sheet "Technician Toggle – questions for Chris Ward (2 Nov 2026)",
https://docs.google.com/spreadsheets/d/1nLKkgSgmtqCYu4eu15_9xN38ml32tDnJls42PPq_A4M, column E "Your answer". Read 2 Nov 2026 (Sheets get_values A1:H40).
Copied word for word.

**Answer: 1. (a) Accepted, and the Technician value is ignored. Outside tools can read Technician through the Public API but can't set it in this release (S5-N1). The two refusal messages only come from ShopView's own staff window, for example a second tab with old data. I'll fix the "outside tool" example in Story 1 Error Handling so it says that.**

**Answer: 2. (a) Logged out. The role change logs them out, the same as today. A save that changes only Technician keeps them signed in. I'll add the role to S1-R8.**

**Answer: 3. Something else. The Technician filter also offers "Unassigned" and "Deleted technician". If either one is picked, the filter is on, so "No technicians yet" doesn't show. People picked at another location are dropped from the filter when the user switches locations, so they can't cause it. I'll add this to S3-R10.**

**Answer: 4. (b) The filter drops them, as if they had never been picked. This is the same as what happens today to someone from another location or a deleted staff member. Their work orders don't move. I'll add this to S3-N1.**

**Answer: 5. (a) As the PRD says: in New Staff Member it switches back on from the role, unless the user already switched Technician by hand. The page 3 note in the design was written before the pre-fill existed, and I'll fix it. In Edit Staff Member, turning Time Clock back on still leaves Technician off.**

**Answer: 6. (a) As the PRD says: an ordinary chip, not grayed out, removable with its X, with the lock if they have logged time on the line. Grayed out means deactivated, and this person isn't deactivated. I'll fix the page 6 note in the design.**

**Answer: 7. (c) Keep both sentences. They follow Branko's Work Orders design for this state, which already shipped with two sentences in SV-11555 and passed QA. Technician Toggle only changes the first sentence.**

**Answer: 8. (a) As if the window had just opened. Save & Add Next clears the form the same way it does today: no role, Time Clock off, Technician off. Any earlier switch by hand is forgotten, and the next person's Technician is set from their own role. I'll add Save & Add Next to S1-R3.**

## Question 9 (added 2 Nov 2026), read 4 Nov 2026 (sheet column E, row 15)

**Answer: 9. (a) Yes, it counts. It's time on a work order, so the person did technician work. Release day can only turn Technician on, never off, and the shop can switch it off in Staff. I've added this to S6-R1(a).**

PRD v20 (3 Nov 2026) carries it in S6-R1 (a). PRD v19 (3 Nov 2026) also changed S3-N1 (a picked person whose Technician is turned off: stays picked while they keep a column or group; otherwise until Work Orders is next opened from the menu or reloaded), from Nemanja's build check of answers 4 and 8.
