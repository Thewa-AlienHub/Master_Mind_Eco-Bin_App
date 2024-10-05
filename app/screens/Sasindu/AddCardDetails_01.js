import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc } from "firebase/firestore"; 
import { DB } from '../../config/DB_config';

function AddCardDetails({ route, navigation }) {
    
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});  // New state for handling errors

    const { email } = route.params || {};
    console.log('Received email addCardDetailsPage:', email); // For debugging purposes


    const totalAmount = route.params?.totalAmount || 0;

    const validateFields = () => {
        const newErrors = {};

        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            newErrors.cardNumber = "Card number must be 16 digits";
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            newErrors.expiryDate = "Must be in MM/YY format";
        }

        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            newErrors.cvv = "CVV must be 3 digits";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handlePayment = async () => {
        if (validateFields()) {
            try {
                // Add card details to Firestore
                await addDoc(collection(DB, "cardDetails"), {
                    email: email,
                    totalAmount: totalAmount
                });
                
                navigation.navigate('success', { totalAmount });
            } catch (error) {
                console.error("Error adding card details: ", error);
                Alert.alert("Error", "There was a problem processing your payment. Please try again.");
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setCardNumber('');
            setExpiryDate('');
            setCvv('');
            setErrors({}); // Clear errors too

            return () => {
            };
        }, [])
    );


    
    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
        >
            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                    <Icon name="arrow-back" size={34} color="white" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Image
                        source={require("../../assets/images/Group 27.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.TopBar}>Make Payment</Text>
                </View>
            </View>
            <Image
                source={require("../../assets/images/card-removebg-preview.png")}
                style={styles.visaImg}
            />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>

                    <Text style={styles.label}>Card Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Card Number"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                    />
                    {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}

                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Expiration Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChangeText={setExpiryDate}
                            />
                            {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
                        </View>
                        <View style={[styles.inputContainer, { marginLeft: 10 }]}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="CVV"
                                keyboardType="numeric"
                                value={cvv}
                                onChangeText={setCvv}
                            />
                            {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
                        </View>
                    </View>

                    <Text style={styles.label}>Total: LKR {totalAmount}</Text>
                    {/* Button */}
                    <View style={styles.ButtonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handlePayment}>
                            <Text style={styles.buttonText}>Pay LKR {totalAmount}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    TopBarContainer: {
        backgroundColor: '#6EC6B2',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 15,
        width: '100%',
        borderBottomStartRadius: 90,
        borderBottomEndRadius: 90,
        alignItems: 'center',
        position: 'relative',
        minHeight: 275,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonContainer: {
        position: 'absolute',
        left: 15,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    logo: {
        top: 9, 
        marginLeft: 35,
        width: 140,
        height: 140,
    },
    TopBar: {
        top: 12,
        fontSize: 30,
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
    },
    visaImg: {
        top: 35,
        marginLeft: 140,
        width: 110,
        height: 70,
    },
    ButtonContainer: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 200,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6EC6B2',
        borderRadius: 15,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
    },
    contentContainer: {
        padding: 15,
        flexGrow: 1,
        paddingBottom: 30,
        marginTop: 40,
        alignItems: 'center'
    },
    card: {
        width: '90%',
        backgroundColor: '#DFDFDF',
        padding: 20,
        marginVertical: 10,
        borderRadius: 15,
        borderColor: '#6EC6B2',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    inputContainer: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#6EC6B2',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor:'#F7F7F7'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start',
    },
});

export default AddCardDetails;
