import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, Modal, SafeAreaView, Image, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTelemetry } from '../../context/TelemetryContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const telemetry = useTelemetry() as any;

  const [activeModal, setActiveModal] = useState<'GRID' | 'AI' | 'SOS' | 'QUEUE' | null>(null);

  const { power = 0, predictProbability = 0, fetchStatus = 'Waiting...', bayStatus = 'STANDBY' } = telemetry;

  const isOffline = fetchStatus === 'Error' || fetchStatus === 'Waiting...';
  const isCharging = bayStatus === 'CHARGING';
  
  const centerTitle = isOffline ? 'System Offline' : (isCharging ? 'Charging Active' : 'System Online');
  const centerSub = isOffline ? 'Searching for station...' : (isCharging ? `Delivering ${power} W` : 'Ready to charge');
  const centerColor = isOffline ? '#9CA3AF' : (isCharging ? '#2563EB' : '#047857');
  const centerBg = isOffline ? '#F3F4F6' : (isCharging ? '#DBEAFE' : '#D1FAE5');

  const [currentDateTime, setCurrentDateTime] = useState('');
  const [currentH, setCurrentH] = useState(12);
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
      setCurrentH(now.getHours());
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- DYNAMIC GRID CAPACITY LOGIC ---
  const dynamicCapacity = Math.max(4000, 30000 - (currentH * 1130)); 
  const activePower = parseFloat(power) || 0;
  const headroom = Math.max(0, dynamicCapacity - activePower);
  const congestionPercent = (parseFloat(predictProbability || "0") * 100).toFixed(1);

  const blinkAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.2, duration: 1200, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
      ])
    ).start();
  }, [blinkAnim]);

  const h1 = `${(currentH + 1) % 24}:00`;
  const h2 = `${(currentH + 2) % 24}:00`;
  const h3 = `${(currentH + 3) % 24}:00`;

  const handleJoinQueue = (terminal: string) => {
    Alert.alert("Queue Joined", `You have been added to the queue for ${terminal}. We will notify you when it's your turn.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <View style={styles.userRow}>
              <Image source={require('../../../assets/icon1.png')} style={styles.headerAvatar} />
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.nameText}>Ayush</Text>
              </View>
            </View>
            <Text style={styles.dateText}>{currentDateTime}</Text>
            <View style={styles.ecoQuoteBox}>
              <Ionicons name="leaf" size={14} color="#059669" />
              <Text style={styles.ecoQuoteText}>You've saved 42.8 kg of CO₂ this month!</Text>
            </View>
          </View>
          <Animated.View style={[styles.headerRight, { opacity: blinkAnim }]}>
            <Ionicons name="flash" size={60} color="#34D399" />
          </Animated.View>
        </View>

        <View style={styles.centerGraphicContainer}>
          <View style={[styles.outerRing, { backgroundColor: centerBg, borderColor: centerColor }]}>
            <View style={styles.innerRing}>
              <Ionicons name="car-sport" size={60} color={centerColor} />
            </View>
          </View>
          <Text style={[styles.centerStatusTitle, { color: centerColor }]}>{centerTitle}</Text>
          <Text style={styles.centerStatusSub}>{centerSub}</Text>
        </View>

        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridCard} onPress={() => setActiveModal('GRID')} activeOpacity={0.7}>
            <View style={styles.cardIconBox}><Ionicons name="speedometer-outline" size={26} color="#059669" /></View>
            <Text style={styles.cardLabel}>Grid Load</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => setActiveModal('AI')} activeOpacity={0.7}>
            <View style={styles.cardIconBox}><Ionicons name="analytics-outline" size={26} color="#059669" /></View>
            <Text style={styles.cardLabel}>AI Forecast</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => setActiveModal('QUEUE')} activeOpacity={0.7}>
            <View style={styles.cardIconBox}><Ionicons name="people-outline" size={26} color="#059669" /></View>
            <Text style={styles.cardLabel}>Queue Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => setActiveModal('SOS')} activeOpacity={0.7}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FEE2E2' }]}><Ionicons name="warning-outline" size={26} color="#DC2626" /></View>
            <Text style={[styles.cardLabel, { color: '#DC2626' }]}>SOS / Help</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 1. GRID LOAD MODAL */}
      <Modal visible={activeModal === 'GRID'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Station Grid Details</Text>
            <Text style={styles.modalSub}>Dynamic Real-time Capacity Monitoring</Text>
            
            <View style={styles.modalStatBox}>
              <Text style={styles.modalStatLabel}>Total Station Capacity</Text>
              <Text style={styles.modalStatValue}>{dynamicCapacity.toLocaleString()} W</Text>
            </View>
            <View style={styles.modalStatBox}>
              <Text style={styles.modalStatLabel}>Currently Consumed</Text>
              <Text style={[styles.modalStatValue, { color: '#D97706' }]}>{activePower} W</Text>
            </View>
            <View style={styles.modalStatBox}>
              <Text style={styles.modalStatLabel}>Available Headroom</Text>
              <Text style={[styles.modalStatValue, { color: '#059669' }]}>{headroom.toLocaleString()} W</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModal(null)}><Text style={styles.closeBtnText}>CLOSE</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. AI MODAL */}
      <Modal visible={activeModal === 'AI'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>3-Hour Congestion Forecast</Text>
            <Text style={styles.modalSub}>Edge-AI Logistic Regression Model</Text>
            <View style={styles.forecastRow}><Text style={styles.forecastTime}>{h1}</Text><Text style={styles.forecastProb}>{(parseFloat(congestionPercent) * 1.1).toFixed(1)}%</Text></View>
            <View style={styles.forecastRow}><Text style={styles.forecastTime}>{h2}</Text><Text style={styles.forecastProb}>{(parseFloat(congestionPercent) * 1.3).toFixed(1)}%</Text></View>
            <View style={[styles.forecastRow, { borderBottomWidth: 0 }]}><Text style={styles.forecastTime}>{h3}</Text><Text style={[styles.forecastProb, { color: '#DC2626' }]}>{(parseFloat(congestionPercent) * 1.45).toFixed(1)}%</Text></View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModal(null)}><Text style={styles.closeBtnText}>CLOSE</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. SOS MODAL */}
      <Modal visible={activeModal === 'SOS'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.sosHeader}><Ionicons name="warning" size={32} color="#DC2626" /><Text style={styles.modalTitleSOS}>Emergency Contacts</Text></View>
            <View style={styles.contactBox}>
              <View><Text style={styles.contactName}>Fire Brigade</Text><Text style={styles.contactSub}>Emergency Services</Text></View>
              <Text style={styles.contactNumber}>101</Text>
            </View>
            <View style={styles.contactBox}>
              <View><Text style={styles.contactName}>Ayush Srivastava</Text><Text style={styles.contactSub}>Station Owner</Text></View>
              <Text style={styles.contactNumber}>9166947949</Text>
            </View>
            <TouchableOpacity style={styles.closeBtnSOS} onPress={() => setActiveModal(null)}><Text style={styles.closeBtnTextSOS}>CLOSE</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. QUEUE MODAL */}
      <Modal visible={activeModal === 'QUEUE'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Terminal Queues</Text>
            <Text style={styles.modalSub}>Live wait times & queue management</Text>
            
            <View style={styles.queueBox}>
              <View style={styles.queueInfo}>
                <Text style={styles.queueTerminal}>Terminal 1</Text>
                <Text style={styles.queueStatusGreen}>Available • No Queue</Text>
              </View>
            </View>

            <View style={styles.queueBox}>
              <View style={styles.queueInfo}>
                <Text style={styles.queueTerminal}>Terminal 2</Text>
                <Text style={styles.queueStatusOrange}>2 Vehicles • ~45 min wait</Text>
              </View>
              <TouchableOpacity style={styles.joinQueueBtn} onPress={() => handleJoinQueue('Terminal 2')}>
                <Text style={styles.joinQueueText}>Join</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.queueBox}>
              <View style={styles.queueInfo}>
                <Text style={styles.queueTerminal}>Terminal 3</Text>
                <Text style={styles.queueStatusOrange}>1 Vehicle • ~15 min wait</Text>
              </View>
              <TouchableOpacity style={styles.joinQueueBtn} onPress={() => handleJoinQueue('Terminal 3')}>
                <Text style={styles.joinQueueText}>Join</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeBtnText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 24, paddingTop: 40, paddingBottom: 60 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  headerLeft: { flex: 1, paddingRight: 10 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  headerAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 2, borderColor: '#10B981' },
  welcomeText: { fontSize: 14, color: '#047857', fontWeight: '700' },
  nameText: { fontSize: 28, fontWeight: '900', color: '#064E3B', letterSpacing: -0.5 },
  dateText: { fontSize: 14, color: '#10B981', fontWeight: '800', marginBottom: 16 },
  ecoQuoteBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#A7F3D0', alignSelf: 'flex-start' },
  ecoQuoteText: { fontSize: 12, fontWeight: '800', color: '#065F46', marginLeft: 6 },
  headerRight: { justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 10 },
  centerGraphicContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 280 },
  outerRing: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  innerRing: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  centerStatusTitle: { fontSize: 20, fontWeight: '900', marginTop: 24 },
  centerStatusSub: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginTop: 4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 'auto' },
  gridCard: { width: '47.5%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', elevation: 2 },
  cardIconBox: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  cardLabel: { fontSize: 14, fontWeight: '800', color: '#059669', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(4, 120, 87, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 30, paddingBottom: 50, elevation: 20 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#064E3B', marginBottom: 4, textAlign: 'center' },
  modalSub: { fontSize: 14, fontWeight: '600', color: '#10B981', textAlign: 'center', marginBottom: 24 },
  modalStatBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalStatLabel: { fontSize: 14, fontWeight: '700', color: '#475569' },
  modalStatValue: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  closeBtn: { backgroundColor: '#F0FDF4', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 24, borderWidth: 1, borderColor: '#A7F3D0' },
  closeBtnText: { color: '#059669', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingHorizontal: 10 },
  forecastTime: { fontSize: 16, fontWeight: '800', color: '#475569' },
  forecastProb: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  sosHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  modalTitleSOS: { fontSize: 24, fontWeight: '900', color: '#DC2626', marginLeft: 12 },
  contactBox: { backgroundColor: '#FEF2F2', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#FECACA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactName: { fontSize: 15, fontWeight: '900', color: '#991B1B' },
  contactSub: { fontSize: 12, fontWeight: '600', color: '#DC2626', marginTop: 4 },
  contactNumber: { fontSize: 22, fontWeight: '900', color: '#DC2626' },
  closeBtnSOS: { backgroundColor: '#FEE2E2', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 24 },
  closeBtnTextSOS: { color: '#DC2626', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
  
  // Queue Modal Styles
  queueBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  queueInfo: { flex: 1 },
  queueTerminal: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  queueStatusGreen: { fontSize: 13, fontWeight: '700', color: '#059669' },
  queueStatusOrange: { fontSize: 13, fontWeight: '700', color: '#D97706' },
  joinQueueBtn: { backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  joinQueueText: { color: '#FFF', fontWeight: '800', fontSize: 14 }
});