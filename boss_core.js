function BossCore(x, y, health)
{
    this.x = x;
    this.y = y;
    this.maxhealth = health;
    this.health = health;
    var bosscore = this;
    var timer = 0;

    var enemy_marker;



    this.update = function()
    {
        engine.drawHealth(10, 10, bosscore.health/bosscore.maxhealth * renderer.width-20, renderer.height/42, 0xFF0000);

        if(timer == 0)
        {
            enemy_marker = engine.makeNamedSprite("enemy_marker", "images/enemy_marker.png", 375, 880, 5)
        }
        engine.setSpritePosition(enemy_marker, bosscore.x, 880);
        timer += 1;
    }
}
