import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SkillsScreen() {
  const skillCategories = [
    { title: 'Programming Languages', skills: ['C', 'Embedded C', 'Basic C++', 'Python', 'Verilog HDL'] },
    { title: 'Hardware & Design Tools', skills: ['Git', 'Arduino IDE', 'Simulink', 'STM32IDE', 'KiCad', 'LTSpice', 'ANSYS HFSS'] },
    { title: 'Frameworks & Libraries', skills: ['NumPy', 'Pandas', 'Scikit-learn'] }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="code-slash" size={26} color="#7C3AED" />
        <Text style={styles.headerTitle}>TECHNICAL SKILLS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instruction}>Core language competencies, hardware tools, and simulation frameworks:</Text>

        {skillCategories.map((cat, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.categoryTitle}>// {cat.title}</Text>
            <View style={styles.pillContainer}>
              {cat.skills.map((skill, sIdx) => (
                <View key={sIdx} style={styles.skillPill}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingBottom: 12 },
  headerTitle: { color: '#0F172A', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', marginLeft: 10 },
  instruction: { color: '#64748B', fontSize: 12, fontFamily: 'monospace', marginBottom: 15 },
  content: { paddingBottom: 12 },
  card: { backgroundColor: '#F5F3FF', borderWidth: 1.5, borderColor: '#DDD6FE', borderRadius: 14, padding: 18, marginBottom: 15 },
  categoryTitle: { color: '#7C3AED', fontSize: 12, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 12 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  skillPill: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C4B5FD', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  skillText: { color: '#4C1D95', fontSize: 11.5, fontFamily: 'monospace', fontWeight: '600' }
});