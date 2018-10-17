var ShopState = {

    init: function(amountOfCoin) {
        this.coin = amountOfCoin;
      },
    
      create: function() {
    
        var background = this.game.add.sprite(0,0,'backyard');
        background.inputEnabled = true;
        
        var style = { font: '20px Arial', fill: '#fff'};

        this.game.add.text(10,20,'Coin:',style);
        this.coinText = this.game.add.text(60,20,'',style);
        this.coinText.text = this.coin;
        this.coin += 100;
    
        background.events.onInputDown.add(function(){
          this.state.start('GameState',true,false,this.coin);
        }, this);
    
        var style = {font: '35px Arial', fill: '#fff'};
        this.game.add.text(30, this.game.world.centerY + 200, 'TOUCH TO START', style);
      
        if(this.coin) {
          this.game.add.text(60, this.game.world.centerY - 200, "++100", style);
        }
      }

};