function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 200, 200);
    this.core = core;

    var state = 0;
    var timer = 0;
    var accel = 0;
    var right;
    var up = 0;
    var image_prefix = "bosses/test2/images/";
    var secondaryColor = false;

    //boss sprite
    var bossSprite;

    //ghetto variables for square

    // called at the very beginning
    this.bossInit = function()
    {
        bossSprite = engine.makeNamedSprite("boss", image_prefix+"sponge.png", core.x, core.y, 24)

        // engine.effects.spellcardCircle(core);
    }

    // gets called every update
    this.bossUpdate = function(player)
    {
        // State system! Each state = different behavior from the boss.

        if(state == 0)
        {
        	engine.effects.displayOverlay("images/harambe.png");
            var playerangle = Math.atan2(core.y - player.getY(), core.x - player.getX()) * 180 / Math.PI;
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, -10*i + 60 + 270 + playerangle, 1 + 0.7*(5 - k), Blue, image_prefix+"leaf_blue.png");
                    b.bulletclass.setParams(80 + (5 - k)*40, -90);
                }
            }

            state = 1;
            timer = 0;
        }

        if(state == 1 && timer == 120)
        {
            var playerangle = Math.atan2(core.y - player.getY(), core.x - player.getX()) * 180 / Math.PI;
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, -10*i + 60 + 90 + playerangle, 1 + 0.7*(5 - k), Blue, image_prefix+"leaf_yellow.png");
                    b.bulletclass.setParams(80 + (5 - k)*40, 90);
                }
            }
            state = 2;
            timer = 0;

            for(var i = 0; i < 6; i++){
                var a = engine.makeBullet(core.x-10, core.y, 180+playerangle, 1 + 0.7*(6 - i), Blue, image_prefix + "player_bullet_same.png");
                var b = engine.makeBullet(core.x+10, core.y, 180+playerangle, 1 + 0.7*(6 - i), Blue, image_prefix + "player_bullet_same.png");
                var c = engine.makeBullet(core.x-10, core.y, 200+playerangle, 1 + 0.7*(6 - i), Blue, image_prefix + "player_bullet_same.png");
                var d = engine.makeBullet(core.x+10, core.y, 160+playerangle, 1 + 0.7*(6 - i), Blue, image_prefix + "player_bullet_same.png");
                a.bulletclass.setParams(100, 0);
                b.bulletclass.setParams(100, 0);
                c.bulletclass.setParams(100, 0);
                d.bulletclass.setParams(100, 0);
            }

        }

        if((state == 2 || state == 5) && timer > 100 && timer < 150)
        {
            if(timer - 101 == 0){
                right = Math.round(Math.random());
                // up = Math.round(Math.random());
                up += 1;
            }

            if (right == 1){
                if(core.x + accel <= 700){
                    //if can move right and should move right
                    console.log("moving right");
                    core.x = core.x + accel;
                }else{
                    //if can't move right but should move right
                    console.log("moving left");
                    core.x = core.x - accel;
                    right = 0;
                }
            }else{
                if(core.x - accel >= 50){
                    //if can move left and should move left
                    console.log("moving left");
                    core.x = core.x - accel;
                }else{
                    //if can't move left but should move left
                    console.log("moving right");
                    core.x = core.x + accel;
                    right = 1;
                }
            }

            if(up % 2 == 1){
                core.y = core.y - accel;
            }else{
                core.y = core.y + accel;
            }
            if(timer < 125)
            {
                accel += 0.2;
            }
            if(timer > 125)
            {
                accel -= 0.2;
            }
            // core.x = core.x + 0.5*accel;
            // core.y = core.y + 0.5*accel;
            engine.setSpritePosition(bossSprite, core.x, core.y)
        }


        //code for circular bullet pattern
        if(state == 4){
            for(var k = 0; k < 5; k++)
            {
                // make 72
                for(var i = 0; i < 72; i++)
                {
                    if(secondaryColor = false)
                    {
                        var b = engine.makeBullet(core.x, core.y, 5*i, 1 + 0.7*(5 - k), Blue, image_prefix+"player_bullet_same2.png");
                        b.bulletclass.setParams(200, 0);
                    }
                    else
                    {
                        var b = engine.makeBullet(core.x, core.y, 5*i, 1 + 0.7*(5 - k), Blue, image_prefix+"player_bullet_same.png");
                        b.bulletclass.setParams(200, 0);
                    }
                }
            }

            

            state = 5;
            timer = 0;
        }

        //pause state after 4
        if(state == 5 && timer == 150){
            state = 4;
            timer = 0;
        }


        if(state == 2 && timer == 150)
        {
        	state = 0;
            timer = 0;
        }

        //if boss hp enters <75%, set secondary fire true
        if((state == 0 || state == 1 || state == 2) && core.health <= 150)
        {
            secondaryFire = true;
        }


        //if boss hp enters 30%, goes into state 4

        if((state == 0 || state == 1 || state == 2) && core.health <= 60)
        {
            core.health = 60;
            engine.clearBullets();
            state = 4;
        }

        if((state == 0 || state == 1 || state == 2) && core.health <= 0)
        {
            engine.removeSprite(bossSprite);
            engine.clearBullets();
            core.health = 500;
            state = 3;
            // console.log("same");
        }
        timer += 1;
        secondaryColor = !secondaryColor;
    }
}

function Blue(bullet)
{
    this.hitbox = new HitboxCircle(13);
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
