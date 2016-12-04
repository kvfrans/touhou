function BossCore(x, y, health)
{
    this.x = x;
    this.y = y;
    this.maxhealth = health;
    this.health = health;
    var bosscore = this;
    var timer = 0;

    this.resetHealth = function(health)
    {
        bosscore.health = health;
        bosscore.maxhealth = health;
    }
}
