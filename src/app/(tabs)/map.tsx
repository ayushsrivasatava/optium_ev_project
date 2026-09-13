import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Linking } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

export default function MapScreen() {
  const pulseScale = useSharedValue(0.5);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(withTiming(2.5, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
    pulseOpacity.value = withRepeat(withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
  }, []);

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Open Real Google Maps to MMMUT Gorakhpur
  const openGoogleMaps = () => {
    const lat = 26.7314;
    const lng = 83.4332;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.headerBox}>
          <Text style={styles.header}>Station Navigation</Text>
          <Text style={styles.subHeader}>Routing to MMMUT Gorakhpur Hub</Text>
        </View>
        
        {/* Radar Map Simulation */}
        <View style={styles.mapSimulationContainer}>
          {/* Grid Background */}
          <View style={styles.gridLineHorizontal} />
          <View style={styles.gridLineVertical} />
          
          {/* SVG Dotted Route Path */}
          <View style={styles.svgContainer}>
            <Svg height="100%" width="100%" viewBox="0 0 300 300">
              <Path 
                d="M 60 240 C 60 150, 200 240, 240 80" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="4" 
                strokeDasharray="10 10" 
              />
            </Svg>
          </View>

          {/* User Location (Bottom Left) */}
          <View style={styles.userPin}>
            <View style={styles.userDot} />
            <Text style={styles.userLabel}>Your Location</Text>
          </View>

          {/* Charging Station Location (Top Right) */}
          <View style={styles.stationPin}>
            <Animated.View style={[styles.radarRing, animatedPulse]} />
            <View style={styles.stationIconBox}>
              <Text style={styles.stationIcon}>⚡</Text>
            </View>
            <View style={styles.stationBadge}>
              <Text style={styles.stationBadgeText}>Optium EV</Text>
              <Text style={styles.stationSubBadgeText}>MMMUT Gorakhpur</Text>
            </View>
          </View>
        </View>

        {/* Live Tracking Details */}
        <View style={styles.infoCard}>
          <View style={styles.etaRow}>
            <View style={styles.metricCol}>
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue}>12 <Text style={styles.unit}>Min</Text></Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.etaLabel}>DISTANCE</Text>
              <Text style={styles.etaValue}>3.8 <Text style={styles.unit}>km</Text></Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.etaLabel}>TRAFFIC</Text>
              <Text style={[styles.etaValue, {color: '#059669'}]}>Light</Text>
            </View>
          </View>
          
          <Pressable style={styles.navBtn} onPress={openGoogleMaps}>
            <Text style={styles.navBtnText}>OPEN IN GOOGLE MAPS</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, padding: 20 },
  headerBox: { marginBottom: 20 },
  header: { color: '#111827', fontSize: 24, fontWeight: '900' },
  subHeader: { color: '#6B7280', fontSize: 13, marginTop: 4, fontWeight: '500' },
  
  mapSimulationContainer: { 
    flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, overflow: 'hidden', 
    borderWidth: 1, borderColor: '#E2E8F0', position: 'relative', marginBottom: 20
  },
  gridLineHorizontal: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#E2E8F0', top: '50%' },
  gridLineVertical: { position: 'absolute', height: '100%', width: 1, backgroundColor: '#E2E8F0', left: '50%' },
  
  svgContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  userPin: { position: 'absolute', bottom: 45, left: 45, alignItems: 'center' },
  userDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#111827', borderWidth: 3, borderColor: '#FFF', shadowColor: '#000', shadowOffset:{width:0, height:2}, shadowOpacity: 0.2, shadowRadius: 3 },
  userLabel: { fontSize: 11, fontWeight: '800', color: '#111827', marginTop: 6, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },

  stationPin: { position: 'absolute', top: 60, right: 40, justifyContent: 'center', alignItems: 'center' },
  radarRing: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: '#3B82F6', opacity: 0.4 },
  stationIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563EB', borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  stationIcon: { color: '#FFF', fontSize: 14 },
  stationBadge: { position: 'absolute', top: -50, backgroundColor: '#111827', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, zIndex: 3, alignItems: 'center', minWidth: 130 },
  stationBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  stationSubBadgeText: { color: '#9CA3AF', fontSize: 9, fontWeight: '600', marginTop: 2 },
  
  infoCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCol: { alignItems: 'center' },
  etaLabel: { fontSize: 11, fontWeight: '800', color: '#64748B', marginBottom: 6 },
  etaValue: { fontSize: 26, fontWeight: '900', color: '#111827' },
  unit: { fontSize: 14, fontWeight: 'bold', color: '#94A3B8' },
  
  navBtn: { backgroundColor: '#2563EB', padding: 18, borderRadius: 12, alignItems: 'center' },
  navBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});