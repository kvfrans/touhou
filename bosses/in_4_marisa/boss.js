var image_prefix = "bosses/in_4_marisa/resources/";

function Boss(engine)
{
    // coordinates for the boss.

    var core = new BossCore(380, 400, 150);
    // var core = new BossCore(380, 300, 150);
    this.core = core;
    var image_prefix = "bosses/in_4_marisa/resources/";
    var state = "1_starspin";
    // var state = "6_laserspin";
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

    // params for 1_starspin
    var has_starspun = false;

    // params for 2_starspinbig
    var dir = 0;

    // params for 3_starspin
    var has_trispun = false;

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
        if(state == "2_starspinbig")
        {
            if(timer % 16 == 0)
            {
                for(var i = 0; i < 9; i++)
                {
                    engine.makeBullet(core.x, core.y, i*40 + dir, 3, Star(10, 3), image_prefix+"star_big_red.png");
                    engine.makeBullet(core.x, core.y, i*40 + 20 + dir, 3, Star(10, -3), image_prefix+"star_big_blue.png");
                }
                dir += 8;
            }

            if(timer % 14 == 0 && timer > 60)
            {
                engine.makeBullet(0, Math.random()*900, 0 + Math.random()*45, 2, Star(6, 3), image_prefix+"star_small_yellow.png");

                engine.makeBullet(775, Math.random()*900, 180 - Math.random()*45, 2, Star(6, 3), image_prefix+"star_small_green.png");
            }

        }
        if(state == "3_trispin")
        {
            if(timer == 1 && !has_trispun)
            {
                has_trispun = true;
                engine.effects.spellCharge();
                for(var k = 0; k < 5; k++)
                {
                    var b = engine.makeBullet(core.x, core.y, k*72, 0, TriSpinSpawner, image_prefix+"circle_spell.png");
                    b.bulletclass.setParams(k)

                    var b = engine.makeBullet(core.x, core.y, k*72, 0, TriSpinSpawnerSmall, image_prefix+"circle_spell.png");
                    b.bulletclass.setParams(k)
                }
            }

            if(timer == 300)
            {
                state = "generic_move"
                move_delay = 10;
                desired_x = Math.round(Math.random() * 350) + 200
                desired_y = Math.round(Math.random() * 200) + 100
                next_state = "3_trispin"
                timer = 0;
            }

        }
        if(state == "4_eventhorizon")
        {
            if(timer == 1)
            {
                engine.effects.spellCharge();
                for(var k = 0; k < 10; k++)
                {
                    var b = engine.makeBullet(core.x, core.y, k*36, 0, TwistSpawner, image_prefix+"circle_spell.png");
                    b.bulletclass.setParams(k)
                }
            }
        }
        if(state == "5_spam")
        {
            if(timer == 1)
            {
                engine.effects.spellCharge();
                for(var k = 0; k < 15; k++)
                {
                    var b = engine.makeBullet(core.x, core.y, k*36, 0, SpamSpawner, image_prefix+"circle_spell.png");
                    b.bulletclass.setParams(k)
                }
            }
        }
        if(state == "6_laserspin")
        {
            if(timer == 1)
            {
                engine.effects.spellCharge();
                for(var k = 0; k < 3; k++)
                {
                    var b = engine.makeBullet(core.x, core.y, k*120, 0, Laser, image_prefix+"star_small_red.png");
                    b.bulletclass.setParams(0.5);
                    var b = engine.makeBullet(core.x, core.y, k*120, 0, Laser, image_prefix+"star_small_red.png");
                    b.bulletclass.setParams(-0.5);
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
                engine.effects.startSpellcard(image_prefix+"donald.png","Magic Space [Asteroid Belt]")
            }
            else if(spellcard == "1_magicspace")
            {
                // engine.effects.
                timer = 0;
                spellcard = "2_trispin";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 200
                next_state = "3_trispin"
                timer = 0;

                core.resetHealth(550);
                engine.effects.endSpellcard()
                // engine.effects.startSpellcard("images/harambe_kun.png","Lamp Sign [Firefly Phenomenon]")
            }
            else if(spellcard == "2_trispin")
            {
                // engine.effects.
                timer = 0;
                spellcard = "3_eventhorizon";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 400
                next_state = "4_eventhorizon"
                timer = 0;

                core.resetHealth(750);
                engine.effects.startSpellcard(image_prefix+"donald.png","Black Magic [Event Horizon]")
            }
            else if(spellcard == "3_eventhorizon")
            {
                // engine.effects.
                timer = 0;
                spellcard = "4_none";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 400
                next_state = "5_spam"
                timer = 0;

                core.resetHealth(450);
                engine.effects.endSpellcard()
            }
            else if(spellcard == "4_none")
            {
                // engine.effects.
                timer = 0;
                spellcard = "5_typhoon";

                state = "generic_move"
                move_delay = 10;
                desired_x = 380
                desired_y = 300
                next_state = "6_laserspin"
                timer = 0;

                core.resetHealth(450);
                engine.effects.startSpellcard(image_prefix+"donald.png","Love Storm [Starlight Typhoon]")
            }
        }
        timer += 1;
    }
}


function DelaySpinSpawner(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0.5;

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
                engine.makeBullet(bullet.x, bullet.y, dir+90, 3, Star(6, 3), targetstar)

                engine.makeBullet(bullet.x, bullet.y, dir, 3, Star(6, 3), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir, 4, Star(6, 3), targetstar)

                var movein = Math.abs(((timer%144)/144)-0.5)
                engine.makeBullet(bullet.x, bullet.y, dir+90+130*movein, 1, Star(6, 3 * (-1 + 2*(num % 2))), targetstar)
            }
        }
        dir -= 1;
        timer += 1;
    }
}


function TriSpinSpawner(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0.5;

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
            if(timer % 12 == 0)
            {
                engine.makeBullet(bullet.x, bullet.y, dir - 90, 2, Star(6, 3), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir - 90 - 70, 2, Star(6, 3), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir - 90 + 70, 2, Star(6, 3), targetstar)
            }
        }
        dir -= 0.3;
        timer += 1;
    }
}

function TriSpinSpawnerSmall(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0.5;

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
            radius += 3;
        }
        else
        {
            if(timer % 12 == 0)
            {
                engine.makeBullet(bullet.x, bullet.y, dir - 90, 2, Star(6, 3), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir - 90 - 20, 2, Star(6, 3), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir - 90 + 60, 2, Star(6, 3), targetstar)
            }
        }
        dir += 0.3;
        timer += 1;
    }
}


function TwistSpawner(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0.5;

    var timer = 0;
    var dir = 0;
    var radius = 0;
    var num = 0;
    var targetstar = image_prefix+"star_small_yellow.png";

    this.setParams = function(num_in)
    {
        dir = num_in*36;
        num = num_in;
        if(num % 5 == 1) {targetstar = image_prefix+"star_small_red.png"}
        if(num % 5 == 2) {targetstar = image_prefix+"star_small_pink.png"}
        if(num % 5 == 3) {targetstar = image_prefix+"star_small_blue.png"}
        if(num % 5 == 4) {targetstar = image_prefix+"star_small_green.png"}
    }

    this.update = function()
    {
        engine.setBulletPosition(bullet, engine.bosscore.x + Math.cos(dir/180 * Math.PI)*radius, engine.bosscore.y + Math.sin(dir/180 * Math.PI)*radius);
        if(timer < 60)
        {
            dir -= 3 - Math.abs((30-timer)/30)*3;
            console.log(Math.abs((30-timer)/30)*3)
            radius += 2*(80-timer)/60 + 0.5;
        }
        else if(timer < 400)
        {
            if(timer % 12 == 0)
            {
                if(timer < 100)
                {
                    var b = engine.makeBullet(bullet.x, bullet.y, dir, 0, TwistStar, targetstar)
                    b.bulletclass.setParams(180);
                }
                else
                {
                    var b = engine.makeBullet(bullet.x, bullet.y, dir, 0, TwistStar, targetstar)
                    b.bulletclass.setParams(195);
                }
            }

            if(timer < 100)
            {
                radius += ((timer - 60)/40)
                dir -= 1;
            }
            else
            {
                radius += 1;
                dir -= 0.4;
            }
        }
        else if(timer < 700)
        {
            if(timer % 6 == 0)
            {
                engine.makeBullet(bullet.x, bullet.y, dir + 90, 2, Star(6, 3), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir + 100, 2.5, Star(6, 3), targetstar)
                engine.makeBullet(bullet.x, bullet.y, dir + 110, 3, Star(6, 3), targetstar)
            }
            dir -= 1;
        }
        else if(timer < 1000)
        {
            if(timer % 12 == 0)
            {
                engine.makeBullet(bullet.x, bullet.y, dir, 0, TwistDelay, targetstar)
            }
            radius -= 1.4;
            dir -= 0.4;
            // b.bulletclass.setParams(180);
        }
        else if(timer < 1100)
        {
            radius += 3;
            dir -= 0.4;
        }
        else if(timer < 1400)
        {
            if(timer % 12 == 0)
            {
                engine.makeBullet(bullet.x, bullet.y, dir, 0, TwistDelay, targetstar)
            }
            dir += 0.4;
            radius -= 1.4;
        }
        else
        {
            engine.setBulletPosition(bullet, engine.bosscore.x + Math.cos(dir/180 * Math.PI)*radius, engine.bosscore.y + Math.sin(dir/180 * Math.PI)*radius);
            timer = 0;
            radius = 0;
        }

        timer += 1;
    }
}

function SpamSpawner(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0.5;

    var timer = 0;
    var dir = 0;
    var radius = 0;
    var num = 0;
    var targetstar = image_prefix+"star_small_yellow.png";

    this.setParams = function(num_in)
    {
        num = num_in;
        dir = num_in*72 + Math.floor(num/5)*36;
        if(num % 5 == 1) {targetstar = image_prefix+"star_small_red.png"}
        if(num % 5 == 2) {targetstar = image_prefix+"star_small_pink.png"}
        if(num % 5 == 3) {targetstar = image_prefix+"star_small_blue.png"}
        if(num % 5 == 4) {targetstar = image_prefix+"star_small_green.png"}
    }

    this.update = function()
    {
        engine.setBulletPosition(bullet, engine.bosscore.x + Math.cos(dir/180 * Math.PI)*radius, engine.bosscore.y + Math.sin(dir/180 * Math.PI)*radius);
        if(timer < 60)
        {
            dir -= 3 - Math.abs((30-timer)/30)*3;
            radius += 1*Math.floor(num/5)*(80-timer)/60 + 2;
        }
        else
        {
            dir -= (4 - Math.floor(num/5)*1) * (2*Math.abs(Math.floor(num/5)-1)-1);

            if(timer % 12 == 0)
            {
                var b = engine.makeBullet(bullet.x, bullet.y, dir + Math.random()*90 - 45, 3, Star(6, 3 * ((num % 2)-1)), targetstar)
            }
        }
        timer += 1;
    }
}

function TwistStar(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0;

    var timer = 0;
    var dirchange = 180;
    var dir = 0;

    this.setParams = function(dirchange_in)
    {
        dirchange = dirchange_in;
    }

    this.update = function()
    {
        timer += 1;

        if(timer == 400)
        {
            engine.setBulletDirection(bullet, bullet.direction + dirchange)
        }
        if(timer > 400)
        {
            engine.setBulletSpeed(bullet, Math.min((timer-400)/100, 1)*2)
        }

        dir += 3/2;
        engine.setSpriteRotation(bullet.sprite, dir);
    }
}

function TwistDelay(bullet)
{
    this.hitbox = new HitboxCircle(2);
    this.kind = 0;

    var timer = 0;
    var dir = 0;

    this.update = function()
    {
        timer += 1;

        if(timer == 200)
        {
            engine.setBulletDirection(bullet, bullet.direction - 20)
        }
        if(timer > 200 && timer < 300)
        {
            engine.setBulletSpeed(bullet, Math.min((timer-200)/100, 1)*2)
        }

        dir += 3/2;
        engine.setSpriteRotation(bullet.sprite, dir);
    }
}

function Laser(bullet)
{
    this.hitbox = new HitBoxRotatedRect(400, 20, bullet.direction);
    this.kind = 0;

    var dir = 0;
    var radius = 600;
    var hitbox = this.hitbox;
    var movement = 0;

    var timer = 0;

    this.setParams = function(movement_in)
    {
        movement = movement_in;
        dir = bullet.direction;
    }

    this.update = function()
    {
        dir += movement;
        engine.setBulletPosition(bullet, engine.bosscore.x + Math.cos(dir/180 * Math.PI)*radius, engine.bosscore.y + Math.sin(dir/180 * Math.PI)*radius);
        engine.setSpriteRotation(dir);
        hitbox.setRotation(-dir);

        if(timer % 30 == 0)
        {
            var b = engine.makeBullet(engine.bosscore.x + Math.cos(dir/180 * Math.PI)*(radius-230), engine.bosscore.y + Math.sin(dir/180 * Math.PI)*(radius-230), 180 + dir, 2, Star(10, 3), image_prefix+"star_big_red.png")
        }

        timer++;
    }
}

function Star(size, spin)
{
    return function(bullet)
    {
        this.hitbox = new HitboxCircle(size);
        this.kind = 0;

        bullet.rotate = false;
        var dir = 0;
        this.update = function()
        {
            dir += spin/2;
            engine.setSpriteRotation(bullet.sprite, dir);
        }
    }
}
