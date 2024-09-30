import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../config/DB_config'; // Make sure this path is correct

function EmailWiseTable({ route }) {
    const { email } = route.params; // Get the email from route params
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchDocuments(); // Fetch the documents
    }, [email]);

    return (
        <ScrollView>
            <View style={styles.container}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    documents.map((doc) => (
                        <View key={doc.id} style={styles.documentContainer}>
                            <Text style={styles.documentText}>Nickname: {doc.NickName}</Text>
                        </View>
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
    documentContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    documentText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default EmailWiseTable;
