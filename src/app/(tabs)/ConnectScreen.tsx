import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useTelemetry } from '../../context/TelemetryContext';
import Toast from 'react-native-toast-message';
import * as Print from 'expo-print';

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
  1: 'c6e24760-a9bc-11f1-8a27-e1d168a2087d',
  2: 'd6c422c0-a9bc-11f1-973e-db7ef6e48014',
  3: 'fff1f9b0-a9bc-11f1-b576-77a220d5bf3e',
};

const BACKEND_URL = 'https://backend-1-1iku.onrender.com';
const BASE_RATE_PER_KWH = 10; // Base tariff ₹10/kWh

// --- MODULE-LEVEL THINGSBOARD JWT CACHE ---
let cachedTbToken: string | null = null;
let cachedTbTokenExpiry = 0;

async function getThingsBoardToken(): Promise<string> {
  const now = Date.now();
  if (cachedTbToken && now < cachedTbTokenExpiry) {
    return cachedTbToken;
  }

  const loginResponse = await fetch('https://thingsboard.cloud/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'ayushsrivastavaind@gmail.com',
      password: 'Ayush@0541',
    }),
  });

  if (!loginResponse.ok) throw new Error('ThingsBoard login failed.');
  const authData = await loginResponse.json();
  cachedTbToken = authData.token;
  cachedTbTokenExpiry = now + 50 * 60 * 1000;
  return authData.token;
}

// --- DYNAMIC PRICING ENGINE ---
function calculateDynamicPricing(
  capacityKwh: number,
  initialSoc: number,
  telemetry: any,
  activeTerminalData: any
) {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();

  const clampedSoc = Math.min(99, Math.max(0, initialSoc));
  const energyNeeded = Math.max(0, capacityKwh * (1 - clampedSoc / 100));

  // 1. Base Energy Cost
  const baseCost = Math.round(energyNeeded * BASE_RATE_PER_KWH);

  // 2. Time-of-Day
  let timeRateDelta = 0;
  let timeLabel = 'Standard';
  if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 21)) {
    timeRateDelta = 2.0;
    timeLabel = 'Peak (+₹2/kWh)';
  } else if (hour >= 11 && hour <= 16) {
    timeRateDelta = -1.5;
    timeLabel = 'Solar (-₹1.5/kWh)';
  } else {
    timeRateDelta = -2.0;
    timeLabel = 'Off-Peak (-₹2/kWh)';
  }
  const timeCostDelta = Math.round(energyNeeded * timeRateDelta);

  // 3. AI Congestion Forecast
  let congestionProb: number;
  if (typeof activeTerminalData?.congestionProb === 'number') {
    congestionProb = activeTerminalData.congestionProb;
  } else if (typeof telemetry?.congestionProb === 'number') {
    congestionProb = telemetry.congestionProb;
  } else {
    const z = -1.4260217881 + 0.0099247663 * dayOfWeek + 0.1213530798 * hour;
    congestionProb = 1 / (1 + Math.exp(-z));
  }

  let aiRateDelta = 0;
  let aiLabel = 'Low';
  if (congestionProb >= 0.9) {
    aiRateDelta = 3.5;
    aiLabel = 'Critical';
  } else if (congestionProb >= 0.75) {
    aiRateDelta = 2.5;
    aiLabel = 'High';
  } else if (congestionProb >= 0.5) {
    aiRateDelta = 1.5;
    aiLabel = 'Elevated';
  } else if (congestionProb >= 0.25) {
    aiRateDelta = 0.5;
    aiLabel = 'Guarded';
  }
  const aiCostDelta = Math.round(energyNeeded * aiRateDelta);

  // 4. Battery SOC
  let batteryRateDelta = 0;
  let batteryLabel = 'Normal';
  const isRescueMode = initialSoc <= 15;

  if (isRescueMode) {
    batteryRateDelta = -2.0;
    batteryLabel = 'Rescue Mode';
  } else if (initialSoc >= 80) {
    batteryRateDelta = 1.0;
    batteryLabel = 'High SOC';
  }
  const batteryCostDelta = Math.round(energyNeeded * batteryRateDelta);

  // 5. Station Bay Availability
  let occupiedBays = 0;
  if (telemetry?.terminalsData) {
    TERMINALS.forEach((t) => {
      if (telemetry.terminalsData[t.id]?.bayStatus === 'CHARGING') {
        occupiedBays += 1;
      }
    });
  }

  let availabilityRateDelta = 0;
  const freeBays = 3 - occupiedBays;
  const availabilityLabel = `${freeBays}/3 Free`;
  if (occupiedBays >= 2) {
    availabilityRateDelta = 1.5;
  } else if (occupiedBays === 1) {
    availabilityRateDelta = 0.5;
  }
  const availabilityCostDelta = Math.round(energyNeeded * availabilityRateDelta);

  // Subtotal & Caps
  const subtotal =
    baseCost + timeCostDelta + aiCostDelta + batteryCostDelta + availabilityCostDelta;

  const rescueCapDiscount = isRescueMode && subtotal > baseCost ? -(subtotal - baseCost) : 0;
  const afterCap = Math.max(0, subtotal + rescueCapDiscount);

  const minFeeAdjustment = afterCap < 50 ? 50 - afterCap : 0;
  const totalAmount = afterCap + minFeeAdjustment;

  const effectiveRate =
    energyNeeded > 0 ? Number((totalAmount / energyNeeded).toFixed(2)) : BASE_RATE_PER_KWH;

  return {
    effectiveRate,
    energyNeeded: Number(energyNeeded.toFixed(1)),
    baseCost,
    timeCostDelta,
    aiCostDelta,
    batteryCostDelta,
    availabilityCostDelta,
    rescueCapDiscount,
    minFeeAdjustment,
    totalAmount,
    congestionPercent: Math.round(congestionProb * 100),
    timeLabel,
    aiLabel,
    batteryLabel,
    availabilityLabel,
    isRescueMode,
  };
}

export default function ConnectScreen() {
  const telemetry = useTelemetry() as any;

  const [selectedTerminal, setSelectedTerminal] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(VEHICLE_OPTIONS[1]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [soc, setSoc] = useState('20');
  const [capacity, setCapacity] = useState('50');

  const [pendingLinkId, setPendingLinkId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false); // Collapsed by default

  // Pre-warm Render backend & ThingsBoard token on mount
  useEffect(() => {
    fetch(BACKEND_URL).catch(() => {});
    getThingsBoardToken().catch(() => {});
  }, []);

  const activeTerminalData = telemetry?.terminalsData
    ? telemetry.terminalsData[selectedTerminal]
    : telemetry;

  const power = activeTerminalData?.power ?? 0;
  const bayStatus = activeTerminalData?.bayStatus ?? 'STANDBY';
  const predictDuration =
    activeTerminalData?.predictedDurationMin ?? activeTerminalData?.predictDuration ?? 0;

  const numericCapacity = parseFloat(capacity) || 50;
  const numericSoc = parseFloat(soc) || 20;

  const pricing = useMemo(
    () => calculateDynamicPricing(numericCapacity, numericSoc, telemetry, activeTerminalData),
    [numericCapacity, numericSoc, telemetry, activeTerminalData]
  );

  const formatDelta = (val: number) => {
    if (val > 0) return `+₹${val}`;
    if (val < 0) return `-₹${Math.abs(val)}`;
    return '₹0';
  };

  const showToastNotification = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Optium-EV Alert',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  };

  const handleBaySwitch = (id: number) => {
    setSelectedTerminal(id);
    setSoc('20');
    setCapacity(id === 1 ? '4' : id === 3 ? '250' : '50');
    setPendingLinkId(null);
  };

  const showHelp = () => {
    Alert.alert(
      'How to use this terminal',
      '1. Select a Bay.\n2. Enter battery %.\n3. Tap Price Breakdown to view dynamic tariff details.\n4. Press Pay & Connect and verify payment to start charging.'
    );
  };

  const handleConnect = async () => {
    try {
      const jwtToken = await getThingsBoardToken();
      const deviceId = DEVICE_MAP[selectedTerminal];

      const attributeResponse = await fetch(
        `https://thingsboard.cloud/api/plugins/telemetry/DEVICE/${deviceId}/SHARED_SCOPE`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            initialSoc: parseFloat(soc) || 0,
            batteryCapacity: parseFloat(capacity) || 0,
            vehicleType: selectedVehicle.typeId,
            chargeNow: true,
            dynamicRatePerKwh: pricing.effectiveRate,
          }),
        }
      );

      if (attributeResponse.ok) {
        showToastNotification(`🔌 Charging Started on Terminal ${selectedTerminal}!`);
      } else {
        Alert.alert('Error', `ThingsBoard returned status ${attributeResponse.status}`);
      }
    } catch (error: any) {
      Alert.alert('Network Error', error.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      const jwtToken = await getThingsBoardToken();
      const deviceId = DEVICE_MAP[selectedTerminal];

      const attributeResponse = await fetch(
        `https://thingsboard.cloud/api/plugins/telemetry/DEVICE/${deviceId}/SHARED_SCOPE`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            initialSoc: 0,
            batteryCapacity: 0,
            vehicleType: 0,
            chargeNow: false,
          }),
        }
      );

      if (attributeResponse.ok) {
        setPendingLinkId(null);
        showToastNotification(`✅ Terminal ${selectedTerminal} disconnected successfully. Bay is FREE.`);
      } else {
        Alert.alert('Error', `ThingsBoard returned status ${attributeResponse.status}`);
      }
    } catch (error: any) {
      Alert.alert('Network Error', error.message);
    }
  };

  const downloadReceipt = async (
    terminalId: number,
    amount: number,
    paymentId: string,
    ratePerKwh: number,
    energyKwh: number
  ) => {
    try {
      const htmlContent = `
        <html>
          <body style="font-family: Helvetica, sans-serif; padding: 40px; color: #333;">
            <h1 style="color: #2b6cb0; text-align: center;">Optium-EV</h1>
            <h2 style="text-align: center; color: #4a5568;">Dynamic Tariff Charging Receipt</h2>
            <hr style="border: 1px solid #e2e8f0; margin: 30px 0;" />
            <table style="width: 100%; font-size: 18px; line-height: 2;">
              <tr>
                <td><strong>Date:</strong></td>
                <td style="text-align: right;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td><strong>Terminal ID:</strong></td>
                <td style="text-align: right;">Bay ${terminalId}</td>
              </tr>
              <tr>
                <td><strong>Energy Estimated:</strong></td>
                <td style="text-align: right;">${energyKwh} kWh</td>
              </tr>
              <tr>
                <td><strong>Dynamic Rate Applied:</strong></td>
                <td style="text-align: right;">₹${ratePerKwh}/kWh</td>
              </tr>
              <tr>
                <td><strong>Amount Paid:</strong></td>
                <td style="text-align: right; color: #047857; font-weight: bold;">₹${amount}</td>
              </tr>
              <tr>
                <td><strong>Transaction ID:</strong></td>
                <td style="text-align: right; font-size: 14px; color: #718096;">${paymentId}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td style="text-align: right; color: #2e7d32; font-weight: bold;">SUCCESS</td>
              </tr>
            </table>
            <hr style="border: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="text-align: center; color: #718096; font-size: 14px;">
              Thank you for charging with Optium-EV.<br>Save this receipt for your records.
            </p>
          </body>
        </html>
      `;

      await Print.printAsync({ html: htmlContent });
    } catch (error: any) {
      console.error('Receipt generation failed:', error);
      Alert.alert('Error', 'Could not open receipt dialog.');
    }
  };

  const handlePaySession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/create-payment-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: pricing.totalAmount,
          ratePerKwh: pricing.effectiveRate,
          terminalId: selectedTerminal,
          vehicleType: selectedVehicle.typeId,
          batteryCapacity: numericCapacity,
          initialSoc: numericSoc,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        setPendingLinkId(data.linkId);
        await Linking.openURL(data.url);
      } else {
        Alert.alert('Backend Error Details', JSON.stringify(data));
      }
    } catch (err: any) {
      Alert.alert('Connection Error', `Failed to reach payment server: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    setIsLoading(true);
    try {
      const verifyRes = await fetch(`${BACKEND_URL}/api/verify-link-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: pendingLinkId }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        const activeLinkId = pendingLinkId || 'Verified';
        setPendingLinkId(null);
        showToastNotification('Payment Settled! Initiating charging...');
        await handleConnect();
        await downloadReceipt(
          selectedTerminal,
          pricing.totalAmount,
          activeLinkId,
          pricing.effectiveRate,
          pricing.energyNeeded
        );
      } else {
        Alert.alert(
          'Verification Failed',
          verifyData.message || 'Payment not completed or not found.'
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to reach backend to settle payment.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentBayOccupied = bayStatus === 'CHARGING';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Connect Vehicle</Text>
          <TouchableOpacity style={styles.helpButton} onPress={showHelp}>
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Terminal {selectedTerminal} Live Preview</Text>
          <Text style={styles.statusValue}>
            Status:{' '}
            <Text
              style={{
                fontWeight: 'bold',
                color: isCurrentBayOccupied ? '#d32f2f' : '#2e7d32',
              }}
            >
              {isCurrentBayOccupied ? 'OCCUPIED' : 'AVAILABLE NOW'}
            </Text>
          </Text>
          <Text style={styles.statusValue}>Power: {power} W</Text>

          {isCurrentBayOccupied && (
            <View style={styles.waitContainer}>
              <Text style={styles.waitText}>
                ⏱️ Next Bay Available In: {predictDuration} mins
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Select Terminal</Text>
        <View style={styles.terminalRow}>
          {TERMINALS.map((term) => (
            <TouchableOpacity
              key={term.id}
              style={[
                styles.terminalButton,
                selectedTerminal === term.id && styles.terminalButtonActive,
              ]}
              onPress={() => handleBaySwitch(term.id)}
            >
              <Text
                style={[
                  styles.terminalText,
                  selectedTerminal === term.id && styles.terminalTextActive,
                ]}
              >
                Bay {term.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Vehicle Type</Text>
        <TouchableOpacity
          style={styles.dropdownSelector}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownSelectorText}>{selectedVehicle.label}</Text>
          <Text style={styles.arrowIcon}>▼</Text>
        </TouchableOpacity>

        <Modal visible={dropdownVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Vehicle Category</Text>
              {VEHICLE_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.typeId}
                  style={[
                    styles.modalItem,
                    selectedVehicle.typeId === item.typeId && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    setSelectedVehicle(item);
                    setCapacity(item.defaultCapacity);
                    setDropdownVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedVehicle.typeId === item.typeId && styles.modalItemTextActive,
                    ]}
                  >
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
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={soc}
              onChangeText={setSoc}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Capacity (kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
            />
          </View>
        </View>

        {/* --- COMPACT DYNAMIC PRICE DROPDOWN --- */}
        <View style={styles.pricingCard}>
          <TouchableOpacity
            style={styles.pricingHeaderRow}
            onPress={() => setShowBreakdown(!showBreakdown)}
            activeOpacity={0.7}
          >
            <View style={styles.pricingLeft}>
              <Text style={styles.pricingTitle}>⚡ Dynamic Price</Text>
              <Text style={styles.pricingSubtitle}>
                ₹{pricing.effectiveRate}/kWh · {pricing.energyNeeded} kWh
              </Text>
            </View>

            <View style={styles.pricingRight}>
              <Text style={styles.pricingTotalValue}>₹{pricing.totalAmount}</Text>
              <Text style={styles.chevronText}>{showBreakdown ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>

          {showBreakdown && (
            <View style={styles.breakdownPane}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingKey}>Base ({pricing.energyNeeded} kWh)</Text>
                <Text style={styles.pricingVal}>₹{pricing.baseCost}</Text>
              </View>

              <View style={styles.pricingRow}>
                <Text style={styles.pricingKey}>Time · {pricing.timeLabel}</Text>
                <Text
                  style={[
                    styles.pricingVal,
                    pricing.timeCostDelta > 0 && styles.chargeText,
                    pricing.timeCostDelta < 0 && styles.discountText,
                  ]}
                >
                  {formatDelta(pricing.timeCostDelta)}
                </Text>
              </View>

              <View style={styles.pricingRow}>
                <Text style={styles.pricingKey}>
                  AI Forecast · {pricing.aiLabel} ({pricing.congestionPercent}%)
                </Text>
                <Text
                  style={[
                    styles.pricingVal,
                    pricing.aiCostDelta > 0 && styles.chargeText,
                  ]}
                >
                  {formatDelta(pricing.aiCostDelta)}
                </Text>
              </View>

              <View style={styles.pricingRow}>
                <Text style={styles.pricingKey}>Battery · {pricing.batteryLabel}</Text>
                <Text
                  style={[
                    styles.pricingVal,
                    pricing.batteryCostDelta > 0 && styles.chargeText,
                    pricing.batteryCostDelta < 0 && styles.discountText,
                  ]}
                >
                  {formatDelta(pricing.batteryCostDelta)}
                </Text>
              </View>

              <View style={styles.pricingRow}>
                <Text style={styles.pricingKey}>Bays · {pricing.availabilityLabel}</Text>
                <Text
                  style={[
                    styles.pricingVal,
                    pricing.availabilityCostDelta > 0 && styles.chargeText,
                  ]}
                >
                  {formatDelta(pricing.availabilityCostDelta)}
                </Text>
              </View>

              {pricing.rescueCapDiscount < 0 && (
                <View style={styles.pricingRow}>
                  <Text style={[styles.pricingKey, styles.discountText]}>
                    Rescue Surge Cap
                  </Text>
                  <Text style={[styles.pricingVal, styles.discountText]}>
                    {formatDelta(pricing.rescueCapDiscount)}
                  </Text>
                </View>
              )}

              {pricing.minFeeAdjustment > 0 && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingKey}>Min Session Fee</Text>
                  <Text style={styles.pricingVal}>+₹{pricing.minFeeAdjustment}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {isCurrentBayOccupied ? (
            <View
              style={[
                styles.payButton,
                { backgroundColor: '#9ca3af', borderColor: '#6b7280' },
              ]}
            >
              <Text style={styles.payButtonText}>Terminal Occupied</Text>
            </View>
          ) : pendingLinkId ? (
            <TouchableOpacity
              style={[styles.payButton, { backgroundColor: '#2563EB' }]}
              onPress={handleVerifyPayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.payButtonText}>✅ I have Paid: Verify & Connect</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePaySession}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.payButtonText}>
                  💳 Pay & Connect (₹{pricing.totalAmount})
                </Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
            <Text style={styles.disconnectButtonText}>Stop Session & Disconnect</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f7fa', paddingBottom: 40 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1a252c' },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2b6cb0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  statusTitle: { fontSize: 16, fontWeight: '700', color: '#2b6cb0', marginBottom: 6 },
  statusValue: { fontSize: 14, color: '#4a5568', marginBottom: 2 },
  waitContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  waitText: { fontSize: 14, color: '#b45309', fontWeight: 'bold', textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#4a5568', marginBottom: 6, marginTop: 10 },
  terminalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  terminalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#cbd5e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  terminalButtonActive: { backgroundColor: '#2b6cb0', borderColor: '#2b6cb0' },
  terminalText: { fontSize: 13, fontWeight: '600', color: '#4a5568' },
  terminalTextActive: { color: '#ffffff' },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dropdownSelectorText: { fontSize: 15, color: '#2d3748', fontWeight: '500' },
  arrowIcon: { fontSize: 12, color: '#718096' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16 },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  modalItemActive: { backgroundColor: '#ebf8ff' },
  modalItemText: { fontSize: 15, color: '#4a5568' },
  modalItemTextActive: { color: '#2b6cb0', fontWeight: '700' },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#2d3748',
    marginBottom: 6,
  },
  pricingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  pricingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLeft: {
    flex: 1,
  },
  pricingTitle: { fontSize: 14, fontWeight: '700', color: '#1a252c' },
  pricingSubtitle: { fontSize: 11, color: '#718096', marginTop: 1 },
  pricingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pricingTotalValue: { fontSize: 16, fontWeight: '800', color: '#047857' },
  chevronText: { fontSize: 11, color: '#718096', fontWeight: '700' },
  breakdownPane: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    gap: 5,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingKey: { fontSize: 12, color: '#4a5568', flex: 1, paddingRight: 8 },
  pricingVal: { fontSize: 12, fontWeight: '600', color: '#2d3748' },
  chargeText: { color: '#c53030', fontWeight: '700' },
  discountText: { color: '#047857', fontWeight: '700' },
  buttonContainer: { marginTop: 16, gap: 12 },
  payButton: {
    backgroundColor: '#047857',
    borderWidth: 1,
    borderColor: '#064e3b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  payButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  disconnectButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disconnectButtonText: { color: '#DC2626', fontSize: 16, fontWeight: '700' },
});