
import AddTenant from './app/screens/AddTenant';
import AddHome from './app/screens/AddHome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddResident from './app/screens/AddResident';
import AddEvent from './app/screens/AddEvent';
import HomeProfile from './app/screens/HomeProfile';
import Navi from './app/screens/Navi';
import EditHomeProfile from './app/screens/EditHomeProfile';



const Stack = createStackNavigator();

export default function App() {

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='navi'>
        <Stack.Screen
          name='addTenant'
          component={AddTenant}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='navi'
          component={Navi}
          options={{headerShown : false}}
        />


        <Stack.Screen
          name='addHome'
          component={AddHome}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='editHomeProfile'
          component={EditHomeProfile}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='addResident'
          component={AddResident}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='addEvent'
          component={AddEvent}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='homeProfile'
          component={HomeProfile}
          options={{headerShown : false}}
        />
        
      </Stack.Navigator>
    </NavigationContainer>

  );
}



