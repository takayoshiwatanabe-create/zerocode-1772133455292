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
  private onGameComplete: ((score: number) => void) | null = null;
  private isRTL: boolean = false;
  private t: ((key: TranslationKeys, options?: any) => string) | null = null;

  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text | null = null;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private timeLeft: number = 30; // 30 seconds for the minigame

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
    console.log(`JobScene initialized for minigame: ${this.minigameId}, RTL: ${this.isRTL}`);
  }

  preload() {
    // Load assets based on minigameId
    // Example:
    if (this.minigameId === 'farmer') {
      this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');
      this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
      this.load.image('carrot', 'https://labs.phaser.io/assets/sprites/carrot.png');
      this.load.image('player', 'https://labs.phaser.io/assets/sprites/dude.png');
    } else if (this.minigameId === 'baker') {
      this.load.image('bakery_bg', 'https://via.placeholder.com/800x600/fce4ec/880e4f?text=Bakery');
      this.load.image('dough', 'https://via.placeholder.com/50x50/ffcc80/000000?text=Dough');
      this.load.image('oven', 'https://via.placeholder.com/100x100/bdbdbd/000000?text=Oven');
    }
    // Add more asset loading for other minigames
  }

  create() {
    if (!this.t) {
      console.error("Translation function 't' not available in JobScene.");
      return;
    }

    // Background
    if (this.minigameId === 'farmer') {
      this.add.image(400, 300, 'sky').setScale(1.5);
      const platforms = this.physics.add.staticGroup();
      platforms.create(400, 568, 'ground').setScale(2).refreshBody();
      platforms.create(600, 400, 'ground');
      platforms.create(50, 250, 'ground');
      platforms.create(750, 220, 'ground');

      // Player
      const player = this.physics.add.sprite(100, 450, 'player');
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      this.physics.add.collider(player, platforms);

      // Carrots (collectible items)
      const carrots = this.physics.add.group({
        key: 'carrot',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      });

      carrots.children.iterate((child: Phaser.GameObjects.GameObject) => {
        (child as Phaser.Physics.Arcade.Sprite).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        return true; // Indicate that iteration should continue
      });

      this.physics.add.collider(carrots, platforms);
      this.physics.add.overlap(player, carrots, this.collectCarrot, undefined, this);

      // Simple player controls
      const cursors = this.input.keyboard?.createCursorKeys();
      if (cursors) {
        this.input.keyboard?.on('keydown-LEFT', () => { player.setVelocityX(-160); });
        this.input.keyboard?.on('keydown-RIGHT', () => { player.setVelocityX(160); });
        this.input.keyboard?.on('keydown-UP', () => { if (player.body?.touching.down) player.setVelocityY(-330); });
        this.input.keyboard?.on('keyup-LEFT', () => { player.setVelocityX(0); });
        this.input.keyboard?.on('keyup-RIGHT', () => { player.setVelocityX(0); });
      }

    } else if (this.minigameId === 'baker') {
      this.add.image(400, 300, 'bakery_bg');
      this.add.image(600, 450, 'oven').setScale(0.8);

      const doughs = this.physics.add.group({
        key: 'dough',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 100, stepY: 50 }
      });

      doughs.children.iterate((child: Phaser.GameObjects.GameObject) => {
        (child as Phaser.Physics.Arcade.Sprite).setInteractive();
        this.input.setDraggable(child as Phaser.GameObjects.Sprite);
        return true;
      });

      this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      // Simple oven drop zone
      const ovenZone = this.add.zone(600, 450, 100, 100).setRectangleDropZone(100, 100);
      const dropZoneGraphics = this.add.graphics();
      dropZoneGraphics.lineStyle(2, 0xffff00);
      dropZoneGraphics.strokeRect(ovenZone.x - ovenZone.input.hitArea.width / 2, ovenZone.y - ovenZone.input.hitArea.height / 2, ovenZone.input.hitArea.width, ovenZone.input.hitArea.height);

      this.input.on('drop', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) => {
        if (dropZone === ovenZone) {
          gameObject.destroy();
          this.score += 50;
          this.updateScoreText();
        } else {
          gameObject.x = gameObject.input?.dragStartX || gameObject.x;
          gameObject.y = gameObject.input?.dragStartY || gameObject.y;
        }
      });
    }

    // Score Text
    this.scoreText = this.add.text(16, 16, `${this.t('minigame_score' as TranslationKeys)}: 0`, {
      fontSize: '32px',
      color: '#000',
      fontFamily: 'Arial',
    });
    this.scoreText.setOrigin(this.isRTL ? 1 : 0, 0); // Adjust origin for RTL
    this.scoreText.x = this.isRTL ? this.cameras.main.width - 16 : 16;

    // Timer Text
    const timerText = this.add.text(this.cameras.main.width - 16, 16, `${this.t('minigame_time_left' as TranslationKeys)}: ${this.timeLeft}`, {
      fontSize: '32px',
      color: '#000',
      fontFamily: 'Arial',
    });
    timerText.setOrigin(this.isRTL ? 0 : 1, 0); // Adjust origin for RTL
    timerText.x = this.isRTL ? 16 : this.cameras.main.width - 16;

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        timerText.setText(`${this.t('minigame_time_left' as TranslationKeys)}: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
          this.timerEvent?.destroy();
          this.endGame();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    // Game logic for continuous updates
  }

  private collectCarrot(player: Phaser.GameObjects.GameObject, carrot: Phaser.GameObjects.GameObject) {
    (carrot as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
    this.score += 10;
    this.updateScoreText();
  }

  private updateScoreText() {
    if (this.scoreText && this.t) {
      this.scoreText.setText(`${this.t('minigame_score' as TranslationKeys)}: ${this.score}`);
    }
  }

  private endGame() {
    console.log('Game Over! Final Score:', this.score);
    this.onGameComplete?.(this.score);
    this.scene.pause(); // Pause the scene instead of stopping immediately
  }
}
