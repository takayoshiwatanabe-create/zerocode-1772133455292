import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { PurchaseApprovalModal } from './PurchaseApprovalModal';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

describe('PurchaseApprovalModal', () => {
  const mockOnClose = jest.fn();
  const mockOnApprove = jest.fn();
  const mockOnReject = jest.fn();

  const mockPurchase = {
    id: 'purchase-1',
    childNickname: 'Alice',
    itemName: 'Magic Wand',
    itemDescription: 'A magical wand to cast spells in the game.',
    cost: 500,
    currency: 'points',
    timestamp: '2024-07-20T09:30:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isVisible is false', () => {
    render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={false}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );

    expect(screen.queryByText('purchase_approval_modal_title')).toBeNull();
  });

  it('renders correctly when isVisible is true', () => {
    render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );

    expect(screen.getByText('purchase_approval_modal_title')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Magic Wand')).toBeTruthy();
    expect(screen.getByText('A magical wand to cast spells in the game.')).toBeTruthy();
    expect(screen.getByText(/purchase_approval_modal_cost/)).toHaveTextContent('500 points_unit');
    expect(screen.getByText('purchase_approval_modal_approve_button')).toBeTruthy();
    expect(screen.getByText('purchase_approval_modal_reject_button')).toBeTruthy();
    expect(screen.getByText('purchase_approval_modal_close_button')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('purchase_approval_modal_close_button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onApprove when approve button is pressed', () => {
    render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('purchase_approval_modal_approve_button'));
    expect(mockOnApprove).toHaveBeenCalledWith(mockPurchase.id);
  });

  it('calls onReject when reject button is pressed', () => {
    render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('purchase_approval_modal_reject_button'));
    expect(mockOnReject).toHaveBeenCalledWith(mockPurchase.id);
  });

  it('disables buttons and shows loading indicator when isLoading is true', () => {
    render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={true}
        />
      </I18nProvider>
    );

    expect(screen.getByText('purchase_approval_modal_approve_button')).toBeDisabled();
    expect(screen.getByText('purchase_approval_modal_reject_button')).toBeDisabled();
    expect(screen.getByText('purchase_approval_modal_close_button')).toBeDisabled();
    expect(screen.getAllByTestId('activity-indicator').length).toBeGreaterThan(0); // Check for at least one activity indicator
  });

  it('displays real money currency correctly', () => {
    const realMoneyPurchase = { ...mockPurchase, currency: 'real_money', cost: 10 };
    render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={realMoneyPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );
    expect(screen.getByText(/purchase_approval_modal_cost/)).toHaveTextContent('10 real_money_unit');
  });

  it('adjusts text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );

    expect(getByText('purchase_approval_modal_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('Alice').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('Magic Wand').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('A magical wand to cast spells in the game.').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText(/purchase_approval_modal_cost/).props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));

    // Check button alignment
    expect(getByText('purchase_approval_modal_approve_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-end' }));
    expect(getByText('purchase_approval_modal_reject_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-end' }));
    expect(getByText('purchase_approval_modal_close_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-start' }));
  });

  it('adjusts text alignment for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <I18nProvider>
        <PurchaseApprovalModal
          isVisible={true}
          onClose={mockOnClose}
          purchase={mockPurchase}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
          isLoading={false}
        />
      </I18nProvider>
    );

    expect(getByText('purchase_approval_modal_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('Alice').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('Magic Wand').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('A magical wand to cast spells in the game.').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText(/purchase_approval_modal_cost/).props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));

    // Check button alignment
    expect(getByText('purchase_approval_modal_approve_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-start' }));
    expect(getByText('purchase_approval_modal_reject_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-start' }));
    expect(getByText('purchase_approval_modal_close_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-end' }));
  });
});
