import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import colors from "../../Utils/colors";
import { doc, updateDoc, Timestamp } from "firebase/firestore"; // Firestore imports
import { DB } from "../../config/DB_config"; // Firestore configuration

const QRCodeScannerScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const qrLock = useRef(false);

  // Ask for camera permission when the component is mounted
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = () => {
    setScanning(true);
    setScanned(false);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return; // Prevent multiple scans
    setScanned(true);

    // Extract the actual document ID from the scanned data
    const docID = extractDocID(data);

    if (docID) {
      // Only proceed with the update if docID is valid
      updateFirestoreAfterScan(docID);
    } else {
      Alert.alert("Error", "Invalid Document ID. Please try again.", [
        { text: "OK", onPress: () => resetScanning() }
      ]);
    }
  };

  const extractDocID = (data) => {
    try {
      const docID = data.split(",")[0].split(":")[1].trim(); // Extracting the doc ID part
      console.log("Extracted Doc ID:", docID); // Log the extracted ID
      return docID || null; // Return null if docID is empty
    } catch (error) {
      console.error("Error extracting Doc ID:", error);
      return null;
    }
  };

  // Function to update Firestore after scanning a QR code
  const updateFirestoreAfterScan = async (docID) => {
    if (!docID) {
      console.error("Invalid Doc ID, skipping Firestore update.");
      Alert.alert("Error", "Invalid Document ID. Please try again.", [
        { text: "OK", onPress: () => resetScanning() }
      ]);
      return;
    }

    try {
      console.log("Updating Firestore for Doc ID:", docID);
      const timestamp = Timestamp.now(); // Current timestamp

      // Update CollectingList collection
      const collectingListDocRef = doc(DB, "CollectingList", docID);
      await updateDoc(collectingListDocRef, {
        CollectingStatus: "Completed",
        LastCollectedDate: timestamp,
      });
      console.log("Updated CollectingList successfully");

      // Update GarbageBins collection
      const garbageBinDocRef = doc(DB, "GarbageBins", docID);
      await updateDoc(garbageBinDocRef, {
        CollectingStatus: "Pending", // change to collected
        LastCollectedDate: timestamp,
      });
      console.log("Updated GarbageBins successfully");

      Alert.alert("Success", `Document with ID ${docID} has been updated.`, [
        { text: "OK", onPress: () => resetScanning() }
      ]);
    } catch (error) {
      console.error("Error updating Firestore:", error);
      Alert.alert("Error", `Failed to update document with ID ${docID}.`, [
        { text: "OK", onPress: () => resetScanning() }
      ]);
    }
  };

  const resetScanning = () => {
    setScanning(false);
    setScanned(false);
  };

  const handleHistory = () => {
    navigation.navigate("History");
  };

  const handleSubmit = async () => {
    try {
      navigation.navigate("RecycleForm");
    } catch (error) {
      console.error("Error Scanning code: ", error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Button with PNG Icon to navigate to Scan History */}
      <TouchableOpacity style={styles.historyButton} onPress={handleHistory}>
        <Image
          source={require("../../assets/history-icon.png")}
          style={styles.historyIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Scan QR code</Text>
      <Text style={styles.subtitle}>
        Place QR code inside the frame to scan, please avoid shaking to get results quickly.
      </Text>

      <View style={styles.qrScanner}>
        {scanning ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.cameraView}
            ratio="16:9"
          >
            <View style={styles.qrScannerOverlay}>
              <Image
                source={require("../../assets/qr-code.png")}
                style={styles.qrImage}
              />
            </View>
          </BarCodeScanner>
        ) : (
          <View style={styles.qrPlaceholder}>
            <Image
              source={require("../../assets/qr-code.png")}
              style={styles.qrImage}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScan}
        disabled={scanning}
      >
        <Text style={styles.scanButtonText}>Start Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.requestButton} onPress={handleSubmit}>
        <Text style={styles.requestButtonText}>Recycle Collection Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  historyButton: {
    position: "absolute",
    top: 70,
    right: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  historyIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#a1a1a1",
    textAlign: "center",
    marginBottom: 30,
  },
  qrScanner: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: "#E6F4F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  qrImage: {
    width: 150,
    height: 150,
    tintColor: colors.primary, // Adjust the color to match the theme
  },
  cameraView: {
    width: 200,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
  },
  qrScannerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginTop: 25,
    borderRadius: 25,
    alignItems: "center",
  },
  requestButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QRCodeScannerScreen;
