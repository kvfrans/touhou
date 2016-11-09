// Main engine (handles helper funcs, connecting all modules together)

function Engine()
{
    var keyboard = new Keyboard();
    var player = new Player(this);
    var boss = new Boss(this);
    var bulletHandler = new BulletHandler(this);
    var engine = this;

    var namedSprites = {};


    // called every frame
    this.engineUpdate = function()
    {
        player.playerUpdate(keyboard.keyStates);
        boss.bossUpdate(player);
        bulletHandler.bulletUpdate();
        keyboard.keyboardUpdate();
    }

    this.makeNamedSprite = function(name, texturename, x, y)
    {
        var sprite = new Sprite(engine.textureFromName(texturename));
        sprite.anchor.set(0.5,0.5);
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
        sprite.scale.set(scaling,scaling);
        stage.addChild(sprite);
        namedSprites[name] = sprite;
    }

    this.moveSprite = function(sprite, x, y)
    {
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
    }

    this.rotateSprite = function(sprite, degrees)
    {
        sprite.rotation = degrees/180 * Math.PI;
    }

    this.changeSpriteTexture = function(sprite, texturename)
    {
        sprite.setTexture(engine.textureFromName(texturename));
    }

    this.changeSpriteOpacity = function(sprite, opacity)
    {
        sprite.alpha = opacity;
    }

    this.removeSprite = function(sprite)
    {
        stage.removeChild(sprite);
    }

    this.spriteFromName = function(name)
    {
        return namedSprites[name];
    }

    this.textureFromName = function (name)
    {
        return resources[name].texture;
    }

    this.spriteFromName = function(name)
    {
        return namedSprites[name];
    }

    this.convertCoord = function(fake)
    {
        return fake * scaling;
    }

    this.makeBullet = function(x, y, direction, speed, bulletclass, texturename)
    {
        var sprite = new Sprite(engine.textureFromName(texturename));
        sprite.anchor.set(0.5,0.5);
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
        sprite.scale.set(scaling,scaling);
        stage.addChild(sprite);
        var bullet = new Bullet(x, y, direction, speed, sprite, bulletclass);
        bulletHandler.addBullet(bullet);
        return bullet;
    }

    this.setBulletPosition = function(bullet, x, y)
    {
        bullet.x = x;
        bullet.y = y;
    }

    this.setBulletDirection = function(bullet, direction)
    {
        bullet.direction = direction;
        bullet.sin = Math.sin(direction/180 * Math.PI);
        bullet.cos = Math.cos(direction/180 * Math.PI);
        engine.rotateSprite(bullet.sprite, direction + 90);
    }

    player.playerInit();
    boss.bossInit();

}
