---
title: "Made a Tetris engine."
date: "2025-12-25"
time-spent: 5
order: 1
---

## Made a Tetris engine.

Yep, that's right. I spent 5.2 hours making a Tetris engine. Please trust me that it's worth it, though, and no, this is not my first time using Godot.

You see, while Tetris is a popular simple beginner project with tons of tutorials, most of them implements it 'incorrectly'. There's actually standards on what Tetris is, including rotation system, kick table, bag system, piece spawn position/orientation etc, which allows for crazily fast Tetris. Most tutorials just go as far as 'blocks fall and when line full clear line', but that's not enough for me.

Here's what I've done:
- A skin system fully compatible with [TETR.IO Plus Skin](https://you.have.fail/tetrioplus/)
- A lore accurate implementation of the popular SRS+ kick table
- Configurable DAS and ARR
- A 7 bag implementation

The engine I've created is exteremly module, you can swap rotation system or throw some pentrominos at the player and it won't complain. 