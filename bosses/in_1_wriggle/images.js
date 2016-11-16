function loadBossImages(bossname)
{
    var to_load = [
        "boss.png",
        "leaf_blue.png",
        "leaf_yellow.png",
        "orb_yellow.png",
        "spirit_white.png",
        "orb_white.png",
    ];

    for(var i = 0; i < to_load.length; i++)
    {
        loader.add("bosses/" + bossname + "/resources/" + to_load[i]);
    }

}
