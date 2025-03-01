import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import DynamicText from '../../../components/DynamicText';
import translateText from '/home/mors/saheli-app/app/translateText.js';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onRetry: () => void;
  onContinue: () => void;
}

export default function QuizResult({ 
  score, 
  totalQuestions, 
  correctAnswers, 
  onRetry, 
  onContinue 
}: QuizResultProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [translatedFeedback, setTranslatedFeedback] = useState("");

  useEffect(() => {
    const translateFeedback = async () => {
      const percentage = (correctAnswers / totalQuestions) * 100;
      let feedback = "";

      if (percentage >= 80) {
        feedback = "Excellent work! You're mastering this topic!";
      } else if (percentage >= 60) {
        feedback = "Good job! Keep practicing to improve further.";
      } else {
        feedback = "Keep trying! Practice makes perfect.";
      }

      if (i18n.language === 'en') {
        setTranslatedFeedback(feedback);
        return;
      }

      try {
        const translated = await translateText(feedback, i18n.language);
        setTranslatedFeedback(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedFeedback(feedback);
      }
    };

    translateFeedback();
  }, [i18n.language, correctAnswers, totalQuestions]);

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
        <DynamicText text="SCORE GAINED" style={styles.scoreLabel} />
        <Text style={styles.scoreValue}>{score}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <DynamicText text="Total Questions" style={styles.correctLabel} />
            <Text style={styles.correctValue}>{totalQuestions}</Text>
          </View>
          <View style={styles.stat}>
            <DynamicText text="Correct Answers" style={styles.correctLabel} />
            <Text style={styles.correctValue}>{correctAnswers}</Text>
          </View>
        </View>

        <Text style={styles.feedback}>{translatedFeedback}</Text>
      </View>

      {/* Ok Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <DynamicText text="Try Again" style={styles.okButtonText} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onContinue}>
          <DynamicText text="Continue" style={styles.okButtonText} />
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
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
  },
  feedback: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 14,
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
