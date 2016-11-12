function BossCore(x, y, health)
{
    this.x = x;
    this.y = y;
    this.maxhealth = health;
    this.health = health;

    this.update = function()
    {
        engine.drawHealth(10, 10, this.health/150 * 690, 20, 0xFF0000);
    }
}
