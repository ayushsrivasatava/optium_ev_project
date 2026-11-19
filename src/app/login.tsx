import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // --- STRICT HARDCODED CREDENTIALS ---
    const isUser1 = cleanEmail === 'ayush@gmail.com' && password === 'a';
    const isUser2 = cleanEmail === '20230411029@mmmut.ac.in' && password === 'ayush';

    if (isUser1 || isUser2) {
      try {
        const mockToken = "hardcoded_dummy_token_12345";
        await login(cleanEmail, mockToken);
        
        // Navigate to the main tabs
        router.replace('/(tabs)');
      } catch (error) {
        Alert.alert('Login Error', 'Something went wrong while saving your session.');
      }
    } else {
      // Reject anyone else
      Alert.alert('Access Denied', 'Invalid email or password.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoEmoji}>🚗⚡</Text>
        </View>
        <Text style={styles.brandTitle}>Optium-EV</Text>
        <Text style={styles.brandSubtitle}>Smart & Eco-Friendly Charging</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="ayush@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="........"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.loginButtonText}>SECURE SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#047857', justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoPlaceholder: { backgroundColor: '#FFFFFF', width: 100, height: 100, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 50 },
  brandTitle: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', marginBottom: 8 },
  brandSubtitle: { fontSize: 16, fontWeight: '600', color: '#A7F3D0' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '800', color: '#064E3B', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, fontSize: 16, color: '#1F2937' },
  loginButton: { backgroundColor: '#10B981', borderRadius: 12, padding: 18, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});