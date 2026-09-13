import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTelemetry } from '../../context/TelemetryContext';

export default function HomeScreen() {
  const { power, voltage, current, fetchStatus, bayStatus, predictProbability, loadDecision } = useTelemetry();
  const [currentTime, setCurrentTime] = useState('');
  const [currentH, setCurrentH] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setCurrentH(now.getHours());
    }, 1000);
    
    setCurrentH(new Date().getHours());
    
    return () => clearInterval(timer);
  }, []);

  const activePower = parseFloat(power) || 0;
  const headroom = 30000 - activePower;
  const isCharging = bayStatus === 'CHARGING';
  const congestionPercent = (parseFloat(predictProbability || "0") * 100).toFixed(1);

  // Automatically calculates the next 3 hours based on actual real-time
  const h1 = `${(currentH + 1) % 24}:00`;
  const h2 = `${(currentH + 2) % 24}:00`;
  const h3 = `${(currentH + 3) % 24}:00`;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoBolt}>⚡</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>Ayush</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>Sun</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{currentTime || '00:00:00'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tbBanner}>
        <Text style={styles.tbBannerText}>
          📡 ThingsBoard: {fetchStatus === 'Waiting...' ? 'Connecting...' : fetchStatus}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Grid Load Capacity</Text>
          <TouchableOpacity style={styles.settingsIcon}>
            <Text style={styles.settingsGear}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gaugeContainer}>
          <View style={[styles.gaugeArch, isCharging && styles.gaugeArchActive]}>
            <Text style={[styles.gaugeValue, isCharging && styles.gaugeValueActive]}>
              {activePower} W
            </Text>
            <Text style={styles.gaugeSubText}>
              Active Draw ({voltage}V / {current}A)
            </Text>
          </View>
          <View style={styles.gaugeDot} />
        </View>

        <View style={styles.headroomRow}>
          <Text style={styles.headroomText}>
            Available Headroom: <Text style={styles.headroomBold}>{headroom} W</Text>
          </Text>
          <View style={[styles.statusBadge, isCharging ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={[styles.statusBadgeText, isCharging ? styles.badgeTextActive : styles.badgeTextInactive]}>
              {isCharging ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Real-time ML Congestion</Text>
          <View style={[styles.mlBadge, loadDecision === 'THROTTLE' && styles.mlBadgeWarning]}>
            <Text style={[styles.mlBadgeText, loadDecision === 'THROTTLE' && styles.mlBadgeTextWarning]}>
              {congestionPercent}%
            </Text>
          </View>
        </View>

        <View style={[styles.mlBanner, loadDecision === 'THROTTLE' && styles.mlBannerWarning]}>
          <Text style={[styles.mlBannerText, loadDecision === 'THROTTLE' && styles.mlBannerTextWarning]}>
            {loadDecision === 'THROTTLE' ? `⚠️ High Load: Grid capacity restricted` : `✅ Stable grid capacity`}
          </Text>
        </View>

        <Text style={styles.forecastTitle}>Edge AI Probability Forecast</Text>
        <View style={styles.forecastRow}>
          <View style={styles.forecastBox}>
            <Text style={styles.forecastTime}>{h1}</Text>
            <Text style={styles.forecastVal}>{(parseFloat(congestionPercent) * 1.1).toFixed(1)}%</Text>
          </View>
          <View style={styles.forecastBox}>
            <Text style={styles.forecastTime}>{h2}</Text>
            <Text style={styles.forecastVal}>{(parseFloat(congestionPercent) * 1.3).toFixed(1)}%</Text>
          </View>
          <View style={styles.forecastBox}>
            <Text style={styles.forecastTime}>{h3}</Text>
            <Text style={styles.forecastVal}>{(parseFloat(congestionPercent) * 1.45).toFixed(1)}%</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footerSignature}>Crafted by Ayush Srivastava</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc', paddingTop: 50, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: { width: 48, height: 48, backgroundColor: '#0f172a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logoBolt: { fontSize: 24, color: '#fbbf24' },
  welcomeText: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  nameText: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
  headerRight: { alignItems: 'flex-end' },
  dayBadge: { backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 4 },
  dayText: { color: '#0284c7', fontWeight: 'bold', fontSize: 12 },
  timeBadge: { backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  timeText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 12 },
  tbBanner: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  tbBannerText: { color: '#38bdf8', fontWeight: 'bold', fontSize: 13 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  settingsIcon: { backgroundColor: '#3b82f6', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  settingsGear: { fontSize: 18, color: '#ffffff' },
  gaugeContainer: { alignItems: 'center', marginVertical: 20 },
  gaugeArch: { width: 240, height: 120, borderTopLeftRadius: 120, borderTopRightRadius: 120, borderWidth: 16, borderBottomWidth: 0, borderColor: '#f1f5f9', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10 },
  gaugeArchActive: { borderColor: '#e0f2fe' },
  gaugeValue: { fontSize: 36, fontWeight: 'bold', color: '#2563eb' },
  gaugeValueActive: { color: '#0284c7' },
  gaugeSubText: { fontSize: 12, color: '#64748b', fontWeight: '600', marginTop: 4 },
  gaugeDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#2563eb', position: 'absolute', bottom: -8, right: 20 },
  headroomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  headroomText: { fontSize: 13, color: '#64748b' },
  headroomBold: { color: '#0f172a', fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' }, 
  badgeInactive: { backgroundColor: '#d1fae5' },
  badgeTextInactive: { color: '#065f46' },
  badgeActive: { backgroundColor: '#fef08a' },
  badgeTextActive: { color: '#854d0e' },
  mlBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  mlBadgeWarning: { backgroundColor: '#fef3c7' },
  mlBadgeText: { color: '#065f46', fontWeight: 'bold', fontSize: 13 },
  mlBadgeTextWarning: { color: '#b45309' },
  mlBanner: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 8, marginBottom: 20 },
  mlBannerWarning: { backgroundColor: '#fffbeb' },
  mlBannerText: { color: '#166534', fontWeight: 'bold', fontSize: 13 },
  mlBannerTextWarning: { color: '#b45309' },
  forecastTitle: { fontSize: 13, fontWeight: 'bold', color: '#64748b', marginBottom: 10, textAlign: 'center' },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between' },
  forecastBox: { flex: 1, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#f1f5f9' },
  forecastTime: { fontSize: 12, color: '#64748b', fontWeight: 'bold', marginBottom: 6 },
  forecastVal: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  footerSignature: { textAlign: 'center', color: '#94a3b8', fontSize: 13, fontWeight: '600', marginTop: 10, paddingBottom: 10 }
});