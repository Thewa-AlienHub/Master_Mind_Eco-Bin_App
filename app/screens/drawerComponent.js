import React, { useRef,useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet,Text ,Image,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../Utils/colors';
import { getAuth, signOut } from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {getStorage,ref,getDownloadURL} from 'firebase/storage';
import { storage } from '../config/DB_config';

const { width, height } = Dimensions.get('window');
const DrawerComponent = ({ navigation, drawer ,data}) => {

  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  useEffect(() => {
    // Fetch the image URL from Firebase
    const fetchProfileImage = async () => {
      try {
        if (data) {
          const storageRef = ref(storage,`gs://ecobin-ed682.appspot.com/profilepictures/${data?.data.FirstName}.jpeg`); // Adjust path if needed
          const url = await getDownloadURL(storageRef);
          setProfileImageUrl(url);
        }
      } catch (error) {
        console.error("Error fetching image URL: ", error);
      }
    };
    fetchProfileImage();
  }, [data]); 

    // Handle Logout
    const handleLogout = async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        console.log("User signed out!");
        navigation.navigate('Login'); // Navigate to login screen after logout
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    };





  return (
    <View style={styles.container}>
      <View style={styles.drawerTop}>
        <View style={styles.profile_container}>
        <Text style={styles.header}>Menu</Text>
        {/* Display the profile picture */}
        {profileImageUrl ? (
        <Image
          source={{ uri: profileImageUrl }}
          style={styles.profileImage}
        />
      ) : (
        
        <Text>Loading...</Text>
      )}
        </View>
        
        <View style={styles.notifycontainer}>
        <Text style={styles.Co_header}>Hi {data?.data.FirstName || 'User'},</Text>
        <Icon name="notifications-sharp" style={styles.icons}></Icon>
        <Icon name="settings-sharp" style={styles.icons}></Icon>
        </View>
        
      </View>
      <View style={styles.menuSidecontainer}>
          
          <View style={styles.menucontainer}>
            <TouchableOpacity onPress={() => drawer.current.closeDrawer()} style={styles.menuButtonContainer}>
            {data?.data.role === 'user' && (
              <View>
              <TouchableOpacity onPress={() => navigation.navigate('addRequest', { email:data?.data?.email })}>
                <View style={styles.iconTextRow}>
                <Icon name="create-sharp" style={{ fontWeight: 'bold', color: colors.white, fontSize: 30 }} />
                <Text style={styles.iconText}>Add Recycle Request</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('myRequest', { email:data?.data?.email })}>
                <View style={styles.iconTextRow}>
                <Icon name="create-sharp" style={{ fontWeight: 'bold', color: colors.white, fontSize: 30 }} />
                <Text style={styles.iconText}>My Request</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('refund', { email:data?.data?.email })}>
                <View style={styles.iconTextRow}>
                <Icon name="create-sharp" style={{ fontWeight: 'bold', color: colors.white, fontSize: 30 }} />
                <Text style={styles.iconText}>Refund</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('payment', { email:data?.data?.email })}>
                <View style={styles.iconTextRow}>
                <Icon name="create-sharp" style={{ fontWeight: 'bold', color: colors.white, fontSize: 30 }} />
                <Text style={styles.iconText}>Payment</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('addTenant',{email:data?.data?.email, data:data})}>
              <View style={styles.iconTextRow}>
                <Icon name="cash-outline" style={{fontWeight:'bold'}} size={27} color="black" />
                <Text style={styles.iconText}>Add Tenant</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('tenantsList',{email:data?.data?.email})}>
              <View style={styles.iconTextRow}>
                <Icon name="cash-outline" style={{fontWeight:'bold'}} size={27} color="black" />
                <Text style={styles.iconText}>Your Tenants</Text>
              </View>
              </TouchableOpacity>
              </View>
            )}
            {data?.data.role === 'admin' && (
              <View>
              <TouchableOpacity onPress={() => navigation.navigate('TableFull')}>
                <View style={styles.iconTextRow}>
                <Icon name="create-sharp" style={{ fontWeight: 'bold', color: colors.white, fontSize: 30 }} />
                <Text style={styles.iconText}>Tenant details</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('DriverMap')}>
              <View style={styles.iconTextRow}>
                <Icon name="cash-outline" style={{fontWeight:'bold'}} size={27} color="black" />
                <Text style={styles.iconText}>Driver Map</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('receivedRequest')}>
                <View style={styles.iconTextRow}>
                <Icon name="create-sharp" style={{ fontWeight: 'bold', color: colors.white, fontSize: 30 }} />
                <Text style={styles.iconText}>Received Request</Text>
                </View>
              </TouchableOpacity>
              </View>
            )}
            </TouchableOpacity>
            <View style={styles.logoutContainer}>
              <TouchableOpacity style={styles.logoutTouchable} onPress={handleLogout}>
                <Icon name="arrow-back-sharp" style={{ fontWeight: 'bold', color: colors.white, fontSize: 30 }} />
                <Text style={styles.logoutIconText}>Log Out</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.menuSidecontainer}>
                <View style={styles.backbuttoncontainer} >
                  <Icon name ="chevron-back-sharp" style={{fontSize:40,color:colors.white}} onPress={() => drawer.current.closeDrawer()}/>
                </View>
                <View style={styles.backbuttonSidecontainer} onPress={() => drawer.current.closeDrawer()}>

                </View>

          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.primary,
  },
  drawerTop: {
    backgroundColor: colors.primary,
    width: '100%',
    height: height * 0.25, // 25% of the screen height
  },
  profile_container: {
    marginTop: height * 0.05, // 5% of the screen height
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuSidecontainer: {
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: height * 0.07, // 7% of the screen height
    paddingLeft: width * 0.07, // 7% of the screen width
    fontSize: height * 0.045, // Responsive font size based on height
    fontWeight: "bold",
    color: colors.white,
  },
  Co_header: {
    paddingLeft: width * 0.07, // 7% of the screen width
    fontSize: height * 0.025, // Responsive font size based on height
    fontWeight: "bold",
    color: colors.white,
  },
  profileImage: {
    marginTop: height * 0.05, // 5% of the screen height
    marginLeft: width * 0.4, // Adjust based on screen width
    width: width * 0.2, // 20% of the screen width
    height: width * 0.2, // 20% of the screen width (keeping square ratio)
    borderRadius: (width * 0.2) / 2, // Make it circular
    borderWidth: 5,
    borderColor: colors.dark, // Optional: Add border color
  },
  icons: {
    fontSize: height * 0.035, // Adjust icon size based on height
    marginLeft: width * 0.02,
    color: colors.white,
  },
  backbuttoncontainer: {
    justifyContent: "center",
  },
  backbuttonSidecontainer: {
    backgroundColor: colors.white,
    height: height * 0.5, // 50% of the screen height
    width: width * 0.1, // 10% of the screen width
    alignSelf: "center",
    borderTopLeftRadius: height * 0.1, // Responsive based on height
    borderBottomLeftRadius: height * 0.1, // Responsive based on height
  },
  notifycontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.03, // 3% of the screen height
  },
  iconText: {
    fontSize: height * 0.03, // Responsive font size based on height
    marginLeft: width * 0.02,
    color: colors.white,
    fontWeight: "700",
    textDecorationLine: 'underline',
  },
  logoutIconText: {
    fontSize: height * 0.025, // Responsive font size based on height
    marginLeft: width * 0.05,
    color: colors.white,
    fontWeight: "700",
    
  },
  menucontainer: {
    height: height * 0.8 , // 90% of the screen height
    backgroundColor: colors.primary,
  },
  menuButtonContainer: {
    padding: height * 0.03, // 3% of the screen height
    paddingLeft: width * 0.07, // 7% of the screen width
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: colors.primary,
  },
  logoutContainer:{
   
    marginTop:height*0.3,
    marginLeft:width*0.2
  },
  logoutTouchable:{
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default DrawerComponent;
