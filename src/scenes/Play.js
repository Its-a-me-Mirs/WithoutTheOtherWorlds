class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // new assets
        this.load.image('red', './assets/backdrop_red.png');
        this.load.image('stars', './assets/backdrop_stars.png');
        this.load.audio('gameOver', './assets/audio3.mp3');

        // load images and tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('bonus', './assets/spaceshipBonus.png');
        // load spritesheet
        this.load.spritesheet('enemy', './assets/enemy.png',
        {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('pop', './assets/explosion.png',
        {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});


        // sound
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/assets_explosion38.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');
        this.load.audio('standby', './assets/standbyTune.wav');
    }

    create() {
        // red backdrop
        var image = this.add.image(0,0,'red').setOrigin(0,0);

        //place tile sprite
        this.starfield = this.add.tileSprite(
            0,0,640,480,
            'stars'
            ).setOrigin(0,0);
        
        // whiteUI background
        this.add.rectangle(
            0,
            borderUISize,
            game.config.width,
            borderUISize * 2.5,
            0xcccccc
            ).setOrigin(0,0);
        
        // blackUI borders
        this.add.rectangle(
            0,
            0,
            game.config.width,
            borderUISize *2,
            0x000000
            ).setOrigin(0, 0);
        
        // green UI backdrop
        this.add.rectangle(
            borderUISize,
            borderUISize + borderPadding *1.5,
            game.config.width - borderUISize * 2,
            borderUISize *1.5,
            0x00dd00
            ).setOrigin(0,0);
        
        // add rocket player 1
        this.p1Rocket = new Rocket(
            this,
            game.config.width/2,
            game.config.height - borderUISize - borderPadding,
            'rocket'
            ).setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new BonusShip(
            this,
            game.config.width + borderUISize*10.75,
            borderUISize*5,
            'bonus',
            0,
            30
            ).setOrigin(0, 0);
        this.ship02 = new Spaceship(
            this,
            game.config.width + borderUISize*6.5,
            borderUISize*6.5 + borderPadding*3,
            'spaceship',
            0,
            20
            ).setOrigin(0,0);
        this.ship03 = new Spaceship(
            this,
            game.config.width + borderUISize,
            borderUISize*9 + borderPadding*2,
            'spaceship',
            0,
            10
            ).setOrigin(0,0);
        this.ship04 = new Spaceship(
            this,
            game.config.width*1.65,
            borderUISize*9,
            'spaceship',
            0,
            5
            ).setOrigin(0,0);

        //animation configuration
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('enemy',
            {start: 0, end: 9, first: 0}), frameRate: 30
        });
        this.anims.create({
            key: 'explodeBonus',
            frames: this.anims.generateFrameNumbers('pop',
            {start: 0, end: 9, first: 0}), frameRate: 30
        });
        
        //defining keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //intitializing score
        this.p1Score = 0;

        //displaying score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#BF340F',
            align: 'right',
            padding: {
                top: 5,
                left: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        
        //displaying text
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '35px',
            color: 'orange',
            align: 'center',
            padding: {
                top: 5,
                left: 10,
                right: 10,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.scoreLeft = this.add.text(
            borderUISize + borderPadding,
            borderUISize + borderPadding*2,
            this.p1Score, scoreConfig);
        
        //Game Over flag
        this.gameOver = false;

        // timer in seconds until auto game ends
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {

            this.gameOver = true;
            //black tint over the screen
            this.add.rectangle(
                0, 0, 640, 480, 0x00000, 75
            ).setOrigin(0,0);

            // text
            this.add.text(
                game.config.width/2,
                game.config.height/2,
                'Times Up!',
                textConfig
            ).setOrigin(0.5);

        }, null, this);
    }

    update() {
        //switches to planets scene
        if (this.gameOver) {
            finScore = this.p1Score;
            if (soundVar == true) {
                this.sound.play('standby');
            }
            soundVar = false;
            this.time.addEvent({
                // for testing change this///////////////////
                delay: 11000,
                //delay: 5000,
                paused: false,
                callback:()=> {
                    this.sound.get('standby').destroy();
                    this.scene.start("planetScene");
                },
            })
        }

        this.starfield.tilePositionX -= 3;

        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();

            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.sound.play('sfx_select');
            }
            if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                this.sound.play('sfx_select');
            }
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.delayExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        //AABB (axis-aligned bounding boxes) check
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    // exploding event
    delayExplode(ship) {
        this.sound.play('sfx_explosion');
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explodeBonus').setOrigin(0,0);
        boom.anims.play('explodeBonus');
        
        boom.on('animationcomplete', () => {
            boom.destroy();
            // delay re-entry of the special ship
            this.time.addEvent({
                delay: 3500,
                paused: false,
                callback:()=> {
                    ship.reset();
                    ship.alpha = 1;
                },
            })
        });
        // adding and changing scores
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
    }

    shipExplode(ship) {
        this.sound.play('sfx_explosion');
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explode').setOrigin(0,0);
        boom.anims.play('explode');
        
        boom.on('animationcomplete', () => {
            boom.destroy();
            ship.reset();
            ship.alpha = 1;
        });
        // adding and changing scores
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
    }
}