import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions, TouchableOpacity, Button, ActivityIndicator, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config'; // Make sure this path is correct
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../config/colors';

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
            <ScrollView style={{ height: height - 150 }}>
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

               
        
</ScrollView>
    </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    TopBarContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        position: 'relative',
    },
    TopBar: {
        marginTop: 20,
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        textAlign: 'center',
        color: colors.white,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        marginTop: 20,
        textAlign: 'center',
    },
    cardBody: {
        marginTop: 10,
        alignItems: 'center',
    },
    textBoxInCard: {
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 10,
        width: '95%',
        justifyContent: 'center',
        flexDirection: 'column',
        height: 80,
        marginBottom: 20,
    },
    cardText: {
        fontSize: 18,
        color: colors.dark,
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.dark,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: colors.white,
    },
    errorText: {
        fontSize: 18,
        color: colors.white,
        textAlign: 'center',
    },
    ButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        width: 320,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CE5E',
        borderRadius: 15,
        marginBottom: 30,
    },
    buttonText: {
        color: colors.white,
        fontSize: 22,
        fontWeight: "bold",
    },
});

export default EmailWiseTable;
