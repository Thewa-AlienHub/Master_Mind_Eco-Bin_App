import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet ,TouchableOpacity} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config'; // Make sure this path is correct

function TableFull({navigation}) {
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
        <ScrollView>
            <View style={styles.container}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    tenants.map((tenant) => (
                        <TouchableOpacity  key={tenant.id} onPress={() => navigation.navigate('EmailWiseTable', { email: tenant.email })}>
                        <View style={styles.tenantContainer}>
                            <Text style={styles.email}>{tenant.email}</Text>
                        </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    tenantContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    email: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TableFull;
