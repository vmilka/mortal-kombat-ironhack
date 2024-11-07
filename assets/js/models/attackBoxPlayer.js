class AttackBoxPlayer {
    constructor(player) {
      this.player = player;       
      this.width = 50;
      this.height = 50;
      this.offsetX = 50;          
      this.offsetY = 0;
      this.active = false;       
    }

    setAttackType(type) {
        switch (type) {
        case "punch":
            this.width = 10;
            this.height = 30;
            this.offsetX = 10;   
            this.offsetY = 30;
            break;
        case "kick":
            this.width = 15;
            this.height = 30;
            this.offsetX = 15;
            this.offsetY = 50;
            break;
        case "block":
            this.width = 20;     
            this.height = 60;
            this.offsetX = 10;
            this.offsetY = 50;
            break;
        case "special":
            this.width = 10;
            this.height = 40;
            this.offsetX = 10;
            this.offsetY = 50;
            break;
        }
    }

    updatePosition() {
        if (this.player.facingRight) {
          this.x = this.player.x + this.player.w -20; 
        } else {
          this.x = this.player.x +  this.offsetX; 
        }
        this.y = this.player.y + this.offsetY;
      }

    draw(ctx) {
      /*if (this.active) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }*/
    }
  
    activate() {
      this.active = true;
    }
  
    deactivate() {
      this.active = false;
    }

    block() {
        this.active = false; 
    }
  
    isCollidingWith(enemy) {
      return (
        this.active &&
        this.x < enemy.x + enemy.w &&
        this.x + this.width > enemy.x &&
        this.y < enemy.y + enemy.h &&
        this.y + this.height > enemy.y
      );
    }
  }
  