
import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the new login screen instead of the tabs
  return <Redirect href="/login" />;
}