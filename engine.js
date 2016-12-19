// Main engine (handles helper funcs, connecting all modules together)

function Engine()
{
    var engine = this;

    var keyboard = new Keyboard();
    var player = new Player(this);
    var boss = new Boss(this);
    var bulletHandler = new BulletHandler(this);
    var effects = new Effects(this);
    var ui = new UI(this);
    this.effects = effects;
    this.player = player;
    this.ui = ui;


    var namedSprites = {};

    var layers = [];
    this.layers = layers;
    for(var s = 0; s < 6; s++)
    {
        var st = new PIXI.DisplayObjectContainer();
        layers[s] = st;
        stage.addChild(st);
    }
    // 0: bg-0
    // 1: bg-1
    // 2: mid-0
    // 3: mid-1
    // 4: front-0
    // 5: front-1


    // called every frame
    this.engineUpdate = function()
    {
        player.playerUpdate(keyboard.keyStates);
        boss.bossUpdate(player);
        bulletHandler.bulletUpdate();
        keyboard.keyboardUpdate();
        effects.updateEffects();
        ui.updateUI();
    }

    this.makeNamedSprite = function(name, texturename, x, y, layer)
    {
        // default layer = mid-0 (2)
        layer = typeof layer !== 'undefined' ? layer : 2;

        var sprite = new Sprite(engine.textureFromName(texturename));
        sprite.anchor.set(0.5,0.5);
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
        sprite.scale.set(scaling,scaling);
        sprite.layernum = layer
        layers[layer].addChild(sprite);
        namedSprites[name] = sprite;
        return sprite;
    }

    this.makeNamedText = function(name, text, x, y, layer)
    {
        // default layer = mid-0 (2)
        layer = typeof layer !== 'undefined' ? layer : 2;

        var sprite = new PIXI.Text(text ,{font : 'Arial', fontSize: 40, fill : 0xD2527F, align : 'center', dropShadow: true});
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
        sprite.scale.set(scaling,scaling);
        sprite.layernum = layer;
        layers[layer].addChild(sprite);
        namedSprites[name] = sprite;
        return sprite;
    }

    this.setSpritePosition = function(sprite, x, y)
    {
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
    }

    this.setSpriteScale = function(sprite, x, y)
    {
        sprite.scale.set(x * scaling, y * scaling)
    }

    this.setSpriteRotation = function(sprite, degrees)
    {
        sprite.rotation = degrees/180 * Math.PI;
    }

    this.setSpriteTexture = function(sprite, texturename)
    {
        sprite.setTexture(engine.textureFromName(texturename));
    }

    this.setSpriteAnchor = function(sprite, x, y)
    {
        sprite.anchor.set(x, y);
    }

    this.setSpriteOpacity = function(sprite, opacity)
    {
        sprite.alpha = opacity;
    }

    this.removeSprite = function(sprite)
    {
        engine.layers[sprite.layernum].removeChild(sprite);
    }

    this.spriteFromName = function(name)
    {
        return namedSprites[name];
    }

    this.clearBullets = function()
    {
        bulletHandler.clearBullets();
    }

    this.removeBullet = function(bullet)
    {
        bullet.remove = true;
    }

    this.textureFromName = function(name)
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

    this.makeBullet = function(x, y, direction, speed, bulletclass, texturename, layer)
    {
        // default layer = mid-0 (2)
        layer = typeof layer !== 'undefined' ? layer : 2;

        var sprite = new Sprite(engine.textureFromName(texturename));
        sprite.anchor.set(0.5,0.5);
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
        sprite.scale.set(scaling,scaling);
        sprite.layernum = layer;
        layers[layer].addChild(sprite);
        var bullet = new Bullet(x, y, direction, speed, sprite, bulletclass);
        bulletHandler.addBullet(bullet);
        return bullet;
    }

    this.setBulletPosition = function(bullet, x, y)
    {
        bullet.x = x;
        bullet.y = y;
    }

    this.setBulletSpeed = function(bullet, speed)
    {
        bullet.speed = speed;
    }

    this.setBulletDirection = function(bullet, direction)
    {
        bullet.direction = direction;
        bullet.sin = Math.sin(direction/180 * Math.PI);
        bullet.cos = Math.cos(direction/180 * Math.PI);
        engine.setSpriteRotation(bullet.sprite, direction + 90);
        if(bullet.rotate == false)
        {
            engine.setSpriteRotation(bullet.sprite, 0);
        }
    }

    this.setBulletHitbox = function(bullet, hitbox)
    {
        bullet.hitbox = hitbox;
        if(show_hitboxes)
        {
            stage.removeChild(bullet.debug_sprite)
            bullet.debug_sprite = new Sprite(engine.textureFromName("images/bullet_hitbox.png"));
            bullet.debug_sprite.anchor.set(0.5,0.5);
            bullet.debug_sprite.x = bullet.sprite.x
            bullet.debug_sprite.y = bullet.sprite.y
            engine.setSpriteScale(bullet.debug_sprite, bullet.hitbox.radius / 16.0,bullet.hitbox.radius / 16.0)
            stage.addChild(bullet.debug_sprite);
        }
    }

    player.playerInit();
    boss.bossInit();
    effects.effectsInit();
    this.bosscore = boss.core;
    this.bullethandler = bulletHandler;

}
