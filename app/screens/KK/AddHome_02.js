import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, StatusBar, Platform, useWindowDimensions } from 'react-native';
import colors from '../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config';

function AddHome({ navigation, route }) {
    const { email,data } = route.params; 

    const [nickName, setNickName] = useState('');
    const [Ad_Line1, setAd_Line1] = useState('');
    const [Ad_Line2, setAd_Line2] = useState('');
    const [Ad_Line3, setAd_Line3] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLocationSet, setIsLocationSet] = useState(false);
    const [nicknameExists, setNicknameExists] = useState(false); // State to track nickname availability
    const [nickStatus,setNickState] = useState(true);
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    // Function to check if the nickname already exists
    const checkNicknameExists = async (nickname) => {
        const docId = `${email}_${nickname}`;
        const docRef = doc(DB, "tenants", docId);
        const docSnapshot = await getDoc(docRef);
        setNicknameExists(docSnapshot.exists());
    };

    // Update nickname and check for existence
    const handleNicknameChange = (text) => {
        setNickName(text);
        if (text) {
            checkNicknameExists(text);
        } else {
            setNicknameExists(false); // Reset if input is empty
        }
    };


    const isButtonDisabled = !nickName || nicknameExists;

    const addData = async () => {
        if (nicknameExists) {
            alert("This nickname already exists. Please choose another one.");
            return;
        }

        setLoading(true);
        const docId = `${email}_${nickName}`; // Create document ID
        console.log(docId);

        // Proceed to add data
        setDoc(doc(DB, "tenants", docId), {
            Ad_Line1,
            Ad_Line2,
            Ad_Line3,
            City: city,
            NickName: nickName,
            ZipCode: zipCode,
            type:'Home'
        }).then(() => {
            setLoading(false);
            console.log('Document successfully written!');
            navigation.navigate('QrCodeHome', { docId, email,data });
        }).catch((error) => {
            setLoading(false);
            console.error("Error writing document: ", error);
        });
    };

    const navChoose = () => {
        const docId = `${email}_${nickName}`;
        navigation.navigate('SetMapPin', {
            ID: docId,
            onLocationChosen: () => setIsLocationSet(true),
        });
    };

    return (
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.TopBarContainer}>
                            <View style={styles.backButton}>
                                <TouchableOpacity onPress={() => navigation.goBack()}  style={styles.backButtonContainer}>
                                    <Icon name="arrow-back" size={34} color="white" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.TopBar}>Add Home</Text>
                        </View>
                        <View style= {styles.formbackground}>
                        <ScrollView>
                            <View style={styles.formContainer}>
                                <View style={styles.LableContainer}>
                                    <Text style={styles.label}>Nick Name :</Text>
                                </View>
                                <TextInput
                                    value={nickName}
                                    onChangeText={handleNicknameChange} 
                                    style={styles.inputBox}
                                    placeholder="Enter nickname"
                                />
                                {nicknameExists && <Text style={styles.errorText}>This nickname is already taken.</Text>}
                                <View style={styles.addressLabelContainer}>
                                    <Text style={{ fontSize: 30 }}>Address</Text>
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Address Line 1 :</Text>
                                    </View>
                                    <TextInput
                                        value={Ad_Line1}
                                        onChangeText={text => setAd_Line1(text)}
                                        style={styles.inputBox}
                                        placeholder="Address Line 1"
                                    />
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Address Line 2 :</Text>
                                    </View>
                                    <TextInput
                                        value={Ad_Line2}
                                        onChangeText={text => setAd_Line2(text)}
                                        style={styles.inputBox}
                                        placeholder="Address Line 2"
                                    />
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Address Line 3 :</Text>
                                    </View>
                                    <TextInput
                                        value={Ad_Line3}
                                        onChangeText={text => setAd_Line3(text)}
                                        style={styles.inputBox}
                                        placeholder="Address Line 3"
                                    />
                                    
                                    <View style={styles.ButtonContainer}>
                                    
                                        <Text style={styles.errorText}>
                                            {isButtonDisabled ? 'Fill nickname first':null}
                                        </Text>
                                    
                                        <TouchableOpacity
                                            style={isButtonDisabled ? styles.buttonDisabled : styles.buttonMap}
                                            onPress={navChoose}
                                            disabled={isButtonDisabled}
                                        >
                                            
                                            <Text style={styles.buttonText}>
                                                {isLocationSet ? 'Change' : 'Set on map'}
                                            </Text>
                                            {isLocationSet && (
                                                <Icon name="checkmark-circle" size={24} color="green" style={styles.iconRight} />
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>City :</Text>
                                    </View>
                                    <TextInput
                                        value={city}
                                        onChangeText={text => setCity(text)}
                                        style={styles.inputBox}
                                        placeholder="City"
                                    />

                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Zip Code :</Text>
                                    </View>
                                    <TextInput
                                        value={zipCode}
                                        onChangeText={text => setZipCode(text)}
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
                        </ScrollView>
                        </View>
                    </>
                )}
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.primary,
    
    },
    TopBarContainer: {
           
        flex: 0.2,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2: 70,
    },
    TopBar: {
        fontSize: 40,
        color: colors.white,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    backButtonContainer: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    formContainer: {
        paddingHorizontal: 5,
        paddingBottom:30,
        width: '100%',
        alignSelf: 'center',
        height:'100%'
        
    },formbackground: {
        backgroundColor: colors.white,
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        height: 800,
        width: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2: 30,
    },
    LableContainer: {
        paddingTop: 9,
    },
    label: {
        paddingLeft: 20,
        fontSize: 22,
        color: 'black',
    },
    addressLabelContainer: {
        paddingTop: 10,
        margin: 15,
    },
    ButtonContainer: {
        flex: 1,
        top: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ButtonContainerQR: {
        flex: 1,
        top: 10,
        bottom:30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    datePickerContainer: {
        height: 50,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        borderColor: '#6EC6B2',
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: '#E6E6E6'
    },
    datePickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 17,
    },
    calendarIcon: {
        marginLeft: 'auto',
    },
    button: {
        width: 325,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6EC6B2',
        borderRadius: 15,
    },
    buttonMap: {
            width: 200,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            borderRadius: 15,
            marginBottom: 20,
        },
        buttonDisabled: {
            width: 200,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#797a79',
            borderRadius: 15,
            marginBottom: 20,
        },
    buttonText: {
        position: 'absolute',
        color: colors.white,
        fontSize: 22,
        fontWeight: "bold",
    },
    iconRight: {
        marginLeft: 140,
    },
    inputBox: {
        height: 50,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        borderColor: '#6EC6B2',
        fontSize: 19,
        borderRadius: 10,
        backgroundColor: '#E6E6E6',
    },

    errorText: {
        color: 'red',
        paddingLeft: 20,
        top:-12
    },
});


export default AddHome;
