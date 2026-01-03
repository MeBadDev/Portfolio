---
title: "I tried doing hardware"
description: It was harder than I thought! There's no linter, no auto-complete, and I still have no idea if my design is correct.
date: "2026-01-03"
unix_time: 1767436338
tags: ["hackclub", "hardware", "opinion"]
---
##### Happy new year btw!

I haven't posted in a while, and you might have noticed that the Wakatime widget on my site has not been updating. That's because I've been spending most of my time doing hardware projects recently! With the deadlines near and flavortown starting, I thought it's a good time to share my experience so far.

## The start
I love watching MIT Maker Portfolios (and getting humiliated by them), and they nearly always have some really cool hardware projects. I've always wanted to try making something physical, but I never had the chance to do so. The biggest reason is that hardware costs money, and as a high school student with no income, I couldn't really justify spending hundreds of dollars on something that I might not even finish or accidentally break, not to mention that I have no idea where to start, and don't know anyone who does hardware. That's where Hack Club Blueprint comes in.

## Hack Club Blueprint
[Hack Club Blueprint](https://blueprint.hackclub.com/) is one of the many amazing [YSWS(You ship, we ship) program](https://ysws.hackclub.com) by [Hack Club](https://hackclub.com). Basically, you design something hardware related, including firmware, PCB design, case design, etc.., and Hack Club will fund it (up to $400 per project!) and help you make it real. I've seen a lot of cool projects, like [a working rocket](https://blueprint.hackclub.com/projects/370), (a lot of, for some reason) [split mechanical keyboards](https://blueprint.hackclub.com/projects/2176), and even a [DIY 3D printer](https://blueprint.hackclub.com/projects/216)!

Well, thats cool and all, but I've never ever done any hardware before, and don't know shits about electronics. So naturally, I decided to follow the guide, and build a simple 3x3 macropad. *How hard can it be, right?*

## The journey
I was in a hurry because the deadline was around 15 days away (before it got extended a month), So I `pacman -S`ed KiCad, followed the Hack Club Hackpad guide, and quickly get to work. Making schematics are quite confusing, but I managed to get the hang of it after watching a few YouTube tutorials. I designed the schematic, placed the components, routed the (really messy) traces, and finally exported the Gerber files.

Then, I had to make a case for the macropad. The guide recommended using Fusion 360, but I had lots of trouble trying to get it running on my Arch Linux (btw) system. I could have used FreeCAD, but since the guide uses Fusion 360, I figured it would be better to stick with it since I had no prior experiences, which means I had to use the Windows side of my dual-boot laptop to design the case. 

Honestly, designing the case is my least favourite part. Fusion 360 UI was unintuitive, I'm forced to create an account, and I couldn't find half of the features. While the Hack Club Hackpad guide was incredibly helpful for PCB design, it wasn't as useful for case design. Despite following it exactly, I encountered a lot of misalignments and weird parts. I even deleted everything and re-followed the guide multiple times, but the issues persisted. 

Here's an example of a misaligned case design following the guide. As you can see, the holes on the case doen't line up with the PCB, and will be blocking the key caps.
![A misaligned case design after following the guide](/blog-assets/i-tried-doing-hardware/misaligned.png)

Eventually, I decided to eyeball the dimensions and design the case on my own. After hours of struggling, I managed to create a case that kinda look okay-ish. I then proceed to vibe code a firmware (I'll need a placeholder firmware for them to accept it, and I can't really debug the code without actually having the hardware.), and submitted it for review.

Some parts of the guide, like the suggestion to "round the edges" after exporting the case, made no sense to me. I submitted a few pull requests to fix some of the guide. I'm honestly quite surprised that these errors are still up there with how many people have used the guide already, but [they merged my PR quickly](https://github.com/hackclub/blueprint/pull/167) so that's really cool.

I'm still really worried about the case, because a day after finishing my macropad and submitting for review, a user on Hack Club slack pointed out that there's a mistake in the guide which causes incorrect dimensions. I guided them to help fixing it by submitting a PR, but I'm still not sure if my case is correct. I guess I'll find out when I get the parts. (the hackclub folks are on holiday currently so I still haven't recieved the parts yet.)

![Slack message about the mistake in the guide](/blog-assets/i-tried-doing-hardware/slack-conversation.png)


## What I'm doing now
This is a very precious event for me as it's my first time doing hardware projects, and I'm quite sure that it'll be my only chance to do so for a while after calculating the costs. So I'm trying my best to learn as much as possible before Jan 31, where the event ends. I'm currently designing a more complex PCB for an electronic chessboard that detect piece movement using hall effect sensors. It's been quite a challenge so far considering that I do not have any parts to be able to test it, and I don't have any chances to debug it, but I'm really enjoying the process of learning new things, and I hope to share more about it in the future!

## Conclusion
My experience with hardware so far has been really fun and rewarding. Despite the challenges and some minor frustrations about the guide, I've learned a lot about electronics, and I'm really grateful for the opportunity this program has given me. If you're interested in hardware and have the chance to participate in Hack Club Blueprint or whatever it's next iteration is called, I highly recommend giving it a try!

Thanks for reading my ramblings, and happy hacking!