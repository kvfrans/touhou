function BossCore(x, y, health)
{
    this.x = x;
    this.y = y;
    this.maxhealth = health;
    this.health = health;
    var bosscore = this;

    this.update = function()
    {
        engine.drawHealth(10, 10, bosscore.health/bosscore.maxhealth * 500, 20, 0xFF0000);
    }
}
