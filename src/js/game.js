enchant();

var RES_CHARACHTERS = 'img/chara0.gif';
var RES_ITEMS       = 'img/icon0.png';
var RES_MAP_TILES   = 'img/map1.gif';

var DIRECTION_DOWN  = 0;
var DIRECTION_LEFT  = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_UP    = 3;

window.onload = function() {

    var game = new Core(320,320);//window.screen.width, window.screen.height);
    game.scale = 2.0;
    game.fps   = 15;

    game.spriteSheetWidth  = 320;
    game.spriteSheetHeight = 512;
    game.itemSpriteSheetWidth = 64;
    game.spriteWidth  = 16;
    game.spriteHeight = 16;

    game.items = [
      { price: 1000, description: "Hurter",    id: 0 },
      { price: 5000, description: "Drg. Paw",  id: 1 },
      { price: 5000, description: "Ice Magic", id: 2 },
      { price:   60, description: "Chess Set", id: 3 }
    ];

    game.keybind(32,'a');//spacebar is button a , options: ('left', 'right', 'up', 'down', 'a', 'b').
    game.keybind(13,'b');//enter is button b
    //console.log(enchant.KeyboardInputSource._instances);

    game.preload( RES_MAP_TILES, RES_CHARACHTERS, RES_ITEMS );

    var isWalkable = function(x,y,lvl){
    	var element = backgroundData[x][y];
    	if (typeof lvl !== 'undefined'){
    		element = foregroundData[lvl][x][y];
    		return element === -1 || element === 421 || element === 441;
    	}
    	return (element<160 || element>320);
    };
    
    var map = new Map(game.spriteWidth, game.spriteHeight);
    var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);

    var setMaps = function(){
        map.image = game.assets[RES_MAP_TILES];
        map.loadData(backgroundData, foregroundData[0]);

	    foregroundMap.image = game.assets[RES_MAP_TILES];
        foregroundMap.loadData( foregroundData[1] );

        var collisionData = [];
        var i,j;
        for(i = 0; i < foregroundData[0].length; i++){
		  	collisionData.push([]);
		  	for(j = 0; j < foregroundData[0][i].length; j++){
		  	  collisionData[i][j] = isWalkable(i,j,0) &&  isWalkable(i,j) ? 0 : 1;		  	  
		  	}
        }
        map.collisionData = collisionData;
        /*
	      map.collisionData = [
            [  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  1,  1,  0,  1,  1,  0,  1,  1,  0,  1,  1,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  1,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  1,  1,  1,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  1,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0],
            [  0,  1,  1,  1,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0],
            [  0,  0,  0,  1,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  1,  1,  1,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  1,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  1,  1,  1,  0,  1,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  1,  1,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1]
        ];
        */
    };

/* PLAYER * /
    var player = new Sprite(32, 32);
    var setPlayer = function(){

    var image = new Surface(96, 128);
    image.draw(game.assets['img/chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
	player.image = image;
	player.framesPerDirection = 3;

	player.spriteOffset = 0 * player.framesPerDirection;
	player.startingX = 6;
	player.startingY = 10;
	player.velocity = 4;
	player.x = player.startingX * game.spriteWidth;// - Math.floor(game.spriteWidth/2);
	player.y = player.startingY * game.spriteHeight;//- Math.floor(game.spriteHeight/2);
	//player.direction = 0;
	//player.walk = 0;
	//player.frame = player.spriteOffset + player.direction;
	//player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
	//player.image.draw(game.assets["img/chara0.gif"]);




	  player.isMoving = false;
	  player.direction = 0;
	  player.walk = 1;

	  player.addEventListener(Event.ENTER_FRAME, player.move );

	  player.name = "Luca";
	  player.characterClass = "Mage";
	  player.exp = 0;
	  player.level = 1;
	  player.gp = 100;
	  player.inventory = [];
	  player.visibleItems =[];
	  player.itemSurface = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);

	  player.levelStats = [
	    {},
	    { attack: 4, maxHp: 10, maxMp : 0, expMax: 10 },
	    { attack: 6, maxHp: 14, maxMp : 0, expMax: 30 },
	    { attack: 7, maxHp: 20, maxMp : 5, expMax: 50 }
	  ];


	  player.hp = player.levelStats[player.level].maxHp;
	  player.mp = player.levelStats[player.level].maxMp;

	  player.statusLabel = new Label("");
	  player.statusLabel.width = game.width;
	  player.statusLabel.y = 0;
	  player.statusLabel.x = 0;
	  player.statusLabel.color = '#fff';
	  player.statusLabel.backgroundColor = '#000';
      };

      player.attack = function(){
	    return player.levelStats[player.level].attack;
      };

      player.move = function() {
    	  this.frame = this.direction * this.framesPerDirection + this.walk;
        if (this.isMoving) {
            this.moveBy(this.vx, this.vy);

            if (!(game.frame % this.framesPerDirection)) {
                this.walk++;
                this.walk %= this.framesPerDirection;
            }
            if ((this.vx && (this.x-(game.spriteWidth/2)) % game.spriteWidth == 0) || (this.vy && this.y % game.spriteHeight == 0)) {
                this.isMoving = false;
                this.walk = 1;
            }
        } else {
            this.vx = this.vy = 0;
            if (game.input.left) {
                this.direction = DIRECTION_LEFT;
                this.vx = -this.velocity;
            } else if (game.input.right) {
                this.direction = DIRECTION_RIGHT;
                this.vx = this.velocity;
            } else if (game.input.up) {
                this.direction = DIRECTION_UP;
                this.vy = -this.velocity;
            } else if (game.input.down) {
                this.direction = DIRECTION_DOWN;
                this.vy = this.velocity;
            }
            if (this.vx || this.vy) {
            	this.clearStatus();
                var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * game.spriteWidth : 0) + game.spriteWidth;
                var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * game.spriteHeight : 0) + game.spriteHeight;
                if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
                    this.isMoving = true;
                    this.move();
                }
            }
        }
    };

    player.displayStatus = function(){
	  this.statusLabel.text = "--"+ this.name +" the "+ this.characterClass
	  + "<br />--HP: "+ this.hp +"/"+ this.levelStats[this.level].maxHp
	  + "<br />--MP: "+ this.mp +"/"+ this.levelStats[this.level].maxMp
	  + "<br />--Exp: "+ this.exp// +"/"+ this.levelStats[this.level].maxMp
	  + "<br />--Level: "+ this.level
	  + "<br />--GP: "+ this.gp
	  + "<br /><br />--Inventory: ";
	  this.statusLabel.height = 170;
	  this.showInventory(0);
	  game.currentScene.addChild(this.statusLabel);
    };

    player.clearStatus = function(){
		this.statusLabel.text = "";
		this.statusLabel.height = 0;
		this.hideInventory();
    };

    player.showInventory = function(yOffset){
      if (this.visibleItems.length === 0){
		this.itemSurface.draw(game.assets['img/icon0.png']);
		for(var i = 0; i< this.inventory.length; i++){
		  var item = new Sprite(game.spriteWidth, game.spriteHeight);
		  item.x = 30 +70 *i;
		  item.frame = this.inventory[i];
		  item.scaleX = 2;
		  item.scaleY = 2;
		  item.image = this.itemSurface;
		  this.visibleItems.push(item);
		  game.currentScene.addChild(item);
		}
      }
    };

    player.hideInventory = function(){
      for(var i =0; i < this.visibleItems; i++){
    	  this.visibleItems[i].remove();
      }
      this.visibleItems = [];
    };

    player.square = function(){
      var playerSquare = {
		  x: Math.floor(this.x/game.spriteWidth)+1,
		  y: Math.floor(this.y/game.spriteHeight)+1
      };
      console.log(playerSquare);
      return playerSquare;
    };

    player.facingSquare = function(){
      var playerSquare = this.square();
      var facingSquare;
      if (this.direction === DIRECTION_DOWN){
    	  facingSquare = { x: playerSquare.x  , y: playerSquare.y+1 };
      } else if (this.direction === DIRECTION_RIGHT){
    	  facingSquare = { x: playerSquare.x+1, y: playerSquare.y   };
      } else if (this.direction === DIRECTION_UP){
    	  facingSquare = { x: playerSquare.x  , y: playerSquare.y-1 };
      } else if (this.direction === DIRECTION_LEFT){
    	  facingSquare = { x: playerSquare.x-1, y: playerSquare.y   };
      }

      if ((facingSquare.x <0 || facingSquare.x >= map.width/game.spriteWidth) ||
    	  (facingSquare.y <0 || facingSquare.y >= map.height/game.spriteHeight) ){
    	  return null;
      } else {
    	  return facingSquare;
      }
    };

    player.facing = function(){
      var facingSquare = this.facingSquare();
      if (!facingSquare){
    	  return null;
      } else {
    	  return foregroundData[0][facingSquare.y][facingSquare.x];
      }
    };
/**/

/* STAGE * /
    var stageScene = new Group();
    var setStage = function(){

      stageScene.addChild(map);
      stageScene.addChild(player);
      stageScene.addChild(foregroundMap);
      game.rootScene.addChild(stageScene);

      var pad = new Pad();
      pad.x = 0;
      pad.y = 220;
      game.rootScene.addChild(pad);

      var buttonA = new enchant.ui.Button('A','blue');
      buttonA.moveTo(270,245);
      game.rootScene.addChild(buttonA);

      var buttonB = new enchant.ui.Button('B','light');
      buttonB.moveTo(250,280);
      game.rootScene.addChild(buttonB);

      buttonA.ontouchstart = function(){
		var playerFacing = player.facing();
		//console.log(playerFacing);
		if (!playerFacing || !spriteRoles.get(playerFacing)){
		  player.displayStatus();
		} else {
		  spriteRoles.get(playerFacing).action();
		}
      };
    };
/**/

/* OVERRIDE * /
    game.focusViewport = function(e) {
            var x = Math.min((game.width  - game.spriteWidth) / 2 - player.x, 0);
            var y = Math.min((game.height - game.spriteHeight) / 2 - player.y, 0);
            x = Math.max(game.width,  x + map.width)  - map.width;
            y = Math.max(game.height, y + map.height) - map.height;
            stageScene.x = x;
            stageScene.y = y;
    };
/**/

/* NPC * /
	var npc = {
	
	  say : function(message){
	    player.statusLabel.text = message;
	    player.statusLabel.height = 20;
	  }
	};
	
	var info = {
	  action: function(){
	    npc.say("Ciao "+player.name+", benvenuto in questo mondo!");
	  }
	};
	var spriteRoles = { //[460,480,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		get : function(i){
			if (i===480){
			  return info;
			}
			return null;
	    }
	};
/**/

  game.onload = function() {
/* FIRST VERSION * /
    setMaps();
  	setPlayer();
    setStage();
    game.rootScene.addEventListener(Event.ENTER_FRAME, game.focusViewport );
/**/    
    /* SECOND VERSION */
    setMaps();
    var player = new Player(game,map).class();
    
    var npc = {
      say : function(message){
        player.statusLabel.text = message;
        player.statusLabel.height = 20;
      }
    };

    var info = {
      action: function(){
        npc.say("Ciao "+player.name+", benvenuto in questo mondo!");
      }
    };
    
    var spriteRoles = { //[460,480,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		get : function(i){
	    	if (i===480){
	    	  return info;
	    	}
	    	return null;
		}
    };
  	var stageScene = new StageScene(game,player,map,foregroundMap,spriteRoles).class();
//  	game.rootScene.addEventListener( Event.ENTER_FRAME, function(e) {
//  	  	stageScene.focusViewport(e);
//    });    
  	/**/
  };

  game.start();
};




























/*
 // SceneGame
var SceneGame = Class.create(Scene, {
     // The main gameplay scene.
    initialize: function() {
        var game, label, bg;

        // 1 - Call superclass constructor
        Scene.apply(this);
        // 2 - Access to the game singleton instance
        game = Game.instance;
        // 3 - Create child nodes
        label = new Label("Hi, Ocean!");
        bg = new Sprite(320,440);
        bg.image = game.assets['res/BG.png'];
        // 4 - Add child nodes
        this.addChild(bg);
        this.addChild(label);

        // Penguin
	penguin = new Penguin();
	penguin.x = game.width/2 - penguin.width/2;
	penguin.y = 280;
	this.penguin = penguin;

        // Touch listener
	this.addEventListener(Event.TOUCH_START,this.handleTouchControl)
    },

    handleTouchControl: function (evt) {
      var laneWidth, lane;
      laneWidth = 320/3;
      lane = Math.floor(evt.x/laneWidth);
      lane = Math.max(Math.min(2,lane),0);
      this.penguin.switchToLaneNumber(lane);
    },

    switchToLaneNumber: function(lane){
	var targetX = 160 - this.width/2 + (lane-1)*90;
	this.x = targetX;
    }

});


 var Penguin = Class.create(Sprite, {
    // The player character.
    initialize: function() {
        // 1 - Call superclass constructor
        Sprite.apply(this,[30, 43]);
        this.image = Game.instance.assets['res/penguinSheet.png'];
        // 2 - Animate
        this.animationDuration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
    },

    updateAnimation: function (evt) {
      this.animationDuration += evt.elapsed * 0.001;
      if (this.animationDuration >= 0.25) {
	  this.frame = (this.frame + 1) % 2;
	  this.animationDuration -= 0.25;
      }
    }
});

 */
