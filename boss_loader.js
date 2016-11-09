// this loads all relevant scripts for a boss

// helper Jquery func to load a JS script
function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- This is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}


function loadBoss(bossname)
{
    require("bosses/"+bossname+"/images.js")
    require("bosses/"+bossname+"/boss.js")

    loadBossImages(bossname);
}
