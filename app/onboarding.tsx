import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    image: require("/home/mors/saheli-app/assets/images/onboarding-image-1.png"),
    title: "Empower Your Financial Journey",
    text: "Take control of your finances whether online or offline.",
  },
  {
    id: 2,
    image: require("/home/mors/saheli-app/assets/images/onboarding-image-2.png"),
    title: "Accessible Tools for Everyone",
    text: "Join savings groups, access mentorship, and collaborate with others. Gain financial knowledge through interactive lessons.",
  },
  {
    id: 3,
    image: require("/home/mors/saheli-app/assets/images/onboarding-image-3.png"),
    title: "Learn, Save, and Grow Together",
    text: "Empowering women through financial literacy, personalized budgeting, and community support for a brighter future.",
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const handleSwipe = (event) => {
    const { translationX, state } = event.nativeEvent;

    if (state === State.END) {
      if (translationX < -50 && index < slides.length - 1) {
        setIndex((prevIndex) => Math.min(prevIndex + 1, slides.length - 1));
      } else if (translationX > 50 && index > 0) {
        setIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onHandlerStateChange={handleSwipe}>
        <View style={styles.container}>
          {slides[index] && (
            <>
              {/* Image Section */}
              <Image source={slides[index].image} style={styles.image} />

              {/* Title & Text */}
              <Text style={styles.title}>{slides[index].title}</Text>
              <Text style={styles.text}>{slides[index].text}</Text>

              {/* Pagination Dots */}
              <View style={styles.dotsContainer}>
                {slides.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setIndex(i)}
                    style={[styles.dot, index === i && styles.activeDot]}
                  />
                ))}
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {/* Skip → Goes to LoginScreen */}
                <TouchableOpacity onPress={() => router.push("/LoginScreen")} style={styles.skipButton}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                {/* Next → If last slide, go to LoginScreen; else next slide */}
                <TouchableOpacity
                  onPress={() =>
                    index < slides.length - 1
                      ? setIndex((prevIndex) => Math.min(prevIndex + 1, slides.length - 1))
                      : router.push("/LoginScreen")
                  }
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: "90%",
    height: "50%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "SpaceMono",
  },
  text: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: "#ccc",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FF3B5C",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  skipText: {
    fontSize: 16,
    color: "#FF3B5C",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#FF3B5C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  nextButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
