function Keyboard()
{
    this.makeListener = function(keyCode, keyName)
    {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        key.keyname = keyName;
        key.initialX = undefined;
        key.initialY = undefined;
        //The `downHandler`
        key.downHandler = function(event) {
            if (event.type === "touchstart") {
                // console.re.log("y: " + event.clientY-16);
                // console.re.log("x: " + event.clientX-16);
                //
                // console.re.log(775*scaling);
                // console.re.log(screen.)

                key.initialX = 387.5*scaling + 16;
                key.initialY = 450*scaling + 32;
                if (key.code === 16 | key.code === 90) {
                    if (key.isUp && key.press) key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
            }
            else if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }

        // uncomment this later, it prevents browser commands
        // event.preventDefault();
        };

        //The `upHandler`
        key.upHandler = function(event) {
            if (event.type === "touchend") {
                if (key.code != 90 && key.code != 88) {
                    if (key.isDown && key.release) key.release();
                    key.isDown = false;
                    key.isUp = true;
                }
            }
            else if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
        // event.preventDefault();
        };

        key.moveHandler = function(event) {
            var angle = Math.atan2(event.clientY - key.initialY, event.clientX - key.initialX);
            if (angle >= 3*Math.PI/4 || angle <= -3*Math.PI/4) {
                if (key.code === 37 && key.isUp && key.press) {
                    key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
                if (key.code === 39 && key.isDown && key.release) {
                    key.release();
                    key.isDown = false;
                    key.isUp = true;
                }
            }
            if (angle >= -3*Math.PI/4 && angle <= -Math.PI/4) {
                if (key.code === 38 && key.isUp && key.press) {
                    key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
                if (key.code === 40 && key.isDown && key.release) {
                    key.release();
                    key.isDown = false;
                    key.isUp = true;
                }
            }
            if (angle >= -Math.PI/4 && angle <= Math.PI/4) {
                if (key.code === 39 && key.isUp && key.press) {
                    key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
                if (key.code === 37 && key.isDown && key.release) {
                    key.release();
                    key.isDown = false;
                    key.isUp = true;
                }
            }
            if (angle >= Math.PI/4 && angle <= 3*Math.PI/4) {
                if (key.code === 40 && key.isUp && key.press) {
                    key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
                if (key.code === 38 && key.isDown && key.release) {
                    key.release();
                    key.isDown = false;
                    key.isUp = true;
                }
            }
        // event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        window.addEventListener(
            "touchstart", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "touchmove", key.moveHandler.bind(key), false
        );
        window.addEventListener(
            "touchend", key.upHandler.bind(key), false
        );
        return key;
    }

    // follow format "keyname",keynumber
    var keyList = ["x",88,"z",90,"shift",16,"left",37,"up",38,"down",40,"right",39,"esc",27];

    // the keyboard state dictionary. 0 = not pressed, 1 = held down, 2 = just pressed.
    this.keyStates = {}
    var keyListeners = this.keyStates;

    for(var i = 0; i < keyList.length / 2; i++)
    {
        var keyname = keyList[i*2];
        var keynum = keyList[i*2 + 1];
        var listener = this.makeListener(keynum, keyname);
        listener.press = function() {
            if (this.keyname === "esc")
            {
                setTimeout(function() { window.close(); },50);
            }
            keyListeners[this.keyname] = 2;
        };
        listener.release = function() {
            keyListeners[this.keyname] = 0;
        };
        keyListeners[keyname] = 0;
    }

    this.keyboardUpdate = function()
    {
        for(var key in keyListeners)
        {
            if(keyListeners[key] == 2)
            {
                keyListeners[key] = 1;
            }
        }
    }
}
