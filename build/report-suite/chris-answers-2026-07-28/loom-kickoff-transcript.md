# Report Suite — Kickoff Video Transcript (verbatim)

**Source:** Chris Ward kickoff video — https://www.loom.com/share/dd2b5837aebf485ca10c704d460e2769
**Attendees:** Chris Ward (PO), Parth Fadadu (dev), Nebojsa Glavinic (QA), Viktoria Videnovic (QA), Stefan Mitrovic (dev/eng), Chris Amani.
**Date ingested:** 2026-07-28.

> The transcript below is reproduced exactly as provided. Do not alter the text.

---

00:00 Parth Fadadu: MapleStory is a
00:16 Chris Ward: You know, six reports broken up into, like, six mini-features. It's gonna be a lot of fun. Originally, because I've got, like, you're gonna see very quickly here, I've got, like, ten or eleven of these things, but we had to be very selective with which ones we did.
00:30 Chris Ward: Partha, as you know, we could just go forever and ever and ever and keep building shit, right? So. Victoria should be along in just a minute here, and then we'll fire things up.
00:42 Chris Ward: She's traveling today and she's on a laptop, so service might not be great.
00:47 Nebojsa Glavinic: Ah, yeah, she mentioned it.
00:49 Chris Ward: Ah, there she is. The woman, the legend. Hello, guys.
01:01 Viktoria Videnovic: Welcome, Victoria. Sorry for the background noise. Don't worry, Victoria,
01:06 Chris Ward: you're breaking up a little bit, but I let the people know we're traveling a little bit, you're on a laptop, and it's a pain in the butt, so.
01:12 Chris Ward: If you miss anything, the cool thing is I'm recording this, Victoria, so I'll throw it in the chat after, so everything's good.
01:21 Chris Ward: Thanks. Now, I know there's supposed to be, let's see, I think Stephan was gonna join. I don't think Chris Amani's gonna join.
01:30 Chris Ward: The good news is, because we're recording, I'm just gonna kick this off now. So, first I'll start with telling you guys a little bit about me, in case you guys don't know.
01:38 Chris Ward: So, I'm new to ShopView. As you can see, I'm a Foothills Group employee, one of Fabian's other adventures. My last true day with Foothills Group is this upcoming Friday.
01:48 Chris Ward: And so, all that means is I can sleep and actually work on ShopView, rather than just Foothills Group, ShopView, and then try and pretend that I sleep.
01:56 Chris Ward: with that being said, I rely on heavily on a team being, powerful and asking the right questions and so on.
02:03 Chris Ward: I know because I've worked with all of you guys that you guys are very much capable of this. my last feature squad went really, really well, but there were major story defects.
02:12 Chris Ward: That was the big bottleneck. The problem was because I wasn't spending enough time watching everything at all moments, we, we ended up having to do a lot of extra work towards the end of the feature that we could have done in the beginning had I been paying more attention.
02:25 Chris Ward: So, you know, ultimately, if choices are made, at any point during this, please tag me. I do expect that you guys are more than capable of making the right choices at the right times, especially considering different time zones and so on.
02:38 Chris Ward: But please tag me. Let's, you know, if there's anything you have any questions about or anything, I'm more than happy to jump in.
02:43 Chris Ward: I'm on and help at any time, 24 hours a day. So, with that being said, let's kick this off. Chris, Stephan, good to see you.
02:51 Chris Amani: Hey, thanks. I'll just be listening in, quietly, but just, just wanted to join since I could. Excellent.
02:58 Chris Ward: And congratulations, Chris, fantastic job. It's great to see. Thanks, brother. All right, team. So, the, the whole point of this is, like I said, Parth and Nebisha, we started building a disturbing amount of reports.
03:11 Chris Ward: we had a tremendous amount draw the line at some point. Originally, it was five. Now, it's six. so, we're trying to get these six over the finish line as best as possible as soon as we can, but obviously not break anything in the process.
03:23 Chris Ward: I'm going to show you what that looks like on my local. So, we also know that the source of truth should be the specs, and it is the specs.
03:30 Chris Ward: However, I've noticed there's an issue with visual conformance a lot of the time. What I mean by that is anything written in text, if there's not a crapload of pictures in there, can be interpreted multiple different ways.
03:42 Chris Ward: So, what I'd like to do as a visual reference is use this video moving forward. If I have to film a shorter one for visual reference, that's no problem.
03:51 Chris Ward: I'll do that as well. But, ah, the last thing that I want to do is give you, Parth, my, ah, my local branch, because even though it's working right now, really well on my side, it's pseudocloud code.
04:02 Chris Ward: It's crap. It's garbage. You'll laugh at it if you see it in the back end. So, with that being said, let's, ah, let's get into it.
04:10 Chris Ward: First thing I want to show you guys is, let's, try not to focus too much on all of the additional reports I've built, because they're all in the same branch.
04:17 Chris Ward: can anybody not see this? Okay. If I need to zoom in, just call, call out. Okay, cool. So, all of these reports, all six of them, are gonna live in, in the reports section, where we're currently, we know all about this.
04:32 Chris Ward: The main difference is this parts section here. Now, parts velocity and inventory value are in spec, in this feature squad.
04:41 Chris Ward: Part sales, just ignore that one. So, we need to create a new section here. As far as which order these go in, honestly, it really doesn't matter.
04:51 Chris Ward: This is a new section. you can tell up here, this is not, alphabetical or anything of the sort. when it comes down to the performance section, the best way to do this is, as I like to say, additive, not interruptive.
05:03 Chris Ward: So, for example, a user is going to get used to going here and clicking on sales mindlessly. They're just so used to clicking that button.
05:11 Chris Ward: We don't want to interrupt that or this or, or anything. So, technician utilization is actually in a really bad spot right now.
05:19 Chris Ward: So, we want to move these down below what's already there. Don't get me wrong. At some point, this will have to change.
05:27 Chris Ward: In fact, we're probably going to minimize these. As drop-downs, because there will be more reports, but suffice it to say that, like, tech utilization, which is included in this report, should go, you know, towards the bottom.
05:40 Chris Ward: Not interrupt anything that the users experience already. So, for this specific example, specific feature squad, we're going to work on technician utilization, work in progress, sales by customer, sales by associate, which is actually, this is named incorrectly in this branch, should be sales by representative
06:01 Chris Ward: , I'll touch more on that in a sec. Parts Velocity, and Inventory Value. Now, what I meant by that is, I actually had to shrink the name sales by representative to sales by associate because of the padding in this area here.
06:17 Chris Ward: If we put the word representative here, I don't know if I can actually do it right now, my console's kind of messing up on me a little bit, but if we put representative in here, it really squishes into here.
06:29 Chris Ward: That's something that we need to solve in some capacity during this squad. It could just be pushing the padding out a little bit, or let's just broach that topic when we get to it and try and think of a good solution.
06:42 Chris Ward: In the spec, there is a good solution, I just don't know if it's the right solution. Okay, so, let's start with, Work in progress.
06:53 Chris Ward: Now, there are two key parts of this feature that are completely new to ShopView in this, other than, obviously, the reports themselves, that are high value, but they may become a little bit difficult to build.
07:05 Chris Ward: And those are, Those are snapshots. So what we're doing with both the Work in Progress report and the Parts Velocity report is we're creating nighttime off-peak for each user's time zone, each location's time zone, snapshots.
07:22 Chris Ward: so that we have retroactive data moving forward. Now to break down what I'm trying to say, we want to take a picture at night when most of the users are offline so that after these features are released, they can go back to this date and see data.
07:38 Chris Ward: On specific days. Now, obviously, until this hits production, there are no snapshots for this. The data isn't captured. They're not going to see anything, but we need to do this moving forward.
07:50 Chris Ward: And so that's for work in progress and parts velocity. Now, in my eyes, it's very important to show the why.
07:59 Chris Ward: Why are we doing this and how? The reason being is I, as a shop owner, I want to see what work in progress that I had in July 2021.
08:10 Chris Ward: If it's currently, ah, July 2027. That helps me, as a shop owner, generate ideas about how I should be moving the needle, so to speak, for my business.
08:23 Chris Ward: With Parts Velocity, ah, Parts Velocity is based on, based off of how much, how many inventory items are we carrying on hand, or catalogue items are we carrying on hand at what specific times, that are collecting dust on the shelf.
08:39 Chris Ward: Because inventory items are, unfortunately, they're a loss of money if they're collecting dust. So it's important that teams are aware of this.
08:48 Chris Ward: Now, now that I've got past that, and feel free to pause anytime if I'm talking too fast or saying the wrong things, more than happy to explain.
08:56 Chris Ward: Let's go into work in progress. So, with this report, ah, this is an overly complex report. Ah, what I mean by that is we're introducing new ideas that are not necessarily normal in, ah, in a shop environment.
09:12 Chris Ward: They're very important, but they're not normal terminology. As you can see here, that's why there's so many tooltips. Tooltips, ah, to me, are generally a good indicator of, hey, this is too complicated.
09:26 Chris Ward: So the more tooltips you have, the more complicated you've made that piece. Now there's a play later on to change the verbiage.
09:35 Chris Ward: I worked on this quite a bit with Fabian here. And this is what we settled on, and this seems to be the right thing at the right time.
09:43 Chris Ward: So, maybe down the line we can change this, but this will work for now. you can see these submenus here.
09:49 Chris Ward: Luckily, Mr. Parth, why I said most of this should, most of this feature should be relatively easy, is this is all query data.
09:57 Chris Ward: We're not really adding anything, we're just fetching things. So, I'm hoping that'll help you in the end. each of these new features has a toggle for the locations that the user has permission to access.
10:11 Chris Ward: So, you could, of course, go all locations or choose your individual locations that you're playing with. you'll notice an all-time here.
10:19 Chris Ward: I believe I cut this from the spec, if I recall correctly, just due to the fact that, ah, this is off of Milan's idea.
10:26 Chris Ward: It's hard because we're not paginating data properly, so it's hard to use an all-time. So, refer to the spec as the source of truth there.
10:35 Chris Ward: I need to go back and look again, but, ah, but I believe we cut all-time. So, this calendar really should be the same as native, everything that we're familiar with.
10:43 Chris Ward: Ah, for visual conformance, it's kind of important to know this all the time. Sorry, sorry, Chris,
10:49 Stefan Mitrovic: to interrupt. Ah, one thing about that, all-time, I don't think we even have the option from the back-end side to pull up everything since the beginning.
11:01 Stefan Mitrovic: Let's say, I think we are limited to approximately one year or something like that. So, all-time basically wouldn't be possible.
11:14 Stefan Mitrovic: Maybe it is now if we have, like, some companies that are less than a year here. But if someone clicks all-time, it should be practically the same as he clicked, like, the last year.
11:26 Stefan Mitrovic: For the last 365 days or something. That might
11:32 Chris Ward: actually be why Milan flagged that and we cut that. Probably. Probably.
11:50 Chris Ward: For all time. I just, I don't know, to be honest.
11:54 Stefan Mitrovic: I mean, that's, it depends, because it's like, it's, it's hard to say, here we can have a lot of data, a lot of customers.
12:05 Stefan Mitrovic: And and for us, it's, it will become eventually very expensive to save all of that. So it's, it's kind of, I mean, if that is something that we need to do, we need to understand what are the costs and then we can we can do it, but that's also very hard, from performance perspective, because we need to
12:27 Stefan Mitrovic: fetch all of that and that can be like huge number of items, like objects with, individual properties. and things like that and everything to be listed.
12:38 Stefan Mitrovic: It's like very heavy, so we need to understand the consequences of doing that.
12:44 Chris Ward: That makes perfect sense. Well, that, I didn't get a really good chance to talk to Milan, so that makes sense why would he was tech-spec-ing this.
12:50 Chris Ward: you know. He cut that out, and so we cut that out. You might see it, guys, just, when we go through a couple of the other reports, because I basically just standardized this so that everything looks uniform.
13:00 Chris Ward: But, it did get cut out, this all-time thing. So, yeah,
13:06 Stefan Mitrovic: basically, if that is something that users are, like, often use, meaning, like, if they have a shop with, I don't know, five years of existence, do they really use it?
13:22 Stefan Mitrovic: Do they that filter all the time, or would they use, like, specific time frame, like, from January 1st to, I don't know, June 10th of 2025 or something?
13:34 Chris Ward: I can say that due to, due to, not just due to the economies across the world right now, but from a user standpoint, I personally would only go back a year because anything past that, it's, the data is so flawed because the world is constantly evolving that it's almost pointless.
13:51 Chris Ward: You know, don't get me wrong, as a creature of comfort, going back to see your growth from 2024 to 2026, that is a powerful move, though most people do that in their P&L statements, their profit and loss statements from their accounting team, rather than in a report run inside a shop management program
14:12 Chris Ward: . So, I would say we're probably okay to let the people speak, and if they start asking for that, there may be some considerations to be made.
14:21 Chris Ward: The good news is, like you said, we have a bout a year from launch date to hear about that, so.
14:27 Chris Ward: Yeah, yeah, I
14:28 Stefan Mitrovic: mean, so, basically, from my perspective, that's more of an edge case than some common scenario. And, on the other hand, we are also not limiting them, I mean, we are, but we, it's not like we are not providing that option, so they can go and do, on their own, like, from, January 1st to December 31st
14:50 Stefan Mitrovic: of that year, and, and fetch, like, five different, resources. Reports, on different pages, and then they can compare or do whatever they want, so it's not like it's impossible, but we just don't, we shouldn't be showing that option all the time, for now, at least.
15:07 Chris Ward: Understood. Yeah, so, Parth, if you do see, All time somewhere in the spec, that should be gone. I'll, I'll double check.
15:15 Chris Ward: I'm pretty positive we're good there, but, but yeah, it's still, it's still in my local. I didn't update my local after I wrote the specs.
15:22 Chris Ward: Assets, we have an Asset here. Dropdown menu. One thing you're gonna notice across this suite is I really like this way a lot better.
15:30 Chris Ward: You'll notice other reports that we currently have inside NativeShopView. They, they have a tendency to, if you click on one, it closes it, then you have to reopen it.
15:39 Chris Ward: You have to click on another, it closes it, so on and so forth. That's super annoying. So, I built this out to be a little bit more user-friendly.
15:49 Stefan Mitrovic: We can do that, yeah, but I would also add maybe a toggle or something. I mean, it's visible like this, but at this point it's just a preference.
16:01 Stefan Mitrovic: Just to have it, like, uniform throughout the app.
16:04 Chris Ward: That actually makes sense, and just so you guys know, that's not a major staying point for me. What I mean by that is I'm definitely flexible there.
16:11 Chris Ward: It's not there's a better best-in-class that matches the rest of the, ah, the native suite. Let's use it. you know, ultimately, as long as we can do this without a user swearing too much, that's what we're going for, kind of thing.
16:27 Stefan Mitrovic: yeah,
16:27 Chris Ward: so probably more like this is what you're talking about, Stefan, eh? Yeah,
16:31 Stefan Mitrovic: yeah, exactly. Yeah, we can add that, I don't know, you, you added some description there for the asset itself, like between, below the label.
16:40 Stefan Mitrovic: Yeah, we can add that. We can that also, but to look like a toggle, so. Beautiful.
16:45 Chris Ward: Let's, for the purposes of doing that, let's try and match that up. Let's make sure, because this, obviously, should not be different than this anyway, so, but yeah, I agree with that.
16:54 Chris Ward: If we're, we're more comfortable and it's more flexible. If you're familiar to do this, let's please do this. Happy to update the spec with that, too.
17:01 Chris Ward: all will have a download PDF and a download CSV option. Now, important to know, across the, oh, good, it's broken.
17:10 Chris Ward: Across the entire suite, that download PDF and download CSV are specifically what is shown on the screen. So, if you were to filter something down as a user, this is going to reflect.
17:26 Chris Ward: What you've filtered down. That's very, very much intentional. if a person wants to have all data and 7,000 sheets of paper print out, they can.
17:35 Chris Ward: They just have to take their filters out. I would love to show you this, but apparently I can't. Maybe CSV?
17:39 Chris Ward: Probably not. Yeah, that's super broken, this feature. That's okay. So, work in progress, fairly straightforward. One other thing that I'm going to point out that is new to this entire suite that we're building, is this green and red.
17:56 Chris Ward: That's actually very much intentional. That's what I like to call labor delta, and that's what you'll see throughout the specs.
18:02 Chris Ward: basically what this is, is invoiced hours versus, build, sorry, tech hours versus invoiced hours. So, if you're in a positive, it'll turn green and add a plus.
18:14 Chris Ward: If you are exactly 0.0, break even, it'll be black and not render with a plus or minus. And, if you're in the negatives, it'll render as a minus and in the reds.
18:25 Chris Ward: You're gonna see that in a few places, and it's a quick visual cue for users to say we're either winning, losing, or breaking even on something, without having to go too deeply into it.
18:35 Chris Ward: It does help users to start to identify problems, and they can start capturing – here you go, for example, there's a black one – to start capturing the information they need at the times that they need it.
18:49 Chris Ward: this here is the most important data asset on this sheet. a bulk of users are quite literally going to come in here and choose their date range and look specifically for this number.
19:00 Chris Ward: And so that is why it is larger than the others. Very much intentional, not my favorite, but it's workable. other things that are pretty standardized is we always pin our top re- row here, and we always pin our bottom row here.
19:14 Chris Ward: Saves for scrolling. You will notice as we go through these, some of the padding is messed up. I don't know if you guys have experienced this, but, what I mean is this padding at the bottom here.
19:26 Chris Ward: I don't know if you guys have experienced this, I've never touched Claude design, but when I use Claude code, it sucks at visual design.
19:34 Chris Ward: So, trying to fix this could take me hours, when realistically I can just talk it out, and it's very quick to fix.
19:41 Chris Ward: Okay. Yeah,
19:42 Stefan Mitrovic: just leave it, that's five minute change. I figured,
19:46 Chris Ward: I figured. let's jump
19:47 Chris Amani: into textualization.
19:48 Chris Ward: Sorry, what were you going to say?
19:49 Chris Amani: Might
19:52 Chris Ward: have just been a little noise. That's all right. Okay, tech utilization, or technician utilization. This one, similar in, you know, the conformance we were talking about before.
20:05 Chris Ward: Ignore that all the time. Quick click through. So this is where it differs. You notice there's an expanded view here.
20:13 Chris Ward: We actually already have that in tech efficiency, which And
20:19 Chris Amani: Hey,
20:27 Stefan Mitrovic: Chris, Amani.
20:30 Chris Ward: Oh, that's Amani. I don't think you realize it. yeah, I
20:33 Stefan Mitrovic: think maybe I can, I can,
20:35 Chris Amani: I don't
20:36 Chris Ward: Cool. Now. Headed into this report, this one's a lot simpler. This is a very quick and easy quote-unquote report. Don't listen to me when I say easy, because everything easy is always harder than I think it is.
20:49 Chris Ward: And, that's no judgment on anybody. this one here, you're gonna notice that we can expand. This is all really well documented inside the spec, but I'll run you through it.
21:02 Chris Ward: normal sorting pattern for all columns. Normal for every single report in the suite. Bye. Bye. What isn't super visually apparent is these are hyperlinks.
21:14 Chris Ward: Now, maybe it is, I don't know. But, collapsed hyperlinks are different than uncollapsed. And you can even see the visual difference between the two.
21:25 Chris Ward: So, the collapsed hyperlinks will literally take the, take the user to that date range, in timesheet activities. Whereas, when you uncollapse them, it'll take them specifically to that date range.
21:41 Chris Ward: In that person's timesheet activity. Pretty cool, just a good way to do it. You'll notice it's redirecting the current page.
21:49 Chris Ward: Not my favorite, but that's the way that we like to do things. However, it is supposed to be built so that moving back puts you exactly where you were.
21:56 Chris Ward: all of these reports too, the settings that are saved on, say, let's, I don't know, do this. The settings that are saved are per user per computer.
22:06 Chris Ward: That's how it's written in the spec. So if I were to You go and do something else for a little while and go back to tech utilization, it's going to keep where I was.
22:18 Stefan Mitrovic: You mean like filters and everything? Precisely, sir.
22:22 Chris Ward: However, if I were to, even with the same username, jump onto a different computer, it doesn't care, it'll just wipe out the filters.
22:30 Chris Ward: So local, Ah,
22:31 Stefan Mitrovic: okay, so this is clashing a little bit with the other feature squad who is working on filters. itself, and they are applying this specific logic throughout the app.
22:46 Stefan Mitrovic: Oh, cool. So if that is something that should be included here, we should sync, and maybe delegate that part of the work to them, so we don't collide in conflict between us.
23:01 Stefan Mitrovic: That would be good for you guys, for you, Chris, and I think it's Branko and Miloš on that feature squad to think about that, and to make a decision how to proceed.
23:12 Stefan Mitrovic: Because we don't want to do two things, on different feature squads, and then have double the work, and then clashing, and, taking one instead of the other, etc.
23:22 Stefan Mitrovic: So making more work than we should, and that's something that we should decide, probably, tomorrow. Probably soon, rather than later.
23:29 Stefan Mitrovic: And, yeah. Proceed with that.
23:31 Chris Ward: That's, that's awesome for a call-out, Stefan. Thank you for that. It's funny, it sounds like you're speaking from experience, like you might have seen an issue occur before.
23:41 Chris Ward: Oh, yeah. Yeah,
23:42 Stefan Mitrovic: just for a little bit more of the context, what they are doing there is basically what you described here. And, we, we will, leave the option for the user, let's See you.
23:54 Stefan Mitrovic: We will save some filters for the user itself on the level, on the account level. So whenever he opens some page and mess with the filters, we will probably leave the option for him to save that and to have it across devices.
24:10 Stefan Mitrovic: That's one thing. And the second thing would be what you mentioned also is sharing links between the users. We'll override their, let's say, default view or saved view.
24:24 Stefan Mitrovic: So that will not be a problem or conflict. Like, they will see everything that the user number one see, let's say.
24:31 Stefan Mitrovic: So it will be the same view, but also we will leave the option for, for, to get out of that and get to the default view in the first place.
24:41 Stefan Mitrovic: So it's like everything is covered. We just need to sync and to decide how to proceed with that. I wouldn't do that specific thing here.
24:51 Stefan Mitrovic: I would leave it as is. I wouldn't make too much of a work for part, because once we are done, we can just, merge or leave it out, of the PRD and merge staging.
25:02 Stefan Mitrovic: And once it's on staging, we can just tell them, okay, guys, you can, take it in and do your thing there.
25:09 Stefan Mitrovic: Smart.
25:09 Chris Ward: Yeah, I totally agree. I'll, so Parth, leave, maybe, don't worry too much about that. I'll, I'll sync with NealOceanBronco and see if we can, maybe spec that part of it out or leave it a little more ambiguous.
25:22 Chris Ward: Stefan's got a great idea. If they're, if they're doing it in one space, they might as well do it in a few other spaces.
25:27 Chris Ward: That won't be difficult for them. But I'll get us an answer there and I'll report back in the Slack channel too.
25:32 Chris Ward: Thanks, Stefan. That's, yeah, that's exactly the kind of information I need. Yeah, yeah,
25:38 Stefan Mitrovic: for sure.
25:40 Chris Ward: this is, these exports are all supposed to follow the same logic, which is if there is a logo there, that the user selected, it should be here.
25:49 Chris Ward: this is the summary view, the expanded view. Similar to TechEfficiency, just shows the unrolled, uncollapsed version. CSV, I'm just going to load it up really quick, it's pretty straightforward how that's going to look.
26:06 Chris Ward: It's exactly as you'd expect. Sorry, I probably could have had these open ahead of time to speed this up. a little.
26:22 Chris Ward: Pretty straight forward. for Utilization, that's pretty much it. The only grey area here that's going to be unfamiliar, this is actually a new calculator.
26:32 Chris Ward: And it's explained fairly well here. It's the shop, the location's default labour rate multiplied by internal hours.
26:43 Chris Ward: So whatever their default labour rate is, times this. This is just supposed to be a quick calculator. Like, at a glance, this is how much you're losing by not having so-and-so clock onto jobs in this time period.
26:56 Chris Ward: That's pretty much it for utilisation. That was a Fabian ask that was highly, highly sought after. Now, it gets a little more complicated when we go into sales by customer, but it's not terrible.
27:08 Chris Ward: here, same thing as before. Oh, it's a little weird. I don't know why that's bigger. Another visual defect, but yeah, suffice it to say, we're trying to standardize our filters.
27:20 Chris Ward: The difference here, you'll see a new one here, is the parts and service filter. Now, what that controls is sales by customer can either be part sales or they can be work order sales.
27:34 Chris Ward: This allows the user to choose one of the two, or both. column selector. Actually, you know what? Just for the sake of the video, let me go back.
27:42 Chris Ward: Sorry, I'm jumping kind of all over the place here. Column selector. Column selector is important, so you've got this on video.
27:56 Chris Ward: Tech Utilization doesn't have one. Because it's a smaller, system. It's a smaller data set. Okay, so, same thing, no all-time.
28:06 Chris Ward: here's that Labor Delta we were talking about before. Take a brief look. Notice the coloring on the, the padding down here.
28:15 Chris Ward: And you can see that there's a visual defect, along with the padding, like we talked about before. Hey, this one's all white.
28:23 Nebojsa Glavinic: Just one question. About, that label, Delta, that you are mentioning, so it, it is, invoiced, it's tech hours compared to, estimate hours, or is it the actual, like.
28:35 Chris Ward: Yeah, that's, that's exactly right.
28:39 Nebojsa Glavinic: So if we estimated, let's say we need, like, four hours, we're gonna invoice, four hours, but, tech needs, like, two hours to work on each site.
28:48 Nebojsa Glavinic: So it will show how much, like, plus two or minus two.
28:53 Chris Ward: You've, you nailed it. You hit the nail exactly on that. Effectively, this might be a good way to look at it.
28:59 Chris Ward: Where is that? That is shelf efficiency. All it is, is this. Blocked for. Versus invoiced. Oh, then it's
29:07 Nebojsa Glavinic: actually clocked out.
29:09 Chris Amani: Yeah, so what we'll try to do
29:10 Nebojsa Glavinic: here is
29:11 Chris Ward: just, like, which customers are we winning on? Which customers are we losing on? And then we, the user can go in and figure out why.
29:18 Chris Ward: If that makes any sense. these guys, all collapsible. And so, this is kind of a nested collapse, as you can
29:28 Chris Amani: see here. These
29:33 Chris Ward: will hyperlink to the actual part sales or work orders. You'll notice that part sales are labelled slightly differently. I did just notice a defect.
29:43 Chris Ward: I believe this is fixed. Inside of the spec, but I am going to have to go back and check. good for you guys to know too, because you'll probably see this somewhere along your travels if you haven't already.
29:54 Chris Ward: Using unit number as an identifier is not best in class. The industry is split. One thing that always remains the same, the holy grail as we like to call it for unit identification, is the serial number, or in some cases the bin number.
30:11 Chris Ward: it's one and the same. Interchangeable terminology. So, you'll have a 10. There's a ton of users that don't actually have unit numbers, or they have the, ah, the asset entered multiple times, under multiple different unit numbers.
30:26 Chris Ward: One thing that always remains the same is the serial number. So that is the identifier you will identify. I always want to use, and if you see it, please flag it for anybody, because it's so important.
30:35 Chris Ward: So, just flagging it here now, ah, I need to change this on my local to, to actual serial number. I'm gonna also leave myself a note here.
30:46 Chris Ward: Change identifier for assets to thin serial. I'm fairly certain I've got that written into the spec, because I haven't touched my local in a while, but just in case I didn't, it's good to know.
31:01 Chris Ward: This, so, this is actually the very first feature that I built, and this was back in April. So, there's certain visual differences that I'd like to cut out.
31:14 Chris Ward: Like, print here, this should not exist. I'm going to make sure. That's cut out of the spec. I mean, it's cool and all that, and I know we have it in other places, but.
31:33 Chris Ward: It's kind of the same thing, right? Maybe. Kind of. Yeah, the biggest thing that I'm going for is visual conformance.
31:40 Chris Ward: I don't want this to be too jarring for everybody looking at it. Sales by associate and sales by representative. So, this one arguably is a little bit more complicated too.
32:00 Chris Ward: I'm really going to have to urge you to look closely. The spec on this one, wow, that took a really long time.
32:08 Chris Ward: Sorry, Parth.
32:10 Parth Fadadu: So, in sales by customer, we don't want to include option to download as a expanded view?
32:18 Chris Ward: no, in this case, I didn't, and I'll show you why. Because it's fully nested, oh yeah, I guess I could use one of these.
32:26 Chris Ward: Because it's fully nested, the expanded view is really the only thing that's important here. I did not grant that option.
32:34 Chris Ward: Technically, we could, and it's not a bad idea, you're absolutely right. Because, here, let me close this little side window here.
32:43 Chris Ward: Because our users might be happy just having this information here. You know what? That's actually a good callout. Let's, let's add that.
32:53 Chris Ward: Yeah, nice, nice call.
33:03 Chris Ward: Because you're, you're absolutely right, Parth. That's, a customer might want to get away with just doing that. Good call.
33:08 Chris Amani: Okay, jumping
33:14 Chris Ward: over to Sales by Rep.
33:18 Chris Amani: Start with
33:21 Chris Ward: our column chooser, selector. Product type, like we talked about. Statuses. Difference, ah, payment statuses are acceptable here. This was a, Fabian asked, and I think it's highly important, too.
33:36 Chris Amani: Basically,
33:37 Chris Ward: this report is specifically, this is, this is an edge case, this whole report in general. I'd say a solid 95% of the industry does not use, like, repair in a any sort of sales representative to tackle anything.
33:53 Chris Ward: I believe this will mostly go into, Foothills Group will use this, but I don't know how many other people will.
33:59 Chris Ward: I've been asking a lot of customers, too. so, that's why this one's a bit of a grey area. Now, this report specifically is to basically just say, what has my salesperson or salespeople done?
34:12 Chris Ward: in or, at what time period? And allows you to compare against. Same thing, our labour delta's here, how much labour invoice, labour margin, yadda yadda yadda yadda.
34:23 Chris Ward: this is all fake data, so if you see any weirdness, like, no margin, that's, that's just due to the fact that this isn't real data.
34:30 Chris Ward: Same thing, hyperlinks here,
34:37 Chris Amani: but what's
34:37 Chris Ward: really important about this feature is it goes a lot deeper than what you see here. There are different entry points.
34:44 Chris Ward: What I mean by that is is, and you're really going to see this inside the spec, how do we make people populate on that?
34:54 Chris Ward: Well, this guy right here. So, Edit Staff Member, there's a Sales Rep toggle that allows them to appear in that report.
35:04 Chris Ward: Now, this is very intentionally not exclusive to whatever your role is, because one thing that is for sure is oftentimes, in the industry, we see people wearing different hats.
35:19 Chris Ward: You could have a CEO that doubles up as a sales rep, and we do want to track that person. If Chris Amani decides to go to various customers and start, you know, selling products, maybe I want to track him, kind of thing.
35:33 Chris Ward: Even though that's not really his job, I still want to see him on that report. Now, another spot you're going to see this surface.
35:41 Chris Ward: Let's see how broken this is in my local, maybe it'll work. Not more visual breakage.
35:52 Chris Ward: So you're going to see it on work orders, and then in your normal spot up here, excuse me, sorry. They'll have a sales rep drop down.
36:04 Chris Ward: So this one, there's probably going to be a few questions on it, but I would advise definitely take a look at that spec first because yeah, this one, this one's a little more verbiage heavy.
36:14 Chris Ward: Also, when it comes down to the visual breakage here, happy to work with you guys to get it right, because this is clearly not right.
36:23 Chris Ward: It's hilarious. I actually fixed this. It looked really good, and now clearly I've got a regression. So just something to keep in mind there.
36:31 Chris Ward: Okay, so we talked about the entry points, where that belongs, you can technically have unassigned work orders, no sales rep assigned, and those live here, but they're toggled off by default.
36:43 Chris Ward: Okay, another tricky one, this is the second entry point for our snapshot data. This one, man, I could say a lot about this one.
36:58 Chris Ward: This one is, Heavy, we'll call it. Turns out, if you get enough data from enough people, they don't want multiple features, they want one feature that does everything.
37:09 Chris Ward: If you talk to ten different parts people, specialists among themselves, different companies, and so on, every single one of them will just keep adding more, and more, and more calls.
37:19 Chris Ward: At some point, we have to be the adult in the room and draw the line, and so I did, but as you can see here, there's quite a few.
37:26 Chris Ward: Now, it was intentional which were turned off by default. we'll let the user decide what they want to turn off after the fact, but every single one of these data points is actually quite helpful for a number of reasons.
37:38 Chris Ward: for the more difficult ones that involve a little bit of thinking, I've added some tooltips here, so that you guys know all of these columns are actually labeled for best-in-class as industry-standard verbiage.
37:54 Chris Ward: So if you ever wanted to get familiar with what some of these are, like turns per year and so on and so forth, take a look at this report, it'll teach you a little bit.
38:01 Chris Ward: It's kind of cool. we can sort and filter by bin, vendor, category, and of course our normal sort, oh look, all time's not in here, that's a good sign.
38:15 Chris Ward: But more importantly, this is both for inventory parts and special order catalog parts. we can define each, I don't know if there's any data points in here, no there's not for catalog.
38:25 Chris Ward: But both are equally powerful. I was told that we don't want to use the global search for anything, somebody else is working on it and it's super broken, so I just added a little one here that we can use.
38:37 Chris Ward: It kind of looks like crap, I'm not gonna lie. So, more than happy to work with you guys on making this look a little bit prettier.
38:44 Chris Ward: We don't have Bronco in here to say, hey, that, that could be fixed doing this. So, yeah, let's approach that together if need be.
38:52 Chris Ward: one thing, I'm sure, Stefan's getting huge red flags here just in the back of his head is, when you get a shop that has, especially if they're searching by old This is gonna be a very slow-loading report.
39:08 Chris Ward: Now, Milan did flag this already and, put in some valuable suggestions inside the spec. And, to my knowledge, he, he thought it looked about as good as it can get.
39:17 Chris Ward: On the user-customer experience side, I know, and most people will know, that if I tried to load 17,000 items in one report, it's gonna take a minute, no matter which way you look at it.
39:31 Chris Ward: Now, Parth, if you are running into some real bottlenecks when you're, ah, when you're testing and building, and things are just, it's loading really, really slow, let's, let's flag that and do what we have to do to make the right changes.
39:44 Chris Ward: But Milan's got some good information in there for ya.
39:47 Stefan Mitrovic: It's really required by the product and the users.
39:53 Chris Ward: What's that in, sorry, in which regard? To have
39:56 Stefan Mitrovic: like, to have, option to, from the filter to select locations. That would be my first because you have already that option from the user, button.
40:08 Stefan Mitrovic: yeah, there. the second thing would be to select like all locations, I mean, is that, is there any business
40:17 Chris Ward: value for someone to
40:19 Stefan Mitrovic: do that?
40:21 Chris Ward: Absolutely. the nice thing about that one is that one is to put it bluntly. I've been told. I've enabled by a couple of, people that have been around a lot longer than me inside ShopView.
40:33 Chris Ward: Not having this is probably the biggest miss every single one of our, reports has. The reason for that is people want to see it on one screen.
40:42 Chris Ward: Having this and then having to reload it and so on and so forth is a major pain. So people want to be able to compare against and do it in one, one spot rather than, you know, duplicating their screens and bouncing back and forth.
40:58 Chris Ward: Apparently, that's been a really, really hot one that we've needed to add for a long time. So in theory, we should have this on every single report.
41:09 Chris Ward: Obviously, we'll need a way to define, we're looking at all locations, okay, where's, where's the location? You know, how do I know which is for shop A and which is for shop B?
41:20 Chris Ward: Speaking of which, we should probably add that in there.
41:23 Stefan Mitrovic: Oh
41:25 Nebojsa Glavinic: yeah, I, well. I wanted to ask about the, the dropdown that says both, that we're picking parts, like inventory, yeah?
41:37 Nebojsa Glavinic: So, what do we mean by catalogue? Are we tracking, like, special order parts that are, that were, like, in order, then invoiced, and, invoiced and never came back to inventory, or, like?
41:51 Chris Ward: Absolutely correct. So, where is it here? I have a pretty good descriptor in here somewhere. Sorry, you'll bear with me, it's been a minute since I've looked at this.
42:02 Chris Ward: Okay. I think it's right here. Units taken out of inventory stock on invoiced work orders inside the date range. This is stock movement, so it could be different from the units billed behind revenue and sell price.
42:16 Chris Ward: when units are, so there's a plus minus that happens inside of here, and basically the triggers are the invoice button.
42:24 Chris Ward: So with catalog parts, it allows us to see, oh, yeah, we have no data. That's right. Basically, they'll pretend that the copies here are catalog parts.
42:36 Chris Ward: It'll tell us last time we sold it how much we were making on it, and so on and so forth.
42:41 Chris Ward: Obviously, on hand would drop off. yeah, we wanted to be able to track both, because the velocity, is not only for what we keep on hand, but for demand in general.
42:52 Chris Ward: So, it's a good indicator when you're on the catalog, if you have a catalog part that's seeing a lot of volume in, I don't know, say, July, hey, maybe we should stock this for inventory, kind of thing.
43:02 Chris Ward: That's the law. That's the behind it, anyway. If that helps, Nebeshef. Yeah, yeah,
43:08 Nebojsa Glavinic: but, like, Okay, it doesn't really matter, but because of the naming, because, like, any part, like, you order, or, and put in inventory, or, like, receive on a work order and invoice, it will end up in catalogs, so, like, that's why I wanted to ask, is catalogs just sorting the, basically, special order
43:26 Nebojsa Glavinic: parts that, were never, like, put into
43:29 Chris Ward: inventory. You're absolutely right. I
43:31 Nebojsa Glavinic: see what you're saying. Yeah,
43:34 Chris Ward: I totally see what you're saying. Yeah, actually, I chose the word in general. Actually, it's funny, it's, labeled slightly differently here, I didn't realize that.
43:41 Chris Ward: But, yeah. Yeah, I chose the verbiage in general to match our catalogue itself, but you're right. That is exactly that.
43:49 Chris Ward: That's, special order parts. And, you know what, to be honest, maybe we do rename it. Because you're absolutely right. Things in inventory have a catalogue item, and things in, yeah, you know what, great suggestion, great idea, great question.
44:12 Chris Ward: I'll, we'll have to truncate that down somehow, because that'll get a little big for, for a column here.
44:19 Stefan Mitrovic: and also if we can get back to, the locations real quick. So, I have, like, two thoughts on this. One would be, permissions, if anyone who has access to this page will be able to click on this.
44:35 Stefan Mitrovic: Meaning, like, I don't know if someone from one location should see the other location. maybe that should be defined in the role and permission.
44:46 Stefan Mitrovic: If not, if he, if anyone who is able to see this page or this report itself can see that, that's fine.
44:53 Stefan Mitrovic: We just need that to be written down so we're all aligned. And the second question would be, you said, if someone wants to see, like, 17,000 parts, that's fine.
45:05 Stefan Mitrovic: That's on him, but we are definitely having pagination on every page, so with the current, code base, we are basically forcing the user to scroll.
45:20 Chris Ward: Yeah, that's right. That's absolutely right. I, I swear, Milan did have a creative solution for that, because he actually brought up, specifically, a shop that had, had 5,000 parts.
45:34 Chris Ward: And he, he came up with a solution that he was happy about. It's a li- I, I believe it involved pagination and so on.
45:42 Chris Ward: That one, let's, let's flag that, because that, this whole thing was a hot topic. For me to revisit pagination, infinite, scroll, and load.
45:55 Chris Ward: to answer your first question, I just put a note in here. I did define that inside the specification.
46:02 Stefan Mitrovic: so-
46:02 Chris Ward: Custom roles and permissions. So, what it was originally, and I'll double check, just to make sure, because I don't trust specs anymore.
46:10 Chris Ward: Maybe I just don't trust myself. is, if you, say you only had QA testing, you would not see this at all.
46:17 Chris Ward: This- the filter's just gone. If you had, say there's three or four of them here, if you had QA testing and QB location, then of course you'd see the filter.
46:28 Stefan Mitrovic: Yeah, I mean, that's fine.
46:30 Chris Ward: Cool. I will go back and double-check though, because that is a very important one. It's, yeah, great call-out. But yeah, I don't want to, not revisit that, because I'm curious, maybe I can punch it into Claude.
46:43 Chris Ward: Milan oftentimes speaks far too technically for it. For me, I'm not as smart as him, so I have to go back and double-check.
46:50 Stefan Mitrovic: He's just being smart.
46:52 Chris Ward: He's good at that.
46:54 Stefan Mitrovic: Looks smart.
46:55 Chris Ward: once again, you know, a lot of this is, is just, we're querying data. most of it looks the same, it's just presented slightly differently.
47:04 Chris Ward: here's another good example. Now, this is weird to me. This is, It's just trying to show you that snapshot data that we were talking about.
47:13 Chris Ward: and so this was clearly taken, I don't know, 12 days ago, or it thinks it was. But it leaves this here, which isn't a terrible idea to show the user when the snapshot was taken.
47:24 Chris Ward: However, what bothers me is, we should know that the snapshot was taken on every single day, no matter what. So, I think this needs to go away.
47:33 Chris Ward: I don't know why Claude thought it was a great idea. I'll double check the spec on that one. I'm pretty sure I just trumped it and got rid of that.
47:42 Chris Ward: the whole purpose of this report is, is, of course, at what time, say, this month, how much was I carrying in cost, sell price with my current margins and markup.
48:04 Chris Ward: Pretty basic report. For whatever reason, this one was a super high value that, ah, Cody McCarthy flagged, and we managed to squeeze into this.
48:12 Chris Ward: That's actually what pushed this off the extra couple of days, was getting this report in here, because, apparently, it's, ah, a lot of people are asking for
48:21 Stefan Mitrovic: What? Sorry?
48:22 Chris Ward: Ah, InventoryValue.
48:25 Stefan Mitrovic: Mmm, okay. This
48:27 Chris Ward: is another one here that, ah, Parth, ah, I'm sure you can agree to. There's really no reason to have a summer, er, sorry, a, CompressedView because it wouldn't make any sense.
48:39 Chris Ward: I do think, though, we're, ah, we're gonna have to add to SVC, Sales by Customer, like you said, the CompressedView, that was a great idea.
48:47 Chris Ward: This one's pretty straightforward, though. Now that I'm looking at it, I kind of want to go back to, ah, Utilization.
49:05 Chris Ward: I vetoed putting a column selector on Utilization originally just because there's, like, no data points. In fact, I'm still kind of in that same mindset.
49:14 Chris Ward: I don't know if there's any reason to. I'm not married to it, but we'll just maybe follow the spell. But I'll take a quick look at it.
49:24 Chris Ward: And the reason why I keep saying I'll take a quick look at the spec, guys, is we fired these specs out super, super fast because we're behind.
49:32 Chris Ward: So the spec's going to have some issues. So my goal, my intention, is to be happy. I'm going hands-on with you guys in here 24 hours a day, just answering any questions, pivoting as we need to.
49:44 Chris Ward: And so, I, don't worry, I have no fear that, ah, that we're going to have any issues or anything like that.
49:50 Chris Ward: But, just, important to know. as far as visual on this one, Claude did a great job of getting some of these vertical alignments right, and then completely fell on its face over here.
50:04 Chris Ward: Like, what even is this? Anyway, something to be mindful of, don't listen, look at this. coming up at the end of our time here, any questions that you guys have currently, and don't get me wrong, there's plenty of time for questions later too, so if they come up,
50:19 Parth Fadadu: But yeah, as I will progress,
50:42 Chris Ward: If you see anything weird in the spec, please let me know. Not even just if you can think through it and fix it I'm ultimately curious, because we're trying to get our specs to be better, and we're also trying to find out where they're at.
50:52 Chris Ward: Where they're messing up and how they're messing up, because that's how we can make them better. So, yeah, anything you see.
50:57 Chris Ward: And it's good for my learning, too, because I'm still fairly new, so. Cool, cool. Well, on that note, if there are no other questions, I'll, I hope you guys have a fantastic day.
51:07 Chris Ward: I'm going to post this video, as promised, in the chat. I talk a lot, and I talk fast, but I still would suggest a 1.5 or 2.5 speed, and then jump to where you have to in the video.
51:19 Chris Ward: Parth or anybody, if you guys want just a super fast click-through, I call them, PRD Companions. I've done dozens of them.
51:26 Chris Ward: I'll do one for this. It'll be like three minutes of me clicking through all the weirdness. I can do that too.
51:31 Chris Ward: Just let me know if that's a benefit or if it's just a waste of time. Because you guys can talk to me on the channel too.
51:36 Chris Ward: It probably is a waste of time, but I'll let you guys decide that. Mr. Nebeshev?
51:45 Nebojsa Glavinic: Yeah, sorry, I didn't, like, I mean, I just didn't read the spec yet. Like, fully and everything, but, in, that report sales by customers, or in any report, new report with, where we have parts, at any point, do you know, on top of your head, how we are dealing with, like, returned parts and, credit.
52:09 Nebojsa Glavinic: I mean, if we have like, we credit some part and basically create, later we can, create refund or return that part to a vendor.
52:18 Nebojsa Glavinic: So, how they are, those scenarios, reflecting, those reports.
52:23 Chris Ward: So,
52:24 Nebojsa Glavinic: reflecting them.
52:26 Chris Ward: Absolutely. I see what you're saying. So, there's actually multiple answers to that question, amusingly, just because the way that these reports kind of encompass a lot of different things.
52:35 Chris Ward: specifically for sales by customer, it, it ignores that, refunds and credits, because if we, if we go more granular, and we think, about sales by customer as a whole, that is what was sold at what time to that customer.
52:51 Chris Ward: Refunds or credits don't actually matter after the fact. Didn't we sell X, Y, or Z to this customer at this time?
52:57 Chris Ward: That's the question that it answers. However, when you jump into parts velocity, that's where it gets complex because we do need to track returns and credits and so on.
53:09 Chris Ward: We'll just jump back into a quick share here. that is thought about because because, say we sold 100 units of something on Monday, but then we returned 100 units on Tuesday.
53:21 Chris Ward: I mean, it kind of cancels itself out, right? There's, you wouldn't know, like, that doesn't tell you. That you should stock 100 more of that part, right?
53:31 Chris Ward: It, wouldn't help the user at all. So, units returned, this gets filled any single time that, return has been checked.
53:41 Chris Ward: units sold, this goes up every single time it's actually sold, you know, invoiced. there was, I can't remember if I cut it or not.
53:50 Chris Ward: I actually did a differential at one point. Yeah, it looks like I did cut it out. Kind of neat. But it was, actually, it's kind of weird that it's not on here.
53:58 Chris Ward: Oh, so, man, it is here. It's not terrible, So, Demand's kind of cool. So, we know that, you could have, say, I don't know, a breakdown.
54:08 Chris Ward: We'll just use something random. You could have a breakdown that is quoted out on a hundred different work orders. The same part number, the exact same part.
54:17 Chris Ward: But maybe it's, Hey, Chris,
54:18 Stefan Mitrovic: sorry
54:18 Chris Ward: to interrupt.
54:19 Stefan Mitrovic: Sorry, I have another meeting that I need to jump on. And, I will just, Just conclude the meeting with the, the action points where, you part and also Nebojsa and Viktoria, you guys should go also through the PRD, when you can.
54:35 Stefan Mitrovic: That should be a priority and raise any questions. Any questions or concerns regarding this handoff also now you see how things should work and how it should look like.
54:46 Stefan Mitrovic: So any question you have, just please, communicate in the channel so we can all see and answer as quickly as possible.
54:53 Stefan Mitrovic: And react on it and, more specifically for Nebuchadnezzar and Victoria, you guys should also check, the, the proposed, test cases and that's, that's for now.
55:02 Stefan Mitrovic: And then we'll go from there, part, if you have also any questions, feel free to, to ask or, or ping anyone.
55:10 Stefan Mitrovic: That's, that's pretty much it. So thanks guys. Chris, great work.
55:15 Chris Ward: Thanks, Stefan. You're, you're amazing. Really appreciate the help and enjoy the rest of your day.
55:20 Stefan Mitrovic: Yeah, you too. Bye.
55:22 Chris Ward: Yeah, so demand is actually kind of cool. Number of separate transactions, work orders, or part sales, that break drum was put on.
55:31 Chris Ward: So you could have a hundred break drums on one part sale or work order, and this will count as one.
55:38 Chris Ward: Or you could, excuse me, have one drum on a hundred work orders, and this would add a hundred, if that makes any sense.
55:48 Chris Ward: Yeah. Yeah, so, once again, I'll go back. Through the specs, getting better at updating changelogs, and so on. So, anything that's changed in the specs moving forward, whether it's by you or by me, let's just make sure that changelog is updated.
56:03 Chris Ward: Generally speaking, it's usually going to be me that updates it, but if you end up doing it, just make sure that it updates the changelog too, please.
56:10 Chris Ward: That way, if we all end up getting pulled off onto something else, somebody else can build this, but I don't expect that that's going to happen.
56:19 Parth Fadadu: Yeah, changelog is quite helpful.
56:22 Chris Ward: Cool, guys. Well, yeah, I mean, like Stefan said, communication is the highest here. It's the only way that this will work really well, so, don't think for a second if you notice a story defect that it's an insult to me.
56:36 Chris Ward: It's not. It's a good thing, because it's then I know. And then, oh crap, okay, I'll do that better next time.
56:41 Chris Ward: But, yeah. So, anyway, appreciate you guys. I hope you have a phenomenal day, and I'll get after these notes that I took.
56:48 Chris Ward: Probably won't be for a few hours, so by the time you guys wake up and you're back on, you'll have answers for all of these.
56:56 Chris Ward: Otherwise, yeah, let me know what you need.
57:01 Parth Fadadu: Sure, thank you. Thank
57:02 Nebojsa Glavinic: you, team.
57:04 Viktoria Videnovic: Thank you, Chris. Bye-bye.
57:07 Nebojsa Glavinic: See you guys, bye.
