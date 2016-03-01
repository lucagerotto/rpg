var StageScene = (function(game,player,map,foregroundMap,spriteRoles,shopScene){
	return {
		class: Class.create(Group, {
			initialize: function() {
				Group.apply(this);
				this.addChild( map );
				this.addChild( player );
				this.addChild( foregroundMap );	
				this.addControls();		
				game.currentScene.addChild( this );//game.pushScene(stageScene);
				var self = this;
				game.currentScene.addEventListener( Event.ENTER_FRAME , function(e){ self.focusViewport(e); });
			},
		
		    addControls : function(){
		    	var self = this;
		    	setTimeout(function(){
					var pad = new enchant.ui.Pad();
			    	pad.moveTo(0,220);
			    	game.rootScene.addChild(pad);//currentScene.addChild(pad);
				
					var buttonA = new enchant.ui.Button('A','blue');
					buttonA.moveTo(270,245);
					game.currentScene.addChild(buttonA);
				
					var buttonB = new enchant.ui.Button('B','light');
					buttonB.moveTo(250,280);
					game.currentScene.addChild(buttonB);
				
					buttonA.ontouchstart = function(){
						var playerFacing = player.facing();
						//console.log(playerFacing);
						if (!playerFacing || !spriteRoles.get(playerFacing)){
						  player.displayStatus();
						} else {
						  spriteRoles.get(playerFacing).action();
						}
					};
		    	},300);
		    },
		
			focusViewport : function() {
			  	var x = Math.min((game.width  - game.spriteWidth) / 2 - player.x, 0);
			  	var y = Math.min((game.height - game.spriteHeight) / 2 - player.y, 0);
			  	x = Math.max(game.width,  x + map.width)  - map.width;
			  	y = Math.max(game.height, y + map.height) - map.height;
			  	this.x = x;
			  	this.y = y;
			}
		    
		})
		
		/*
		, shop: function(){
			var shop = new Group();
			shop.itemSelected = 0;
			
			shop.shoppingFunds = function(){
				return "Gold: "+ player.gp;
			};
			
			shop.drawManeki = function(){
				var image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
				var maneki = new Sprite(game.spriteWidth, game,spriteHeight);
				maneki.image = image;
				image.draw(game.assets[RES_CHARACTERS]);
				maneki.frame = 14;
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
					item.draw(game.assets[RES_ITEMS]);
					itemLocationX = 30+70*i;
					itemLocationY = 70;
					item.y = itemLocationY;
					item.x = itemLocationX;
					item.frame = i+12;
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
						this.itemSelector = new Sprite(game.spriteWidth,game.spriteHeight);
						item.draw(game.assets[RES_CHARACTERS]);
						itemLocationX = 30+70*i;
						itemLocationY = 160;
						this.itemSelector.scaleX = 2;
						this.itemSelector.scaleY = 2;
						this.itemSelector.x = itemLocationX;
						this.itemSelector.y = itemLocationY;
						this.itemSelector.frame = 11;
						this.itemSelector.image = image;
						this.addChild( this.itemSelector );
					}
				}
			};
			
			shop.on(Event.ENTER, function(){
				shoppingFunds.text = shop.shoppingFunds();
			});
			
			shop.on(Event.ENTER_FRAME, function(){
				setTimeout(function(){
					if (game.input.a){
						shop.attemptToBuy();
					} else if (game.input.down){
						shop.message.text = shop.farewell;
						setTimeout(function(){
							game.popScene();
							shop.message.text = shop.greeting;
						},1000);
					} else if (game.input.left){
						shop.itemSelected = shop.itemSelected + game.items.length -1;
						shop.itemSelected = shop.itemSelected % game.items.length;
						shop.itemSelector.x = 30 +70*shop.itemSelected;
						shop.message.text = shop.greeting;
					} else if (game.input.right){
						shop.itemSelected = (shop.itemSelected +1) % game.items.length;
						hop.itemSelector.x = 30 +70*shop.itemSelected;
						shop.message.text = shop.greeting;
					} 
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
			shop.drawItemForSale();
			shopScene.backgroundColor = '#000';
			shopScene.addChild(shop);
			
			var shopPad = new enchant.ui.Pad();
			shopPad.moveTo(0,380);
			shopScene.addChild(shopPad);
			
			var shopButtonB = new enchant.ui.Button('B','light');
			shopButtonB.moveTo(180,450);
			shopScene.addChild(shopButtonB);
			
			var shopButtonA = new enchant.ui.Button('A','blue');
			shopButtonA.moveTo(230,410);
			shopButtonA.ontouchstart = function(){
				shpo.attemptToBuy();
			};
			shopScene.addChild(shopButtonA);
		}
		*/
	};

});
