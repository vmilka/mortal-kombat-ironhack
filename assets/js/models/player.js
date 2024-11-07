class Player {
    constructor(ctx) {
        this.ctx = ctx; 
        
        this.w = 90;
        this.h = 180;

        this.x = 20;
        this.y = 0;

        this.vx = 0;
        this.vy = 0;

        this.ax = 0;
        this.ay = 10;
        this.offsetY = 20;
        
        
        this.health = 100;
        this.isJumping = false;
        this.facingRight = true;

        this.currectAction = "stance";
        this.tickAnimate = 0;
        this.frameIndex = 0;
        this.isAnimating = false;
        this.isBlocking = false;
        this.attackSound = new Audio('assets/sounds/hit.mp3');

        this.sprite = new Image();
        this.sprites = {
            stance: { 
                right: { src: "assets/images/sprites/player/stance_ext.png", frames: 18, duration: 1000, width: 120, tickAnimate: 5, height: 180},
                left: { src: "assets/images/sprites/player/stance_ext_mirror.png", frames: 18, duration: 1000, width: 120, tickAnimate: 5, height: 180}
            },
            walking: { 
                right: { src: "assets/images/sprites/player/walking.png", frames: 8, duration: 1000, width: 120, tickAnimate: 5, height: 180},
                left: { src: "assets/images/sprites/player/walking_mirror.png", frames: 8, duration: 1000, width: 120, tickAnimate: 5, height: 180}
            },
            punch: { 
                right: { src: "assets/images/sprites/player/punch.png", frames: 4, duration: 500, width: 200, tickAnimate: 6, height: 180},
                left: { src: "assets/images/sprites/player/punch_mirror.png", frames: 4, duration: 500, width: 200, tickAnimate: 6, height: 180}
            },
            kick: { 
                right: { src: "assets/images/sprites/player/kick.png", frames: 8, duration: 900, width: 250, tickAnimate: 6, height: 180},
                left: { src: "assets/images/sprites/player/kick_mirror.png", frames: 8, duration: 900, width: 250, tickAnimate: 6, height: 180}
            },
            block: { 
                right: { src: "assets/images/sprites/player/block.png", frames: 3, duration: 1000, width: 120, tickAnimate: 10, height: 180},
                left: { src: "assets/images/sprites/player/block_mirror.png", frames: 3, duration: 1000, width: 120, tickAnimate: 10, height: 180}
            },
            jump: { 
                right: { src: "assets/images/sprites/player/jump.png", frames: 3, duration: 300, width: 120, tickAnimate: 7, height: 180},
                left: { src: "assets/images/sprites/player/jump_mirror.png", frames: 3, duration: 1000, width: 120, tickAnimate: 10, height: 180}
            },
            special: { 
                right: { src: "assets/images/sprites/player/special.png", frames: 5, duration: 1000, width: 200, tickAnimate: 10, height: 180},
                left: { src: "assets/images/sprites/player/special_mirror.png", frames: 5, duration: 1000, width: 200, tickAnimate: 10, height: 180}
            },
            fall: { 
                right: { src: "assets/images/sprites/player/fall.png", frames: 8, duration: 900, width: 250, tickAnimate: 10, height: 180},
                left: { src: "assets/images/sprites/player/fall_mirror.png", frames: 8, duration: 900, width: 120, tickAnimate: 10, height: 180}
            },
            victory: { 
                right: { src: "assets/images/sprites/player/victory.png", frames: 15, duration: 8000, width: 180, tickAnimate: 10, height: 250},
                left: { src: "assets/images/sprites/player/victory.png", frames: 15, duration: 8000, width: 180, tickAnimate: 10, height: 250}
            }
        };
        
        this.setSprite("stance");

        
        this.attackBox = new AttackBoxPlayer(this);

        
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
                    if (this.sprite.frameIndex >= this.sprite.frames) {
                        this.sprite.frameIndex = 0;
                    }
                } else {
                    this.sprite.frameIndex--;
                    if (this.sprite.frameIndex < 0) {
                        this.sprite.frameIndex = this.sprite.frames - 1;
                    }
                }
            }
        }    
        this.tickAnimate++;
    }


    move(enemy) {
        this.vy += this.ay; 
        this.vx += this.ax;

        const prevX = this.x;
        const prevY = this.y;

        this.x += this.vx; 
        this.y += this.vy;


        //Colisiones canvas
        if (this.y + this.h >= this.ctx.canvas.height) {
            this.vy = 0;
            this.y = this.ctx.canvas.height - this.h;
            this.isJumping = false;
        } else if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }

        if (this.x < 0) {
            this.x = 0;
          } else if (this.x + this.w > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.w;
        }
        
        const newFacingRight = this.x < enemy.x;
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
        console.log(`Player health decreased to: ${this.health}`);
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
            case KEY_W:
                this.jump();
                break;
            case KEY_D:
                this.vx = this.isJumping ? 20 : 5;
                this.setSprite("walking");
                break;
            case KEY_A:
                this.vx = this.isJumping ? -20 : -5;
                this.setSprite("walking")
                break;
            case KEY_Q: //Puño
                this.setSprite("punch");
                this.attackBox.setAttackType("punch");
                this.playAttackSound();
                this.attackBox.activate();
                setTimeout(() => {
                    this.attackBox.deactivate();
                }, 100);
                break;
            case KEY_E:  // Patada
                this.setSprite("kick");
                this.attackBox.setAttackType("kick");
                this.playAttackSound();
                this.attackBox.activate();
                setTimeout(() => {
                    this.attackBox.deactivate();
                }, 100);
                break;
            case KEY_R:  // Movimiento especial  
                this.setSprite("special");
                this.playAttackSound();   
                this.attackBox.setAttackType("special");
                this.attackBox.activate();
                setTimeout(() => {
                    this.attackBox.deactivate();
                }, 100);
                break;
            case KEY_S: // Bloqueo
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
            case KEY_D:
            case KEY_A:
                this.vx = 0;
                break;
            case KEY_Q:
            case KEY_E:
            case KEY_R:
                this.attackBox.deactivate();
                break;
            case KEY_S:
                this.isBlocking = false;
            break;
        }
        /*if (this.currentAction !== "victory" && this.currentAction !== "fall") {
            this.setSprite("stance");
        }*/
    }

    jump() {
        if (!this.isJumping && this.y + this.h >= this.ctx.canvas.height) {
        this.vy = -200;  
        this.isJumping = true;
        this.setSprite("jump");
        }
    }    
    
}