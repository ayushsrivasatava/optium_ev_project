import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function EducationScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="graduation-cap" size={24} color="#0D9488" />
        <Text style={styles.headerTitle}>EDUCATION & ACADEMIC RECORDS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instruction}>// Complete academic timeline, 10th/12th scores, semester records, and milestones:</Text>

        {/* B.Tech Degree Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>B.Tech in Electronics and Communication Engineering (ECE)</Text>
          <Text style={styles.cardSubtitle}>Madan Mohan Malaviya University of Technology (MMMUT)</Text>
          <Text style={styles.cardMeta}>// Gorakhpur, UP | Expected Graduation: 2027</Text>
          <Text style={styles.cardDesc}>
            Focusing on core electronic design, embedded systems, microcontrollers, and low-power hardware-software integration.
          </Text>
        </View>

        {/* Class 10th & 12th Board Records Card */}
        <View style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <MaterialCommunityIcons name="school" size={20} color="#059669" style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { color: '#065F46', marginBottom: 0 }]}>High School & Intermediate Board Records</Text>
          </View>
          <Text style={styles.semHeader}>• Class 12th (Senior Secondary / Intermediate)</Text>
          <Text style={styles.bulletItem}>  - Board: Central / State Board</Text>
          <Text style={styles.bulletItem}>  - Aggregate Score / Percentage: Secured Excellence (PCM Focus)</Text>

          <Text style={[styles.semHeader, { marginTop: 10, color: '#059669' }]}>• Class 10th (Secondary School)</Text>
          <Text style={styles.bulletItem}>  - Board: High School Board</Text>
          <Text style={styles.bulletItem}>  - Aggregate Score / Percentage: Distinction / First Division</Text>
        </View>

        {/* Semester-wise Subject Marks & Performance Card */}
        <View style={[styles.card, { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <MaterialCommunityIcons name="format-list-numbered" size={20} color="#2563EB" style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { color: '#1E3A8A', marginBottom: 0 }]}>Semester-Wise Subject Marks & Performance</Text>
          </View>

          <Text style={styles.semHeader}>• Semester I</Text>
          <Text style={styles.bulletItem}>  - Engineering Mathematics-I: 85/100</Text>
          <Text style={styles.bulletItem}>  - Engineering Physics: 82/100</Text>
          <Text style={styles.bulletItem}>  - Basic Electrical Engineering: 88/100</Text>
          <Text style={styles.bulletItem}>  - Programming for Problem Solving: 90/100</Text>

          <Text style={[styles.semHeader, { marginTop: 10 }]}>• Semester II</Text>
          <Text style={styles.bulletItem}>  - Engineering Mathematics-II: 84/100</Text>
          <Text style={styles.bulletItem}>  - Basic Electronics Engineering: 91/100</Text>
          <Text style={styles.bulletItem}>  - Engineering Chemistry: 80/100</Text>
          <Text style={styles.bulletItem}>  - Fundamental of Mechanical Engineering: 78/100</Text>

          <Text style={[styles.semHeader, { marginTop: 10 }]}>• Semester III & IV (Core ECE)</Text>
          <Text style={styles.bulletItem}>  - Digital Circuits & Systems: 89/100</Text>
          <Text style={styles.bulletItem}>  - Analog Electronics: 86/100</Text>
          <Text style={styles.bulletItem}>  - Signals and Systems: 83/100</Text>
          <Text style={styles.bulletItem}>  - Microprocessors & Microcontrollers: 92/100</Text>
        </View>

        {/* Key Academic & Exam Achievements Card */}
        <View style={[styles.card, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <FontAwesome5 name="award" size={18} color="#D97706" style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { color: '#B45309', marginBottom: 0 }]}>Key Academic & Competitive Milestones</Text>
          </View>
          <Text style={styles.bulletItem}>• GATE 2026 Qualified (Score: 460)</Text>
          <Text style={styles.bulletItem}>• ISRO Bharatiya Antariksh Hackathon 2026 Proposal: AI Satellite Image Interpolation</Text>
          <Text style={styles.bulletItem}>• Techsrijan MMMUT: Secured 2nd Rank for RoboCar project</Text>
          <Text style={styles.bulletItem}>• Executive Member at Electronics and Communication Engineering Society (ECES)</Text>
        </View>

        {/* Certifications Card */}
        <View style={[styles.card, { backgroundColor: '#F0FDFA', borderColor: '#99F6E4' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name="certificate" size={20} color="#0D9488" style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { color: '#0F766E', marginBottom: 0 }]}>Professional Certifications</Text>
          </View>
          <Text style={styles.bulletItem}>• MathWorks Simulink Certification</Text>
          <Text style={styles.bulletItem}>• Altium Designer PCB Design Certification</Text>
          <Text style={styles.bulletItem}>• VLSI Design & Simulation Training</Text>
          <Text style={styles.bulletItem}>• Drones & UAV Hardware Architecture Workshop</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingBottom: 12 },
  headerTitle: { color: '#0F172A', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', marginLeft: 10 },
  instruction: { color: '#64748B', fontSize: 12, fontFamily: 'monospace', marginBottom: 15 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 14, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardTitle: { color: '#0F172A', fontSize: 14, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { color: '#0D9488', fontSize: 12, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 4 },
  cardMeta: { color: '#64748B', fontSize: 11, fontFamily: 'monospace', marginBottom: 8 },
  cardDesc: { color: '#334155', fontSize: 12, fontFamily: 'monospace', lineHeight: 18 },
  semHeader: { color: '#2563EB', fontSize: 12, fontFamily: 'monospace', fontWeight: 'bold', marginTop: 4 },
  bulletItem: { color: '#334155', fontSize: 11.5, fontFamily: 'monospace', lineHeight: 20, marginTop: 2 }
});