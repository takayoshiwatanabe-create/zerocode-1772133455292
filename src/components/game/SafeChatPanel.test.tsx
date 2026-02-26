import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeChatPanel } from './SafeChatPanel';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';
import { predefinedPhrases } from '@/data/predefinedPhrases';

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

describe('SafeChatPanel', () => {
  const mockOnSendMessage = jest.fn();
  const currentUserId = 'user-1';
  const recipientId = 'friend-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "no messages" text when messages array is empty', () => {
    render(
      <I18nProvider>
        <SafeChatPanel
          currentUserId={currentUserId}
          recipientId={recipientId}
          messages={[]}
          onSendMessage={mockOnSendMessage}
          isRTL={false}
        />
      </I18nProvider>
    );

    expect(screen.getByText('chat_no_messages')).toBeTruthy();
  });

  it('renders messages correctly, distinguishing sender and recipient', () => {
    const messages = [
      { id: '1', senderId: 'friend-1', recipientId: currentUserId, phraseKey: 'chat_phrase_hello', timestamp: 1678886400000 },
      { id: '2', senderId: currentUserId, recipientId: 'friend-1', phraseKey: 'chat_phrase_how_are_you', timestamp: 1678886460000 },
    ];

    render(
      <I18nProvider>
        <SafeChatPanel
          currentUserId={currentUserId}
          recipientId={recipientId}
          messages={messages}
          onSendMessage={mockOnSendMessage}
          isRTL={false}
        />
      </I18nProvider>
    );

    const helloMessage = screen.getByText('chat_phrase_hello');
    const howAreYouMessage = screen.getByText('chat_phrase_how_are_you');

    // Check alignment for LTR
    expect(helloMessage.parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-start' })); // Other message
    expect(howAreYouMessage.parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-end' })); // My message
  });

  it('renders predefined phrase buttons', () => {
    render(
      <I18nProvider>
        <SafeChatPanel
          currentUserId={currentUserId}
          recipientId={recipientId}
          messages={[]}
          onSendMessage={mockOnSendMessage}
          isRTL={false}
        />
      </I18nProvider>
    );

    predefinedPhrases.forEach((phrase) => {
      expect(screen.getByText(phrase.key)).toBeTruthy();
    });
  });

  it('calls onSendMessage with the correct phrase key when a button is pressed', () => {
    render(
      <I18nProvider>
        <SafeChatPanel
          currentUserId={currentUserId}
          recipientId={recipientId}
          messages={[]}
          onSendMessage={mockOnSendMessage}
          isRTL={false}
        />
      </I18nProvider>
    );

    const firstPhraseButton = screen.getByText(predefinedPhrases[0].key);
    fireEvent.press(firstPhraseButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith(predefinedPhrases[0].key);
  });

  it('adjusts message alignment and text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);
    const messages = [
      { id: '1', senderId: 'friend-1', recipientId: currentUserId, phraseKey: 'chat_phrase_hello', timestamp: 1678886400000 },
      { id: '2', senderId: currentUserId, recipientId: 'friend-1', phraseKey: 'chat_phrase_how_are_you', timestamp: 1678886460000 },
    ];

    render(
      <I18nProvider>
        <SafeChatPanel
          currentUserId={currentUserId}
          recipientId={recipientId}
          messages={messages}
          onSendMessage={mockOnSendMessage}
          isRTL={true}
        />
      </I18nProvider>
    );

    const helloMessage = screen.getByText('chat_phrase_hello');
    const howAreYouMessage = screen.getByText('chat_phrase_how_are_you');

    // Check alignment for RTL
    expect(helloMessage.parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-end' })); // Other message
    expect(howAreYouMessage.parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-start' })); // My message

    expect(helloMessage.props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(howAreYouMessage.props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(screen.getByText('chat_no_messages').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
  });

  it('adjusts phrase button container direction for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <SafeChatPanel
          currentUserId={currentUserId}
          recipientId={recipientId}
          messages={[]}
          onSendMessage={mockOnSendMessage}
          isRTL={true}
        />
      </I18nProvider>
    );

    const phraseButtonsContainer = getByText(predefinedPhrases[0].key).parent?.parent; // Get the phrase buttons container View
    expect(phraseButtonsContainer?.props.style).toContainEqual(expect.objectContaining({ flexDirection: 'row-reverse' }));
  });
});
