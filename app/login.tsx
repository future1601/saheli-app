import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useTranslation } from 'react-i18next';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert(t("login.successful"));
      router.push("/(tabs)/home");
    } catch (error) {
      setError(t("login.invalidCredentials"));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      Alert.alert(t("login.successful"));
      router.push("/(tabs)/home");
    } catch (error) {
      Alert.alert(t("login.googleError"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {/* Forgot Password */}
        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Not registered? Register */}
      <TouchableOpacity 
        style={styles.registerContainer}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.registerText}>
          Not registered with us? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </TouchableOpacity>

      {/* or login with */}
      <Text style={styles.orLoginWith}>or login with</Text>

      {/* Google Login */}
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Image
          source={require("/home/mors/saheli-app/assets/images/google-icon.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles with added register button styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 80,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgotPassword: {
    fontSize: 12,
    color: "#007AFF",
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#FF3B5C",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    color: "#FF3B5C",
    fontWeight: "bold",
  },
  orLoginWith: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#666",
  },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
