---
title: The most annoying bookmarklet the world has ever seen.
id: annoying_bookmarklet
description: Bookmarklets can be a great tool for things like open page that doesn't exist anymore in Web Archive, but what else can one do with it?
tags: bookmarklet,fun,technical
date: 2024-09-30
---
###### Written on 2024 September 30

## Bookmarklets are pretty cool.
There's a lot you can do with them, from interactive bookmarks to useful tools that help you get things done easier, however, there's also potential for creating bookmarklets that are purely designed to annoy users. In this article, Ill show how I made what might be the most irritating bookmarklet ever conceived. Why? because why not lol.

#### But first,
### What is a "Bookmarklet"?
Bookmarklets are small snippets of JS code that can be saved as a bookmark in your web browser. They allow you to quickly perform actions on a web page without having to install additional extensions. For example, you can create a bookmarklet to translate a webpage into a different language, or modify the page's layout to fit your liking. However, Bookmarklets also open up a vulnerability called "Self XSS", where the user unknowingly runs malicious code in their own web browser. The YouTube Channel [No Text To Speech](https://www.youtube.com/c/NoTextToSpeech) had a video about a scam website that 'requires you to verify your Roblox account' using a bookmarklet, which actually steals your Roblox item. You can watch that video [Here.](https://www.youtube.com/watch?v=mNEdjq6xDUk)

---

## Creating a bookmarklet
Creating a bookmarklet is surprisingly simple. Just open up a bookmarklet generator (Like [this one, for example](https://caiorss.github.io/bookmarklet-maker/)), write your javascript, smash the 'Generate Bookmarklet' button, and bam! There's your bookmarklet.

An example:
1. Bring up your bookmark bar (usually by pressing Ctrl+Shift+B)
2. Give it a name, any name you like.
3. Paste the following content into the URL field:
```js
javascript:alert('Hello, world!');
```
4. Click on that bookmark.

If you have done that correctly, you should see a popup with the content `'Hello, world!'`.

---

## Create a bookmarklet that annoys the heck outta user
That's cool, but it's boring! What if we put the above function in a `setInterval()`?
```js
function spam() {
    alert("awa");
}
setInterval(spam, 10);
```

##### The generated bookmarklet:
```js
javascript:(function()%7Bfunction%20spam()%20%7B%0A%20%20%20%20alert(%22awa%22)%3B%0A%7D%0AsetInterval(spam%2C%2010)%3B%7D)()%3B
```

Yep! That's better, but not enough! How can I annoy the user *even more*? I kept that question in my mind and clicked the 'Enter Matchmaking' button in [tetr.io](https://tetr.io). Suddenly, a notification popped:
![](/imgs/blogs/tetr-notification.png)

That's **exactly** what I am looking for! Let's flood the browser with notifications!

---

## Flooding the Browser with Notifications

So, now that we've leveled up from simple `alert()` spam, it's time to take things up a notch by flooding the browser with notifications! Notifications are a great way to catch someone's attention, and with the **Notification API** in JavaScript, you can send endless pop-ups to the user's screen.

Here's a basic example of how to trigger a notification:

```js
function annoyWithNotification() {
    if (Notification.permission === 'granted') {
        new Notification("Annoying Notification", {
            body: "Here's a fun message to interrupt your day!"
        });
    }
}
```

Before you start spamming notifications, though, you'll need the user to grant permission for them. This is how you request permission:

```js
Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
    }
});
```

But let's not stop there! Why send just one notification when you can send hundreds? Here's how you can make it truly unbearable:

```js
setInterval(annoyWithNotification, 100);
```

If you want to try this bookmarklet, heres the generated JS:
```js
javascript:(function()%7Bfunction%20annoyWithNotification()%20%7B%0A%20%20%20%20if%20(Notification.permission%20%3D%3D%3D%20'granted')%20%7B%0A%20%20%20%20%20%20%20%20new%20Notification(%22Annoying%20Notification%22%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20body%3A%20%22Here's%20a%20fun%20message%20to%20interrupt%20your%20day!%22%0A%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%7D%0A%7D%0A%0ANotification.requestPermission().then(permission%20%3D%3E%20%7B%0A%20%20%20%20if%20(permission%20%3D%3D%3D%20'granted')%20%7B%0A%20%20%20%20%20%20%20%20console.log('Notification%20permission%20granted.')%3B%0A%20%20%20%20%20%20%20%20setInterval(annoyWithNotification%2C%20100)%3B%0A%20%20%20%20%7D%0A%7D)%3B%7D)()%3B
```

(well, my syntax highlighter doesn't seems to like that, but who cares?)

---

## Adding annoying messages

Language is a very important tool that helps us share our thoughts and feelings with others. By using words in a clever way, we can show how we're feeling and make others feel the same way. Language is powerful because it can help us understand each other better and connect with people on a deeper level.

Do you know what do I mean?

That's right, lets annoy the user **EVEN MOREEEEE** using the power of language!

I first asked ChatGPT to generate an array of string that will make you uncomfortable when readed, here's the list:
```js
const annoyingMessages = [
    "You will notice your breathing and blinking at the moment you read this. Pretty annoying, right?",
    "Are you suddenly aware of how your tongue feels in your mouth?",
    "Notice how your feet feel in your shoes right now. Uncomfortable yet?",
    "You're manually controlling your breathing now, aren't you?",
    "Now that you're thinking about it, how comfortable is your sitting position?",
    "Have you noticed that you can only swallow a few times in a row before it feels weird?",
    "Your nose is always in your field of vision, but your brain ignores it. Until now.",
    "You're suddenly aware of how heavy your arms feel at your sides.",
    "Remember that song stuck in your head last week? It's back now.",
    "Why is it that you never really feel your clothes touching your skin until you think about it?",
    "Now you're aware of how dry or wet your mouth feels.",
    "You can never truly get comfortable when you start thinking about your posture. How about now?",
    "Have you ever noticed that when you think about it, your tongue is never fully comfortable?",
    "Your jaw feels tense now that I've mentioned it, doesn't it?",
    "You're blinking manually now. It's pretty annoying once you notice, right?"
];
```

and a function to randomly select one of the message from the array:
```js
function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * annoyingMessages.length);
    return annoyingMessages[randomIndex];
}
```
Now combine this with the notification-spamming bookmarklet we've made, here's what we got:
```js
javascript:(function()%7Bconst%20annoyingMessages%20%3D%20%5B%22You%20will%20notice%20your%20breathing%20and%20blinking%20at%20the%20moment%20you%20read%20this.%20Pretty%20annoying%2C%20right%3F%22%2C%20%22Are%20you%20suddenly%20aware%20of%20how%20your%20tongue%20feels%20in%20your%20mouth%3F%22%2C%20%22Notice%20how%20your%20feet%20feel%20in%20your%20shoes%20right%20now.%20Uncomfortable%20yet%3F%22%2C%20%22You%E2%80%99re%20manually%20controlling%20your%20breathing%20now%2C%20aren%27t%20you%3F%22%2C%20%22Now%20that%20you%27re%20thinking%20about%20it%2C%20how%20comfortable%20is%20your%20sitting%20position%3F%22%2C%20%22Have%20you%20noticed%20that%20you%20can%20only%20swallow%20a%20few%20times%20in%20a%20row%20before%20it%20feels%20weird%3F%22%2C%20%22Your%20nose%20is%20always%20in%20your%20field%20of%20vision%2C%20but%20your%20brain%20ignores%20it.%20Until%20now.%22%2C%20%22You%E2%80%99re%20suddenly%20aware%20of%20how%20heavy%20your%20arms%20feel%20at%20your%20sides.%22%2C%20%22Remember%20that%20song%20stuck%20in%20your%20head%20last%20week%3F%20It%E2%80%99s%20back%20now.%22%2C%20%22Why%20is%20it%20that%20you%20never%20really%20feel%20your%20clothes%20touching%20your%20skin%20until%20you%20think%20about%20it%3F%22%2C%20%22Now%20you%E2%80%99re%20aware%20of%20how%20dry%20or%20wet%20your%20mouth%20feels.%22%2C%20%22You%20can%20never%20truly%20get%20comfortable%20when%20you%20start%20thinking%20about%20your%20posture.%20How%20about%20now%3F%22%2C%20%22Have%20you%20ever%20noticed%20that%20when%20you%20think%20about%20it%2C%20your%20tongue%20is%20never%20fully%20comfortable%3F%22%2C%20%22Your%20jaw%20feels%20tense%20now%20that%20I%E2%80%99ve%20mentioned%20it%2C%20doesn%E2%80%99t%20it%3F%22%2C%20%22You%E2%80%99re%20blinking%20manually%20now.%20It%E2%80%99s%20pretty%20annoying%20once%20you%20notice%2C%20right%3F%22%5D%3Bfunction%20getRandomMessage()%20%7Bconst%20randomIndex%20%3D%20Math.floor(Math.random()%20*%20annoyingMessages.length)%3Breturn%20annoyingMessages%5BrandomIndex%5D%3B%7Dfunction%20annoyWithNotification()%20%7Bif%20(Notification.permission%20%3D%3D%3D%20%27granted%27)%20%7Bnew%20Notification(%22Annoying%20Notification%22%2C%20%7Bbody%3A%20getRandomMessage()%7D)%3B%7D%7DNotification.requestPermission().finally(()%20%3D%3E%20%7BsetInterval(annoyWithNotification%2C%20200)%3B%7D)%7D)()%3B
```
---

## Adding random popups
So far, we've used notification and annoying messages, but there's an ENTIRE TOOLKIT of browser annoyances at our diposal! Let's take things up a level by using random popups. I've wrote this little function that opens a new window at random position, with random size, containing random annoying messages we wrote earlier:
```js
function annoyWithWindows() {
    console.log('Annoying, right?');

    let randomWidth = Math.floor(Math.random() * 200) + 100;
    let randomHeight = Math.floor(Math.random() * 200) + 100;
    let randomX = Math.floor(Math.random() * window.screen.width);
    let randomY = Math.floor(Math.random() * window.screen.height);
    let randomMessage = annoyingMessages[Math.floor(Math.random() * annoyingMessages.length)];
    let newWindow = window.open("", "", `width=${randomWidth},height=${randomHeight},left=${randomX},top=${randomY}`);
    newWindow.document.write(`<h3 style="color:red">${randomMessage}</h3>`);

    setTimeout(() => newWindow.close(), Math.floor(Math.random() * 3000) + 1000);
}
```

Intergrate this with the rest of the script, I've created what might be the most annoying bookmarklet the world have ever seen.

## The Full Code
### Source
```js
const annoyingMessages = [
    "You will notice your breathing and blinking at the moment you read this. Pretty annoying, right?",
    "Are you suddenly aware of how your tongue feels in your mouth?",
    "Notice how your feet feel in your shoes right now. Uncomfortable yet?",
    "You're manually controlling your breathing now, aren't you?",
    "Now that you're thinking about it, how comfortable is your sitting position?",
    "Have you noticed that you can only swallow a few times in a row before it feels weird?",
    "Your nose is always in your field of vision, but your brain ignores it. Until now.",
    "You're suddenly aware of how heavy your arms feel at your sides.",
    "Remember that song stuck in your head last week? It's back now.",
    "Why is it that you never really feel your clothes touching your skin until you think about it?",
    "Now you're aware of how dry or wet your mouth feels.",
    "You can never truly get comfortable when you start thinking about your posture. How about now?",
    "Have you ever noticed that when you think about it, your tongue is never fully comfortable?",
    "Your jaw feels tense now that I've mentioned it, doesn't it?",
    "You're blinking manually now. It's pretty annoying once you notice, right?"
];

function requestNotificationPermission() {
    return new Promise((resolve, reject) => {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    resolve();
                } else {
                    reject("Notification permission denied.");
                }
            });
        } else if (Notification.permission === "granted") {
            resolve();
        } else {
            reject("Notification permission denied.");
        }
    });
}
function annoyWithNotification() {
    if (Notification.permission === "granted") {
        let randomMessage = annoyingMessages[Math.floor(Math.random() * annoyingMessages.length)];
        new Notification("Annoying Notification", {
            body: randomMessage,
            icon: 'https://via.placeholder.com/50'
        });
    }
}

function annoyWithWindows() {
    console.log('Annoying, right?');

    let randomWidth = Math.floor(Math.random() * 200) + 100;
    let randomHeight = Math.floor(Math.random() * 200) + 100;
    let randomX = Math.floor(Math.random() * window.screen.width);
    let randomY = Math.floor(Math.random() * window.screen.height);
    let randomMessage = annoyingMessages[Math.floor(Math.random() * annoyingMessages.length)];

    let newWindow = window.open("", "", `width=${randomWidth},height=${randomHeight},left=${randomX},top=${randomY}`);
    newWindow.document.write(`<h3 style="color:red">${randomMessage}</h3>`);

    setTimeout(() => newWindow.close(), Math.floor(Math.random() * 3000) + 1000);
}

function annoy() {
    annoyWithWindows();
    annoyWithNotification();
}

requestNotificationPermission().catch((err) => {
    console.log(err);
}).finally(() => {
    console.log("Let the chaos begin!");
    setInterval(annoy, 100);
});

```
### Bookmarklet
```js
javascript:(function()%7Bconst%20annoyingMessages%20%3D%20%5B%0A%20%20%20%20%22You%20will%20notice%20your%20breathing%20and%20blinking%20at%20the%20moment%20you%20read%20this.%20Pretty%20annoying%2C%20right%3F%22%2C%0A%20%20%20%20%22Are%20you%20suddenly%20aware%20of%20how%20your%20tongue%20feels%20in%20your%20mouth%3F%22%2C%0A%20%20%20%20%22Notice%20how%20your%20feet%20feel%20in%20your%20shoes%20right%20now.%20Uncomfortable%20yet%3F%22%2C%0A%20%20%20%20%22You%E2%80%99re%20manually%20controlling%20your%20breathing%20now%2C%20aren't%20you%3F%22%2C%0A%20%20%20%20%22Now%20that%20you're%20thinking%20about%20it%2C%20how%20comfortable%20is%20your%20sitting%20position%3F%22%2C%0A%20%20%20%20%22Have%20you%20noticed%20that%20you%20can%20only%20swallow%20a%20few%20times%20in%20a%20row%20before%20it%20feels%20weird%3F%22%2C%0A%20%20%20%20%22Your%20nose%20is%20always%20in%20your%20field%20of%20vision%2C%20but%20your%20brain%20ignores%20it.%20Until%20now.%22%2C%0A%20%20%20%20%22You%E2%80%99re%20suddenly%20aware%20of%20how%20heavy%20your%20arms%20feel%20at%20your%20sides.%22%2C%0A%20%20%20%20%22Remember%20that%20song%20stuck%20in%20your%20head%20last%20week%3F%20It%E2%80%99s%20back%20now.%22%2C%0A%20%20%20%20%22Why%20is%20it%20that%20you%20never%20really%20feel%20your%20clothes%20touching%20your%20skin%20until%20you%20think%20about%20it%3F%22%2C%0A%20%20%20%20%22Now%20you%E2%80%99re%20aware%20of%20how%20dry%20or%20wet%20your%20mouth%20feels.%22%2C%0A%20%20%20%20%22You%20can%20never%20truly%20get%20comfortable%20when%20you%20start%20thinking%20about%20your%20posture.%20How%20about%20now%3F%22%2C%0A%20%20%20%20%22Have%20you%20ever%20noticed%20that%20when%20you%20think%20about%20it%2C%20your%20tongue%20is%20never%20fully%20comfortable%3F%22%2C%0A%20%20%20%20%22Your%20jaw%20feels%20tense%20now%20that%20I%E2%80%99ve%20mentioned%20it%2C%20doesn%E2%80%99t%20it%3F%22%2C%0A%20%20%20%20%22You%E2%80%99re%20blinking%20manually%20now.%20It%E2%80%99s%20pretty%20annoying%20once%20you%20notice%2C%20right%3F%22%0A%5D%3B%0A%0Afunction%20requestNotificationPermission()%20%7B%0A%20%20%20%20return%20new%20Promise((resolve%2C%20reject)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20(Notification.permission%20%3D%3D%3D%20%22default%22)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20Notification.requestPermission().then(permission%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(permission%20%3D%3D%3D%20%22granted%22)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20resolve()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20reject(%22Notification%20permission%20denied.%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20if%20(Notification.permission%20%3D%3D%3D%20%22granted%22)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20resolve()%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20reject(%22Notification%20permission%20denied.%22)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D)%3B%0A%7D%0Afunction%20annoyWithNotification()%20%7B%0A%20%20%20%20if%20(Notification.permission%20%3D%3D%3D%20%22granted%22)%20%7B%0A%20%20%20%20%20%20%20%20let%20randomMessage%20%3D%20annoyingMessages%5BMath.floor(Math.random()%20*%20annoyingMessages.length)%5D%3B%0A%20%20%20%20%20%20%20%20new%20Notification(%22Annoying%20Notification%22%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20body%3A%20randomMessage%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20icon%3A%20'https%3A%2F%2Fvia.placeholder.com%2F50'%0A%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%7D%0A%7D%0A%0Afunction%20annoyWithWindows()%20%7B%0A%20%20%20%20console.log('Annoying%2C%20right%3F')%3B%0A%0A%20%20%20%20let%20randomWidth%20%3D%20Math.floor(Math.random()%20*%20200)%20%2B%20100%3B%0A%20%20%20%20let%20randomHeight%20%3D%20Math.floor(Math.random()%20*%20200)%20%2B%20100%3B%0A%20%20%20%20let%20randomX%20%3D%20Math.floor(Math.random()%20*%20window.screen.width)%3B%0A%20%20%20%20let%20randomY%20%3D%20Math.floor(Math.random()%20*%20window.screen.height)%3B%0A%20%20%20%20let%20randomMessage%20%3D%20annoyingMessages%5BMath.floor(Math.random()%20*%20annoyingMessages.length)%5D%3B%0A%0A%20%20%20%20let%20newWindow%20%3D%20window.open(%22%22%2C%20%22%22%2C%20%60width%3D%24%7BrandomWidth%7D%2Cheight%3D%24%7BrandomHeight%7D%2Cleft%3D%24%7BrandomX%7D%2Ctop%3D%24%7BrandomY%7D%60)%3B%0A%20%20%20%20newWindow.document.write(%60%3Ch3%20style%3D%22color%3Ared%22%3E%24%7BrandomMessage%7D%3C%2Fh3%3E%60)%3B%0A%0A%20%20%20%20setTimeout(()%20%3D%3E%20newWindow.close()%2C%20Math.floor(Math.random()%20*%203000)%20%2B%201000)%3B%0A%7D%0A%0A%2F%2F%20Main%20annoy%20function%0Afunction%20annoy()%20%7B%0A%20%20%20%20annoyWithWindows()%3B%0A%20%20%20%20annoyWithNotification()%3B%0A%7D%0A%0ArequestNotificationPermission().catch((err)%20%3D%3E%20%7B%0A%20%20%20%20console.log(err)%3B%0A%7D).finally(()%20%3D%3E%20%7B%0A%20%20%20%20console.log(%22Let%20the%20chaos%20begin!%22)%3B%0A%20%20%20%20setInterval(annoy%2C%20100)%3B%0A%7D)%3B%7D)()%3B
```

## Conclusion

This demonstration shows just how powerful and disruptive bookmarklets can be when misused. While it's all fun and games here, it also serves as a reminder to be careful with any JavaScript you allow to run in your browser. Bookmarklets may be simple, but as we've seen, they can be used in surprisingly sophisticated (and irritating) ways!

The possibilities are endless when it comes to making life difficult for someone. But, please remember to use your powers responsibly!