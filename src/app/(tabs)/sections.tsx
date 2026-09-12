import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SECTIONS, PROFILE_DATA, PROJECTS_DATA, INTERNSHIPS_DATA, ACHIEVEMENTS_DATA, CERTIFICATES_DATA } from '../../data/portfolioData';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SectionsScreen() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <View>
            <Text style={styles.detailTitle}>Personal Details</Text>
            <Text style={styles.text}>Name: {PROFILE_DATA.name}</Text>
            <Text style={styles.text}>Education: {PROFILE_DATA.education}</Text>
            <Text style={styles.text}>Email: {PROFILE_DATA.email}</Text>
            <Text style={styles.text}>Phone: {PROFILE_DATA.phone}</Text>
            <Text style={styles.text}>GitHub: {PROFILE_DATA.github}</Text>
            <Text style={styles.text}>LinkedIn: {PROFILE_DATA.linkedin}</Text>
          </View>
        );
      case 'resume':
        return (
          <View>
            <Text style={styles.detailTitle}>Resume Overview</Text>
            <Text style={styles.text}>Roll No: 2023041029</Text>
            <Text style={styles.text}>University: MMMUT Gorakhpur (CGPA: 8.52)</Text>
            <Text style={styles.text}>Core Identity: ECE / Embedded Systems / IoT / Edge AI</Text>
          </View>
        );
      case 'internship':
        return (
          <View>
            <Text style={styles.detailTitle}>Internship Experience</Text>
            {INTERNSHIPS_DATA.map((item, idx) => (
              <View key={idx} style={styles.subCard}>
                <Text style={styles.subCardTitle}>{item.company}</Text>
                <Text style={styles.subText}>{item.role} | {item.period}</Text>
                <Text style={styles.descText}>{item.details}</Text>
              </View>
            ))}
          </View>
        );
      case 'projects':
        return (
          <View>
            <Text style={styles.detailTitle}>Engineering Projects</Text>
            {PROJECTS_DATA.map((proj, idx) => (
              <View key={idx} style={styles.subCard}>
                <Text style={styles.subCardTitle}>{proj.title}</Text>
                <Text style={styles.domainText}>{proj.domain}</Text>
                <Text style={styles.descText}>{proj.description}</Text>
                <Pressable 
                  style={styles.linkButton} 
                  onPress={() => Linking.openURL(proj.renderUrl)}
                >
                  <Text style={styles.linkButtonText}>OPEN DEPLOYED PROJECT / GITHUB →</Text>
                </Pressable>
              </View>
            ))}
          </View>
        );
      case 'certificates':
        return (
          <View>
            <Text style={styles.detailTitle}>Certifications</Text>
            {CERTIFICATES_DATA.map((cert, idx) => (
              <View key={idx} style={styles.subCard}>
                <Text style={styles.text}>• {cert}</Text>
              </View>
            ))}
          </View>
        );
      case 'achievements':
        return (
          <View>
            <Text style={styles.detailTitle}>Key Achievements</Text>
            {ACHIEVEMENTS_DATA.map((ach, idx) => (
              <View key={idx} style={styles.subCard}>
                <Text style={styles.text}>🏆 {ach}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerTitle}>CONTROL HUB</Text>
      <Text style={styles.headerSubtitle}>Select a section to inspect verified records</Text>

      {/* Grid of Section Buttons */}
      <View style={styles.grid}>
        {SECTIONS.map((sec) => (
          <Pressable 
            key={sec.id} 
            style={[styles.cardButton, activeSection === sec.id && styles.activeCard]} 
            onPress={() => setActiveSection(sec.id)}
          >
            <FontAwesome5 name={sec.icon} size={22} color="#00FF9D" style={{ marginBottom: 8 }} />
            <Text style={styles.cardTitle}>{sec.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{sec.description}</Text>
          </Pressable>
        ))}
      </View>

      {/* Dynamic Detail Viewer Panel */}
      {activeSection && (
        <View style={styles.detailContainer}>
          <View style={styles.closeRow}>
            <Text style={styles.inspectorLabel}>// INSPECTOR ACTIVE</Text>
            <Pressable onPress={() => setActiveSection(null)}>
              <Text style={styles.closeText}>[CLOSE X]</Text>
            </Pressable>
          </View>
          {renderSectionContent()}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', fontFamily: 'monospace' },
  headerSubtitle: { color: '#8B949E', fontSize: 12, marginBottom: 20, fontFamily: 'monospace' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardButton: { width: '48%', backgroundColor: '#161B22', borderWidth: 1, borderColor: '#30363D', borderRadius: 10, padding: 15, marginBottom: 15 },
  activeCard: { borderColor: '#00FF9D', backgroundColor: '#1f2937' },
  cardTitle: { color: '#58A6FF', fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 4 },
  cardDesc: { color: '#8B949E', fontSize: 11 },
  detailContainer: { backgroundColor: '#161B22', borderWidth: 1, borderColor: '#00FF9D', borderRadius: 12, padding: 20, marginTop: 10 },
  closeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  inspectorLabel: { color: '#00FF9D', fontSize: 11, fontFamily: 'monospace' },
  closeText: { color: '#FF5555', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 12 },
  detailTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  text: { color: '#C9D1D9', fontSize: 14, marginBottom: 8 },
  subCard: { backgroundColor: '#0D1117', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#30363D' },
  subCardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  subText: { color: '#00FF9D', fontSize: 11, fontFamily: 'monospace', marginBottom: 6 },
  domainText: { color: '#58A6FF', fontSize: 11, fontFamily: 'monospace', marginBottom: 6 },
  descText: { color: '#8B949E', fontSize: 12, lineHeight: 18 },
  linkButton: { backgroundColor: '#1f2937', padding: 10, borderRadius: 6, marginTop: 10, alignItems: 'center', borderWidth: 1, borderColor: '#00FF9D' },
  linkButtonText: { color: '#00FF9D', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold' }
});