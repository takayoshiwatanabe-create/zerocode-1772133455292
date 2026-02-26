import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import Phaser from 'phaser';
import { JobScene } from '@/game/scenes/JobScene';
import { t } from '@/i18n';
import { TranslationKeys } from '@/i18n/translations';

interface PhaserGameContainerProps {
  minigameId: string;
  onGameReady: () => void;
  onGameComplete: (score: number) => void;
  isRTL: boolean;
}

export function PhaserGameContainer({
  minigameId,
  onGameReady,
  onGameComplete,
  isRTL,
}: PhaserGameContainerProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isGameInitialized, setIsGameInitialized] = useState(false);

  const destroyGame = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
      setIsGameInitialized(false);
      console.log('Phaser game destroyed.');
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // For React Native, we need a DOM element to attach Phaser to.
      // This is a common challenge. A common solution is to use react-native-webview
      // and inject HTML that contains the Phaser canvas.
      // For this project, given the Next.js + Expo Router setup, we'll assume
      // Phaser is primarily for web, or a more complex bridge would be needed for native.
      // For now, we'll render a placeholder for native.
      console.warn("Phaser.Game is primarily designed for web. On React Native, consider using a WebView or a native bridge.");
      return;
    }

    // Only initialize if not already initialized and ref is available
    if (isGameInitialized && gameRef.current) {
      console.log('Game already initialized, skipping.');
      return;
    }

    // Ensure the container is available before initializing Phaser
    if (!gameContainerRef.current) {
      console.warn('Game container ref not available, deferring Phaser initialization.');
      return;
    }

    console.log('Initializing Phaser game...');

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current, // Use ref for web
      backgroundColor: '#33aaff',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: [JobScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    setIsGameInitialized(true);

    // Pass data to the scene and set up event listeners
    game.events.on(Phaser.Core.Events.READY, () => {
      console.log('Phaser game is ready.');
      const jobScene = game.scene.getScene('JobScene') as JobScene;
      if (jobScene) {
        jobScene.initData({
          minigameId,
          onGameComplete,
          isRTL,
          t: (key: TranslationKeys, options?: any) => t(key, options),
        });
        onGameReady();
      }
    });

    // Cleanup function
    return () => {
      destroyGame();
    };
  }, [minigameId, onGameReady, onGameComplete, isRTL, isGameInitialized, destroyGame, gameContainerRef.current]); // Add gameContainerRef.current to dependencies

  // For web, render a div that Phaser can attach to
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <div id="game-container" ref={gameContainerRef} style={styles.phaserCanvasWeb} />
      </View>
    );
  }

  // For native, render a placeholder or a WebView if integration is planned
  return (
    <View style={styles.nativePlaceholder}>
      <Text style={styles.nativePlaceholderText}>
        {t("minigame_native_placeholder" as TranslationKeys)}
      </Text>
      <Text style={styles.nativePlaceholderSubText}>
        {t("minigame_native_placeholder_web_only" as TranslationKeys)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
    aspectRatio: 4 / 3, // Maintain aspect ratio for the game canvas
    maxWidth: 800, // Max width for the game
    backgroundColor: '#000', // Black background for the game area
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    alignSelf: 'center',
  },
  phaserCanvasWeb: {
    width: '100%',
    height: '100%',
    display: 'flex', // Ensure the canvas fills the div
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: '100%',
  },
  nativePlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c4a6e',
    textAlign: 'center',
    marginBottom: 10,
  },
  nativePlaceholderSubText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
});
