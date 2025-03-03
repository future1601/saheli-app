import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import DynamicText from '../../../components/DynamicText';
import translateText from '/home/mors/saheli-app/app/translateText.js';

export default function QuizResult() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const params = useLocalSearchParams();
  
  // Parse parameters from URL
  const score = parseInt(params.score as string) || 0;
  const total = parseInt(params.total as string) || 0;
  const correctAnswers = score; // Since score represents correct answers
  
  const [translatedFeedback, setTranslatedFeedback] = useState("");

  useEffect(() => {
    // Set feedback based on score percentage
    const percentage = (correctAnswers / total) * 100;
    let feedback = "";

    if (percentage >= 80) {
      feedback = "Excellent work! You're mastering this topic!";
    } else if (percentage >= 60) {
      feedback = "Good job! Keep practicing to improve further.";
    } else {
      feedback = "Keep trying! Practice makes perfect.";
    }

    // Skip translation for now to isolate the issue
    setTranslatedFeedback(feedback);
  }, [correctAnswers, total]);

  const handleRetry = () => {
    // Go back to the quiz
    router.back();
  };

  const handleContinue = () => {
    // Go back to the chapter list
    router.push("/(tabs)/learn");
  };

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
        <Text style={styles.scoreValue}>{score}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.correctLabel}>Total Questions</Text>
            <Text style={styles.correctValue}>{total}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.correctLabel}>Correct Answers</Text>
            <Text style={styles.correctValue}>{correctAnswers}</Text>
          </View>
        </View>

        <Text style={styles.feedback}>{translatedFeedback}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetry}>
          <Text style={styles.okButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleContinue}>
          <Text style={styles.okButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
  },
  feedback: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: "#0F766E",
  },
  okButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
