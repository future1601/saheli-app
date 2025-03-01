import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'mr', name: 'मराठी' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'ur', name: 'اردو' },
  { code: 'as', name: 'অসমীয়া' },
];

export default function LanguageSelection() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleLanguageSelect = async (langCode) => {
    setSelected(langCode);
    try {
      // Direct import and use of i18n instance
      i18n.changeLanguage(langCode);
      console.log('Language changed to:', langCode);
      // Store language preference
      await AsyncStorage.setItem('@language', langCode);
      setTimeout(() => router.push("/onboarding"), 500);
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert("Error", "Failed to change language. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Splash Text */}
      <Text style={styles.title}>Saheli</Text>
      <Text style={styles.subtitle}>Empower Your Financial Journey</Text>

      {/* Language Grid */}
      <View style={styles.languageGrid}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              selected === lang.code && styles.selectedLanguage,
            ]}
            onPress={() => handleLanguageSelect(lang.code)}
          >
            <Text
              style={[
                styles.languageText,
                selected === lang.code && styles.selectedLanguageText,
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  languageButton: {
    width: "48%",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  selectedLanguage: {
    backgroundColor: "#FF3B5C",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLanguageText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
