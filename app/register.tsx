import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { useTranslation } from 'react-i18next';

// Avatar images
const avatars = [
  { id: 1, source: require('../assets/images/avatar-1.png') },
  { id: 2, source: require('../assets/images/avatar-2.png') },
  { id: 3, source: require('../assets/images/avatar-3.png') },
  { id: 4, source: require('../assets/images/avatar-4.png') },
  { id: 5, source: require('../assets/images/avatar-5.png') },
];

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email,
        avatarId: selectedAvatar,
        createdAt: new Date()
      });

      router.push("/(tabs)/home");
    } catch (error) {
      setError(t("register.error"));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Avatar Selection */}
      <Text style={styles.label}>Choose Your Avatar</Text>
      <View style={styles.avatarContainer}>
        {avatars.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            style={[
              styles.avatarOption,
              selectedAvatar === avatar.id && styles.selectedAvatarOption
            ]}
            onPress={() => setSelectedAvatar(avatar.id)}
          >
            <Image source={avatar.source} style={styles.avatarImage} />
          </TouchableOpacity>
        ))}
      </View>

      {/* First Name & Last Name */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        placeholder="John"
        placeholderTextColor="#999"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        placeholder="Doe"
        placeholderTextColor="#999"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      {/* E-mail */}
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

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.passwordHint}>must contain 8 char.</Text>

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        placeholder="Re-enter your password"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Create Account Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleRegister}
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
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
    borderColor: '#FF3B5C',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
