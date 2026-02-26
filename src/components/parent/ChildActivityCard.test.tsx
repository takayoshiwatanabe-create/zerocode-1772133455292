import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ChildActivityCard } from './ChildActivityCard';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => {
    if (key === 'locale_code') return 'en-US'; // Mock locale for date formatting
    return key;
  }),
  getIsRTL: jest.fn(() => false),
}));

describe('ChildActivityCard', () => {
  const mockChild = {
    id: 'child-1',
    nickname: 'Alice',
    lastActive: '2024-07-20T10:00:00Z',
    points: 1250,
    stockHoldings: 5,
    pendingPurchases: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders child activity details correctly', () => {
    render(
      <I18nProvider>
        <ChildActivityCard child={mockChild} />
      </I18nProvider>
    );

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText(/child_activity_card_last_active/)).toHaveTextContent('Jul 20, 2024, 10:00 AM');
    expect(screen.getByText(/child_activity_card_points/)).toHaveTextContent('1250');
    expect(screen.getByText(/child_activity_card_stock_holdings/)).toHaveTextContent('5');
    expect(screen.getByText(/child_activity_card_pending_purchases/)).toHaveTextContent('2');
    expect(screen.getByText('child_activity_card_view_details')).toBeTruthy();
  });

  it('logs message when "View Details" button is pressed', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <I18nProvider>
        <ChildActivityCard child={mockChild} />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('child_activity_card_view_details'));
    expect(consoleSpy).toHaveBeenCalledWith('View details for Alice');
    consoleSpy.mockRestore();
  });

  it('adjusts layout and text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <ChildActivityCard child={mockChild} />
      </I18nProvider>
    );

    const cardContainer = getByText('Alice').parent?.parent; // Get the main card container View
    expect(cardContainer?.props.style).toContainEqual(expect.objectContaining({ flexDirection: 'row-reverse' }));

    expect(getByText('Alice').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText(/child_activity_card_last_active/).props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));

    const detailsButton = getByText('child_activity_card_view_details').parent;
    expect(detailsButton?.props.style).toContainEqual(expect.objectContaining({ marginRight: 16 }));
    expect(detailsButton?.props.style).not.toContainEqual(expect.objectContaining({ marginLeft: 16 }));
  });

  it('adjusts layout and text alignment for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <I18nProvider>
        <ChildActivityCard child={mockChild} />
      </I18nProvider>
    );

    const cardContainer = getByText('Alice').parent?.parent; // Get the main card container View
    expect(cardContainer?.props.style).toContainEqual(expect.objectContaining({ flexDirection: 'row' }));

    expect(getByText('Alice').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText(/child_activity_card_last_active/).props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));

    const detailsButton = getByText('child_activity_card_view_details').parent;
    expect(detailsButton?.props.style).toContainEqual(expect.objectContaining({ marginLeft: 16 }));
    expect(detailsButton?.props.style).not.toContainEqual(expect.objectContaining({ marginRight: 16 }));
  });
});
