import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { getAvatarSource } from "../../utils/avatarHelper";
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get("window");

// Updated feed data with more text to match the Figma design
const postsData = [
  {
    id: "1",
    userPic: require("../../assets/images/profile-rani.png"),
    userName: "Rani Pandey",
    userTitle: "A Saheli User",
    content: "Hi everyone! I'm planning to start my own tailoring business and could really use some guidance. If you have any tips, resources, or advice, please share—I'd truly appreciate your help! 💫",
  },
  {
    id: "2",
    userPic: require("../../assets/images/icon-blank.png"), // Placeholder for "SkillBoost"
    userName: "SkillBoost Employment Scheme",
    userTitle: "",
    content: "📊 Get government–funded training & job placement support!\n🔍 Check your eligibility & apply now!",
  },
  {
    id: "3",
    userPic: require("../../assets/images/profile-sarita.png"),
    userName: "Sarita singh",
    userTitle: "Financial Advisor",
    content: "Excited about learning the secrets of smart money management? 💡 Join us for an Exclusive Offline Finance Workshop. Whether you're a student, a professional, or just someone eager to take control of your financial future, this workshop will help you understand the essentials of budgeting, investing, and planning your finances effectively.\n📍 [Venue]\n📅 [Date]\n⏰ [Time]",
  },
];

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.firstName || "User");
          setUserAvatar(userData.avatarId);
        }
      }
    };

    fetchUserData();
  }, []);

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postCard}>
        {/* User Info */}
        <View style={styles.userRow}>
          <Image source={item.userPic} style={styles.userPic} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.postUserName}>{item.userName}</Text>
            {item.userTitle ? <Text style={styles.userTitle}>{item.userTitle}</Text> : null}
          </View>
          
          {/* Follow button - only for users, not for SkillBoost */}
          {item.id !== "2" && (
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
          
          {/* Bookmark */}
          <TouchableOpacity style={{marginLeft: 5}}>
            <Image source={require("../../assets/images/icon-bookmark.png")} style={styles.iconAction} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text style={styles.contentText}>{item.content}</Text>

        {/* Action Row (Icons) */}
        <View style={styles.actionRow}>
          {/* Like, Comment, Share */}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity>
              <Image source={require("../../assets/images/icon-like.png")} style={styles.iconAction} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../../assets/images/icon-comment.png")} style={[styles.iconAction, { marginLeft: 15 }]} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../../assets/images/icon-share.png")} style={[styles.iconAction, { marginLeft: 15 }]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Image
            source={userAvatar ? getAvatarSource(userAvatar) : require("../../assets/images/default-avatar.png")}
            style={styles.profilePicTop}
          />
        </TouchableOpacity>
        
        <Text style={styles.topBarTitle}>Home</Text>

        <View style={styles.starBubble}>
          <Image 
            source={require("../../assets/images/icon-points-star.png")} 
            style={styles.starIcon} 
          />
          <Text style={styles.starText}>22</Text>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={postsData}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Disable scrolling in FlatList since we're using ScrollView
      />
    </ScrollView>
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
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0, // Remove the line
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
    borderRadius: 16, // Increased border radius
    padding: 16, // Increased padding
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postUserName: {
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
    backgroundColor: "#FF3B5C",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  followButtonText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "bold",
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  iconAction: {
    width: 20,
    height: 20,
  },
});
