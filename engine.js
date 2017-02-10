// Main engine (handles helper funcs, connecting all modules together)

function Engine(gamewrapper)
{
    var engine = this;

    var player = new Player(this);
    var boss;
    var bulletHandler = new BulletHandler(this);
    var effects = new Effects(this);
    var ui = new UI(this);
    this.effects = effects;
    this.player = player;
    this.ui = ui;

    this.active = false;
    this.paused = false;

    this.gamewrapper = gamewrapper

    var image_scaling = 4;

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
        if(this.active)
        {
            if(!this.paused)
            {
                player.playerUpdate(gamewrapper.keyboard.keyStates);
                boss.bossUpdate(player);
                bulletHandler.bulletUpdate();
                ui.updateUI();
            }
            effects.updateEffects();
        }
    }

    this.makeNamedSprite = function(name, texturename, x, y, layer)
    {
        // default layer = mid-0 (2)
        layer = typeof layer !== 'undefined' ? layer : 2;

        var sprite = new Sprite(engine.textureFromName(texturename));
        sprite.anchor.set(0.5,0.5);
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
        sprite.scale.set(scaling * image_scaling, scaling * image_scaling);
        sprite.layernum = layer
        layers[layer].addChild(sprite);
        namedSprites[name] = sprite;
        return sprite;
    }

    this.makeNamedText = function(name, text, x, y, layer)
    {
        // default layer = mid-0 (2)
        layer = typeof layer !== 'undefined' ? layer : 2;

        var sprite = new PIXI.Text(text ,{font : 'Arial', fontSize: 40, fill : 0xD2527F, align : 'left', dropShadow: true});
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
        sprite.scale.set(scaling,scaling);
        sprite.layernum = layer;
        layers[layer].addChild(sprite);
        namedSprites[name] = sprite;
        return sprite;
    }

    this.setTextStyle = function(text, font, fontSize, fillcolor, shadow)
    {
        text.style.font = font;
        text.style.fontSize = fontSize;
        text.style.fill = fillcolor;
        text.style.dropShadow = shadow;
        text.dirty = true;
    }

    this.setTextContent = function(text, content)
    {
        text.text = content;
        text.dirty = true;
    }

    this.setTextWrap = function(text, wrap, wrapwidth)
    {
        text.style.wordWrap = wrap;
        text.style.wordWrapWidth = wrapwidth;
        text.dirty = true;
    }

    this.setSpritePosition = function(sprite, x, y)
    {
        sprite.x = engine.convertCoord(x);
        sprite.y = engine.convertCoord(y);
    }

    this.setSpriteScale = function(sprite, x, y)
    {
        sprite.scale.set(x * scaling * image_scaling, y * scaling * image_scaling)
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
        sprite.scale.set(scaling * image_scaling, scaling * image_scaling);
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

    this.activate = function()
    {
        boss = new Boss(engine);
        this.active = true;
        player.playerInit();
        boss.bossInit();
        effects.effectsInit();
        this.bosscore = boss.core;
        this.bullethandler = bulletHandler;
    }

    this.setPause = function(paused)
    {
        this.paused = paused;
    }

}
