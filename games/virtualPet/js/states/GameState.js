//this game will have only 1 state
var GameState = {

  init: function(amountOfCoin){
    this.coin = amountOfCoin || 0;
  },

  //executed after everything is loaded
  create: function(amountOfCoin) {      
    this.background = this.game.add.sprite(0, 0, 'backyard');
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.placeItem, this);

    //////////// PET ////////////////

    this.pet = this.game.add.sprite(100, 400, 'pet');
    this.pet.anchor.setTo(0.5);

    //spritesheet animation
    this.pet.animations.add('funnyfaces', [1, 2, 3, 2, 1], 7, false);

    //custom properties
    this.pet.customParams = {health: 100, fun: 100};

    //draggable pet
    this.pet.inputEnabled = true;
    this.pet.input.enableDrag();

    
    ///////////// UI ////////////////////
    this.itemData = JSON.parse(this.game.cache.getText('items'));
    this.buttons = [];
    for (i = 0; i < 4; i++){
    this.itemInit(i);
    }

    //nothing is selected
    this.selectedItem = null;

    //the user interface (UI) is not blocked at the start
    this.uiBlocked = false;

    var style = { font: '20px Arial', fill: '#fff'};

    this.game.add.text(10,20,'Coin:',style);
    this.coinText = this.game.add.text(60,20,'',style);
    this.coinText.text = this.coin;

    this.statusGroup = this.game.add.group();
    this.statusGroup.y = 50;

    this.game.add.text(10, 0, 'Health:', style,this.statusGroup);
    this.game.add.text(140, 0, 'Fun:', style,this.statusGroup);

    this.healthText = this.game.add.text(80, 0, '', style,this.statusGroup);
    this.funText = this.game.add.text(185, 0, '', style,this.statusGroup);

    this.shopButton = this.game.add.sprite(this.game.width - 75, 20, 'arrow');
    this.shopButton.scale.setTo(0.5);
    this.shopButton.inputEnabled = true;
    this.shopButton.events.onInputDown.add(function(){
      this.state.start('ShopState', true, false, this.coin);
    }, this);


    this.refreshStats();

    //decrease the health every 5 seconds
    this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this);

  },

  itemInit: function(id){

    var style = { font: '20px Arial', fill: '#fff'};
    
    this.buttons[id] = this.game.add.sprite(this.itemData.leftMostItemX * (id + 1), this.itemData.itemsHeight, this.itemData.items[id].name);
    this.buttons[id].anchor.setTo(0.5);
    this.buttons[id].inputEnabled = true;
    this.buttons[id].customParams = this.itemData.items[id];
    if (this.itemData.items[id].name != "rotate"){
    this.buttons[id].events.onInputDown.add(this.pickItem, this);
    }else{
    this.buttons[id].events.onInputDown.add(this.rotatePet, this);
    }
    this.buttons[id].num = this.itemData.items[i].num;
    this.buttons[id].text = this.game.add.text(this.itemData.leftMostItemX * (id + 1), this.itemData.itemsHeight + 45, '', style);
    this.buttons[id].text.anchor.setTo(0.5);
    
    this.itemIndex++;
  },

  // reduce number
  // add(function) callback??
  pickItem: function(sprite, event) {
    
    //if the UI is blocked we can't pick an item
    if(!this.uiBlocked) {
      console.log('pick item');

      this.clearSelection();

      //alpha to indicate selection
      sprite.alpha = 0.4;

      this.selectedItem = sprite;
    }
  },
  rotatePet: function(sprite, event) {

    if(!this.uiBlocked) {     

      //we want the user interface (UI) to be blocked until the rotation ends
      this.uiBlocked = true;

      this.clearSelection();

      //alpha to indicate selection
      sprite.alpha = 0.4;

      sprite.num --;

      var petRotation = this.game.add.tween(this.pet);

      //make the pet do two loops
      petRotation.to({angle: '+720'}, 1000);

      this.refreshStats();

      petRotation.onComplete.add(function(){
        //release the UI
        this.uiBlocked = false;

        sprite.alpha = 1;

        //increse the fun of the pet
        this.pet.customParams.fun += 10;
        
        //update the visuals for the stats
        this.refreshStats();
        
      }, this);

      //start the tween animation
      petRotation.start();
    }

    
  },
  clearSelection: function() {

    //remove transparency from all buttons
    this.buttons.forEach(function(element, index){
      element.alpha = 1;
    });

    //we are not selecting anything now
    this.selectedItem = null;
  },
  placeItem: function(sprite, event) {

    if(this.selectedItem && !this.uiBlocked) {
      var x = event.position.x;
      var y = event.position.y;

      var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
      newItem.anchor.setTo(0.5);
      newItem.customParams = this.selectedItem.customParams;

      this.uiBlocked = true;

      this.selectedItem.num --;

      //move the pet towards the item
      var petMovement = this.game.add.tween(this.pet);
      petMovement.to({x: x, y: y}, 700);

      this.refreshStats();

      petMovement.onComplete.add(function(){

        //destroy the apple/candy/duck
        newItem.destroy();

        //play animation
        this.pet.animations.play('funnyfaces');

        //release the ui
        this.uiBlocked = false;

        var stat;
        for(stat in newItem.customParams) {
          //we only want the properties of the customParams object, not properties that may existing in customParams.prototype
          //this filters out all non-desired properties
          if(newItem.customParams.hasOwnProperty(stat)) {
            this.pet.customParams[stat] += newItem.customParams[stat];
          }
        }

        //update the visuals for the stats
        this.refreshStats();

      }, this);

      //start the tween animation
      petMovement.start();
    }
    
  },
  refreshStats: function() {
    this.healthText.text = this.pet.customParams.health;
    this.funText.text = this.pet.customParams.fun;


    for (i=0; i < this.buttons.length; i++){
      this.buttons[i].text.text = this.buttons[i].num;
    }
  },
  reduceProperties: function() {
    this.pet.customParams.health -= 10;
    this.pet.customParams.fun -= 15;
    this.refreshStats();
  },
  //executed multiple times per second
  update: function() {
    if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0) {
      this.pet.frame = 4;
      this.uiBlocked = true;

      this.game.time.events.add(2000, this.gameOver, this);
    }
  },
  gameOver: function() {
    this.state.start('HomeState', true, false, 'GAME OVER!');
  }

  
};