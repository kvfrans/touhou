var image_prefix = "bosses/in_5_reisen/resources/";

function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 300, 150);
    this.core = core;
    var image_prefix = "bosses/in_5_reisen/resources/";
    var state = "1_circleslow";
    // var state = "5_roadroaller";

    // var next_state = "1_starspin";
    var timer = 0;
    var spellcard = "1_none"

    // params for Generic(8)_move
    var desired_x;
    var desired_y;
    var vector_x;
    var vector_y;
    var magnitude_factor;
    var accel = 0;
    var move_delay = 100;

    //boss sprite
    var bossSprite;

    // for 2_visionwave
    var initial_left_bullets = [];
    var initial_right_bullets = [];

    // for 4_lateral
    var lateral_left_bullets = [];
    var lateral_right_bullets = [];
    var lateral_spawners = [];

    // for 3_trispin
    var has_trispun = false;

    // for 5_roadroaller
    var has_roadroaller = false;

    // called at the very beginning
    this.bossInit = function()
    {
        console.log("Reisen spawn");
        bossSprite = engine.makeNamedSprite("boss", image_prefix+"boss.png", core.x, core.y, 2)
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

        if(state == "1_circleslow")
        {
            if(timer % 20 == 0)
            {
                var adjust = (Math.random() - 0.5)*20
                for(var i = 0; i < 60; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, i*6, 8, FastSlow, image_prefix+"redbullet.png");
                    b.bulletclass.setParams(adjust);
                }
            }

            if(timer % 200 == 0)
            {
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 200) + 200
            }
            core.x = core.x + (desired_x - core.x)/70
            core.y = core.y + (desired_y - core.y)/70
            engine.setSpritePosition(bossSprite, core.x, core.y)
        }
        if(state == "2_visionwave")
        {
            if(timer == 1)
            {
                for(var i = 0; i < 60; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, i*6, 2, InvisibleShift, image_prefix+"redbullet.png");
                    initial_left_bullets.push(b);
                }
                for(var i = 0; i < 60; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, i*6, 2, InvisibleShift, image_prefix+"redbullet.png");
                    initial_right_bullets.push(b);
                }
            }
            if(timer == 50)
            {
                for(var i = 0; i < 60; i++)
                {
                    initial_right_bullets[i].bulletclass.shift(1,1);
                    initial_left_bullets[i].bulletclass.shift(-1,1);
                }
            }
            if(timer > 130 && timer < 130+120)
            {
                if(timer % 40 == 0)
                {
                    var rshift = Math.random()*5
                    for(var i = 0; i < 60; i++)
                    {
                        var b = engine.makeBullet(core.x, core.y, i*6 + rshift, 2, InvisibleShift, image_prefix+"redbullet.png");
                        initial_left_bullets.push(b);
                    }
                    for(var i = 0; i < 60; i++)
                    {
                        var b = engine.makeBullet(core.x, core.y, i*6 + rshift, 2, InvisibleShift, image_prefix+"redbullet.png");
                        initial_right_bullets.push(b);
                    }
                }
                if(timer % 30 == 0)
                {
                    var rshift = Math.random()*5
                    for(var i = 0; i < 60; i++)
                    {
                        var b = engine.makeBullet(core.x, core.y, i*6 + rshift, 2.5, InvisibleShift, image_prefix+"bluebullet.png");
                        initial_left_bullets.push(b);
                    }
                    for(var i = 0; i < 60; i++)
                    {
                        var b = engine.makeBullet(core.x, core.y, i*6 + rshift, 2.5, InvisibleShift, image_prefix+"bluebullet.png");
                        initial_right_bullets.push(b);
                    }
                }
            }
            if(timer == 130+120+30)
            {
                for(var i = 0; i < initial_right_bullets.length; i++)
                {
                    initial_right_bullets[i].bulletclass.shift(1,1);
                    initial_left_bullets[i].bulletclass.shift(-1,1);
                }
            }
            if(timer == 130+120+30+90)
            {
                timer = 130;
            }

            // if(timer % 200 == 0)
            // {
            //     desired_x = Math.round(Math.random() * 350) + 200
            //     desired_y = Math.round(Math.random() * 200) + 200
            // }
            // core.x = core.x + (desired_x - core.x)/70
            // core.y = core.y + (desired_y - core.y)/70
            // engine.setSpritePosition(bossSprite, core.x, core.y)
        }
        if(state == "3_trispin")
        {
            if(timer == 1 && !has_trispun)
            {
                has_trispun = true;
                for(var i = 0; i < 4; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, i*90, 0, TriSpawner, image_prefix+"circle_spell.png");
                    b.bulletclass.setParams(7.3);
                    if(i == 0 || i == 3)
                    {
                        b.bulletclass.setParams(-7.3);
                    }
                }
            }
            if(timer % 200 == 0)
            {
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 100) + 100
            }
            core.x = core.x + (desired_x - core.x)/70
            core.y = core.y + (desired_y - core.y)/70
            engine.setSpritePosition(bossSprite, core.x, core.y)
        }
        if(state == "4_lateral")
        {
            if(timer % 60 == 0)
            {
                var b = engine.makeBullet(0, 400 + Math.random()*100, 0, 2, LateralSpawner, image_prefix+"circle_spell.png");
                var c = engine.makeBullet(770, 400 + Math.random()*100, 180, 2, LateralSpawner, image_prefix+"circle_spell.png");
                lateral_spawners.push(b);
                lateral_spawners.push(c);
            }

            if(timer == 120)
            {
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 200) + 100

                for(var i = 0; i < initial_right_bullets.length; i++)
                {
                    initial_right_bullets[i].bulletclass.shift(-1,0);
                }
                for(var i = 0; i < initial_left_bullets.length; i++)
                {
                    initial_left_bullets[i].bulletclass.shift(1,0);
                }
                for(var i = 0; i < lateral_spawners.length; i++)
                {
                    lateral_spawners[i].bulletclass.toggle(false);
                }
            }
            if(timer == 120+80)
            {
                timer = 0;
                for(var i = 0; i < lateral_spawners.length; i++)
                {
                    lateral_spawners[i].bulletclass.toggle(true);
                }
            }
            core.x = core.x + (desired_x - core.x)/70
            core.y = core.y + (desired_y - core.y)/70
            engine.setSpritePosition(bossSprite, core.x, core.y)
        }
        if(state == "5_roadroaller")
        {
            if(timer == 1 && !has_roadroaller)
            {
                has_roadroaller = true;
                for(var i = 0; i < 6; i++)
                {
                    var b = engine.makeBullet(core.x, core.y, i*90, 0, RollerSpawner, image_prefix+"circle_spell.png");
                    b.bulletclass.setParams(i);
                }
            }
            if(timer % 200 == 0)
            {
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 100) + 100
            }
            core.x = core.x + (desired_x - core.x)/70
            core.y = core.y + (desired_y - core.y)/70
            engine.setSpritePosition(bossSprite, core.x, core.y)
        }

        if(state == "generic_move" && timer > move_delay && timer < move_delay + 50)
        {
            if(timer == move_delay + 1){
                accel = 0;
                total = 0;
                var direction_x = desired_x - core.x;
                var direction_y = desired_y - core.y;
                var magnitude = Math.sqrt(Math.pow(direction_x,2) + Math.pow(direction_y,2));
                vector_x = direction_x / magnitude;
                vector_y = direction_y / magnitude;
                if(magnitude == 0)
                {
                    vector_x = 0; vector_y = 0
                }
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

        if(core.health <= 0)
        {
            engine.clearBullets();
            if(spellcard == "1_none")
            {
                timer = 0;
                spellcard = "2_visionwave";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 200
                next_state = "2_visionwave"
                timer = 0;

                core.resetHealth(550);
                engine.effects.startSpellcard(image_prefix+"reisen.png","Vision Wave 'Mindblow (Red Eyes Hypnosis)'")
            }
            else if(spellcard == "2_visionwave")
            {
                timer = 0;
                spellcard = "3_trispin";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 200
                next_state = "3_trispin"
                timer = 0;

                core.resetHealth(550);
                engine.effects.endSpellcard()
            }
            else if(spellcard == "3_trispin")
            {
                timer = 0;
                spellcard = "4_lateral";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 200
                next_state = "4_lateral"
                timer = 0;

                core.resetHealth(550);
                engine.effects.startSpellcard(image_prefix+"reisen.png","Lunatic Gaze [Illusion Seeker]")
            }
        }
        timer += 1;
    }

    function FastSlow(bullet)
    {
        this.hitbox = new HitboxCircle(4);
        this.kind = 0;

        var timer = 0;
        var dir = 0;

        var adjust = 0;
        this.setParams = function(adjust_in)
        {
            adjust = adjust_in;
        }

        this.update = function()
        {
            timer += 1;

            if(timer == 50)
            {
                engine.setBulletSpeed(bullet, 2)
                engine.setBulletDirection(bullet, bullet.direction + adjust)
            }
        }
    }

    function TriSpawner(bullet)
    {
        this.hitbox = new HitboxCircle(2);
        this.kind = 0.5;

        var timer = 0;
        var dir = bullet.direction + 45;
        var radius = 200;
        var shootdir = 0;

        if(bullet.direction == 90 || bullet.direction == 180)
        {
            shootdir = 50;
        }

        var spindir;
        this.setParams = function(spindir_in)
        {
            spindir = spindir_in;
        }


        this.update = function()
        {
            engine.setBulletPosition(bullet, engine.bosscore.x + Math.cos(dir/180 * Math.PI)*radius, engine.bosscore.y + Math.sin(dir/180 * Math.PI)*radius);
            if(timer % 3 == 0)
            {
                var adjust = (Math.random() - 0.5)*20
                var b = engine.makeBullet(bullet.x, bullet.y, shootdir, 6, FastSlow, image_prefix+"redbullet.png");
                b.bulletclass.setParams(adjust);
                var b = engine.makeBullet(bullet.x, bullet.y, shootdir+120, 6, FastSlow, image_prefix+"redbullet.png");
                b.bulletclass.setParams(adjust);
                var b = engine.makeBullet(bullet.x, bullet.y, shootdir+240, 6, FastSlow, image_prefix+"redbullet.png");
                b.bulletclass.setParams(adjust);

                shootdir += spindir;
            }

            // dir += 1;
            timer += 1;
        }
    }

    function LateralSpawner(bullet)
    {
        this.hitbox = new HitboxCircle(2);
        this.kind = 0.5;

        var timer = 0;

        var shooting = true;
        this.toggle = function(shooting_in)
        {
            shooting = shooting_in;
            if(shooting)
            {
                engine.setBulletSpeed(bullet, 2);
                engine.setSpriteOpacity(bullet.sprite, 1);
            }
            else
            {
                engine.setBulletSpeed(bullet, 0);
                engine.setSpriteOpacity(bullet.sprite, 0.3);
            }
        }

        this.update = function()
        {
            if(timer % 12 == 0 && shooting)
            {
                var b = engine.makeBullet(bullet.x, bullet.y, 90, 2, InvisibleShift, image_prefix+"redbullet.png");
                var c = engine.makeBullet(bullet.x, bullet.y, 270, 2, InvisibleShift, image_prefix+"redbullet.png");
                if(bullet.direction == 0)
                {
                    initial_right_bullets.push(b);
                    initial_right_bullets.push(c);
                }
                else
                {
                    initial_left_bullets.push(b);
                    initial_left_bullets.push(c);
                }
            }
            timer += 1;
        }
    }

    function RollerSpawner(bullet)
    {
        this.hitbox = new HitboxCircle(2);
        this.kind = 0.5;

        var timer = 0;
        var num = 0;
        var aim = 0;
        var aimdir = true;

        this.setParams = function(num_in)
        {
            num = num_in;
        }

        this.update = function()
        {
            var playerangle = aim*3 + Math.atan2(bullet.y - engine.player.y, bullet.x - engine.player.x) * 180 / Math.PI;
            engine.setBulletPosition(bullet, engine.bosscore.x + num*30 - 3*30 , engine.bosscore.y + 50);
            if(timer % 12 == 0)
            {
                if(aimdir)
                {
                    aim += 5;
                }
                else
                {
                    aim -= 5;
                }

                if(aim == 10)
                {
                    aimdir = false;
                }
                if(aim == -10)
                {
                    aimdir = true;
                }

                if(timer > 1)
                {
                    var b = engine.makeBullet(bullet.x, bullet.y, playerangle + 180, 11, FastSlow, image_prefix+"redbullet.png");
                    var c = engine.makeBullet(bullet.x, bullet.y, playerangle + 180, 11, FastSlow, image_prefix+"redbullet.png");
                    var b = engine.makeBullet(bullet.x, bullet.y, playerangle + 170, 11, FastSlow, image_prefix+"redbullet.png");
                    var c = engine.makeBullet(bullet.x, bullet.y, playerangle + 170, 11, FastSlow, image_prefix+"redbullet.png");
                    var b = engine.makeBullet(bullet.x, bullet.y, playerangle + 190, 11, FastSlow, image_prefix+"redbullet.png");
                    var c = engine.makeBullet(bullet.x, bullet.y, playerangle + 190, 11, FastSlow, image_prefix+"redbullet.png");
                }
            }

            if(timer % 40 == 0)
            {
                for(var i = 0; i < 11; i++)
                {
                    engine.makeBullet(bullet.x, bullet.y, 90 + 45 + i*27, 5, FastSlow, image_prefix+"redbullet.png");
                }
            }
            timer += 1;
        }
    }

    function InvisibleShift(bullet)
    {
        this.hitbox = new HitboxCircle(4);
        this.kind = 0;

        var timer = 0;
        var dir = 0;

        var adjust_x = 0;
        var adjust_y = 0;
        var countdown = 0;
        var invis = false;

        var returnspeed = bullet.speed;

        this.shift = function(adjust_x_in, adjust_y_in)
        {
            adjust_x = adjust_x_in;
            adjust_y = adjust_y_in;
            countdown = 80;
            engine.setBulletSpeed(bullet, 0);
            bullet.kind = 2;
            engine.setSpriteOpacity(bullet.sprite, 0.3);
            invis = true;
        }

        this.update = function()
        {
            timer += 1;
            if(countdown > 0 && invis)
            {
                bullet.x += adjust_x;
                bullet.y += adjust_y;
                countdown -= 1;
            }
            if(countdown == 0 && invis)
            {
                invis = false;
                engine.setBulletSpeed(bullet, returnspeed);
                bullet.kind = 0;
                engine.setSpriteOpacity(bullet.sprite, 1);
            }
        }
    }
}
