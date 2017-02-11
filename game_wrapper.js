function GameWrapper()
{
    var gamewrapper = this;
    engine = new Engine(gamewrapper);
    this.keyboard = new Keyboard();
    var title = engine.makeNamedSprite("title","images/easternland.png", 538, 100, 3);
    var menu_components = [];

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
        var ss = engine.makeNamedSprite("stageselect"+i, "images/menu_stageselect.png", 550, 450, 5);
        engine.setSpriteScale(ss, 1/4.0, 1/4.0)
        var st = engine.makeNamedText("stageselect_text"+i, "", 408, 280 + i*200, 3);
        menu_components.push(ss);
        menu_components.push(st);
    }

    var selector = engine.makeNamedSprite("title","images/menu_clicker.png", 538, 300, 2);
    engine.setSpriteScale(selector, 0, 0);
    menu_components.push(selector);
    var currentlyselected = 0;

    var leadershow = false;
    var iswin = false;


    this.gameWrapperUpdate = function()
    {
        engine.engineUpdate();

        if(!engine.active && !leadershow && !iswin)
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
                console.log("hey")
                for(var i = 0; i < menu_components.length; i++)
                {
                    engine.removeSprite(menu_components[i]);
                }
                menu_components = [];
                loadBoss(stages_available[currentlyselected]);
                engine.activate();
            }
        }

        if(leadershow)
        {
            if(this.keyboard.keyStates.z == 2)
            {
                leadershow = false;
                console.log("yeah");
                this.restart("in_1_wriggle")
            }
        }

        if(iswin)
        {
            if(this.keyboard.keyStates.x == 2)
            {
                iswin = false;
                this.leaderboard()
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
        leadershow = true;


        for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
        console.log("called");
        engine = new Engine(gamewrapper);

        var highScore = 0;

        var arr = JSON.parse(localStorage['easternland']);

        var c = 0
        for(var i = arr.length - 1; i >= 0; i--)
        {
            c += 1;
            if(arr[i] > highScore){
                highScore = arr[i];
            }

            if(c < 10)
            {
                engine.makeNamedText("score"+i, "" + arr[i], 300, 200 + 50*c, 5);
            }
        }
        var score = engine.makeNamedText("score", "High Score: " + highScore, 300, 100, 5);

        var score = engine.makeNamedText("ins", "Press Z to Retry", 300, 700, 5);

    }

    this.win = function()
    {
        iswin = true;
        for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
        engine = new Engine(gamewrapper);
        w = engine.makeNamedSprite("win", "images/win.png", 500, 450, 5);
        engine.setSpriteScale(w, 1/3.0, 1/3.0);
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
