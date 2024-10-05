import React, { useState, useEffect,useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, useWindowDimensions,ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../../config/DB_config';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';

function DriverMap() {
  // Define a hard-coded start point
  const hardCodedStartPin = {
    id: 'startPin',
    latitude: 6.880000, // Replace with your desired latitude
    longitude: 79.923000, // Replace with your desired longitude
  };
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [pins, setPins] = useState([hardCodedStartPin]); // Start with the hard-coded pin
  const [currentLocation, setCurrentLocation] = useState(hardCodedStartPin); // Start at hard-coded pin
  const [currentPinIndex, setCurrentPinIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const openRouteServiceApiKey = '5b3ce3597851110001cf6248af33e9cb607c4f9c9bd4a25d8d2cb230';

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const pinsCollection = collection(DB, 'registeredPins');
        const pinsSnapshot = await getDocs(pinsCollection);
        const pinsData = pinsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPins(prevPins => [...prevPins, ...pinsData]); // Add fetched pins to the existing array

        if (pinsData.length >= 1) {
          let combinedRoutes = [];
          // Fetch route data including the hard-coded start pin
          for (let i = 0; i < pinsData.length; i++) {
            const startPin = i === 0 ? hardCodedStartPin : pinsData[i - 1]; // Use hard-coded start pin for the first route
            const endPin = pinsData[i];
            const route = await fetchRouteData(startPin, endPin);
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
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      } catch (error) {
        console.error('Error getting current location:', error);
        Alert.alert('Error', 'Unable to get current location. Please try again later.');
      }
    };

    getCurrentLocation();

    const locationInterval = setInterval(getCurrentLocation, 5000);
    return () => clearInterval(locationInterval);
  }, []);

  const moveMarkerToNextPin = async () => {
    if (currentPinIndex < pins.length - 1) {
      console.log(`Moving marker from pin ${currentPinIndex + 1} to pin ${currentPinIndex + 2}`);
      const nextPinIndex = currentPinIndex + 1; // Get the next pin index

    
      const route = await fetchRouteData(pins[currentPinIndex], pins[nextPinIndex]); // Fetch the route coordinates
      if (route.length > 0) {
        moveMarkerAlongRoute(route, nextPinIndex); // Move the marker along the route
      } else {
        Alert.alert('Error', 'No route data available.');
      }
    } else {
      Alert.alert('No more pins', 'You have reached the last pin.');
    }
  };

  const moveMarkerAlongRoute = (route, nextPinIndex) => {
    let currentStep = 0; // Step index

    const moveMarker = () => {
      if (currentStep < route.length) {
        const markerPosition = route[currentStep]; // Get the current position on the route
        setCurrentLocation({ ...markerPosition }); // Update the state with the new position
        currentStep++;
        setTimeout(moveMarker, 16); // Move every 16 ms (~60 FPS)
      } else {
        // Stop at the destination pin
        console.log("Marker reached its destination:", route[route.length - 1]);
        setCurrentPinIndex(nextPinIndex); // Update the current pin index to the next pin
      }
    };

    moveMarker(); // Start moving the marker
  };

  const move = () => {
    moveMarkerToNextPin(); // Move to the next pin
  };

  const getCurrentLocation = async () => {
    setLoading(true); // Start loading spinner
  
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log('Current location:', { latitude, longitude }); // Log the coordinates
      setStartPoint({ latitude, longitude });
  
      // Check if mapRef.current is available before calling animateToRegion
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      } else {
        console.error('Map ref is null');
      }
    } catch (error) {
      console.error('Error getting current location:', error); // Log the error
      Alert.alert('Error', 'Unable to get current location. Please try again later.');
    } finally {
      setLoading(false); // Stop loading spinner after location is fetched
    }
  };
  

  return (
    <View style={styles.container}>
      <MapView
      ref={mapRef} 
        style={styles.map}
        initialRegion={{
          latitude: hardCodedStartPin.latitude,
          longitude: hardCodedStartPin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {pins.length >= 0 && pins.map((pin, index) => (
          pin.latitude && pin.longitude ? (
            <Marker
              key={`${pin.id}_${index}`} // Make sure the key is unique
              coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
              title={pin.title}
              description={pin.description}
              pinColor={pin.id === 'startPin' ? 'green' : 'red'}
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

      <View style={styles.buttonContainerCurrentLocator}>
        <TouchableOpacity style={styles.iconContainer}  onPress={getCurrentLocation}>
        {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Icon name="locate-outline" style={styles.icon} size={30} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={move}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log('Stop Marker pressed')} // Add your stop logic here
        >
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>
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
    transform: [{ rotate: '180deg' }],
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons side by side
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -100 }], // Center the button container
  },
  button: {
    width: 100, // Set width for buttons
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00CE5E',
    borderRadius: 15,
    marginHorizontal: 5, // Add some space between buttons
  },
  buttonText: {
    color: '#fff', // Button text color
    fontWeight: 'bold',
  },
  buttonContainerCurrentLocator: {
    position: 'absolute',
    bottom: 100, // Distance from the bottom
    left: 293, // Distance from the left
    right: 20, // Distance from the right
    backgroundColor: 'transparent', // Ensure the background is transparent
    padding: 10, // Padding for better touch area
  },
  iconContainer: {
    shadowColor: '#000', // Black shadow color
    shadowOffset: { width: 5, height: 5 }, // Offset for shadow to create depth
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 6, // Blurriness of the shadow
    elevation: 8, // Android shadow equivalent
    backgroundColor: '#f2f2f2', // Light background for icon container
    borderRadius: 25, // Rounded background to match the icon's shape
    padding: 10, // Padding to add space around the icon
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)', // Shadow behind the icon text itself
    textShadowOffset: { width: 2, height: 2 }, // Text shadow offset for depth
    textShadowRadius: 3, // Text shadow blur radius
  },
});

export default DriverMap;

