import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet ,TouchableOpacity,Button,StatusBar,useWindowDimensions} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config'; // Make sure this path is correct
import colors from '../../config/colors';

function TableFull({navigation}) {
    const { height, width } = useWindowDimensions();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log('full table');
    
    

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const tenantsCollection = collection(DB, 'tenants');
                const querySnapshot = await getDocs(tenantsCollection);

                // Create a Set to store unique emails
                const emailSet = new Set();
                const uniqueTenants = [];

                querySnapshot.forEach((doc) => {
                    const [email] = doc.id.split('_'); // Extract the email part before '_'
                    if (!emailSet.has(email)) {
                        emailSet.add(email); // Add email to the Set
                        uniqueTenants.push({
                            id: doc.id,
                            email, 
                            ...doc.data() // Spread the document data
                        });
                    }
                });

                setTenants(uniqueTenants);
            } catch (error) {
                console.error('Error fetching tenants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenants();
    }, []);

    

    return (
            <View style={styles.container}>
        <ScrollView style={{ height: height - 150 }}>
                <View style={styles.TopBarContainer}>
                    <View style={styles.backButton}>
                        <Button title='Back' onPress={() => navigation.goBack()} />
                    </View>
                    <Text style={styles.TopBar}>Tenant Owners</Text>
                </View>
                
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    tenants.map((tenant) => (
                        <TouchableOpacity  key={tenant.id} onPress={() => navigation.navigate('EmailWiseTable', { email: tenant.email })}>
                        <View style={styles.cardBody}>
                            <View style={styles.textBoxInCard}>
                            <Text style={styles.email}>{tenant.email}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                    ))
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
        paddingTop: StatusBar.currentHeight ,
        position: 'relative',
    },
    TopBar: {
        marginTop: 20,
        fontSize: 30 ,
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
        top:  StatusBar.currentHeight ,
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

export default TableFull;
