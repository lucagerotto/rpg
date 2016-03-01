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
    game.scale = 1.0;
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
    };
    var shopScene = new Scene();

  game.onload = function() {
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
    
	
	var setShop = function(){
		var shop = new Group();
		shop.itemSelected = 0;
		
		shop.shoppingFunds = function(){
			return "Gold: "+ player.gp;
		};
		
		shop.drawManeki = function(){
			var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
			var maneki = new Sprite(game.spriteWidth*2, game.spriteHeight*2);
			maneki.image = image;
			//image.draw(game.assets[ RES_CHARACHTERS ], 0, 0, 96, 128, 0, 0, 96, 128);
			image.draw(game.assets[RES_CHARACHTERS]);
			maneki.frame = 8;
			maneki.y = 10;
			maneki.x = 10;
			maneki.scaleX = 2;
			maneki.scaleY = 2;
			this.addChild(maneki);
			this.message.x = 40;
			this.message.y = 10;
			this.message.color = "#fff";
			this.addChild(this.message);
		};
		
		shop.drawItemsForSale = function(){
			for(var i=0; i<game.items.length; i++){
				var image = new Surface(game.itemSpriteSheetWidth, game.itemSpriteSheetHeight);
				var item = new Sprite(game.spriteWidth, game.spriteHeight);
				image.draw( game.assets[RES_ITEMS] );
				itemLocationX = 30+70*i;
				itemLocationY = 70;
				item.y = itemLocationY;
				item.x = itemLocationX;
				item.frame = i;
				item.scaleX = 2;
				item.scaleY = 2;
				item.image = image;
				this.addChild( item );
				
				var itemDescription = new Label(game.items[i].price +"<br />"+ game.items[i].description);
				itemDescription.x = itemLocationX -8;
				itemDescription.y = itemLocationY +40;
				itemDescription.color = '#fff';
				this.addChild( itemDescription );
				
				if (i=== this.itemSelected){
					var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
					this.itemSelector = new Sprite(game.spriteWidth*2,game.spriteHeight*2);
					this.itemSelector.image = image;
					image.draw(game.assets[ RES_CHARACHTERS ], 0, 0, 96, 128, 0, 0, 96, 128);
					itemLocationX = 20+70*i;
					itemLocationY = 150;
					this.itemSelector.scaleX = 2;
					this.itemSelector.scaleY = 2;
					this.itemSelector.x = itemLocationX;
					this.itemSelector.y = itemLocationY;
					this.itemSelector.frame = 2;
					this.addChild( this.itemSelector );
				}
			}
		};
				
//		shop.addEventListener( enchant.Event.LEFT_BUTTON_UP , function(){
//			console.log('l up');
//			shop.itemSelected = shop.itemSelected + game.items.length -1;
//			shop.itemSelected = shop.itemSelected % game.items.length;
//			shop.itemSelector.x = 20 +70*shop.itemSelected;
//			shop.message.text = shop.greeting;
//		});
//		shop.addEventListener(enchant.Event.RIGHT_BUTTON_UP, function(){
//			console.log('r up');
//			shop.itemSelected = (shop.itemSelected +1) % game.items.length;
//			console.log(shop.itemSelected);
//			shop.itemSelector.x = 20 +70*shop.itemSelected;
//			shop.message.text = shop.greeting;
//		});
//		shop.on(enchant.Event.LEFT_BUTTON_DOWN, function(){
//			console.log('l down');
//		});
//		shop.on(enchant.Event.RIGHT_BUTTON_DOWN, function(){
//			console.log('r down');
//		});
//		shop.on(enchant.Event.TOUCH_END, function(e){
//			console.log('T end');
//			console.log(e);
//		});
		
		shop.on(enchant.Event.ENTER, function(){
			shoppingFunds.text = shop.shoppingFunds();
		});
		
		shop.on(enchant.Event.ENTER_FRAME, function(e){
			setTimeout(function(){
				if (game.input.a){
					shop.attemptToBuy();
				} else if (game.input.down){
					shop.message.text = shop.farewell;
					setTimeout(function(){
						game.popScene();
						shop.message.text = shop.greeting;
					},1000);
				} 
				/**/
				else if (game.input.left){
					shop.itemSelected = shop.itemSelected + game.items.length -1;
					shop.itemSelected = shop.itemSelected % game.items.length;
					shop.itemSelector.x = 20 +70*shop.itemSelected;
					shop.message.text = shop.greeting;
				} else if (game.input.right){
					shop.itemSelected = (shop.itemSelected +1) % game.items.length;
					shop.itemSelector.x = 20 +70*shop.itemSelected;
					shop.message.text = shop.greeting;
				}
				/**/
			}, 500);
			player.showInventory(100);
			shoppingFunds.text = shop.shoppingFunds();
		});
		
		shop.attemptToBuy = function(){
			var itemPrice = game.items[this.itemSelected].price;
			if (player.gp < itemPrice){
				this.message.text = this.apology;
			} else {
				player.visibleItems = [];
				player.gp = player.gp - itemPrice;
				player.inventory.push( game.items[this.itemSelected].id );
				this.message.text = this.sale;
			}
		};
		
		shop.greeting = "Ciao! Benvenuto, posso venderti qualcosa?";
		shop.apology = "Mmm... mi spiace, non hai abbastanza soldi per questo";
		shop.sale = "Ecco a te!";
		shop.farewell = "Torna presto!";
		shop.message = new Label(shop.greeting);
		shop.drawManeki();
		
		var shoppingFunds = new Label( shop.shoppingFunds() );
		shoppingFunds.color = '#fff';
		shoppingFunds.y = 200;
		shoppingFunds.x = 10;
		shop.addChild( shoppingFunds );
		shop.drawItemsForSale();
		shopScene.backgroundColor = '#000';
		shopScene.addChild(shop);
		
		var shopPad = new enchant.ui.Pad();
		shopPad.moveTo(0,220);
		shopScene.addChild(shopPad);
		
		var shopButtonB = new enchant.ui.Button('B','light');
		shopButtonB.moveTo(250,280);
		shopScene.addChild(shopButtonB);
		
		var shopButtonA = new enchant.ui.Button('A','blue');
		shopButtonA.moveTo(270,245);
		shopButtonA.ontouchstart = function(){
			shop.attemptToBuy();
		};
		shopScene.addChild(shopButtonA);
	};
	setShop();
	
    var shop = {
    		action: function(){    			
    			game.pushScene(shopScene);
    		}
    };
    
    var spriteRoles = { //[460,480,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		get : function(i){
	    	if (i===480){
	    	  return info;
	    	} else if (i===420){
	    		return shop;
	    	}
	    	return null;
		}
    };
    
    var ss = new StageScene(game,player,map,foregroundMap,spriteRoles,shopScene);
  	var stageScene = ss.class();
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
