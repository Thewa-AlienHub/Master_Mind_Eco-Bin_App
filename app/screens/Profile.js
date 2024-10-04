import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image ,Dimensions } from 'react-native';
import MenuButton from '../Components/MenuButton';
import NotificationBell from '../Components/NotificationBell';
import colors from '../Utils/colors';
import { storage } from '../config/DB_config'; // Assuming this imports Firebase storage config
import { getDownloadURL, ref } from 'firebase/storage'; // Make sure to import these methods
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native';


const { width, height } = Dimensions.get('window');

const Profile = ({ drawer, data }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    // Fetch the image URL from Firebase
    const fetchProfileImage = async () => {
      try {
        if (data) {
          const storageRef = ref(storage, `gs://uee-project-mm.appspot.com/profilepictures/${data.data.FirstName}.jpeg`); // Adjust path if needed
          const url = await getDownloadURL(storageRef);
          setProfileImageUrl(url);
        }
      } catch (error) {
        console.error("Error fetching image URL: ", error);
      }
    };
    fetchProfileImage();
  }, [data]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <MenuButton color={colors.white} onPress={() => drawer.current.openDrawer()} />
          <NotificationBell color={colors.white} onPress={() => drawer.current.openDrawer()} />
          <View style={styles.logoContainer}>
            <Text style={styles.logotext}>Eco Bin</Text>
          </View>
        </View>
        <View style={styles.HeadertextContainer}>
          <Text style={styles.Headertext}>Owner Profile</Text>
        </View>
      </View>

      <View style={styles.detailTab}>
        <Text style={styles.detailHeader}>Personal Details</Text>
      </View>

      {/* Profile Image and Edit Icon */}
      <View style={styles.profileContainer}>
        {profileImageUrl ? (
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        ) : (
          <Image source={{ uri: 'https://example.com/placeholder-image.jpg' }} style={styles.profileImage} />
        )}
        <TouchableOpacity style={styles.editIconContainer}>
            <Icon name="create" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Personal Details */}
      <View style={styles.detailTextNameContainer}>
      <Text style={styles.detailTextName}>{data?.data?.FirstName || "First Name"}</Text>
      <Text style={styles.detailTextName}>{data?.data?.LastName || "Last Name"}</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} >
      <View style={styles.detailsCard}>
        <View style={styles.detailTextContainer}>
        <Text style={styles.label}>Email: </Text>
        <Text style={styles.detailText}>{data?.data?.email || "SasinduPraveen705@gmail.com"}</Text>
        </View>

        <View style={styles.detailTextContainer}>
        <Text style={styles.label}>Phone Number: </Text>
        <Text style={styles.detailText}>{data?.data?.ContactNum || "0765376635"}</Text>
        </View>

        <View style={styles.detailTextContainer}>
        <Text style={styles.label}>Apartment Address: </Text>
        <Text style={styles.detailText}>{data?.data?.Address || "Wallawaththa, Colombo 7"}</Text>
        </View>

        
        
        
        
      </View>

       {/* Edit Profile Button */}
       <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      </ScrollView>
      

     
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    height: height * 0.28,
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    backgroundColor:colors.lprimary,
    alignItems: 'center',
    height: height * 0.06,
    width: width * 0.6,
    borderTopLeftRadius: 20,
    marginTop: 20,
    marginLeft: 70
  },
  logotext: {
    fontSize: 30,
    color: colors.dark,
    fontWeight: 'bold',
  },
  HeadertextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  Headertext: {
    fontSize: 35,
    color: colors.white,
    fontWeight: 'bold',
  },
  detailTab: {
    backgroundColor: colors.dark,
    height: height * 0.05,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  detailHeader: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  detailTextNameContainer:{
    marginLeft: 30,
    marginTop: -70,
    width: width * 0.5,
    marginBottom: 30,
    

  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -40,
    marginLeft: 200,
  },
  profileImage: {
    width: width * 0.3,
    height: height * 0.15,
    borderRadius: 75,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: 5,
  },
  editIcon: {
    width: width * 0.1,
    height: height * 0.05,
  },
  detailsCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailTextContainer: {
    borderColor: colors.subitm,
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 10,
    width: width * 0.8,
    paddingLeft: 20,
  },
  detailTextName:{
    fontSize: 25,
    marginBottom: -5,
    fontWeight: 'bold',
    
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    alignItems:'flex-start'
  },
  editButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 100,
    marginTop: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginTop: -10,
    marginBottom: 80,
  },
  scrollContent: {
    paddingBottom: 0,
  },
});

export default Profile;
