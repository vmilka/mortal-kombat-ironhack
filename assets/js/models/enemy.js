class Enemy {
    constructor(ctx) {
        this.ctx = ctx; 
        
        this.w = 100;
        this.h = 200;

        this.x = this.ctx.canvas.width - this.w - 20;
        this.y = 0;

        this.vx = 0;
        this.vy = 0;

        this.ax = 0;
        this.ay = 10;
        this.offsetY = 20;

        this.health = 100;
        this.isJumping = false;
        this.facingRight = false;

        this.currectAction = "stance";
        this.tickAnimate = 0;
        this.frameIndex = 0;
        this.isAnimating = false;
        this.isBlocking = false;
        this.attackSound = new Audio('assets/sounds/hit.mp3');

        this.sprite = new Image();
        this.sprites = {
            stance: { 
                left: { src: "assets/images/sprites/enemy/stance_mirror.png", frames: 7, duration: 1000, width: 120, tickAnimate: 6, height: 200},
                right: { src: "assets/images/sprites/enemy/stance1.png", frames: 7, duration: 1000, width: 120, tickAnimate: 6, height: 200}
            },
            walking: { 
                left: { src: "assets/images/sprites/enemy/walk_mirror.png", frames: 9, duration: 1000, width: 120, tickAnimate: 5, height: 230},
                right: { src: "assets/images/sprites/enemy/walk.png", frames: 9, duration: 1000, width: 120, tickAnimate: 5, height: 230}
            },
            punch: { 
                left: { src: "assets/images/sprites/enemy/punch_mirror.png", frames: 5, duration: 500, width: 200, tickAnimate: 7, height: 200},
                right: { src: "assets/images/sprites/enemy/punch.png", frames: 5, duration: 500, width: 200, tickAnimate: 7, height: 200}
            },
            kick: { 
                left: { src: "assets/images/sprites/enemy/kick_mirror.png", frames: 5, duration: 800, width: 250, tickAnimate: 7, height: 200},
                right: { src: "assets/images/sprites/enemy/kick.png", frames: 5, duration: 800, width: 250, tickAnimate: 7, height: 200}
            },
            block: { 
                left: { src: "assets/images/sprites/enemy/block_mirror.png", frames: 3, duration: 1000, width: 120, tickAnimate: 10, height: 200},
                right: { src: "assets/images/sprites/enemy/block.png", frames: 3, duration: 1000, width: 120, tickAnimate: 10, height: 200}
            },
            jump: { 
                left: { src: "assets/images/sprites/enemy/jump_mirror.png", frames: 3, duration: 300, width: 120, tickAnimate: 7, height: 200},
                right: { src: "assets/images/sprites/enemy/jump.png", frames: 3, duration: 1000, width: 120, tickAnimate: 10, height: 200}
            },
            special: { 
                left: { src: "assets/images/sprites/enemy/special2_mirror.png", frames: 6, duration: 1000, width: 300, tickAnimate: 10, height: 250},
                right: { src: "assets/images/sprites/enemy/special2.png", frames: 6, duration: 1000, width: 250, tickAnimate: 10, height: 250}
            },
            fall: { 
                left: { src: "assets/images/sprites/enemy/fall_mirror.png", frames: 9, duration: 1000, width: 250, tickAnimate: 10, height: 200},
                right: { src: "assets/images/sprites/enemy/fall.png", frames: 9, duration: 1000, width: 250, tickAnimate: 10, height: 200}
            },
            victory: { 
                left: { src: "assets/images/sprites/enemy/victory.png", frames: 1, duration: 1000, width: 120, tickAnimate: 10, height: 200},
                right: { src: "assets/images/sprites/enemy/victory.png", frames: 1, duration: 1000, width: 120, tickAnimate: 10, height: 200}
            }
        };
        
        this.setSprite("stance");

        
        this.attackBox = new AttackBoxEnemy(this);

    }

    setSprite(action) {
        if (this.isAnimating && action !== "stance") return;

        this.currentAction = action;
        const direction = this.facingRight ? "right" : "left";
        const spriteData = this.sprites[action][direction];
    
        this.sprite.src = spriteData.src;
        this.sprite.frames = spriteData.frames;
        this.sprite.frameIndex = 0;
        this.sprite.isReady = false;
        
        this.tickAnimate = spriteData.tickAnimate || 10; 
        this.duration = spriteData.duration || 1000;     
        this.w = spriteData.width || this.w;
        this.h = spriteData.height || this.h;      

        this.sprite.onload = () => {
            this.sprite.isReady = true;
        };

        if (["punch", "kick", "special"].includes(action)) {
            this.isAnimating = true;
            setTimeout(() => {
                this.isAnimating = false;
                //this.attackBox.deactivate();
                this.setSprite("stance");
            }, spriteData.duration);
        }

        if (["fall", "victory"].includes(action)) {
            this.isAnimating = true;
            this.sprite.frameIndex = spriteData.frames - 1;
            setTimeout(() => {
                this.isAnimating = false;
                console.log(`${action} animation complete.`);
            }, spriteData.duration);
        }
    }

    animate() {
        if (this.tickAnimate <= 0) {
            return;
        }
        const spriteData = this.sprites[this.currentAction][this.facingRight ? "right" : "left"];

        if (this.tickAnimate >= spriteData.tickAnimate) {
            this.tickAnimate = 0;

            if (!this.isAnimating || !["fall", "victory"].includes(this.currentAction)) {
     
                if (this.facingRight) {
                    this.sprite.frameIndex++;
                    if (this.sprite.frameIndex >= spriteData.frames) {
                        this.sprite.frameIndex = 0; 
                    }
                } else {
                    this.sprite.frameIndex--;
                    if (this.sprite.frameIndex < 0) {
                        this.sprite.frameIndex = spriteData.frames - 1; 
                    }
                }
            }    
        }
        this.tickAnimate++;

    }
    
    move(player) {
        this.vy += this.ay; 
        this.vx += this.ax;

        const prevX = this.x;
        const prevY = this.y;

        this.x += this.vx; 
        this.y += this.vy;

        //tope suelo
        if (this.y + this.h >= this.ctx.canvas.height) {
            this.vy = 0;
            this.y = this.ctx.canvas.height - this.h;
            this.isJumping = false;
          } else if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
          }
          //tope lateral
        if (this.x < 0) {
            this.x = 0;
          } else if (this.x + this.w > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.w;
          }

        const newFacingRight = this.x < player.x;
        if (newFacingRight !== this.facingRight) {
            this.facingRight = newFacingRight;
            this.setSprite(this.currentAction); 
        }

        
        this.attackBox.updatePosition();
    }

    playAttackSound() {
        this.attackSound.currentTime = 0;
        this.attackSound.play();
    }

    receiveDamage(amount) {
        if (this.isBlocking) {
            console.log("Player is blocking, no damage taken.");
            return false;
        }
        this.health = Math.max(0, this.health - amount);
        console.log(`Enemy health decreased to: ${this.health}`);
        return true;
    }
    
    draw () {
        if (!this.sprite.isReady) return;
        this.animate();
        this.attackBox.draw(this.ctx); 
        this.ctx.drawImage(
            this.sprite,
            (this.sprite.width/this.sprite.frames) * this.sprite.frameIndex,
            0,
            this.sprite.width/this.sprite.frames,
            this.sprite.height,
            this.x,
            this.y - this.offsetY,
            this.w,
            this.h
        );
    }

    

    onKeyDown(code) {
        if (this.isAnimating) return;
        switch(code) {
            case KEY_UP:
                this.jump();
                break;
            case KEY_RIGHT:
                this.vx = this.isJumping ? 15 : 5;
                this.setSprite("walking");
                break;
            case KEY_LEFT:
                this.vx = this.isJumping ? -15 : -5;
                this.setSprite("walking")
                break;               
            case KEY_8:  // Puño
            this.setSprite("punch");
            this.attackBox.setAttackType("punch");
            this.playAttackSound();
            this.attackBox.activate();
            setTimeout(() => {
                this.attackBox.deactivate();
            }, 100);
                break;
            case KEY_7:  // Patada
            this.setSprite("kick");
            this.attackBox.setAttackType("kick");
            this.playAttackSound();
            this.attackBox.activate();
            setTimeout(() => {
                this.attackBox.deactivate();
            }, 100);
                break;
            case KEY_9:  // Movimiento especial
            this.setSprite("special"); 
            this.attackBox.setAttackType("special");
            this.playAttackSound();
            this.attackBox.activate();
            setTimeout(() => {
                this.attackBox.deactivate();
            }, 100);
                break;
            case KEY_DOWN: // Bloqueo
            this.setSprite("block");
            this.isBlocking = true;
            this.attackBox.block();
            default:
                break;
        }
    }

    onKeyUp(code) {
        if (this.isAnimating) return;
        switch(code) {        
            case KEY_RIGHT:
            case KEY_LEFT:
                this.vx = 0;
                break;
            case KEY_8:
            case KEY_7:
            case KEY_9:
                this.attackBox.deactivate();
                break;
            case KEY_DOWN:
                this.isBlocking = false;
            break;
        }
        this.setSprite("stance");
    }

    jump() {
        if (!this.isJumping && this.y + this.h >= this.ctx.canvas.height) {
            this.vy = -95;  
            this.isJumping = true; 
            this.setSprite("jump"); 
        }
    }
}