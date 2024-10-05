import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../Utils/colors";

const SuccessScreen_03 = () => {
  const navigation = useNavigation();

  const handleOk = () => {
    navigation.navigate('ReportedList_03_Main', { refresh: true });
  
  };

  return (
    <View style={styles.container}>
      {/* Robot and Garbage Bin Image */}
      <Image
        source={require("../../assets/binLogo.png")}
        style={styles.robotImage}
      />

      {/* Success Message Container */}
      <View style={styles.messageContainer}>
        <View style={styles.checkIconContainer}>
          {/* Check Icon */}
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        {/* Success Text */}
        <Text style={styles.successText}>
          Team Asigned Successfully Done !
        </Text>

        {/* OK Button */}
        <TouchableOpacity style={styles.okButton} onPress={handleOk}>
          <Text style={styles.okButtonText}>Done</Text>
        </TouchableOpacity>

        <Text style={styles.qouteText}>Recycle More, Earn More!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  robotImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  messageContainer: {
    width: "80%",
    backgroundColor: colors.lprimary,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderColor: "#6EC6B2",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  checkIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 70,
    color: colors.white,
  },
  successText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  qouteText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  okButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  okButtonText: {
    color: colors.white,
    fontSize: 24,
  },
});

export default SuccessScreen_03;
