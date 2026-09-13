import React from 'react';
import { Stack } from 'expo-router';
import { TelemetryProvider } from '../context/TelemetryContext';

export default function RootLayout() {
  return (
    <TelemetryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TelemetryProvider>
  );
}