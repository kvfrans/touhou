### Touhou Docs

It's an engine for creating bullet-hell like games in the browser.

To create a new level, make a new folder in the bosses folder. The structure should go:
```
bosses/name_of_boss
    images/
        boss_image1.png
        boss_image2.png
    boss.js
    images.js
```

`images.js` contains the names of all the images in the `images` folder, so the engine can load them all.

`boss.js` is where the meat of the code should go: this is where you specify all the bullet patterns, how the boss moves around, and so on.

#### Engine

Everything you write in `boss.js` can call functions from the `engine` class.

`engine.`
