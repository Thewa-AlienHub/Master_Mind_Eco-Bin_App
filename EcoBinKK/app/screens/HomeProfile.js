import React from 'react';
import { Text, View, Button, StyleSheet, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

function HomeProfile({ route, navigation }) {
    const { email } = route.params;
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
        const fetchHomeData = async () => {
            try {
                const docRef = doc(DB, "tenants", email);
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
    }, [email]);

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
                                <Button title='Back' onPress={() => navigation.navigate('addTenant')} />
                            </View>
                            <Text style={styles.TopBar}>Add Event</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Enter Details</Text>
                            <Text>Nick Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="House Nickname"
                                editable={false}
                                value={homeData.NickName}
                            />
                            {/* Combined address TextInput */}
                            <Text>Address</Text>
                            <TextInput
                                style={[styles.input, { height: 100 }]} // Larger height for multi-line input
                                placeholder="Address (Line 1, Line 2, Line 3, City)"
                                value={combinedAddress}
                                onChangeText={handleCombinedAddressChange}
                                multiline
                            />

                            <Text>Zip code</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Zip Code"
                                value={homeData.ZipCode}
                                onChangeText={(text) => setHomeData({ ...homeData, ZipCode: text })}
                            />

                            <Button
                            title='edit'
                            onPress={()=>(navigation.navigate('editHomeProfile', { email: email }))}
                            />
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
        justifyContent: "center",
        alignItems: "center",
    },
    scrollViewContainer: {
        flexGrow: 1,
        paddingBottom: 50,
        maxHeight: '105vh',
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
    TopBarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 0,
        position: 'relative',
    },
    TopBar: {
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 36 : 56,
        textAlign: 'center',
        fontWeight: "bold",
        color: "#4C6A92",
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});

export default HomeProfile;
