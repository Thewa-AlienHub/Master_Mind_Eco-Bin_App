import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';
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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <Text>Please wait...</Text>
          </View>
        ) : (
          <>
            <View style={styles.TopBarContainer}>
              <View style={styles.backButton}>
                <Button title='back' onPress={() => navigation.navigate('addTenant')} />
              </View>
              <Text style={styles.TopBar}>Edit details</Text>
            </View>

            <View style={[styles.formContainer, !isMobile && styles_web.formContainer]}>
              <View style={!isMobile && styles_web.form}>
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
                      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.button}>
                        <Text style={styles.buttonText}>Pick Date</Text>
                      </TouchableOpacity>
                      <Text style={styles.dateText}>{homeData.date.toDateString()}</Text>

                      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.button}>
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
    alignItems: 'center',
    width: '100%',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  TopBarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
    backgroundColor: '#00CE5E',
    borderBottomStartRadius: 70,
    position: 'relative',
  },
  TopBar: {
    fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 36 : 56,
    color: colors.white,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  formContainer: {
    width: '80%',
    paddingTop: 50,
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
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  ButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  dateTimeContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#009644',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonMap: {
    backgroundColor: '#00CE5E',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateText: {
    margin: 12,
    fontSize: 16,
  },
  iconRight: {
    marginLeft: 5,
  },
});

export default EditHomeProfile;
