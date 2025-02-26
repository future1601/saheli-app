import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Updated feed data with more text to match the Figma design
const posts = [
  {
    id: "1",
    userPic: require("/home/mors/saheli-app/assets/images/profile-rani.png"),
    userName: "Rani Pandey",
    userTitle: "A Saheli User",
    content: "Hi everyone! I'm planning to start my own tailoring business and could really use some guidance. If you have any tips, resources, or advice, please share—I’d truly appreciate your help! 💫",
  },
  {
    id: "2",
    userPic: require("/home/mors/saheli-app/assets/images/icon-blank.png"), // Placeholder for "SkillBoost"
    userName: "SkillBoost Employment Scheme",
    userTitle: "",
    content: "Get government–funded training & job placement support!\nCheck your eligibility & apply now!",
  },
  {
    id: "3",
    userPic: require("/home/mors/saheli-app/assets/images/profile-sarita.png"),
    userName: "Sarita Singh",
    userTitle: "Financial Advisor",
    content: "Excited about learning the secrets of smart money management? 💡 Join us for an Exclusive Offline Finance Workshop. Whether you're a student, a professional, or just someone eager to take control of your financial future, this workshop will help you understand the essentials of budgeting, investing, and planning your finances effectively.\n[Venue]\n[Date]\n[Time]",
  },
];

export default function Home() {
  const router = useRouter();

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postCard}>
        {/* User Info */}
        <View style={styles.userRow}>
          <Image source={item.userPic} style={styles.userPic} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.userName}>{item.userName}</Text>
            {item.userTitle ? <Text style={styles.userTitle}>{item.userTitle}</Text> : null}
          </View>
          {/* Follow button */}
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text style={styles.contentText}>{item.content}</Text>

        {/* Action Row (Icons) */}
        <View style={styles.actionRow}>
          {/* Bookmark */}
          <TouchableOpacity>
            <Image source={require("/home/mors/saheli-app/assets/images/icon-bookmark.png")} style={styles.iconAction} />
          </TouchableOpacity>

          {/* Like, Comment, Share */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity>
              <Image source={require("/home/mors/saheli-app/assets/images/icon-like.png")} style={[styles.iconAction, { marginLeft: 15 }]} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("/home/mors/saheli-app/assets/images/icon-comment.png")} style={[styles.iconAction, { marginLeft: 15 }]} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("/home/mors/saheli-app/assets/images/icon-share.png")} style={[styles.iconAction, { marginLeft: 15 }]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left: Profile Pic */}
        <TouchableOpacity>
          <Image source={require("/home/mors/saheli-app/assets/images/profile-sarita.png")} style={styles.profilePicTop} />
        </TouchableOpacity>

        {/* Center: Title */}
        <Text style={styles.topBarTitle}>Home</Text>

        {/* Right: Points Star */}
        <View style={styles.starBubble}>
          <Image source={require("/home/mors/saheli-app/assets/images/icon-points-star.png")} style={styles.starIcon} />
          <Text style={styles.starText}>34</Text>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {/* REMOVE the in-file Bottom Nav from here */}
    </View>
  );
}

// 🔥 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE7EE", // Pinkish background
  },

  // Top Bar
  topBar: {
    backgroundColor: "#FDE7EE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  profilePicTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  starBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CBD5E1", // Light bluish bubble
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  starIcon: {
    width: 36,
    height: 24,
    marginRight: -15,
  },
  starText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Post Cards
  postCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  userTitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  followButton: {
    borderWidth: 1,
    borderColor: "#FF3B5C",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  followButtonText: {
    fontSize: 12,
    color: "#FF3B5C",
    fontWeight: "bold",
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconAction: {
    width: 18,
    height: 18,
  },
});
