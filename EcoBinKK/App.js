
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
import QrCodeHome from './app/screens/QrCodeHome';
import TableFull from './app/screens/AdminScreens/FullTable';
import EmailWiseTable from './app/screens/AdminScreens/EmailWiseTable';
import DriverMap from './app/screens/AdminScreens/DriverMap';
import HomeDataAdmin from './app/screens/AdminScreens/HomeDataAdmin';
import DoneScreen from './app/screens/DoneScreen';



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
        <Stack.Screen
          name='DoneScreen'
          component={DoneScreen}
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

        {/*Qr code */}
        <Stack.Screen
          name='QrCodeHome'
          component={QrCodeHome}
          options={{headerShown : false}}
        />
        {/*Admin */}
        <Stack.Screen
          name='TableFull'
          component={TableFull}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='EmailWiseTable'
          component={EmailWiseTable}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='DriverMap'
          component={DriverMap}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='HomeDataAdmin'
          component={HomeDataAdmin}
          options={{headerShown : false}}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}



