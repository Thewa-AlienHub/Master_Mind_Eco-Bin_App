import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

function QrCodeHome({route,navigation}) {
    const {docId, email} = route.params;
    const qrCodeRef = useRef(null);
    const qrData = `Doc ID: ${docId}, Email: ${email}`; // Replace with your actual data for QR code generation

    // Function to save the QR code with background and margin
    const saveQrCodeToDownloads = async () => {
        try {
            // Capture the QR code view
            const uri = await captureRef(qrCodeRef, {
                format: 'png',
                quality: 1,
            });

            console.log("Captured URI:", uri); // Log the captured URI for debugging

            if (!uri) {
                Alert.alert("Error", "Failed to capture QR code image.");
                return;
            }

            // Read the image file from the captured URI
            const base64Data = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log("Base64 Data:", base64Data); // Log the Base64 data for debugging

            if (!base64Data) {
                Alert.alert("Error", "Failed to get Base64 data from QR code image.");
                return;
            }

            // Save to cache directory
            const fileUri = FileSystem.cacheDirectory + 'QRCode.png';

            // Write Base64 data to file
            await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

            // Ask for permission to access the Downloads folder
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (permissions.granted) {
                // Save the file to the Downloads folder
                const downloadUri = await FileSystem.StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    'QRCode.png',
                    'image/png'
                );

                await FileSystem.writeAsStringAsync(downloadUri, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                Alert.alert(`QR code saved to Downloads folder!`);
            } else {
                Alert.alert('Permission to access the Downloads folder was denied.');
            }
        } catch (error) {
            console.error("Error saving QR code:", error);
            Alert.alert("Error", "Failed to save QR code.");
        }
    };

    // Function to share the QR code
    const shareQrCode = async () => {
        try {
            // Capture the QR code view
            const uri = await captureRef(qrCodeRef, {
                format: 'png',
                quality: 1,
            });

            console.log("Captured URI for sharing:", uri); // Log the captured URI for debugging

            if (!uri) {
                Alert.alert("Error", "Failed to capture QR code image.");
                return;
            }

            // Read the image file from the captured URI
            const base64Data = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log("Base64 Data for sharing:", base64Data); // Log the Base64 data for debugging

            if (!base64Data) {
                Alert.alert("Error", "Failed to get Base64 data from QR code image.");
                return;
            }

            // Save to cache directory
            const fileUri = FileSystem.cacheDirectory + 'QRCode.png';

            // Write Base64 data to file
            await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

            // Check if sharing is available
            if (await Sharing.isAvailableAsync()) {
                // Share the QR code image
                await Sharing.shareAsync(fileUri, { mimeType: 'image/png' });
            } else {
                Alert.alert("Error", "Sharing is not available on this device.");
            }
        } catch (error) {
            console.error("Error sharing QR code:", error);
            Alert.alert("Error", "Failed to share QR code.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your QR Code</Text>
            <View style={styles.qrCodeContainer} ref={qrCodeRef}>
                <ImageBackground
                    style={styles.qrCodeBackground}
                >
                    <QRCode
                        value={qrData}
                        size={200}
                        backgroundColor='white' // Background color of QR code
                        color='black' // Color of QR code
                    />
                </ImageBackground>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveQrCodeToDownloads}>
                <Text style={styles.buttonText}>Save to Downloads</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.shareButton} onPress={shareQrCode}>
                <Text style={styles.buttonText}>Share QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={()=>navigation.navigate('userProfile',{email:email})}>
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
        </View>
    );
}

export default QrCodeHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    qrCodeContainer: {
        marginBottom: 30,
        padding: 20,
        backgroundColor: 'transparent', // Make background transparent for capturing
        borderRadius: 10,
        elevation: 5, // Add shadow for better UI
    },
    qrCodeBackground: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, // Margin around QR code
        backgroundColor: 'white', // Background color for QR code
        borderRadius: 10,
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginBottom: 15,
    },
    shareButton: {
        backgroundColor: '#00CE5E',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
