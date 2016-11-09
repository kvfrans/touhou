// EDIT THIS SCRIPT
// This file contains all the stuff for how the boss should act, such as shooting bullets and moving around the screen.

function Boss(engine)
{
    // coordinates for the boss.
    var x = 380;
    var y = 200;

    var state = 0;
    var timer = 0;

    var image_prefix = "bosses/in_1_wriggle/images/";

    var bullets = [];

    // called at the very beginning
    this.bossInit = function()
    {
        engine.makeNamedSprite("boss", image_prefix+"boss.png", x, y, 24)
    }

    // gets called every update
    this.bossUpdate = function(player)
    {
        // State system! Each state = different behavior from the boss.

        // state 0 = sending out yellow leafs
        if(state == 0)
        {
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(x, y, -10*i + 60, 1 + 0.7*(5 - k), YellowTurningLeaf, image_prefix+"leaf_yellow.png");
                    b.bulletclass.setParams(80 + (5 - k)*40);
                    bullets.push(b);
                }
            }
            state = 1;
            timer = 0;
        }
        timer += 1;
    }
}

function YellowTurningLeaf(bullet)
{
    this.hitbox = HitboxCircle(3);
    this.kind = 0;

    var timer = 0;
    var delay;

    this.setParams = function(delay_in)
    {
        delay = delay_in;
    }

    this.update = function()
    {
        if(timer < delay)
        {
            if(bullet.speed > 0.05)
            {
                bullet.speed -= 0.05;
            }
            else
            {
                bullet.speed = 0;
            }
        }
        else if(timer == delay)
        {
            bullet.speed = 2;
            engine.setBulletDirection(bullet, bullet.direction + 90);
        }

        timer += 1;
    }
}
