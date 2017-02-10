function GameWrapper()
{
    var gamewrapper = this;
    engine = new Engine(gamewrapper);
    this.keyboard = new Keyboard();

    var menu_components = [];

    var title = engine.makeNamedSprite("title","images/menu_title.png", 538, 300, 3);
    menu_components.push(title);
    for(var i = 0; i < stages_available.length; i++)
    {
        var ss = engine.makeNamedSprite("stageselect"+i, "images/menu_stageselect.png", 538, 300 + i*200, 3);
        var st = engine.makeNamedText("stageselect_text"+i, stages_available[i], 408, 280 + i*200, 3);
        menu_components.push(ss);
        menu_components.push(st);
    }

    var selector = engine.makeNamedSprite("title","images/menu_clicker.png", 538, 300, 2);
    menu_components.push(selector);
    var currentlyselected = 0;



    this.gameWrapperUpdate = function()
    {
        engine.engineUpdate();

        if(!engine.active)
        {
            if(this.keyboard.keyStates.down == 2)
            {
                if(currentlyselected < stages_available.length - 1)
                {
                    currentlyselected++;
                    engine.setSpritePosition(selector, 538, 300 + currentlyselected*200);
                }
            }
            if(this.keyboard.keyStates.up == 2)
            {
                if(currentlyselected > 0)
                {
                    currentlyselected--;
                    engine.setSpritePosition(selector, 538, 300 + currentlyselected*200);
                }
            }
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
