function loadImages()
{
    var to_load = [
        "player_straight.png",
        "player_hitbox.png",
        "player_left.png",
        "player_right.png",
        "player_bullet.png",
        "spellcard_ring.png"
    ];

    for(var i = 0; i < to_load.length; i++)
    {
        loader.add("images/" + to_load[i]);
    }

}
