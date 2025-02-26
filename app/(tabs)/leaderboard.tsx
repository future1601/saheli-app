import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const weeklyData = [
  { rank: 1, name: "Ramesh Kumar", points: 43, avatar: require("/home/mors/saheli-app/assets/images/avatar-ramesh.png") },
  { rank: 2, name: "Mamta Singh", points: 43, avatar: require("/home/mors/saheli-app/assets/images/avatar-mamta.png") },
  { rank: 3, name: "Rini Raj", points: 43, avatar: require("/home/mors/saheli-app/assets/images/avatar-rini.png") },
  { rank: 4, name: "Rani Pandey", points: 36, avatar: require("/home/mors/saheli-app/assets/images/avatar-rani.png") },
  { rank: 5, name: "Sushmita Singh", points: 35, avatar: require("/home/mors/saheli-app/assets/images/avatar-sushmita.png") },
  { rank: 6, name: "You", points: 34, avatar: require("/home/mors/saheli-app/assets/images/avatar-you.png") },
  { rank: 7, name: "Tamara Raj", points: 33, avatar: require("/home/mors/saheli-app/assets/images/avatar-tamara.png") },
  { rank: 8, name: "Sita Thakur", points: 32, avatar: require("/home/mors/saheli-app/assets/images/avatar-sita.png") },
  { rank: 9, name: "Garishi Singh", points: 31, avatar: require("/home/mors/saheli-app/assets/images/avatar-garishi.png") },
  { rank: 10, name: "Mahi Raj", points: 30, avatar: require("/home/mors/saheli-app/assets/images/avatar-mahi.png") },
];

const monthlyData = [
  { rank: 1, name: "Ramesh Kumar", points: 150, avatar: require("/home/mors/saheli-app/assets/images/avatar-ramesh.png") },
  { rank: 2, name: "Mamta Singh", points: 148, avatar: require("/home/mors/saheli-app/assets/images/avatar-mamta.png") },
  { rank: 3, name: "Rini Raj", points: 145, avatar: require("/home/mors/saheli-app/assets/images/avatar-rini.png") },
  { rank: 4, name: "Rani Pandey", points: 136, avatar: require("/home/mors/saheli-app/assets/images/avatar-rani.png") },
  { rank: 5, name: "Sushmita Singh", points: 131, avatar: require("/home/mors/saheli-app/assets/images/avatar-sushmita.png") },
  { rank: 6, name: "You", points: 129, avatar: require("/home/mors/saheli-app/assets/images/avatar-you.png") },
  { rank: 7, name: "Tamara Raj", points: 125, avatar: require("/home/mors/saheli-app/assets/images/avatar-tamara.png") },
  { rank: 8, name: "Sita Thakur", points: 124, avatar: require("/home/mors/saheli-app/assets/images/avatar-sita.png") },
  { rank: 9, name: "Garishi Singh", points: 120, avatar: require("/home/mors/saheli-app/assets/images/avatar-garishi.png") },
  { rank: 10, name: "Mahi Raj", points: 115, avatar: require("/home/mors/saheli-app/assets/images/avatar-mahi.png") },
];

export default function Leaderboard() {
  const router = useRouter();

  // "weekly" or "monthly"
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");

  const data = tab === "weekly" ? weeklyData : monthlyData;

  const renderHeaderTop3 = () => {
    // top 3 from the data array
    const topThree = data.slice(0, 3);
    return (
      <View style={styles.topThreeRow}>
        {topThree.map((item, index) => {
          // different styling for 1st place
          const isFirst = item.rank === 1;
          const crown = isFirst ? require("/home/mors/saheli-app/assets/images/icon-crown.png") : null;
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
    // skip top 3
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
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Leaderboard</Text>
        <View style={styles.pointsBubble}>
          <Image
            source={require("/home/mors/saheli-app/assets/images/icon-points-star.png")}
            style={styles.starIcon}
          />
          <Text style={styles.pointsText}>34</Text>
        </View>
      </View>

      {/* Tab Switch */}
      <View style={styles.tabRow}>
        {/* Weekly Tab */}
        <TouchableOpacity
          style={[styles.tabButton, tab === "weekly" && styles.tabButtonActive]}
          onPress={() => setTab("weekly")}
        >
          <Text style={[styles.tabText, tab === "weekly" && styles.tabTextActive]}>Weekly</Text>
        </TouchableOpacity>
        {/* Monthly Tab */}
        <TouchableOpacity
          style={[styles.tabButton, tab === "monthly" && styles.tabButtonActive]}
          onPress={() => setTab("monthly")}
        >
          <Text style={[styles.tabText, tab === "monthly" && styles.tabTextActive]}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {/* Top 3 Avatars */}
      {renderHeaderTop3()}

      {/* Ranking List */}
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
  topBar: {
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pointsBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CBD5E1",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  starIcon: {
    width: 36,
    height: 24,
    marginRight: -15,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Tab row
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  tabButtonActive: {
    backgroundColor: "#FFF",
    borderBottomWidth: 3,
    borderBottomColor: "#FF3B5C",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  tabTextActive: {
    color: "#FF3B5C",
    fontWeight: "bold",
  },

  // Top 3
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

  // List items (4th place onward)
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

