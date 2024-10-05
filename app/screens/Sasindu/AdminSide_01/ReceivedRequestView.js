import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';

function ReceviedRequestView({ route, navigation }) {
    const request = route.params?.request || {};
    const { selectedNickname, pickupDate, type, note } = request;

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
                    source={require("../../../assets/images/Group 27.png")}
                    style={styles.logo}
                />
                    <Text style={styles.TopBar}>{type}</Text>
                    <Text style={styles.dateText}>{pickupDate}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>

                    <Text style={styles.label}>House I</Text>
                    <Text style={styles.value}>{selectedNickname}</Text>
                    <View style={styles.separator} />

                    <Text style={styles.label}>Recycle Type</Text>
                    <Text style={styles.value}>{type}</Text>
                    <View style={styles.separator} />

                    <Text style={styles.label}>Pickup Date</Text>
                    <Text style={styles.value}>{pickupDate}</Text>
                    <View style={styles.separator} />

                    <Text style={styles.label}>Note</Text>
                    <Text style={styles.value}>{note}</Text>
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
    logo: {
        top: 9,
        marginLeft: 35,
        width: 140,
        height: 140,
    },
    TopBar: {
        top: 12,
        fontSize: 28,
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
    },
    dateText: {
        top: 3,
        fontSize: 18,
        color: colors.white,
        fontWeight: '700',
        marginTop: 10,
    },
    backButtonContainer: {
        position: 'absolute',
        left: 15,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentContainer: {
        padding: 15,
        flexGrow: 1,
        paddingBottom: 30,
        marginTop: 15,
        alignItems: 'center'
    },
    card: {
        width: '85%',
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
        alignItems: 'center'
    },
    label: {
        alignItems: 'center',
        justifyContent: "center",
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15,
    },
});

export default ReceviedRequestView;
