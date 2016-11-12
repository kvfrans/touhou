function Effects(engine)
{
    this.displayOverlay = function(texturename)
    {
        console.log(texturename);
        var bullet = engine.makeBullet(330, 0, 90, 7, Overlay, texturename);
    }

    this.spellcardCircle = function(core)
    {
        for(var i = 0; i < 60; i++)
        {
            var b = engine.makeBullet(core.x, core.y, i*6, 8, SpellcardCircleBg, "images/spellcard_ring.png")
            engine.changeSpriteOpacity(b.sprite, 0.2);
        }
    }
}

function SpellcardCircleBg(bullet)
{
    this.kind = 2;
    var timer = 0;
    this.update = function()
    {
        timer++;
        if(timer == 50)
        {
            bullet.speed = 6;
            engine.setBulletDirection(bullet, bullet.direction + 90);
        }
        if(timer > 50)
        {
            engine.setBulletDirection(bullet, bullet.direction + 0.9);
        }
    }
}

function Overlay(bullet)
{
    this.hitbox = HitboxCircle(0);
    this.kind = 2;

    var timer = 0;

    engine.changeSpriteOpacity(bullet.sprite, 0);
    bullet.rotate = false;
    engine.setBulletDirection(bullet, 90);

    this.update = function()
    {
        timer += 1;

        if(timer < 50)
        {
            engine.changeSpriteOpacity(bullet.sprite, bullet.sprite.alpha + 0.01);
            bullet.speed -= 0.1;
        }
        if(timer > 100)
        {
            engine.changeSpriteOpacity(bullet.sprite, bullet.sprite.alpha - 0.01);
            bullet.speed += 0.1;
        }
    }
}
