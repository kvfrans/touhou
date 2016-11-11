=======
# Touhou Docs

engine for web-based bullet dodging game

Run 'python -m SimpleHTTPServer', then go to localhost:8000

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

`boss.js` is where the majority of the code should go: this is where you specify all the bullet patterns, how the boss moves around, and so on.

#### Bullets

The most important part of the game.
In the engine, every bullet has a class. Define a bullet class like so:
```
function BulletClassName(bullet)
{
    this.update = function()
    {
        engine.setBulletDirection(bullet, bullet.direction + 1);
    }
}
```

Every frame, the main engine will call the update function in every bullet currently on the screen. Bullets that leave the screen will be deleted automatically.

To create a bullet of a specific class, call the following engine function:
```
    engine.makeBullet(x, y, direction, speed, bulletclass, texturename);
```
Bullets have a direction, in degrees (0 to 360). They also have a speed. Each frame, the engine moves every bullet by their direction and speed.

Example of making a bullet:
```
    engine.makeBullet(50, 50, 90, 5, Generic, "images/player_bullet.png")
```

#### Engine

Everything you write in `boss.js` can call functions from the `engine` class.

`engine.makeNamedSprite(name, texture, x, y)`

>Creates a sprite with a texture and x,y coordinated.

`engine.spriteFromName(name)`

>Get a previously made sprite from its name.

`engine.moveSprite(sprite, x, y)`

Move sprite to positions x, y.

`engine.rotateSprite(sprite, degrees)`

Rotate a sprite, around the center.

`engine.changeSpriteTexture(sprite, texturename)`

Change a sprite's image to another.

`engine.changeSpriteOpacity(sprite, opacity)`

Change sprite's transparency, from 0 to 1.

`engine.removeSprite(sprite)`

Remove a sprite from the game.
