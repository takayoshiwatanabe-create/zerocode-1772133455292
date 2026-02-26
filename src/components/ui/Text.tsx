import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { getIsRTL } from '@/i18n';
import { twMerge } from 'tailwind-merge';

interface TextProps extends RNTextProps {
  className?: string;
}

export function Text({ className, style, ...props }: TextProps) {
  const isRTL = getIsRTL();

  return (
    <RNText
      className={twMerge('text-gray-900', className)}
      style={[
        isRTL ? styles.rtlText : styles.ltrText,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  ltrText: {
    textAlign: 'left',
  },
  rtlText: {
    textAlign: 'right',
  },
});
