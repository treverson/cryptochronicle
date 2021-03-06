var game = new Phaser.Game(400, 490, Phaser.AUTO, "gameDiv");

var mainState = {

    preload: function() { 
        if(!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#9be7fe';

        game.load.image('bird', 'assets/voenista.png');  
        game.load.image('pipe', 'assets/pipe.png'); 

        // Load the jump sound
        game.load.audio('jump', 'assets/jump.wav'); 
        game.load.audio('bgm', 'assets/osanaiyuta_bgm_0001.mp3');

        game.load.audio('voe01', 'assets/voe_voice/voe01.mp3'); 
        game.load.audio('voe02', 'assets/voe_voice/voe02.mp3'); 
        game.load.audio('voe03', 'assets/voe_voice/voe03.mp3'); 

        

    },

    create: function() { 
       
        this.music = game.add.audio('bgm');
        this.music.play("",0,1,true);

        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);           

        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5); 
 
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
        game.input.onDown.add(this.jump, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

        // Add the jump sound
        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;



        this.voe01 = game.add.audio('voe01');
        this.voe02 = game.add.audio('voe02');
        this.voe03 = game.add.audio('voe03');

        //game.sound.setDecodedCallback([ voe01, voe02, voe03 ], start, this);

        

        
    },

    update: function() {
              
        if (this.bird.y < 0 || this.bird.y > game.world.height)
            this.restartGame(); 

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 
            
        // Slowly rotate the bird downward, up to a certain point.
        if (this.bird.angle < 20)
            this.bird.angle += 1;  
    },

    playVoe: function(num) {

        switch (num)
        {
            case 0:
            this.voe01.play();
                break;
    
            case 1:
            this.voe02.play();
                break;
    
            case 2:
            this.voe03.play();
                break;
        }
    
    },

    jump: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Play sound
        this.jumpSound.play();
    },

    getRandomInt: function(max) {
        return Math.floor(Math.random() * Math.floor(max));
      },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do

        if (this.bird.alive == false)
            return;

        //voe
        var voe = this.getRandomInt(3);
        this.playVoe(voe);

        //destroy bgm
        if(this.music) this.music.destroy();
            
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {

        //destroy bgm
        if(this.music) this.music.destroy();
        
        game.state.start('main');
        
    },

    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200;  
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: async function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnePipe(400, i*60+10);   
    
        this.score = 1;
        this.labelScore.text = this.score;  

        await contract.methods.set(2).send()

        // result = await contract.methods.get().call()
        // this.labelScore.text = result;
        
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 
