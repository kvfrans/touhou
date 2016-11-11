function Effects(engine)
{
    this.displayOverlay = function(textuername)
    {
        var bullet = engine.makeBullet(330, 0, 90, 7, Overlay, textuername);
    }

    this.spellcardCircle = function(x, y)
    {
        for(var i = 0; i < 360; i++)
        {
            engine.makeBullet(x, y, i, 8, SpellcardCircleBg, "images/spellcard_ring.png")
        }
    }
}

function SpellcardCircleBg(bullet)
{
    var timer = 0;
    this.update = function()
    {
        timer++;
        if(timer == 50)
        {
            bullet.speed = 6;
            engine.setBulletDirection(bullet, bullet.direction + 90);
            console.log(bullet.x);
        }
        if(timer > 50)
        {
            engine.setBulletDirection(bullet, bullet.direction + 1.16);
        }
    }
}
