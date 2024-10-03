import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config';
import * as Location from 'expo-location'; // Import expo-location

function DriverMap() {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [pins, setPins] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null); // State for current location
  const openRouteServiceApiKey = '5b3ce3597851110001cf6248af33e9cb607c4f9c9bd4a25d8d2cb230'; // Replace with your API key

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const pinsCollection = collection(DB, 'registeredPins');
        const pinsSnapshot = await getDocs(pinsCollection);
        const pinsData = pinsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPins(pinsData);

        if (pinsData.length >= 2) {
          let combinedRoutes = [];
          for (let i = 0; i < pinsData.length - 1; i++) {
            const route = await fetchRouteData(pinsData[i], pinsData[i + 1]);
            combinedRoutes = [...combinedRoutes, ...route];
          }
          setRouteCoordinates(combinedRoutes);
        }
      } catch (error) {
        console.error('Error fetching pins:', error);
        Alert.alert('Error', 'Failed to fetch pins. Please try again later.');
      }
    };

    fetchPins();
  }, []);

  // Fetch route data from OpenRouteService
  const fetchRouteData = async (start, end) => {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${openRouteServiceApiKey}&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.features[0].geometry.coordinates;
      const routeCoords = coordinates.map(([longitude, latitude]) => ({ latitude, longitude }));
      return routeCoords;
    } catch (error) {
      console.error('Error fetching route data:', error);
      Alert.alert('Error', 'Failed to fetch route data. Please try again later.');
      return [];
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        // Request permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
          return;
        }

        // Get the current location
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      } catch (error) {
        console.error('Error getting current location:', error);
        Alert.alert('Error', 'Unable to get current location. Please try again later.');
      }
    };

    getCurrentLocation();

    // Update location every 5 seconds
    const locationInterval = setInterval(getCurrentLocation, 5000);
    return () => clearInterval(locationInterval); // Clear the interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.880000,
          longitude: 79.923000,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Render markers for specified pins */}
        {pins.length > 0 && pins.map(pin => (
          pin.latitude && pin.longitude ? (
            <Marker
              key={pin.id}
              coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
              title={pin.title}
              description={pin.description}
            />
          ) : null
        ))}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#000"
            strokeWidth={6}
          />
        )}

        {/* Render current location marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="You Are Here"
            pinColor="blue" // Change color to distinguish from other markers
          >
            <View style={styles.arrowContainer}>
              <View style={styles.arrow} />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  arrowContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'blue',
    transform: [{ rotate: '180deg' }], // Point the arrow upwards
  },
});

export default DriverMap;
