class BonusShip extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue + 10;
        this.moveSpeed = game.settings.spaceshipSpeed + 1.5;
    }

    update() {
        // move left
        this.x -= this.moveSpeed

        //wrap around
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}