import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from "expo-router";
import DynamicText from '@/components/DynamicText';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Use static translation keys instead of dynamic translation
  const slides = [
    {
      id: '1',
      title: t('onboarding.slide1.title', 'Welcome to Saheli'),
      description: t('onboarding.slide1.description', 'Your trusted companion for financial growth'),
      image: require('../assets/images/onboarding-image-1.png')
    },
    {
      id: '2',
      title: t('onboarding.slide2.title', 'Learn & Grow'),
      description: t('onboarding.slide2.description', 'Access educational content and quizzes to improve your financial knowledge'),
      image: require('../assets/images/onboarding-image-2.png')
    },
    {
      id: '3',
      title: t('onboarding.slide3.title', 'Connect & Share'),
      description: t('onboarding.slide3.description', 'Join kitty groups and connect with like-minded women'),
      image: require('../assets/images/onboarding-image-3.png')
    }
  ];

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {item.image && <Image source={item.image} style={styles.image} />}
      <DynamicText style={styles.title}>{item.title}</DynamicText>
      <DynamicText style={styles.description}>{item.description}</DynamicText>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      router.push("/LoginScreen");
    }
  };

  const handleSkip = () => {
    router.push("/LoginScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <DynamicText style={styles.skipButtonText} translationKey="common.skip">Skip</DynamicText>
      </TouchableOpacity>
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <DynamicText 
          style={styles.nextButtonText}
          translationKey={currentIndex === slides.length - 1 ? "onboarding.getStarted" : "onboarding.next"}
        >
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </DynamicText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#FF3B5C",
    fontWeight: "bold",
  },
  slide: {
    width,
    height: height * 0.8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "SpaceMono",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  paginationDot: {
    height: 10,
    width: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 8,
  },
  paginationDotActive: {
    backgroundColor: "#FF3B5C",
    width: 20,
  },
  nextButton: {
    backgroundColor: "#FF3B5C",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 40,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
