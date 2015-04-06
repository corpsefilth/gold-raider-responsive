// menu State

/************
* Menu screen
*************/

var menuState = {  
	
	create: function() {
		// Add a background image
		game.add.tileSprite(0, 0, game.width, game.height, 'background');
		
		/****************************************
		*	game.add.button(x, y, name, callback, callbackContext)
		*		x: position x of the button
		*		y: position y of the button
		*		name: the name of the image to display
		*		callback: the function called when the button is clicked
		*		callbackContext: the context in which the 'callback' will be called, usually 'this'
		*******************************************************/
		// Add the mute button that calls the 'toggleSound' function when pressed
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
		
		// If the game is already muted
		if (game.sound.mute) {
			// Change the frame to display the speaker with no sound
			this.muteButton.frame = 1;
		}
		
		// If the mouse is over the button, it becomes a hand cursor
		this.muteButton.input.useHandCursor = true;
		
		// Display the name of the game
		var nameLabel = game.add.text(game.world.centerX, -50, 'Gold Raider', 
			{ font: '50px Geo', fill: '#ffffff' });
		nameLabel.anchor.setTo(0.5, 0.5);
		
		game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
		
		// If 'bestScore' is not defined
		// It means that this is the first time the game is played
		if ( !localStorage.getItem('bestScore')) {
			// Then set the best score to 0
			localStorage.setItem('bestScore', 0);
		}
		
		// If the score is higher than the best score
		if (game.global.score > localStorage.getItem('bestScore')) {
			// then update the best score
			localStorage.setItem('bestScore', game.global.score);
		}
		
		// Show the score at the center of the screen
		var text = 'score: ' + game.global.score + '\nbest score: ' +
			localStorage.getItem('bestScore');
		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text,
			{ font: '25px Arial', fill: '#ffffff', align: 'center' });
		scoreLabel.anchor.setTo(0.5, 0.5);
		
		// Explain how to start the game
		// Store the relevant text based on device used
		if (game.device.desktop) {
			var text = 'press the up arrow key to start';
		}
		else {
			var text = 'touch the screen to start';
		}
		
		var startLabel = game.add.text(game.world.centerX, game.world.height-80, text,
			{ font: '25px Geo', fill: '#ffffff' });
		startLabel.anchor.setTo(0.5, 0.5);
		
		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();
		
		// Create a new Phaser Keyboard variable: the up arrow key'
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		
		// When the 'upKey' is pressed, it will call the 'start' function once
		upKey.onDown.addOnce(this.start, this);
		
		// touch event 
		game.input.onDown.addOnce(this.start, this);
	},
	
	// Function called when the 'muteButton' is pressed
	toggleSound: function() {
		// Switch the Phaser sound variable from true to false, or false to true
		// When 'game.sound.mute = true', Phaser will mute the game
		game.sound.mute = ! game.sound.mute;
		
		// Change the frame of the button
		this.muteButton.frame = game.sound.mute ? 1 : 0;
		
		// above line is equivalent to code below
		/**********************************
		*	if (game.sound.mute) {
		*		this.muteButton.frame = 1;
		*	}
		*	else {
		*		this.muteButton.frame = 0;
		*	}
		***********************************/
	},
	
	start: function() {
		// Start the actual game
		game.state.start('play');
	},
}