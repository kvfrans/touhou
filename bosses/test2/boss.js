function Boss(engine)
{
    // coordinates for the boss.
    var x = 380;
    var y = 200;

    var state = 0;
    var timer = 0;

    var image_prefix = "bosses/test2/images/";

    // called at the very beginning
    this.bossInit = function()
    {
        engine.makeNamedSprite("boss", image_prefix+"boss.png", x, y, 24)
    }

    // gets called every update
    this.bossUpdate = function(player)
    {
        // State system! Each state = different behavior from the boss.

        if(state == 0)
        {
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(x, y, -10*i + 60 + 180, 1 + 0.7*(5 - k), Blue, image_prefix+"player_bullet_same.png");
                    b.bulletclass.setParams(80 + (5 - k)*40, -90);
                }
            }
            state = 1;
            timer = 0;
        }

        timer += 1;

        if(state == 1 && timer == 120)    
        {
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(x, y, -10*i + 60, 1 + 0.7*(5 - k), Blue, image_prefix+"player_bullet_same2.png");
                    b.bulletclass.setParams(80 + (5 - k)*40, 90);
                }
            }
            state = 2;
            timer = 0;
        }


    }



}

function Blue(bullet)
{
    this.hitbox = HitboxCircle(3);
    this.kind = 0;

    var timer = 0;
    var delay;
    var turndir;

    this.setParams = function(delay_in, turndir_in)
    {
        delay = delay_in;
        turndir = turndir_in;
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
            bullet.speed = 4;
            engine.setBulletDirection(bullet, bullet.direction + turndir);
        }

        timer += 1;
    }
}
