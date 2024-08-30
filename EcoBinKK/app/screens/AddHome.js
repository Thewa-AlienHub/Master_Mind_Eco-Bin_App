import React from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform,useWindowDimensions, TextInput, ScrollView,ActivityIndicator } from 'react-native';
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

    const{width} = useWindowDimensions();
    const isMobile = width <600;


    function addData() {
        setLoading(true);
        // Unique document reference for each house
        setDoc(doc(DB, "tenants", "house_" + nickName), {
            AD_Line1: Ad_Line1,
            AD_Line2: Ad_Line2,
            AD_Line3: Ad_Line3,
            City: city,
            NickName: nickName,
            ZipCode: zipCode,
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
            {loading ? (  // Show the loading indicator if loading is true
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <>
                    <View style={styles.TopBarContainer}>
                        <View style={styles.backButton}>
                            <Button title='back' onPress={()=>navigation.navigate('addTenant')}/>
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
                    <View style={styles.QrCodeButtonContainer}>
                        <Button onPress={addData} title='Generate QR Code'></Button>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContainer: {
        flexGrow: 1,
        paddingBottom: 50,
        maxHeight: '105vh',
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
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        textAlign: 'center',
        color: colors.black,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    LableContainer: {
        paddingTop: 10,
    },
    label: {
        paddingLeft: 20,
        fontSize: 24,
    },
    addressLabelContainer: {
        paddingTop: 10,
        margin: 15,
        borderWidth: 2,
        borderColor: 'red',
    },
    QrCodeButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
    },
    inputBox: {
        height: 50,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        backgroundColor: colors.light,
        borderColor: colors.dark,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 25,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 100 },
                shadowOpacity: 1,
                shadowRadius: 2,
            },
            web: {
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',

            },
        }),
        zIndex: 10,
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

export default AddHome;
