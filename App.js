

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import MainBar from './app/screens/MainBar';
import SuccessScreen_03 from './app/screens/Thewan/SuccessScreen_03';
import ReportedList_03 from './app/screens/Thewan/ReportedList_03';
import RequestRecycle from './app/screens/Sasindu/RequestRecycle_01';
import MyRequest from './app/screens/Sasindu/MyRequest_01';
import Refund from './app/screens/Sasindu/Refund_01';
import Payment from './app/screens/Sasindu/Payment_01';
import AddCardDetails from './app/screens/Sasindu/AddCardDetails_01';
import ManageRequest from './app/screens/Sasindu/ManageRequest_01';
import ReceivedRequest from './app/screens/Sasindu/AdminSide_01/ReceivedRequest';
import ReceivedRequestView from './app/screens/Sasindu/AdminSide_01/ReceivedRequestView';
import SuccessScreen from './app/screens/SuccessScreen_01';

import AddTenant from './app/screens/KK/AddTenant_02';
import AddHome from './app/screens/KK/AddHome_02';
import AddResident from './app/screens/KK/AddResident_02';
import AddEvent from './app/screens/KK/AddEvent_02';
import HomeProfile from './app/screens/KK/HomeProfile_02';
import EditHomeProfile from './app/screens/KK/EditHomeProfile_02';
import TenantsList from './app/screens/KK/TenantsList_02';
import MapScreen from './app/screens/KK/MapScreen_02';
import SetMapPin from './app/screens/KK/setMapPin_02';
import QrCodeHome from './app/screens/KK/QrCodeHome_02';
import TableFull from './app/screens/KK/AdminScreens/FullTable_02';
import EmailWiseTable from './app/screens/KK/AdminScreens/EmailWiseTable_02';
import DriverMap from './app/screens/KK/AdminScreens/DriverMap_02';
import HomeDataAdmin from './app/screens/KK/AdminScreens/HomeDataAdmin_02';
import DoneScreen from './app/screens/KK/DoneScreen_02';


const Stack = createStackNavigator();

export default function App() {

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

      <Stack.Screen
          name='Login'
          component={Login}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='Signup'
          component={SignUp}
          options={{headerShown : false}}
        />
     
     <Stack.Screen
          name='MainBar'
          component={MainBar}
          options={{headerShown : false}}
        />

        <Stack.Screen
                  name='Success_03'
                  component={SuccessScreen_03}
                  options={{headerShown : false}}
                />

      <Stack.Screen
          name='Success_03'
          component={SuccessScreen_03}
          options={{headerShown : false}}
        />
       
        

        {/*KK */}
        <Stack.Screen
          name='addTenant'
          component={AddTenant}
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
        {/*Sasindu*/}
        <Stack.Screen
          name='addRequest'
          component={RequestRecycle}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='myRequest'
          component={MyRequest}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='manageRequest'
          component={ManageRequest}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='payment'
          component={Payment}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='refund'
          component={Refund}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='receivedRequest'
          component={ReceivedRequest}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='receivedRequestView'
          component={ReceivedRequestView}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='addCardDetails'
          component={AddCardDetails}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='success'
          component={SuccessScreen}
          options={{headerShown : false}}
        />
        

        {/*KK */}
        <Stack.Screen
          name='addTenant'
          component={AddTenant}
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
        {/*Sasindu*/}
        <Stack.Screen
          name='addRequest'
          component={RequestRecycle}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='myRequest'
          component={MyRequest}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='manageRequest'
          component={ManageRequest}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='payment'
          component={Payment}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='refund'
          component={Refund}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='receivedRequest'
          component={ReceivedRequest}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='receivedRequestView'
          component={ReceivedRequestView}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='addCardDetails'
          component={AddCardDetails}
          options={{headerShown : false}}
        />
        <Stack.Screen
          name='success'
          component={SuccessScreen}
          options={{headerShown : false}}
        />
        
      </Stack.Navigator>
    </NavigationContainer>

  );
}



