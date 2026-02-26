import 'phaser'; // Import Phaser to make its types available globally
import { JobScene } from './JobScene';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock Phaser.Scene and its methods
const mockScene = {
  add: {
    text: jest.fn(() => ({
      setOrigin: jest.fn().mockReturnThis(),
      setDepth: jest.fn().mockReturnThis(),
      setFontSize: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setText: jest.fn().mockReturnThis(),
    })),
    image: jest.fn().mockReturnThis(),
    sprite: jest.fn().mockReturnThis(),
  },
  physics: {
    add: {
      sprite: jest.fn(() => ({
        setBounce: jest.fn().mockReturnThis(),
        setCollideWorldBounds: jest.fn().mockReturnThis(),
        setVelocityX: jest.fn().mockReturnThis(),
        setDragX: jest.fn().mockReturnThis(),
        setGravityY: jest.fn().mockReturnThis(),
      })),
      collider: jest.fn().mockReturnThis(),
    },
    world: {
      setBounds: jest.fn(),
    },
  },
  input: {
    keyboard: {
      createCursorKeys: jest.fn(() => ({
        left: { isDown: false },
        right: { isDown: false },
        up: { isDown: false },
      })),
    },
  },
  load: {
    image: jest.fn(),
  },
  time: {
    addEvent: jest.fn(),
  },
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  sys: {
    game: {
      events: {
        on: jest.fn(),
      },
    },
  },
  cameras: {
    main: {
      width: 800,
      height: 600,
    },
  },
  registry: {
    set: jest.fn(),
  },
  // Mock any other Phaser.Scene properties/methods used
} as unknown as Phaser.Scene;

// Mock the Phaser.Scene constructor itself
// This allows us to instantiate JobScene without a real Phaser environment
class MockPhaserScene {
  constructor(config: string | Phaser.Types.Scenes.Settings.SceneConfig) {
    // Simulate Phaser's internal scene setup
    Object.assign(this, mockScene);
    (this as any).sys = {
      game: {
        events: {
          on: jest.fn(),
        },
      },
      scene: {
        key: typeof config === 'string' ? config : config.key,
      },
    };
  }
  // Add any other methods that Phaser.Scene would have and JobScene might call
  scene = {
    start: jest.fn(),
    stop: jest.fn(),
    get: jest.fn(() => this),
  };
  events = {
    on: jest.fn(),
    off: jest.fn(),
  };
  add = {
    text: jest.fn(() => ({
      setOrigin: jest.fn().mockReturnThis(),
      setDepth: jest.fn().mockReturnThis(),
      setFontSize: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setText: jest.fn().mockReturnThis(),
    })),
    image: jest.fn().mockReturnThis(),
    sprite: jest.fn().mockReturnThis(),
  };
  physics = {
    add: {
      sprite: jest.fn(() => ({
        setBounce: jest.fn().mockReturnThis(),
        setCollideWorldBounds: jest.fn().mockReturnThis(),
        setVelocityX: jest.fn().mockReturnThis(),
        setDragX: jest.fn().mockReturnThis(),
        setGravityY: jest.fn().mockReturnThis(),
      })),
      collider: jest.fn().mockReturnThis(),
    },
    world: {
      setBounds: jest.fn(),
    },
  };
  input = {
    keyboard: {
      createCursorKeys: jest.fn(() => ({
        left: { isDown: false },
        right: { isDown: false },
        up: { isDown: false },
      })),
    },
  };
  load = {
    image: jest.fn(),
  };
  time = {
    addEvent: jest.fn(),
  };
  cameras = {
    main: {
      width: 800,
      height: 600,
    },
  };
  registry = {
    set: jest.fn(),
  };
}

// Replace Phaser.Scene with our mock
(Phaser as any).Scene = MockPhaserScene;

describe('JobScene', () => {
  let jobScene: JobScene;
  const mockOnGameComplete = jest.fn();
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    jest.clearAllMocks();
    jobScene = new JobScene();
    jobScene.initData({
      minigameId: 'farmer',
      onGameComplete: mockOnGameComplete,
      isRTL: false,
      t: mockT,
    });
  });

  it('should be initialized with the correct key', () => {
    expect((jobScene as any).sys.scene.key).toBe('JobScene');
  });

  it('initData should set properties correctly', () => {
    expect((jobScene as any).minigameId).toBe('farmer');
    expect((jobScene as any).onGameComplete).toBe(mockOnGameComplete);
    expect((jobScene as any).isRTL).toBe(false);
    expect((jobScene as any).t).toBe(mockT);
  });

  it('preload should load necessary assets', () => {
    jobScene.preload();
    expect(jobScene.load.image).toHaveBeenCalledWith('sky', 'assets/sky.png');
    expect(jobScene.load.image).toHaveBeenCalledWith('ground', 'assets/platform.png');
    expect(jobScene.load.image).toHaveBeenCalledWith('star', 'assets/star.png');
    expect(jobScene.load.image).toHaveBeenCalledWith('bomb', 'assets/bomb.png');
    expect(jobScene.load.image).toHaveBeenCalledWith('dude', 'assets/dude.png'); // This is a spritesheet, but mock as image for simplicity
  });

  it('create should set up the game world', () => {
    jobScene.create();

    expect(jobScene.add.image).toHaveBeenCalledWith(400, 300, 'sky');
    expect(jobScene.physics.world.setBounds).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(jobScene.physics.add.sprite).toHaveBeenCalledWith(100, 450, 'dude');
    expect(jobScene.add.text).toHaveBeenCalledWith(16, 16, 'score_label', expect.any(Object));
    expect(jobScene.add.text).toHaveBeenCalledWith(650, 16, 'level_label', expect.any(Object));
    expect(jobScene.input.keyboard.createCursorKeys).toHaveBeenCalledTimes(1);
  });

  it('create should set up platforms correctly', () => {
    jobScene.create();
    expect(jobScene.physics.add.staticGroup).toHaveBeenCalledTimes(1);
    const staticGroupMock = (jobScene.physics.add.staticGroup as jest.Mock).mock.results[0].value;
    expect(staticGroupMock.create).toHaveBeenCalledWith(400, 568, 'ground');
    expect(staticGroupMock.create).toHaveBeenCalledWith(600, 400, 'ground');
    expect(staticGroupMock.create).toHaveBeenCalledWith(50, 250, 'ground');
    expect(staticGroupMock.create).toHaveBeenCalledWith(750, 220, 'ground');
  });

  it('create should set up player physics', () => {
    jobScene.create();
    const playerMock = (jobScene.physics.add.sprite as jest.Mock).mock.results[0].value;
    expect(playerMock.setBounce).toHaveBeenCalledWith(0.2);
    expect(playerMock.setCollideWorldBounds).toHaveBeenCalledWith(true);
  });

  it('collectStar should increase score and spawn new stars/bombs', () => {
    jobScene.create();
    const starMock = { disableBody: jest.fn(), enableBody: jest.fn(), x: 100, y: 100 };
    const playerMock = (jobScene.physics.add.sprite as jest.Mock).mock.results[0].value;

    // Simulate collecting a star
    (jobScene as any).collectStar(playerMock, starMock);

    expect(starMock.disableBody).toHaveBeenCalledWith(true, true);
    expect((jobScene as any).score).toBe(10);
    expect((jobScene as any).scoreText.setText).toHaveBeenCalledWith('score_label');
    expect((jobScene as any).stars.children.entries[0].enableBody).toHaveBeenCalledWith(true, expect.any(Number), 0, true, true);
    expect((jobScene as any).bombs.create).toHaveBeenCalledWith(expect.any(Number), 16, 'bomb');
  });

  it('hitBomb should end the game', () => {
    jobScene.create();
    const playerMock = (jobScene.physics.add.sprite as jest.Mock).mock.results[0].value;
    const bombMock = { disableBody: jest.fn() };

    // Simulate hitting a bomb
    (jobScene as any).hitBomb(playerMock, bombMock);

    expect((jobScene as any).physics.pause).toHaveBeenCalledTimes(1);
    expect(playerMock.setTint).toHaveBeenCalledWith(0xff0000);
    expect(playerMock.anims.play).toHaveBeenCalledWith('turn');
    expect((jobScene as any).gameOver).toBe(true);
    expect(mockOnGameComplete).toHaveBeenCalledWith(0); // Assuming score is 0 at game over
  });

  it('update should handle player movement (LTR)', () => {
    jobScene.create();
    const playerMock = (jobScene.physics.add.sprite as jest.Mock).mock.results[0].value;
    const cursorKeys = jobScene.input.keyboard.createCursorKeys();

    // Simulate left movement
    cursorKeys.left.isDown = true;
    jobScene.update();
    expect(playerMock.setVelocityX).toHaveBeenCalledWith(-160);
    expect(playerMock.anims.play).toHaveBeenCalledWith('left', true);

    // Simulate right movement
    cursorKeys.left.isDown = false;
    cursorKeys.right.isDown = true;
    jobScene.update();
    expect(playerMock.setVelocityX).toHaveBeenCalledWith(160);
    expect(playerMock.anims.play).toHaveBeenCalledWith('right', true);

    // Simulate no horizontal movement
    cursorKeys.right.isDown = false;
    jobScene.update();
    expect(playerMock.setVelocityX).toHaveBeenCalledWith(0);
    expect(playerMock.anims.play).toHaveBeenCalledWith('turn');

    // Simulate jump
    cursorKeys.up.isDown = true;
    playerMock.body.touching.down = true; // Player is on ground
    jobScene.update();
    expect(playerMock.setVelocityY).toHaveBeenCalledWith(-330);
  });

  it('update should handle player movement (RTL)', () => {
    jobScene.initData({
      minigameId: 'farmer',
      onGameComplete: mockOnGameComplete,
      isRTL: true, // Set RTL to true
      t: mockT,
    });
    jobScene.create();
    const playerMock = (jobScene.physics.add.sprite as jest.Mock).mock.results[0].value;
    const cursorKeys = jobScene.input.keyboard.createCursorKeys();

    // Simulate left movement (should be right in RTL)
    cursorKeys.left.isDown = true;
    jobScene.update();
    expect(playerMock.setVelocityX).toHaveBeenCalledWith(160); // Left key moves right in RTL
    expect(playerMock.anims.play).toHaveBeenCalledWith('right', true);

    // Simulate right movement (should be left in RTL)
    cursorKeys.left.isDown = false;
    cursorKeys.right.isDown = true;
    jobScene.update();
    expect(playerMock.setVelocityX).toHaveBeenCalledWith(-160); // Right key moves left in RTL
    expect(playerMock.anims.play).toHaveBeenCalledWith('left', true);
  });

  it('should increase level after collecting enough stars', () => {
    jobScene.create();
    const starMock = { disableBody: jest.fn(), enableBody: jest.fn(), x: 100, y: 100 };
    const playerMock = (jobScene.physics.add.sprite as jest.Mock).mock.results[0].value;

    // Collect 12 stars to reach next level
    for (let i = 0; i < 12; i++) {
      (jobScene as any).collectStar(playerMock, starMock);
    }

    expect((jobScene as any).level).toBe(2);
    expect((jobScene as any).levelText.setText).toHaveBeenCalledWith('level_label');
  });

  it('should call onGameComplete with final score when game is over', () => {
    jobScene.create();
    (jobScene as any).score = 100;
    (jobScene as any).gameOver = true; // Manually set game over
    jobScene.update(); // Trigger update cycle

    // onGameComplete is called in hitBomb, so we test that path
    const playerMock = (jobScene.physics.add.sprite as jest.Mock).mock.results[0].value;
    const bombMock = { disableBody: jest.fn() };
    (jobScene as any).hitBomb(playerMock, bombMock);

    expect(mockOnGameComplete).toHaveBeenCalledWith(100);
  });
});
