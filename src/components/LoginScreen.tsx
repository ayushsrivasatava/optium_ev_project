import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const CORRECT_PASSCODE = '2026';

  const handleVerify = () => {
    if (passcode === CORRECT_PASSCODE) {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="shield-lock-outline" size={36} color="#2563EB" />
        </View>

        <Text style={styles.title}>RESTRICTED ACCESS</Text>
        <Text style={styles.subtitle}>// Enter authorization credential to unlock portfolio terminal</Text>

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          placeholder="Enter Passcode (e.g., 2026)"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          keyboardType="numeric"
          value={passcode}
          onChangeText={(text) => {
            setPasscode(text);
            setError(false);
          }}
        />

        {error && <Text style={styles.errorText}>[!] ACCESS DENIED: Incorrect Passcode</Text>}

        <Pressable style={styles.loginButton} onPress={handleVerify}>
          <Text style={styles.loginButtonText}>AUTHENTICATE SESSION</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#1E293B', borderWidth: 1.5, borderColor: '#334155', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  iconContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(37, 99, 235, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#2563EB' },
  title: { color: '#FFFFFF', fontSize: 18, fontFamily: 'monospace', fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  subtitle: { color: '#94A3B8', fontSize: 11, fontFamily: 'monospace', textAlign: 'center', marginBottom: 20, lineHeight: 16 },
  input: { width: '100%', backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#475569', borderRadius: 10, padding: 14, color: '#FFFFFF', fontFamily: 'monospace', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  errorInput: { borderColor: '#E11D48' },
  errorText: { color: '#E11D48', fontFamily: 'monospace', fontSize: 10.5, marginBottom: 12, fontWeight: 'bold' },
  loginButton: { flexDirection: 'row', backgroundColor: '#2563EB', width: '100%', padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  loginButtonText: { color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 12 }
});