import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PointDisplay } from './PointDisplay';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

describe('PointDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the points correctly', () => {
    render(
      <I18nProvider>
        <PointDisplay points={1234} />
      </I18nProvider>
    );

    expect(screen.getByText('game_player_points_label')).toBeTruthy();
    expect(screen.getByText('1234')).toBeTruthy();
  });

  it('renders 0 points correctly', () => {
    render(
      <I18nProvider>
        <PointDisplay points={0} />
      </I18nProvider>
    );

    expect(screen.getByText('game_player_points_label')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('adjusts layout for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <PointDisplay points={500} />
      </I18nProvider>
    );

    const container = getByText('game_player_points_label').parent?.parent; // Get the main container View
    expect(container?.props.style).toContainEqual(expect.objectContaining({ flexDirection: 'row-reverse' }));
    expect(getByText('game_player_points_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('500').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
  });

  it('adjusts layout for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <I18nProvider>
        <PointDisplay points={500} />
      </I18nProvider>
    );

    const container = getByText('game_player_points_label').parent?.parent; // Get the main container View
    expect(container?.props.style).toContainEqual(expect.objectContaining({ flexDirection: 'row' }));
    expect(getByText('game_player_points_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('500').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
  });
});
