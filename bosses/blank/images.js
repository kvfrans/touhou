function loadBossImages(bossname)
{
    var to_load = [
        "boss.png",
        "circle_spell.png",
    ];

    for(var i = 0; i < to_load.length; i++)
    {
        loader.add("bosses/" + bossname + "/resources/" + to_load[i]);
    }

}
