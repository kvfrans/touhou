function loadBossImages(bossname)
{
    var to_load = [
        "boss.png",
        "leaf_blue.png",
        "leaf_yellow.png",
        "orb_yellow.png",
        "spellcircle.png",
        "orb_white_big.png",
        "orb_white_small.png",
    ];

    for(var i = 0; i < to_load.length; i++)
    {
        loader.add("bosses/" + bossname + "/resources/" + to_load[i]);
    }

}
