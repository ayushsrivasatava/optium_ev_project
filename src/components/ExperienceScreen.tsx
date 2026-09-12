import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExperienceScreen() {
  const [activeSubModal, setActiveSubModal] = useState<string | null>(null);

  const experiences = [
    {
      id: 'emertxe',
      title: 'Trainee at Emertxe Information Tech',
      location: 'Bangalore (June 2026)',
      role: 'Embedded Systems Intern',
      desc: [
        'Developed ADAS & EV application prototypes using STM32 Blue Pill (ARM Cortex-M).',
        'Implemented Embedded C programs, UART & peripheral interfacing.',
        'Engineered real-time sensor monitoring loops for vehicle safety parameters.'
      ]
    },
    {
      id: 'railways',
      title: 'Trainee at Signal and Telecom',
      location: 'North Eastern Railways, Gorakhpur',
      role: 'Railway Signaling Observer',
      desc: [
        'Observed railway signaling, interlocking, and relay systems.',
        'Analyzed automated track-switching mechanisms and fail-safe safety protocols.',
        'Studied heavy-duty communication lines and control grid infrastructures.'
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="briefcase-variant" size={26} color="#2563EB" />
        <Text style={styles.headerTitle}>PROFESSIONAL EXPERIENCE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instruction}>Select an experience node to inspect duties, technical logs, and verified credentials:</Text>

        {experiences.map((exp) => (
          <Pressable 
            key={exp.id} 
            style={[styles.card, { backgroundColor: exp.id === 'emertxe' ? '#EFF6FF' : '#F8FAFC' }]} 
            onPress={() => setActiveSubModal(exp.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{exp.title}</Text>
              <Text style={styles.cardSubtitle}>{exp.location}</Text>
              <Text style={styles.cardRole}>{exp.role}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#2563EB" />
          </Pressable>
        ))}
      </ScrollView>

      {/* Sub-Modal Full Screen Window */}
      <Modal animationType="slide" transparent={false} visible={activeSubModal !== null} onRequestClose={() => setActiveSubModal(null)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>
              {activeSubModal === 'emertxe' ? 'Emertxe Tech Internship Logs' : 'North Eastern Railways Training'}
            </Text>
            <Pressable onPress={() => setActiveSubModal(null)} style={styles.closeIconButton}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {activeSubModal === 'emertxe' && (
              <>
                <View style={styles.detailsBox}>
                  <Text style={styles.sectionHeader}>// INTERNSHIP BREAKDOWN</Text>
                  {experiences[0].desc.map((point, idx) => (
                    <Text key={idx} style={styles.bulletText}>• {point}</Text>
                  ))}
                </View>

                <View style={styles.certContainer}>
                  <Text style={styles.sectionHeader}>// VERIFIED CERTIFICATE PREVIEW</Text>
                  <View style={styles.imageCard}>
                    <Image 
                      source={require('../../assets/certificate1.jpeg')} 
                      style={styles.certImage} 
                      resizeMode="cover"
                    />
                    <Text style={styles.certCaption}>Emertxe Completion Credential.jpeg</Text>
                  </View>
                </View>
              </>
            )}

            {activeSubModal === 'railways' && (
              <>
                <View style={styles.detailsBox}>
                  <Text style={styles.sectionHeader}>// OBSERVATION LOGS</Text>
                  {experiences[1].desc.map((point, idx) => (
                    <Text key={idx} style={styles.bulletText}>• {point}</Text>
                  ))}
                </View>

                <View style={styles.certContainer}>
                  <Text style={styles.sectionHeader}>// VERIFIED CERTIFICATE PREVIEW</Text>
                  <View style={styles.imageCard}>
                    <Image 
                      source={require('../../assets/certificate2.jpeg')} 
                      style={styles.certImage} 
                      resizeMode="cover"
                    />
                    <Text style={styles.certCaption}>Railways Training Credential.jpeg</Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <Pressable style={styles.backButton} onPress={() => setActiveSubModal(null)}>
            <Text style={styles.backButtonText}>BACK TO EXPERIENCE HUD</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingBottom: 12 },
  headerTitle: { color: '#0F172A', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', marginLeft: 10 },
  instruction: { color: '#64748B', fontSize: 12, fontFamily: 'monospace', marginBottom: 15 },
  content: { paddingBottom: 20 },
  card: { borderWidth: 1.5, borderColor: '#BFDBFE', borderRadius: 14, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardTitle: { color: '#0F172A', fontSize: 14, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { color: '#475569', fontSize: 11, fontFamily: 'monospace', marginBottom: 4 },
  cardRole: { color: '#2563EB', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, paddingTop: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingBottom: 15, marginBottom: 15 },
  modalHeaderTitle: { color: '#0F172A', fontSize: 15, fontFamily: 'monospace', fontWeight: 'bold' },
  closeIconButton: { padding: 4 },
  modalContent: { paddingBottom: 20 },
  detailsBox: { marginBottom: 15 },
  sectionHeader: { color: '#2563EB', fontSize: 11.5, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  bulletText: { color: '#1E293B', fontSize: 12, fontFamily: 'monospace', lineHeight: 20, marginBottom: 6 },
  certContainer: { marginTop: 10 },
  imageCard: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 12, alignItems: 'center' },
  certImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 8 },
  certCaption: { color: '#475569', fontSize: 10, fontFamily: 'monospace', fontWeight: '600' },
  backButton: { backgroundColor: '#0F172A', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  backButtonText: { color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 12 }
});