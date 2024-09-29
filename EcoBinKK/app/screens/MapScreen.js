import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

function MapScreen() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const openRouteServiceApiKey = '5b3ce3597851110001cf6248af33e9cb607c4f9c9bd4a25d8d2cb230'; 
  
  // Handle user taps to select start and end points
  const handleMapPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;

    if (!startPoint) {
      setStartPoint(coordinate); // Set start point on first tap
      setRouteCoordinates([]); // Clear any previous routes
    } else if (!endPoint) {
      setEndPoint(coordinate); // Set end point on second tap
      // Fetch route data
      await fetchRouteData(startPoint, coordinate);
    } else {
      // Reset both points after route is drawn
      setStartPoint(null);
      setEndPoint(null);
      setRouteCoordinates([]);
    }
  };

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

      setRouteCoordinates(routeCoords);
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.878417,
          longitude: 79.918944,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress} // Capture map taps
      >
        {startPoint && <Marker coordinate={startPoint} title="Start Point" />}
        {endPoint && <Marker coordinate={endPoint} title="End Point" />}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates} // Route data from API
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

export default MapScreen;
