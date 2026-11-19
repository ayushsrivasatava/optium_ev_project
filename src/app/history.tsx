import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BACKEND_URL = 'http://10.118.132.179:5000'; // Match your backend IP

export default function HistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all successful charging sessions
    fetch(`${BACKEND_URL}/api/charging-sessions`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter to only show paid/successful sessions and sort by newest first
          const paidSessions = data.data
            .filter((s: any) => s.paymentStatus === 'SUCCESS')
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setSessions(paidSessions);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.amountText}>₹{item.amountInr}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.detailText}>Terminal: {item.terminalId}</Text>
        <Text style={styles.detailText}>Energy: {item.batteryCapacity} kWh (Start: {item.initialSoc}%)</Text>
        <Text style={styles.txnText}>Txn ID: {item.razorpayPaymentId}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#064E3B" />
        </TouchableOpacity>
        <Text style={styles.title}>Charging History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#059669" style={{ marginTop: 50 }} />
      ) : sessions.length === 0 ? (
        <Text style={styles.emptyText}>No previous charging sessions found.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#D1FAE5' },
  backBtn: { marginRight: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#064E3B' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10, marginBottom: 10 },
  dateText: { fontSize: 16, fontWeight: '600', color: '#334155' },
  amountText: { fontSize: 18, fontWeight: 'bold', color: '#059669' },
  cardBody: { gap: 4 },
  detailText: { fontSize: 14, color: '#475569' },
  txnText: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#64748B' }
});