
import AddTenant from './app/screens/AddTenant';
import AddHome from './app/screens/AddHome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddResident from './app/screens/AddResident';
import AddEvent from './app/screens/AddEvent';
import HomeProfile from './app/screens/HomeProfile';
import Navi from './app/screens/Navi';
import EditHomeProfile from './app/screens/EditHomeProfile';
import UserProfile from './app/screens/UserProfile';
import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import TenantsList from './app/screens/TenantsList';
import MapScreen from './app/screens/MapScreen';
import SetMapPin from './app/screens/setMapPin';



const Stack = createStackNavigator();

export default function App() {

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
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
          name='Signup'
          component={SignUp}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='userProfile'
          component={UserProfile}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='Login'
          component={Login}
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
        <Stack.Screen
          name='tenantsList'
          component={TenantsList}
          options={{headerShown : false}}
        />

        {/*map screens*/}
        <Stack.Screen
          name='Map'
          component={MapScreen}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='SetMapPin'
          component={SetMapPin}
          options={{headerShown : false}}
        />
        
      </Stack.Navigator>
    </NavigationContainer>

  );
}



