import React, { useState, useRef,useEffect,} from 'react';
import { View, StyleSheet, Button, Alert, TouchableOpacity, Modal, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../Utils/colors';
import { useWindowDimensions } from 'react-native';
import { doc,setDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config';


function SetMapPin({navigation,route}) {
  const {ID,onLocationChosen} = route.params;

  const [startPoint, setStartPoint] = useState(
    {latitude: 6.878417,
    longitude: 79.918944,});
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(true); // For modal visibility
  const [currentFlashIndex, setCurrentFlashIndex] = useState(0); // Track the current message
  const mapRef = useRef(null); // Ref for MapView

  const {height, width} = useWindowDimensions();

  const openRouteServiceApiKey = '5b3ce3597851110001cf6248af33e9cb607c4f9c9bd4a25d8d2cb230';

  const flashMessages = [
    { text: "Welcome! Ready to find your current location?", icon: null },
    { text: "Don't forget to enable location services for better accuracy.", icon: null },
    { text: "Click this to get your current location", icon: 'locate' },
    { text: "Select the pin and drag where ever you need", icon: 'location' },

  ];
  // Function to get current location
  const getCurrentLocation = async () => {
    setLoading(true); // Start loading spinner

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setStartPoint({ latitude, longitude });

      // Pan and zoom to the user's current location
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading spinner after location is fetched
    }
  };


  const handleNextFlashMessage = () => {
    if (currentFlashIndex < flashMessages.length - 1) {
      setCurrentFlashIndex(currentFlashIndex + 1);
    } else {
      setModalVisible(false); // Close modal after the last message
    }
  };

  const choose = () => {
    setDoc(doc(DB, "registeredPins", ID), {
      ID:ID,
      longitude: startPoint.longitude,
      latitude:startPoint.latitude,
  }).then(() => {
      setLoading(false);
      console.log('Document successfully written!');
      onLocationChosen();
      navigation.goBack(); 
  }).catch((error) => {
      setLoading(false);
      console.error("Error writing document: ", error);
  });
  };
  

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Assign ref to MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.878417,
          longitude: 79.918944,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {startPoint && (
          <Marker
            coordinate={startPoint}
            title="Drag if you need"
            draggable 
            onDragEnd={(e) => setStartPoint(e.nativeEvent.coordinate)} 
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates} // Route data from API
            strokeColor="#000" // Black color for the route line
            strokeWidth={6} // Width of the route line
          />
        )}
      </MapView>

       {/* Custom Modal */}
       {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {flashMessages[currentFlashIndex].icon && (
                <Icon name={flashMessages[currentFlashIndex].icon} size={50} color="black" />
              )}
              <Text style={styles.flashMessageText}>
                {flashMessages[currentFlashIndex].text}
              </Text>
              <TouchableOpacity onPress={handleNextFlashMessage} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.buttonContainerCurrentLocator}>
        <TouchableOpacity style={styles.iconContainer}  onPress={getCurrentLocation}>
        {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Icon name="locate-outline" style={styles.icon} size={30} />
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[
          styles.button, 
          { left: (width / 2) - 100 } 
        ]} 
        onPress={choose}
      >
        <Text style={styles.buttonText}>Choose</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 20, 
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00CE5E',
    borderRadius: 15,
  },
  
buttonText: {
    color:colors.white,
    fontSize: 22,
    fontWeight:"bold",
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  flashMessageText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#00CE5E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SetMapPin;
