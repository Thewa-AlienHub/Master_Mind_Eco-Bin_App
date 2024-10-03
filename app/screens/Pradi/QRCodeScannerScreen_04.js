import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera"; // Import Camera from Expo
import colors from "../assets/colors";
import MenuButton from "./Components/MenuButton";

const QRCodeScannerScreen = ({ drawer }) => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false); // State to toggle scanning
  const [scanned, setScanned] = useState(false);
  const qrLock = useRef(false);

  // Ask for camera permission when the component is mounted
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // Correct method for requesting camera permissions
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      navigation.navigate("Index");
    } catch (error) {
      console.error("Error Scanning code: ", error);
    }
  };

  const handleScan = async () => {
    navigation.navigate("QrDemo");
  };

  const handleHistory = () => {
    navigation.navigate("History");
  };

  return (
    <View style={styles.container}>
      <MenuButton
        color={colors.primary}
        onPress={() => drawer.current.openDrawer()}
      />
      {/* Button with PNG Icon to navigate to Scan History */}
      <TouchableOpacity style={styles.historyButton} onPress={handleHistory}>
        <Image
          source={require("../assets/images/history-icon.png")}
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
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
            style={styles.cameraView}
            ratio="16:9"
          >
            {/* The overlay to show the QR scanning area */}
            <View style={styles.qrScannerOverlay}>
              <Image
                source={require("../assets/images/qr-code.png")}
                style={styles.qrImage}
              />
            </View>
          </Camera>
        ) : (
          <View style={styles.qrPlaceholder}>
            <Image
              source={require("../assets/images/qr-code.png")}
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
