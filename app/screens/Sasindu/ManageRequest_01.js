import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, StatusBar, Alert, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

function ManageRequest({ route, navigation }) {
    const [tenants, setTenants] = useState([]);
    const { email } = route.params || {};
    const request = route.params?.request || {};
    const [selectedNickname, setSelectedNickname] = useState(request.selectedNickname || '');
    const [pickupDate, setPickupDate] = useState(request.pickupDate || new Date().toDateString());
    const [type, setType] = useState(request.type || '');
    const [note, setNote] = useState(request.note || '');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formattedDate, setFormattedDate] = useState(pickupDate);
    const status = request.status || 'Pending';
    
    // State for available addresses
    const [addresses, setAddresses] = useState([]);
    
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const querySnapshot = await getDocs(collection(DB, "tenants"));
                const matchingTenants = [];
                
                querySnapshot.forEach((doc) => {
                    const [docEmailPart] = doc.id.split('_');
                    if (docEmailPart === email) {
                        matchingTenants.push({ id: doc.id, ...doc.data() });
                    }
                });

                setTenants(matchingTenants);

                // Set selectedNickname based on request data
                if (matchingTenants.length > 0) {
                    const initialNickname = request.selectedNickname || matchingTenants[0].NickName;
                    setSelectedNickname(initialNickname); // Correctly set the selectedNickname
                }
            } catch (error) {
                console.error("Error fetching tenants:", error);
            }
        };

        fetchTenants();
    }, [email, request]);
    

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(pickupDate);
        setShowDatePicker(Platform.OS === 'ios');
        setPickupDate(currentDate.toDateString());
        setFormattedDate(currentDate.toDateString());
    };

    const showDatePickerHandler = () => {
        setShowDatePicker(true);
    };

    const updateRequest = async () => {
        if (status !== 'Pending') {
            Alert.alert(`Action Restricted`, `Cannot update. Current status: ${status}`);
            return;
        }

        // Ensure all fields are filled
        if (!selectedNickname || !formattedDate || !type || !note) {
            Alert.alert("Missing Fields", "Please fill in all fields.");
            return;
        }

        try {
            const requestRef = doc(DB, "recycleRequest", request.id);
            await updateDoc(requestRef, {
                selectedNickname,
                pickupDate: formattedDate,
                type,
                note
            });
            Alert.alert("Success", "The recycle request has been updated successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Error updating request: ", error);
            Alert.alert("Error", "There was a problem updating your request. Please try again.");
        }
    };

    const deleteRequest = async () => {
        if (status !== 'Pending' && status !== 'Rejected') {
            Alert.alert(`Action Restricted`, `Cannot delete. Current status: ${status}`);
            return;
        }

        try {
            const requestRef = doc(DB, "recycleRequest", request.id);
            await deleteDoc(requestRef);
            Alert.alert("Success", "The recycle request has been deleted successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Error deleting request: ", error);
            Alert.alert("Error", "There was a problem deleting your request. Please try again.");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Accepted':
                return styles.statusAccepted;
            case 'Rejected':
                return styles.statusRejected;
            default:
                return styles.statusPending;
        }
    };

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
                    <Text style={styles.TopBar}>{type}</Text>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
            </View>
            <View style={styles.formbackground}>
            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">

                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Your Request Is </Text>
                    <View style={styles.statusContainer}>
                        <Text style={getStatusStyle(status)}>
                            {status}
                        </Text>
                    </View>
                </View>
                <View style={{top:26}}>
                        <View style={styles.LabelContainer}>
                            <Text style={styles.label}>House ID :</Text>
                        </View>
                        <View style={styles.pickerContainer1}>
                        <Picker
                            selectedValue={selectedNickname}
                            onValueChange={(itemValue) => setSelectedNickname(itemValue)}           
                            >
                                <Picker.Item label="Select a house nickname" value={setSelectedNickname}   style={styles.picker}/>
                                    {tenants.map((tenant) => (
                                <Picker.Item key={tenant.id} label={tenant.NickName} value={tenant.NickName} />
                                        ))}
                        </Picker>
                        </View>
                        <View style={styles.LabelContainer}>
                            <Text style={styles.label}>Pick Up Date :</Text>
                        </View>
                        <TouchableOpacity onPress={showDatePickerHandler} style={styles.datePickerContainer}>
                            <View style={styles.datePickerContent}>
                                <Text style={styles.dateText1}>{formattedDate}</Text>
                                <Icon name="calendar" size={24} color='#6EC6B2' style={styles.calendarIcon} />
                            </View>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={new Date(pickupDate)}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                        <View style={styles.LabelContainer}>
                            <Text style={styles.label}>Waste Type :</Text>
                        </View>
                        
                        <View style={styles.pickerContainer1}>
                        <Picker
                                selectedValue={type}
                                onValueChange={(itemValue) => setType(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a recycle type" value={setType} />
                                <Picker.Item label="Paper" value="Paper" />
                                <Picker.Item label="Plastic" value="Plastic" />
                                <Picker.Item label="Glass" value="Glass" />
                                <Picker.Item label="Metal" value="Metal" />
                                <Picker.Item label="Organic" value="Organic" />
                            </Picker>

                            </View>

                        <View style={styles.LabelContainer}>
                            <Text style={styles.label}>Note :</Text>
                        </View>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            style={styles.inputBox}
                            placeholder="Enter note"
                            multiline // Enable multiline input for note
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={updateRequest}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteRequest}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </ScrollView>
            </View>
        </KeyboardAvoidingView>
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
        alignItems: 'center',
        position: 'relative',
        minHeight: 190,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 35,
    },
    TopBar: {
        fontSize: 38,
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
    },
    dateText: {
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
        paddingBottom: 30, // Added padding to avoid keyboard overlap
    },
    formbackground:{
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
    },
    LableContainer: {
        paddingTop: 20,
    },
    label: {
        paddingLeft: 20,
        fontSize: 20,
        color: 'black',
    },
    inputBox: {
        height: 50,
        margin: 20,
        borderWidth: 2,
        padding: 10,
        borderColor: '#6EC6B2',
        borderRadius: 10,
        fontSize: 16,
        backgroundColor:'#E6E6E6'
    },
    pickerContainer1: {
        margin: 15,
        borderWidth: 2,
        borderColor: '#6EC6B2',
        borderRadius: 10,
        backgroundColor: '#E6E6E6',
        overflow: 'hidden', // Ensure the border radius is applied
        height:51
    },
    picker: {
        width: '100%', // Make sure it takes the full width
    },
    dateText1: {
        fontSize: 16,
        color: '#000',
    },
    datePickerContainer: {
        height: 50,
        margin: 19,
        borderWidth: 2,
        padding: 10,
        borderColor: '#6EC6B2',
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor:'#E6E6E6'
    },
    datePickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    calendarIcon: {
        marginLeft: 'auto',
    },
    pickerContainer: {
        flexDirection: 'row', // Arrange items in a row
        alignItems: 'center', // Align items vertically in the center
        marginHorizontal: 87,
        marginBottom: 14,
        top:15
    },
    pickerLabel: {
        fontSize: 18,
        color: 'black',
        fontWeight:'bold'
    },
    statusAccepted: {
        color: '#00CE5E', // Green for accepted
        fontSize: 17,
        fontWeight: 'bold',
    },
    statusRejected: {
        color: '#FF6347', // Red for rejected
        fontSize: 17,
        fontWeight: 'bold',
    },
    statusPending: {
        color: '#000', // Default color for pending
        fontSize: 17,
        fontWeight: 'bold',
    },
    statusAccepted: {
        color: '#5ce65c', // Green for accepted
        fontSize: 17,
        fontWeight: 'bold',
    },
    statusRejected: {
        color: 'red', // Red for rejected
        fontSize: 17,
        fontWeight: 'bold',
    },
    statusPending: {
        color: '#000', // Default color for pending
        fontSize: 17,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center', // to center the buttons within the parent
    },
    button: {
        flex: 1, // Make buttons flexible to fit in the row
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6EC6B2',
        borderRadius: 15,
        marginHorizontal: 5, // Add some space between buttons
    },
    deleteButton: {
        backgroundColor: '#FF6347', // A red color for delete button
    },
    buttonText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ManageRequest;
