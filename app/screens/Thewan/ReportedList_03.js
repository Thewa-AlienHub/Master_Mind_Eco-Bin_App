import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView, ActivityIndicator, Dimensions, Modal, Button } from 'react-native';
import { ref, set, onValue } from 'firebase/database';
import { setDoc, doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import MenuButton from '../../Components/MenuButton';
import colors from '../../Utils/colors';
import { database, onValueDB, DB } from '../../config/DB_config';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

const ReportedList_03 = ({ drawer }) => {
  const navigation = useNavigation();
  const [alertStatus, setAlertStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAlertStatus, setFilteredAlertStatus] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportedList, setReportedList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [teamNo, setTeamNo] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(""); 



  useEffect(() => {
    setLoading(true);
    const alertStatusRef = ref(database, 'garbagebin/thewan123@gmailcom_Test01/AlertStatus');

    
    onValue(alertStatusRef, async (snapshot) => {
      const data = snapshot.val();
      setAlertStatus(data || []);
      console.log(data); 

      
      if (data) {
        try {
          await updateAlertStatus(data);
          await fetchReportedLists();
        } catch (error) {
          console.error('Failed to update alert status:', error);
        }
      } else {
        await fetchReportedLists();
      }
    });
  }, []);

  const updateAlertStatus = async (data) => {
    const alertStatusAlterRef = doc(DB, 'GarbageBins/thewan123@gmail.com_Test01');

    try {
      await updateDoc(alertStatusAlterRef, { AlertStatus: data });
      console.log('Data successfully inserted into garbageBin');
    } catch (error) {
      console.error('Error inserting data into Garbage Bin:', error);
    }
  };

  const fetchReportedLists = async () => {
    

    const ReportedList = collection(DB, 'GarbageBins');
    const penaltyListRef = collection(DB, 'penaltyList');

    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    const sevenDaysAgoTimestamp = sevenDaysAgo.getTime();

    const q1 = query(ReportedList, where('AlertStatus', 'in', [1, 2]));
    const q2 = query(ReportedList, where('LastCollectedDate', '<', sevenDaysAgo));
    const q3 = query(ReportedList, where('CollectingStatus', '==', 'Pending'));

    try {
      const [snapshot1, snapshot2, snapshot3] = await Promise.all([getDocs(q1), getDocs(q2), getDocs(q3)]);

      const fetchedData = {};

      snapshot1.forEach((doc) => {
        fetchedData[doc.id] = { id: doc.id, ...doc.data() };
      });

      snapshot2.forEach((doc) => {
        fetchedData[doc.id] = { id: doc.id, ...doc.data() };
      });

      snapshot3.forEach((doc) => {
        fetchedData[doc.id] = { id: doc.id, ...doc.data() };
      });

      const filteredData = Object.values(fetchedData).filter(
        (item) => (item.AlertStatus === 1 || item.AlertStatus === 2) && new Date(item.LastCollectedDate.seconds * 1000) < sevenDaysAgo
      );

      for (const item of filteredData) {
        const docRef = doc(penaltyListRef, item.id);
        await setDoc(docRef, item);
      }

      const pendingItems = Object.values(fetchedData).filter((item) => item.CollectingStatus === 'Pending');
      setReportedList(Object.values(pendingItems));

      console.log('Merged Reported List Data:', Array.from(fetchedData));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from GarbageBins:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    if (Array.isArray(reportedList)) {
      const filteredData = reportedList.filter(
        (item) => item.id.toString().includes(text.toString()) || item.AlertStatus.toString().includes(text)
      );
      setFilteredAlertStatus(filteredData);
    }
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmit = async () => {
    const itemsToSubmit = reportedList.filter((item) => selectedItems.includes(item.id));
    const collectingListRef = collection(DB, 'CollectingList');
    const garbageBinsRef = collection(DB, 'GarbageBins');

    try {
      for (const item of itemsToSubmit) {
        const tenantDocRef = doc(DB, 'tenants', item.id);
        const tenantSnapshot = await getDoc(tenantDocRef);

        if (tenantSnapshot.exists()) {
          const tenantData = tenantSnapshot.data();

          const garbageBinDocRef = doc(garbageBinsRef, item.id);
          await setDoc(garbageBinDocRef, {
            ...item,
            CollectingStatus: 'Assigned',
          }, { merge: true });

          const docRef = doc(collectingListRef, item.id);
          await setDoc(docRef, {
            ...item,
            tenantDetails: tenantData,
            CollectingStatus: 'Assigned',
            teamNo: selectedTeam,
          });

          navigation.navigate("Success_03");
        } else {
          console.error(`Tenant with id ${item.id} not found.`);
        }
      }
      console.log('Items added to Collecting List and CollectingStatus updated successfully!');
    } catch (error) {
      console.error('Error processing items:', error);
    }

    setSelectedItems([]);
    setShowPopup(false);
  };

  const renderPopup = () => {
    return (
      <Modal 
        transparent={true} 
        animationType="slide" 
        visible={showPopup} 
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Team Number</Text>
          <Picker
          selectedValue={selectedTeam}
          style={styles.modalInput}
          onValueChange={(itemValue) => setSelectedTeam(itemValue)}
        >
          <Picker.Item label="Select Team" value="" />
          <Picker.Item label="Team 01" value="Team01" />
          <Picker.Item label="Team 02" value="Team02" />
          <Picker.Item label="Team 03" value="Team03" />
          {/* Add more teams as needed */}
        </Picker>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setShowPopup(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleAssignCollection = () => {
    if (selectedItems.length > 0) {
      setShowPopup(true); 
      setErrorMessage(''); 
    } else {
      setErrorMessage("You're not selected any House");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading</Text>
        </View>
      ) : (
        <>
          <View style={styles.TopBarContainer}>
            <Text style={styles.TopBar}>Reported {'\n'}          List</Text>
          </View>
          <View style={styles.listContainer}>
            <View style={styles.headerlistContainer}>
              <MenuButton color={colors.dark} onPress={() => drawer.current.openDrawer()} />
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search List..."
                  placeholderTextColor={colors.subitm}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>
            </View>

            <ScrollView style={styles.listView}>
              {searchQuery.length > 0 && filteredAlertStatus.length > 0 ? (
                filteredAlertStatus.map((item) => (
                  <View key={item.id} style={[
                    styles.itemBoxoverlap, 
                    {
                      backgroundColor: 
                        selectedItems.includes(item.id)
                          ? colors.primary 
                          : (item.AlertStatus === 1 || item.AlertStatus === 2) 
                            ? colors.red 
                            : colors.grey 
                    } 
                  ]} >
                    <View key={item.id} style={[
                    styles.itemBox, 
                    { backgroundColor: selectedItems.includes(item.id) ? colors.grey : colors.grey } 
                  ]}>
                      <TouchableOpacity onPress={() => handleSelectItem(item.id)}>
                      <Text style={[styles.itemHeader,{ color: selectedItems.includes(item.id) ? colors.dark : 'black' }]}>{item.id}</Text>
                      <Text style={styles.itemAlertText}>
                        {item.AlertStatus === 1 
                          ? 'Bin Status: Exceeded 80%' 
                          : item.AlertStatus === 2 
                            ? 'Bin Status: Full' 
                            : 'Bin Status: Not Filled yet'}
                      </Text>
                      <Text style={styles.itemText}>
                        
                      Last Collected: {new Date(item.LastCollectedDate.seconds * 1000).toLocaleString()} 

                      </Text>
                    </TouchableOpacity>
                    </View>
                    
                  </View>
                ))
              ) : reportedList.length > 0 ? (
                reportedList.map((item) => (
                  <View key={item.id} style={[
                    styles.itemBoxoverlap, 
                    {
                      backgroundColor: 
                        selectedItems.includes(item.id)
                          ? colors.primary 
                          : (item.AlertStatus === 1 || item.AlertStatus === 2) 
                            ? colors.red 
                            : colors.grey 
                    } 
                  ]} >
                    
                    <View key={item.id} style={[
                        styles.itemBox, 
                        { backgroundColor: selectedItems.includes(item.id) ? colors.grey : colors.grey } 
                      ]}>
                    <TouchableOpacity onPress={() => handleSelectItem(item.id)}>
                      <Text style={[styles.itemHeader,{ color: selectedItems.includes(item.id) ? colors.dark : 'black' }]}>{item.id}</Text>
                      <Text style={styles.itemAlertText}>
                        {item.AlertStatus === 1 
                          ? 'Bin Status: Exceeded 80%' 
                          : item.AlertStatus === 2 
                            ? 'Bin Status: Full' 
                            : 'Bin Status: Not Filled yet'}
                      </Text>
                      <Text style={styles.itemText}>
                        
                      Last Collected: {new Date(item.LastCollectedDate.seconds * 1000).toLocaleString()} 

                      </Text>
                    </TouchableOpacity>
                  </View>
                  </View>
                ))
              ) : (
                <Text>No data found</Text>
              )}
            
            </ScrollView>
            {renderPopup()}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleAssignCollection}>
                <Text style={styles.submitButtonText}>Assign Collection</Text>
              </TouchableOpacity>
              {errorMessage.length > 0 && (
                <Text style={styles.errorMessage}>{errorMessage}</Text> 
              )}
            </View>
            

            
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.primary,
  
  },
  TopBarContainer: {
      width: '95%',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 1.7: 70,
  },
  TopBar: {
      fontSize: 42,
      color: colors.white,
      fontWeight: 'bold',
      alignItems:"flex-end",
  },
  formContainer: {
      marginTop: 5,
      paddingHorizontal: 20,
      width: '95%',
      alignSelf: 'center',
  },
  formbackground: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 60,
      borderTopRightRadius: 60,
      marginTop: height * 0.22,
      height: height * 0.6,
      width: '100%',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2: 30,
  },
  
  loadingText:{
      color:colors.dark,
      fontSize:30,
      textAlign:"center"
  },
  loadingContainer:{
     margin: 100,
     marginTop:300,
     justifyContent:"center",
     backgroundColor:colors.white,
     padding:20,
     borderRadius:20,
        
  },
  listContainer:{
        backgroundColor:colors.white,
        width:'100%',
        alignSelf:'center',
        height:height*0.9,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
        marginTop:10,
       
        paddingHorizontal:20,
  },
  listView:{
    width:'100%',
    padding:5,

  },
  headerlistContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
   

  },
  searchContainer: {
    paddingHorizontal: 10,
    marginTop: 30,
    width: '85%',
    
  },
  searchInput: {
    
    padding: 10,
    borderRadius: 40,
    color: colors.dark,
    fontSize: 18,
    width: '100%',
    borderColor: colors.dark,
    borderWidth: 2,
    
  },
  modalContainer: {
   flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius:50,
    height:height*0.8,
    margin:50,
    marginVertical:200,
},
modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.white,
    fontWeight:"bold",
},

itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
itemBox: {
    backgroundColor: colors.grey, 
    padding: 15,
       
    borderRadius: 30,
    shadowColor: colors.subitm,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
       
},
itemBoxoverlap:{
 backgroundColor: colors.grey, 
    paddingRight: 10,
    paddingHorizontal : 0,
    marginVertical:5,   
    borderRadius: 30,
    shadowColor: colors.subitm,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal:width*0.001,
    marginHorizontal:5,   
},
itemAlertText: {
    marginTop: 5,
    color: colors.red,
},
itemText: {
  marginTop: 5,
  color: colors.black,
},
buttonContainer: {
    marginTop: 10,
    marginBottom: height * 0.2,
    alignItems: 'center',  
},
submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
},
submitButtonText: {
    color: colors.white,
    fontSize: 18,
},
itemHeader:{
  fontSize:16,
  fontWeight:"bold",
},
modalButtonContainer:{
  flexDirection: 'row',
},
modalButton:{
  borderRadius:30,
  margin:20,
},
modalInput: {
  width: '80%',
  height: 50,
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 30, 
  paddingHorizontal: 15,
  marginBottom: 20, 
  backgroundColor: 'white', 
},
modalButtonContainer: {
  width: '80%', 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
},
modalButton: {
  flex: 1, 
  height: 50,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 5, 
},

cancelButton: {
  backgroundColor: '#FF3D00', 
},
buttonText: {
  color: 'white', 
  fontSize: 16,
},
 
});


export default ReportedList_03;
