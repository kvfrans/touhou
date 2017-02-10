function GameWrapper()
{
    var gamewrapper = this;
    engine = new Engine(gamewrapper);
    this.keyboard = new Keyboard();
    var highScore = 0;
    if (localStorage['easternland'] === undefined) {
        localStorage['easternland'] == [];
    }
    else {
            for(var i = 0; i < localStorage['easternland'].length; i++)
        {
            if(localStorage['easternland'][i] > highScore){
                highScore = localStorage['easternland'][i];
            }
        }
    }
    console.log(localStorage['easternland']);
    var menu_components = [];
    var score = engine.makeNamedText("score", "High Score: " + highScore, 100, 100, 5);
    var title = engine.makeNamedSprite("title","images/easternland.png", 538, 100, 3);
    menu_components.push(title);
    // for(var i = 0; i < stages_available.length; i++)
    // {
    //     var ss = engine.makeNamedSprite("stageselect"+i, "images/menu_stageselect.png", 538, 300 + i*200, 3);
    //     var st = engine.makeNamedText("stageselect_text"+i, stages_available[i], 408, 280 + i*200, 3);
    //     menu_components.push(ss);
    //     menu_components.push(st);
    // }
    for(var i = 0; i < 1; i++)
    {
        var ss = engine.makeNamedSprite("stageselect"+i, "images/menu_stageselect.png", 538, 600, 3);
        var st = engine.makeNamedText("stageselect_text"+i, "", 408, 280 + i*200, 3);
        menu_components.push(ss);
        menu_components.push(st);
    }

    var selector = engine.makeNamedSprite("title","images/menu_clicker.png", 538, 300, 2);
    engine.setSpriteScale(selector, 0, 0);
    menu_components.push(selector);
    var currentlyselected = 0;



    this.gameWrapperUpdate = function()
    {
        engine.engineUpdate();

        if(!engine.active)
        {
            // if(this.keyboard.keyStates.down == 2)
            // {
            //     if(currentlyselected < stages_available.length - 1)
            //     {
            //         currentlyselected++;
            //         engine.setSpritePosition(selector, 538, 300 + currentlyselected*200);
            //     }
            // }
            // if(this.keyboard.keyStates.up == 2)
            // {
            //     if(currentlyselected > 0)
            //     {
            //         currentlyselected--;
            //         engine.setSpritePosition(selector, 538, 300 + currentlyselected*200);
            //     }
            // }
            if(this.keyboard.keyStates.z == 2)
            {
                for(var i = 0; i < menu_components.length; i++)
                {
                    engine.removeSprite(menu_components[i]);
                }
                menu_components = [];
                loadBoss(stages_available[currentlyselected]);
                engine.activate();
            }
        }
        this.keyboard.keyboardUpdate();
    }

    this.startEngine = function()
    {
        engine.activate();
    }

    this.leaderboard = function()
    {
        for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
        console.log("called");



    }

    this.restart = function(stagename)
    {
        var points = engine.player.points;
        loadBoss(stagename);
        for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
        engine = new Engine(gamewrapper);
        engine.activate();
        engine.player.points = points;
    }
}
