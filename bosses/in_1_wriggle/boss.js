function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 200, 150);
    this.core = core;
    var image_prefix = "bosses/in_1_wriggle/images/";
    var state = "1_leftleaf";
    var next_state = "1_leftleaf";
    var timer = 0;
    var spellcard = "0_none"

    // params for generic_move
    var desired_x;
    var desired_y;
    var vector_x;
    var vector_y;
    var magnitude_factor;
    var accel = 0;
    var move_delay = 100;

    // params for 3_tripleorbs
    var repeat_count = 0;

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

        if(state == "1_leftleaf")
        {
            var playerangle = Math.atan2(core.y - player.getY(), core.x - player.getX()) * 180 / Math.PI;
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, -10*i + 60 + 270 + playerangle, 1 + 0.7*(5 - k), Leaf, image_prefix+"leaf_blue.png");
                    b.bulletclass.setParams(80 + (5 - k)*40, -90);
                }
            }

            state = "2_rightleaf";
            timer = 0;
        }
        if(state == "2_rightleaf" && timer == 120)
        {
            var playerangle = Math.atan2(core.y - player.getY(), core.x - player.getX()) * 180 / Math.PI;
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, -10*i + 60 + 90 + playerangle, 1 + 0.7*(5 - k), Leaf, image_prefix+"leaf_yellow.png");
                    b.bulletclass.setParams(80 + (5 - k)*40, 90);
                }
            }
            state = "generic_move";
            desired_x = Math.round(Math.random() * 750)
            desired_y = Math.round(Math.random() * 300)
            move_delay = 100;
            next_state = "3_tripleorbs"
            repeat_count = 0;
            timer = 0;
        }

        if(state == "generic_move" && timer > move_delay && timer < move_delay + 50)
        {
            if(timer == move_delay + 1){
                accel = 0;
                total = 0;
                var direction_x = desired_x - core.x;
                var direction_y = desired_y - core.y;
                var magnitude = Math.sqrt(direction_x**2 + direction_y**2);
                vector_x = direction_x / magnitude;
                vector_y = direction_y / magnitude;
                var totalmovements = 600;
                magnitude_factor = magnitude / totalmovements;
            }
            if(timer < move_delay + 25 && timer > move_delay)
            {
                accel += magnitude_factor;
            }
            if(timer > move_delay + 25)
            {
                accel -= magnitude_factor;
            }
            core.x = core.x + vector_x*accel;
            core.y = core.y + vector_y*accel;
            if(timer == move_delay + 49)
            {
                core.x = desired_x;
                core.y = desired_y;
                state = next_state;
                timer = 0;
            }
            engine.setSpritePosition(bossSprite, core.x, core.y)
        }

        if(state == "3_tripleorbs")
        {
            var playerangle = Math.atan2(core.y - player.getY(), core.x - player.getX()) * 180 / Math.PI;
            repeat_count += 1;
            for(var i = 0; i < 3; i++)
            {
                for(var k = 0; k < 10; k++)
                {
                    var b = engine.makeBullet(core.x, core.y, 160 + 20*i + playerangle, 2 + 0.5*k, Leaf, image_prefix+"orb_yellow.png");
                }
            }

            if(repeat_count < 2)
            {
                state = "generic_move"
                move_delay = 50;
                desired_x = Math.round(Math.random() * 750)
                desired_y = Math.round(Math.random() * 300)
                next_state = "3_tripleorbs"
                timer = 0;
            }
            else
            {
                state = "generic_move"
                move_delay = 50;
                desired_x = Math.round(Math.random() * 750)
                desired_y = Math.round(Math.random() * 300)
                next_state = "1_leftleaf"
                timer = 0;
            }
        }


        if(core.health <= 0)
        {
            engine.clearBullets();
            if(spellcard == "0_none")
            {
                spellcard = "1_firefly";
                state = "generic_move";
                next_state = "4_arcs"
                move_delay = 25;
                desired_x = 380;
                desired_y = 200;
                core.health = 150;
            }
        }
        timer += 1;
    }
}

function Leaf(bullet)
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
