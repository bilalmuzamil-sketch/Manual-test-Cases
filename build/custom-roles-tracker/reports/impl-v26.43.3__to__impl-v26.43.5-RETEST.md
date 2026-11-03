# What to retest after release v26.43.5

Custom Roles & Permissions only. Read from the app itself; the steps are suggestions to plan with.

Release v26.43.5 changed 2 things in roles and permissions. 5 checks to do.

## Part 1 · Re-check these areas

### 1. Settings: re-check who can use it (Low priority)

This release made 1 change to which screens show or hide things in Settings.

Should work for: Office User · Should be refused for: Senior Service Advisor

1. Log in as Office User, who has “Settings — App”. Go to Settings and use the features listed below. Everything should work as before.
2. Log in as Senior Service Advisor, who does not have “Settings — App”. The same buttons, menus and pages should be hidden, and the actions should be refused.

Test result: Not Tested

### 2. Work Orders: re-check who can use it (Low priority)

This release made 1 change to behind-the-scenes checks in Work Orders.

Should work for: Sales Representative · Should be refused for: a test role with the permission switched off

1. Log in as Sales Representative, who has “Work Orders — Full View Mode”. Go to Work Orders and use the features listed below. Everything should work as before.
2. Every built-in role has at least one of the 14 permissions listed below, so make a test role with all of them switched off. Log in with it: the same buttons, menus and pages should be hidden, and the actions should be refused.
3. Any one of these permissions is enough to allow the actions. If time allows, check a role that has only one of them, for example “Invoicing & Payments — Create & Edit” or “Part Sales — Create & Edit”.

Features to try: Creating or running work orders › lead change undo

Test result: Not Tested

## Part 2 · Quick checks after any permission change

### 3. Built-in roles still open and save

1. Open Administration › Roles and Permissions. Open each built-in role and press save without changing anything.
2. No error should appear, and no permission should change.

Test result: Not Tested

### 4. Custom roles made before this release are unchanged

1. Open a custom role that was made before this release. Check its permissions are exactly as they were.
2. Log in as a user with that role and check they can still do their normal work.

Test result: Not Tested

### 5. Changing someone’s role still logs them out

The plan says: "Changing a user’s role triggers a forced logout for the affected user. The new role takes effect when they log back in."

1. Give a test user a different role while they are logged in.
2. They should be logged out. When they log back in, they should have only what the new role allows.

Test result: Not Tested
