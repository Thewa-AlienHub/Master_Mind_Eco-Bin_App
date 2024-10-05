import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView, ActivityIndicator, Image } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../../config/DB_config';
import colors from '../../../Utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';

function TableFull({ navigation }) {
    const { height } = useWindowDimensions();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const tenantsCollection = collection(DB, 'tenants');
                const querySnapshot = await getDocs(tenantsCollection);

                const emailSet = new Set();
                const uniqueTenants = [];

                querySnapshot.forEach((doc) => {
                    const [email] = doc.id.split('_');
                    if (!emailSet.has(email)) {
                        emailSet.add(email);
                        uniqueTenants.push({
                            id: doc.id,
                            email,
                            ...doc.data()
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

    // PDF Generation Function
    const fetchAndGeneratePDF = async () => {
        try {
            const tenantsCollection = collection(DB, 'tenants');
            const querySnapshot = await getDocs(tenantsCollection);

            const groupedTenants = {};

            querySnapshot.forEach((doc) => {
                const tenantData = {
                    id: doc.id,
                    ...doc.data()
                };

                // Separate email and nickname from tenant ID
                const [email, nickname] = tenantData.id.split('_'); // Assuming ID format is 'email_nickname'

                if (!groupedTenants[email]) {
                    groupedTenants[email] = [];
                }
                
                // Store tenant with its nickname
                groupedTenants[email].push({
                    id: nickname, // Use nickname as Tenant ID
                    name: tenantData.name, // Assuming there's a name field
                    Ad_Line1: tenantData.Ad_Line1,
                    Ad_Line2: tenantData.Ad_Line2, 
                    Ad_Line3: tenantData.Ad_Line3,
                    City : tenantData.City,
                    ZipCode: tenantData.ZipCode,

                });
            });

            const html = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            h1 { text-align: center; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        </style>
                    </head>
                    <body>
                        <h1>Tenant Report</h1>
                        <table>
                            <tr>
                                <th>Email</th>
                                <th>Nick Name</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Zip Code</th>
                            </tr>
                            ${Object.entries(groupedTenants).map(([email, tenantList]) => `
                                ${tenantList.map((tenant, index) => {
                                    // Combine address fields into one string, ignoring empty fields
                                    const combinedAddress = [
                                        tenant.Ad_Line1, 
                                        tenant.Ad_Line2, 
                                        tenant.Ad_Line3, 
                                    ].filter(Boolean).join(', ');
                            
                                    return `
                                        <tr>
                                            ${index === 0 ? `<td rowspan="${tenantList.length}">${email}</td>` : ''}
                                            <td>${tenant.id}</td>
                                            <td>${tenant.City}</td>
                                            <td>${combinedAddress}</td>
                                            <td>${tenant.ZipCode}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            `).join('')}
                            
                        </table>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });

            // Share the PDF
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('An error occurred while generating the PDF. Please try again.');
        }
    };
    
    
    

    return (
        <View style={styles.container}>
           
            <View style={styles.TopBarContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}  style={styles.backButtonContainer}>
                    <Icon name="arrow-back" size={34} color="white" />
                </TouchableOpacity>
                <Text style={styles.TopBar}>Your Tenants</Text>
            </View>

            <View style={styles.formbackground}>
                <ScrollView>
                    <View style={styles.formContainer}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    tenants.map((tenant) => (
                        <TouchableOpacity key={tenant.id} onPress={() => navigation.navigate('EmailWiseTable', { email: tenant.email })}>
                            <View style={styles.cardBody}>
                                <View style={styles.textBoxInCard}>
                                    <Text style={styles.email}>{tenant.email}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {/* Button to generate PDF */}
                <View style={styles.ButtonContainer}>
                            <TouchableOpacity style={styles.button} onPress={fetchAndGeneratePDF}>
                                <Text style={styles.buttonText}>Generate Report</Text>
                            </TouchableOpacity>
                        </View>
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

export default TableFull;
