import React, {useRef, useState} from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,Image,TextInput,
  View,Platform,StatusBar,TouchableOpacity,
  ScrollView
} from 'react-native';
import colors from '../config/colors';
import  Icon  from 'react-native-vector-icons/Ionicons';

const UserProfile = ({navigation}) => {
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('left');
  

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <View style={styles.drawerTop}>
        {/*this part is the green part on drawer navigation */}
      </View>
      <View>
      <TouchableOpacity onPress={() => drawer.current.openDrawer()} style={styles.menuButtonContainer}>
          
          <TouchableOpacity onPress={() => navigation.navigate('addTenant')}>
            <View style={styles.iconTextRow}>
              <Icon name="menu" size={34} color="black" />
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
              <TouchableOpacity onPress={()=>drawer.current.openDrawer()} style={styles.backButtonContainer}>
                  <Icon name="menu" size={34} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.TopBar}>
                Welcome.!
            </Text>
        </View>


        <View style={styles.userImageContainer}>
          <Image source={require('../assets/user.png')}
          style={styles.userImage}/>
        </View>
        <View style={styles.labelBackground}>
          <View style={styles.LableContainer}>
              <Text style={styles.label}>Name :</Text>
              <Text style={styles.labelData}>KK Semasinghe</Text>
          </View>
        </View>
        <View style={styles.labelBackground}>
          <View style={styles.LableContainer}>
              <Text style={styles.label}>Name :</Text>
              <Text style={styles.labelData}>KK Semasinghe</Text>
          </View>
        </View>
        <View style={styles.labelBackground}>
          <View style={styles.LableContainer}>
              <Text style={styles.label}>Name :</Text>
              <Text style={styles.labelData}>KK Semasinghe</Text>
          </View>
        </View>
        <View style={styles.labelBackground}>
          <View style={styles.LableContainer}>
              <Text style={styles.label}>Name :</Text>
              <Text style={styles.labelData}>KK Semasinghe</Text>
          </View>
        </View>
        
        <View style={styles.editButtonContainer}>
            <TouchableOpacity style={styles.editButton} >
                <Text style={styles.buttonText}>Edit details</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.logoutButtonContainer}>
            <TouchableOpacity style={styles.logoutButton} >
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
    fontFamily: 'Arial',
},
backButton: {
    position: 'absolute',
    left: 10,
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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