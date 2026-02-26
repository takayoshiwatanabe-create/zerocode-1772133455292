import Phaser from 'phaser';
import { TranslationKeys } from '@/i18n/translations';

// Define a type for the data passed to the scene
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
  private timeLeft: number = 30; // 30 seconds game
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
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/dude.png'); // Placeholder player
        break;
      case 'baker':
        this.load.image('kitchen_bg', 'https://labs.phaser.io/assets/skies/sky3.png'); // Placeholder background
        this.load.image('table', 'https://labs.phaser.io/assets/platform.png'); // Placeholder table
        this.load.image('flour', 'https://labs.phaser.io/assets/sprites/gem.png'); // Placeholder item
        this.load.image('oven', 'https://labs.phaser.io/assets/sprites/bomb.png'); // Placeholder hazard
        this.load.image('chef', 'https://labs.phaser.io/assets/sprites/phaser-dude.png'); // Placeholder player
        break;
      default:
        // Fallback assets
        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
        this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
        this.load.image('bomb', 'https://labs.phaser.io/assets/sprites/bomb.png');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/dude.png');
        break;
    }
  }

  create() {
    // Background
    this.add.image(400, 300, 'sky').setScale(2); // Scale to fit if needed

    // Platforms
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    // Cursors for input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Items to collect
    this.items = this.physics.add.group({
      key: this.minigameId === 'farmer' ? 'carrot' : 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.items.children.iterate((child) => {
      (child as Phaser.Physics.Arcade.Image).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      this.physics.add.collider(child, platforms);
      return true;
    });

    this.physics.add.overlap(this.player, this.items, this.collectItem, undefined, this);

    // Score Text
    this.scoreText = this.add.text(
      this.isRTL ? this.cameras.main.width - 16 : 16,
      16,
      `${this.t('game_score' as TranslationKeys)}: 0`,
      { fontSize: '32px', color: '#000' }
    );
    this.scoreText.setOrigin(this.isRTL ? 1 : 0, 0); // Adjust origin for RTL

    // Timer Text
    this.timerText = this.add.text(
      this.isRTL ? 16 : this.cameras.main.width - 16,
      16,
      `${this.t('game_time_left' as TranslationKeys)}: ${this.timeLeft}`,
      { fontSize: '32px', color: '#000' }
    );
    this.timerText.setOrigin(this.isRTL ? 0 : 1, 0); // Adjust origin for RTL

    // Game Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.timeLeft <= 0) {
      this.endGame();
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body!.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  private collectItem(player: Phaser.GameObjects.GameObject, item: Phaser.GameObjects.GameObject) {
    (item as Phaser.Physics.Arcade.Image).disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`${this.t('game_score' as TranslationKeys)}: ${this.score}`);

    if (this.items.countActive(true) === 0) {
      // All items collected, spawn more
      this.items.children.iterate((child) => {
        (child as Phaser.Physics.Arcade.Image).enableBody(true, child.x, 0, true, true);
        return true;
      });
    }
  }

  private updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`${this.t('game_time_left' as TranslationKeys)}: ${this.timeLeft}`);
    if (this.timeLeft <= 0) {
      this.timerEvent.destroy();
      this.endGame();
    }
  }

  private endGame() {
    this.physics.pause();
    this.player.setTint(0xff0000); // Player turns red
    this.onGameComplete(this.score);

    // Display "Game Over" message
    const gameOverText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.t('minigame_game_over' as TranslationKeys),
      { fontSize: '64px', color: '#ff0000', fontWeight: 'bold' }
    );
    gameOverText.setOrigin(0.5);
  }
}

