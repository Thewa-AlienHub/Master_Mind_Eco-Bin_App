import React from 'react';
import { Text, View, Button, StyleSheet,TouchableOpacity, StatusBar, Platform,useWindowDimensions, TextInput, ScrollView,ActivityIndicator } from 'react-native';
import colors from '../config/colors';
import Icon  from 'react-native-vector-icons/Ionicons';
import { useState,useEffect } from 'react';
import { doc,setDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

function AddHome({navigation,route}) {

    const { email } = route.params; 

    const [nickName,setNickName] = useState('');
    const [Ad_Line1,setAd_Line1] = useState('');
    const [Ad_Line2,setAd_Line2] = useState('');
    const [Ad_Line3,setAd_Line3] = useState('');
    const [city,setCity] = useState('');
    const [zipCode,setZipCode] = useState(null);

    const [loading,setLoading] = useState(false);

    const{width} = useWindowDimensions();
    const isMobile = width <600;


    useEffect(() => {
        console.log(route.params);  // Check if route.params contains email
        console.log(email);
    }, [route.params, email]);
        

    function addData() {
        setLoading(true);
        const docId = `${email}_${nickName}`;
        console.log(docId);
        
        setDoc(doc(DB, "tenants", docId), {
            AD_Line1: Ad_Line1,
            AD_Line2: Ad_Line2,
            AD_Line3: Ad_Line3,
            City: city,
            NickName: nickName,
            ZipCode: zipCode,
        }).then(() => {
            setLoading(false);
            console.log('Document successfully written!');
            console.log(docId);
            
            navigation.navigate('homeProfile', { docId: docId });
        }).catch((error) => {
            setLoading(false);
            console.error("Error writing document: ", error);
        });
    }
    

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
            {loading ? (  // Show the loading indicator if loading is true
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <>
                    <View style={styles.TopBarContainer}>
                    <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => navigation.navigate('addTenant')} style={styles.backButtonContainer}>
                        <Icon name="arrow-back" size={34} color="white" />
                    </TouchableOpacity>
                </View>
                        <Text style={styles.TopBar}>
                            Add Home
                        </Text>
                    </View>
                    <View style={isMobile? null:styles_web.formContainer}>
                <View style={isMobile? null:styles_web.form}> 
                    <View style={styles.LableContainer}>
                        <Text style={styles.label}>Nick Name :</Text>
                    </View>
                    <TextInput
                        value={nickName}
                        onChangeText={(text)=>{setNickName(text)}}
                        style={styles.inputBox}
                        placeholder="useless placeholder"
                    />
                    <View style={styles.addressLabelContainer}>
                        <Text style={{ fontSize: 30 }}>Address</Text>
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Address Line 1 :</Text>
                        </View>
                        <TextInput
                            value={Ad_Line1}
                            onChangeText={(text) => setAd_Line1(text)}
                            style={styles.inputBox}
                            placeholder="Address Line 1"
                        />
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Address Line 2 :</Text>
                        </View>
                        <TextInput
                            value={Ad_Line2}
                            onChangeText={(text) => setAd_Line2(text)}
                            style={styles.inputBox}
                            placeholder="Address Line 2"
                        />
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Address Line 3 :</Text>
                        </View>
                        <TextInput
                            value={Ad_Line3}
                            onChangeText={(text) => setAd_Line3(text)}
                            style={styles.inputBox}
                            placeholder="Address Line 3"
                        />


                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>City :</Text>
                        </View>
                        <TextInput
                            value={city}
                            onChangeText={(text) => setCity(text)}
                            style={styles.inputBox}
                            placeholder="City"
                        />


                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Zip Code :</Text>
                        </View>
                        <TextInput
                            value={zipCode}
                            onChangeText={(text) => setZipCode(text)}
                            style={styles.inputBox}
                            placeholder="Zip Code"
                        />
                    </View>
                    <View style={styles.ButtonContainer}>
                            <TouchableOpacity style={styles.button} onPress={addData}>
                                <Text style={styles.buttonText}>Generate QR</Text>
                            </TouchableOpacity>
                        </View>
                </View>
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
      width: '100%',
      overflow: 'auto',
  },
  TopBarContainer: {
      backgroundColor: '#00CE5E',
      flex: 0.23,
      width: '100%',
      borderBottomStartRadius:70,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 3 : 0,
      position: 'relative',
  },
  TopBar: {
      fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
      textAlign: 'center',
      fontSize:32,
      top:-20,
      color: colors.white,
      fontWeight:'bold',
  },
  backButton: {
      position: 'absolute',
      left: 10,
      top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  formContainer: {
      position: 'absolute',
      top: '22%',
      width: '100%',
  },
  LableContainer: {
      paddingTop: 10,
  },
  label: {
      paddingLeft: 20,
      fontSize: 24,
      color:'#009644',
  },
  addressLabelContainer: {
      paddingTop: 10,
      margin: 15,
  },
  ButtonContainer: {
      flex: 1,
      top: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:50,
  },
  button: {
      width: 320,
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
  inputBox: {
      height: 50,
      margin: 12,
      borderWidth: 2,
      padding: 10,
      borderColor: '#009644',
      borderRadius: 10,
      ...Platform.select({
          ios: {
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
          },
          android: {
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 100 },
              shadowOpacity: 1,
              shadowRadius: 2,
          },
          web: {
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          },
          scrollViewContainer: {
            flexGrow: 1,
            paddingBottom: 150,
            maxHeight: '150vh',
        },
      }),
      zIndex: 10,
  },
});

const styles_web = StyleSheet.create({
  formContainer: {
      position: 'absolute',
      top: '25%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  form: {
      width: '70%',
      alignItems: 'center',
  },
});
export default AddHome;
