import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ProjectsScreen() {
  const projects = [
    {
      title: 'ADAS & EV Monitoring Dashboard',
      tools: 'STM32 Blue Pill, Embedded C, UART, Sensors',
      desc: 'Developed real-time ADAS and electric vehicle telemetry monitoring prototypes using ARM Cortex-M architecture and integrated sensor loops.',
      link: 'https://github.com/ayushsrivasatava/ADAS-and-EV-based-Dashboard-using-STM32',
      hasImage: true
    },
    {
      title: 'ML-Assisted Milk Adulteration Detection',
      tools: 'ANSYS, Python, Scikit-learn, Pandas',
      desc: 'Engineered a machine learning pipeline integrated with analytical simulations to identify structural anomalies and dairy composition metrics.',
      link: 'https://github.com/ayushsrivasatava',
      hasImage: false
    },
    {
      title: 'Transformerless Power Supply PCB Design',
      tools: 'KiCad, LTSpice',
      desc: 'Designed and simulated a compact, efficient transformerless power supply circuit board schematic optimized for low-power IoT hardware.',
      link: 'https://github.com/ayushsrivasatava',
      hasImage: false
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="cpu" size={24} color="#E11D48" />
        <Text style={styles.headerTitle}>ENGINEERING PROJECTS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instruction}>Inspect core engineering builds, hardware schematics, and code repositories:</Text>

        {projects.map((proj, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{proj.title}</Text>
            <Text style={styles.cardTools}>// Tools: {proj.tools}</Text>
            <Text style={styles.cardDesc}>{proj.desc}</Text>

            {proj.hasImage && (
              <View style={styles.imageBox}>
                <Image 
                  source={require('../../assets/project-preview.png')} 
                  style={styles.previewImage} 
                  resizeMode="cover"
                />
                <Text style={styles.imageCaption}>[ System Architecture & Dashboard Schematic Preview ]</Text>
              </View>
            )}

            <Pressable style={styles.githubButton} onPress={() => Linking.openURL(proj.link)}>
              <Feather name="github" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.githubButtonText}>VIEW ON GITHUB ↗</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  content: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingBottom: 12 },
  headerTitle: { color: '#0F172A', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', marginLeft: 10 },
  instruction: { color: '#64748B', fontSize: 12, fontFamily: 'monospace', marginBottom: 15 },
  card: { backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#FECACA', borderRadius: 14, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardTitle: { color: '#0F172A', fontSize: 14, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 6 },
  cardTools: { color: '#E11D48', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 8 },
  cardDesc: { color: '#334155', fontSize: 12, fontFamily: 'monospace', lineHeight: 18, marginBottom: 12 },
  imageBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 12 },
  previewImage: { width: '100%', height: 130, borderRadius: 6, marginBottom: 6 },
  imageCaption: { color: '#64748B', fontSize: 10, fontFamily: 'monospace' },
  githubButton: { backgroundColor: '#0F172A', flexDirection: 'row', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  githubButtonText: { color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 11.5 }
});