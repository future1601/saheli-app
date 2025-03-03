import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { BarChart } from "react-native-chart-kit";
import { useBudget } from "../../../context/BudgetContext";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";

// Get device width for chart sizing
const screenWidth = Dimensions.get("window").width;
const API_URL = "http://192.168.160.147:5000";

export default function BudgetAIHome() {
  const router = useRouter();
  const { income } = useBudget();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/getBudgetData?period=daily`);
      
      // Process the data for the chart
      const labels = response.data.labels || [];
      const expenseData = response.data.expenses || [];
      
      setChartData({
        labels: labels,
        datasets: [
          {
            data: expenseData,
            color: (opacity = 1) => `rgba(255, 59, 92, ${opacity})`, // Red for expenses
            strokeWidth: 2
          }
        ],
        legend: ["% of Salary Spent"]
      });
    } catch (error) {
      console.error("Error fetching budget data:", error);
      Alert.alert("Error", "Failed to fetch budget data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Chart config
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
    propsForLabels: {
      fontSize: 12,
    },
    propsForVerticalLabels: {
      fontSize: 10,
    },
    formatYLabel: (yValue) => `${yValue}`,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Budget AI</Text>
            <View style={styles.incomeContainer}>
              <Text style={styles.incomeLabel}>Monthly Income:</Text>
              <Text style={styles.incomeValue}>₹{income.toLocaleString()}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.alertButton}
            onPress={() => router.push("/budget-ai/alerts")}
          >
            <Ionicons name="notifications" size={24} color="#FF3B5C" />
          </TouchableOpacity>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending by Category (% of Salary)</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF3B5C" />
              <Text style={styles.loadingText}>Loading budget data...</Text>
            </View>
          ) : chartData ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={chartData}
                width={Math.max(screenWidth - 40, chartData.labels.length * 60)}
                height={220}
                chartConfig={chartConfig}
                style={styles.chartStyle}
                fromZero
                showValuesOnTopOfBars
                withInnerLines={true}
              />
            </ScrollView>
          ) : (
            <Text style={styles.errorText}>No budget data available</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push("/budget-ai/financial-diary")}
        >
          <Text style={styles.actionButtonText}>Add New Expense</Text>
          <View style={styles.iconContainer}>
            <Ionicons name="add-circle" size={24} color="#FF3B5C" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push("/budget-ai/personalized-budget")}
        >
          <Text style={styles.actionButtonText}>View Personalized Budget</Text>
          <View style={styles.iconContainer}>
            <Ionicons name="pie-chart" size={24} color="#FF3B5C" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push("/budget-ai/edit-income")}
        >
          <Text style={styles.actionButtonText}>Edit Income</Text>
          <View style={styles.iconContainer}>
            <Ionicons name="cash" size={24} color="#FF3B5C" />
          </View>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  incomeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  incomeLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  incomeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B5C",
  },
  alertButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  chartStyle: {
    borderRadius: 16,
    paddingRight: 20,
  },
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  errorText: {
    height: 220,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#FF3B5C",
    fontSize: 16,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomPadding: {
    height: 80, // Extra space at the bottom to ensure content is scrollable past the tab bar
  }
}); 