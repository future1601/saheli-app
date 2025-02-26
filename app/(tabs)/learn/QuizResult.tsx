import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function QuizResult() {
  const router = useRouter();
  const { score, total } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Fake top bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Learn & Earn</Text>
      </View>

      {/* Celebration Image */}
      <Image
        source={require("../../../assets/images/quiz-result.png")}
        style={styles.celebrationImage}
        resizeMode="contain"
      />

      {/* Score & Answers */}
      <View style={styles.resultCard}>
        <Text style={styles.scoreLabel}>SCORE GAINED</Text>
        <Text style={styles.scoreValue}>{score || 0}</Text>

        <Text style={styles.correctLabel}>CORRECT ANSWERS</Text>
        <Text style={styles.correctValue}>
          {score || 0} / {total || 0}
        </Text>
      </View>

      {/* Ok Button */}
      <TouchableOpacity style={styles.okButton} onPress={() => router.push("/(tabs)/learn")}>
        <Text style={styles.okButtonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    padding: 16,
    paddingTop: 50,
    alignItems: "center",
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  celebrationImage: {
    width: "70%",
    height: 200,
    marginTop: 40,
  },
  resultCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    width: "90%",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 16,
  },
  correctLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  correctValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  okButton: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginTop: 30,
  },
  okButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
