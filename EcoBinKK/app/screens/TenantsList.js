import React, { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions, TouchableOpacity, Button, ActivityIndicator, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../config/DB_config';
import colors from '../config/colors';

function TenantsList({ navigation, route }) {
    const { height, width } = useWindowDimensions();
    const [tenants, setTenants] = useState([]); // Modify state to store an array of tenant objects
    const [loading, setLoading] = useState(true);
    const { email } = route.params; // Retrieve email from route params
    

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const querySnapshot = await getDocs(collection(DB, "tenants")); // Fetch all documents in the tenants collection
                const matchingTenants = []; // Array to store matching tenants

                // Loop through documents to find all with the same email part before the underscore
                querySnapshot.forEach((doc) => {
                    const [docEmailPart] = doc.id.split('_'); // Get the part before the underscore
                    if (docEmailPart === email) {
                        matchingTenants.push({ id: doc.id, ...doc.data() }); // Add the found tenant's data to the array
                    }
                });

                setTenants(matchingTenants); // Set the array of matching tenants
            } catch (error) {
                console.error("Error fetching tenants:", error);
            } finally {
                setLoading(false); // Stop loading once data is fetched
            }
        };

        fetchTenants();
    }, [email]);

    // Loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading Tenants...</Text>
            </View>
        );
    }

    return (

        <View style={styles.container}>
            <ScrollView style={{height:height-150}}>
            <View style={styles.TopBarContainer}>
                <View style={styles.backButton}>
                    <Button title='back' onPress={() => navigation.goBack()} />
                </View>
                <Text style={styles.TopBar}>Your Tenants</Text>
            </View>

            {/* Display all tenants' details */}
            {tenants.length > 0 ? (
                tenants.map((tenant) => {
                    const docId = `${email}_${tenant.NickName}`; // Create docId for each tenant
                    return (
                        <TouchableOpacity
                            key={tenant.id} // Add key for each item in the list
                            onPress={() => navigation.navigate('homeProfile', { docId})} // Use the constructed docId
                        >
                            <View style={styles.cardBody}>
                                <View style={styles.textBoxInCard}>
                                    <Text style={styles.cardText}>Name: {tenant.NickName}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <Text style={styles.errorText}>No tenants found for this email. Choose another one.</Text>
            )}

            </ScrollView>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('addTenant', { email: email })}>
                    <Text style={styles.buttonText}>ADD Tenant</Text>
                </TouchableOpacity>
            </View>
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

export default TenantsList;
