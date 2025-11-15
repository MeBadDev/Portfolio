# My personal website
This repo hosts the source code of [my site](https://mebaddev.net).
It's quite bad since I made it when I was still learning React, but as I improve, I will try to come back and refactor it bit by bit.

So far, it features:
- A blog system that converts markdown files to HTML on build time
- A tetrio stats viewer that shows my game stats (because why not lol)
- A 404 page
- A cool parallax mountain thing
- A pixelated look
- A really messy codebase (will fix soon™)


## Writing blog posts
All blog posts are written in markdown and stored in `src/blogs/`. To create a new blog post, run `npm run generate-blog` and follow the instructions. This will create a new markdown file with the appropriate metadata template for you to fill in.

## Building the site
To build the site, run `npm run build`. This will compile the typescript files,
convert markdown files to HTML, and generate the RSS feed.

## TODOs:
- Improve the styling of the blog posts
- Add a project showcase page
- Refactor the codebase because it's ugly
- Add comments to blog posts
- Allow previewing blog posts without building the entire site
- Add some small hidden games? idk
- Figure out how to add dark mode without breaking the style