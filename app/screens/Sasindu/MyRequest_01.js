import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Platform, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Added useFocusEffect
import { collection, getDocs } from 'firebase/firestore'; 
import { DB } from '../../config/DB_config'; 
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';

function MyRequest({ route }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigation = useNavigation();

    const { email } = route.params || {}; 
    console.log('Received email myRequestPage:', email);

    // Fetch requests function moved outside useEffect
    const fetchRequests = useCallback(async () => {
        try {
            const requestsRef = collection(DB, "recycleRequest");
            const querySnapshot = await getDocs(requestsRef);

            // Filter requests by document ID matching the email pattern
            const filteredRequests = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(request => request.email === email); // Match documents with the email directly

            setRequests(filteredRequests); // Set the fetched requests
            console.log('Fetched requests:', filteredRequests); // Debugging log
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false); // Stop the loading spinner after fetching
        }
    }, [email]);

    useEffect(() => {
        if (email) {
            fetchRequests(); // Fetch requests initially when component mounts
        }
    }, [email, fetchRequests]);

    // Refetch requests whenever this screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (email) {
                setLoading(true); // Show loading spinner during refetch
                fetchRequests();   // Refetch requests
            }
        }, [email, fetchRequests])
    );

    // If no email is passed, don't render the component
    if (!email) {
        return <Text>No email provided.</Text>; 
    }

    // Handle click to view detailed request
    const handleViewDetails = (item) => {
        navigation.navigate('manageRequest', { email, request: item });
    };

    // Render each item in the list
    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Image
                source={require("../../assets/images/file-icon.png")}
                style={styles.fileIcon}
            />
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemSubtitle}>Type: {item.type}</Text>
                <Text style={styles.itemSubtitle}>Pickup: {item.pickupDate}</Text>
                <Text style={styles.itemStatus}>Request Status: {item.status || "Pending"}</Text>
            </View>
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => handleViewDetails(item)}>
                    <Image
                        source={require("../../assets/images/view-icon.png")}
                        style={styles.actionIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.TopBarContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={34} color="white" />
                </TouchableOpacity>
                <Text style={styles.TopBar}>My Request</Text>
            </View>
            <View style={styles.formbackground}>
                {loading ? (
                    // Show a loading state while fetching data
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading requests...</Text>
                    </View>
                ) : requests.length === 0 ? (
                    // Show a message when there are no requests
                    <View style={styles.noRequestsContainer}>
                        <Text style={styles.noRequestsText}>No requests yet.</Text>
                    </View>
                ) : (
                    // Display the list of requests
                    <FlatList
                        data={requests}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContentContainer}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#6EC6B2',
    },
    TopBarContainer: {
        backgroundColor: '#6EC6B2',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        minHeight: 190,
    },
    TopBar: {
        fontSize: 36,
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    formbackground:{
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: '#6EC6B2',
        borderWidth: 2,
        padding: 15,
        borderRadius: 15,
        margin: 17,
        top: 35,
        backgroundColor: '#E6E6E6',
        borderTopLeftRadius:10
    },
    fileIcon: {
        width: 45,
        height: 45,
        marginRight: 15,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemSubtitle: {
        fontSize: 15,
        color: "black",
        fontWeight: '590',
        marginLeft: 14,
    },
    itemStatus: {
        top: 10,
        fontSize: 14,
        color: "#1C751C",
        fontWeight: 'bold',
        marginLeft: 14,
    },
    actionIcons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 70,
    },
    actionIcon: {
        width: 33,
        height: 33,
        marginLeft: 34,
    },
    listContentContainer: {
        paddingBottom: 50,
        top:18
    },
    noRequestsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top:150
    },
    noRequestsText: {
        fontSize: 18,
        color: 'black',
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: 'gray',
    },
});

export default MyRequest;
