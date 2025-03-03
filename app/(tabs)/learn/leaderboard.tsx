import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'current_user_id';

export const weeklyData = [
  { rank: 1, name: "Ramesh Kumar", points: 43, avatar: require("../../../assets/images/avatar-ramesh.png") },
  { rank: 2, name: "Mamta Singh", points: 43, avatar: require("../../../assets/images/avatar-mamta.png") },
  { rank: 3, name: "Rini Raj", points: 43, avatar: require("../../../assets/images/avatar-rini.png") },
  { rank: 4, name: "Rani Pandey", points: 36, avatar: require("../../../assets/images/avatar-rani.png") },
  { rank: 5, name: "Sushmita Singh", points: 35, avatar: require("../../../assets/images/avatar-sushmita.png") },
  { rank: 6, name: "You", points: 34, avatar: require("../../../assets/images/avatar-you.png") },
  { rank: 7, name: "Tamara Raj", points: 33, avatar: require("../../../assets/images/avatar-tamara.png") },
  { rank: 8, name: "Sita Thakur", points: 32, avatar: require("../../../assets/images/avatar-sita.png") },
  { rank: 9, name: "Garishi Singh", points: 31, avatar: require("../../../assets/images/avatar-garishi.png") },
  { rank: 10, name: "Mahi Raj", points: 30, avatar: require("../../../assets/images/avatar-mahi.png") },
];

export const monthlyData = [
  { rank: 1, name: "Ramesh Kumar", points: 150, avatar: require("../../../assets/images/avatar-ramesh.png") },
  { rank: 2, name: "Mamta Singh", points: 148, avatar: require("../../../assets/images/avatar-mamta.png") },
  { rank: 3, name: "Rini Raj", points: 145, avatar: require("../../../assets/images/avatar-rini.png") },
  { rank: 4, name: "Rani Pandey", points: 136, avatar: require("../../../assets/images/avatar-rani.png") },
  { rank: 5, name: "Sushmita Singh", points: 131, avatar: require("../../../assets/images/avatar-sushmita.png") },
  { rank: 6, name: "You", points: 129, avatar: require("../../../assets/images/avatar-you.png") },
  { rank: 7, name: "Tamara Raj", points: 125, avatar: require("../../../assets/images/avatar-tamara.png") },
  { rank: 8, name: "Sita Thakur", points: 124, avatar: require("../../../assets/images/avatar-sita.png") },
  { rank: 9, name: "Garishi Singh", points: 120, avatar: require("../../../assets/images/avatar-garishi.png") },
  { rank: 10, name: "Mahi Raj", points: 115, avatar: require("../../../assets/images/avatar-mahi.png") },
];

export const yearlyData = [
  { rank: 1, name: "Ramesh Kumar", points: 1850, avatar: require("../../../assets/images/avatar-ramesh.png") },
  { rank: 2, name: "Mamta Singh", points: 1720, avatar: require("../../../assets/images/avatar-mamta.png") },
  { rank: 3, name: "Rini Raj", points: 1680, avatar: require("../../../assets/images/avatar-rini.png") },
  { rank: 4, name: "Rani Pandey", points: 1540, avatar: require("../../../assets/images/avatar-rani.png") },
  { rank: 5, name: "Sushmita Singh", points: 1490, avatar: require("../../../assets/images/avatar-sushmita.png") },
  { rank: 6, name: "You", points: 1450, avatar: require("../../../assets/images/avatar-you.png") },
  { rank: 7, name: "Tamara Raj", points: 1380, avatar: require("../../../assets/images/avatar-tamara.png") },
  { rank: 8, name: "Sita Thakur", points: 1320, avatar: require("../../../assets/images/avatar-sita.png") },
  { rank: 9, name: "Garishi Singh", points: 1280, avatar: require("../../../assets/images/avatar-garishi.png") },
  { rank: 10, name: "Mahi Raj", points: 1240, avatar: require("../../../assets/images/avatar-mahi.png") },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly" | "yearly">("weekly");
  
  const data = timeFrame === "weekly" 
    ? weeklyData 
    : timeFrame === "monthly" 
      ? monthlyData 
      : yearlyData;
  
  useEffect(() => {
    loadUserId();
  }, []);
  
  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem(USER_ID_KEY);
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error('Error loading user ID:', error);
    }
  };
  
  const renderHeaderTop3 = () => {
    if (!data || data.length === 0) {
      return null;
    }
    
    const topThree = data.slice(0, 3);
    return (
      <View style={styles.topThreeRow}>
        {topThree.map((item, index) => {
          const isFirst = item.rank === 1;
          const crown = isFirst ? require("../../../assets/images/icon-crown.png") : null;
          return (
            <View key={index} style={styles.topThreeContainer}>
              {crown && <Image source={crown} style={styles.crownIcon} />}
              <Image source={item.avatar} style={styles.topThreeAvatar} />
              <Text style={styles.topThreeName}>{item.name}</Text>
              <Text style={styles.topThreePoints}>{item.points} pts</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }: { item: typeof weeklyData[0] }) => {
    if (item.rank <= 3) return null;

    let rowStyle = {};
    let textStyle = {};
    if (item.name === "You") {
      rowStyle = { backgroundColor: "#FDE7EE" };
      textStyle = { color: "#FF3B5C", fontWeight: "bold" };
    }

    return (
      <View style={[styles.listItemRow, rowStyle]}>
        <Text style={[styles.rankText, textStyle]}>{item.rank}</Text>
        <Image source={item.avatar} style={styles.listAvatar} />
        <Text style={[styles.nameText, textStyle]}>{item.name}</Text>
        <Text style={[styles.pointsText, textStyle]}>{item.points} pts</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Savings Leaderboard</Text>
      </View>
      
      <View style={styles.timeFrameSelector}>
        <TouchableOpacity
          style={[styles.timeFrameButton, timeFrame === 'weekly' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('weekly')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'weekly' && styles.activeTimeFrameText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.timeFrameButton, timeFrame === 'monthly' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('monthly')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'monthly' && styles.activeTimeFrameText]}>
            Monthly
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.timeFrameButton, timeFrame === 'yearly' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('yearly')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'yearly' && styles.activeTimeFrameText]}>
            Yearly
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.podiumContainer}>
        {renderHeaderTop3()}
      </View>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#666",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timeFrameSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  activeTimeFrame: {
    backgroundColor: "#FFF",
    borderBottomWidth: 3,
    borderBottomColor: "#FF3B5C",
  },
  timeFrameText: {
    fontSize: 14,
    color: "#666",
  },
  activeTimeFrameText: {
    color: "#FF3B5C",
    fontWeight: "bold",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  podiumItem: {
    alignItems: "center",
    width: 80,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  podiumPillar: {
    backgroundColor: "#CBD5E1",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  podiumRank: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  podiumScore: {
    fontSize: 12,
    color: "#999",
  },
  topThreeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  topThreeContainer: {
    alignItems: "center",
    width: 80,
  },
  topThreeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  crownIcon: {
    width: 20,
    height: 20,
    position: "absolute",
    top: -10,
  },
  topThreeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  topThreePoints: {
    fontSize: 12,
    color: "#999",
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  rankText: {
    width: 30,
    fontSize: 14,
    color: "#444",
  },
  listAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  nameText: {
    flex: 1,
    fontSize: 14,
    color: "#1F1F1F",
  },
  pointsText: {
    fontSize: 14,
    color: "#666",
  },
});