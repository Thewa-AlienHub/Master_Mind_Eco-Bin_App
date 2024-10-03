import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, StatusBar, Platform, useWindowDimensions } from 'react-native';
import colors from '../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../config/DB_config';
import DateTimePicker from '@react-native-community/datetimepicker';

function AddEvent({navigation,route}) {
    const {email} = route.params;
    console.log('Email:', email);
    
    const [eventDate, setEventDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);


    const [nickName, setNickName] = useState('');
    const [Ad_Line1, setAd_Line1] = useState('');
    const [Ad_Line2, setAd_Line2] = useState('');
    const [Ad_Line3, setAd_Line3] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLocationSet, setIsLocationSet] = useState(false);
    const [nicknameExists, setNicknameExists] = useState(false); // State to track nickname availability
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
            date: eventDate,
            type:'Event'
        }).then(() => {
            setLoading(false);
            console.log('Document successfully written!');
            navigation.navigate('QrCodeHome', { docId, email });
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

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || eventDate;
        setShowDatePicker(false); // Close the picker after selecting
        setEventDate(currentDate);
    };
    
    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || eventDate;
        setShowTimePicker(false); // Close the picker after selecting
        setEventDate(currentTime);
    };
    

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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
                                <TouchableOpacity onPress={() => navigation.navigate('addTenant')} style={styles.backButtonContainer}>
                                    <Icon name="arrow-back" size={34} color="white" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.TopBar}>Add Event</Text>
                        </View>
                        <View style={isMobile ? null : styles_web.formContainer}>
                            <View style={isMobile ? null : styles_web.form}>
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
                                        <TouchableOpacity style={styles.buttonMap} onPress={navChoose}>
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
                                        <Text style={styles.label}>Select End Date and Time :</Text>
                                    </View>
                                    
                                </View>

                                <View style={styles.dateTimeContainer}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.button}>
                                        <Text style={styles.buttonText}>Pick Date</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.dateText}>{eventDate.toDateString()}</Text> 

                                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.button}>
                                        <Text style={styles.buttonText}>Pick Time</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.dateText}>{eventDate.toLocaleTimeString()}</Text> 

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={eventDate}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                    />
                                )}

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={eventDate}
                                        mode="time"
                                        display="default"
                                        onChange={onTimeChange}
                                    />
                                )}
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
        borderBottomStartRadius: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 3 : 0,
        position: 'relative',
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        textAlign: 'center',
        fontSize: 32,
        top: -20,
        color: colors.white,
        fontWeight: 'bold',
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
        color: '#009644',
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
        marginBottom: 50,
    },
    button: {
        width: 320,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CE5E',
        borderRadius: 15,
    },
    buttonMap: {
        width: 200,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CE5E',
        borderRadius: 15,
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
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
        }),
    },
    errorText: {
        color: 'red',
        paddingLeft: 20,
        fontSize: 16,
    },
    dateTimeContainer: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CE5E',
        borderRadius: 15,
        marginVertical: 10,
    },
    buttonText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 18,
        color: '#009644',
        marginVertical: 5,
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

export default AddEvent;
