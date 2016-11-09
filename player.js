// handles player movement
function Player(engine)
{
    var x = 380;
    var y = 800;
    var speed = 12;
    var spriteName = "images/player_straight.png";
    var sprite;

    var shoot_cooldown = 0;

    this.playerUpdate = function(keyStates)
    {
        var dirx = 0;
        var diry = 0;
        var currentspeed = speed;
        if(keyStates.shift == 1 || keyStates.shift == 2)
        {
            currentspeed = 3;
        }
        if(keyStates.left == 1 || keyStates.left == 2)
        {
            dirx -= 1;
        }
        if(keyStates.right == 1 || keyStates.right == 2)
        {
            dirx += 1;
        }
        if(keyStates.down == 1 || keyStates.down == 2)
        {
            diry += 1;
        }
        if(keyStates.up == 1 || keyStates.up == 2)
        {
            diry -= 1;
        }

        if(dirx != 0 && diry != 0)
        {
            currentspeed *= 0.7;
        }

        if(dirx < 0)
        {
            spriteName = "images/player_left.png";
        }
        if(dirx == 0)
        {
            spriteName = "images/player_straight.png";
        }
        if(dirx > 0)
        {
            spriteName = "images/player_right.png";
        }

        x += currentspeed*dirx;
        y += currentspeed*diry;

        x = Math.min(775, Math.max(0, x))
        y = Math.min(900, Math.max(0, y))

        if(keyStates.z == 1 || keyStates.z == 2)
        {
            if(shoot_cooldown == 0)
            {
                var b = engine.makeBullet(x - 10, y, 260, 30, PlayerBullet, "images/player_bullet.png");
                engine.changeSpriteOpacity(b.sprite, 0.3);
                b = engine.makeBullet(x, y, 270, 30, PlayerBullet, "images/player_bullet.png");
                engine.changeSpriteOpacity(b.sprite, 0.3);
                b = engine.makeBullet(x + 10, y, 280, 30, PlayerBullet, "images/player_bullet.png");
                engine.changeSpriteOpacity(b.sprite, 0.3);
                shoot_cooldown = 6;
            }
        }

        if(shoot_cooldown > 0)
        {
            shoot_cooldown -= 1;
        }

        engine.moveSprite(sprite, x, y);
        engine.changeSpriteTexture(sprite, spriteName);

    }

    this.playerInit = function()
    {
        this.getX = function() { return x };
        this.getY = function() { return y };
        this.getSpriteName = function() { return spriteName };

        engine.makeNamedSprite("player", "images/player_straight.png", x, y)
        sprite = engine.spriteFromName("player");
    }
}

function PlayerBullet(bullet)
{
    this.hitbox = HitboxCircle(3);
    this.kind = 1;

    this.update = function()
    {
    }
}
