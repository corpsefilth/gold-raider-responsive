// bootState

/***************************************** 
*  does 3 things
*  1. Load the 'progressBar' image
*  2. Set some game settings: background color and Arcade Physics
*  3. Start the Load state
*****************************************/

var bootState = {
	preload: function () {
		// Load the image
		game.load.image('progressBar', 'assets/progressBar.png');
	},
	
	create: function() {
		// Set some game settings
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		/*********************[ Scaling ]*******************/
		// If the device is not a desktop, so it's a mobile device
		if (!game.device.desktop) {
			// Set the type of scaling to 'show all'
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			
			// Add a blue color to the page, to hide the white borders we might have
			document.body.style.backgroundColor = '#3498db';
			
			// Set the min and ma width/height of the game
			game.scale.minWidth = 250;
			game.scale.minHeight = 170;
			game.scale.maxWidth = 1000;
			game.scale.maxHeight = 680;
			
			// Center the game on the screen
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			
			// Apply the scale changes
			game.scale.setScreenSize(true);
		} else {
			game.scale.pageAlignHorizontally = true;
		}
		
		// Start the load state
		game.state.start('load');
	}
	
	// update function not needed
}

