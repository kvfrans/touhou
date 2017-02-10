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

    var cutscene_state = 0;
    var cutscene_bg;
    var cutscene_pic;
    var cutscene_text;
    var cutscene_name;
    var cutscene_string;
    var cutscene_timer = 0;

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
                engine.setSpriteScale(spellcard_name, ((1-spellcard_timer/40.0)*3 + 1)/4, 1/3);
            }
            else if(spellcard_timer > 60 && spellcard_timer < 90)
            {
                var scaling = ((spellcard_timer-60)/30.0)
                engine.setSpritePosition(spellcard_name, 50, 400 - 350*scaling)
                engine.setSpriteScale(spellcard_name, (1 - 0.5*scaling)/3, (1 - 0.5*scaling)/3);
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

        if(cutscene_state == 1)
        {
            cutscene_timer += 1;
            if(cutscene_timer < cutscene_string.length)
            {
                engine.setTextContent(cutscene_text, cutscene_string.substr(0, cutscene_timer));
                if(gamewrapper.keyboard.keyStates.z == 2)
                {
                    cutscene_timer = cutscene_string.length - 2;
                }
            }
            else
            {
                engine.setTextContent(cutscene_text, cutscene_string);
                if(gamewrapper.keyboard.keyStates.z == 2)
                {
                    cutscene_state = 0;
                    engine.removeSprite(cutscene_bg);
                    engine.removeSprite(cutscene_pic);
                    engine.removeSprite(cutscene_text);
                    engine.removeSprite(cutscene_name);
                    cutscene_timer = 0;
                    engine.setPause(false);
                }
            }
        }

        if(cutscene_state == 10)
        {
            cutscene_timer += 1;
            if(cutscene_timer < cutscene_string.length)
            {
                engine.setTextContent(cutscene_text, cutscene_string.substr(0, cutscene_timer));
                if(gamewrapper.keyboard.keyStates.z == 2)
                {
                    cutscene_timer = cutscene_string.length - 2;
                }
            }
            else
            {
                engine.setTextContent(cutscene_text, cutscene_string);
                if(gamewrapper.keyboard.keyStates.z == 2)
                {
                    cutscene_state = 0;
                    engine.removeSprite(cutscene_bg);
                    engine.removeSprite(cutscene_text);
                    engine.removeSprite(cutscene_name);
                    cutscene_timer = 0;
                    engine.setPause(false);
                    engine.player.health = 3;
                    engine.player.points = 1;
                    engine.ui.updatePlayerHealth();
                }
                if(gamewrapper.keyboard.keyStates.x == 2)
                {
                    if(!localStorage['easternland'])
                    {
                        console.log("Creating local easternland");
                        var leaderboard = [engine.player.points]
                        var jsoned = JSON.stringify(leaderboard)
                        localStorage['easternland'] = jsoned;
                    }
                    else
                    {
                        var storedNames = JSON.parse(localStorage['easternland']);
                        storedNames.push(engine.player.points);
                        var jsoned = JSON.stringify(storedNames)
                        localStorage['easternland'] = jsoned;
                    }
                    engine.gamewrapper.leaderboard()
                }
            }
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
        engine.setSpriteScale(bg.sprite, 3.3/4, 3.3/4)
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

    this.cutscene = function(talkername, text, texturename)
    {
        engine.setPause(true);
        cutscene_state = 1;
        cutscene_bg = engine.makeNamedSprite("cutscene_bg", "images/cutscene_talkbg.png", 385, 700, 3);
        engine.setSpriteOpacity(cutscene_bg, 0.9);
        cutscene_pic = engine.makeNamedSprite("cutscene_pic", texturename, 585, 300, 2);
        cutscene_name = engine.makeNamedText("cutscene_text", talkername, 50, 400, 3);
        cutscene_text = engine.makeNamedText("cutscene_text", "", 50, 500, 3);
        // engine.setSpriteScale(cutscene_text, 0.5, 0.5);
        engine.setTextStyle(cutscene_text, "Arial", 30, 0xFFFFFF, false);
        engine.setTextWrap(cutscene_text, true, 600);
        cutscene_string = text;
        cutscene_timer = 0;
    }

    this.gameover = function(talkername, text)
    {
        engine.setPause(true);
        cutscene_state = 10;
        cutscene_bg = engine.makeNamedSprite("cutscene_bg", "images/cutscene_talkbg.png", 385, 700, 3);
        engine.setSpriteOpacity(cutscene_bg, 0.9);
        cutscene_name = engine.makeNamedText("cutscene_text", talkername, 50, 400, 3);
        cutscene_text = engine.makeNamedText("cutscene_text", "", 50, 500, 3);
        // engine.setSpriteScale(cutscene_text, 0.5, 0.5);
        engine.setTextStyle(cutscene_text, "Arial", 30, 0xFFFFFF, false);
        engine.setTextWrap(cutscene_text, true, 600);
        cutscene_string = text;
        cutscene_timer = 0;
    }

    this.bulletSpawningAnimation = function(x, y, scale)
    {
        var b = engine.makeBullet(x, y, 0, 0, SpawningAnimation, "images/bullet_creation.png", 4);
        b.bulletclass.setParams(scale);
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

        var playerangle = 180 + Math.atan2(bullet.y - engine.player.y, bullet.x - engine.player.x) * 180 / Math.PI;
        engine.setBulletDirection(bullet, playerangle);

        var dist = Math.pow(bullet.y - engine.player.y, 2) + Math.pow(bullet.x - engine.player.x, 2)
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

function SpawningAnimation(bullet)
{
    this.kind = 2;
    var timer = 0;
    var scale = 1;

    this.setParams = function(scale_in)
    {
        scale = scale_in;
        engine.setSpriteScale(bullet.sprite, scale, scale);
    }
    this.update = function()
    {
        if(timer < 5)
        {
            engine.setSpriteOpacity(bullet.sprite, timer/5);
        }
        if(timer > 5)
        {
            engine.setSpriteOpacity(bullet.sprite, 1 - (timer-5)/10);
            engine.setSpriteScale(bullet.sprite, scale * (1 - (timer-5)/10), scale * (1 - (timer-5)/10));
        }
        if(timer == 15)
        {
            engine.removeBullet(bullet);
        }
        timer++;
    }
}
