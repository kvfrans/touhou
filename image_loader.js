function loadImages()
{
    var to_load = [
        "player_straight.png",
        "player_hitbox.png",
        "player_left.png",
        "player_right.png",
        "player_bullet.png",
        "spellcard_ring.png",
        "focus_bullet.png",
        "harambe_kun.png",
        "score.png",
        "harambe.png",
        "white.png",
        "bullet_hitbox.png",
        "spell_charge.png",
        "spell_charge_red.png",
        "bg.png",
        "spellcard_bg.png",
        "enemy_marker.png",
        "blackpixel.png",
        "redpixel.png",
        "sidebar.png",
        "health_icon.png",
        "spell_circle.png",
    ];

    for(var i = 0; i < to_load.length; i++)
    {
        loader.add("images/" + to_load[i]);
    }

}
