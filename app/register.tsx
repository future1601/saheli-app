import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* First Name & Last Name */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        placeholder="John"
        placeholderTextColor="#999"
        style={styles.input}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        placeholder="Doe"
        placeholderTextColor="#999"
        style={styles.input}
      />

      {/* E-mail */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
      />
      <Text style={styles.passwordHint}>must contain 8 char.</Text>

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        placeholder="Re-enter your password"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
      />

      {/* Create Account Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => router.push("/home")} // <-- Navigates to Home
      >
        <Text style={styles.createButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Terms & Privacy */}
      <Text style={styles.agreement}>
        By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#1F1F1F",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#1F1F1F",
    fontWeight: "600",
  },
  input: {
    height: 50,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 16,
    color: "#000",
  },
  passwordHint: {
    fontSize: 12,
    color: "#999",
    marginTop: -12,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#FF3B5C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  agreement: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
