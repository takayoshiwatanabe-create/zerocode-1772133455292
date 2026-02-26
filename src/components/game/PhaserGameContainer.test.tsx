import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { PhaserGameContainer } from './PhaserGameContainer';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';
import { Platform } from 'react-native';
import Phaser from 'phaser';

// Mock Phaser to prevent actual game initialization in tests
jest.mock('phaser', () => {
  const mockGame = {
    events: {
      on: jest.fn((event, callback) => {
        if (event === Phaser.Core.Events.READY) {
          // Simulate game ready after a short delay
          setTimeout(() => callback(), 100);
        }
      }),
    },
    scene: {
      getScene: jest.fn(() => ({
        initData: jest.fn(),
      })),
    },
    destroy: jest.fn(),
  };
  return {
    __esModule: true,
    default: jest.fn(() => mockGame),
    AUTO: 0, // Mock Phaser.AUTO
    Scale: {
      FIT: 0,
      CENTER_BOTH: 0,
    },
    Core: {
      Events: {
        READY: 'ready',
      },
    },
  };
});

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

describe('PhaserGameContainer', () => {
  const mockOnGameReady = jest.fn();
  const mockOnGameComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS for each test
    Platform.OS = 'web';
  });

  it('renders a placeholder for native platforms', () => {
    Platform.OS = 'ios'; // Simulate native
    render(
      <I18nProvider>
        <PhaserGameContainer
          minigameId="test-game"
          onGameReady={mockOnGameReady}
          onGameComplete={mockOnGameComplete}
          isRTL={false}
        />
      </I18nProvider>
    );

    expect(screen.getByText('minigame_native_placeholder')).toBeTruthy();
    expect(screen.getByText('minigame_native_placeholder_web_only')).toBeTruthy();
    expect(Phaser.default).not.toHaveBeenCalled();
  });

  it('initializes Phaser game on web platform', async () => {
    Platform.OS = 'web'; // Simulate web
    render(
      <I18nProvider>
        <PhaserGameContainer
          minigameId="test-game"
          onGameReady={mockOnGameReady}
          onGameComplete={mockOnGameComplete}
          isRTL={false}
        />
      </I18nProvider>
    );

    // Check if the game container div is rendered
    expect(screen.getByTestId('game-container')).toBeTruthy();

    await waitFor(() => {
      expect(Phaser.default).toHaveBeenCalledTimes(1);
      expect(Phaser.default).toHaveBeenCalledWith(expect.objectContaining({
        parent: screen.getByTestId('game-container'),
        width: 800,
        height: 600,
      }));
      expect(mockOnGameReady).toHaveBeenCalledTimes(1);
    }, { timeout: 200 }); // Give time for the simulated ready event
  });

  it('passes correct data to JobScene on game ready', async () => {
    Platform.OS = 'web';
    const mockJobScene = { initData: jest.fn() };
    (Phaser.default as jest.Mock).mockImplementation(() => ({
      events: {
        on: jest.fn((event, callback) => {
          if (event === Phaser.Core.Events.READY) {
            setTimeout(() => callback(), 100);
          }
        }),
      },
      scene: {
        getScene: jest.fn(() => mockJobScene),
      },
      destroy: jest.fn(),
    }));

    render(
      <I18nProvider>
        <PhaserGameContainer
          minigameId="farmer"
          onGameReady={mockOnGameReady}
          onGameComplete={mockOnGameComplete}
          isRTL={true}
        />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(mockJobScene.initData).toHaveBeenCalledWith(expect.objectContaining({
        minigameId: 'farmer',
        onGameComplete: mockOnGameComplete,
        isRTL: true,
        t: expect.any(Function),
      }));
    }, { timeout: 200 });
  });

  it('destroys the Phaser game on unmount', async () => {
    Platform.OS = 'web';
    const mockGameInstance = {
      events: { on: jest.fn() },
      scene: { getScene: jest.fn(() => ({ initData: jest.fn() })) },
      destroy: jest.fn(),
    };
    (Phaser.default as jest.Mock).mockReturnValue(mockGameInstance);

    const { unmount } = render(
      <I18nProvider>
        <PhaserGameContainer
          minigameId="test-game"
          onGameReady={mockOnGameReady}
          onGameComplete={mockOnGameComplete}
          isRTL={false}
        />
      </I18nProvider>
    );

    await waitFor(() => expect(Phaser.default).toHaveBeenCalled()); // Ensure game is initialized
    unmount();

    expect(mockGameInstance.destroy).toHaveBeenCalledWith(true);
  });
});
