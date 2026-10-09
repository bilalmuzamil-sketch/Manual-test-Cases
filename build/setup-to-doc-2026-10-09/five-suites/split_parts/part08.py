import sys; sys.path.insert(0, __file__.rsplit("/",1)[0]); from common import *
PERM = 'You are signed in as a user who holds the "Settings - Parts" permission, on the build under test.'
CATOPEN = "The Categories page is open."
OPENNAV = (0, "Open Settings", None)
CATS = ['Categories whose names mix case and numbers (for example "Tier 2", "Tier 9", "Tier 10", "alpha", "Beta").',
        'The Default category already exists (for example "Uncategorized").']
def cs(j): return (j, "click New Category", '"Beta").')
PM = "The Pricing Matrices tab is open."
FR = "The Fixed Rules tab is open."
ADMINV = "You are signed in as an admin, on the build under test, on the Invoices page under Administration."
D = {
154723: ([0, "The Invoices page under Administration (the historical invoice import) is open."], [1], ""),
154724: ([ADMINV, 1], ["Administration -> Invoices"], ""),
154725: ([ADMINV], ["Administration -> Invoices"], ""),
154726: ([PERM, CATOPEN] + CATS + ["The list is longer than one screen."], [OPENNAV, cs(1), (1, "Add enough", None)], ""),
154727: ([PERM, CATOPEN] + CATS, [OPENNAV, cs(1)], ""),
154728: ([PERM, CATOPEN, 1] + CATS, [OPENNAV, cs(2)], ""),
154729: ([PERM, CATOPEN, 1] + CATS, [OPENNAV, cs(2)], ""),
154730: ([PERM, CATOPEN] + CATS, [OPENNAV, cs(1)], ""),
154731: ([PERM, CATOPEN] + CATS, [OPENNAV, cs(1)], ""),
154732: ([PERM, CATOPEN, 1, 2], [OPENNAV], ""),
154733: ([PERM, CATOPEN, 1] + CATS + ['The Default category (for example "Uncategorized") carries a Default badge.'], [OPENNAV, cs(2)], ""),
154734: (None, [], ""),
154735: (None, [], ""),
154736: ([PERM, PM, 'Several pricing matrices with names that mix case and numbers (for example "COC matrix", "HD-Dynamic 55", "70% override").'],
         [OPENNAV, (1, "Seed several", "New Price Matrix")], ""),
154737: ([PERM, PM, 1], [OPENNAV], ""),
154738: ([PERM, PM], [OPENNAV], ""),
154739: ([PERM, PM], [OPENNAV], ""),
154740: ([PERM, PM, 1], [OPENNAV], ""),
154741: (None, [], ""),
154742: ([PERM, FR, 1], [OPENNAV], ""),
154743: ([PERM, FR, 1], [OPENNAV], ""),
154744: ([PERM, FR, 1], [OPENNAV], ""),
154745: ([PERM, FR, 1], [OPENNAV], ""),
154746: ([PERM, FR], [OPENNAV], ""),
154747: ([PERM, FR, 1], [OPENNAV], ""),
154748: ([PERM, FR], [OPENNAV], ""),
}
