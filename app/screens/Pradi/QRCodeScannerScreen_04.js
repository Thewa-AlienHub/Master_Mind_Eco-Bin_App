import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner"; // Import BarCodeScanner from Expo
import colors from "../../Utils/colors";

const QRCodeScannerScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false); // State to toggle scanning
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null); // State to hold scanned data
  const qrLock = useRef(false);

  // Ask for camera permission when the component is mounted
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync(); // Correct method for requesting camera permissions
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = () => {
    setScanning(true); // Start scanning
    setScanned(false); // Reset scanned state
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData({ type, data }); // Store scanned data
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
        Place qr code inside the frame to scan, please avoid shaking to get
        results quickly
      </Text>

      <View style={styles.qrScanner}>
        {scanning ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.cameraView}
            ratio="16:9"
          >
            {/* The overlay to show the QR scanning area */}
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

      {/* Button to start the scanning process */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScan}
        disabled={scanning}
      >
        <Text style={styles.scanButtonText}>Start Scan</Text>
      </TouchableOpacity>

      {scanned && (
        <View style={styles.scannedDataContainer}>
          <Text style={styles.scannedText}>
            Bar code with type {scannedData.type} and data {scannedData.data}{" "}
            has been scanned!
          </Text>
          <TouchableOpacity onPress={() => setScanned(false)}>
            <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

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
  scannedDataContainer: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  scannedText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default QRCodeScannerScreen;
