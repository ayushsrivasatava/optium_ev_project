import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { TelemetryProvider } from '../context/TelemetryContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Standalone Login Screen */}
          <Stack.Screen name="login" />
          {/* Main App Tabs */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </TelemetryProvider>
    </AuthProvider>
  );
}