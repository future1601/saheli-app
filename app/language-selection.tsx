import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const languages = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Gujarati", "Marathi",
  "Punjabi", "Malayalam", "Kannada", "Odia", "Urdu", "Assamese"
];

export default function LanguageSelection() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      {/* Splash Text */}
      <Text style={styles.title}>Saheli</Text>
      <Text style={styles.subtitle}>Empower Your Financial Journey</Text>

      {/* Language Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selected}
          onValueChange={(itemValue) => {
            setSelected(itemValue);
            setTimeout(() => router.push("/onboarding"), 500);
          }}
          style={styles.picker}
          dropdownIconColor="black"
        >
          <Picker.Item label="Select Language" value="" />
          {languages.map((lang, index) => (
            <Picker.Item key={index} label={lang} value={lang} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    fontFamily: "SpaceMono-Regular",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "SpaceMono-Regular",
  },
  pickerContainer: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 30,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
