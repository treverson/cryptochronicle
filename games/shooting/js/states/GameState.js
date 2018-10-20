var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {

  //initiate game settings
  init: function(currentLevel) {
    //use all the area, don't distort scale
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //initiate physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //game constants
    this.PLAYER_SPEED = 200;
    this.BULLET_SPEED = -1000;
    
    //level data
    this.numLevels = 3;
    this.currentLevel = currentLevel ? currentLevel : 1;
    console.log('current level:' + this.currentLevel);

  },

  //load the game assets before the game starts
  preload: function() {
    this.load.image('space', 'assets/images/space.png');    
    this.load.image('player', 'assets/images/jiki.png');    
    this.load.image('bullet', 'assets/images/bullet.png');    
    this.load.image('enemyParticle', 'assets/images/enemyParticle.png');    
    // this.load.spritesheet('enemyA', 'assets/images/tekiki.png');
    // this.load.spritesheet('enemyB', 'assets/images/tekiki.png');
    // this.load.spritesheet('enemyC', 'assets/images/tekiki.png');   

    this.load.spritesheet('enemyA', 'assets/images/enemyA.png', 50, 46, 3, 1, 1);       
    this.load.spritesheet('enemyB', 'assets/images/enemyA.png', 50, 46, 3, 1, 1);       
    this.load.spritesheet('enemyC', 'assets/images/enemyA.png', 50, 46, 3, 1, 1);       
    
    //load level data
    this.load.text('level1', 'assets/data/level1.json');
    this.load.text('level2', 'assets/data/level2.json');
    this.load.text('level3', 'assets/data/level3.json');
    
    this.load.audio('bgm', ['assets/audio/shutting.mp3', 'assets/audio/SE/shutting.ogg']);
    this.load.audio('attack', ['assets/audio/SE/attack.mp3', 'assets/audio/SE/attack.ogg']);
    this.load.audio('exp_long', ['assets/audio/SE/bakuhatsu_long.mp3', 'assets/audio/SE/bakuhatsu_long.ogg']);
    this.load.audio('exp_short', ['assets/audio/SE/bakuhatsu_short.mp3', 'assets/audio/SE/bakuhatsu_short.ogg']);
    this.load.audio('bullet', ['assets/audio/SE/tama.mp3', 'assets/audio/SE/tama.ogg']);

  },
  //executed after everything is loaded
  create: function() {
    //moving stars background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');    
    
    this.background.autoScroll(0, 30);
    
    //player
    this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 50, 'player');
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;  
    
    //initiate player bullets and player shooting
    this.initBullets();
    this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/5, this.createPlayerBullet, this);
    
    //initiate the enemies
    this.initEnemies();
    
    //load level
    this.loadLevel();
    
    this.bgm = this.add.audio('bgm',1,true);
    this.bgm.play();
    
    this.attackSound = this.add.audio('attack');
    this.expLongSound = this.add.audio('exp_long');
    this.expShortSound = this.add.audio('exp_short');
    this.bulletSound = this.add.audio('bullet');

    ///////// change volume 

    this.bulletSound.volume = 0.1;
    this.attackSound.volume = 0.5;
  },
  update: function() {
    
    this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);
    
    this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this);
    
    //player is not moving by default
    this.player.body.velocity.x = 0;
    
    //listen to user input
    if(this.game.input.activePointer.isDown) {
      //get the location of the touch
      var targetX = this.game.input.activePointer.position.x;   
      
      //define the direction of the speed
      var direction = targetX >= this.game.world.centerX ? 1 : -1;   
      
      //move the player
      this.player.body.velocity.x = direction * this.PLAYER_SPEED; 
    }
  },
  
  //initiate the player bullets group
  initBullets: function(){
    this.playerBullets = this.add.group();
    this.playerBullets.enableBody = true;
  },
  
  //create or reuse a bullet - pool of objects
  createPlayerBullet: function(){
    var bullet = this.playerBullets.getFirstExists(false);

    this.bulletSound.play();
    
    //only create a bullet if there are no dead ones available to reuse
    if(!bullet) {
      bullet = new SpaceHipster.PlayerBullet(this.game, this.player.x, this.player.top);
      this.playerBullets.add(bullet);
    }
    else {
      //reset position
      bullet.reset(this.player.x, this.player.top);
    }
    
    //set velocity
    bullet.body.velocity.y = this.BULLET_SPEED;
    
  },
  
  initEnemies: function(){
  
    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    
    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
    
  },
  
  damageEnemy: function(bullet, enemy) {
    this.attackSound.play();
    enemy.damage(1);    
    bullet.kill();
  },
  
  killPlayer: function() {
    this.expLongSound.play();
    this.game.time.events.remove(this.shootingTimer);
    this.explode()
    this.player.kill();
    this.bgm.stop();
    this.game.time.events.add(2000, function() {this.game.state.start('GameState');}, this);
  },

  explode: function(){
  var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('enemyParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 500, null, 100);
  },

  createEnemy: function(x, y, health, key, scale, speedX, speedY){
  
    var enemy = this.enemies.getFirstExists(false);
    
    if(!enemy){
      enemy = new SpaceHipster.Enemy(this.game, x, y, key, health, this.enemyBullets);
      this.enemies.add(enemy);
    }
    
    enemy.reset(x, y, health, key, scale, speedX, speedY);
  },
  
  loadLevel: function(){
    
    this.currentEnemyIndex = 0;
    
    this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));
    
    //end of the level timer
    this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000, function(){
      console.log('level ended!');
      
      this.bgm.stop();
      
      if(this.currentLevel < this.numLevels) {
        this.currentLevel++;
      }
      else {
        this.currentLevel = 1;
      }
      
      this.game.state.start('GameState', true, false, this.currentLevel);
      
    }, this);
    
    
    this.scheduleNextEnemy();
    
  },
  
  scheduleNextEnemy: function() {
    var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
    
    if(nextEnemy){
      var nextTime = 1000 * ( nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time));
      
      this.nextEnemyTimer = this.game.time.events.add(nextTime, function(){
        this.createEnemy(nextEnemy.x * this.game.world.width, -100, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);
        
        this.currentEnemyIndex++;
        this.scheduleNextEnemy();
      }, this);
    }
  }
  

};