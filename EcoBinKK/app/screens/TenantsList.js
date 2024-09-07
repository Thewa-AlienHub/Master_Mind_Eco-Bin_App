import React, { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';
import colors from '../config/colors';

function TenantsList({ navigation, route }) {
    const { height, width } = useWindowDimensions();
    const [tenants, setTenants] = useState(null); // Modify state to store a single tenant object
    const [loading, setLoading] = useState(true); // Loading state
    const { email } = route.params; // Retrieve email from route params

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const docRef = doc(DB, "tenants", email); // Directly reference the document by its ID (which is the email)
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTenants({ id: docSnap.id, ...docSnap.data() }); // Save the tenant's data to state
                } else {
                    console.error("No such tenant document!");
                }
            } catch (error) {
                console.error("Error fetching tenant:", error);
            } finally {
                setLoading(false); // Stop loading once data is fetched
            }
        };

        fetchTenant();
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
            <View style={styles.TopBarContainer}>
                <View style={styles.backButton}>
                    <Button title='back' onPress={() => navigation.goBack()} />
                </View>
                <Text style={styles.TopBar}>Your Tenants</Text>
            </View>

            {/* Display tenant's details */}
            {tenants ? (
                <TouchableOpacity
                    onPress={() => navigation.navigate('homeProfile', { email: email })}
                >
                    <View style={styles.cardBody}>
                        <View style={styles.textBoxInCard}>
                            <Text style={styles.cardText}>Name: {tenants.NickName}</Text>
                        </View>
                        
                    </View>
                </TouchableOpacity>
            ) : (
                <Text style={styles.errorText}>No tenant found for this email.</Text>
            )}

            <View style={styles.ButtonContainer}>
                <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('addTenant',{email:email})}>
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
        marginTop:20,
        fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
        textAlign: 'center',
        color: colors.white,
    },
    cardBody:{
        marginTop:30,
        alignItems:'center',
    },
    textBoxInCard: {
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 10,
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: 200,
        marginBottom: 20, // Add space between cards
    },
    cardText: {
        fontSize: 18,
        color: colors.dark,
        marginBottom: 10,
    },
    resident: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginLeft: 20,
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
        marginBottom:20,
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
        color:colors.white,
        fontSize: 22,
        fontWeight:"bold",
    },
});

export default TenantsList;
