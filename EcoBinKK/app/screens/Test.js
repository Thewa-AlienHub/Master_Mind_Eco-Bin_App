import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, useWindowDimensions, TextInput, Platform, StatusBar, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, doc, setDoc , addDoc } from "firebase/firestore"; 
import { db } from '../config/DB_config';
import { Alert } from 'react-native'; 

function RequestRecycle({ navigation }) {
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    const [address, setAddress] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [type, setType] = useState('');
    const [note, setNote] = useState('');
 
    function addRequest() {
        if (!address || !pickupDate || !type || !note) {
            Alert.alert("Missing Fields", "Please fill in all fields.");
            return;
        }
    
        addDoc(collection(db, "recycleRequest"), {
            address: address,
            pickupDate: pickupDate,
            type: type,
            note: note
        }).then(() => {
            console.log('Request successfully written');
            Alert.alert(
                "Success",
                "Your recycle request has been added successfully!",
                [{ text: "OK", onPress: () => navigation.navigate('addRequest') }]
            );
            // Optionally clear form fields here
            setAddress('');
            setPickupDate('');
            setType('');
            setNote('');
        }).catch((error) => {
            console.error("Error creating request: ", error);
            Alert.alert("Error", "There was a problem adding your request. Please try again.");
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => navigation.navigate('profile')} style={styles.backButtonContainer}>
                        <Icon name="arrow-back" size={34} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.TopBar}>Create Recycle Request</Text>
            </View>
            <View style={isMobile ? styles.formContainer : styles_web.formContainer}>
                <View style={isMobile ? null : styles_web.form}>
                    <View style={styles.addressLabelContainer}>
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Address :</Text>
                        </View>
                        <TextInput
                            value={address} onChangeText={(text) => setAddress(text)}
                            style={styles.inputBox}
                            placeholder="Enter address"
                        />
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Pickup Date :</Text>
                        </View>
                        <TextInput
                            value={pickupDate} onChangeText={(text) => setPickupDate(text)}
                            style={styles.inputBox}
                            placeholder="Enter pickup date"
                        />
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Recycle Type :</Text>
                        </View>
                        <TextInput
                            value={type} onChangeText={(text) => setType(text)}
                            style={styles.inputBox}
                            placeholder="Enter type"
                        />
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Note :</Text>
                        </View>
                        <TextInput
                            value={note} onChangeText={(text) => setNote(text)}
                            style={styles.inputBox}
                            placeholder="Enter note"
                        />
                        <View style={styles.ButtonContainer}>
                            <TouchableOpacity style={styles.button} onPress={addRequest}>
                                <Text style={styles.buttonText}>Request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
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
        flex: 0.13,
        width: '100%',
        borderBottomStartRadius:70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
        position: 'relative',
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        textAlign: 'center',
        fontSize:32,
        top:-20,
        color: colors.white,
        fontWeight:'bold',
        fontFamily: 'Arial',
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
        top: 40,
        justifyContent: 'center',
        alignItems: 'center',
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

export default RequestRecycle;
