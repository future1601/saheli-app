import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { quizData } from "./quizData"; // Adjust path if needed

export default function Quiz() {
  const router = useRouter();
  const { chapterId } = useLocalSearchParams();
  
  // Load correct question set based on chapter
  const questions = quizData[chapterId ?? "1"] ?? [];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const handleSelectOption = (optIndex: number) => {
    setSelectedIndex(optIndex);
  };

  const handleNext = () => {
    // Compute the updated score value without waiting for state to update
    let updatedScore = score;
    if (selectedIndex === questions[currentQ].correctIndex) {
      updatedScore = score + 1;
      setScore(updatedScore);
    }

    // Move to next question or finish
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedIndex(null);
    } else {
      router.push({
        pathname: "/(tabs)/learn/QuizResult",
        params: { score: updatedScore, total: questions.length },
      });
    }
  };

  // Handle no question data
  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No questions found for Chapter {chapterId}
        </Text>
      </View>
    );
  }

  const question = questions[currentQ];
  const progressPercentage = ((currentQ + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
        />
      </View>

      {/* Question Text */}
      <Text style={styles.questionText}>{question.text}</Text>

      {/* Options (white boxes) */}
      {question.options.map((opt, i) => {
        const isSelected = i === selectedIndex;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.optionButton, isSelected && styles.optionSelected]}
            onPress={() => handleSelectOption(i)}
          >
            <Text
              style={[styles.optionText, isSelected && styles.optionTextSelected]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Next / Finish Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedIndex === null && { opacity: 0.6 }
        ]}
        onPress={handleNext}
        disabled={selectedIndex === null}
      >
        <Text style={styles.nextButtonText}>
          {currentQ < questions.length - 1 ? "Next" : "Finish"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#CBD5E1",
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FB7185", // red-ish fill
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  optionSelected: {
    backgroundColor: "#D1FAE5", // light green
  },
  optionText: {
    fontSize: 14,
    color: "#1F2937",
  },
  optionTextSelected: {
    color: "#036752",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});
