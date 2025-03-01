import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, SafeAreaView, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { getAvatarSource } from "@/utils/avatarHelper";
import { useTranslation } from 'react-i18next';

const avatarOptions = [
  { id: '1', source: require("../../assets/images/avatar-1.png") },
  { id: '2', source: require("../../assets/images/avatar-2.png") },
  { id: '3', source: require("../../assets/images/avatar-3.png") },
  { id: '4', source: require("../../assets/images/avatar-4.png") },
  { id: '5', source: require("../../assets/images/avatar-5.png") },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      if (!auth.currentUser) {
        console.log("No authenticated user found");
        router.push("/login");
        return;
      }

      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        Alert.alert("Error", "User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (newAvatar) => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        avatarId: newAvatar.id
      });
      setUserData(prev => ({ ...prev, avatarId: newAvatar.id }));
      setShowAvatarModal(false);
      Alert.alert("Success", "Avatar updated successfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert("Error", "Failed to update avatar");
    }
  };

  const renderAvatarOption = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.avatarOption,
        userData?.avatarId === item.id && styles.selectedAvatarOption
      ]}
      onPress={() => handleAvatarChange(item)}
    >
      <Image source={item.source} style={styles.avatarOptionImage} />
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out!", "You have been successfully logged out.");
      router.push("/login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/icon-back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>{t('profile.title')}</Text>

          <View style={styles.starBubble}>
            <Image
              source={require("../../assets/images/icon-points-star.png")}
              style={styles.starIcon}
            />
            <Text style={styles.starText}>22</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>
          {t('profile.welcome', { name: userData?.firstName })}
        </Text>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => setShowAvatarModal(true)}>
            <Image
              source={userData?.avatarId ? getAvatarSource(userData.avatarId) : require("../../assets/images/default-avatar.png")}
              style={styles.profileImage}
            />
            <View style={styles.editAvatarBadge}>
              <Text style={styles.editAvatarText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>
            {userData ? `${userData.firstName} ${userData.lastName}` : "User"}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Image
                source={require("../../assets/images/icon-user.png")}
                style={styles.menuIcon}
              />
            </View>
            <Text style={styles.menuText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Image
                source={require("../../assets/images/icon-security.png")}
                style={styles.menuIcon}
              />
            </View>
            <Text style={styles.menuText}>{t('profile.security')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Image
                source={require("../../assets/images/icon-settings.png")}
                style={styles.menuIcon}
              />
            </View>
            <Text style={styles.menuText}>{t('profile.settings')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Image
                source={require("../../assets/images/icon-help.png")}
                style={styles.menuIcon}
              />
            </View>
            <Text style={styles.menuText}>{t('profile.help')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuIconContainer}>
              <Image
                source={require("../../assets/images/icon-logout.png")}
                style={styles.menuIcon}
              />
            </View>
            <Text style={styles.menuText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.chooseAvatar')}</Text>
            <FlatList
              data={avatarOptions}
              renderItem={renderAvatarOption}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.avatarList}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.closeButtonText}>{t('profile.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 🔥 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE7EE",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#FF3B5C",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
    fontFamily: "SpaceMono-Regular",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F1F1F",
    textAlign: "center",
    marginVertical: 16,
    fontFamily: "SpaceMono-Regular",
  },
  starBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CBD5E1",
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
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF3B5C",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F1F1F",
    fontFamily: "SpaceMono-Regular",
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 100, // Add padding at bottom for scrolling
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  menuIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFB6C1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuIcon: {
    width: 26,
    height: 26,
    tintColor: "#FF3B5C",
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 16,
    color: "#1F1F1F",
    fontWeight: "500",
    marginLeft: 4,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF3B5C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editAvatarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarList: {
    paddingVertical: 16,
  },
  avatarOption: {
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
    borderColor: '#FF3B5C',
  },
  avatarOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeButton: {
    backgroundColor: '#FF3B5C',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
