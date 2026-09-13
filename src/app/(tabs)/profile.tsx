import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerBackground} />
      
      <View style={styles.profileSection}>
        <Text style={styles.name}>Ayush Srivastava</Text>
        <Text style={styles.role}>EV Infrastructure Architect</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>System Administrator</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Active Terminals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>100%</Text>
          <Text style={styles.statLabel}>Edge AI Uptime</Text>
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Project Details</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>System Architecture</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>ThingsBoard Integrations</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Machine Learning Models</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Disconnect System</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerSignature}>Crafted by Ayush Srivastava</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f8fafc', paddingBottom: 40 },
  headerBackground: { height: 160, backgroundColor: '#0f172a', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  profileSection: { alignItems: 'center', marginTop: -40, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginTop: 12 },
  role: { fontSize: 15, color: '#64748b', marginTop: 4 },
  adminBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  adminBadgeText: { color: '#1d4ed8', fontSize: 12, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', backgroundColor: '#ffffff', marginHorizontal: 20, borderRadius: 16, paddingVertical: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 24 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#e2e8f0' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: '500' },
  settingsGroup: { marginHorizontal: 20, marginBottom: 24 },
  groupTitle: { fontSize: 14, fontWeight: 'bold', color: '#64748b', marginBottom: 12, marginLeft: 4 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#f1f5f9' },
  settingText: { fontSize: 15, fontWeight: '600', color: '#334155' },
  settingArrow: { fontSize: 16, color: '#94a3b8' },
  logoutBtn: { marginHorizontal: 20, backgroundColor: '#fee2e2', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
  footerSignature: { textAlign: 'center', color: '#94a3b8', fontSize: 13, fontWeight: '600', marginTop: 10 }
});