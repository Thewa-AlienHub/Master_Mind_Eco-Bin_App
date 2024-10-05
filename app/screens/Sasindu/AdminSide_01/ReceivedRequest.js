import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, StatusBar, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../../config/DB_config';
import colors from '../../../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, updateDoc } from 'firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

function ReceivedRequest() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('All');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchRequests = async () => {
            const querySnapshot = await getDocs(collection(DB, "recycleRequest"));
            const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                isAccepted: doc.data().status === "Accepted",
                isRejected: doc.data().status === "Rejected"
            }));
            setRequests(data);
        };

        fetchRequests();
    }, []);

    const handleViewDetails = (item) => {
        navigation.navigate('receivedRequestView', { request: item });
    };

    const handleAccept = async (item) => {
        try {
            const requestDoc = doc(DB, "recycleRequest", item.id);
            await updateDoc(requestDoc, { status: "Accepted" });
            setRequests(prevRequests =>
                prevRequests.map(req =>
                    req.id === item.id ? { ...req, isAccepted: true, isRejected: false } : req
                )
            );
            Alert.alert("Request accepted successfully!");
        } catch (error) {
            console.error("Error updating document: ", error);
            Alert.alert("Failed to accept the request");
        }
    };

    const handleReject = async (item) => {
        try {
            const requestDoc = doc(DB, "recycleRequest", item.id);
            await updateDoc(requestDoc, { status: "Rejected" });
            setRequests(prevRequests =>
                prevRequests.filter(req => req.id !== item.id)
            );
            Alert.alert("Request rejected successfully!");
        } catch (error) {
            console.error("Error updating document: ", error);
            Alert.alert("Failed to reject the request");
        }
    };

    const filteredRequests = requests.filter(item => {
        if (filter === 'Accepted') return item.isAccepted;
        if (filter === 'Rejected') return item.isRejected;
        if (filter === 'Pending') return !item.isAccepted && !item.isRejected;
        return true;
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.row, item.isRejected && styles.rejectedRow]} onPress={() => handleViewDetails(item)}>
            <Text style={[styles.cell, item.isRejected && styles.rejectedText]}>{item.type}</Text>
            <Text style={[styles.cell, item.isRejected && styles.rejectedText]}>{item.pickupDate}</Text>

            <View style={styles.buttonCell}>
                {!item.isAccepted && !item.isRejected && (
                    <>
                        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item)}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item)}>
                            <Text style={styles.buttonText}>Reject</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    // PDF Generation Function
    const fetchAndGeneratePDF = async () => {
        try {
            const html = `<html>
                                <head>
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            margin: 0;
                                            padding: 20px;
                                            background-color: #f4f4f4;
                                        }
                                        h1 {
                                            text-align: center;
                                            color: #6EC6B2;
                                            margin-bottom: 10px;
                                        }
                                        h2 {
                                            text-align: center;
                                            color: #333;
                                            margin-top: 0;
                                        }
                                        .date {
                                            text-align: right;
                                            color: #333;
                                            font-size: 14px;
                                            margin-top: -30px; /* Adjust positioning */
                                            margin-bottom: 20px; /* Space below the date */
                                            margin-right: 20px; /* Right margin */
                                        }
                                        table {
                                            width: 100%;
                                            border-collapse: collapse;
                                            margin-top: 20px;
                                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                                            background-color: #fff;
                                        }
                                        th, td {
                                            border: 1px solid #ddd;
                                            padding: 12px;
                                            text-align: left;
                                        }
                                        th {
                                            background-color: #6EC6B2;
                                            color: white;
                                        }
                                        tr:nth-child(even) {
                                            background-color: #f9f9f9;
                                        }
                                        tr:hover {
                                            background-color: #f1f1f1;
                                        }
                                        .footer {
                                            margin-top: 30px;
                                            text-align: center;
                                            font-size: 12px;
                                            color: #666;
                                        }
                                        .rejected {
                                            color: red; /* Set rejected status text color to red */
                                        }
                                        .accepted {
                                            color: blue; /* Set accepted status text color to blue */
                                        }
                                    </style>
                                </head>
                                <body>
                                    <h1>EcoBin (Pvt) Ltd</h1>
                                    <h2>Smart Waste Management for a Greener Future</h2><br/>
                                    <h2>Recycle Requests Report</h2><br />
                                    <div class="date">Date : ${new Date().toLocaleDateString()}</div> <!-- Current date -->
                                    <table>
                                        <tr>
                                            <th width=30%>House ID</th>
                                            <th width=10>Type</th>
                                            <th >Pickup Date</th>
                                            <th>Status</th>
                                        </tr>
                                        ${filteredRequests.map(request => `
                                            <tr>
                                                <td>${request.selectedNickname}</td>
                                                <td>${request.type}</td>
                                                <td>${request.pickupDate}</td>
                                                <td class="${request.isAccepted ? 'accepted' : request.isRejected ? 'rejected' : ''}">
                                                    ${request.isAccepted ? "Accepted" : request.isRejected ? "Rejected" : "Pending"}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </table>
                                    <div class="footer">
                                        © ${new Date().getFullYear()} EcoBin. All rights reserved.
                                    </div>
                                </body>
                            </html>
                        `;
        
            const { uri } = await Print.printToFileAsync({ html });

            // Share the PDF
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('An error occurred while generating the PDF. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.TopBarContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={34} color="white" />
                </TouchableOpacity>
                <Text style={styles.TopBar}>Received Recycle Request</Text>
            </View>
            <View style={styles.formbackground}>
            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                {['All Request', 'Accepted', 'Rejected', 'Pending'].map(option => (
                    <TouchableOpacity key={option} style={[styles.filterButton, filter === option && styles.activeFilter]} onPress={() => setFilter(option)}>
                        <Text style={styles.filterText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Table Header */}
            <View style={styles.header}>
                <Text style={styles.headerCell}>Recycle Type</Text>
                <Text style={styles.headerCell}>Pickup Date</Text>
                {/* Button to generate PDF */}
                <TouchableOpacity onPress={fetchAndGeneratePDF} style={styles.downloadButton}>
                    <Image
                        source={require("../../../assets/images/download-icon.png")}
                        style={styles.download}
                    />
                </TouchableOpacity>
            </View>

            {/* List of Requests */}
            <FlatList
                data={filteredRequests}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContentContainer}
            />
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
        top: 8,
        fontSize: 28,
        textAlign: 'center',
        color: colors.white,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#6EC6B2',
    },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#C2C2C2',
    },
    activeFilter: {
        backgroundColor: '#6EC6B2',
    },
    filterText: {
        color: 'black',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: "row",
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#6EC6B2',
        paddingVertical: 15,
        marginHorizontal: 6,
        borderRadius: 5,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        fontSize: 17,
        
    },
    row: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#DFDFDF',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 3,
        borderColor: '#6EC6B2',
    },
    download: {
        width: 30,
        height: 30,
        marginRight:8
    },
    formbackground:{
        backgroundColor:'white',
        flex:1,
        borderTopLeftRadius:60,
        borderTopRightRadius:60,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 0.7 : 10,
    },
    rejectedRow: {
        backgroundColor: '#ffe6e6',
    },
    rejectedText: {
        color: 'red',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        color: "black",
        fontWeight: '600',
    },
    buttonCell: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    acceptButton: {
        backgroundColor: '#6EC6B2',
        padding: 8,
        borderRadius: 5,
        marginRight: 5,
    },
    rejectButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    listContentContainer: {
        paddingBottom: 50,
    },
});

export default ReceivedRequest;
