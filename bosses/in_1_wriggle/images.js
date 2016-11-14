function loadBossImages(bossname)
{
    var to_load = [
        "boss.png",
        "leaf_blue.png",
        "leaf_yellow.png",
        "orb_yellow.png",
    ];

    for(var i = 0; i < to_load.length; i++)
    {
        loader.add("bosses/" + bossname + "/images/" + to_load[i]);
    }

}
