import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config'; // Adjust the import to your Firestore config

function DriverMap() {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [pins, setPins] = useState([]); // State to hold pin data

  const openRouteServiceApiKey = '5b3ce3597851110001cf6248af33e9cb607c4f9c9bd4a25d8d2cb230'; 
  
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const pinsCollection = collection(DB, 'registeredPins'); // Firestore collection
        const pinsSnapshot = await getDocs(pinsCollection);
        const pinsData = pinsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPins(pinsData); // Store the pins in state

        // Ensure pins array has at least 2 elements (for consecutive pairs)
        if (pinsData.length >= 2) {
          let allRouteCoords = [];

          // Loop through the pins and fetch route data for each consecutive pair of pins
          for (let i = 0; i < pinsData.length - 1; i++) {
            const start = pinsData[i];
            const end = pinsData[i + 1];

            const routeCoords = await fetchRouteData(start, end);
            allRouteCoords = [...allRouteCoords, ...routeCoords]; // Combine route coordinates
          }

          setRouteCoordinates(allRouteCoords); // Set combined route coordinates
        }
      } catch (error) {
        console.error('Error fetching pins:', error);
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

      // Convert coordinates from [longitude, latitude] to [latitude, longitude] format
      const routeCoords = coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      }));

      return routeCoords; // Return route coordinates
    } catch (error) {
      console.error('Error fetching route data:', error);
      return []; // Return an empty array in case of an error
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.880000, // Set a central point for the map
          longitude: 79.923000,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Render markers only if pins data is available */}
        {pins.length >= 2 && (
          pins.map((pin, index) => (
            <Marker
              key={pin.id}
              coordinate={{
                latitude: pin.latitude,
                longitude: pin.longitude,
              }}
              title={pin.title}
              description={pin.description}
            />
          ))
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates} // Combined route data from API
            strokeColor="#000" // Black color for the route line
            strokeWidth={6} // Width of the route line
          />
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
});

export default DriverMap;
