// File contains main PIXI (graphics engine) funcs

// The virtual game screen will be 775 x 900. This does not correspond to actual screen rendering size which changes on screen resolution
var xratio = 775
var yratio = 900
var scaling = 0.71;

var renderer = PIXI.autoDetectRenderer(xratio * scaling, yratio * scaling, {backgroundColor : 0x2C3E50});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var loader = PIXI.loader;
var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;
var engine;
var graphics = new PIXI.Graphics();

loadImages();
console.log("Loading!");
loadBoss("in_1_wriggle");
loader.load(init);
function init()
{
    engine = new Engine();
    animate();
}



function animate() {
    requestAnimationFrame(animate);
    engine.engineUpdate();
    renderer.render(stage);
}
