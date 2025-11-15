---
title: "Open sourcing my site!"
description: I've open sourced this website (and it's messy codebase) after 10 months :D
date: "2025-11-15"
unix_time: 1763180451
tags: ["devlog"]
---
###### Written on 2025 November 15

I've open sourced the code for this website! You can find the repository [here](https://github.com/mebaddev/portfolio).

## Why isn't it open-sourced before?
TBH, I wasn't sure if anyone would be interested in it. My site is a simple and messy codebase that I built while learning React, and it's so messy that I was embarrassed to share it (that's the reason why I squashed all my previous commits into one before making the repo public). Lots of people have commented positively about it over the past few months, and I figured that sharing the code could help others learn, no matter if it serves as a good example or 'what not to do'. I really hope it's the former though! 

## What's inside?
The repository contains the full source code of my website, including:
- A blog system that converts markdown files to HTML on build time
- A [tetr.io](https://tetr.io) stats viewer that shows my game stats because why not
- A [404 page](https://mebaddev.net/#/meaning-of-life)
- A cool parallax mountain thing
- A pixelated look
- And of course, a messy codebase that I'm planning to refactor soon

Hope you find it useful!

## How to run it locally?
Clone the repository and run:
```bash
npm install
npm run dev
```
That's it, and the site should be running at `http://localhost:5173`!
Note that since the blog posts are generated on build time, they won't be visible this way. If you want to preview the blog posts, run this instead:
```bash
npm run build
npm run preview # The site should be running at http://localhost:4173
```

## Future plans
I want to add all sorts of cool stuffs to this site in the future, like blog comments, a project showcase page, dark mode support, and developer experience improvements. For now, I'll be focusing on cleaning up the mess I wrote at midnight though!

That's all for now, thanks for reading!
