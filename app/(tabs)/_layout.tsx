// app/(tabs)/_layout.tsx
import React, { useState } from "react";
import { Slot, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const [active, setActive] = useState("home");

  const handleNav = (dest: string) => {
    setActive(dest);
    router.push(`/(tabs)/${dest}`);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Nested screens are rendered here */}
      <Slot />

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity style={styles.navItem} onPress={() => handleNav("home")}>
          <Image source={require("../../assets/images/icon-home.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        {/* Kitty Connect */}
        <TouchableOpacity style={styles.navItem} onPress={() => handleNav("kitty-connect")}>
          <Image source={require("../../assets/images/icon-kitty.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Kitty</Text>
        </TouchableOpacity>

        {/* Budget AI */}
        <TouchableOpacity style={styles.navItem} onPress={() => handleNav("budget-ai")}>
          <Image source={require("../../assets/images/icon-budget.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Budget.AI</Text>
        </TouchableOpacity>

        {/* Learn */}
        <TouchableOpacity style={styles.navItem} onPress={() => handleNav("learn")}>
          <Image source={require("../../assets/images/icon-learn.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>

        {/* Leaderboard */}
        <TouchableOpacity style={styles.navItem} onPress={() => handleNav("leaderboard")}>
          <Image source={require("../../assets/images/icon-leaderboard.png")} style={styles.navIcon} />
          <Text style={styles.navText}>Rank</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#999",
  },
  navText: {
    fontSize: 10,
    color: "#999",
  },
});
