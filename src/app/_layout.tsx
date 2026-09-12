import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LayoutProvider } from '../context/LayoutContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <LayoutProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </LayoutProvider>
  );
}