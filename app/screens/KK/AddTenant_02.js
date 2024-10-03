import React from 'react';
import { View, Text, Platform, StyleSheet, SafeAreaView, StatusBar,useWindowDimensions, Image, Button, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { useEffect } from 'react';

function AddTenant({navigation,route}) {
    const{email} = route.params;
    const {height,width} = useWindowDimensions();
    let cardComponents;
    const isMobileView = width < 600;

    useEffect(() => {
        console.log(email);
    }, [email]);

    if (Platform.OS === 'web') {
        cardComponents=(

        <View style={[isMobileView ? styles.cardContainer : styles_web.cardContainer,{height : height-100}]}>
            
            <View style={isMobileView ? styles.cardBody :styles_web.cardBody}>
            <TouchableOpacity onPress={() => {
                                        console.log('Navigating to AddHome with email:', email);  // Debug log
                                        navigation.navigate('addHome', { email: email });
                                    }}>    
                    <View>
                        <Image source={require('../assets/house.png')}
                                style={isMobileView ? styles.house : styles_web.house}/>
                    </View>
                    <View style={isMobileView ? styles.textBoxInCard :styles_web.cardText}>
                        <Text style={{fontSize:isMobileView ? 30 : 40}}>Add Home</Text>
                        <Text> </Text>
                        <Text style={{fontSize:isMobileView ? 15 : 20}}>Add event to the system</Text>
                        <Text style={{fontSize:isMobileView ? 15 : 20}}>to collect your trash</Text>
                    </View>
                </TouchableOpacity>
            </View>


            

            <View style={isMobileView ? styles.cardBody :styles_web.cardBody}>
                <TouchableOpacity onPress={()=>navigation.navigate('addEvent')}>
                    <View>
                        <Image source={require('../assets/event.png')}
                                        style = {isMobileView ? styles.event:styles_web.event}/>
                    </View>

                    <View style={isMobileView ? styles.textBoxInCard :styles_web.cardText}>
                        <Text style={{fontSize:40}}>Add Event</Text>
                        <Text></Text>
                        <Text style={{fontSize:isMobileView ? 15 : 20}}>Add Resident to the system</Text>
                        <Text style={{fontSize:isMobileView ? 15 : 20}}>and generate a QR code</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        );
        
    } else {
        cardComponents = (

            <View style={[styles.cardContainer,{height : height-StatusBar.currentHeight}]}>
                <TouchableOpacity onPress={()=>navigation.navigate('addHome',{email: email})}>
                    <View style={styles.cardBody}>
                            <View style = {styles.textBoxInCard}>
                                <Text style={{fontSize:30}}>Add Home</Text>
                                <Text> </Text>
                                <Text style={{fontSize:15}}>Add event to the system</Text>
                                <Text style={{fontSize:15}}>to collect your trash</Text>
                            </View>
                            <View>
                                <Image source={require('../assets/house.png')}
                                        style = {styles.house}/>
                            </View>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={()=>navigation.navigate('addResident',{email: email})}>
                    <View style={styles.cardBody}>
                            <View style = {styles.textBoxInCard}>
                                <Text style={{fontSize:30}}>Add Resident</Text>
                                <Text></Text>
                                <Text style={{fontSize:15}}>Add Resident to the system</Text>
                                <Text style={{fontSize:15}}>and generate a QR code</Text>
                            </View>
                            <View>
                                <Image source={require('../assets/resident.png')}
                                        style = {styles.resident}/>
                            </View>
                    </View>
                </TouchableOpacity>
                    
                <TouchableOpacity onPress={()=>navigation.navigate('addEvent',{email: email})}>
                    <View style={styles.cardBody}>
                            <View style = {styles.textBoxInCard}>
                                <Text style={{fontSize:30}}>Add Event</Text>
                                <Text></Text>
                                <Text style={{fontSize:15}}>Add a event to the system</Text>
                                <Text style={{fontSize:15}}>to collect your trash</Text>
                            </View>
                            <View>
                                <Image source={require('../assets/event.png')}
                                            style = {styles.event}/>
                            </View>
                    </View>
                </TouchableOpacity>
                    
            </View>
        );

    
    }

    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <View style = {styles.backButton}>
                    <Button title='back' onPress={()=>navigation.goBack()}/>
                </View>
                <Text style={styles.TopBar}>
                    Add Tenants
                </Text>
            </View>
            <View>{cardComponents}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor : colors.dark, 
       width : '100%'
    },
    TopBarContainer: {
        width: '100%', // Makes the container span the full width of the screen
        flexDirection : 'row',
        justifyContent: 'center', // Centers content vertically (won't affect due to lack of height control)
        alignItems: 'center', // Centers content horizontally
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        position : 'relative',
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40, // Adjusts font size based on platform
        textAlign: 'center',
        color : colors.white,
    },
    cardContainer:{
        flexDirection : 'column',
        justifyContent : 'space-evenly',
        alignItems : 'center',
    },
    cardBody:{
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 10,
        width: '95%',
        alignItems: 'center', // Centers text inside the card
        flexDirection : 'row',
        justifyContent: 'center', 
        height : 200
    },

   textBoxInCard:{
        width: 200,
        justifyContent : 'center',
        alignItems : 'center',
    },
    house:{
        width : 150,
        height : 150,
    },
    resident:{
        width : 140,
        height : 140,
    },
    event:{
        width : 130,
        height : 180,
    },
    backButton : {
        position: 'absolute', // Allows absolute positioning inside the TopBarContainer
        left: 10, // Moves it to the left edge
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
    

});

const styles_web = StyleSheet.create({
    cardContainer: {
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    cardBody: {
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 10,
        width:'31%' ,
        flexDirection: 'column', // Ensures the elements are arranged vertically
        justifyContent: 'center', // Centers content vertically
        alignItems: 'center', // Centers content horizontally
        height: 500,
    },
    cardText:{
        justifyContent:'center',
        alignItems:'center',
    },
    house: {
        width: 300,
        height: 300,
    },
    resident: {
        width: 290,
        height: 290,
    },
    event: {
        width: 280,
        height: 330,
    },
});


export default AddTenant;
