import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function StatusBarBackground() {
  const insets = useSafeAreaInsets();
  

  return (
    <View 
      className="absolute top-0 left-0 right-0 z-50 bg-background"
      style={{
        height: insets.top,
      }} 
    />
  );
}
