import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useTelemetry } from '../../context/TelemetryContext';

interface VehicleOption {
  label: string;
  typeId: number;
  defaultCapacity: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { label: '1 - 2-Wheeler (Bike/Scooter)', typeId: 1, defaultCapacity: '4' },
  { label: '2 - Car (4-Wheeler)', typeId: 2, defaultCapacity: '50' },
  { label: '3 - Bus (Heavy EV)', typeId: 3, defaultCapacity: '250' },
];

const TERMINALS = [
  { id: 1, name: 'Terminal 1' },
  { id: 2, name: 'Terminal 2' },
  { id: 3, name: 'Terminal 3' },
];

const DEVICE_MAP: Record<number, string> = {
  1: "c6e24760-a9bc-11f1-8a27-e1d168a2087d", 
  2: "d6c422c0-a9bc-11f1-973e-db7ef6e48014", 
  3: "fff1f9b0-a9bc-11f1-b576-77a220d5bf3e", 
};

export default function ConnectScreen() {
  const telemetry = useTelemetry() as any;
  const power = telemetry?.power ?? 0;
  const bayStatus = telemetry?.bayStatus ?? 'STANDBY';
  const [selectedTerminal, setSelectedTerminal] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(VEHICLE_OPTIONS[1]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [soc, setSoc] = useState('20');
  const [capacity, setCapacity] = useState('50');
  const [chargeImmediate, setChargeImmediate] = useState(true);

  const handleBaySwitch = (id: number) => {
    setSelectedTerminal(id);
    setSoc('');
    setCapacity(id === 1 ? '4' : id === 3 ? '250' : '50');
  };

  const showHelp = () => {
    Alert.alert(
      "How to use this terminal",
      "1. Select a Bay to configure.\n2. Enter the current battery %.\n3. Use the Home Dashboard to change RTC Time for AI.\n4. Press Connect to send to the Cloud."
    );
  };

  const handleConnect = async () => {
    try {
      const loginResponse = await fetch('https://thingsboard.cloud/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'ayushsrivastavaind@gmail.com', 
          password: 'Ayush@0541'           
        })
      });

      if (!loginResponse.ok) throw new Error("ThingsBoard login failed.");
      const authData = await loginResponse.json();
      const jwtToken = authData.token;
      const deviceId = DEVICE_MAP[selectedTerminal]; 
      
      const attributeResponse = await fetch(`https://thingsboard.cloud/api/plugins/telemetry/DEVICE/${deviceId}/SHARED_SCOPE`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          initialSoc: parseFloat(soc) || 0,
          batteryCapacity: parseFloat(capacity) || 0,
          vehicleType: selectedVehicle.typeId,
          chargeNow: chargeImmediate
        })
      });

      if (attributeResponse.ok) {
        Alert.alert('Connected!', `Config sent to Terminal ${selectedTerminal}!`);
      } else {
        Alert.alert('Error', `ThingsBoard returned status ${attributeResponse.status}`);
      }
    } catch (error: any) {
      Alert.alert('Network Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Connect Vehicle</Text>
        <TouchableOpacity style={styles.helpButton} onPress={showHelp}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Terminal {selectedTerminal} Live Preview</Text>
        <Text style={styles.statusValue}>Status: {selectedTerminal === 2 ? bayStatus : 'STANDBY'}</Text>
        <Text style={styles.statusValue}>Power: {selectedTerminal === 2 ? power : '0'} W</Text>
      </View>

      <Text style={styles.label}>Select Terminal</Text>
      <View style={styles.terminalRow}>
        {TERMINALS.map((term) => (
          <TouchableOpacity
            key={term.id}
            style={[styles.terminalButton, selectedTerminal === term.id && styles.terminalButtonActive]}
            onPress={() => handleBaySwitch(term.id)}
          >
            <Text style={[styles.terminalText, selectedTerminal === term.id && styles.terminalTextActive]}>
              Bay {term.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Vehicle Type</Text>
      <TouchableOpacity style={styles.dropdownSelector} onPress={() => setDropdownVisible(true)}>
        <Text style={styles.dropdownSelectorText}>{selectedVehicle.label}</Text>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Vehicle Category</Text>
            {VEHICLE_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.typeId}
                style={[styles.modalItem, selectedVehicle.typeId === item.typeId && styles.modalItemActive]}
                onPress={() => { setSelectedVehicle(item); setCapacity(item.defaultCapacity); setDropdownVisible(false); }}
              >
                <Text style={[styles.modalItemText, selectedVehicle.typeId === item.typeId && styles.modalItemTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.rowInputs}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Battery SOC (%)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={soc} onChangeText={setSoc} />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Capacity (kWh)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={capacity} onChangeText={setCapacity} />
        </View>
      </View>

      <TouchableOpacity style={styles.checkboxContainer} onPress={() => setChargeImmediate(!chargeImmediate)} activeOpacity={0.8}>
        <View style={[styles.checkbox, chargeImmediate && styles.checkboxActive]}>
          {chargeImmediate && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.checkboxLabelContainer}>
          <Text style={styles.checkboxLabel}>Charge Immediately</Text>
          <Text style={styles.checkboxSubtext}>Starts charging right now</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleConnect}>
        <Text style={styles.submitButtonText}>Connect to Terminal {selectedTerminal}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f7fa', paddingBottom: 40 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1a252c' },
  helpButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2b6cb0', justifyContent: 'center', alignItems: 'center' },
  helpButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  statusCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  statusTitle: { fontSize: 16, fontWeight: '700', color: '#2b6cb0', marginBottom: 6 },
  statusValue: { fontSize: 14, color: '#4a5568', marginBottom: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#4a5568', marginBottom: 6, marginTop: 10 },
  terminalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  terminalButton: { flex: 1, paddingVertical: 10, marginHorizontal: 4, borderRadius: 8, borderWidth: 1.5, borderColor: '#cbd5e0', backgroundColor: '#ffffff', alignItems: 'center' },
  terminalButtonActive: { backgroundColor: '#2b6cb0', borderColor: '#2b6cb0' },
  terminalText: { fontSize: 13, fontWeight: '600', color: '#4a5568' },
  terminalTextActive: { color: '#ffffff' },
  dropdownSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e0', borderRadius: 8, padding: 12, marginBottom: 10 },
  dropdownSelectorText: { fontSize: 15, color: '#2d3748', fontWeight: '500' },
  arrowIcon: { fontSize: 12, color: '#718096' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#2d3748', marginBottom: 12, textAlign: 'center' },
  modalItem: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
  modalItemActive: { backgroundColor: '#ebf8ff' },
  modalItemText: { fontSize: 15, color: '#4a5568' },
  modalItemTextActive: { color: '#2b6cb0', fontWeight: '700' },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e0', borderRadius: 8, padding: 12, fontSize: 15, color: '#2d3748', marginBottom: 6 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8, backgroundColor: '#ffffff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#a0aec0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkboxActive: { backgroundColor: '#38a169', borderColor: '#38a169' },
  checkmark: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  checkboxLabelContainer: { flex: 1 },
  checkboxLabel: { fontSize: 15, fontWeight: '600', color: '#2d3748' },
  checkboxSubtext: { fontSize: 12, color: '#718096' },
  submitButton: { backgroundColor: '#2b6cb0', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20, elevation: 2 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});