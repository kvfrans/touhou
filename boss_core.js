function BossCore(x, y, health)
{
    this.x = x;
    this.y = y;
    this.maxhealth = health;
    this.health = health;
    var bosscore = this;

    this.update = function()
    {
        engine.drawHealth(10, 10, bosscore.health/bosscore.maxhealth * renderer.width-20, renderer.height/42, 0xFF0000);
    }
}
