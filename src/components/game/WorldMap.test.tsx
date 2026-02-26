import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { WorldMap } from './WorldMap';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

describe('WorldMap', () => {
  const mockOnLocationSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders map image and location pins', () => {
    render(
      <I18nProvider>
        <WorldMap
          playerLevel={1}
          currentLocation="home_village"
          onLocationSelect={mockOnLocationSelect}
        />
      </I18nProvider>
    );

    expect(screen.getByLabelText('game_world_map_alt_text')).toBeTruthy();
    expect(screen.getByText('location_home_village')).toBeTruthy();
    expect(screen.getByText('location_forest_outpost')).toBeTruthy();
    expect(screen.getByText('location_mountain_peak')).toBeTruthy();
    expect(screen.getByText('location_desert_oasis')).toBeTruthy();
  });

  it('marks current location with player icon', () => {
    render(
      <I18nProvider>
        <WorldMap
          playerLevel={1}
          currentLocation="home_village"
          onLocationSelect={mockOnLocationSelect}
        />
      </I18nProvider>
    );

    const homeVillagePin = screen.getByText('location_home_village');
    expect(homeVillagePin.parent?.findByText('📍')).toBeTruthy();
  });

  it('locks inaccessible locations and disables interaction', () => {
    render(
      <I18nProvider>
        <WorldMap
          playerLevel={1} // Only home_village is accessible
          currentLocation="home_village"
          onLocationSelect={mockOnLocationSelect}
        />
      </I18nProvider>
    );

    const homeVillagePin = screen.getByText('location_home_village');
    const forestOutpostPin = screen.getByText('location_forest_outpost');

    expect(homeVillagePin.parent?.props.accessibilityState?.disabled).toBeFalsy();
    expect(homeVillagePin.parent?.props.style).toContainEqual(expect.objectContaining({ backgroundColor: '#fcd34d' })); // Current location color

    expect(forestOutpostPin.parent?.findByText('🔒')).toBeTruthy();
    expect(forestOutpostPin.parent?.props.accessibilityState?.disabled).toBeTruthy();
    expect(forestOutpostPin.parent?.props.style).toContainEqual(expect.objectContaining({ backgroundColor: '#9ca3af' })); // Locked color

    fireEvent.press(homeVillagePin);
    expect(mockOnLocationSelect).toHaveBeenCalledWith('home_village');

    fireEvent.press(forestOutpostPin);
    expect(mockOnLocationSelect).not.toHaveBeenCalledWith('forest_outpost'); // Should not be called for locked location
  });

  it('unlocks locations as player level increases', () => {
    render(
      <I18nProvider>
        <WorldMap
          playerLevel={2} // Home Village and Forest Outpost accessible
          currentLocation="home_village"
          onLocationSelect={mockOnLocationSelect}
        />
      </I18nProvider>
    );

    const homeVillagePin = screen.getByText('location_home_village');
    const forestOutpostPin = screen.getByText('location_forest_outpost');
    const mountainPeakPin = screen.getByText('location_mountain_peak');

    expect(homeVillagePin.parent?.props.accessibilityState?.disabled).toBeFalsy();
    expect(forestOutpostPin.parent?.props.accessibilityState?.disabled).toBeFalsy();
    expect(forestOutpostPin.parent?.props.style).toContainEqual(expect.objectContaining({ backgroundColor: '#3b82f6' })); // Unlocked color

    expect(mountainPeakPin.parent?.findByText('🔒')).toBeTruthy();
    expect(mountainPeakPin.parent?.props.accessibilityState?.disabled).toBeTruthy();

    fireEvent.press(forestOutpostPin);
    expect(mockOnLocationSelect).toHaveBeenCalledWith('forest_outpost');
  });

  it('renders the legend correctly', () => {
    render(
      <I18nProvider>
        <WorldMap
          playerLevel={1}
          currentLocation="home_village"
          onLocationSelect={mockOnLocationSelect}
        />
      </I18nProvider>
    );

    expect(screen.getByText('game_map_legend_title')).toBeTruthy();
    expect(screen.getByText('game_map_legend_current_location')).toBeTruthy();
    expect(screen.getByText('game_map_legend_unlocked_location')).toBeTruthy();
    expect(screen.getByText('game_map_legend_locked_location')).toBeTruthy();
  });

  it('adjusts legend position and text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <WorldMap
          playerLevel={1}
          currentLocation="home_village"
          onLocationSelect={mockOnLocationSelect}
        />
      </I18nProvider>
    );

    const legendContainer = screen.getByText('game_map_legend_title').parent;
    expect(legendContainer?.props.style).toContainEqual(expect.objectContaining({ left: 10 }));
    expect(legendContainer?.props.style).not.toContainEqual(expect.objectContaining({ right: 10 }));

    expect(getByText('game_map_legend_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('game_map_legend_current_location').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));

    const legendItem = screen.getByText('game_map_legend_current_location').parent;
    expect(legendItem?.props.style).toContainEqual(expect.objectContaining({ flexDirection: 'row-reverse' }));
    const colorBox = legendItem?.children[0];
    expect(colorBox?.props.style).toContainEqual(expect.objectContaining({ marginLeft: 8 }));
    expect(colorBox?.props.style).not.toContainEqual(expect.objectContaining({ marginRight: 8 }));
  });

  it('adjusts legend position and text alignment for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <I18nProvider>
        <WorldMap
          playerLevel={1}
          currentLocation="home_village"
          onLocationSelect={mockOnLocationSelect}
        />
      </I18nProvider>
    );

    const legendContainer = screen.getByText('game_map_legend_title').parent;
    expect(legendContainer?.props.style).toContainEqual(expect.objectContaining({ right: 10 }));
    expect(legendContainer?.props.style).not.toContainEqual(expect.objectContaining({ left: 10 }));

    expect(getByText('game_map_legend_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('game_map_legend_current_location').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));

    const legendItem = screen.getByText('game_map_legend_current_location').parent;
    expect(legendItem?.props.style).toContainEqual(expect.objectContaining({ flexDirection: 'row' }));
    const colorBox = legendItem?.children[0];
    expect(colorBox?.props.style).toContainEqual(expect.objectContaining({ marginRight: 8 }));
    expect(colorBox?.props.style).not.toContainEqual(expect.objectContaining({ marginLeft: 8 }));
  });
});
