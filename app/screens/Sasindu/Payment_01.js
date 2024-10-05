import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';

function Payment({ route, navigation,data }) {

    const { email } = route.params || {};
    console.log('Received email paymentPage:', email); // For debugging purposes

    const request = route.params?.request || {};
    const { address, pickupDate, type, note } = request;

    const [currentDateTime, setCurrentDateTime] = useState({
        date: '',
        time: '',
    });

    // Function to format the date and time
    const getCurrentDateTime = () => {
        const current = new Date();
        const date = `${current.getDate().toString().padStart(2, '0')}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getFullYear()}`;
        const time = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        return { date, time };
    };

    // Use useEffect to set the current date and time when the component mounts
    useEffect(() => {
        setCurrentDateTime(getCurrentDateTime());
    }, []);

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
                    <Text style={styles.TopBar}>Pay Bills Quickly</Text>
                </View>
            </View>
            <Text style={styles.monthlyFee}>Monthly Fee</Text>
            <Text style={styles.price}>LKR 1500</Text>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    {/* House ID Row */}
                    <View style={styles.row}>
                        <Text style={styles.label}>User Email</Text>
                        <Text style={styles.value}></Text>
                    </View>
                    <View style={styles.separator} />

                    {/* Recycable Refund Row */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Recycable Refund</Text>
                        <Text style={styles.value}>750</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Penalty Fee</Text>
                        <Text style={styles.value}>750</Text>
                    </View>
                    <View style={styles.separator} />

                    {/* Date Row */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.value}>{currentDateTime.date}</Text>
                    </View>
                    <View style={styles.separator} />

                    {/* Time Row */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Time</Text>
                        <Text style={styles.value}>{currentDateTime.time}</Text>
                    </View>
                    <View style={styles.separator} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Total Amount</Text>
                        <Text style={styles.value}>750</Text>
                    </View>

                    {/* Button */}
                    <View style={styles.ButtonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('addCardDetails', { email,totalAmount: 750 })}>
                            <Text style={styles.buttonText}>Pay</Text>
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
    monthlyFee: {
        fontSize: 18,
        textAlign: 'center',
        color: colors.black,
        fontWeight: '500',
        top:20
    },
    price: {
        top:22,
        fontSize: 36,
        textAlign: 'center',
        color: colors.black,
        fontWeight: '600',
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
        marginTop: 15,
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
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginBottom:1
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#929292',
        marginVertical: 10,
    },
});

export default Payment;
