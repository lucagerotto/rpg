var Player = (function(game,map){
  return {
	  class: Class.create(Sprite, {
	  initialize: function() {
	  	Sprite.apply(this,[32, 32]);
	  	
	    var image = new Surface(96, 128);
	    image.draw(game.assets[ RES_CHARACHTERS ], 0, 0, 96, 128, 0, 0, 96, 128);
	
	  	this.image = image;
	  	this.framesPerDirection = 3;
	
	  	this.spriteOffset = 0 * this.framesPerDirection;
	  	this.startingX = 6;
	  	this.startingY = 10;
	  	this.velocity = 4;
	  	this.x = this.startingX * game.spriteWidth;
	  	this.y = this.startingY * game.spriteHeight;
	  	//this.direction = 0;
	  	//this.walk = 0;
	  	//this.frame = this.spriteOffset + this.direction;
	  	//this.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
	  	//this.image.draw(game.assets["img/chara0.gif"]);
	  	this.isMoving = false;
	  	this.direction = 0;
	  	this.walk = 1;  	
	  	
	  	this.name = "Luca";
	  	this.characterClass = "Mage";
	  	this.exp = 0;
	  	this.level = 1;
	  	this.gp = 100;
	  	this.inventory = [];
	  	this.visibleItems =[];
	  	this.itemSurface = new Surface(game.itemSpriteSheetWidth, game.spriteSheetHeight);
	
	  	this.levelStats = [
	  	  {},
	  	  { attack: 4, maxHp: 10, maxMp : 0, expMax: 10 },
	  	  { attack: 6, maxHp: 14, maxMp : 0, expMax: 30 },
	  	  { attack: 7, maxHp: 20, maxMp : 5, expMax: 50 }
	  	];
	  	this.hp = this.levelStats[this.level].maxHp;
	  	this.mp = this.levelStats[this.level].maxMp;
	  	this.addStatusLabel();
	  	this.addEventListener( Event.ENTER_FRAME , this.move );
	  },
	
	  attack : function(){
		  return this.levelStats[this.level].attack;
	  },
	
	  move : function() {
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
	  },
	
	  addStatusLabel : function(){
		this.statusLabel = new Label("");
		this.statusLabel.width = game.width;
		this.statusLabel.y = 0;
		this.statusLabel.x = 0;
		this.statusLabel.color = '#fff';
		this.statusLabel.backgroundColor = '#000';
	  },
	
	  displayStatus : function(){
	    this.statusLabel.text = "-- "+ this.name +" the "+ this.characterClass
		  	+ "<br />-- HP: "+ this.hp +"/"+ this.levelStats[this.level].maxHp
		  	+ "<br />-- MP: "+ this.mp +"/"+ this.levelStats[this.level].maxMp
		  	+ "<br />-- Exp: "+ this.exp// +"/"+ this.levelStats[this.level].maxMp
		  	+ "<br />-- Level: "+ this.level
		  	+ "<br />-- GP: "+ this.gp
		  	+ "<br /><br />-- Inventory: ";
	  	this.statusLabel.height = 170;
	  	this.showInventory(0);
	  	game.currentScene.addChild(this.statusLabel);
	  },
	
	  clearStatus : function(){
	    this.statusLabel.text = "";
		this.statusLabel.height = 0;
		this.hideInventory();
	  },
	
	  showInventory : function(yOffset){
	  	if (this.visibleItems.length === 0){
	  	  this.itemSurface.draw(game.assets[ RES_ITEMS ]);
	  	  for(var i = 0; i< this.inventory.length; i++){
	  	    var item = new Sprite(game.spriteWidth, game.spriteHeight);
	  	    item.x = 20 +70 *i;
	  	    item.frame = this.inventory[i];
	  	    item.scaleX = 2;
	  	    item.scaleY = 2;
	  	    item.image = this.itemSurface;
	  	    this.visibleItems.push(item);
	  	    game.currentScene.addChild(item);
	  	  }
	  	}
	  },
	
	  hideInventory : function(){
	  	for(var i =0;i<this.visibleItems; i++){
	  	  this.visibleItems[i].remove();
	  	}
	  	this.visibleItems = [];
	  },
	
	  square : function(){
	  	var playerSquare = {
	  	  x: Math.floor(this.x/game.spriteWidth)+1,
	  	  y: Math.floor(this.y/game.spriteHeight)+1
	  	};
	  	//console.log(playerSquare);
	  	return playerSquare;
	  },
	
	  facingSquare : function(){
		  var facingSquare = {x:null,y:null};
		  this.playerSquare = this.square();
		    if (this.direction === DIRECTION_DOWN){
		    	facingSquare = { x: this.playerSquare.x  , y: this.playerSquare.y+1 };
		    } else if (this.direction === DIRECTION_RIGHT){
		    	facingSquare = { x: this.playerSquare.x+1, y: this.playerSquare.y   };
		    } else if (this.direction === DIRECTION_UP){
		    	facingSquare = { x: this.playerSquare.x  , y: this.playerSquare.y-1 };
		    } else if (this.direction === DIRECTION_LEFT){
		    	facingSquare = { x: this.playerSquare.x-1, y: this.playerSquare.y   };
		    }
		
		    if ((facingSquare.x <0 || facingSquare.x >= map.width/game.spriteWidth) ||
			  (facingSquare.y <0 || facingSquare.y >= map.height/game.spriteHeight) ){
		    	return null;
		    } else {
		    	return facingSquare;
		    }
	  },
	
	  facing : function(){
		var facingSquare = this.facingSquare();
		if (!facingSquare){
			return null;
		} else {
			return foregroundData[0][facingSquare.y][facingSquare.x];
		}
	  }
	})
  };
  
});
