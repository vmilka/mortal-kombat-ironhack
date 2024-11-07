class AttackBoxEnemy {
    constructor(enemy) {
      this.enemy = enemy;       
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
            this.offsetX = 50;
            this.offsetY = 10;
            break;
          case "kick":
            this.width = 10;
            this.height = 30;
            this.offsetX = 50;
            this.offsetY = 60;
            break;
          case "block":
            this.width = 10;
            this.height = 60;
            this.offsetX = 50;
            this.offsetY = 30;
            break;
          case "special":
            this.width = 10;
            this.height = 60;
            this.offsetX = 50;
            this.offsetY = 30;
            break;
        }
    }

    updatePosition() {
        if (this.enemy.facingRight) {
          this.x = this.enemy.x + this.enemy.w;  
        } else {
          this.x = this.enemy.x - this.width;  
        }
        this.y = this.enemy.y + this.offsetY;
      }
  
    draw(ctx) {
      //!!comentar para que no se vea la caja!!
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
        console.log("Enemy está bloqueando");
    }
  
    isCollidingWith(player) {
      return (
        this.active &&
        this.x < player.x + player.w &&
        this.x + this.width > player.x &&
        this.y < player.y + player.h &&
        this.y + this.height > player.y
      );
    }
  }
  