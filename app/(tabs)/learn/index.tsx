import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";

// Sample data for the leaderboard preview
const topUsers = [
  { rank: 1, name: "Ramesh Kumar", points: 43, avatar: require("../../../assets/images/avatar-ramesh.png") },
  { rank: 2, name: "Mamta Singh", points: 43, avatar: require("../../../assets/images/avatar-mamta.png") },
  { rank: 3, name: "Rini Raj", points: 43, avatar: require("../../../assets/images/avatar-rini.png") },
];

const chapters = [
  { id: "1", title: "Introduction to Compounding" },
  { id: "2", title: "Managing Agricultural Income and Expenses" },
  { id: "3", title: "Creating a Simple and Practical Budget" },
  { id: "4", title: "Investing in Land" },
  { id: "5", title: "Investing in Stocks" },
  { id: "6", title: "Financial Security in Retirement Planning" },
];

export default function LearnScreen() {
  const router = useRouter();

  const renderChapter = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chapterCard}
        onPress={() => router.push("/(tabs)/learn/ChapterDetail?chapterId=" + item.id)}
      >
        <Text style={styles.chapterTitle}>{`Chapter ${item.id}`}</Text>
        <Text style={styles.chapterSubtitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Education</Text>
      </View>
      
      {/* Chapters List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Chapters</Text>
        <FlatList
          data={chapters}
          renderItem={renderChapter}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
      
      {/* Leaderboard Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Savings Leaderboard</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/learn/leaderboard")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.leaderboardCard}
          onPress={() => router.push("/(tabs)/learn/leaderboard")}
        >
          <View style={styles.leaderboardContent}>
            <Text style={styles.leaderboardTitle}>Savings Leaderboard</Text>
            <Text style={styles.leaderboardDescription}>See how you compare to other savers</Text>
          </View>
          <Text style={styles.leaderboardArrow}>›</Text>
        </TouchableOpacity>
        
        <View style={styles.topUsersPreview}>
          {topUsers.map((user, index) => (
            <View key={index} style={styles.topUserPreviewItem}>
              <Image source={user.avatar} style={styles.topUserPreviewAvatar} />
              <Text style={styles.topUserPreviewName}>{user.name}</Text>
              <Text style={styles.topUserPreviewPoints}>{user.points} pts</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Daily Financial Tip */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Financial Tip</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            Pay yourself first! Set up automatic transfers to your savings account on payday.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  viewAllText: {
    color: "#FF3B5C",
    fontWeight: "bold",
  },
  chapterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3B5C",
    marginBottom: 4,
  },
  chapterSubtitle: {
    fontSize: 14,
    color: "#333",
  },
  leaderboardCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  leaderboardContent: {
    flex: 1,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  leaderboardDescription: {
    fontSize: 14,
    color: '#666',
  },
  leaderboardArrow: {
    fontSize: 24,
    color: '#ccc',
    alignSelf: 'flex-end',
  },
  topUsersPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topUserPreviewItem: {
    alignItems: 'center',
    width: '30%',
  },
  topUserPreviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  topUserPreviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  topUserPreviewPoints: {
    fontSize: 12,
    color: '#666',
  },
  tipCard: {
    backgroundColor: '#FFF0F3',
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 24,
  },
});
