

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import MainBar from "./app/screens/MainBar";
import QRCodeScannerScreen from "./app/screens/Pradi/QRCodeScannerScreen_04";
import QrDemo from "./app/screens/Pradi/QrDemo_04";
import ScanHistoryScreen from "./app/screens/Pradi/ScanHistoryScreen_04";
import ReportViewScreen from "./app/screens/Pradi/ReportViewScreen_04";
import SuccessScreen from "./app/screens/Pradi/SuccessScreen_04";
import RecycleForm from "./app/screens/Pradi/RecycleForm_04";

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
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RecycleForm"
          component={RecycleForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QRCodeScannerScreen"
          component={QRCodeScannerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={ScanHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReportView"
          component={ReportViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QrDemo"
          component={QrDemo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}



