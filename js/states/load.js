// loadState

/*************************
* loads all assets plus loading bar
**************************/

var loadState = {
	
	preload: function() {
		// Add a 'loading...' label on the screen
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
		{ font: '30px Geo', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);
		
		// Display the progress bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);
		
		// Load all our assets
		// game.load.image('player', 'assets/player.png');
		
		// same as image but requires with and height of each frame.
		game.load.spritesheet('player', 'assets/player2.png', 20, 20);
		
		game.load.spritesheet('mute', 'assets/muteButton.png',28, 22);
		game.load.image('enemy', 'assets/enemy.png');
		game.load.image('coin', 'assets/coin.png');
		
		//game.load.image('tileset', 'assets/tileset.png');
		//game.load.tilemap('map', 'assets/myMap.json', null, Phaser.Tilemap.TILED_JSON);
		
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH', 'assets/wallHorizontal.png');
		
		game.load.image('jumpButton', 'assets/jumpButton.png');
		game.load.image('rightButton', 'assets/rightButton.png');
		game.load.image('leftButton', 'assets/leftButton.png');
		
		game.load.image('pixel', 'assets/pixel.png');
		
		// Sound when the player jumps
		game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
		
		// Sound when the player takes a coin
		game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
		
		// Sound when the player dies
		game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
		
		// Background Music
		game.load.audio('bgmusic', ['assets/bgm_action_4.ogg', 'assets/bgm_action_4.mp3']);
		
		// Load new assets that we will use in the menu state
		game.load.image('background', 'assets/background.png');
	},
	
	create: function() {
		// Go to the menu state
		game.state.start('menu');
	}
	
}