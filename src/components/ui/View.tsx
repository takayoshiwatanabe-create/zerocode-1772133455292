import React from 'react';
import { View as RNView, ViewProps as RNViewProps, StyleSheet } from 'react-native';
import { getIsRTL } from '@/i18n';
import { twMerge } from 'tailwind-merge';

interface ViewProps extends RNViewProps {
  className?: string;
}

export function View({ className, style, ...props }: ViewProps) {
  const isRTL = getIsRTL();

  return (
    <RNView
      className={twMerge('', className)}
      style={[
        isRTL ? styles.rtlView : styles.ltrView,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  ltrView: {
    direction: 'ltr',
  },
  rtlView: {
    direction: 'rtl',
  },
});
