import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const chapters = [
    { id: "1", title: "Introduction to Compounding" },
    { id: "2", title: "Managing Agricultural Income and Expenses" },
    { id: "3", title: "Creating a Simple and Practical Budget" },
    { id: "4", title: "Investing in Land" },
    { id: "5", title: "Investing in Stocks" },
    { id: "6", title: "Financial Security in Retirement Planning" },
  ];
  

export default function LearnIndex() {
  const router = useRouter();

  const renderChapter = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chapterCard}
        onPress={() => router.push("/(tabs)/learn/ChapterDetail?chapterId=" + item.id)

        }
      >
        <Text style={styles.chapterTitle}>{`Chapter ${item.id}`}</Text>
        <Text style={styles.chapterSubtitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Learn & Earn</Text>
        <View style={styles.pointsBubble}>
          <Image
            source={require("../../../assets/images/icon-points-star.png")}
            style={styles.starIcon}
          />
          <Text style={styles.pointsText}>34</Text>
        </View>
      </View>

      {/* Chapters List */}
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={renderChapter}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F8F8F8",
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
    marginRight:-15,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  chapterCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  chapterSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
