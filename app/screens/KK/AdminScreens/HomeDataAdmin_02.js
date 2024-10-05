import React from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform, useWindowDimensions,TouchableOpacity, TextInput, ScrollView,Alert } from 'react-native';
import { useState, useEffect,useCallback } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { DB } from '../../../config/DB_config';
import colors from '../../../Utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MenuButton from '../../../Components/MenuButton';
import NotificationBell from '../../../Components/NotificationBell';




function HomeDataAdmin({ route, navigation,drawer }) {
    const { docId } = route.params;
    console.log(docId);
    
    const { width, height } = useWindowDimensions();
    const isMobile = width < 600;

    const [homeData, setHomeData] = useState({
        NickName:'',
        Ad_Line1: '',
        Ad_Line2: '',
        Ad_Line3: '',
        City: '',
        ZipCode: '',
    });

    const [combinedAddress, setCombinedAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [point,setPoint] = useState({
        latitude:0,
        longitude:0,
    });




    const fetchHomeData = useCallback(async () => {
        try {
            const docRef = doc(DB, "tenants", docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setHomeData({
                  ...data,
                  date: data.date ? data.date.toDate() : null, // Convert Firestore Timestamp to JS Date
              });
                console.log('home data set');
                console.log(data);
                
                
                setCombinedAddress(`${data.Ad_Line1}\n${data.Ad_Line2}\n${data.Ad_Line3}\n${data.City}`);
            } else {
                console.log('No file found');
            }
        } catch (error) {
            console.log('Error fetching', error);
        } finally {
            setLoading(false);
        }
    }, [docId]);
    
    const getCodinantsForMap = async() =>{
        try {
            const docRef = doc(DB, "registeredPins", docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setPoint(data)
            } else {
                console.log('No points found');
            }
        } catch (error) {
            console.log('Error fetching', error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
      try {
          await deleteDoc(doc(DB, "tenants", docId)); // Delete the document
          await deleteDoc(doc(DB, "registeredPins", docId)); // Optionally delete related pins
          Alert.alert('Success', 'Data has been deleted successfully.');
          navigation.goBack();  // Go back to the previous screen
      } catch (error) {
          console.log('Error deleting data:', error);
          Alert.alert('Error', 'There was an error deleting the data.');
      }
  };

    useFocusEffect(
        useCallback(() => {
            setLoading(true); 
            fetchHomeData();
            getCodinantsForMap();
        }, [fetchHomeData])
    );

    


    return (
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
            <Icon name="arrow-back" size={34} color="white" />
              <View style={styles.logoContainer}>
                <Text style={styles.logotext}>Eco Bin</Text>
              </View>
            </View>
            <View style={styles.HeadertextContainer}>
              <Text style={styles.Headertext}>{homeData.NickName} Profile</Text>
            </View>
          </View>
    
          <View style={styles.detailTab}>
            <Text style={styles.detailHeader}>Tenant Details</Text>
          </View>
    
          
    
          {/* Personal Details */}
          
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} >
          <View style={styles.detailsCard}>
            <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Address: </Text>
            <Text style={styles.detailText}>{combinedAddress }</Text>
            </View>
    
            <View style={styles.detailTextContainer}>
            <Text style={styles.label}>Zip Code: </Text>
            <Text style={styles.detailText}>{homeData.ZipCode || "Unknown"}</Text>
            </View>
            {homeData.type === 'Event' && (
                <View style={styles.detailTextContainer}>
                    <Text style={styles.label}>Date: </Text>
                    <Text style={styles.detailText}>{homeData.date ? homeData.date.toLocaleString() : "Unknown"}</Text>
                </View>
            )}
    
            <View style={styles.mapContainer}>
    {point.latitude !== 0 && point.longitude !== 0 ? (
        <MapView
            style={styles.map}
            region={{
                latitude: point.latitude,
                longitude: point.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            scrollEnabled={false} // Allow panning
            zoomEnabled={true} // Allow zooming
            rotateEnabled={true} // Disable rotation
            pitchEnabled={false} // Disable tilt/3D view
        >
            <Marker
                coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                }}
                title="Location"
                description="This is the selected location"
            />
        </MapView>
    ) : (
        <Text>No valid location data available</Text>
    )}
</View>

    
            
            
            
            
          </View>
    
           {/* Edit Profile Button */}
           <TouchableOpacity style={styles.editButton} onPress={handleDelete}>
            <Text style={styles.editButtonText}>Delete</Text>
          </TouchableOpacity>
    
          </ScrollView>
          
    
         
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
      },
      headerContainer: {
        backgroundColor: colors.primary,
        height: 230,
        padding: 10,
      },
      iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
      },
      logoContainer: {
        justifyContent: 'center',
        backgroundColor:colors.primary,
        alignItems: 'center',
        height: 50,
        width: 200,
        borderTopLeftRadius: 20,
        marginTop: 20,
        marginLeft: 70
      },
      logotext: {
        fontSize: 30,
        color: colors.dark,
        fontWeight: 'bold',
      },
      HeadertextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
      },
      Headertext: {
        fontSize: 35,
        color: colors.white,
        fontWeight: 'bold',
      },
      detailTab: {
        backgroundColor: colors.dark,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
      },
      detailHeader: {
        fontSize: 20,
        color: colors.white,
        fontWeight: 'bold',
      },
      detailTextNameContainer:{
        marginLeft: 30,
        marginTop: -70,
        width: 190,
        marginBottom: 30,
    
      },
      profileContainer: {
        alignItems: 'center',
        marginTop: -50,
        marginLeft: 200,
      },
      profileImage: {
        width: 120,
        height: 120,
        borderRadius: 75,
      },
      editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 120,
        backgroundColor: colors.white,
        borderRadius: 50,
        padding: 5,
      },
      editIcon: {
        width: 20,
        height: 20,
      },
      detailsCard: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 20,
      },
      detailText: {
        fontSize: 18,
        marginBottom: 10,
      },
      detailTextContainer: {
        borderColor: colors.subitm,
        borderStyle: 'solid',
        borderWidth: 2,
        marginBottom: 10,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: 10,
        width: 300,
        paddingLeft: 20,
      },
      detailTextName:{
        fontSize: 25,
        marginBottom: -5,
        fontWeight: 'bold',
        
      },
      label: {
        fontWeight: 'bold',
        fontSize: 18,
        alignItems:'flex-start'
      },
      editButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 100,
        marginTop: 20,
        alignItems: 'center',
      },
      editButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
      },
      scrollView: {
        flex: 1,
        marginTop: -10,
        marginBottom: 10,
      },
      scrollContent: {
        paddingBottom: 0,
      },
      mapContainer:{
        borderWidth:2,
        marginTop:30,
        height:200,
      },
      map: {
        width: '100%',
        height: '100%',
      },
    });
    
export default HomeDataAdmin;
