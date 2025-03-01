// app/(tabs)/_layout.tsx
import React, { useState } from "react";
import { Slot, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const router = useRouter();
  const { t } = useTranslation();
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
        <TouchableOpacity 
          style={[styles.navItem, active === "home" ? styles.activeNavItem : null]} 
          onPress={() => handleNav("home")}
        >
          <Image 
            source={require("../../assets/images/icon-home.png")} 
            style={[styles.navIcon, active === "home" ? styles.activeNavIcon : null]} 
          />
          <Text style={[styles.navText, active === "home" ? styles.activeNavText : null]}>
            {t('tabs.home')}
          </Text>
        </TouchableOpacity>

        {/* Kitty Connect */}
        <TouchableOpacity 
          style={[styles.navItem, active === "kitty-connect" ? styles.activeNavItem : null]} 
          onPress={() => handleNav("kitty-connect")}
        >
          <Image 
            source={require("../../assets/images/icon-kitty.png")} 
            style={[styles.navIcon, active === "kitty-connect" ? styles.activeNavIcon : null]} 
          />
          <Text style={[styles.navText, active === "kitty-connect" ? styles.activeNavText : null]}>
            {t('tabs.kitty')}
          </Text>
        </TouchableOpacity>

        {/* Budget AI */}
        <TouchableOpacity 
          style={[styles.navItem, active === "budget-ai" ? styles.activeNavItem : null]} 
          onPress={() => handleNav("budget-ai")}
        >
          <Image 
            source={require("../../assets/images/icon-budget.png")} 
            style={[styles.navIcon, active === "budget-ai" ? styles.activeNavIcon : null]} 
          />
          <Text style={[styles.navText, active === "budget-ai" ? styles.activeNavText : null]}>
            {t('tabs.budget')}
          </Text>
        </TouchableOpacity>

        {/* Learn */}
        <TouchableOpacity 
          style={[styles.navItem, active === "learn" ? styles.activeNavItem : null]} 
          onPress={() => handleNav("learn")}
        >
          <Image 
            source={require("../../assets/images/icon-learn.png")} 
            style={[styles.navIcon, active === "learn" ? styles.activeNavIcon : null]} 
          />
          <Text style={[styles.navText, active === "learn" ? styles.activeNavText : null]}>
            {t('tabs.learn')}
          </Text>
        </TouchableOpacity>

        {/* Leaderboard */}
        <TouchableOpacity 
          style={[styles.navItem, active === "leaderboard" ? styles.activeNavItem : null]} 
          onPress={() => handleNav("leaderboard")}
        >
          <Image 
            source={require("../../assets/images/icon-leaderboard.png")} 
            style={[styles.navIcon, active === "leaderboard" ? styles.activeNavIcon : null]} 
          />
          <Text style={[styles.navText, active === "leaderboard" ? styles.activeNavText : null]}>
            {t('tabs.rank')}
          </Text>
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
  activeNavItem: {
    // You can add specific styles for the active tab item if needed
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#999",
  },
  activeNavIcon: {
    tintColor: "#FF3B5C",
  },
  navText: {
    fontSize: 10,
    color: "#999",
  },
  activeNavText: {
    color: "#FF3B5C",
    fontWeight: "bold",
  },
});
