function UI(engine)
{
    var timer = 0;

    var bottomblackbar;
    var enemy_marker;

    var enemyhealth;

    var sidebar_bg;

    var player_health_icons = [];

    this.updateUI = function()
    {
        if(timer == 0)
        {
            enemy_marker = engine.makeNamedSprite("enemy_marker", "images/enemy_marker.png", 375, 885, 5)
            engine.setSpritePosition(enemy_marker, engine.bosscore.x, 885);

            bottomblackbar = engine.makeNamedSprite("bottomblackbar", "images/blackpixel.png", 0, 880, 4)
            bottomblackbar.anchor.set(0,0);
            engine.setSpriteScale(bottomblackbar, 775, 20)

            enemyhealth = engine.makeNamedSprite("enemyhealth", "images/redpixel.png", 0, 0, 4)
            enemyhealth.anchor.set(0,0);
            engine.setSpriteScale(enemyhealth, (engine.bosscore.health / engine.bosscore.maxhealth)*775, 20)

            sidebar_bg = engine.makeNamedSprite("bottomblackbar", "images/sidebar.png", 775, 0, 4)
            sidebar_bg.anchor.set(0,0);
            // engine.setSpriteScale(sidebar_bg, 300, 900)

            for(var i = 0; i < 6; i++)
            {
                player_health_icons[i] = engine.makeNamedSprite("playerhealthicon"+i, "images/health_icon.png", 910 + i*28, 165, 5);
            }

        }
        else
        {
            engine.setSpritePosition(enemy_marker, engine.bosscore.x, 885);
            engine.setSpriteScale(enemyhealth, (engine.bosscore.health / engine.bosscore.maxhealth)*775, 20)

        }

        timer += 1;
    }

    this.updatePlayerHealth = function()
    {
        for(var i = 0; i < 6; i++)
        {
            engine.setSpriteScale(player_health_icons[i], 0, 0);
        }
        for(var i = 0; i < engine.player.health; i++)
        {
            engine.setSpriteScale(player_health_icons[i], 1, 1);
        }
    }
}
