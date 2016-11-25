// EDIT THIS SCRIPT
// This file contains all the stuff for how the boss should act, such as shooting bullets and moving around the screen.

function Boss(engine)
{
    // coordinates for the boss.
    var x = 380;
    var y = 200;

    var test;

    // called at the very beginning
    this.bossInit = function()
    {
        engine.makeNamedSprite("boss", "bosses/test/images/boss.png", x, y)
        test = engine.makeBullet(380, 200, 90, 1, "bosses/test/images/bullet.png")
    }

    // gets called every update
    this.bossUpdate = function(player)
    {
        engine.setBulletDirection(test, test.direction + 1);
    }
}
