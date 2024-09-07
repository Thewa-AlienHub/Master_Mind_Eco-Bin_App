import React from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform, useWindowDimensions,TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { DB } from '../config/DB_config';
import colors from '../config/colors';

function HomeProfile({ route, navigation }) {
    const { docId } = route.params;
    const { width, height } = useWindowDimensions();
    const isMobile = width < 600;

    const [homeData, setHomeData] = useState({
        NickName:'',
        AD_Line1: '',
        AD_Line2: '',
        AD_Line3: '',
        City: '',
        ZipCode: '',
    });

    const [combinedAddress, setCombinedAddress] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(docId);
        const fetchHomeData = async () => {
            try {
            
                const docRef = doc(DB, "tenants", docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setHomeData(data);
                    // Create the combined address string
                    setCombinedAddress(`${data.AD_Line1}\n${data.AD_Line2}\n${data.AD_Line3}\n${data.City}`);
                } else {
                    console.log('No file found');
                }
            } catch (error) {
                console.log('Error fetching', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, [docId]);

    const handleCombinedAddressChange = (text) => {
        // Split the combined text back into individual address lines and city
        const addressParts = text.split('\n');
        setCombinedAddress(text);

        // Update individual address fields based on the input
        setHomeData({
            AD_Line1: addressParts[0] || '',
            AD_Line2: addressParts[1] || '',
            AD_Line3: addressParts[2] || '',
            City: addressParts[3] || '',
            ZipCode: homeData.ZipCode,  // Keep ZipCode unchanged
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <Text>Please wait</Text>
                    </View>
                ) : (
                    <>
                  
                        <View style={styles.TopBarContainer}>
                            <View style={styles.backButton}>
                                <Button title='Back' onPress={() => navigation.goBack()} />
                            </View>
                            <Text style={styles.TopBar}>{homeData.NickName} Profile</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.labelBackground}>
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>First Name:</Text>
                                <Text style={styles.labelData}>{homeData.NickName}</Text>
                            </View>
                            </View>

                            <View style={styles.labelBackground}>
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>Address:</Text>
                                <Text style={styles.labelData}>{combinedAddress}</Text>
                            </View>
                            </View>
                            
                            <View style={styles.labelBackground}>
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>Address:</Text>
                                <Text style={styles.labelData}>{homeData.ZipCode}</Text>
                            </View>
                            </View>
                            
                        
                            <View style={styles.editButtonContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={()=>navigation.navigate('editHomeProfile')}> 
                                <Text style={styles.buttonText}>Edit details</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    scrollViewContainer: {
        flexGrow: 1,
        maxHeight: '105vh',
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
    formContainer: {
        width: "80%",
        paddingTop: 50,
    },
    formTitle: {
        fontSize: 24,
        marginBottom: 30,
        color: "#4C6A92",
    },
    input: {
        fontSize: 16,
        borderColor: "#6EC6B2",
        borderWidth: 1,
        marginBottom: 30,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    loaderContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    editButton: {
        width: 320,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CE5E',
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

    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    backButtonContainer: {
        flex: 1,
        padding: 10,  // Adjust padding as needed
        alignItems: 'center',
        justifyContent: 'center',
      },
});

export default HomeProfile;
