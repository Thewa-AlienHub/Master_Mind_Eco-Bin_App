import React from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform,useWindowDimensions, TextInput, ScrollView } from 'react-native';
import colors from '../config/colors';
import { useState,useEffect } from 'react';
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

function EditHomeProfile({route,navigation}) {
    const {nickName} = route.params;
    const{width,height} = useWindowDimensions();
    const isMobile = width <600;

    const [homeData, setHomeData] = useState({
        AD_Line1:'',
        AD_Line2:'',
        AD_Line3:'',
        City : '',
        ZipCode:'',
    });

    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchHomeData = async () => {
            try {
                const docRef = doc(DB,"tenants","house_"+nickName);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setHomeData(docSnap.data());
                } else {
                    console.log('No file founded')
                }
            } catch (error) {
                console.log('Error fetch', error)
            }finally{
                setLoading(false);
            }
        };
        fetchHomeData();
    },[nickName]);

    const handleInputChange = (field, value) => {
        setHomeData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };
    const handleUpdate = async () => {
        try {
            const docRef = doc(DB, "tenants", "house_" + nickName);
            await updateDoc(docRef, homeData);
            alert('Data updated successfully!');
            navigation.navigate('homeProfile',{nickName:nickName});
        } catch (error) {
            console.log('Error updating document', error);
            alert('Failed to update data');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
        {loading ? (
    // Show loading spinner
    <View style={styles.loaderContainer}>
    <Text >Please wait</Text>
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
      editable={false}
    />
    
    <TextInput
    multiline
    numberOfLines={4}
      style={styles.input}
      placeholder="Addrress line 1"
      value={homeData.AD_Line1}
      onChangeText={(text) => handleInputChange('AD_Line1', text)}
    />
    
    <TextInput
        style={styles.input}
        placeholder="Address line 2"
        value={homeData.AD_Line2}
        onChangeText={(text) => handleInputChange('AD_Line2', text)}
    />
    <TextInput
        style={styles.input}
        placeholder="Address line 3"
        value={homeData.AD_Line3}
        onChangeText={(text) => handleInputChange('AD_Line3', text)}
    />
    <TextInput
        style={styles.input}
        placeholder="City"
        value={homeData.City}
        onChangeText={(text) => handleInputChange('City', text)}
    />
    <TextInput
        style={styles.input}
        placeholder="Zip Code"
        value={homeData.ZipCode}
        onChangeText={(text) => handleInputChange('ZipCode', text)}
    />
    <Button
        title="Update"
        onPress={handleUpdate}
        style={styles.submitButton}
    />

    
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
const styles_web = StyleSheet.create({
    formContainer:{
        justifyContent:'center',
        alignItems:'center'
    },
  form:{
    alignContent:'center',
    width: "70%",
  }
})

export default EditHomeProfile;
