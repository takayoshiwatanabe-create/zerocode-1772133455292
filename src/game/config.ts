import Phaser from 'phaser';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#33aaff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // Scenes will be added dynamically by PhaserGameContainer
  scene: [],
};

// Define specific minigame configurations
export interface MinigameConfig {
  id: string;
  sceneKey: string;
  assets: { key: string; path: string; type: 'image' | 'spritesheet' | 'audio' }[];
  initialPlayerPosition: { x: number; y: number };
  goalPosition: { x: number; y: number };
  obstacles: { x: number; y: number; type: 'rock' | 'tree' }[];
  pointsPerAction: number;
  timeLimitSeconds: number;
  educationFactKey: string; // Key for an educational fact related to the job
}

export const minigameConfigs: { [key: string]: MinigameConfig } = {
  farmer: {
    id: 'farmer',
    sceneKey: 'FarmerMinigameScene',
    assets: [
      { key: 'sky', path: 'https://labs.phaser.io/assets/skies/sky4.png', type: 'image' },
      { key: 'ground', path: 'https://labs.phaser.io/assets/platform.png', type: 'image' },
      { key: 'player', path: 'https://labs.phaser.io/assets/sprites/dude.png', type: 'spritesheet' },
      { key: 'star', path: 'https://labs.phaser.io/assets/star.png', type: 'image' },
      { key: 'bomb', path: 'https://labs.phaser.io/assets/bomb.png', type: 'image' },
      { key: 'seed', path: 'https://via.placeholder.com/32/8bc34a/ffffff?text=S', type: 'image' }, // Mock seed asset
      { key: 'crop', path: 'https://via.placeholder.com/32/4caf50/ffffff?text=C', type: 'image' }, // Mock crop asset
    ],
    initialPlayerPosition: { x: 100, y: 450 },
    goalPosition: { x: 700, y: 450 },
    obstacles: [
      { x: 300, y: 500, type: 'rock' },
      { x: 500, y: 500, type: 'tree' },
    ],
    pointsPerAction: 10,
    timeLimitSeconds: 60,
    educationFactKey: 'minigame_farmer_fact',
  },
  baker: {
    id: 'baker',
    sceneKey: 'BakerMinigameScene',
    assets: [
      { key: 'kitchen_bg', path: 'https://via.placeholder.com/800x600/f8bbd0/ffffff?text=Kitchen', type: 'image' },
      { key: 'oven', path: 'https://via.placeholder.com/64/ff9800/ffffff?text=Oven', type: 'image' },
      { key: 'dough', path: 'https://via.placeholder.com/32/d4e157/ffffff?text=D', type: 'image' },
      { key: 'bread', path: 'https://via.placeholder.com/32/795548/ffffff?text=B', type: 'image' },
    ],
    initialPlayerPosition: { x: 150, y: 400 },
    goalPosition: { x: 650, y: 400 },
    obstacles: [], // Bakers might not have physical obstacles in this simple game
    pointsPerAction: 15,
    timeLimitSeconds: 75,
    educationFactKey: 'minigame_baker_fact',
  },
  // Add more minigame configurations here
};
