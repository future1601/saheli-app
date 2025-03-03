import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import translateText from '../../translateText.js';

const { width } = Dimensions.get("window");

// Example kitty pools
const kittyPools = [
  {
    id: "1",
    title: "Kitty Pool A",
    monthlyInvestment: 1000,
    image: require("../../../assets/images/image-1.png")
  },
  {
    id: "2",
    title: "Kitty Pool B",
    monthlyInvestment: 2000,
    image: require("../../../assets/images/image-2.png"),
  },
  {
    id: "3",
    title: "Kitty Pool C",
    monthlyInvestment: 5000,
    image: require("../../../assets/images/image-3.png"),
  },
  {
    id: "4",
    title: "Kitty Pool D",
    monthlyInvestment: 7000,
    image: require("../../../assets/images/image-4.png"), // placeholder
  },
];

// Example "hotspots" or job areas (just sample coordinates)
const hotspots = [
  {
    id: "h1",
    title: "Hotspot 1",
    description: "Potential job zone or kitty zone",
    coords: { latitude: 28.32504, longitude: 77.21100 },
  },
  {
    id: "h2",
    title: "Hotspot 2",
    description: "Another zone",
    coords: { latitude: 28.55555006, longitude: 77.347094 },
  },
  // New hotspots at the exact locations provided
  {
    id: "h3",
    title: "Savings Group A",
    description: "Monthly savings group with 10 members",
    coords: { latitude: 28.695214, longitude: 77.182072 },
  },
  {
    id: "h4",
    title: "Women's Finance Circle",
    description: "Financial literacy and savings group",
    coords: { latitude: 28.6843405, longitude: 77.2113883 },
  },
  // Additional hotspots
  {
    id: "h5",
    title: "Community Savings Club",
    description: "Local community-based savings group",
    coords: { latitude: 28.675651, longitude: 77.206950 },
  },
  {
    id: "h6",
    title: "Entrepreneur Kitty",
    description: "Savings group for small business owners",
    coords: { latitude: 28.669052, longitude: 77.197082 },
  }
];

export default function KittyConnect() {
  const router = useRouter();
  const { i18n } = useTranslation();

  // For user's location
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 28.6139, // default: New Delhi coords
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required to show nearby kitty pools.");
          setLoadingLocation(false);
          return;
        }
        // Get current position
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error("Location error:", error);
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const renderKittyPool = ({ item }) => (
    <View style={styles.kittyCard}>
      <Image source={item.image} style={styles.kittyImage} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.kittyTitle}>{item.title}</Text>
        <Text style={styles.kittySubtitle}>
          Per Month Investment - {item.monthlyInvestment}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => router.push(`/kitty-connect/KittyPoolDetail?poolName=${item.title}`)}
      >
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kitty Connect</Text>
        <View style={{ width: 30 }} /> {/* placeholder for spacing */}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Map Section */}
        <Text style={styles.sectionTitle}>Nearby Kitty&apos;s</Text>

        {/* If location is still loading, show a fallback */}
        {loadingLocation ? (
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: "#aaa" }}>Fetching location...</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={(rgn) => setRegion(rgn)}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here"
              />
            )}

            {/* Example hotspots */}
            {hotspots.map((spot) => (
              <Marker
                key={spot.id}
                coordinate={spot.coords}
                title={spot.title}
                description={spot.description}
                pinColor="red"
              />
            ))}

            {/* Example circle around user location */}
            {location && (
              <Circle
                center={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                radius={1000} // in meters
                strokeColor="#FF3B5C"
                fillColor="rgba(255, 59, 92, 0.2)"
              />
            )}
          </MapView>
        )}

        {/* List of Kitty Pools */}
        <FlatList
          data={kittyPools}
          keyExtractor={(item) => item.id}
          renderItem={renderKittyPool}
          scrollEnabled={false} // Because we're inside ScrollView
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backText: {
    fontSize: 18,
    color: "#444",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 16,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  mapPlaceholder: {
    width: width - 32,
    height: 200,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    borderRadius: 8,
  },
  map: {
    width: width - 32,
    height: 200,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
  },
  kittyCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  kittyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: "contain",
  },
  kittyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  kittySubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  joinButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
    backgroundColor: "#FF3B5C",
  },
  joinButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

