import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useBudget } from "../../../context/BudgetContext";
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://192.168.160.147:5000"; 

export default function BudgetAlerts() {
  const router = useRouter();
  const { income } = useBudget();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/getBudgetAlerts`);
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      Alert.alert("Error", "Failed to fetch alerts. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearAllAlerts = async () => {
    Alert.alert(
      "Clear All Alerts",
      "Are you sure you want to clear all budget alerts?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          onPress: async () => {
            setLoading(true);
            try {
              // Alternative method if API fails - clear alerts locally
              setAlerts([]);
              
              try {
                // Try to call the API endpoint
                await axios.post(`${API_URL}/api/clearBudgetAlerts`);
                Alert.alert("Success", "All budget alerts have been cleared.");
              } catch (apiError) {
                console.error("Error clearing alerts via API:", apiError);
                // If API fails, create a fallback method to clear alerts
                try {
                  // Try to update the alerts file directly with an empty array
                  await axios.post(`${API_URL}/api/getBudgetAlerts`, { alerts: [] });
                  Alert.alert("Success", "All budget alerts have been cleared.");
                } catch (fallbackError) {
                  console.error("Fallback error:", fallbackError);
                  Alert.alert("Warning", "Alerts cleared from display, but server may not be updated.");
                }
              }
            } catch (error) {
              console.error("Error clearing alerts:", error);
              Alert.alert("Error", "Failed to clear alerts. Please try again.");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderAlertItem = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={[styles.alertBadge, { backgroundColor: item.severity === 'high' ? '#FF3B5C' : '#FFA500' }]}>
          <Text style={styles.alertBadgeText}>{item.severity === 'high' ? 'Overspent' : 'Warning'}</Text>
        </View>
        <Text style={styles.alertDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      
      <Text style={styles.alertTitle}>{item.category} Budget Alert</Text>
      <Text style={styles.alertDescription}>{item.message}</Text>
      
      <View style={styles.alertStats}>
        <View style={styles.alertStatItem}>
          <Text style={styles.alertStatLabel}>Budget Limit</Text>
          <Text style={styles.alertStatValue}>₹{item.limit.toFixed(2)}</Text>
        </View>
        <View style={styles.alertStatItem}>
          <Text style={styles.alertStatLabel}>Spent</Text>
          <Text style={[styles.alertStatValue, { color: '#FF3B5C' }]}>₹{item.spent.toFixed(2)}</Text>
        </View>
        <View style={styles.alertStatItem}>
          <Text style={styles.alertStatLabel}>Overspent</Text>
          <Text style={[styles.alertStatValue, { color: '#FF3B5C' }]}>
            {item.spent > item.limit ? `₹${(item.spent - item.limit).toFixed(2)}` : '₹0.00'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budget Alerts</Text>
        <TouchableOpacity onPress={fetchAlerts}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B5C" />
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {alerts.length > 0 ? (
            <>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearAllAlerts}
              >
                <Ionicons name="trash-outline" size={18} color="#FFF" />
                <Text style={styles.clearButtonText}>Clear All Alerts</Text>
              </TouchableOpacity>
              
              <FlatList
                data={alerts}
                renderItem={renderAlertItem}
                keyExtractor={(item, index) => `alert-${index}`}
                contentContainerStyle={styles.alertsList}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
              <Text style={styles.emptyTitle}>No Budget Alerts</Text>
              <Text style={styles.emptyText}>
                You're doing great! All your spending is within budget limits.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B5C",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  alertsList: {
    padding: 16,
    paddingTop: 8,
  },
  alertCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  alertBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  alertDate: {
    fontSize: 14,
    color: "#666",
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 22,
  },
  alertStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  alertStatItem: {
    flex: 1,
  },
  alertStatLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  alertStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
}); 