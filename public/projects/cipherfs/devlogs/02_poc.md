---
title: "Built a Proof of Concept for CipherFS"
date: "2025-10-6"
time-spent: 1.5
order: 2
---

I spent a couple of hours building a quick PoC for CipherFS. I've made a test repository and used GitHub's API to fetch the files. I managed to encrypt and decrypt the data using the Web Crypto API, and display the links and files in a simple web interface.

It's built using React, Vite and TailwindCSS since I'm familiar with those stuff. The entire thing is pretty simple, but it works! I'll now implement some way for it to be possible to have multiple groups up there. That way, I can share different keys with different people.