import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useTelemetry } from '../../context/TelemetryContext';

export default function TerminalsScreen() {
  const { terminalsData } = useTelemetry();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openTerminalPane = (id: number) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const getVehicleInfo = (typeId: string) => {
    switch (String(typeId)) {
      case '1': return { text: '2-WHEELER', emoji: '🛵' };
      case '3': return { text: 'BUS', emoji: '🚌' };
      case '2': 
      default: return { text: 'CAR', emoji: '🚗' };
    }
  };

  // Safe data extraction for the Modal
  const activeData = selectedId !== null ? terminalsData[selectedId] : null;
  const activeVInfo = activeData ? getVehicleInfo(activeData.vehicleType) : { text: 'VEHICLE', emoji: '🔋' };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Charging Bays</Text>
      <Text style={styles.subtitle}>Select a bay to view live telemetry and AI optimizations</Text>

      {/* Render All 3 Terminals Dynamically */}
      {[1, 2, 3].map((id) => {
        const tData = terminalsData[id];
        const vInfo = getVehicleInfo(tData.vehicleType);
        const isThrottled = tData.loadDecision === 'THROTTLE';
        const isCharging = tData.bayStatus === 'CHARGING';

        return (
          <View key={id} style={styles.terminalCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.terminalName}>Terminal {id}</Text>
              
              <View style={[styles.statusBadge, isThrottled ? styles.throttleBadge : (isCharging ? styles.activeBadge : styles.freeBadge)]}>
                <Text style={[styles.statusBadgeText, isThrottled ? styles.throttleText : (isCharging ? styles.activeBadgeText : styles.freeBadgeText)]}>
                  {isThrottled ? `THROTTLED (${tData.throttleLevel}%)` : (isCharging ? 'ACTIVE' : 'FREE')}
                </Text>
              </View>
            </View>
            
            <Text style={styles.detectedText}>DETECTED: {vInfo.text}</Text>
            
            <TouchableOpacity style={styles.openPaneBtn} onPress={() => openTerminalPane(id)}>
              <Text style={styles.openPaneText}>Open Pane →</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Live Telemetry Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {activeData && (
              <>
                <View style={styles.cardHeader}>
                  <Text style={styles.terminalName}>Terminal {selectedId}</Text>
                  <View style={[styles.statusBadge, activeData.loadDecision === 'THROTTLE' ? styles.throttleBadge : (activeData.bayStatus === 'CHARGING' ? styles.activeBadge : styles.freeBadge)]}>
                    <Text style={[styles.statusBadgeText, activeData.loadDecision === 'THROTTLE' ? styles.throttleText : (activeData.bayStatus === 'CHARGING' ? styles.activeBadgeText : styles.freeBadgeText)]}>
                      {activeData.loadDecision === 'THROTTLE' ? `THROTTLED` : (activeData.bayStatus === 'CHARGING' ? 'ACTIVE' : 'FREE')}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.detectedText}>DETECTED: {activeVInfo.text}</Text>
                <Text style={styles.carEmoji}>{activeVInfo.emoji}</Text>

                <View style={styles.grid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>POWER DRAW</Text>
                    <Text style={styles.statValue}>{activeData.power} W</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>LIVE SOC</Text>
                    <Text style={styles.statValue}>{Number(activeData.soc).toFixed(1)}%</Text>
                  </View>
                  
                  <View style={[styles.statBox, activeData.loadDecision === 'THROTTLE' && styles.alertBox]}>
                    <Text style={styles.statLabel}>AI DECISION</Text>
                    <Text style={[styles.statValue, activeData.loadDecision === 'THROTTLE' && styles.alertText]}>
                      {activeData.loadDecision}
                    </Text>
                  </View>
                  <View style={[styles.statBox, activeData.loadDecision === 'THROTTLE' && styles.alertBox]}>
                    <Text style={styles.statLabel}>THROTTLE LEVEL</Text>
                    <Text style={[styles.statValue, activeData.loadDecision === 'THROTTLE' && styles.alertText]}>
                      {activeData.throttleLevel}%
                    </Text>
                  </View>
                </View>

                <View style={styles.reasonBox}>
                  <Text style={styles.reasonLabel}>EDGE AI STATUS REASON</Text>
                  <Text style={styles.reasonText}>
                    {activeData.loadDecision === 'THROTTLE' 
                      ? `Grid congestion detected. Output dynamically reduced to ${activeData.throttleLevel}% to maintain stability.` 
                      : (activeData.bayStatus === 'CHARGING' ? 'Optimal conditions. Charging at maximum safe capacity.' : 'Terminal is idle. Awaiting connection.')}
                  </Text>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>CLOSE PANE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f7fa', paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a252c' },
  subtitle: { fontSize: 14, color: '#718096', marginBottom: 20, marginTop: 5 },
  terminalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, marginBottom: 16, elevation: 2, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  terminalName: { fontSize: 20, fontWeight: 'bold', color: '#1a252c' },
  detectedText: { fontSize: 12, color: '#a0aec0', marginTop: 4, fontWeight: '600', marginBottom: 12 },
  throttleBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  throttleText: { fontSize: 11, fontWeight: 'bold', color: '#d97706' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadge: { backgroundColor: '#def7ec' },
  freeBadge: { backgroundColor: '#edf2f7' },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  activeBadgeText: { color: '#03543f' },
  freeBadgeText: { color: '#4a5568' },
  openPaneBtn: { alignSelf: 'flex-start' },
  openPaneText: { fontSize: 14, fontWeight: 'bold', color: '#2b6cb0' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, elevation: 5 },
  carEmoji: { fontSize: 60, textAlign: 'center', marginVertical: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '48%', padding: 12, borderRadius: 10, marginBottom: 12, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f0f4f8' },
  statLabel: { fontSize: 10, color: '#a0aec0', fontWeight: 'bold', marginBottom: 6 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1a252c' },
  alertBox: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  alertText: { color: '#b45309' },
  reasonBox: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 10, marginTop: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  reasonLabel: { fontSize: 10, color: '#3b82f6', fontWeight: 'bold', marginBottom: 4 },
  reasonText: { fontSize: 13, color: '#334155', fontWeight: '500', lineHeight: 20 },
  closeButton: { backgroundColor: '#f5f7fa', padding: 14, borderRadius: 10, marginTop: 16, alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e0' },
  closeButtonText: { fontSize: 14, fontWeight: 'bold', color: '#4a5568' },
});