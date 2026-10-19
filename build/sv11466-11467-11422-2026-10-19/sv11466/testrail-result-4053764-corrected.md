Tested on staging, build v26.40.19-c850386, on 19 October 2026, signed in as Admin. Result: Passed.

This result corrects one line of the previous result: on DVI Test the handle is not "most of the bar" at every window size. It is always longer than on a big board and never shorter than 150 px, as the spec asks:
- DVI Test (8 technicians): 1053 px at a 1920 px window, 516 px at 1440 px, 204 px at 1024 px.
- Staging Heavy Duty - 9919 (many technicians): 150 px at 1920, 1440, 1280 and 1024 px.

Everything else in the previous result stands (bar 16 px against about 10 px inside a column; drag end to end; Dark; Tech View and List unchanged; Firefox's own bar). The test's expected result was reworded today to match: "how much longer depends on the window width".
