import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, useWindowDimensions, TextInput, Platform, StatusBar, TouchableOpacity, Alert } from 'react-native';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, addDoc, getDocs,setDoc, doc } from "firebase/firestore"; 
import { DB } from '../../config/DB_config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

function RequestRecycle({ navigation, route}) {

    const [tenants, setTenants] = useState([]);
    const { email } = route.params || {};
    console.log('Received email addRequestPage:', email); // For debugging purposes
    
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const querySnapshot = await getDocs(collection(DB, "tenants")); // Fetch all documents in the tenants collection
                const matchingTenants = []; // Array to store matching tenants

                // Loop through documents to find all with the same email part before the underscore
                querySnapshot.forEach((doc) => {
                    const [docEmailPart] = doc.id.split('_'); // Get the part before the underscore
                    if (docEmailPart === email) {
                        matchingTenants.push({ id: doc.id, ...doc.data() }); // Add the found tenant's data to the array
                    }
                });

                setTenants(matchingTenants); // Set the array of matching tenants

                // If there are matching tenants, set the address to the nickname of the first matching tenant
                if (matchingTenants.length > 0) {
                    setSelectedNickname(matchingTenants[0].NickName); // Set the address to the tenant's nickname
                }
            } catch (error) {
                console.error("Error fetching tenants:", error);
            }
        };

        fetchTenants();
    }, [email]);
    
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    const [selectedNickname, setSelectedNickname] = useState(''); // Pre-fill with signup address if available
    const [pickupDate, setPickupDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [type, setType] = useState('');
    const [note, setNote] = useState('');
    const [formattedDate, setFormattedDate] = useState('Select Date'); // Initial placeholder text
    const [errors, setErrors] = useState({});  // New state for handling errors

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || pickupDate;
        setShowDatePicker(Platform.OS === 'ios');
        setPickupDate(currentDate);
        setFormattedDate(currentDate.toDateString()); // Format and set the date string
    };

    const showDatePickerHandler = () => {
        setShowDatePicker(true);
    };

    const validateFields = () => {
        const newErrors = {};
        
        if (!selectedNickname) {
            newErrors.selectedNickname = "Address is required";
        }

        if (formattedDate === 'Select Date') {
            newErrors.pickupDate = "Pickup date is required";
        }

        if (!type) {
            newErrors.type = "Recycle type is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const docId = `${email}_${selectedNickname}`; // Create document ID
    console.log(docId);

    const addRequest = async () => {
    if (validateFields()) {
        try {
            await addDoc(collection(DB, "recycleRequest"), {
                selectedNickname: selectedNickname,
                pickupDate: formattedDate,
                type: type,
                note: note,
                email: email
            });
            Alert.alert(
                "Success",
                "Your recycle request has been added successfully!",
                [{ text: "OK", onPress: () => navigation.navigate('addRequest', { email }) }]
            );
            // Clear form fields
            setSelectedNickname('');
            setPickupDate(new Date());
            setFormattedDate('Select Date'); // Reset date placeholder text
            setType('');
            setNote('');
        } catch (error) {
            console.error("Error creating request: ", error);
            Alert.alert("Error", "There was a problem adding your request. Please try again.");
        }
    }
};

    
    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                        <Icon name="arrow-back" size={34} color="white" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.topBarTextContainer}>
                    <Text style={styles.TopBar}>Recycle</Text>
                    <Text style={styles.TopBar1}>Request</Text>
                </View>
            </View>
            <View style={styles.formbackground}>
            <View style={isMobile ? styles.formContainer : styles_web.formContainer}>
                <View style={isMobile ? null : styles_web.form}>
                    <View style={styles.addressLabelContainer}>
                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>House ID :</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedNickname}
                                onValueChange={(itemValue) => setSelectedNickname(itemValue)}
                                style={errors.nickname ? styles.pickerError : styles.picker}
                            >
                                <Picker.Item label="Select a house nickname" value="" />
                                {tenants.map((tenant) => (
                                    <Picker.Item key={tenant.id} label={tenant.NickName} value={tenant.NickName} />
                                ))}
                            </Picker>
                            {errors.nickname && <Text style={styles.errorText}>{errors.nickname}</Text>}
                        </View>


                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Pickup Date :</Text>
                        </View>
                        <TouchableOpacity onPress={showDatePickerHandler} style={[styles.datePickerContainer, errors.pickupDate && styles.datePickerError]}>
                            <View style={styles.datePickerContent}>
                                <Text style={[styles.dateText, { color: formattedDate === 'Select Date' ? '#A7A7A7' : 'black' }]}>{formattedDate}</Text>
                                <Icon name="calendar" size={24} color='#6EC6B2' style={styles.calendarIcon} />
                            </View>
                        </TouchableOpacity>
                        {errors.pickupDate && <Text style={styles.errorText}>{errors.pickupDate}</Text>}

                        {showDatePicker && (
                            <DateTimePicker
                                value={pickupDate}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}

                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Recycle Type :</Text>
                        </View>
                        <View style={[styles.pickerContainer, errors.type && styles.pickerError]}>
                            <Picker
                                selectedValue={type}
                                onValueChange={(itemValue) => setType(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a recycle type" value="" />
                                <Picker.Item label="Paper" value="Paper" />
                                <Picker.Item label="Plastic" value="Plastic" />
                                <Picker.Item label="Glass" value="Glass" />
                                <Picker.Item label="Metal" value="Metal" />
                                <Picker.Item label="Organic" value="Organic" />
                            </Picker>
                        </View>
                        {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Note :</Text>
                        </View>
                        <TextInput
                            value={note}
                            onChangeText={(text) => setNote(text)}
                            style={[styles.inputBox, errors.note && styles.inputError]}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        overflow: 'auto',
        backgroundColor: '#6EC6B2',
    },
    TopBarContainer: {
        backgroundColor: '#6EC6B2',
        flex: 0.15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
        position: 'relative',
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top:-7
    },
    TopBar1: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        fontSize: 41,
        color: colors.white,
        fontWeight: 'bold',
        top:-10
       
    },
    topBarTextContainer: {
        flexDirection: 'column', // Ensure the text is displayed in a column
        alignItems: 'center',    // Center the text horizontally
        justifyContent: 'center',// Center the text vertically
        marginLeft:190,
    },
    backButton: {
        position: 'absolute',
        left: 12,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    formbackground:{
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
    },
    formContainer: {
        position: 'absolute',
        width: '100%',
        top:25
    },
    LableContainer: {
        paddingTop: 9,
    },
    label: {
        paddingLeft: 20,
        fontSize: 21,
        color: 'black',
    },
    addressLabelContainer: {
        paddingTop: 10,
        margin: 15,
    },
    ButtonContainer: {
        flex: 1,
        top: 30,
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
     datePickerError: {
        borderColor: 'red', // error border color
    },
    datePickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 17,
        flex: 1,
    },
    calendarIcon: {
        marginLeft: 10,
    },
    inputBox: {
        height: 50,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        borderColor: '#6EC6B2',
        fontSize: 18,
        borderRadius: 10,
        backgroundColor: '#E6E6E6',
    },
    pickerContainer: {
        margin: 12,
        borderWidth: 2,
        borderColor: '#6EC6B2',
        borderRadius: 10,
        backgroundColor: '#E6E6E6',
        overflow: 'hidden', // Ensure the border radius is applied
    },
    picker: {
        height: 50,
        width: '100%', // Make sure it takes the full width
    },
    pickerError: {
        borderColor: 'red',
    },
    
    button: {
        width: 325,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6EC6B2',
        borderRadius: 15,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        paddingLeft: 20,
        fontSize: 14,
    },
    inputError: {
        borderColor: 'red',
    },
});

export default RequestRecycle;
