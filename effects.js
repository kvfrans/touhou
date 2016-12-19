function Effects(engine)
{
    var spellcard_circle = [];
    var spellcard_name = "none";
    var spellcard_timer = 0;

    var flashbackground;
    var flashduration;
    var flashcountdown = 0;

    var spellcard_bg = [];

    var timer = 0;

    var screenshake = 0;

    this.effectsInit = function()
    {
        flashbackground = engine.makeNamedSprite("flashbackground", "images/white.png", 330, 450);
        engine.setSpriteScale(flashbackground, 50, 50);
        engine.setSpriteOpacity(flashbackground, 0);

    }

    this.updateEffects = function()
    {

        if(screenshake > 0)
        {
            screenshake -= 1;

            for(var s = 0; s < 4; s++)
            {
                engine.layers[s].position.x = screenshake*((Math.random() * 2) - 1)
                engine.layers[s].position.y = screenshake*((Math.random() * 2) - 1)
            }
        }

        if(spellcard_name != "none")
        {
            if(spellcard_timer < 40)
            {
                engine.setSpriteOpacity(spellcard_name, spellcard_timer / 40.0)
                engine.setSpriteScale(spellcard_name, (1-spellcard_timer/40.0)*4 + 1, 1);
            }
            else if(spellcard_timer > 60 && spellcard_timer < 90)
            {
                var scaling = ((spellcard_timer-60)/30.0)
                engine.setSpritePosition(spellcard_name, 50, 400 - 350*scaling)
                engine.setSpriteScale(spellcard_name, 1 - 0.5*scaling, 1 - 0.5*scaling);
            }
            if(spellcard_timer % 845 == 0)
            {
                var bg = engine.makeBullet(375, 1300, 270, 1, Bg, "images/spellcard_bg.png", 1)
                engine.setSpriteScale(bg.sprite, 3.3, 3.3)
                spellcard_bg.push(bg);
            }
            spellcard_timer += 1;
        }
        if(flashcountdown > 0)
        {
            flashcountdown -= 1;
            engine.setSpriteOpacity(flashbackground, flashcountdown/(flashduration + 0.0));
        }

        if(timer == 0)
        {
            var bg = engine.makeBullet(375, 444, 90, 1, Bg, "images/bg.png", 0)
            engine.setSpriteScale(bg.sprite, 3.3, 3.3)

            var bg = engine.makeBullet(375, 1288, 90, 1, Bg, "images/bg.png", 0)
            engine.setSpriteScale(bg.sprite, 3.3, 3.3)
        }
        if(timer % 810 == 0)
        {
            var bg = engine.makeBullet(375, -400, 90, 1, Bg, "images/bg.png", 0)
            engine.setSpriteScale(bg.sprite, 3.3, 3.3)
        }

        timer += 1;
    }

    this.flash = function(flashlength)
    {
        flashduration = flashlength;
        flashcountdown = flashlength;
    }

    this.shake = function(shakefactor)
    {
        screenshake = shakefactor;
    }

    this.displayOverlay = function(texturename)
    {
        var bullet = engine.makeBullet(330, 0, 90, 7, Overlay, texturename);
    }

    this.spellcardCircle = function()
    {
        for(var i = 0; i < 60; i++)
        {
            var b = engine.makeBullet(engine.bosscore.x, engine.bosscore.y, i*6, 8, SpellcardCircleBg, "images/spellcard_ring.png")
            spellcard_circle.push(b);
        }
    }

    this.startSpellcard = function(texturename, name)
    {
        this.displayOverlay(texturename)
        this.spellcardCircle()
        spellcard_name = engine.makeNamedText("spellcard_name", name, 50, 400, 3);
        // engine.setSpriteScale(spellcard_name, 5, 1);
        engine.setSpriteOpacity(spellcard_name, 0.5)
        spellcard_timer = 0;

        engine.effects.flash(10);

        var bg = engine.makeBullet(375, 456, 270, 1, Bg, "images/spellcard_bg.png", 1)
        engine.setSpriteScale(bg.sprite, 3.3, 3.3)
        spellcard_bg.push(bg);

    }

    this.endSpellcard = function()
    {
        engine.removeSprite(spellcard_name);
        spellcard_name = "none"
        engine.effects.flash(10);
        for(var i = spellcard_circle.length - 1; i >= 0; i--)
        {
            var bullet = spellcard_circle[i];
            engine.removeBullet(bullet);
            spellcard_circle.splice(i, 1);
        }
        for(var i = spellcard_bg.length - 1; i >= 0; i--)
        {
            console.log("rip");
            engine.removeSprite(spellcard_bg[i].sprite);
            engine.removeBullet(spellcard_bg[i]);
        }
    }

    this.spellCharge = function()
    {
        for(var i = 0; i < 120; i++)
        {
            var dir = i*3;
            var b = engine.makeBullet(engine.bosscore.x + Math.cos(dir/180 * Math.PI)*500, engine.bosscore.y + Math.sin(dir/180 * Math.PI)*500, i*3 + 180, (Math.abs(i%10 - 5)/10)*5, SpellCharge, "images/spell_charge.png")
            engine.setSpriteScale(b.sprite, Math.random()*3, 3)
            spellcard_circle.push(b);
        }
    }
    this.spellChargePlayer = function()
    {
        for(var i = 0; i < 120; i++)
        {
            var dir = i*3;
            var b = engine.makeBullet(engine.player.x + Math.cos(dir/180 * Math.PI)*300, engine.player.y + Math.sin(dir/180 * Math.PI)*300, i*3 + 180, (Math.abs(i%10 - 5)/10)*20, SpellChargePlayer, "images/spell_charge_red.png")
            engine.setSpriteScale(b.sprite, Math.random()*3, 3)
            spellcard_circle.push(b);
        }
    }

}

function SpellCharge(bullet)
{
    this.kind = 2;
    var timer = 0;
    engine.setSpriteOpacity(bullet.sprite, 0.0);

    this.update = function()
    {
        engine.setBulletSpeed(bullet, bullet.speed + 0.4);
        timer++;
        if(timer < 20)
        {
            engine.setSpriteOpacity(bullet.sprite, (timer/20) * 0.8);
        }
        if(timer > 40)
        {
            engine.setSpriteOpacity(bullet.sprite, 0.8 - ((timer-40)/20) * 0.8);
        }
        if(timer == 45)
        {
            engine.removeBullet(bullet);
        }
    }
}

function SpellChargePlayer(bullet)
{
    this.kind = 2;
    var timer = 0;
    engine.setSpriteOpacity(bullet.sprite, 0.0);

    this.update = function()
    {
        engine.setBulletSpeed(bullet, bullet.speed + 0.9);
        timer += 2;
        if(timer < 10)
        {
            engine.setSpriteOpacity(bullet.sprite, (timer/20) * 0.8);
        }
        if(timer > 20)
        {
            engine.setSpriteOpacity(bullet.sprite, 0.8 - ((timer-40)/20) * 0.8);
        }
        if(timer == 36)
        {
            engine.removeBullet(bullet);
        }
    }
}

function SpellcardCircleBg(bullet)
{
    this.kind = 2;
    var timer = 0;
    engine.setSpriteOpacity(bullet.sprite, 0.2);

    this.update = function()
    {
        timer++;
        if(timer == 50)
        {
            bullet.speed = 0;
            engine.setBulletDirection(bullet, bullet.direction + 90);
        }
        if(timer > 50)
        {
            engine.setBulletDirection(bullet, bullet.direction + 0.9);
            engine.setBulletPosition(bullet, engine.bosscore.x + 400*Math.cos(bullet.direction/180.0 * Math.PI), engine.bosscore.y + 400*Math.sin(bullet.direction/180.0 * Math.PI))
        }
    }
}

function Overlay(bullet)
{
    this.hitbox = HitboxCircle(0);
    this.kind = 2;

    var timer = 0;

    engine.setSpriteOpacity(bullet.sprite, 0);
    bullet.rotate = false;
    engine.setBulletDirection(bullet, 90);

    this.update = function()
    {
        timer += 1;

        if(timer < 50)
        {
            engine.setSpriteOpacity(bullet.sprite, bullet.sprite.alpha + 0.01);
            bullet.speed -= 0.1;
        }
        if(timer > 100)
        {
            engine.setSpriteOpacity(bullet.sprite, bullet.sprite.alpha - 0.01);
            bullet.speed += 0.1;
        }
        if(timer > 300)
        {
            engine.removeBullet(bullet);
        }
    }
}

function Score(bullet)
{
    this.hitbox = HitboxCircle(0);
    this.kind = 2;
    // engine.setSpriteOpacity(bullet.sprite, 0.3);

    var timer = 0;

    this.update = function()
    {
        timer += 1;

        var playerangle = 180 + Math.atan2(bullet.y - engine.player.getY(), bullet.x - engine.player.getX()) * 180 / Math.PI;
        engine.setBulletDirection(bullet, playerangle);

        var dist = Math.pow(bullet.y - engine.player.getY(), 2) + Math.pow(bullet.x - engine.player.getX(), 2)
        if(dist < 400)
        {
            engine.removeBullet(bullet);
            engine.player.points += 1;
        }
    }
}


function Bg(bullet)
{
    this.kind = 2;

    this.update = function()
    {
    }
}
