import Phaser from 'phaser';
import { TranslationKeys } from '@/i18n/translations';

interface JobSceneData {
  minigameId: string;
  onGameComplete: (score: number) => void;
  isRTL: boolean;
  t: (key: TranslationKeys, options?: any) => string;
}

export class JobScene extends Phaser.Scene {
  private minigameId: string = '';
  private onGameComplete!: (score: number) => void;
  private isRTL: boolean = false;
  private t!: (key: TranslationKeys, options?: any) => string;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timerEvent!: Phaser.Time.TimerEvent;
  private timeLeft: number = 30; // 30 seconds for the minigame
  private timerText!: Phaser.GameObjects.Text;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private items!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('JobScene');
  }

  init(data: JobSceneData) {
    this.minigameId = data.minigameId;
    this.onGameComplete = data.onGameComplete;
    this.isRTL = data.isRTL;
    this.t = data.t;
    this.score = 0;
    this.timeLeft = 30;
    console.log(`JobScene initialized for minigame: ${this.minigameId}`);
  }

  preload() {
    // Load assets based on minigameId
    switch (this.minigameId) {
      case 'farmer':
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
        this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
        this.load.image('carrot', 'https://labs.phaser.io/assets/sprites/carrot.png');
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        break;
      case 'baker':
        this.load.image('kitchen_bg', 'https://via.placeholder.com/800x600/f0f0f0/333333?text=Kitchen');
        this.load.image('flour', 'https://via.placeholder.com/32x32/fff8dc/000000?text=F');
        this.load.image('sugar', 'https://via.placeholder.com/32x32/f8f8f8/000000?text=S');
        this.load.spritesheet('chef', 'https://labs.phaser.io/assets/sprites/phaser-dude.png', { frameWidth: 32, frameHeight: 48 }); // Using dude as chef for now
        break;
      default:
        // Fallback assets
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
        this.load.image('platform', 'https://labs.phaser.io/assets/platform.png');
        this.load.image('star', 'https://labs.phaser.io/assets/star.png');
        this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        break;
    }
  }

  create() {
    // Set background
    this.add.image(400, 300, 'sky');

    // Platforms
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Player
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    // Animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    // Cursors for input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Items to collect
    this.items = this.physics.add.group({
      key: this.minigameId === 'farmer' ? 'carrot' : (this.minigameId === 'baker' ? 'flour' : 'star'),
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.items.children.iterate((child) => {
      (child as Phaser.Physics.Arcade.Sprite).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return true;
    });

    this.physics.add.collider(this.items, platforms);
    this.physics.add.overlap(this.player, this.items, this.collectItem, undefined, this);

    // Score Text
    this.scoreText = this.add.text(16, 16, `${this.t('minigame_score' as TranslationKeys)}: 0`, { fontSize: '32px', color: '#000' });
    if (this.isRTL) {
      this.scoreText.setOrigin(1, 0); // Align right
      this.scoreText.x = this.game.config.width as number - 16;
    }

    // Timer Text
    this.timerText = this.add.text(this.game.config.width as number - 16, 16, `${this.t('minigame_time' as TranslationKeys)}: ${this.timeLeft}`, { fontSize: '32px', color: '#000' });
    if (this.isRTL) {
      this.timerText.setOrigin(0, 0); // Align left
      this.timerText.x = 16;
    } else {
      this.timerText.setOrigin(1, 0); // Align right
    }


    // Timer event
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body!.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectItem(player: Phaser.GameObjects.GameObject, item: Phaser.GameObjects.GameObject) {
    (item as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`${this.t('minigame_score' as TranslationKeys)}: ${this.score}`);

    if (this.items.countActive(true) === 0) {
      // All items collected, spawn new set
      this.items.children.iterate((child) => {
        (child as Phaser.Physics.Arcade.Sprite).enableBody(true, Phaser.Math.Between(0, 800), 0, true, true);
        return true;
      });
    }
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`${this.t('minigame_time' as TranslationKeys)}: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      this.timerEvent.destroy();
      this.endGame();
    }
  }

  endGame() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play('turn');
    this.onGameComplete(this.score);
  }
}
