import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions, TouchableOpacity, Button, ActivityIndicator, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../../config/DB_config'; // Make sure this path is correct
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';

function EmailWiseTable({ route,navigation }) {
    const { height, width } = useWindowDimensions();
    const { email} = route.params; // Get the email from route params
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    

    
        const fetchDocuments = async () => {
            try {
                const tenantsCollection = collection(DB, 'tenants');
                const querySnapshot = await getDocs(tenantsCollection);
                const emailDocuments = [];

                querySnapshot.forEach((doc) => {
                    if (doc.id.startsWith(email + '_')) { // Check if the document ID starts with the email
                        emailDocuments.push({ id: doc.id, ...doc.data() });
                        
                    }
                });

                setDocuments(emailDocuments); // Store the documents in state
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false); // Set loading to false
            }
        };



    useFocusEffect(
        useCallback(()=>{
            fetchDocuments();
        })
    )


        // Separate tenants into three categories
        const homeTenants = documents.filter(tenant => tenant.type === 'Home');
        const eventTenants = documents.filter(tenant => tenant.type === 'Event');
        const residentTenants = documents.filter(tenant => tenant.type === 'Resident');


    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                    <Icon name="arrow-back" size={34} color="white" />
                </TouchableOpacity>
                <Text style={styles.TopBar}>Tenants</Text>
            </View>

            <View style={styles.formbackground}>
                <ScrollView>
                    <View style={styles.formContainer}>
            {homeTenants.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Houses</Text>
                        {homeTenants.map((doc) => (
                            <TouchableOpacity
                                key={doc.id}
                                onPress={() => navigation.navigate('HomeDataAdmin', { docId: doc.id })}
                            >
                                <View style={styles.cardBody}>
                                    <View style={styles.textBoxInCard}>
                                        <Text style={styles.cardText}>{doc.NickName}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}

            {eventTenants.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Events</Text>
                        {eventTenants.map((tenant) => (
                            <TouchableOpacity
                                key={tenant.id}
                                onPress={() => navigation.navigate('HomeDataAdmin', { docId: tenant.id })}
                            >
                                <View style={styles.cardBody}>
                                    <View style={styles.textBoxInCard}>
                                        <Text style={styles.cardText}>{tenant.NickName}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {/* Resident Tenants Section */}
                {residentTenants.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Residents</Text>
                        {residentTenants.map((tenant) => (
                            <TouchableOpacity
                                key={tenant.id}
                                onPress={() => navigation.navigate('HomeDataAdmin', { docId: tenant.id })}
                            >
                                <View style={styles.cardBody}>
                                    <View style={styles.textBoxInCard}>
                                        <Text style={styles.cardText}>{tenant.NickName}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
                </View>
                </ScrollView>
            </View>

               
    </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.primary,
    },
    TopBarContainer: {
        flex: 0.15,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 50,
        paddingHorizontal: 20,
    },
    TopBar: {
        fontSize: 36,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    backButtonContainer: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    formbackground: {
        backgroundColor: colors.white,
        flex: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2 : 20,
    },
    formContainer: {
        paddingHorizontal: 10,
        paddingBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#4A4A4A',
        marginVertical: 15,
        marginLeft: 15,
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: colors.primary,
        borderWidth: 1,
        padding: 15,
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 15,
        backgroundColor: colors.grey,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTextTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardText: {
        fontSize: 16,
        color: '#666',
    },
    ButtonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    button: {
        width: 250,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: colors.dark,
    },
    errorText: {
        textAlign: 'center',
        color: colors.red,
        fontSize: 18,
        marginTop: 20,
    },
});

export default EmailWiseTable;
