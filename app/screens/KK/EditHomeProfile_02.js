import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../Utils/colors';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DB } from '../../config/DB_config';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

function EditHomeProfile({ route, navigation }) {
  const { docId } = route.params;
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [homeData, setHomeData] = useState({
    NickName: '',
    Ad_Line1: '',
    Ad_Line2: '',
    Ad_Line3: '',
    City: '',
    ZipCode: '',
    date: new Date(), // Initialize date
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const docRef = doc(DB, "tenants", docId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
  
          // Check if the date exists before trying to access it
          const fetchedDate = data.date 
            ? (data.date instanceof Date ? data.date : new Date(data.date.seconds * 1000)) 
            : new Date(); // Default to the current date if no date is found
  
          setHomeData({
            ...data,
            date: fetchedDate, // Ensure it's a Date object
          });
        } else {
          console.log('No file found');
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, [docId]);
  

  const handleInputChange = (field, value) => {
    setHomeData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(DB, "tenants", docId);
      await updateDoc(docRef, homeData);
      alert('Data updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Error updating document:', error);
      alert('Failed to update data');
    }
  };

  const navChoose = () => {
    navigation.navigate('SetMapPin', {
        ID: docId,
        onLocationChosen: () => setIsLocationSet(true),
    });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || homeData.date;
    setShowDatePicker(false); // Close the picker after selecting
    setHomeData(prevState => ({
      ...prevState,
      date: currentDate
    }));
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || homeData.date;

    // If a time is selected, we want to combine the existing date with the new time
    const newDate = new Date(homeData.date); // Create a copy of the existing date
    newDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0); // Set new time

    setShowTimePicker(false); // Close the picker after selecting
    setHomeData(prevState => ({
      ...prevState,
      date: newDate // Update with the new date and time
    }));
  };

  return (
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <Text>Please wait...</Text>
          </View>
        ) : (
          <>
            <View style={styles.TopBarContainer}>
              <View style={styles.backButton}>
                                <TouchableOpacity onPress={() => navigation.goBack()}  style={styles.backButtonContainer}>
                                    <Icon name="arrow-back" size={34} color="white" />
                                </TouchableOpacity>
              </View>
                            <Text style={styles.TopBar}>Add Event</Text>
            </View>

            <View style= {styles.formbackground}>
                        <ScrollView>
                            <View style={styles.formContainer}>
                <View style={styles.LableContainer}>
                  <Text style={styles.label}>Nick Name :</Text>
                </View>
                <TextInput
                  value={homeData.NickName}
                  onChangeText={(text) => handleInputChange('NickName', text)}
                  style={styles.inputBox}
                  placeholder="Nick Name"
                />

                <View style={styles.addressLabelContainer}>
                  <Text style={{ fontSize: 30 }}>Address</Text>

                  {['Ad_Line1', 'Ad_Line2', 'Ad_Line3', 'City', 'ZipCode'].map((field, idx) => (
                    <View key={idx}>
                      <View style={styles.LableContainer}>
                        <Text style={styles.label}>{field.replace('_', ' ')} :</Text>
                      </View>
                      <TextInput
                        value={homeData[field]}
                        onChangeText={(text) => handleInputChange(field, text)}
                        style={styles.inputBox}
                        placeholder={field.replace('_', ' ')}
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.ButtonContainer}>
                  <TouchableOpacity style={styles.buttonMap} onPress={navChoose}>
                    <Text style={styles.buttonText}>
                      {isLocationSet ? 'Done' : 'Change pin'}
                    </Text>
                    {isLocationSet && (
                      <Icon name="checkmark-circle" size={24} color="green" style={styles.iconRight} />
                    )}
                  </TouchableOpacity>
                </View>

                {homeData.type === 'Event' && (
                  <>
                    <View style={styles.dateTimeContainer}>
                      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.buttonDateTime}>
                        <Text style={styles.buttonText}>Pick Date</Text>
                      </TouchableOpacity>
                      <Text style={styles.dateText}>{homeData.date.toDateString()}</Text>

                      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.buttonDateTime}>
                        <Text style={styles.buttonText}>Pick Time</Text>
                      </TouchableOpacity>
                      <Text style={styles.dateText}>{homeData.date.toLocaleTimeString()}</Text>

                      {showDatePicker && (
                        <DateTimePicker
                          value={homeData.date}
                          mode="date"
                          display="default"
                          onChange={onDateChange}
                        />
                      )}

                      {showTimePicker && (
                        <DateTimePicker
                          value={homeData.date}
                          mode="time"
                          display="default"
                          onChange={onTimeChange}
                        />
                      )}
                    </View>
                  </>
                )}

                <View style={styles.ButtonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
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
  buttonDateTime: {
      width: 200,
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
  dateTimeContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditHomeProfile;
