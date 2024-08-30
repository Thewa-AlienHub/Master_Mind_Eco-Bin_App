import React from 'react';
import { useState } from 'react';
import { View,Text,StyleSheet,Platform,StatusBar, Button } from 'react-native';

function Navi({navigation}) {

    const [nickName, setNickName] = useState('kk');
    return (
        <View>
        <View style={styles.TopBarContainer}>
        <Text style={styles.TopBar}>App</Text>
        </View>
        <View style={styles.ButtonContainer}>

        <Button
          title='Tenants'
          onPress={()=>navigation.navigate('addTenant')}
        />
        <Button
          title='profile'
          onPress={()=>(navigation.navigate('homeProfile',{nickName:nickName}))}
        />
        </View>
      
      </View>
    );
}
const styles = StyleSheet.create({
    TopBar: {
      fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 36 : 56,
      textAlign: 'center',
      fontWeight: "bold",
      color: "#4C6A92",
  },
  TopBarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight*2 : 0,
    position: 'relative',
  },
  ButtonContainer:{
    justifyContent:'center',
    alignItems:'center'
  }
  })

export default Navi;