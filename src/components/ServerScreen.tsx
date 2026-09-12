import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ServerScreen() {
  const serverUrl = 'https://optim-ev.onrender.com/';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="cloud-check" size={26} color="#059669" />
        <Text style={styles.headerTitle}>LIVE RENDER DEPLOYMENT</Text>
      </View>

      <View style={styles.content}>
        <ImageBackground 
          source={require('../../assets/server-bg.png')} 
          style={styles.heroBanner} 
          imageStyle={{ borderRadius: 14, opacity: 0.25 }}
        >
          <View style={styles.statusBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>STATUS: ONLINE & OPERATIONAL</Text>
          </View>

          <Text style={styles.serverTitle}>Optim-EV Backend Engine</Text>
          <Text style={styles.serverDesc}>
            Connected live to the production server backend deployed on Render. Tap below to launch the live web service endpoint.
          </Text>

          <Pressable style={styles.linkButton} onPress={() => Linking.openURL(serverUrl)}>
            <Text style={styles.linkButtonText}>OPEN LIVE SERVER ↗</Text>
          </Pressable>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', paddingBottom: 12 },
  headerTitle: { color: '#0F172A', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', marginLeft: 10 },
  content: { flex: 1, justifyContent: 'center' },
  heroBanner: { backgroundColor: '#F0FDF4', borderWidth: 1.5, borderColor: '#A7F3D0', borderRadius: 16, padding: 24, justifyContent: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#6EE7B7', marginBottom: 14 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669', marginRight: 6 },
  statusText: { color: '#047857', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' },
  serverTitle: { color: '#0F172A', fontSize: 18, fontFamily: 'monospace', fontWeight: '900', marginBottom: 8 },
  serverDesc: { color: '#334155', fontSize: 12, fontFamily: 'monospace', lineHeight: 20, marginBottom: 20 },
  linkButton: { backgroundColor: '#059669', padding: 15, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  linkButtonText: { color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 12 }
});