function Bullet(x, y, direction, speed, sprite, bulletclass)
{
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.cos = Math.cos(direction/180 * Math.PI);
    this.sin = Math.sin(direction/180 * Math.PI);
    this.speed = speed;
    this.sprite = sprite;
    engine.rotateSprite(this.sprite, direction + 90);

    this.bulletclass = new bulletclass(this)
    this.hitbox = this.bulletclass.hitbox;
    this.kind = this.bulletclass.kind;
}

function HitboxCircle(radius)
{
    this.type = "circle";
    this.radius = radius;
}

var BulletHandler = function(engine)
{
    var bullets = []
    this.bullets = bullets
    this.bulletUpdate = function()
    {
        for(var i = bullets.length - 1; i >= 0; i--)
        {
            var bullet = bullets[i];
            bullet.x += bullet.speed * bullet.cos;
            bullet.y += bullet.speed * bullet.sin;
            engine.moveSprite(bullet.sprite, bullet.x, bullet.y);

            bullet.bulletclass.update()

            if(bullet.kind == 0)
            {
                if(bullet.y < -200 || bullet.y > 1200 || bullet.x < -200 || bullet.y > 900)
                {
                    engine.removeSprite(bullet.sprite);
                    bullets.splice(i, 1);
                }

                var distance = Math.sqrt(Math.pow(engine.player.getX()-bullet.x, 2)+Math.pow(engine.player.getY()-bullet.y,2))
                if(distance < bullet.hitbox.radius + 10)
                {
                  engine.removeSprite(bullet.sprite);
                  bullets.splice(i, 1);
                }
            }
        }
    }

    this.addBullet = function(bullet)
    {
        bullets.push(bullet);
    }
}

function Generic(bullet)
{
    this.hitbox = HitboxCircle(3);
    this.kind = 0;

    this.setParams = function(hitboxradius)
    {
        this.hitbox = HitboxCircle(hitboxradius);
    }

    this.update = function()
    {
    }
}
