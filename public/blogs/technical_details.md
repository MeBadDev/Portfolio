---
title: Building a MD-to-HTML Post Engine for my website!
id: md_technical_details
description: This post explains how my markdown to HTML post system(which I used to create every post) works!
tags: technical
date: 2024-09-20
---
###### Written on 2024 September 20

I've built a system to convert Markdown files into HTML! In fact, this page you're seeing right now is dynamically generated from a markdown file. Let me walk you through some common questions people ask about how it works!

## Common questions
### Cool, but you know that [insert exsisting library name] exists, right?
Yeah, I am well-aware that things like `Jekyll`, `Gatsby`, and many others already exist for converting Markdown to HTML, but for me, the best way to learn how does something works is to create it from scratch (no, not [that scratch](https://scratch.mit.edu), I do not want to build any website on that thing). Plus, the feeling of seeing my own code running perfectly is unbeatable.
### OK, why build this if your site only gets about 20 visits a day?
That's a fair point! Traffic isn't the main goal here, though. I created this for experience and to improve myself. For one, I'm *not* a native English speaker, and writing these posts helps me practice my language skills. Plus, building stuffs from scratch is a pretty efficient way for me to learn. And who knows -- this project might even lead to meeting some new people who share my interests!
### Don't you think you're reinventing the wheel?
True, but that's exactly how I want it! By building this myself, I get a deeper understanding of how other existing library (possibly) works under the hood. Plus, this project is made by me, for myself. It is customized to my specific needs, which a ready-made solution *might* not cover.

---
## Technical Overview
Here are some technical details of how this system works. Here's the breakdown:
### 1. Markdown Setup
All my md files are stored in the directory `src/blogs`, every post is written in Markdown for simplicity and flexibility. When someone visits a specific post, the system dynamically imports the corresponding file based on the post ID param in the URL. (it looks something like `/post?postID={post_name}`), which makes it clean and efficient.
### 2. Conversion to HTML
For the actual conversion, I used `react-markdown`. It parses the Markdown content into HTML elements. This allows me to write posts using sweet syntax while displaying them as styled HTML.
### 3. Metadata
To make managing post easier, I've added a YAML style metadata section inspired by `Jekyll` at the top of every Markdown file. Metadata include things like post title, tags, description and thumbnail. It is extracted using Regex and discarded before processing the rest of the file.
### 4. Build Process
Thanks to Vite's Hot Module Replacement, the build process is automated! When a Markdown file is updated/added, just save the markdown file and vite will rebuild the corresponding element. The rest of my page and component states is left untouched.
### 5. Testing and Deployment
Before deploying, I always review the final rendering of each post to ensure everything looks as how I intended, on both mobile and desktop. While I haven't come across any major issues yet, I do this as an extra safety measure. It only takes ~30 seconds to do so, and I prefer to be cautious!

---
## That's all!
Thanks for reading!