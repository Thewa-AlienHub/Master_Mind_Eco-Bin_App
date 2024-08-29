import React, { useState, useEffect } from "react";
import { Text, View, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { firebaseConfig } from '../services/firebaseConfig';

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert("QR Code Scanned", `Type: ${type}\nData: ${data}`);

    const projectId = firebaseConfig.projectId;

    // Fetch user data and send notification
    fetch(`https://us-central1-${projectId}.cloudfunctions.net/yourFunction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qrData: data }),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert("Success", "Notification sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}
