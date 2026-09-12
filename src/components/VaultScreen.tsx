import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@engineering_portfolio_vault';

export default function VaultScreen() {
  const [notes, setNotes] = useState<string[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');

  // Load saved vault items when component mounts
  useEffect(() => {
    loadVaultData();
  }, []);

  const loadVaultData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData !== null) {
        setNotes(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load vault data.', error);
    }
  };

  const saveToStorage = async (updatedNotes: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save vault data.', error);
    }
  };

  const handleSaveNote = () => {
    if (!inputTitle || !inputContent) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }
    const updatedNotes = [`[${inputTitle}] - ${inputContent}`, ...notes];
    setNotes(updatedNotes);
    saveToStorage(updatedNotes);
    setInputTitle('');
    setInputContent('');
  };

  const handleClearVault = async () => {
    Alert.alert('Clear Vault', 'Are you sure you want to delete all saved items?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete All', 
        style: 'destructive', 
        onPress: async () => {
          setNotes([]);
          await AsyncStorage.removeItem(STORAGE_KEY);
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="lock-alert" size={24} color="#D97706" />
        <Text style={styles.headerTitle}>SECURE PERSONAL VAULT</Text>
        {notes.length > 0 && (
          <Pressable onPress={handleClearVault} style={{ marginLeft: 'auto' }}>
            <Ionicons name="trash-outline" size={20} color="#E11D48" />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instruction}>// Permanently encrypted local storage for passwords, keys, and private logs:</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Credential/Title (e.g., GitHub Token)"
            placeholderTextColor="#94A3B8"
            value={inputTitle}
            onChangeText={setInputTitle}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Secure Details / Password"
            placeholderTextColor="#94A3B8"
            multiline
            value={inputContent}
            onChangeText={setInputContent}
          />
          <Pressable style={styles.saveButton} onPress={handleSaveNote}>
            <Text style={styles.saveButtonText}>SAVE TO PERMANENT VAULT</Text>
          </Pressable>
        </View>

        <Text style={[styles.instruction, { marginTop: 20 }]}>// Stored Vault Entries:</Text>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>No private items recorded yet.</Text>
        ) : (
          notes.map((note, index) => (
            <View key={index} style={styles.card}>
              <Ionicons name="key-outline" size={18} color="#D97706" style={{ marginRight: 8 }} />
              <Text style={styles.cardText}>{note}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingBottom: 12 },
  headerTitle: { color: '#0F172A', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', marginLeft: 10 },
  instruction: { color: '#64748B', fontSize: 12, fontFamily: 'monospace', marginBottom: 12 },
  inputContainer: { backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: '#FDE68A', borderRadius: 14, padding: 14, marginBottom: 15 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, color: '#0F172A', fontFamily: 'monospace', fontSize: 12, marginBottom: 10 },
  saveButton: { backgroundColor: '#D97706', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 11.5 },
  emptyText: { color: '#94A3B8', fontFamily: 'monospace', fontSize: 11, fontStyle: 'italic' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginBottom: 10 },
  cardText: { color: '#334155', fontFamily: 'monospace', fontSize: 11.5, flex: 1 }
});