(function(){
  'use strict';

  let mainState = {
    preload: function() {

      game.load.image('bird', '../assets/img/bird.png');
      game.load.image('pipe', '../assets/img/pipe.png');
      game.load.audio('jump', '../assets/audio/jump2.wav');
      game.load.image('background', '../assets/img/background.png');
    },
    create: function() {

      // game.stage.backgroundColor = '#71c5cf';


      game.physics.startSystem(Phaser.Physics.ARCADE);

      this.background = game.add.tileSprite(0, 0, 400, 490, 'background');

      this.bird = game.add.sprite(100, 245, 'bird');
      this.pipe = game.add.group();
      this.jumpSound = game.add.audio('jump');

      game.physics.arcade.enable(this.bird);

      this.bird.anchor.setTo(-0.2, 0.5);

      this.score = 0;
      this.labelScore = game.add.text(20, 20, "0", {
        font: "30px Arial",
        fill: "#ffffff"
      });

      this.bird.body.gravity.y = 1000;

      this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

      let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      spaceKey.onDown.add(this.jump, this);



    },
    update: function() {

      this.background.tilePosition.x = -1.5;

      if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();

      if (this.bird.angle < 20)
        this.bird.angle += 1;

      game.physics.arcade.overlap(this.bird, this.pipe, this.hidePipe, null, this);
      // game.physics.arcade.collide(this.bird, this.pipes, this.hidePipe)


    },

    jump: function() {

      let animation = game.add.tween(this.bird);
      this.jumpSound.play();
      animation.to({
        angle: -20
      },100);

      animation.start();


      this.bird.body.velocity.y = -350;

      if (this.bird.alive == false)
        return;
    },

    addOnePipe: function(x, y) {

      let pipe = game.add.sprite(x,y, 'pipe');

      this.pipe.add(pipe);

      game.physics.arcade.enable(pipe);

      pipe.body.velocity.x = -200;



      pipe.checkWorldBounds = true;
      pipe.outOfBoundsKill = true;

    },

    addRowOfPipes: function() {
      this.score += 1;
      this.labelScore.text = this.score;

      let hole = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < 8; i++)
          if(i != hole && i != hole + 1)
            this.addOnePipe(400, i * 60 + 10);

    },

    hidePipe: function() {
      if(this.bird.alive == false)
        return;

      this.bird.alive = false;

      game.time.events.remove(this.timer);

      this.pipe.forEach(function(p){
          p.body.velocity.x = 0;
      }, this);
    },

    restartGame: function() {
      game.state.start('main');
    }


  }

  let game = new Phaser.Game(400,490);

  game.state.add('main', mainState);

  game.state.start('main');

}());
