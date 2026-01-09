---
title: "Refactored static content generation"
date: "2026-01-09"
time-spent: 0.5
order: 3
---
I refactored the static content generation scripts. Previously, they are just strings hardcoded in 3 different places (the Topbar component, `blog-generator.js` and `project-generator.js`). 

I've now server-side-rendered the React components to static HTML strings in the generator scripts (`blog-generator.tsx` and `project-generator.tsx`) and imported those functions in the build scripts. This makes it easier to maintain the HTML structure of blog posts and project pages since I can now use JSX syntax and React components directly in the generator scripts.