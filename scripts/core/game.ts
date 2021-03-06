//IIFE -- Immediately Invoked Function Expression
// also called self executing anonymous function
(function(){
    // Game Variables
    let canvas:HTMLCanvasElement;
    let stage:createjs.Stage;
    let AssetManager: createjs.LoadQueue;
    let CurrentScene: objects.Scene;
    let CurrentState: config.Scene;
    let keyCodes: number[];

    let Manifest = [
        //images
        {id: "bg", src:"/Assets/images/bg.png"},
        {id: "floor", src:"/Assets/images/floor.png"},
        {id: "box", src:"/Assets/images/dummy.png"},
        {id: "launcher", src:"/Assets/images/tower.png"},
        {id: "hero", src:"/Assets/images/hero.png"},
        {id:"bullet", src:"/Assets/images/bullet_02.png"},
        {id:"play", src:"/Assets/images/Startbutton.png"},
        {id:"startbg", src:"/Assets/images/mainmenu.png"},
        {id:"endbg", src:"/Assets/images/stageclear.png"},
        {id: "canon", src:"/Assets/images/canon.png"},
        {id: "meteor", src:"/Assets/images/meteor.png"},
        {id: "playerbullet", src:"/Assets/images/bullet.png"},
        {id: "background", src:"/Assets/images/background.png"},
        {id: "background3", src:"/Assets/images/background3.jpeg"},
        {id:"portal2", src:"/Assets/images/portal2.png"},
        {id:"portal", src:"/Assets/images/portal.png"},
        {id:"enemy", src:"/Assets/images/enemy.png"},
        {id:"hero3", src:"/Assets/images/spaceship.png"},
        //sounds
        {id:"startbgm", src:"/Assets/audio/mainmenu.mp3"},
        {id:"level1bgm", src:"/Assets/audio/stage1.mp3"},
        {id:"jump", src:"/Assets/audio/jump.mp3"},
        {id:"level3bgm", src:"/Assets/audio/stage3.mp3"},
        {id:"bgmusic", src:"/Assets/audio/stage2.mp3"},
        {id:"bubble", src:"/Assets/audio/bubble.mp3"},
        {id:"blast", src:"/Assets/audio/blast.mp3"},
        {id:"laser", src:"/Assets/audio/laser.mp3"},
        {id:"endbgm", src:"/Assets/audio/gameover.mp3"}
    ]


    function Init():void {

        keyCodes = new Array<number>();

        document.onkeydown = function(event) {
            if(keyCodes.indexOf(event.keyCode) == -1) {
                keyCodes.push(event.keyCode);
            }
        }

        document.onkeyup = function(event) {
            let index = keyCodes.indexOf(event.keyCode);
            if(index > -1) {
                keyCodes.splice(index, 1);
            }
        }

        console.log(`%c Assets Loading...`,"font-weight:bold; font-size:20px; color: green;");
        AssetManager = new createjs.LoadQueue();
        managers.Game.AssetManager = AssetManager; // set as single instance of the LoadQueue object
        AssetManager.installPlugin(createjs.Sound); // enables sound file preloading
        AssetManager.on("complete", Start);
        AssetManager.loadManifest(Manifest);
    }

    function Start():void {
        console.log(`%c Game Initializing...`,"font-weight:bold; font-size:20px; color: red;");
        canvas = document.getElementsByTagName("canvas")[0];
        stage = new createjs.Stage(canvas);
        managers.Game.Stage = stage; // create a reference to the stage class
        stage.enableMouseOver(20); // enables mouse over events
        createjs.Ticker.framerate = 60; // sets framerate to 60fps
        createjs.Ticker.on("tick", Update);

        CurrentState = config.Scene.START;
        managers.Game.CurrentState = CurrentState;

        // This is where all the magic happens
        Main();
    }

    function Update():void {
        if(CurrentState != managers.Game.CurrentState) {
            CurrentState = managers.Game.CurrentState;
            Main();
        }

        CurrentScene.Update(keyCodes);
        
        stage.update();
    }

    function Main():void {
        console.log(`%c Main Game Started...`,"font-style:italic; font-size:16px; color:blue;");

        if(CurrentScene) {
            CurrentScene.Destroy();
            stage.removeChild(CurrentScene);
        }
    
        switch(CurrentState) {
            case config.Scene.START:
            CurrentScene = new scenes.Start();
            break;

            case config.Scene.LEVEL1:
            CurrentScene = new scenes.Level1();
            break;

            case config.Scene.LEVEL2:
            CurrentScene = new scenes.Level2();
            break;

            case config.Scene.LEVEL3:
            CurrentScene = new scenes.Level3();
            break;

            case config.Scene.END:
            CurrentScene = new scenes.End();
            break;
        }

        managers.Game.CurrentScene = CurrentScene;
        stage.addChild(CurrentScene);
    }

    window.addEventListener("load", Init);

})();