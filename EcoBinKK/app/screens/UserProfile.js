import React, {useRef, useState,useEffect} from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,Image,TextInput,
  View,Platform,StatusBar,TouchableOpacity,
  ScrollView
} from 'react-native';
import colors from '../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, getDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

const UserProfile = ({route,navigation}) => {
  const { email } = route.params;
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('left');
  const [loading,setLoading] = useState(false)
  const [hasData, setHasData] = useState(false); 

  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    ContactNum: '',
    email: '',
    password: '',
    role: '',
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const docRef = doc(DB, "users", email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                // Create the combined address string
            } else {
                console.log('No file found');
            }
        } catch (error) {
            console.log('Error fetching', error);
        } finally {
            setLoading(false);
        }
    };
    fetchUserData();
}, [email]);

useEffect(() => {
  const checkData = async () => {
    try {
      const docRef = doc(DB, "tenants", email); // Reference to the document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHasData(true);
      } else {
        setHasData(false);
      }
      console.log('Has data:', hasData); // Log hasData for debugging
    } catch (error) {
      console.log('Error fetching document:', error);
      setHasData(false);
    }
  };

  checkData(); // Call the function on component mount or when `email` changes
}, [email]);

const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <View style={styles.drawerTop}>
        {/*this part is the green part on drawer navigation */}
      </View>
      <View>
      <TouchableOpacity onPress={() => drawer.current.openDrawer()} style={styles.menuButtonContainer}>
          
          <TouchableOpacity onPress={() => {
            if (hasData) {
              navigation.navigate('tenantsList', { email: email });
 // Navigate to ScreenA if condition is true
            } else {
                navigation.navigate('addTenant'); // Navigate to ScreenB if condition is false
            }
        }}>
            <View style={styles.iconTextRow}>
              <Icon name="arrow-back" size={34} color="black" />
              <Text style={styles.iconText}>Tenants</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('addTenant')}>
            <View style={styles.iconTextRow}>
              <Icon name="arrow-back" size={34} color="black" />
              <Text style={styles.iconText}>Test</Text>
            </View>
          </TouchableOpacity>

        </TouchableOpacity>
      </View>
    </View>
  );


    return (
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}>
        <ScrollView>
          <View style={styles.containerDown}>
          <View style={styles.TopBarContainer}>
            <View style={styles.backButton}>
              <TouchableOpacity onPress={()=>drawer.current.openDrawer()} style={[styles.backButtonContainer]}>
                  <Icon name="arrow-back" size={34} color="White" />
              </TouchableOpacity>
            </View>
            <Text style={styles.TopBar}>
                Welcome.!
            </Text>
        </View>
  
            <View style={styles.userImageContainer}>
              <Image source={require('../assets/user.png')} style={styles.userImage}/>
            </View>
  
            <View style={styles.labelBackground}>
              <View style={styles.LableContainer}>
                <Text style={styles.label}>First Name:</Text>
                <Text style={styles.labelData}>{userData.FirstName}</Text>
              </View>
            </View>
  
            <View style={styles.labelBackground}>
              <View style={styles.LableContainer}>
                <Text style={styles.label}>Last Name:</Text>
                <Text style={styles.labelData}>{userData.LastName}</Text>
              </View>
            </View>
  
            <View style={styles.labelBackground}>
              <View style={styles.LableContainer}>
                <Text style={styles.label}>Contact Number:</Text>
                <Text style={styles.labelData}>{userData.ContactNum}</Text>
              </View>
            </View>
  
            <View style={styles.labelBackground}>
              <View style={styles.LableContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.labelData}>{userData.email}</Text>
              </View>
            </View>
  
            <View style={styles.editButtonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={()=>navigation.navigate('editHomeProfile',{email:email})}> 
                <Text style={styles.buttonText}>Edit details</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.logoutButtonContainer}>
              <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </DrawerLayoutAndroid>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDown: {
    flex: 1,
    alignItems:'center',
  },
  TopBarContainer: {
    backgroundColor: '#00CE5E',
    flex: 0.12,
    width: '100%',
    borderBottomStartRadius:70,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 3 : 0,
    position: 'relative',
},
TopBar: {
    fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
    textAlign: 'center',
    fontSize:32,
    top:-20,
    color: colors.white,
    fontWeight:'bold',
},
backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
},
backButtonContainer: {
  flex: 1,
  padding: 10,  // Adjust padding as needed
  alignItems: 'center',
  justifyContent: 'center',
},


  navigationContainer: {
    paddingTop:0,
    alignItems:'flex-start',
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
  userImageContainer:{
    paddingTop:10,
  },
  userImage:{
    width:200,
    height:200,
  },
  LableContainer: {
    width:'100%',
    paddingTop: 10,

},
label: {
    paddingLeft: 20,
    paddingTop:0,
    fontSize: 30,
    color:'black',
    
},
labelData:{
    paddingLeft: 40,
    fontSize: 20,
    paddingTop:10,
    color:'white',
    paddingBottom:10,
},
labelBackground:{
  marginTop:10,
  width:'98%',
  backgroundColor:'grey',
  borderBottomStartRadius:30,
  borderBottomEndRadius:30,
  borderTopEndRadius:30,
  borderTopStartRadius:30,

},
inputBox: {
  height: 50,
  width:"90%",
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
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
      },
      scrollViewContainer: {
        flexGrow: 1,
        paddingBottom: 150,
        maxHeight: '150vh',
    },
  }),
  zIndex: 10,
},
cardContainer:{
  width:'100%',
  height:300,
  backgroundColor:'red',
},
drawerTop:{
  backgroundColor:'green',
  width:'100%',
  height:180
},
iconTextRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop:20,
  backfaceVisibility:'visible'
},
iconText: {
  fontSize: 30,
  marginLeft: 8,
  marginBottom:5,
  color: 'black',
},
menuButtonContainer: {
  padding: 20,   // Padding around the button
  flexDirection: 'column', // Ensures icon and text are placed in a row
  alignItems: 'flex-start', // Aligns them vertically in the center
},
editButton: {
  width: 320,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#00CE5E',
  borderRadius: 15,
},
logoutButton: {
  width: 200,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'red',
  borderRadius: 15,
},
buttonText: {
  color:colors.white,
  fontSize: 22,
  fontWeight:"bold",
},
editButtonContainer: {
  flex: 1,
  top: 40,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom:60,
},
logoutButtonContainer: {
  flex: 1,
  top: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom:60,
},



});

export default UserProfile;