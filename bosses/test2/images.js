function loadBossImages(bossname)
{
    var to_load = [
        "boss.png",
        "player_bullet_same.png",
        "player_bullet_same2.png"
    ];

    for(var i = 0; i < to_load.length; i++)
    {
        loader.add("bosses/" + bossname + "/images/" + to_load[i]);
    }

}
