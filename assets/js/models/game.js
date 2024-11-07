class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.isSoundOn = true;

    this.soundEffects = {
        fight: new Audio("assets/sounds/fight.mp3"),
        shaoWinner: new Audio("assets/sounds/shaowin.mp3"),
        liuWinner: new Audio("assets/sounds/liuwin.mp3"),
        lowHealth: new Audio("assets/sounds/pocavida.mp3"),
    };
    this.backgroundMusic = new Audio ("assets/sounds/backsound.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.2;
    this.playerLowHealthSoundPlayed = false;
    this.enemyLowHealthSoundPlayed = false;
    this.lowHealthThreshold = 20;

    this.player = new Player(ctx);
    this.enemy = new Enemy(ctx);
    this.playerHealthElement = document.getElementById("playerHealth");
    this.enemyHealthElement = document.getElementById("enemyHealth");
    this.timerElement = document.getElementById("timer");
    this.startMessageElement = document.getElementById("startMessage");
    this.timeLeft = 60;
    this.interval = null;
    this.background = new Background(ctx);

    this.setListeners();
    
  }


  start() {
    if (this.isSoundOn) {
      this.backgroundMusic.play();
    }
    this.startMessageElement.style.display = 'block';
    this.startMessageElement.innerText = "FIGHT!"
    this.soundEffects.fight.play();
    setTimeout(() => {
      this.startMessageElement.style.display = 'none';
    },1000);
    setInterval(() => {
          this.clear();
          this.draw();
          this.move();
          this.updateTimer();
          this.checkGameOver();
          this.checkLowHealth();
    }, 1000/60);
    
  }

  toggleSound(isSoundOn) {
    this.isSoundOn = isSoundOn;
    if (this.isSoundOn) {
        this.backgroundMusic.play();
    } else {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }
  }


  updateTimer() {
    if (this.timeLeft > 0) {
          const currentTime = Math.floor(this.timeLeft -= 1 / 60);
          this.timerElement.innerText = currentTime; 
    }
    if (this.timeLeft <= 0) {
        this.timeLeft = 0; 
        this.timerElement.innerText = this.timeLeft; 
        this.checkGameOver(); 
    }
  }

  checkGameOver() {
    if (this.timeLeft <= 0) {
        clearInterval(this.interval); 
        this.determineWinner();
    } else if (this.player.health <= 0 || this.enemy.health <= 0) {
        clearInterval(this.interval);
        this.determineWinner();
    }
  }

  determineWinner() {
    const winnerNameElement = document.getElementById("winnerName");
    const winnerElement = document.getElementById("winner");
    this.backgroundMusic.pause();

    if (this.player.health > this.enemy.health) {
        console.log("Player wins");
        this.soundEffects.liuWinner.play();
        this.enemy.setSprite("fall"); 
        this.player.setSprite("victory");
        this.player.x = 512;

          setTimeout(() => {
            this.enemy.health = 0; 
            //this.enemy.x = -200; 
          }, 1000);
        winnerNameElement.innerText = "LIU KANG WINS"; 
        winnerElement.style.display = "block";
    } else if (this.enemy.health > this.player.health) {
        console.log("Enemy wins");
        this.soundEffects.shaoWinner.play();
        this.enemy.setSprite("victory");
        this.player.setSprite("fall"); 
        this.enemy.x = 512;

          setTimeout(() => {
            this.player.health = 0; 
            //this.player.x = -200; 
          }, 1000);
        winnerNameElement.innerText = "SHAO KHAN WINS"; 
        winnerElement.style.display = "block";
    } else {
        console.log("It's a Tie!");
        winnerNameElement.innerText = "IT'S A TIE"; 
        winnerElement.style.display = "block";
    }
    setTimeout(() => {
      winnerElement.style.display = "none"; 
      window.location.reload();
    }, 2000);
  }

  pause() {
    clearInterval(this.interval);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  move() {
  this.enemy.move(this.player);
  this.player.move(this.enemy);

    if (this.player.attackBox.isCollidingWith(this.enemy)) {
      const damageTaken = this.enemy.receiveDamage(1);
      if (damageTaken) {
      this.updateHealthBar(this.enemyHealthElement, this.enemy.health);
      }
    }

    if (this.enemy.attackBox.isCollidingWith(this.player)) {
      const damageTaken = this.player.receiveDamage(1);  
      if (damageTaken) {
        this.updateHealthBar(this.playerHealthElement, this.player.health);
      }
    }
  }

  checkLowHealth() {
    if (this.player.health <= this.lowHealthThreshold && !this.playerLowHealthSoundPlayed) {
      this.soundEffects.lowHealth.play();
      this.playerLowHealthSoundPlayed = true; 
    }
    if (this.enemy.health <= this.lowHealthThreshold && !this.enemyLowHealthSoundPlayed) {
      this.soundEffects.lowHealth.play();
      this.enemyLowHealthSoundPlayed = true;
    }
  }

  updateHealthBar(healthElement, health) {
    healthElement.style.width = health + "%"; 
  }
   
  draw() {
    this.background.draw();
    this.enemy.draw();
    this.player.draw(); 
  }
   

  setListeners() {
    document.addEventListener("keydown", (event) => {
      this.player.onKeyDown(event.keyCode);
    });
    document.addEventListener("keyup", (event) => {
      this.player.onKeyUp(event.keyCode);
    });
    document.addEventListener("keydown", (event) => {
      this.enemy.onKeyDown(event.keyCode);
    });
    document.addEventListener("keyup", (event) => {
      this.enemy.onKeyUp(event.keyCode);
    });
  }
}
