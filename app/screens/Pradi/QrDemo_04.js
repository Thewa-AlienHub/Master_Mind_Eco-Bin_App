import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

const QrDemo = () => {
  return (
    <Text style={styles.subtitle}>
      Place qr code inside the frame to scan, please avoid shaking to get
      results quickly
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
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
  subtitle: {
    fontSize: 14,
    color: "#a1a1a1",
    textAlign: "center",
    marginBottom: 30,
  },
});

export default QrDemo;
