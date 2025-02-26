import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Illustration */}
      <Image
        source={require("/home/mors/saheli-app/assets/images/splash-image.png")}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Title & Subtitle */}
      <Text style={styles.title}>Saheli</Text>
      <Text style={styles.subtitle}>Empower Your Financial Journey</Text>

      {/* Buttons Container */}
      <View style={styles.buttonRow}>
        {/* Register (Outlined) */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Login (Solid Pink) */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("/home/mors/saheli-app/assets/images/google-icon.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

// 💠 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 60,
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "SpaceMono", // Ensure you have loaded this font
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 30,
    width: "80%",
    justifyContent: "space-between",
  },
  registerButton: {
    borderWidth: 2,
    borderColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#FF3B5C",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 25,
    width: "80%",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
