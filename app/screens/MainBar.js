import React, { useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  DrawerLayoutAndroid,
  Dimensions,
} from 'react-native';
import colors from '../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import DrawerComponent from './drawerComponent';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Login from './Login';
import MenuButton from '../Components/MenuButton'; // Import the externalized menu button
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const MainBar = ({ navigation, route }) => {
  const drawer = useRef(null);
  const  {data}  = route.params;

  const screenWidth = Dimensions.get('window').width;

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={screenWidth}
      drawerPosition="left"
      renderNavigationView={() => <DrawerComponent navigation={navigation} drawer={drawer} data = {data} />}
    >
      
      
      <Tab.Navigator
       screenOptions={{
        tabBarShowLabel: false,  // Removes the tab labels
        tabBarStyle: {
          position: 'absolute', // Makes the tab bar float
          bottom: 20,           // Distance from the bottom
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 15,
          backgroundColor: colors.white,
          height: 60,
          borderWidth: 0,
              
        },
        tabBarIconStyle: {
          borderWidth: 0,       // Ensures no border for tab icons
        },
      }}
      >
      <Tab.Screen
          name="Home"
          component={()=> <Home drawer={drawer}/>}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size ,focused}) => (
              <Icon name="home" color={focused ? colors.dark :colors.subitm2} size={30} />
            ),
          }}
         
        />
        <Tab.Screen
          name="Amenity_List"
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size ,focused}) => (
              <Icon name="newspaper-sharp" color={focused ? colors.dark :colors.subitm2} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Shopping_Cart"
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size ,focused}) => (
              <Icon name="cart-sharp" color={focused ? colors.dark :colors.subitm2} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={()=> <Profile drawer={drawer} data= {data}/>}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size ,focused}) => (
              <Icon name="person-sharp" color={focused ? colors.dark :colors.subitm2} size={30} />
            ),
          }}
        />
        
        
      </Tab.Navigator>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    shadowColor: colors.backgroundcolor1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  // Other styles remain the same
});

export default MainBar;
