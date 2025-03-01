import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next';
import DynamicText from '../../../components/DynamicText';
import translateText from '/home/mors/saheli-app/app/translateText.js';

// Correct image imports using absolute paths
const avatarSita = require("/home/mors/saheli-app/assets/images/avatar-sita.png");
const avatarGita = require("/home/mors/saheli-app/assets/images/avatar-gita.png");
const avatarKaju = require("/home/mors/saheli-app/assets/images/avatar-kaju.png");
const avatarSamita = require("/home/mors/saheli-app/assets/images/avatar-samita.png");
const avatarYou = require("/home/mors/saheli-app/assets/images/avatar-you.png");

const allMembers = [
  { id: "1", name: "Sita Thakur", avatar: avatarSita },
  { id: "2", name: "Gita Mishra", avatar: avatarGita },
  { id: "3", name: "Kaju Thakur", avatar: avatarKaju },
  { id: "4", name: "Samita Aja", avatar: avatarSamita },
  // "You" is here, but we won't show it until user joins
  { id: "7", name: "You", avatar: avatarYou },
];

export default function KittyPoolDetail() {
  const router = useRouter();
  const { poolName } = useLocalSearchParams();
  const { i18n } = useTranslation();

  // Track whether the user has joined or not
  const [hasJoined, setHasJoined] = useState(false);

  const [translatedData, setTranslatedData] = useState({
    poolName: "Monthly Savings Pool",
    description: "Join our monthly savings pool and grow your money together!",
    monthlyAmount: "₹1,000",
    totalPool: "₹12,000",
    specialGuest: "Priya Sharma",
    guestTitle: "Financial Advisor"
  });

  useEffect(() => {
    const translateContent = async () => {
      if (i18n.language === 'en') {
        setTranslatedData({
          poolName: "Monthly Savings Pool",
          description: "Join our monthly savings pool and grow your money together!",
          monthlyAmount: "₹1,000",
          totalPool: "₹12,000",
          specialGuest: "Priya Sharma",
          guestTitle: "Financial Advisor"
        });
        return;
      }

      try {
        const [poolName, description, specialGuest, guestTitle] = await Promise.all([
          translateText("Monthly Savings Pool", i18n.language),
          translateText("Join our monthly savings pool and grow your money together!", i18n.language),
          translateText("Priya Sharma", i18n.language),
          translateText("Financial Advisor", i18n.language)
        ]);

        setTranslatedData({
          poolName,
          description,
          monthlyAmount: "₹1,000",
          totalPool: "₹12,000",
          specialGuest,
          guestTitle
        });
      } catch (error) {
        console.error('Translation error:', error);
      }
    };

    translateContent();
  }, [i18n.language]);

  // Decide which members to show: if hasJoined is false, exclude "You"
  const displayedMembers = hasJoined
    ? allMembers
    : allMembers.filter((member) => member.id !== "7");

  const renderItem = ({ item }) => {
    // If the item is "You" and user hasJoined, highlight with green background
    const isYou = item.id === "7" && hasJoined;
    return (
      <View style={[styles.memberItem, isYou && styles.selectedMember]}>
        <Image source={item.avatar} style={styles.avatar} />
        <Text style={styles.memberName}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("/home/mors/saheli-app/assets/images/icon-back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kitty Connect</Text>
      </View>

      {/* Kitty Pool Details */}
      <View style={styles.poolCard}>
        <Image
          source={require("/home/mors/saheli-app/assets/images/image-1.png")}
          style={styles.kittyImage}
        />
        <View style={styles.poolInfo}>
          <Text style={styles.poolTitle}>{translatedData.poolName}</Text>
          <Text style={styles.poolDetail}>• Per Month Investment {translatedData.monthlyAmount}</Text>
          <Text style={styles.poolDetail}>• Total Pool – {translatedData.totalPool}</Text>
          <Text style={styles.poolDetail}>• This Month Special Guest {translatedData.specialGuest}</Text>
          <Text style={styles.poolDetail}>• Current Kitty – Gita Mishra</Text>
        </View>

        {/* Join/Joined Button */}
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => setHasJoined(true)} // Mark user as joined
        >
          <Text style={styles.joinButtonText}>
            {hasJoined ? "Joined" : "Join"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Member List */}
      <FlatList
        data={displayedMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// 🎨 **STYLES**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2E8F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  poolCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  kittyImage: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  poolInfo: {
    flex: 1,
  },
  poolTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  poolDetail: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
  },
  selectedMember: {
    backgroundColor: "#22C55E", // Green highlight for "You"
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
