# Search results — are the rows readable? (Staging, 29 September 2026)

## In one paragraph

The new folder of checks asks one question over and over: **when search hands you a list, can you
pick the right record without opening anything?** I have finished the first two groups of it — work
orders and customers. Most of it is right: the whole name is shown with your word marked inside it,
two similar records can be told apart, and when the system fixes your typo it says so, in words, on
the row. **One thing is wrong, and it is already known: the search box is a fixed width, so a long
customer name is cut short.** Usually harmless. But if the word you typed sits in the part that gets
cut, **the record comes back and the word you typed is nowhere on it** — you are looking at a row
with no idea why it is there. There is also **one new thing**: the customer rows are missing two
pieces the written requirement promises, and that is not covered by any existing report.

## What a user would actually see

Type **Fernvale**. Two work orders come back. Neither of them has the word Fernvale anywhere on it,
because the name is long and the end has been cut off. Other rows in the same list do show it
highlighted — so it is not the whole feature, it is long names only.

