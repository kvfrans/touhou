// handles player movement
function Player(engine)
{
    var x = 380;
    var y = 800;
    var speed = 12;
    var spriteName = "images/player_straight.png";
    var sprite;
    this.immunityCountDown = 0;
    // var health = 10;
    this.health = 2;


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
            //shift = focus
            if(keyStates.shift == 1 || keyStates.shift == 2)
            {

                if(shoot_cooldown == 0)
                {
                    var b = engine.makeBullet(x - 13, y, 270, 60, PlayerBullet, "images/focus_bullet.png");
                    b = engine.makeBullet(x, y, 270, 60, PlayerBullet, "images/focus_bullet.png");
                    b = engine.makeBullet(x + 13, y, 270, 60, PlayerBullet, "images/focus_bullet.png");
                    shoot_cooldown = 6;
                }
            }
            //unshift is normal fire
            else
            {
                if(shoot_cooldown == 0)
                {
                    var b = engine.makeBullet(x - 10, y, 260, 30, PlayerBullet, "images/player_bullet.png");
                    b = engine.makeBullet(x, y, 270, 30, PlayerBullet, "images/player_bullet.png");
                    b = engine.makeBullet(x + 10, y, 280, 30, PlayerBullet, "images/player_bullet.png");
                    shoot_cooldown = 6;
                }
            }

        }
        if (this.health == 0)
        {
            console.log("game over");
        }

        if(this.immunityCountDown > 0)
        {
            this.immunityCountDown -= 1
        }

        if(shoot_cooldown > 0)
        {
            shoot_cooldown -= 1;
        }

        engine.setSpritePosition(sprite, x, y);
        engine.setSpriteTexture(sprite, spriteName);

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

    this.hitbox = new HitboxCircle(1);
    this.kind = 1;
    engine.setSpriteOpacity(bullet.sprite, 0.3);

    this.update = function()
    {
    }
}
