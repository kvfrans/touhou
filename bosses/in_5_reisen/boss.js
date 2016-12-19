var image_prefix = "bosses/in_5_reisen/resources/";

function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 300, 150);
    this.core = core;
    var image_prefix = "bosses/in_5_reisen/resources/";
    var state = "1_circleslow";
    // var state = "9_shootmoon";

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
        }
        timer += 1;
    }


    function FastSlow(bullet)
    {
        this.hitbox = new HitboxCircle(6);
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
}
