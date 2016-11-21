var image_prefix = "bosses/in_4_marisa/resources/";

function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 200, 150);
    this.core = core;
    var image_prefix = "bosses/in_4_marisa/resources/";
    var state = "1_leftleaf";
    var next_state = "1_leftleaf";
    var timer = 0;
    var spellcard = "0_none"

    // params for Generic(8)_move
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
        console.log("marisa");
        bossSprite = engine.makeNamedSprite("boss", image_prefix+"boss.png", core.x, core.y, 24)
        console.log(bossSprite)

        // var sound = new Howl({
        //     src: [image_prefix+'bg.mp3']
        // });
        // sound.play();
    }

    // gets called every update
    this.bossUpdate = function(player)
    {
        // State system! Each state = different behavior from the boss.

        // if(state == "1_leftleaf" && timer == 0)
        // {
        //     var b = engine.makeBullet(core.x, core.y, 90, 2, Generic(19), image_prefix+"orb_yellow.png");
        // }
        if(state == "1_leftleaf")
        {
            engine.effects.spellCharge();
            var playerangle = Math.atan2(core.y - player.getY(), core.x - player.getX()) * 180 / Math.PI;
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, -10*i + 60 + 270 + playerangle, 1 + 0.7*(5 - k), Leaf, image_prefix+"leaf_blue.png");
                    b.bulletclass.setParams(30 + (5 - k)*30, -90);
                }
            }

            state = "2_rightleaf";
            timer = 0;
        }
        if(state == "2_rightleaf" && timer == 80)
        {
            var playerangle = Math.atan2(core.y - player.getY(), core.x - player.getX()) * 180 / Math.PI;
            // make five rounds of yellow leafs
            for(var k = 0; k < 5; k++)
            {
                // make 13 yellow leafs in part of a circle
                for(var i = 0; i < 13; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, -10*i + 60 + 90 + playerangle, 1 + 0.7*(5 - k), Leaf, image_prefix+"leaf_yellow.png");
                    b.bulletclass.setParams(30 + (5 - k)*30, 90);
                }
            }
            state = "generic_move";
            desired_x = Math.round(Math.random() * 750)
            desired_y = Math.round(Math.random() * 300)
            move_delay = 150;
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
                    var b = engine.makeBullet(core.x, core.y, 160 + 20*i + playerangle, 2 + 0.5*k, Generic(12), image_prefix+"orb_yellow.png");
                }
            }

            state = "generic_move"
            move_delay = 20;
            desired_x = Math.round(Math.random() * 350) + 200
            desired_y = Math.round(Math.random() * 200) + 100
            timer = 0;
            if(repeat_count <= 2)
            {
                next_state = "3_tripleorbs"
            }
            else
            {
                next_state = "1_leftleaf"
            }
        }

        if(state == "4_arcs")
        {
            if(timer % 10 == 0)
            {
                for(var i = 0; i < 4; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, 90*i + timer, 4, LeafTwoDelay, image_prefix+"leaf_yellow.png");
                    b.bulletclass.setParams(270);

                    var b = engine.makeBullet(core.x, core.y, 90*i - timer, 6, LeafTwoDelay, image_prefix+"leaf_yellow.png");
                    b.bulletclass.setParams(90);
                }
            }
            if(timer % 20 == 0)
            {
                for(var i = 0; i < 8; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, 180 - timer - i*8, 3, Generic(8), image_prefix+"leaf_yellow.png");
                }
            }
            if(timer == 220)
            {
                state = "generic_move"
                move_delay = 50;
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 200) + 100
                next_state = "4_arcs"
                timer = 0;
            }
        }

        if(state == "5_circles")
        {
            if(timer == 30)
            {
                for(var i = 0; i < 30; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, i*12, 3, Generic(8), image_prefix+"leaf_blue.png");
                    var b = engine.makeBullet(core.x, core.y, i*12, 4, Generic(8), image_prefix+"leaf_blue.png");

                }

                engine.makeBullet(core.x, core.y, 45, 4, Spawner, image_prefix+"spirit_white.png");
                engine.makeBullet(core.x, core.y, 135, 4, Spawner, image_prefix+"spirit_white.png");
                state = "generic_move"
                move_delay = 10;
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 200) + 100
                next_state = "5_circles"
                timer = 0;
            }
        }

        if(state == "6_spirals")
        {
            if(timer > 30 && timer < 500 && timer % 5 == 0)
            {
                for(var i = 0; i < 5; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, i*72 + timer, 6, ThreeStage, image_prefix+"orb_white.png");
                    b.bulletclass.setParams((timer % 15) / 5)
                }
            }
            if(timer == 600)
            {
                state = "generic_move"
                move_delay = 10;
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 200) + 100
                next_state = "6_spirals"
                timer = 0;
            }
        }

        // console.log(state);

        if(core.health <= 0)
        {
            engine.clearBullets();
            if(spellcard == "0_none")
            {
                timer = 0;
                spellcard = "1_firefly";
                state = "generic_move";
                next_state = "4_arcs"
                move_delay = 25;
                desired_x = 380;
                desired_y = 200;
                core.health = 150;
                engine.effects.startSpellcard("images/harambe_kun.png","Lamp Sign [Firefly Phenomenon]")
            }
            else if(spellcard == "1_firefly")
            {
                timer = 0;
                spellcard = "2_none";
                state = "generic_move";
                next_state = "5_circles"
                move_delay = 25;
                desired_x = 380;
                desired_y = 200;
                core.health = 150;
                engine.effects.endSpellcard();
            }
            else if(spellcard == "2_none")
            {
                timer = 0;
                spellcard = "3_nightbug";
                state = "generic_move";
                next_state = "6_spirals"
                move_delay = 25;
                desired_x = 380;
                desired_y = 200;
                core.health = 550;
                core.maxhealth = 550;
                engine.effects.startSpellcard("images/harambe_kun.png","Wriggle Sign [Night Bug Storm]")
            }
        }
        timer += 1;
    }
}

function Leaf(bullet)
{
    this.hitbox = new HitboxCircle(8);
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

function LeafTwoDelay(bullet)
{
    this.hitbox = new HitboxCircle(8);
    this.kind = 0;

    var timer = 0;
    var state = 0;
    var turndir;

    this.setParams = function(turndir_in)
    {
        turndir = turndir_in;
    }

    this.update = function()
    {
        if(state == 0)
        {
            if(bullet.speed > 0.05)
            {
                bullet.speed -= 0.05;
            }
            else
            {
                state = 1;
                bullet.speed = 0;
                timer = 0;
            }
        }
        else if(state == 1 && timer == 30)
        {
            bullet.speed = 4;
            engine.setBulletDirection(bullet, bullet.direction + turndir);
            state = 2;
        }
        if(state == 2)
        {
            if(bullet.speed > 0.05)
            {
                bullet.speed -= 0.05;
            }
            else
            {
                state = 3;
                bullet.speed = 0;
                timer = 0;
            }
        }
        else if(state == 3 && timer == 30)
        {
            bullet.speed = 4;
            engine.setBulletDirection(bullet, bullet.direction + turndir);
            state = 4;
        }

        timer += 1;
    }
}


function Spawner(bullet)
{
    this.hitbox = new HitboxCircle(0);
    this.kind = 0;

    var timer = 0;
    var delay = 90;

    this.update = function()
    {
        if(timer >= delay && timer < delay+60 && timer % 3 == 0)
        {
            engine.setBulletSpeed(bullet, 0);
            engine.makeBullet(bullet.x, bullet.y, Math.random() * 360, 2 + Math.random()*3, Generic(12), image_prefix+"orb_yellow.png");
        }
        else if(timer == delay+60)
        {
            engine.removeBullet(bullet);
        }

        timer += 1;
    }
}

function ThreeStage(bullet)
{
    this.hitbox = new HitboxCircle(8);
    this.kind = 0;

    var timer = 0;
    var state = 0;
    var next;

    engine.setSpriteScale(bullet.sprite, 0.5, 0.5);

    this.setParams = function(next_in)
    {
        next = next_in;
    }

    this.update = function()
    {
        if(state == 0)
        {
            if(bullet.speed > 0.05)
            {
                bullet.speed -= 0.05;
            }
            else
            {
                state = 1;
                bullet.speed = 0;
                timer = 0;
            }
        }
        else if(state == 1 && timer == 30)
        {
            bullet.speed = 4;
            engine.setSpriteScale(bullet.sprite, 1, 1);
            engine.setBulletDirection(bullet, bullet.direction + 90);
            state = 2;
            timer = 0;
        }
        if(state == 2)
        {
            if(bullet.speed > 0.15)
            {
                bullet.speed -= 0.15;
            }
            else
            {
                state = 3;
                bullet.speed = 0;
                engine.setSpriteScale(bullet.sprite, 0.5, 0.5);
                timer = 0;
            }
        }
        else if(state == 3 && timer == 30)
        {
            console.log(next);
            engine.removeBullet(bullet);
            if(next == 0)
            {
                engine.makeBullet(bullet.x, bullet.y, bullet.direction + 90, 3, Generic(8), image_prefix+"leaf_blue.png");
                engine.makeBullet(bullet.x, bullet.y, bullet.direction + 90, 5, Generic(8), image_prefix+"leaf_blue.png");
            }
            else if(next == 1)
            {
                engine.makeBullet(bullet.x, bullet.y, bullet.direction + 315, 3, Generic(8), image_prefix+"leaf_yellow.png");
                engine.makeBullet(bullet.x, bullet.y, bullet.direction + 315, 5, Generic(8), image_prefix+"leaf_yellow.png");
            }
            else if(next == 2)
            {
                engine.makeBullet(bullet.x, bullet.y, bullet.direction + 225, 3, Generic(8), image_prefix+"leaf_yellow.png");
                engine.makeBullet(bullet.x, bullet.y, bullet.direction + 225, 5, Generic(8), image_prefix+"leaf_yellow.png");
            }
        }

        timer += 1;
    }
}
