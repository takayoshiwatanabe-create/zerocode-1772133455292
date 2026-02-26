import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, GestureResponderEvent } from 'react-native';
import { getIsRTL } from '@/i18n';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  isLoading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  onPress,
  title,
  className = '',
  textClassName = '',
  disabled = false,
  isLoading = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const isRTL = getIsRTL();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={twMerge(
        'flex flex-row items-center justify-center px-4 py-2 rounded-md bg-blue-600 active:bg-blue-700',
        (disabled || isLoading) && 'opacity-70 bg-blue-300',
        className
      )}
      style={isRTL ? styles.rtlButton : styles.ltrButton}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className={twMerge('text-white font-bold text-base', textClassName)}
          style={isRTL ? styles.rtlText : styles.ltrText}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ltrButton: {
    flexDirection: 'row',
  },
  rtlButton: {
    flexDirection: 'row-reverse',
  },
  ltrText: {
    textAlign: 'left',
  },
  rtlText: {
    textAlign: 'right',
  },
});
