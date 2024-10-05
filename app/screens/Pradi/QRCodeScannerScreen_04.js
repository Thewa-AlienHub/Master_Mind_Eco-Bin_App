import React, { useState, useRef, useEffect, useCallback  } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import colors from "../../Utils/colors";
import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore"; // Firestore imports
import { DB } from "../../config/DB_config"; // Firestore configuration

const QRCodeScannerScreen = ({ route }) => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const qrLock = useRef(false);
  const [isInRecycleRequest, setIsInRecycleRequest] = useState(false);
  const [extractedDocID, setExtractedDocID] = useState(null); 
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    
    // Show alert if alertMessage exists in route params
    if (route.params?.alertMessage) {
      Alert.alert("Success", route.params.alertMessage, [
        { text: "OK" },
      ]);
    }

    // Check if disableButton is true and set button state
    if (route.params?.disableButton) {
      setButtonDisabled(true);
    }
  }, [route.params]);

  const handleScan = () => {
    setScanning(true);
    setScanned(false);
  };

  const handleBarCodeScanned = useCallback(({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    const docID = extractDocID(data);
    
    if (docID) {
        setExtractedDocID(docID); 
        updateFirestoreAfterScan(docID);
    } else {
        Alert.alert("Error", "Invalid Document ID. Please try again.", [{ text: "OK", onPress: resetScanning }]);
    }
}, [scanned]);

  const extractDocID = (data) => {
    try {
      const docID = data.split(",")[0].split(":")[1].trim();
      console.log("Extracted Doc ID:", docID);
      return docID || null;
    } catch (error) {
      console.error("Error extracting Doc ID:", error);
      return null;
    }
  };

  const updateFirestoreAfterScan = async (docID) => {
    if (!docID) {
      Alert.alert("Error", "Invalid Document ID. Please try again.", [
        { text: "OK", onPress: resetScanning }
      ]);
      return;
    }

    try {
      console.log("Checking Firestore for Doc ID:", docID);
      const recycleRequestDocRef = doc(DB, "recycleRequest", docID);
      const docSnap = await getDoc(recycleRequestDocRef);

      // Set button color based on document existence
      const exists = docSnap.exists();
      setIsInRecycleRequest(exists);

      if (!exists) {
        Alert.alert("Error", "Document does not exist in recycleRequest.", [
          { text: "OK", onPress: resetScanning }
        ]);
        return; // Exit if the document does not exist
      }

      console.log("Updating Firestore for Doc ID:", docID);
      const timestamp = Timestamp.now();

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
        CollectingStatus: "Pending",
        LastCollectedDate: timestamp,
      });
      console.log("Updated GarbageBins successfully");

      // Success alert
      Alert.alert("Success", `Document with ID ${docID} has been updated.`, [
        {
          text: "OK",
          onPress: () => {
            // Do not reset isInRecycleRequest here
            resetScanning(); // Reset scanning state
          }
        }
      ]);
    } catch (error) {
      console.error("Error updating Firestore:", error);
      Alert.alert("Error", `Failed to update document with ID ${docID}.`, [
        { text: "OK", onPress: resetScanning }
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
      console.log("Navigating to RecycleForm with Doc ID:", extractedDocID);
      navigation.navigate("RecycleForm", { docID: extractedDocID }); // Pass docID to RecycleForm
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

      <TouchableOpacity
        style={[styles.requestButton, isInRecycleRequest ? styles.redButton : null]}
        onPress={handleSubmit}
        disabled={!isInRecycleRequest} // Disable button if not in recycle request
      >
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
  redButton: {
    backgroundColor: "red", // Change to your desired red color
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
