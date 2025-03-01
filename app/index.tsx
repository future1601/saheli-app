import { View, Text, Image, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

export default function SplashScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  return (
    <TouchableWithoutFeedback onPress={() => router.push("/language-selection")}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/splash-image.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Saheli</Text>
        <Text style={styles.subtitle}>Empower Your Financial Journey</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "SpaceMono", // Ensure the font is applied
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    fontFamily: "SpaceMono", // Ensure the font is applied
    marginTop: 5,
    textAlign: "center",
  },
});
