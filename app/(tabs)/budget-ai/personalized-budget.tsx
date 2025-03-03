import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useBudget } from "../../../context/BudgetContext";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://192.168.160.147:5000"; // Updated to port 5000
const screenWidth = Dimensions.get("window").width;

export default function PersonalizedBudget() {
  const router = useRouter();
  const { income } = useBudget();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");
  const [budgetData, setBudgetData] = useState(null);
  const [actualData, setActualData] = useState(null);

  useEffect(() => {
    generateBudget();
  }, []);

  const generateBudget = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/generateBudget`, {
        income: income,
      });

      setAnalysis(response.data.analysis);
      
      // Process budget data for chart
      if (response.data.budget) {
        setBudgetData(response.data.budget);
      }
      
      // Process actual spending data
      if (response.data.actual) {
        setActualData(response.data.actual);
      }
    } catch (error) {
      console.error("Error generating budget:", error);
      Alert.alert(
        "Error",
        "Failed to generate budget analysis. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async () => {
    try {
      await axios.post(`${API_URL}/api/saveBudget`, {
        budget: budgetData
      });
      Alert.alert("Success", "Budget saved successfully");
    } catch (error) {
      console.error("Error saving budget:", error);
      Alert.alert("Error", "Failed to save budget. Please try again.");
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!budgetData || !actualData) {
      return {
        labels: [],
        datasets: [
          { data: [] },
          { data: [] }
        ],
        legend: ["Recommended", "Actual"]
      };
    }

    const categories = Object.keys(budgetData);
    const recommendedValues = categories.map(cat => budgetData[cat]);
    const actualValues = categories.map(cat => actualData[cat] || 0);

    return {
      labels: categories,
      datasets: [
        {
          data: recommendedValues,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue for recommended
          strokeWidth: 2
        },
        {
          data: actualValues,
          color: (opacity = 1) => `rgba(0, 200, 100, ${opacity})`, // Green for actual
          strokeWidth: 2
        }
      ],
      legend: ["Recommended", "Actual"]
    };
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
    propsForLabels: {
      fontSize: 12,
    },
    formatYLabel: (yValue) => `${yValue}%`,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalized Budget</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF3B5C" />
            <Text style={styles.loadingText}>Generating your personalized budget...</Text>
          </View>
        ) : (
          <>
            <View style={styles.incomeContainer}>
              <Text style={styles.incomeLabel}>Monthly Income</Text>
              <Text style={styles.incomeValue}>₹{income.toLocaleString()}</Text>
            </View>

            {budgetData && actualData && (
              <View style={styles.chartCard}>
                <Text style={styles.sectionTitle}>Budget Breakdown</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                    data={prepareChartData()}
                    width={Math.max(screenWidth - 40, prepareChartData().labels.length * 60)}
                    height={220}
                    chartConfig={chartConfig}
                    fromZero
                    style={styles.chartStyle}
                    withInnerLines={false}
                    showBarTops={false}
                    segments={4}
                    yAxisLabel=""
                    yAxisSuffix="%"
                  />
                </ScrollView>
              </View>
            )}

            <View style={styles.analysisCard}>
              <Text style={styles.sectionTitle}>Budget Recommendations</Text>
              {budgetData && Object.entries(budgetData).map(([category, percentage]) => (
                <View key={category} style={styles.budgetItem}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.percentage}>{percentage}%</Text>
                </View>
              ))}
            </View>

            <View style={styles.analysisCard}>
              <Text style={styles.sectionTitle}>Analysis</Text>
              <Text style={styles.analysisText}>{analysis}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={saveBudget}>
                <Text style={styles.saveButtonText}>Set as New Budget</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.refreshButton} onPress={generateBudget}>
                <Text style={styles.refreshButtonText}>Refresh Analysis</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.bottomPadding} />
          </>
        )}
      </ScrollView>
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
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  incomeContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeLabel: {
    fontSize: 16,
    color: "#666",
  },
  incomeValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  analysisCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  budgetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryName: {
    fontSize: 16,
    color: "#333",
  },
  percentage: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF3B5C",
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 10,
    gap: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50", // Green for save button
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#FF3B5C",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 40,
  }
}); 