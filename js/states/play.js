// play State

/*******************
* main game state
*********************/
		

var playState = {
	
	// No preload function needed, loaded items in our load.js file 
	
	create: function() {
		
		// add some controls to the game
		this.cursor = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, 
			Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D)
		}
		
		if (!game.device.desktop) {
			this.addMobileInputs();
		}
		
		this.bgmusic = game.add.audio('bgmusic'); // Add the music
		this.bgmusic.loop = true; // Make it loop
		this.bgmusic.play(); // start the music
		
		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');
		
		// player
		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		
		// set the anchor of the sprite at the middle of the sprite
		this.player.anchor.setTo(0.5, 0.5);
		
		/**************************
		*	animations.add(name, frames, frameRate, loop)
		*		name: name of the animation
		*		frames: an array of numbers that correspond to the frames to add and in which order
		*		frameRate: the speed at which the animation should play, in frames per second
		*		loop: if set to true, the animation will loop indefinitely
		**********************************************************************/
		// Create the 'right' animation by looping the frames 1 and 2
		this.player.animations.add('right', [1, 2,], 8, true);
		
		// Create the 'left' animation by looping the frames 3 and 4
		this.player.animations.add('left', [3, 4], 8, true);
		
		// Tell Phaser that the player will use the Arcade Physics engine
		game.physics.arcade.enable(this.player);
		
		// Add vertical gravity to the player
		this.player.body.gravity.y = 500;
		
		// Create an enemy group with Arcade physics
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		
		// Create 10 enemies with the 'enemy' image in the group
		// The enemies are "dead" by default, so they are not visible in the game
		this.enemies.createMultiple(10, 'enemy');
		
		
		// Display the coin
		this.coin = game.add.sprite(60, 140, 'coin');
		
		// Add Arcade physics to the coin
		game.physics.arcade.enable(this.coin);
		
		// Set the anchor point of the coin to its center
		this.coin.anchor.setTo(0.5, 0.5);
		
		// Display the score
		this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
		
		// Initialize the global score variable
		game.global.score = 0;
		
		/********************************************************
		*	game.add.emitter(x, y, maxParticles)
		*		x: the x position of the emitter
		*		y: the y position of the emitter
		*		maxParticles: the total number of particles in the emitter
		**************************************************/
		// Create the emitter with 15 particles We don't need to set the x and y
		// Since we don't know where to do the explosion yet
		this.emitter = game.add.emitter(0, 0, 15);
		
		// Set the 'pixel' image for the particles
		this.emitter.makeParticles('pixel');
		
		// Set the y speed of the particles between -150 and 150
		// The speed will be randomly picked between -150 and 150 for each particle
		this.emitter.setYSpeed(-150, 150);
		
		// Do the same for the X speed
		this.emitter.setXSpeed(-150, 150);
		
		// Use no gravity for the particles
		this.emitter.gravity = 0;
		
		// set up the walls
		this.createWorld();
		
		// Call 'addEnemy' every 2.2 seconds
		// game.time.events.loop(2200, this.addEnemy, this);
		
		// Contains the time of the next enemy creation
		this.nextEnemy = 0;
	},
	
	update: function() {
		// This function is called 60 times per second
		// It contains the game's logic
		
		// Tell Phaser that the player and the walls should collide
		game.physics.arcade.collide(this.player, this.walls);
		// game.physics.arcade.collide(this.player, this.layer);
		
		// move player
		this.movePlayer();
		
		// check if player died
		if (!this.player.inWorld) {
			this.playerDie();
		}
		
		// If the 'nextEnemy' time has passed
		if ( this.nextEnemy < game.time.now ) {
			// Define our variables
			var start = 4000, end = 1000, score = 100;
			
			// Formula to decrease the delay between enemies over time
			// At first it's 4000ms, the slowly goes to 1000ms
			var delay = Math.max(start - ( start - end ) * game.global.score/score, end)
			
			// Create a new enemy, and update the 'nextEnemy' time 
			this.addEnemy();
			this.nextEnemy = game.time.now + delay;
		}
		
		/******************************
		*	game.physics.arcade.overlap(objectA, objectB, callback,
		*								processCallback, callbackContext)
		*	objectA: the first object to check
		*	objectB: the second object to check
		*	callback: the function that gets called when the 2 objects overlap
		*	processCallback: if this is set then 'callback' will only be called if ‘processCallback’
		*		returns true
		*	callbackContext: the context in which to run the 'callback', most of the time it will
		*		be 'this'
		******************************************************************/
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		
		// Make the enemies and walls collide
		game.physics.arcade.collide(this.enemies, this.walls);
		// game.physics.arcade.collide(this.enemies, this.layer);
		
		// Call the 'playerDie' function when the player and an enemy overlap
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
	},
	
	// Here we add some of our own functions
	
	// move player 
	movePlayer: function() {
		// if the left arrow key is pressed
		if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
			// Move player to the left
			this.player.body.velocity.x = -200;
			this.player.animations.play('left'); // Start the left animation
		}
		
		// if the right arrow is pressed
		else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
			// Move the player to the right
			this.player.body.velocity.x = 200;
			this.player.animations.play('right'); // Start the right animation
		}
		
		// if neither the right or left key is pressed
		else {
			// Stop the player
			this.player.body.velocity.x = 0;
			this.player.animations.stop(); // Stop the animation
			this.player.frame = 0; // Set the player frame to 0 (stand still)
		}
		
		// if the up arrow key is pressed and the player is touching the ground
		/*
		if ((this.cursor.up.isDown || this.wasd.up.isDown)
			&& this.player.body.onFloor()) {
			// Move the player upward (jump)
			this.player.body.velocity.y = -320;
			this.jumpSound.play();
		}
		*/
		if (this.cursor.up.isDown || this.wasd.up.isDown) {
			this.jumpPlayer();
		}
	},
	
	// our world walls
	/****** hard-coded walls ***********************/
	
	createWorld: function() {
		// Create our wall group with Arcade Physics
		this.walls = game.add.group();
		this.walls.enableBody = true;
		
		// divide game screen into 3 parts, used for wall length and positioning
		var mlength = game.width/3;
		console.log(mlength);
		
		// divide game screen into half, used for wall length
		var hlength = game.width/2;
		console.log(hlength);
		
		// divide game screen into half, used for positioning
		var mheight = game.height/2;
		console.log(mheight);
		
		// divide screen height into 4 values used for positioning
		var cusYpos = game.height/4;
	    console.log(cusYpos);
		
		// Create the 10 walls
		var leftWall = game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
		leftWall.height = game.height;
		var rightWall = game.add.sprite(game.width - 20, 0, 'wallV', 0, this.walls); // Right
		rightWall.height = game.height;
		
		var topLeftWall = game.add.sprite(20, 0, 'wallH', 0, this.walls); // Top left
		//topLeftWall.scale.setTo(4.2, 1);
		topLeftWall.width = hlength - 100;
		
		var topRightWall = game.add.sprite(game.width - topLeftWall.width - 20, 0, 'wallH', 0, this.walls); // Top right
		//topRightWall.scale.setTo(4.2, 1);
		topRightWall.width = hlength - 100;
		
		var bottomLeftWall = game.add.sprite(20, game.height - 20, 'wallH', 0, this.walls); // Bottom left
		//bottomLeftWall.scale.setTo(4.2, 1);
		bottomLeftWall.width = hlength - 100;
		
		var bottomRightWall = game.add.sprite(game.width - bottomLeftWall.width - 20, game.height - 20, 'wallH', 0, this.walls); // Bottom right
		//bottomRightWall.scale.setTo(4.2, 1);
		bottomRightWall.width = hlength - 100;
		
		var middleLeftWall = game.add.sprite(20, mheight, 'wallH', 0, this.walls); // Middle left 160
		middleLeftWall.width = mlength;
		var middleRightWall = game.add.sprite(game.width - middleLeftWall.width - 20, mheight, 'wallH', 0, this.walls); // Middle right 400, 160
		middleRightWall.width = mlength;
		
		var middleTop = game.add.sprite(mlength, cusYpos, 'wallH', 0, this.walls); // middle top wall 100, 80,
		//middleTop.scale.setTo(1.5, 1);
		middleTop.width = mlength;
		var middleBottom = game.add.sprite(mlength, cusYpos*3, 'wallH', 0, this.walls); // middle bottom wall 100, 240,
		//middleBottom.scale.setTo(1.5, 1);
		middleBottom.width = mlength;
		
		// Set all the walls to be immovable
		this.walls.setAll('body.immovable', true);
	},
	
	/**************************************/
	
	/**************** Using Tilemap **********************/
	/* createWorld: function() {
		// Create the tilemap
		this.map = game.add.tilemap('map');
		
		// Add the tileset to the map
		this.map.addTilesetImage('tileset');
		
		// Create the layer, by specifying the name of the Tiled layer
		this.layer = this.map.createLayer('Tile Layer 1');
		this.layer.width = game.width;
		this.layer.height = game.height;
		
		// Set the world size to match the size of the layer
		//this.layer.resizeWorld();
		
		// Enable collisions for the  first element of our tileset (the blue wall);
		this.map.setCollision(1);
	},	*/
	
	jumpPlayer: function() {
		if (this.player.body.onFloor() || this.player.body.touching.down) {
			var cusYposjump = game.height/3;
			
			this.jumpSound.play();
			this.player.body.velocity.y = -cusYposjump*2 - 40;
		}
	},
	
	// take coin
	takeCoin: function(player, coin) {
		// Kill the coin to make it disappear from the game
		// this.coin.kill();
		
		// scale the coin to 0 to make it invisible
		this.coin.scale.setTo(0, 0);
		
		// Grow the coin back to its original scale in 300ms
		game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
		
		// tween player
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
		
		// Increase the score by 5
		game.global.score += 5;
		
		// Update the score label
		this.scoreLabel.text = 'score: ' + game.global.score;
		
		// play sound
		this.coinSound.play();
		
		// Change the coin position
		this.updateCoinPosition();
	},
	
	// random coin position chooser
	updateCoinPosition: function() {
		// Store all the possible coin positions in an array
		var coinPosition = [
		{x: 140, y: 60}, {x: (game.width - 360), y: 60}, // Top row
		{x: 60, y: 140}, {x: 440, y: 140}, // Middle row
		{x: 130, y: 300}, {x: 370, y: 300} // Bottom row
		];
		
		// Remove the current coin position from the array
		// Otherwise the coin could appear at the same spot twice in a row
		for (var i = 0; i < coinPosition.length; i++) {
			if (coinPosition[i].x === this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}
		
		// Randomly select a position from the array
		var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length-1)];
			
		// Set the new position of the coin
		this.coin.reset(newPosition.x, newPosition.y);
	},
	
	// add enemy
	addEnemy: function() {
		// Get the first dead enemy of the group
		var enemy = this.enemies.getFirstDead();
		
		// If there isn't any dead enemy, do nothing
		if (!enemy) {
			return;
		}
		
		// Initialize the enemy
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.world.centerX, 20);
		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
		enemy.body.bounce.x = 1;
		//enemy.body.bounce.y = 1;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
	},
	
	// restart game when player dies
	playerDie: function() {
		// If the player is already dead, do nothing
		if (!this.player.alive) {
			return;
		}
		
		// Kill the player to make it disappear from the screen
		this.player.kill();
		
		// play sound
		this.deadSound.play();
		// Stop background music
		this.bgmusic.stop();
		
		// Set the position of the emitter on the playerDie
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		
		/****************************************
		*	start(explode, lifespan, frequency, quantity)
		*		explode: whether the particles should all burst out at once (true) or at a given
		*			frequency (false)
		*		lifespan: how long each particle lives once emitted in ms
		*		frequency: if explode is set to false, define the delay between each particles in ms
		*		quantity: how many particles to launch
		***************************************************/
		// Start the emitter, by exploding 15 particles that will live for 600ms
		this.emitter.start(true, 600, null, 15);
		
		// Call the 'startMenu' function in 1000ms
		game.time.events.add(1000, this.startMenu,this);
		// game.state.start('menu');
	},
	
	addMobileInputs: function() {
		// Add the jump button
		this.jumpButton = game.add.sprite(350, 247, 'jumpButton');
		this.jumpButton.inputEnabled = true;
		this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
		this.jumpButton.alpha = 0.5;
		
		// Movement variables
		this.moveLeft = false;
		this.moveRight = false;
		
		// Add the move left button
		this.leftButton = game.add.sprite(50, 247, 'leftButton');
		this.leftButton.inputEnabled = true;
		this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
		this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
		this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
		this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
		this.leftButton.alpha = 0.5;
		
		// Add the move right button
		this.rightButton = game.add.sprite(130, 247, 'rightButton');
		this.rightButton.inputEnabled = true;
		this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
		this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
		this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
		this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
		this.rightButton.alpha = 0.5;
	},
	
	startMenu: function() {
		game.state.start('menu');
	},
	
};