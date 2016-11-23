var image_prefix = "bosses/in_4_marisa/resources/";

function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 200, 150);
    this.core = core;
    var image_prefix = "bosses/in_4_marisa/resources/";
    var state = "1_starspin";
    var next_state = "1_starspin";
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

    // params for 1_starspin
    var has_starspun = false;

    // params for 2_starspinbig
    var dir = 0;

    //boss sprite
    var bossSprite;

    // called at the very beginning
    this.bossInit = function()
    {
        console.log("marisa");
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

        if(state == "1_starspin")
        {
            if(timer == 0 && !has_starspun)
            {
                has_starspun = true;
                engine.effects.spellCharge();
                for(var k = 0; k < 5; k++)
                {
                    var b = engine.makeBullet(core.x, core.y, k*72, 0, DelaySpinSpawner, image_prefix+"circle_spell.png");
                    b.bulletclass.setParams(k)
                }
            }

            if(timer == 300)
            {
                state = "generic_move"
                move_delay = 10;
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 200) + 100
                next_state = "1_starspin"
                timer = 0;
            }

        }
        if(state == "2_starspinbig")
        {
            if(timer % 20 == 0)
            {
                for(var i = 0; i < 9; i++)
                {
                    engine.makeBullet(core.x, core.y, i*40 + dir, 3, Generic(8), image_prefix+"star_big_red.png");
                    engine.makeBullet(core.x, core.y, i*40 + 20 + dir, 3, Generic(8), image_prefix+"star_big_blue.png");
                }
            }

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


        // console.log(state);

        if(core.health <= 0)
        {
            engine.clearBullets();
            if(spellcard == "0_none")
            {
                timer = 0;
                spellcard = "1_magicspace";
                state = "2_starspinbig";
                core.health = 150;
                engine.effects.startSpellcard("images/harambe_kun.png","Magic Space [Asteroid Belt]")
            }
            else if(spellcard == "1_magicspace")
            {
                // engine.effects.
                timer = 0;
                spellcard = "1_firefly";
                state = "generic_move";
                core.health = 150;
                // engine.effects.startSpellcard("images/harambe_kun.png","Lamp Sign [Firefly Phenomenon]")
            }
        }
        timer += 1;
    }
}


function DelaySpinSpawner(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0;

    var timer = 0;
    var dir = 0;
    var radius = 0;
    var num = 0;
    var targetstar = image_prefix+"star_small_yellow.png";

    this.setParams = function(num_in)
    {
        dir = num_in*72;
        num = num_in;
        if(num == 1) {targetstar = image_prefix+"star_small_red.png"}
        if(num == 2) {targetstar = image_prefix+"star_small_pink.png"}
        if(num == 3) {targetstar = image_prefix+"star_small_blue.png"}
        if(num == 4) {targetstar = image_prefix+"star_small_green.png"}
    }

    this.update = function()
    {
        engine.setBulletPosition(bullet, engine.bosscore.x + Math.cos(dir/180 * Math.PI)*radius, engine.bosscore.y + Math.sin(dir/180 * Math.PI)*radius);
        if(timer < 60)
        {
            radius += 4;
        }
        else
        {
            if(timer % 10 == 0)
            {
                engine.makeBullet(bullet.x, bullet.y, dir+90, 3, Generic(6), targetstar)

                engine.makeBullet(bullet.x, bullet.y, dir, 3, Generic(6), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir, 4, Generic(6), targetstar)

                var movein = Math.abs(((timer%144)/144)-0.5)
                engine.makeBullet(bullet.x, bullet.y, dir+90+130*movein, 1, Generic(6), targetstar)
            }
        }
        dir -= 1;
        timer += 1;
    }
}
