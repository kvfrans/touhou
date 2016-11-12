function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 200, 100);
    this.core = core;

    var state = 0;
    var timer = 0;
    var accel = 0;
    var right;
    var up = 0;
    var image_prefix = "bosses/test2/images/";

    //boss sprite
    var bossSprite;

    // called at the very beginning
    this.bossInit = function()
    {
        bossSprite = engine.makeNamedSprite("boss", image_prefix+"boss.png", core.x, core.y, 24)
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
        }

        if(state == 2 && timer > 100 && timer < 150)
        {


            // if(timer - 101 == 0){
            //     console.log(timer);
            //     right = Math.round(Math.random());
            //     // up = Math.round(Math.random());
            //     up += 1;
            //     console.log(right);
            //     console.log(up);
            // }


            // if(right == 1){

            //     if(core.x + accel <= 700){
            //         //if can move right and should move right
            //         console.log("moving right");
            //         core.x = core.x + accel;
            //     }else{
            //         //if can't move right but should move right
            //         console.log("moving left");
            //         core.x = core.x - accel;
            //         right = 0;
            //     }
            // }else{
            //     if(core.x - accel >= 50){
            //         //if can move left and should move left
            //         console.log("moving left");
            //         core.x = core.x - accel;
            //     }else{
            //         //if can't move left but should move left
            //         console.log("moving right");
            //         core.x = core.x + accel;
            //         right = 1;
            //     }

            // }
            // if(up % 2 == 1){
            //     // console.log("moving up");
            //     // if(core.y - accel > 50)
            //     // {
            //     //     //if can move up and should move up
            //     //     core.y = core.y - accel;
            //     // }else{
            //     //     //if can't move up but should move up
            //     //     core.y = core.y + accel;
            //     //     up = 0;
            //     // }
            //     core.y = core.y - accel;
            // }else{
            //     // console.log("moving down")
            //     // if(core.y + accel > 400)
            //     // {
            //     //     //if can move down and should move down
            //     //     core.y = core.y + accel;
            //     // }else{
            //     //     //if can't move down but should move down
            //     //     core.y = core.y - accel;
            //     //     up = 1;
            //     // }
            // }
            //     core.y = core.y + accel;

        }
        if(state == 2 && timer == 150)
        {
        	state = 0;
        }

        if(timer < 125)
        {
            accel += 0.2;
        }
        else
        {
            accel -= 0.2;
        }
        engine.moveSprite(bossSprite, core.x, core.y);
        timer += 1;

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
