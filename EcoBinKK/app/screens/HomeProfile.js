import React from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform,useWindowDimensions, TextInput, ScrollView } from 'react-native';
import colors from '../config/colors';
import { useState,useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

function HomeProfile({route,navigation}) {
    const {nickName} = route.params;
    const{width,height} = useWindowDimensions();
    const isMobile = width <600;

    const [homeData, setHomeData] = useState({
        AD_Line1:'',
        AD_Line2:'',
        AD_Line3:'',
        City : '',
        ZipCode:'',
    });

    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchHomeData = async () => {
            try {
                const docRef = doc(DB,"tenants","house_"+nickName);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setHomeData(docSnap.data());
                } else {
                    console.log('No file founded')
                }
            } catch (error) {
                console.log('Error fetch', error)
            }finally{
                setLoading(false);
            }
        };
        fetchHomeData();
    },[nickName])

    return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
        {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <>
                <View style={styles.TopBarContainer}>
                    <View style={styles.backButton}>
                        <Button title='back' onPress={()=>navigation.navigate('addTenant')}/>
                    </View>
                    <Text style={styles.TopBar}>
                        Home Profile
                    </Text>
                </View>
                <View style={isMobile? null:styles_web.formContainer}>
                    <View style={isMobile? null:styles_web.form}>

                        <View style={styles.LableContainer}>
                            <Text style={styles.label}>Nick Name :</Text>
                        </View>

                        <TextInput
                            style={styles.inputBox}
                            placeholder="useless placeholder"
                            value={nickName}
                        />
                        <View style={styles.addressLabelContainer}>
                            <Text style={{ fontSize: 30 }}>Address</Text>
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>Address Line 1 :</Text>
                            </View>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="useless placeholder"
                                value={homeData.AD_Line1}
                            />
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>Address Line 2 :</Text>
                            </View>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="useless placeholder"
                                value={homeData.AD_Line2}
                            />
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>Address Line 3 :</Text>
                            </View>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="useless placeholder"
                                value={homeData.AD_Line3}
                            />
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>City :</Text>
                                
                            </View>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="useless placeholder"
                                value={homeData.City}
                            />
                            <View style={styles.LableContainer}>
                                <Text style={styles.label}>Zip Code :</Text>
                            </View>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="useless placeholder"
                                value={homeData.ZipCode}
                            />
                        </View>
                        <View style={styles.QrCodeButtonContainer}>
                            <Button title='Generate QR Code'></Button>
                        </View>
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
        width: '100%',
        overflow: 'auto',

    },
    scrollViewContainer: {
        flexGrow: 1,
        paddingBottom: 50,
        maxHeight: '105vh',
    },
    TopBarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight*2 : 0,
        position: 'relative',
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        textAlign: 'center',
        color: colors.black,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    LableContainer: {
        paddingTop: 10,
    },
    label: {
        paddingLeft: 20,
        fontSize: 24,
    },
    addressLabelContainer: {
        paddingTop: 10,
        margin: 15,
        borderWidth: 2,
        borderColor: 'red',
    },
    QrCodeButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
    },
    inputBox: {
        height: 50,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        backgroundColor: colors.light,
        borderColor: colors.dark,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 25,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 100 },
                shadowOpacity: 1,
                shadowRadius: 2,
            },
            web: {
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',

            },
        }),
        zIndex: 10,
    },
});

const styles_web = StyleSheet.create({
    formContainer:{
        justifyContent:'center',
        alignItems:'center'
    },
  form:{
    alignContent:'center',
    width: "70%",
  }
})

export default HomeProfile;
