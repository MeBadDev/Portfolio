---
title: Hello, World!
id: hello_world
description: The very first post on this website, this post showcases every Markdown syntax supported by my MD -> HTML convertor.
tags: testing, markdown
date: 2024-09-08
---
###### Written on 2024 September 8
I am pretty bored so I began to work on a system that allows me to write markdown and have them compiled into HTML on build. This allows me to write articles/post with rich format in a relatively simple way.

## Why don't you just use HTML?
There are mainly 3 reasons:
1. I already know HTML, and want to learn new stuffs
2. Markdowns is much faster and easier to write than HTML (in most case)
3. It allows you to focus more on the actual *content* rather than the *structure*.

For example, here's how one bolds a word in HTML:
```html
<p>Web development is <b>Fun!</b></p>
```

And here's how to do it in markdown:
```md
Web development is **Fun!**
```


My goal is to be able to style this page and create a simple and consistent style for all my future posts.


---
## Supported syntaxs
 Technically, all of those elements are 'working' if they correctly converted to HTML, and is rendering. But let's check if their styling and other stuffs are correct!


---
### Headings:

# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6 (kinda useless)

---

### Emphasis
Here's some **Bold Texts**

and *Italic Texts*!


---
### Blockquotes
> You know it's cold outside when you go outside and it's cold
> 
> -- Random Redditor, I think.

---
### Lists
#### Ordered List
1. Single
2. Double
3. Triple
4. TETRIS

#### Unordered List
* Milk
* Ham
* Butter
* Toast
---

### Code Blocks
(Took me so long to get syntax highlighting working!)

`Inline Code Blocks`
```js
// Supports syntax highlighting!

function sayHello() {
    console.log("Hello, World!");
}
sayHello();
```

---
### Images
#### A random cat I found on the Internet
![A random cat I found on the Internet](https://i.pinimg.com/736x/3b/37/cd/3b37cd80d4f092ed392b1453b64cf0d0.jpg)

### Links
(I always forgot if its `[]()` or `()[]`)

#### A link to My [Personal Website](https://mebaddev.github.io)

## Thats all!

Thanks for reading! I hope you enjoy it!