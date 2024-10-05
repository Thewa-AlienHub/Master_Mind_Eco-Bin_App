import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';

function Refund() {

    const navigation = useNavigation();

    // Sample data for refunds (date, type, weight)
    const refunds = [
        { date: '2024/9/2', type: 'E-Waste', weight: 2 },
        { date: '2024/10/2', type: 'E-Waste', weight: 2 },
        { date: '2024/9/2', type: 'E-Waste', weight: 2 },
        { date: '2024/10/2', type: 'E-Waste', weight: 2 },
        { date: '2024/9/2', type: 'E-Waste', weight: 2 },
        { date: '2024/10/2', type: 'E-Waste', weight: 2 },
        { date: '2024/10/2', type: 'E-Waste', weight: 2 }
    ];

    // Function to calculate refund (weight * 20)
    const calculateRefund = (weight) => {
        return weight * 20;
    };

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.TopBarContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={34} color="white" />
                </TouchableOpacity>
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar}>Recycable</Text>
                    <Text style={styles.TopBar1}>Refund</Text>
                </View>
            </View>
            <View style={styles.formbackground}>
            
            {/* Scrollable content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                {/* Refund Cards */}
                {refunds.map((refund, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date:</Text>
                            <Text style={styles.value}>{refund.date}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Type:</Text>
                            <Text style={styles.value}>{refund.type}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Weight:</Text>
                            <Text style={styles.value}>{refund.weight}kg</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Refund:</Text>
                            <Text style={styles.value}>{refund.weight}kg * 20 = {calculateRefund(refund.weight)}</Text>
                        </View>
                    </View>
                ))}
                </View>
            </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#6EC6B2',
    },
    TopBarContainer: {
        backgroundColor: '#6EC6B2',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        minHeight: 190,
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top:10
    },
    TopBar1: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top:10
       
    },
    topBarTextContainer: {
        flexDirection: 'column', // Ensure the text is displayed in a column
        alignItems: 'center',    // Center the text horizontally
        justifyContent: 'center',// Center the text vertically
        marginLeft:160,
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    formbackground:{
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 1.6 : 10,
    },
    formContainer:{
        paddingHorizontal: 5,
        paddingBottom:30,
        width: '100%',
        alignSelf: 'center',
        height:'100%'
    },
    scrollContainer: {
        paddingBottom: 30,  // Adds space at the bottom for better scrolling experience
    
    },
    card: {

        width:'88%',
        marginLeft: '6%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 17,
        color: '#333',
        fontWeight: '600',
    },
    value: {
        fontSize: 16,
        color: '#555',
    },
});

export default Refund;
