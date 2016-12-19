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
    var spellcard = "0_none"

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
            if(timer == 1 && !has_starspun)
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


        // console.log(state);

        if(core.health <= 0)
        {
            engine.clearBullets();
            if(spellcard == "0_none")
            {
                timer = 0;
                spellcard = "1_magicspace";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 200
                next_state = "2_starspinbig"
                timer = 0;

                core.resetHealth(550);
                engine.effects.startSpellcard(image_prefix+"marisa.png","Magic Space [Asteroid Belt]")
            }
        }
        timer += 1;
    }
}
