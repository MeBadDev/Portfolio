---
title: Building CipherFS - A really simple link and file sharing system
description: I can't believe the best way to share simple links and files is still typing long URLs or using Google Drive. So I built CipherFS.
date: "2025-12-07"
unix_time: 1765101436
tags: ["devlog", "cipherfs"]
---
###### Written on 2025 December 7

## The background
It's weird to say this myself, but I'm the "computer guy" in my class. One of the most common things I do is help my classmates and teachers put their presentations, videos, and documents on the class computer, so they can show it on the projector. Most of the time, they just message me a file or URL and I transfer it via Google Drive or something else.

It doesn't take long, but it's still a bit of a hassle. The time I spend logging in and verifying 2FA codes, uploading and downloading files that will never be seen again feels a bit wasteful, and most of the time this is overkill. I wanted a better way to do this.

## What I've tried
To solve this problem, I've tried several different methods:
- Hosting a static page that only does one thing: redirect to a file or link, effectively working as a URL shortener. This works, but I have to manually commit and push changes every time I want to share something new. Also, it can only show one file at a time.
- Hosting a static page that shows links and use Firebase Realtime Database to store them. This works better and allows multiple links, but still, I have to manually upload files somewhere else and I'm pretty sure the database link itself has been scraped 10000+ times already, which isn't ideal for school presentations.
- Logging into Line directly on the computer so I don't have to deal with Google Drive. This doesn't really solve the problem, since I still have to log in every time and download/upload files. There's also the risk of exposing my group chats to others if I forget to log out. I'm just not comfortable with that.
- Just typing in the URL manually. This is the most straightforward way, and I can do it fairly quickly. I can also remove the tracking parameters (like `utm_source` and `si`) easily. However, it's still quite error-prone, and doesn't work well for files and really long links.

None of these solutions were ideal for what I needed. I wanted something that is:
- Easy to use
- Able to share multiple links or small files at once
- Secure and private, even if it's scraped a lot

So I decided to make my own solution: **CipherFS**.

## The design
Here's my design goals for CipherFS:
1. I need a way to share links easily. A web interface would be ideal since it's accessible from any device with a browser.
2. I don't want to log in to it, since that will just reintroduce the hassle I'm trying to avoid.
3. I want it to be secure and private, so even if someone scraped the repo, they won't be able to access the files without the key.
4. I want multiple users to find what they need without being able to see things they shouldn't.
5. I don't want to waste any money hosting this, so it has to be cheap. 
6. Might as well allow file sharing too, although it will be limited by GitHub's file size limits (100MB per file), this is still good enough for most school documents and presentations.

## How it works
CipherFS is a web application that shows a graph, built from an encrypted public GitHub repository. A repository contains multiple "groups", and each group contains one or more different "resources", which is basically just files and links. Every group is encrypted with a key. The key is only shared with people who need access to that group. When a user visits the CipherFS web app, they enter the key to decrypt that group (and that group only) to show the files and links.

Since it's *technically* just a static web app hosted on Cloudflare Pages (GitHub pages would work too with an action to build it!), it's completely free to host and clone by anyone. 

Here's a quick overview of how CipherFS works:
1. The admin (me) creates a GitHub repository and adds groups and resources to it
2. The admin shares the hosted URL and the group key with the users who need access
3. The users visit the hosted URL and enter the group key
4. The web app fetches the encrypted data from the GitHub repository and decrypts it
5. The web app displays the resources to the user
6. The user can click on the links or download the files as needed
7. The admin can update the repository at any time to add or remove nodes. There's a button in the app to enter a PAT (Personal Access Token) which allows the app to push changes directly from the web interface without needing to go to GitHub.

Note that it's primarily designed for sharing small files (<100MB) and links. For larger files, it's still faster and better to use Google Drive or similar services.

## Todo:
There are still a lot of things I want to improve and add to CipherFS:
- Improve the UI/UX to make it more user-friendly
- Improve mobile support
- Make a Flutter app for easier uploading and management so I don't have to keep my PAT somewhere
- Add support for more previews
~~- Implement Git LFS to increase max file size from 100MB to 2GB~~ (after reconsideration, this won't be implemented due to the bandwidth limits)
- Allow larger files by slicing them into smaller chunks and reassembling them on the client side

## So that's it!
If you want to check out the demo, visit the [Demo Repository](https://github.com/mebaddev/cipherfs-demo). The app itself is free and open source. It is licensed under GPL 3.0 in [this repository](https://github.com/mebaddev/cipherfs).

