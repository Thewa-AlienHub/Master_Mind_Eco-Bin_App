import React from 'react';
import { Text, View, Button, StyleSheet, 
    StatusBar, Platform,useWindowDimensions, 
    TextInput, ScrollView,ActivityIndicator,
Animated,TouchableOpacity,opacityAnim } from 'react-native';
import colors from '../config/colors';
import { useState } from 'react';
import { doc,setDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

function AddHome({navigation}) {


    const [nickName,setNickName] = useState('');
    const [Ad_Line1,setAd_Line1] = useState('');
    const [Ad_Line2,setAd_Line2] = useState('');
    const [Ad_Line3,setAd_Line3] = useState('');
    const [city,setCity] = useState('');
    const [zipCode,setZipCode] = useState(null);

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState({});
    const{width} = useWindowDimensions();
    const isMobile = width <600;


    function addData() {
        setLoading(true);
        // Unique document reference for each house
        setDoc(doc(DB, "tenants", "house_" + nickName), {
            Ad_Line1: Ad_Line1,
            Ad_Line2: Ad_Line2,
            Ad_Line3: Ad_Line3,
            city: city,
            nickName: nickName,
            zipCode: zipCode,
        }).then(() => {
            setLoading(false);
            console.log('Document successfully written!');
            navigation.navigate('homeProfile',{nickName:nickName});
        }).catch((error) => {
            setLoading(false);
            console.error("Error writing document: ", error);
        });
    }
    

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
            {loading ? (
        // Show loading spinner
        <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Please wait, submitting your data...</Text>
        </View>
      ) : (
        <>
            <View style={styles.TopBarContainer}>
                    <View style={styles.backButton}>
                        <Button title='back' onPress={()=>navigation.navigate('addTenant')}/>
                    </View>
                    <Text style={styles.TopBar}>
                        Add Event
                    </Text>
                </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Enter Details</Text>
        <TextInput
          style={styles.input}
          placeholder="House Nick Name"
          value={nickName}
          onChangeText={(text)=>setNickName(text)}
        />
        {/* Animated Error for House Address */}
        {error.nickName && (
          <Animated.View style={{ opacity: opacityAnim }}>
            <Text style={styles.errorText}>{error.nickName}</Text>
          </Animated.View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Addrress line 1"
          value={Ad_Line1}
          onChangeText={setAd_Line1}
        />
        {/* Animated Error for Owner Name */}
        {error.Ad_Line1 && (
          <Animated.View style={{ opacity: opacityAnim }}>
            <Text style={styles.errorText}>{error.Ad_Line1}</Text>
          </Animated.View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Address line 2"
          value={Ad_Line2}
          onChangeText={setAd_Line2}
        />
        {/* Animated Error for Truck ID */}
        {error.Ad_Line2 && (
          <Animated.View style={{ opacity: opacityAnim }}>
            <Text style={styles.errorText}>{error.Ad_Line2}</Text>
          </Animated.View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Address line 3"
          value={Ad_Line3}
          onChangeText={setAd_Line3}
        />
        {/* Animated Error for Collector Name */}
        {error.Ad_Line3 && (
          <Animated.View style={{ opacity: opacityAnim }}>
            <Text style={styles.errorText}>{error.Ad_Line3}</Text>
          </Animated.View>
        )}
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        {/* Animated Error for Collector Name */}
        {error.city && (
          <Animated.View style={{ opacity: opacityAnim }}>
            <Text style={styles.errorText}>{error.city}</Text>
          </Animated.View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
        />
        {/* Animated Error for Collector Name */}
        {error.zipCode && (
          <Animated.View style={{ opacity: opacityAnim }}>
            <Text style={styles.errorText}>{error.zipCode}</Text>
          </Animated.View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={addData}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      </>
    )}
    </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

      },
      scrollViewContainer: {
        flexGrow: 1,
        paddingBottom: 50,
        maxHeight: '105vh',
    },
      formContainer: {
        width: "80%",
        paddingTop:50,
      },
      formTitle: {
        fontSize: 24,
        marginBottom: 30,
        color: "#4C6A92",
      },
      input: {
        height: 40,
        fontSize: 16,
        borderColor: "#6EC6B2",
        borderWidth: 1,
        marginBottom: 30,
        paddingHorizontal: 15,
        borderRadius: 5,
      },
      submitButton: {
        backgroundColor: "#6EC6B2",
        padding: 10,
        borderRadius: 20,
      },
      submitButtonText: {
        color: "#4C6A92",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
      },
      errorText: {
        color: "red",
        marginBottom: 10,
      },
      loaderContainer: {
        flex:1,
        padding: 20,
        backgroundColor: '#fff', // White background for the loader
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, // Box shadow for Android
      },
      loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
      },
      TopBarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight*2 : 0,
        position: 'relative',
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 36 : 56,
        textAlign: 'center',
        fontWeight: "bold",
        color: "#4C6A92",
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    });

export default AddHome;
