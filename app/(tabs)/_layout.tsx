// app/(tabs)/_layout.tsx
import React, { useState } from "react";
import { Slot, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';
import { BudgetProvider } from '../../context/BudgetContext';

export default function TabsLayout() {
  const router = useRouter();
  const { t } = useTranslation();
  const [active, setActive] = useState("home");

  const handleNav = (dest: string) => {
    setActive(dest);
    router.push(`/(tabs)/${dest}`);
  };

  return (
    <BudgetProvider>
      <View style={{ flex: 1 }}>
        {/* Nested screens are rendered here */}
        <Slot />

        {/* Bottom nav */}
        <View style={styles.bottomNav}>
          {/* Home */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleNav("home")}
          >
            <Image 
              source={require("../../assets/images/icon-home.png")} 
              style={[styles.navIcon, {tintColor: active === "home" ? "#FF3B5C" : "#999"}]} 
            />
            <Text style={[styles.navText, active === "home" ? styles.activeNavText : null]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* Kitty */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleNav("kitty-connect")}
          >
            <Image 
              source={require("../../assets/images/icon-kitty.png")} 
              style={[styles.navIcon, {tintColor: active === "kitty-connect" ? "#FF3B5C" : "#999"}]} 
            />
            <Text style={[styles.navText, active === "kitty-connect" ? styles.activeNavText : null]}>
              Kitty
            </Text>
          </TouchableOpacity>

          {/* Budget */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleNav("budget-ai")}
          >
            <Image 
              source={require("../../assets/images/icon-budget.png")} 
              style={[styles.navIcon, {tintColor: active === "budget-ai" ? "#FF3B5C" : "#999"}]} 
            />
            <Text style={[styles.navText, active === "budget-ai" ? styles.activeNavText : null]}>
              Budget
            </Text>
          </TouchableOpacity>

          {/* Learn */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleNav("learn")}
          >
            <Image 
              source={require("../../assets/images/icon-learn.png")} 
              style={[styles.navIcon, {tintColor: active === "learn" ? "#FF3B5C" : "#999"}]} 
            />
            <Text style={[styles.navText, active === "learn" ? styles.activeNavText : null]}>
              Learn
            </Text>
          </TouchableOpacity>

          {/* Chatbot */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleNav("chatbot")}
          >
            <Image 
              source={require("../../assets/images/icon-help.png")} 
              style={[styles.navIcon, {tintColor: active === "chatbot" ? "#FF3B5C" : "#999"}]} 
            />
            <Text style={[styles.navText, active === "chatbot" ? styles.activeNavText : null]}>
              Chatbot
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BudgetProvider>
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
  },
  navText: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  activeNavText: {
    color: "#FF3B5C",
    fontWeight: "bold",
  },
});
