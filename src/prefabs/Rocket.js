class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add obect to existing scene
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = game.settings.spaceshipSpeed;
        //add rocket sfx
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        // left and right movement
        if(!this.isFiring){
            if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width -
            borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        
        // fire button F
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            //this.sfxRocket.play();
        }
        
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        // resets on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }
    
    // resets the rocket position
    reset(){
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}