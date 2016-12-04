var show_hitboxes = true;

function Bullet(x, y, direction, speed, sprite, bulletclass)
{
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.cos = Math.cos(direction/180 * Math.PI);
    this.sin = Math.sin(direction/180 * Math.PI);
    this.speed = speed;
    this.sprite = sprite;
    this.debug_sprite = "none";
    this.remove = false;
    engine.setSpriteRotation(this.sprite, direction + 90);

    this.bulletclass = new bulletclass(this)
    this.hitbox = this.bulletclass.hitbox;
    this.kind = this.bulletclass.kind;

    if(show_hitboxes)
    {
        if(this.kind == 0)
        {
            if(this.hitbox.type == "circle")
            {
                this.debug_sprite = new Sprite(engine.textureFromName("images/bullet_hitbox.png"));
                this.debug_sprite.anchor.set(0.5,0.5);
                this.debug_sprite.x = this.sprite.x
                this.debug_sprite.y = this.sprite.y
                this.debug_sprite.layernum = 2;
                engine.setSpriteScale(this.debug_sprite, this.hitbox.radius / 16.0,this.hitbox.radius / 16.0)
                // this.debug_sprite.scale.set(1, 1)
                engine.layers[2].addChild(this.debug_sprite);
            }
            else if(this.hitbox.type == "rect")
            {
                this.debug_sprite = new Sprite(engine.textureFromName("images/bullet_hitbox_rect.png"));
                this.debug_sprite.anchor.set(0.5,0.5);
                this.debug_sprite.x = this.sprite.x
                this.debug_sprite.y = this.sprite.y
                this.debug_sprite.layernum = 2;
                engine.setSpriteScale(this.debug_sprite, this.hitbox.height / 32.0, this.hitbox.width / 32.0)
                engine.setSpriteRotation(this.debug_sprite, -1*this.hitbox.rotation - 90)
                // this.debug_sprite.scale.set(1, 1)
                engine.layers[2].addChild(this.debug_sprite);
            }
        }
    }

}

function HitboxCircle(radius)
{
    this.type = "circle";
    this.radius = radius;
}

function HitBoxRotatedRect(width, height, rotation)
{
    this.type = "rect";
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.rotationRad = rotation * (Math.PI / 180);

    this.setRotation = function(rotation)
    {
        this.rotation = rotation;
        this.rotationRad = rotation * (Math.PI / 180);
    }
}

var BulletHandler = function(engine)
{
    var bullets = []
    this.bullets = bullets
    this.bulletUpdate = function()
    {
        // console.log(bullets.length);
        for(var i = bullets.length - 1; i >= 0; i--)
        {
            var bullet = bullets[i];
            bullet.bulletclass.update()
            bullet.x += bullet.speed * bullet.cos;
            bullet.y += bullet.speed * bullet.sin;
            engine.setSpritePosition(bullet.sprite, bullet.x, bullet.y);
            if(bullet.debug_sprite != "none")
            {
                engine.setSpritePosition(bullet.debug_sprite, bullet.x, bullet.y);
                if(bullet.hitbox.type == "rect")
                {
                    engine.setSpriteRotation(bullet.debug_sprite, -1*bullet.hitbox.rotation - 90)
                }
            }


            var remove = false;
            if(bullet.remove)
            {
                remove = true;
            }

            if(bullet.kind == 0 || bullet.kind == 1)
            {
                if(engine.convertCoord(bullet.y) < -200 || engine.convertCoord(bullet.y) > 1200 || engine.convertCoord(bullet.x) < -200 || engine.convertCoord(bullet.x) > 900)
                {
                    remove = true;
                }
            }

            if(bullet.kind == 0)
            {
                var hit = false;

                if(bullet.hitbox.type == "circle")
                {
                    var distance = Math.sqrt(
                        Math.pow(engine.player.getX() - bullet.x, 2)
                        + Math.pow(engine.player.getY() - bullet.y,2))

                    if(distance < bullet.hitbox.radius + engine.player.radius)
                    {
                        remove = true;
                        hit = true;
                    }
                }
                if(bullet.hitbox.type == "rect")
                {
                    // console.log(bullet.hitbox.width + " " + bullet.hitbox.height + " " + bullet.hitbox.rotationRad);

                    var rectCenterX = bullet.x;
                    var rectCenterY = bullet.y;

                    var rectX = rectCenterX - bullet.hitbox.width / 2;
                    var rectY = rectCenterY - bullet.hitbox.height / 2;

                    var rectReferenceX = rectX;
                    var rectReferenceY = rectY;

                    // Rotate circle's center point back
                    var unrotatedCircleX = Math.cos( bullet.hitbox.rotationRad ) * ( engine.player.x - rectCenterX ) - Math.sin( bullet.hitbox.rotationRad ) * ( engine.player.y - rectCenterY ) + rectCenterX;
                    var unrotatedCircleY = Math.sin( bullet.hitbox.rotationRad ) * ( engine.player.x - rectCenterX ) + Math.cos( bullet.hitbox.rotationRad ) * ( engine.player.y - rectCenterY ) + rectCenterY;

                    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
                    var closestX, closestY;

                    // Find the unrotated closest x point from center of unrotated circle
                    if ( unrotatedCircleX < rectReferenceX ) {
                        closestX = rectReferenceX;
                    } else if ( unrotatedCircleX > rectReferenceX + bullet.hitbox.width ) {
                        closestX = rectReferenceX + bullet.hitbox.width;
                    } else {
                        closestX = unrotatedCircleX;
                    }

                    // Find the unrotated closest y point from center of unrotated circle
                    if ( unrotatedCircleY < rectReferenceY ) {
                        closestY = rectReferenceY;
                    } else if ( unrotatedCircleY > rectReferenceY + bullet.hitbox.height ) {
                        closestY = rectReferenceY + bullet.hitbox.height;
                    } else {
                        closestY = unrotatedCircleY;
                    }

                    // Determine collision
                    var collision = false;
                    var distance = getDistance( unrotatedCircleX, unrotatedCircleY, closestX, closestY );

                    if ( distance < engine.player.radius ) {
                        console.log("rectcheck");
                    }
                    else {
                        collision = false;
                    }
                }

                if(hit)
                {
                    if(engine.player.immunityCountDown == 0)
                    {
                        engine.player.health -= 1;
                        engine.player.immunityCountDown = 50;
                        engine.ui.updatePlayerHealth();
                        engine.effects.flash(10);
                        engine.effects.spellChargePlayer();
                        engine.makeBullet(engine.player.getX(), engine.player.getY(), 0, 0, PlayerClearingBullet, "images/spell_circle.png")
                    }
                }
            }
            else if(bullet.kind == 1)
            {
                var distance = Math.sqrt(Math.pow(engine.bosscore.x - bullet.x, 2) + Math.pow(engine.bosscore.y - bullet.y,2))
                if(distance < bullet.hitbox.radius + 30)
                {
                    if(engine.bosscore.health == 0)
                    {
                        console.log("daed ag");
                    }
                    else
                    {
                        engine.bosscore.health -= 1;
                        remove = true;
                    }
                    engine.bosscore.health -= 1;
                    remove = true;
                }
            }

            if(remove)
            {
                engine.removeSprite(bullet.sprite);
                if(bullet.debug_sprite != "none"){ engine.removeSprite(bullet.debug_sprite); }
                bullets.splice(i, 1);
            }
        }
    }

    this.addBullet = function(bullet)
    {
        bullets.push(bullet);
    }

    this.clearBullets = function()
    {
        for(var i = bullets.length - 1; i >= 0; i--)
        {
            var bullet = bullets[i];
            if(bullet.kind == 0 || bullet.kind == 0.5)
            {
                engine.removeSprite(bullet.sprite);
                if(bullet.debug_sprite != "none"){ engine.removeSprite(bullet.debug_sprite); }
                bullets.splice(i, 1);
                engine.makeBullet(bullet.x, bullet.y, 270, 22, Score, "images/score.png")
            }
        }
    }
}

function Generic(size)
{
    return function(bullet)
    {
        this.hitbox = new HitboxCircle(size);
        this.kind = 0;

        this.update = function()
        {
        }
    }
}

function getDistance( fromX, fromY, toX, toY ) {
	var dX = Math.abs( fromX - toX );
	var dY = Math.abs( fromY - toY );

	return Math.sqrt( ( dX * dX ) + ( dY * dY ) );
}
