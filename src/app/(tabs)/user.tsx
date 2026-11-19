import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BACKEND_URL = 'http://10.118.132.179:5000'; // Match your backend IP
const USER_EMAIL = 'ayushsrivastavaind@gmail.com'; // Hardcoded for now until Auth is built

export default function ProfileScreen() {
  const router = useRouter();
  
  // Modal state variables
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Vehicle state variables
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  
  // New Vehicle Form States
  const [newLabel, setNewLabel] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [newType, setNewType] = useState(2); // Default to Car

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/vehicles/${USER_EMAIL}`);
      const data = await res.json();
      if (data.success) setVehicles(data.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load vehicles');
    }
    setLoadingVehicles(false);
  };

  const handleAddVehicle = async () => {
    if (!newLabel || !newCapacity) return Alert.alert('Error', 'Please fill all fields');
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: USER_EMAIL,
          label: newLabel,
          typeId: newType,
          batteryCapacity: parseFloat(newCapacity)
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAddingVehicle(false);
        setNewLabel('');
        setNewCapacity('');
        fetchVehicles(); // Refresh the list
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save vehicle');
    }
  };

  const openModal = (title: string, type: string) => {
    setModalTitle(title);
    setModalType(type);
    setModalVisible(true);
    setIsAddingVehicle(false);
    
    if (type === 'vehicles') {
      fetchVehicles();
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive" }
    ]);
  };

  const getVehicleIcon = (typeId: number) => {
    if (typeId === 1) return '🛵';
    if (typeId === 3) return '🚌';
    return '🚗';
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBackground} />
      
      <View style={styles.profileSection}>
        <Image source={require('../../../assets/icon1.png')} style={styles.avatarImage} />
        <Text style={styles.name}>Ayush Srivastava</Text>
        <Text style={styles.role}>Optium-EV Member</Text>
        <View style={styles.userBadge}><Text style={styles.userBadgeText}>Verified Owner</Text></View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}><Text style={styles.statValue}>1</Text><Text style={styles.statLabel}>Total Charges</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}><Text style={styles.statValue}>40</Text><Text style={styles.statLabel}>kWh Delivered</Text></View>
      </View>

      <View style={styles.settingsGroup}>
        <Text style={styles.groupTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => openModal('My Vehicles', 'vehicles')}>
          <View style={styles.settingLeft}><Ionicons name="car-sport-outline" size={22} color="#059669" /><Text style={styles.settingText}>My Vehicles</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => openModal('Payment Methods', 'payments')}>
          <View style={styles.settingLeft}><Ionicons name="card-outline" size={22} color="#059669" /><Text style={styles.settingText}>Payment Methods</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/history')}>
          <View style={styles.settingLeft}><Ionicons name="receipt-outline" size={22} color="#059669" /><Text style={styles.settingText}>Billing & History</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => openModal('Help & Support', 'support')}>
          <View style={styles.settingLeft}><Ionicons name="headset-outline" size={22} color="#059669" /><Text style={styles.settingText}>Help & Support</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerSignature}>Optium-EV Version 2.1.0</Text>

      {/* --- MODAL --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isAddingVehicle ? 'Add New Vehicle' : modalTitle}</Text>
            
            {/* Vechicles Data */}
            {modalType === 'vehicles' && !isAddingVehicle && (
              <View style={styles.modalDataGroup}>
                {loadingVehicles ? (
                  <ActivityIndicator size="small" color="#059669" />
                ) : vehicles.length === 0 ? (
                  <Text style={styles.emptyText}>No vehicles saved yet.</Text>
                ) : (
                  vehicles.map((v: any) => (
                    <View key={v._id} style={styles.dummyItemBox}>
                      <Text style={styles.dummyItemIcon}>{getVehicleIcon(v.typeId)}</Text>
                      <View>
                        <Text style={styles.dummyItemTitle}>{v.label}</Text>
                        <Text style={styles.dummyItemSub}>{v.batteryCapacity} kWh Battery</Text>
                      </View>
                    </View>
                  ))
                )}
                <TouchableOpacity style={styles.dummyActionBtn} onPress={() => setIsAddingVehicle(true)}>
                  <Text style={styles.dummyActionText}>+ Add New Vehicle</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Add Vehicle Form */}
            {modalType === 'vehicles' && isAddingVehicle && (
              <View style={styles.modalDataGroup}>
                <TextInput style={styles.input} placeholder="Vehicle Name (e.g. Tata Nexon)" value={newLabel} onChangeText={setNewLabel} />
                <TextInput style={styles.input} placeholder="Battery Capacity (kWh)" keyboardType="numeric" value={newCapacity} onChangeText={setNewCapacity} />
                
                <View style={styles.typeSelectorRow}>
                  {[ {id: 1, icon: '🛵'}, {id: 2, icon: '🚗'}, {id: 3, icon: '🚌'} ].map(t => (
                    <TouchableOpacity key={t.id} style={[styles.typeBtn, newType === t.id && styles.typeBtnActive]} onPress={() => setNewType(t.id)}>
                      <Text style={styles.typeBtnText}>{t.icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={[styles.dummyActionBtn, {backgroundColor: '#059669', borderColor: '#047857'}]} onPress={handleAddVehicle}>
                  <Text style={[styles.dummyActionText, {color: '#FFF'}]}>Save Vehicle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop: 15, alignItems: 'center'}} onPress={() => setIsAddingVehicle(false)}>
                  <Text style={{color: '#64748B'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Payments & Support omitted for brevity, keeping dummy structure */}
            {modalType === 'payments' && (
              <View style={styles.modalDataGroup}>
                <View style={styles.dummyItemBox}><Text style={styles.dummyItemIcon}>💳</Text><View><Text style={styles.dummyItemTitle}>HDFC Bank Visa</Text><Text style={styles.dummyItemSub}>Ending in 4012</Text></View></View>
              </View>
            )}
            {modalType === 'support' && (
              <View style={styles.modalDataGroup}>
                <View style={styles.dummyItemBox}><Text style={styles.dummyItemIcon}>📞</Text><View><Text style={styles.dummyItemTitle}>Call Ayush</Text><Text style={styles.dummyItemSub}>9166947949</Text></View></View>
              </View>
            )}

            {/* Close Button */}
            {!isAddingVehicle && (
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F0FDF4', paddingBottom: 40 },
  headerBackground: { height: 180, backgroundColor: '#047857', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  profileSection: { alignItems: 'center', marginTop: -50, marginBottom: 24 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 4, borderColor: '#D1FAE5' },
  name: { fontSize: 26, fontWeight: '900', color: '#064E3B', marginBottom: 4 },
  role: { fontSize: 15, fontWeight: '700', color: '#10B981', marginBottom: 12 },
  userBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#A7F3D0' },
  userBadgeText: { color: '#065F46', fontSize: 12, fontWeight: '800' },
  statsContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 24, borderRadius: 24, paddingVertical: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3, marginBottom: 32, borderWidth: 1, borderColor: '#E2E8F0' },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#E2E8F0' },
  statValue: { fontSize: 26, fontWeight: '900', color: '#064E3B' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 6, fontWeight: '700' },
  settingsGroup: { marginHorizontal: 24, marginBottom: 32 },
  groupTitle: { fontSize: 14, fontWeight: '800', color: '#059669', marginBottom: 16, marginLeft: 8 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginLeft: 14 },
  logoutBtn: { marginHorizontal: 24, backgroundColor: '#FEF2F2', paddingVertical: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { color: '#DC2626', fontWeight: '900', fontSize: 15, marginLeft: 10 },
  footerSignature: { textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: '700', marginTop: 10 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, minHeight: 300, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#064E3B', marginBottom: 20, textAlign: 'center' },
  modalDataGroup: { marginBottom: 10 },
  dummyItemBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  dummyItemIcon: { fontSize: 24, marginRight: 16 },
  dummyItemTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  dummyItemSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  dummyActionBtn: { backgroundColor: '#E0F2FE', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4, borderWidth: 1, borderColor: '#BAE6FD' },
  dummyActionText: { color: '#0369A1', fontWeight: '800', fontSize: 15 },
  closeModalBtn: { backgroundColor: '#F1F5F9', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  closeModalText: { color: '#475569', fontWeight: '800', fontSize: 16 },
  emptyText: { textAlign: 'center', marginBottom: 16, color: '#64748B' },
  input: { backgroundColor: '#F1F5F9', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15 },
  typeSelectorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeBtn: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 12, marginHorizontal: 4, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  typeBtnActive: { backgroundColor: '#D1FAE5', borderColor: '#059669' },
  typeBtnText: { fontSize: 24 }
});