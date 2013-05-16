	// shorthand for document.getElementById
	var $ = function (s) { return document.getElementById(s); };
	
	function onDeviceReady() {
		var appContainer = document.getElementById("app");
		var APPHEIGHT = screen.height;
		var APPWIDTH = screen.width;
		appContainer.style.height = APPHEIGHT + "px";
		appContainer.style.backgroundSize = APPWIDTH + "px " + APPHEIGHT +"px";
		
		
		// enable shooting (experimental)
		var shoot = false;
		appContainer.addEventListener('click', function(e) {
			e.preventDefault();
			//shoot = true;
			return false;
		}, false);
		
		
		// start watching accelerometer changes
		// be sure device is ready!
		startWatchAccelerometer();
		

	
		/* select day or night
		$('lnkDay').addEventListener('click',  function(evt) {
			sprBackgroundNight.setOpacity(0);
			sprStars.setOpacity(0);
			sprClouds.setOpacity(1);
			sprBackgroundDay.setOpacity(1);
			sprBackgroundDay.update();
			sprBackgroundNight.update();
			sprStars.update();
			sprClouds.update();
			this.className = "active";
			$('lnkNight').className = "";
		}, false);
		$('lnkNight').addEventListener('click',  function(evt) {
			sprBackgroundNight.setOpacity(1);
			sprStars.setOpacity(1);
			sprClouds.setOpacity(0);
			sprBackgroundDay.setOpacity(0);
			sprBackgroundDay.update();
			sprBackgroundNight.update();
			sprStars.update();
			sprClouds.update();
			this.className = "active";
			$('lnkDay').className = "";
		}, false);
		*/

	
		// sizes
		var scene_w = APPWIDTH; // 480
		var scene_h = APPHEIGHT; // 720
		var heli_w = 125;
		var heli_h = 66;
		var man_w = 25;
		var man_h = 50;
		var bomb_w = 12;
		var bomb_h = 18;
		var ground_h = 106;
	
		// animation parameters
		var heli_speed = 0.7;
		var man_direction = 1; 
		var man_speed = 1.5;
		var man_alive = true;
	
		// layers
		var background, foreground; //, results;
		// sprites
		var sprBackgroundDay, sprBackgroundNight, sprGround, sprMan, sprHelicopter, sprStars, sprClouds;
		// cycles
		var mancycle, helicycle;
		// input
		var input;
		// shoot
		var shoot;
		// ticker
		var ticker;
		// scene
		var scene;
	
		// create scene
		scene = sjs.Scene({ w: scene_w, h: scene_h, parent: $('app')});
	
		// preload images
		scene.loadImages([
			'img/bg_day.png',
			'img/bg_night.png',
			'img/bomb.png',
			'img/btn_play.png',
			'img/clouds.png',
			'img/spr_helicopter.png',
			'img/spr_man.png',
			'img/ground.png',
			'img/stars.png',
			'img/youlose.png',
			'img/youwin.png'
		], function() {
			// simulate loading time with setTimeout
			setTimeout(function() {
				// create background layer
				background = scene.Layer('background');
				sprBackgroundDay = scene.Sprite('img/bg_day.png', { layer: background, backgroundRepeat: 'repeat-x', color: '#a6e7f7', size:[APPWIDTH, APPHEIGHT] });
				sprBackgroundNight = scene.Sprite('img/bg_night.png', { layer: background, backgroundRepeat: 'repeat-x', color: '#002027', size:[APPWIDTH, APPHEIGHT], opacity: 0 });
				sprGround = scene.Sprite('img/ground.png', { layer: background, y: scene_h - ground_h, size:[APPWIDTH, ground_h]});
				sprStars = scene.Sprite('img/stars.png', { layer: background, y: 50, x: (APPWIDTH - 150)/2, opacity: 0 });
				sprClouds = scene.Sprite('img/clouds.png', { layer: background, y: 20, x: (APPWIDTH - 300)/2 });
				
				// create results layer
				//results = scene.Layer('results');
				//sprWin = scene.Sprite('img/youwin.png', { layer: results, x: APPWIDTH/2 - 200 y: APPHEIGHT/2, opacity: 0});
				//sprLose = scene.Sprite('img/youlose.png', { layer: results, x: APPWIDTH/2 - 200 y: APPHEIGHT/2, opacity: 0});
							
				sprBackgroundDay.update();
				sprBackgroundNight.update();
				sprGround.update();
				sprStars.update();
				sprClouds.update();
				//sprWin.update();
				//sprLose.update();
	
				// create foreground layer
				foreground = scene.Layer('foreground');
	
				// create bomb and put offscreen
				sprBomb = scene.Sprite('img/bomb.png', { layer: foreground, x: -100 });
				sprBomb.yspeed = 0;
				sprBomb.gravity = 0.2;
	
				// create helicopter 
				sprHelicopter = scene.Sprite('img/spr_helicopter.png', { layer: foreground, w: heli_w, h: heli_h, x: (scene_w - heli_w) / 2, y: 100 });
	
				// create helicopter animation
				helicycle = scene.Cycle([
					[0, 0, 7], // sprite image 1
					[heli_w, 0, 7]  // sprite image 2
				]);
				helicycle.addSprite(sprHelicopter);
	
				// create man 
				sprMan = scene.Sprite('img/spr_man.png', { layer: foreground, w: man_w, h: man_h, y: scene_h - ground_h - man_h});
				sprMan.scale(-1, 1);
	
				// create man animation
				mancycle = scene.Cycle([
					[3, 5, 1],
					[33, 5, 1],
					[63, 5, 2],
					[93, 5, 2],
					[123, 5, 2],
					[153, 5, 2],
					[183, 5, 2]
				]);
				mancycle.addSprite(sprMan);
				
	
	
				// create input
			    input = scene.Input();
	
				// start game
				function paint(ticker) {
					// animate sprites
					helicycle.next(ticker.lastTicksElapsed);
					mancycle.next(ticker.lastTicksElapsed);
					
					if (input.keyboard.space) {
						shoot = true;
					}
					// move helicopter
					sprHelicopter.setX(sprHelicopter.x + (-accelerationObject.x * heli_speed));
					sprHelicopter.setY(sprHelicopter.y + (accelerationObject.y * heli_speed));

					if (accelerationObject.x > 1) {
						sprHelicopter.setAngle(-0.1);
					} else if (accelerationObject.x < -1){
						sprHelicopter.setAngle(0.1);
					} else sprHelicopter.setAngle(0);
					sprHelicopter.update();
					
					// move bomb 
					if (sprBomb.x == -100) {
						if (shoot) {
							sprBomb.setX(sprHelicopter.x + heli_w / 2);
							sprBomb.setY(sprHelicopter.y + heli_h + bomb_h / 2);
							shoot = false;
						}	
					} else {
						sprBomb.setY(sprBomb.y + sprBomb.yspeed);
						sprBomb.yspeed += sprBomb.gravity; 
					}
					if (sprBomb.collidesWith(sprGround)) {
						if (sprBomb.collidesWith(sprMan)) {
							sprMan.remove();
							man_alive = false;
							//sprWin.setOpa
							//console.log('gewonnen!');
						} else {
							//console.log('verloren!');
						}
						sprBomb.setX(-100);
						sprBomb.yspeed = 0;
					}
					sprBomb.update();
	
	
					
					// move man
					if (man_alive) {
						sprMan.setX(sprMan.x + man_direction * man_speed);
						if (sprMan.x >= scene_w - man_w) {
							man_direction = -1;
							sprMan.scale(1, 1);
						}
						if (sprMan.x <= 0) {
							man_direction = 1;
							sprMan.scale(-1, 1);
						}
						sprMan.update();
					}
					
				}
	
				// create game ticker
				ticker = scene.Ticker(paint, {tickDuration: 30});
			    ticker.run();
	
			}, 1000)
		});
	}
	
	
	document.addEventListener('deviceready', onDeviceReady, false);

	
