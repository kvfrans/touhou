// handles player movement
function Player(engine)
{
    this.x = 380;
    this.y = 800;
    var speed = 12;
    var spriteName = "images/player_straight.png";
    var sprite;
    var hitbox_sprite;
    this.immunityCountDown = 0;
    this.health = 6;
    this.radius = 4;
    this.points = 1;
    var player = this;




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

        if(player.immunityCountDown == 0)
        {

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

            player.x += currentspeed*dirx;
            player.y += currentspeed*diry;

            player.x = Math.min(775, Math.max(0, player.x))
            player.y = Math.min(860, Math.max(0, player.y))



            if(keyStates.z == 1 || keyStates.z == 2)
            {
                //shift = focus
                if(keyStates.shift == 1 || keyStates.shift == 2)
                {

                    if(shoot_cooldown == 0)
                    {
                        var b = engine.makeBullet(player.x - 13, player.y, 270, 60, PlayerBullet, "images/focus_bullet.png");
                        b = engine.makeBullet(player.x, player.y, 270, 60, PlayerBullet, "images/focus_bullet.png");
                        b = engine.makeBullet(player.x + 13, player.y, 270, 60, PlayerBullet, "images/focus_bullet.png");
                        shoot_cooldown = 9;
                    }
                }
                //unshift is normal fire
                else
                {
                    if(shoot_cooldown == 0)
                    {
                        var b = engine.makeBullet(player.x - 10, player.y, 260, 30, PlayerBullet, "images/player_bullet.png");

                        b = engine.makeBullet(player.x, player.y, 270, 30, PlayerBullet, "images/player_bullet.png");
                        b = engine.makeBullet(player.x, player.y + 2, 270, 30, PlayerBullet, "images/player_bullet.png");
                        b = engine.makeBullet(player.x, player.y + 4, 270, 30, PlayerBullet, "images/player_bullet.png");

                        b = engine.makeBullet(player.x + 10, player.y, 280, 30, PlayerBullet, "images/player_bullet.png");
                        shoot_cooldown = 2;
                    }
                }

            }

        }

        if(this.immunityCountDown > 0)
        {
            this.immunityCountDown -= 1
        }

        if(shoot_cooldown > 0)
        {
            shoot_cooldown -= 1;
        }

        engine.setSpritePosition(sprite, player.x, player.y);
        engine.setSpritePosition(hitbox_sprite, player.x, player.y);
        engine.setSpriteTexture(sprite, spriteName);

    }

    this.playerInit = function()
    {
        this.getX = function() { return player.x };
        this.getY = function() { return player.y };
        this.getSpriteName = function() { return spriteName };

        sprite = engine.makeNamedSprite("player", "images/player_straight.png", player.x, player.y, 2)
        player.sprite = sprite;

        hitbox_sprite = engine.makeNamedSprite("player_hitbox", "images/bullet_hitbox.png", player.x, player.y, 2)
        engine.setSpriteScale(hitbox_sprite, player.radius / 16.0, player.radius / 16.0)
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

function PlayerClearingBullet(bullet)
{
    this.hitbox = new HitboxCircle(1);
    this.kind = 2;
    engine.setSpriteOpacity(bullet.sprite, 0.3);
    engine.setSpriteScale(bullet.sprite, 0, 0);
    var timer = 0;
    var ready = false;

    this.update = function()
    {
        if(ready)
        {
            engine.setSpriteScale(bullet.sprite, timer/50, timer/50);
            engine.setSpriteOpacity(bullet.sprite, 0.6 * (1 - timer/100));
            timer += 4;

            if(timer == 80)
            {
                engine.removeBullet(bullet)
            }
            if(timer == 20)
            {
                engine.setSpriteOpacity(engine.player.sprite, 0);
                engine.player.x = 380;
                engine.player.y = 800;
            }
            if(timer > 20)
            {
                engine.setSpriteOpacity(engine.player.sprite, Math.min(1, (timer-20)/60));
            }

            for(var i = 0; i < engine.bullethandler.bullets.length; i++)
            {
                var other = engine.bullethandler.bullets[i];
                if(other.kind == 0)
                {
                    var distance = Math.sqrt(
                        Math.pow(other.x - bullet.x, 2)
                        + Math.pow(other.y - bullet.y,2))

                    if(distance < timer * 5)
                    {
                        engine.removeBullet(other);
                    }
                }
            }
        }
        else
        {
            timer += 1;
            if(timer > 10)
            {
                ready = true;
                timer = 0;
            }
        }
    }
}
