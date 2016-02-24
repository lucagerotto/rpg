var StageScene = (function(game,player,map,foregroundMap,spriteRoles){
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
		    	setTimeout(function(){
				var pad = new enchant.ui.Pad();
		    	pad.moveTo(0,220);
		    	game.currentScene.addChild(pad);
			
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
	};

});
